import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

const WRIST = 0;
const THUMB_CMC = 1;
const INDEX_MCP = 5;
const MIDDLE_MCP = 9;
const RING_MCP = 13;
const PINKY_MCP = 17;

/** Frozen identifier for annotation/ROI compatibility checks. */
export const PALM_ROI_ALGORITHM_VERSION = "adaptive-roi-v1";

export interface PalmRoiConfig {
  horizontalPaddingRatio: number;
  topPaddingRatio: number;
  bottomPaddingRatio: number;
  minimumWidthPixels: number;
  minimumHeightPixels: number;
}

export const DEFAULT_PALM_ROI_CONFIG: PalmRoiConfig = {
  horizontalPaddingRatio: 0.3,
  topPaddingRatio: 0.3,
  bottomPaddingRatio: 0.22,
  minimumWidthPixels: 80,
  minimumHeightPixels: 96,
};

export interface Point {
  x: number;
  y: number;
}

export interface PalmRoiGeometry {
  centerX: number;
  centerY: number;
  rotationRadians: number;
  rotationDegrees: number;
  rotatedBounds: {
    minX: number;
    minY: number;
    maxX: number;
    maxY: number;
  };
  outputWidth: number;
  outputHeight: number;
  palmWidth: number;
  palmHeight: number;
  sourceCorners: Point[];
}

export interface PalmInteriorGeometry {
  polygon: Point[];
  width: number;
  height: number;
  areaRatio: number;
  reliable: boolean;
  reason: string | null;
}

export type PalmRoiFailureCategory =
  | "invalid-input"
  | "invalid-landmarks"
  | "palm-too-small"
  | "padding-out-of-frame"
  | "core-out-of-frame";

export type PalmRoiMethod = "baseline" | "adaptive-rotated" | "fallback-axis-aligned";

export interface PalmRoiDiagnostics {
  method: PalmRoiMethod;
  frameWidth: number;
  frameHeight: number;
  rotationDegrees: number;
  landmarks: Point[];
  candidateCorners: Point[];
  outsideCornerIndices: number[];
  paddingScale: number;
}

export type PalmRoiGeometryResult =
  | { ok: true; geometry: PalmRoiGeometry }
  | {
      ok: false;
      reason: string;
      category: PalmRoiFailureCategory;
      diagnostics?: PalmRoiDiagnostics;
    };

export type PalmRoiCandidateResult =
  | {
      ok: true;
      method: Exclude<PalmRoiMethod, "baseline">;
      geometry: PalmRoiGeometry;
      diagnostics: PalmRoiDiagnostics;
    }
  | {
      ok: false;
      reason: string;
      category: PalmRoiFailureCategory;
      diagnostics?: PalmRoiDiagnostics;
    };

function rotatePoint(point: Point, radians: number): Point {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return {
    x: point.x * cosine - point.y * sine,
    y: point.x * sine + point.y * cosine,
  };
}

export function transformSourcePointToPalmRoi(
  point: Point,
  geometry: PalmRoiGeometry,
): Point {
  const rotated = rotatePoint(
    { x: point.x - geometry.centerX, y: point.y - geometry.centerY },
    geometry.rotationRadians,
  );
  return {
    x: rotated.x - geometry.rotatedBounds.minX,
    y: rotated.y - geometry.rotatedBounds.minY,
  };
}

function polygonArea(points: Point[]): number {
  return Math.abs(points.reduce((total, point, index) => {
    const next = points[(index + 1) % points.length];
    return total + point.x * next.y - next.x * point.y;
  }, 0)) / 2;
}

