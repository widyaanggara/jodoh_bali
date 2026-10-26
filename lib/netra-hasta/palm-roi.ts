import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

const WRIST = 0;
const THUMB_CMC = 1;
const INDEX_MCP = 5;
const MIDDLE_MCP = 9;
const RING_MCP = 13;
const PINKY_MCP = 17;

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

interface Point {
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
}

export type PalmRoiGeometryResult =
  | { ok: true; geometry: PalmRoiGeometry }
  | { ok: false; reason: string };

function rotatePoint(point: Point, radians: number): Point {
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  return {
    x: point.x * cosine - point.y * sine,
    y: point.x * sine + point.y * cosine,
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

/**
 * Builds a padded palm rectangle in a rotated coordinate system. The axis from
 * wrist to the average MCP row is normalized to point upward. The rectangle is
 * rejected when any padded corner falls outside the original camera frame.
 */
export function calculatePalmRoiGeometry(
  landmarks: NormalizedLandmark[],
  frameWidth: number,
  frameHeight: number,
  config: PalmRoiConfig = DEFAULT_PALM_ROI_CONFIG,
): PalmRoiGeometryResult {
  if (frameWidth <= 0 || frameHeight <= 0 || landmarks.length < 18) {
    return { ok: false, reason: "Dimensi frame atau landmark telapak tidak valid." };
  }

  const requiredIndices = [WRIST, THUMB_CMC, INDEX_MCP, MIDDLE_MCP, RING_MCP, PINKY_MCP];
  if (!requiredIndices.every((index) => isValidLandmark(landmarks[index]))) {
    return { ok: false, reason: "Landmark telapak berada di luar batas frame." };
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

  if (
    palmWidth < config.minimumWidthPixels ||
    palmHeight < config.minimumHeightPixels
  ) {
    return { ok: false, reason: "Area telapak terlalu kecil untuk diekstrak." };
  }

  const palmPoints = [wrist, thumbCmc, indexMcp, middleMcp, ringMcp, pinkyMcp];
  const rotated = palmPoints.map((palmPoint) =>
    rotatePoint(
      { x: palmPoint.x - center.x, y: palmPoint.y - center.y },
      rotationRadians,
    ),
  );

  const xValues = rotated.map((palmPoint) => palmPoint.x);
  const yValues = rotated.map((palmPoint) => palmPoint.y);
  const horizontalPadding = palmWidth * config.horizontalPaddingRatio;
  const minX = Math.min(...xValues) - horizontalPadding;
  const maxX = Math.max(...xValues) + horizontalPadding;
  const minY = Math.min(...yValues) - palmHeight * config.topPaddingRatio;
  const maxY = Math.max(...yValues) + palmHeight * config.bottomPaddingRatio;

  const rotatedCorners: Point[] = [
    { x: minX, y: minY },
    { x: maxX, y: minY },
    { x: maxX, y: maxY },
    { x: minX, y: maxY },
  ];

  const sourceCorners = rotatedCorners.map((corner) => {
    const sourcePoint = inverseRotatePoint(corner, rotationRadians);
    return { x: sourcePoint.x + center.x, y: sourcePoint.y + center.y };
  });

  const isInsideFrame = sourceCorners.every(
    (corner) =>
      corner.x >= 0 &&
      corner.x <= frameWidth &&
      corner.y >= 0 &&
      corner.y <= frameHeight,
  );

  if (!isInsideFrame) {
    return { ok: false, reason: "Area telapak dan padding terpotong oleh batas kamera." };
  }

  return {
    ok: true,
    geometry: {
      centerX: center.x,
      centerY: center.y,
      rotationRadians,
      rotationDegrees: (rotationRadians * 180) / Math.PI,
      rotatedBounds: { minX, minY, maxX, maxY },
      outputWidth: Math.ceil(maxX - minX),
      outputHeight: Math.ceil(maxY - minY),
      palmWidth,
      palmHeight,
    },
  };
}

/**
 * Extracts pixels from the unmirrored source frame. The webcam is mirrored only
 * with CSS, so landmarks and source pixels stay in the same coordinate system.
 */
export function extractPalmRoi(
  source: CanvasImageSource,
  geometry: PalmRoiGeometry,
  maximumDimension?: number,
): HTMLCanvasElement {
  const sourceWidth = geometry.outputWidth;
  const sourceHeight = geometry.outputHeight;
  const scale = maximumDimension
    ? Math.min(1, maximumDimension / Math.max(sourceWidth, sourceHeight))
    : 1;
  const outputWidth = Math.max(1, Math.round(sourceWidth * scale));
  const outputHeight = Math.max(1, Math.round(sourceHeight * scale));
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas ROI tidak tersedia.");

  const { minX, minY } = geometry.rotatedBounds;
  context.setTransform(
    scale,
    0,
    0,
    scale,
    -minX * scale,
    -minY * scale,
  );
  context.rotate(geometry.rotationRadians);
  context.translate(-geometry.centerX, -geometry.centerY);
  context.drawImage(source, 0, 0);
  context.setTransform(1, 0, 0, 1, 0, 0);

  return canvas;
}