/** Builds a conservative palm-core polygon; it intentionally excludes fingers. */
export function createPalmInteriorGeometry(
  landmarks: NormalizedLandmark[],
  frameWidth: number,
  frameHeight: number,
  roiGeometry: PalmRoiGeometry,
): PalmInteriorGeometry {
  const required = [WRIST, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP];
  if (!required.every((index) => isValidLandmark(landmarks[index]))) {
    return { polygon: [], width: roiGeometry.outputWidth, height: roiGeometry.outputHeight, areaRatio: 0, reliable: false, reason: "Landmark inti telapak tidak valid." };
  }
  const sourcePoint = (index: number): Point => ({
    x: landmarks[index].x * frameWidth,
    y: landmarks[index].y * frameHeight,
  });
  const wrist = transformSourcePointToPalmRoi(sourcePoint(WRIST), roiGeometry);
  const indexMcp = transformSourcePointToPalmRoi(sourcePoint(INDEX_MCP), roiGeometry);
  const middleMcp = transformSourcePointToPalmRoi(sourcePoint(MIDDLE_MCP), roiGeometry);
  const ringMcp = transformSourcePointToPalmRoi(sourcePoint(RING_MCP), roiGeometry);
  const pinkyMcp = transformSourcePointToPalmRoi(sourcePoint(PINKY_MCP), roiGeometry);
  const across = { x: pinkyMcp.x - indexMcp.x, y: pinkyMcp.y - indexMcp.y };
  const wristNearIndex = { x: wrist.x - across.x * 0.42, y: wrist.y - across.y * 0.42 };
  const wristNearPinky = { x: wrist.x + across.x * 0.42, y: wrist.y + across.y * 0.42 };
  const polygon = [indexMcp, middleMcp, ringMcp, pinkyMcp, wristNearPinky, wristNearIndex];
  const areaRatio = polygonArea(polygon) / Math.max(1, roiGeometry.outputWidth * roiGeometry.outputHeight);
  const inside = polygon.every((point) =>
    Number.isFinite(point.x) && Number.isFinite(point.y) &&
    point.x >= -roiGeometry.outputWidth * 0.1 && point.x <= roiGeometry.outputWidth * 1.1 &&
    point.y >= -roiGeometry.outputHeight * 0.1 && point.y <= roiGeometry.outputHeight * 1.1,
  );
  const reliable = inside && areaRatio >= 0.18 && areaRatio <= 0.8;
  return {
    polygon,
    width: roiGeometry.outputWidth,
    height: roiGeometry.outputHeight,
    areaRatio,
    reliable,
    reason: reliable ? null : `Mask palm-core tidak andal (rasio area ${(areaRatio * 100).toFixed(1)}%).`,
  };
}

function inverseRotatePoint(point: Point, radians: number): Point {
  return rotatePoint(point, -radians);
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function average(points: Point[]): Point {
  return {
    x: points.reduce((total, point) => total + point.x, 0) / points.length,
    y: points.reduce((total, point) => total + point.y, 0) / points.length,
  };
}

function isValidLandmark(landmark: NormalizedLandmark | undefined): landmark is NormalizedLandmark {
  return Boolean(
    landmark &&
      Number.isFinite(landmark.x) &&
      Number.isFinite(landmark.y) &&
      landmark.x >= 0 &&
      landmark.x <= 1 &&
      landmark.y >= 0 &&
      landmark.y <= 1,
  );
}

function cornersForBounds(
  bounds: PalmRoiGeometry["rotatedBounds"],
  center: Point,
  rotationRadians: number,
): Point[] {
  return [
    { x: bounds.minX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.minY },
    { x: bounds.maxX, y: bounds.maxY },
    { x: bounds.minX, y: bounds.maxY },
  ].map((corner) => {
    const sourcePoint = inverseRotatePoint(corner, rotationRadians);
    return { x: sourcePoint.x + center.x, y: sourcePoint.y + center.y };
  });
}

function getOutsideCornerIndices(
  corners: Point[],
  frameWidth: number,
  frameHeight: number,
): number[] {
  return corners.flatMap((corner, index) =>
    corner.x < 0 ||
    corner.x > frameWidth ||
    corner.y < 0 ||
    corner.y > frameHeight
      ? [index]
      : [],
  );
}

function buildGeometry(
  center: Point,
  rotationRadians: number,
  bounds: PalmRoiGeometry["rotatedBounds"],
  palmWidth: number,
  palmHeight: number,
): PalmRoiGeometry {
  return {
    centerX: center.x,
    centerY: center.y,
    rotationRadians,
    rotationDegrees: (rotationRadians * 180) / Math.PI,
    rotatedBounds: bounds,
    outputWidth: Math.ceil(bounds.maxX - bounds.minX),
    outputHeight: Math.ceil(bounds.maxY - bounds.minY),
    palmWidth,
    palmHeight,
    sourceCorners: cornersForBounds(bounds, center, rotationRadians),
  };
}

/** Milestone 3A baseline, retained as the live-capture implementation. */
export function calculatePalmRoiGeometry(
  landmarks: NormalizedLandmark[],
  frameWidth: number,
  frameHeight: number,
  config: PalmRoiConfig = DEFAULT_PALM_ROI_CONFIG,
): PalmRoiGeometryResult {
  if (frameWidth <= 0 || frameHeight <= 0 || landmarks.length < 18) {
    return { ok: false, category: "invalid-input", reason: "Dimensi frame atau landmark telapak tidak valid." };
  }

  const requiredIndices = [WRIST, THUMB_CMC, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP];
  if (!requiredIndices.every((index) => isValidLandmark(landmarks[index]))) {
    return { ok: false, category: "invalid-landmarks", reason: "Landmark telapak berada di luar batas frame." };
  }

  const point = (index: number): Point => ({
    x: landmarks[index].x * frameWidth,
    y: landmarks[index].y * frameHeight,
  });
  const wrist = point(WRIST);
  const thumbCmc = point(THUMB_CMC);
  const indexMcp = point(INDEX_MCP);
  const middleMcp = point(MIDDLE_MCP);
  const ringMcp = point(RING_MCP);
  const pinkyMcp = point(PINKY_MCP);
  const mcpCenter = average([indexMcp, middleMcp, ringMcp, pinkyMcp]);
  const center = average([wrist, mcpCenter]);
  const palmAxisAngle = Math.atan2(mcpCenter.y - wrist.y, mcpCenter.x - wrist.x);
  const rotationRadians = -Math.PI / 2 - palmAxisAngle;
  const palmWidth = distance(indexMcp, pinkyMcp);
  const palmHeight = distance(wrist, middleMcp);

  if (palmWidth < config.minimumWidthPixels || palmHeight < config.minimumHeightPixels) {
    return { ok: false, category: "palm-too-small", reason: "Area telapak terlalu kecil untuk diekstrak." };
  }

  const palmPoints = [wrist, thumbCmc, indexMcp, middleMcp, ringMcp, pinkyMcp];
  const rotated = palmPoints.map((palmPoint) =>
    rotatePoint({ x: palmPoint.x - center.x, y: palmPoint.y - center.y }, rotationRadians),
  );
  const xValues = rotated.map((palmPoint) => palmPoint.x);
  const yValues = rotated.map((palmPoint) => palmPoint.y);
  const horizontalPadding = palmWidth * config.horizontalPaddingRatio;
  const bounds = {
    minX: Math.min(...xValues) - horizontalPadding,
    maxX: Math.max(...xValues) + horizontalPadding,
    minY: Math.min(...yValues) - palmHeight * config.topPaddingRatio,
    maxY: Math.max(...yValues) + palmHeight * config.bottomPaddingRatio,
  };
  const geometry = buildGeometry(center, rotationRadians, bounds, palmWidth, palmHeight);
  const outside = getOutsideCornerIndices(geometry.sourceCorners, frameWidth, frameHeight);
  if (outside.length > 0) {
    return {
      ok: false,
      category: "padding-out-of-frame",
      reason: `Padding ROI keluar dari frame pada ${outside.length} sudut.`,
      diagnostics: {
        method: "baseline",
        frameWidth,
        frameHeight,
        rotationDegrees: geometry.rotationDegrees,
        landmarks: palmPoints,
        candidateCorners: geometry.sourceCorners,
        outsideCornerIndices: outside,
        paddingScale: 1,
      },
    };
  }
  return { ok: true, geometry };
}

/**
 * Development candidate: tighter palm anatomy, adaptive padding, then a clearly
 * labelled axis-aligned fallback when a complete rotated crop cannot fit.
 */
export function calculateAdaptivePalmRoiGeometry(
  landmarks: NormalizedLandmark[],
  frameWidth: number,
  frameHeight: number,
  config: PalmRoiConfig = DEFAULT_PALM_ROI_CONFIG,
): PalmRoiCandidateResult {
  if (frameWidth <= 0 || frameHeight <= 0 || landmarks.length < 18) {
    return { ok: false, category: "invalid-input", reason: "Dimensi frame atau landmark telapak tidak valid." };
  }
  const requiredIndices = [WRIST, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP];
  if (!requiredIndices.every((index) => isValidLandmark(landmarks[index]))) {
    return { ok: false, category: "invalid-landmarks", reason: "Landmark inti telapak berada di luar batas frame." };
  }

  const point = (index: number): Point => ({
    x: landmarks[index].x * frameWidth,
    y: landmarks[index].y * frameHeight,
  });
  const wrist = point(WRIST);
  const mcpPoints = [point(INDEX_MCP), point(MIDDLE_MCP), point(RING_MCP), point(PINKY_MCP)];
  const corePoints = [wrist, ...mcpPoints];
  const mcpCenter = average(mcpPoints);
  const center = average([wrist, mcpCenter]);
  const palmWidth = distance(mcpPoints[0], mcpPoints[3]);
  const palmHeight = distance(wrist, mcpPoints[1]);
  if (palmWidth < config.minimumWidthPixels || palmHeight < config.minimumHeightPixels) {
    return { ok: false, category: "palm-too-small", reason: "Area telapak terlalu kecil untuk diekstrak." };
  }

  const palmAxisAngle = Math.atan2(mcpCenter.y - wrist.y, mcpCenter.x - wrist.x);
  const rotationRadians = -Math.PI / 2 - palmAxisAngle;
  const rotated = corePoints.map((palmPoint) =>
    rotatePoint({ x: palmPoint.x - center.x, y: palmPoint.y - center.y }, rotationRadians),
  );
  const xValues = rotated.map((palmPoint) => palmPoint.x);
  const yValues = rotated.map((palmPoint) => palmPoint.y);
  const coreBounds = {
    minX: Math.min(...xValues),
    minY: Math.min(...yValues),
    maxX: Math.max(...xValues),
    maxY: Math.max(...yValues),
  };
  const preferredPadding = {
    x: palmWidth * 0.18,
    top: palmHeight * 0.14,
    bottom: palmHeight * 0.1,
  };

  for (const paddingScale of [1, 0.75, 0.5, 0.25, 0]) {
    const bounds = {
      minX: coreBounds.minX - preferredPadding.x * paddingScale,
      minY: coreBounds.minY - preferredPadding.top * paddingScale,
      maxX: coreBounds.maxX + preferredPadding.x * paddingScale,
      maxY: coreBounds.maxY + preferredPadding.bottom * paddingScale,
    };
    const geometry = buildGeometry(center, rotationRadians, bounds, palmWidth, palmHeight);
    const outside = getOutsideCornerIndices(geometry.sourceCorners, frameWidth, frameHeight);
    if (outside.length === 0) {
      return {
        ok: true,
        method: "adaptive-rotated",
        geometry,
        diagnostics: {
          method: "adaptive-rotated",
          frameWidth,
          frameHeight,
          rotationDegrees: geometry.rotationDegrees,
          landmarks: corePoints,
          candidateCorners: geometry.sourceCorners,
          outsideCornerIndices: [],
          paddingScale,
        },
      };
    }
  }

  const sourceMinX = Math.min(...corePoints.map((item) => item.x));
  const sourceMaxX = Math.max(...corePoints.map((item) => item.x));
  const sourceMinY = Math.min(...corePoints.map((item) => item.y));
  const sourceMaxY = Math.max(...corePoints.map((item) => item.y));
  const sourceBounds = {
    minX: Math.max(0, sourceMinX - palmWidth * 0.12),
    minY: Math.max(0, sourceMinY - palmHeight * 0.08),
    maxX: Math.min(frameWidth, sourceMaxX + palmWidth * 0.12),
    maxY: Math.min(frameHeight, sourceMaxY + palmHeight * 0.08),
  };
  const fallbackCenter = {
    x: (sourceBounds.minX + sourceBounds.maxX) / 2,
    y: (sourceBounds.minY + sourceBounds.maxY) / 2,
  };
  const fallbackBounds = {
    minX: sourceBounds.minX - fallbackCenter.x,
    minY: sourceBounds.minY - fallbackCenter.y,
    maxX: sourceBounds.maxX - fallbackCenter.x,
    maxY: sourceBounds.maxY - fallbackCenter.y,
  };
  const geometry = buildGeometry(fallbackCenter, 0, fallbackBounds, palmWidth, palmHeight);
  if (geometry.outputWidth <= 0 || geometry.outputHeight <= 0) {
    return { ok: false, category: "core-out-of-frame", reason: "Inti telapak tidak membentuk area crop yang valid di dalam frame." };
  }
  return {
    ok: true,
    method: "fallback-axis-aligned",
    geometry,
    diagnostics: {
      method: "fallback-axis-aligned",
      frameWidth,
      frameHeight,
      rotationDegrees: 0,
      landmarks: corePoints,
      candidateCorners: geometry.sourceCorners,
      outsideCornerIndices: [],
      paddingScale: 0,
    },
  };
}

/** Extracts full-resolution pixels; EXIF orientation is applied by the caller. */
export function extractPalmRoi(
  source: CanvasImageSource,
  geometry: PalmRoiGeometry,
  maximumDimension?: number,
): HTMLCanvasElement {
  const scale = maximumDimension
    ? Math.min(1, maximumDimension / Math.max(geometry.outputWidth, geometry.outputHeight))
    : 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(geometry.outputWidth * scale));
  canvas.height = Math.max(1, Math.round(geometry.outputHeight * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas ROI tidak tersedia.");
  const { minX, minY } = geometry.rotatedBounds;
  context.setTransform(scale, 0, 0, scale, -minX * scale, -minY * scale);
  context.rotate(geometry.rotationRadians);
  context.translate(-geometry.centerX, -geometry.centerY);
  context.drawImage(source, 0, 0);
  context.setTransform(1, 0, 0, 1, 0, 0);
  return canvas;
}
