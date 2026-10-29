import type { RgbaImage } from "./palm-preprocessing";
import type { PalmInteriorGeometry, Point as PalmRoiPoint } from "./palm-roi";

/** Frozen identifiers for reproducible ground-truth evaluation. */
export const PALM_LINE_EXTRACTION_VERSION = "dark-ridge-v1";
export const PALM_LINE_PARAMETER_VERSION = "baseline-2026-10-27";
export const PALM_LINE_REFINEMENT_VERSION = "evidence-bridge-v1";
export const PALM_INTERIOR_EXPERIMENT_VERSION = "palm-interior-v1";

export interface PalmLinePoint {
  x: number;
  y: number;
}

export interface PalmLineCandidate {
  id: string;
  points: PalmLinePoint[];
  lengthPixels: number;
  continuity: number;
  averageResponse: number;
}

export interface PalmLineExtractionConfig {
  maximumAnalysisDimension: number;
  illuminationRadius: number;
  localContrastGain: number;
  ridgeHalfWidth: number;
  responseThreshold: number;
  borderMarginRatio: number;
  minimumNeighborCount: number;
  gapClosingRadius: number;
  minimumLengthRatio: number;
  maximumCandidates: number;
  thinningIterations: number;
  maximumTextureEnergy: number;
}

export interface PalmLineRefinementConfig {
  maximumGapAnalysisPixels: number;
  maximumDirectionChangeDegrees: number;
  minimumBridgeSupportRatio: number;
  bridgeResponseFactor: number;
}

export const DEFAULT_PALM_LINE_REFINEMENT_CONFIG: PalmLineRefinementConfig = {
  maximumGapAnalysisPixels: 12,
  maximumDirectionChangeDegrees: 25,
  minimumBridgeSupportRatio: 1,
  bridgeResponseFactor: 0.6,
};

export const DEFAULT_PALM_LINE_CONFIG: PalmLineExtractionConfig = {
  maximumAnalysisDimension: 512,
  illuminationRadius: 14,
  localContrastGain: 1.25,
  ridgeHalfWidth: 2,
  responseThreshold: 7,
  borderMarginRatio: 0.065,
  minimumNeighborCount: 2,
  gapClosingRadius: 1,
  minimumLengthRatio: 0.04,
  maximumCandidates: 24,
  thinningIterations: 28,
  maximumTextureEnergy: 24,
};

export interface PalmLineExtractionResult {
  variant: "baseline" | "evidence-bridge" | "palm-interior";
  refinementVersion: string | null;
  acceptedBridgeCount: number;
  maskStatus: "not-used" | "applied" | "unreliable";
  maskReason: string | null;
  status: "detected" | "abstain";
  abstainReason: string | null;
  candidates: PalmLineCandidate[];
  normalized: RgbaImage;
  candidateMap: RgbaImage;
  overlay: RgbaImage;
  ridgeResponseMap: RgbaImage;
  thresholdMap: RgbaImage;
  morphologyMap: RgbaImage;
  skeletonMap: RgbaImage;
  interiorMaskMap: RgbaImage | null;
  analysisWidth: number;
  analysisHeight: number;
  sourceContrast: number;
  candidatePixelRatio: number;
  textureEnergy: number;
  processingMs: number;
}

export interface PalmInteriorCandidateMetrics {
  candidateCount: number;
  totalLengthPixels: number;
  outsideCandidateCount: number;
  outsideLengthPixels: number;
}

export interface PalmLineExtractionSummary {
  variant: PalmLineExtractionResult["variant"];
  refinementVersion: string | null;
  acceptedBridgeCount: number;
  maskStatus: PalmLineExtractionResult["maskStatus"];
  maskReason: string | null;
  status: PalmLineExtractionResult["status"];
  abstainReason: string | null;
  candidateCount: number;
  totalLengthPixels: number;
  averageContinuity: number;
  processingMs: number;
  parameters: PalmLineExtractionConfig;
}

export interface ManualPalmLineAnnotation {
  id: string;
  points: PalmLinePoint[];
}

export interface PalmLineAgreement {
  tolerancePixels: number;
  manualCoverage: number;
  candidatePrecision: number;
  harmonicScore: number;
}

export interface PalmLineDistanceBin {
  label: string;
  minimumPixels: number;
  maximumPixels: number | null;
  lengthPixels: number;
  ratio: number;
}

export interface PalmLineDistanceDistribution {
  meanPixels: number | null;
  medianPixels: number | null;
  percentile90Pixels: number | null;
  bins: PalmLineDistanceBin[];
}

export interface PalmLineErrorDiagnostics {
  tolerancePixels: number;
  candidateNearLength: number;
  candidateOutsideAnnotationLength: number;
  manualCoveredLength: number;
  manualUncoveredLength: number;
  candidateToManual: PalmLineDistanceDistribution;
  manualToCandidate: PalmLineDistanceDistribution;
  overlay: RgbaImage;
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
}

function createRgbaImage(values: Float32Array | Uint8Array, width: number, height: number): RgbaImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let pixel = 0; pixel < values.length; pixel += 1) {
    const value = clampByte(values[pixel]);
    const offset = pixel * 4;
    data[offset] = value;
    data[offset + 1] = value;
    data[offset + 2] = value;
    data[offset + 3] = 255;
  }
  return { width, height, data };
}

function resizeToGrayscale(source: RgbaImage, maximumDimension: number) {
  const scale = Math.min(1, maximumDimension / Math.max(source.width, source.height));
  const width = Math.max(1, Math.round(source.width * scale));
  const height = Math.max(1, Math.round(source.height * scale));
  const values = new Float32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    const sourceY = Math.min(source.height - 1, Math.round(y / scale));
    for (let x = 0; x < width; x += 1) {
      const sourceX = Math.min(source.width - 1, Math.round(x / scale));
      const offset = (sourceY * source.width + sourceX) * 4;
      values[y * width + x] =
        0.299 * source.data[offset] +
        0.587 * source.data[offset + 1] +
        0.114 * source.data[offset + 2];
    }
  }
  return { values, width, height, scale };
}

function boxBlur(values: Float32Array, width: number, height: number, radius: number): Float32Array {
  if (radius <= 0) return new Float32Array(values);
  const integralWidth = width + 1;
  const integral = new Float64Array((width + 1) * (height + 1));
  for (let y = 0; y < height; y += 1) {
    let rowTotal = 0;
    for (let x = 0; x < width; x += 1) {
      rowTotal += values[y * width + x];
      integral[(y + 1) * integralWidth + x + 1] =
        integral[y * integralWidth + x + 1] + rowTotal;
    }
  }
  const output = new Float32Array(values.length);
  for (let y = 0; y < height; y += 1) {
    const top = Math.max(0, y - radius);
    const bottom = Math.min(height - 1, y + radius);
    for (let x = 0; x < width; x += 1) {
      const left = Math.max(0, x - radius);
      const right = Math.min(width - 1, x + radius);
      const sum =
        integral[(bottom + 1) * integralWidth + right + 1] -
        integral[top * integralWidth + right + 1] -
        integral[(bottom + 1) * integralWidth + left] +
        integral[top * integralWidth + left];
      output[y * width + x] = sum / ((right - left + 1) * (bottom - top + 1));
    }
  }
  return output;
}

function calculateStandardDeviation(values: Float32Array): number {
  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  const variance = values.reduce((total, value) => total + (value - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

function calculateTextureEnergy(values: Float32Array, width: number, height: number): number {
  let total = 0;
  let samples = 0;
  for (let y = 0; y < height - 1; y += 1) {
    for (let x = 0; x < width - 1; x += 1) {
      const index = y * width + x;
      total += Math.abs(values[index] - values[index + 1]);
      total += Math.abs(values[index] - values[index + width]);
      samples += 2;
    }
  }
  return samples ? total / samples : 0;
}

function normalizeIllumination(
  grayscale: Float32Array,
  width: number,
  height: number,
  config: PalmLineExtractionConfig,
): Float32Array {
  const illumination = boxBlur(grayscale, width, height, config.illuminationRadius);
  const normalized = new Float32Array(grayscale.length);
  for (let index = 0; index < grayscale.length; index += 1) {
    normalized[index] = clampByte(128 + (grayscale[index] - illumination[index]) * config.localContrastGain);
  }
  return boxBlur(normalized, width, height, 1);
}

const DIRECTIONS = [
  { dx: 1, dy: 0, nx: 0, ny: 1 },
  { dx: 1, dy: 1, nx: -1, ny: 1 },
  { dx: 0, dy: 1, nx: 1, ny: 0 },
  { dx: 1, dy: -1, nx: 1, ny: 1 },
];

function detectDarkRidges(
  normalized: Float32Array,
  width: number,
  height: number,
  config: PalmLineExtractionConfig,
) {
  const response = new Float32Array(normalized.length);
  const binary = new Uint8Array(normalized.length);
  const margin = Math.max(
    config.ridgeHalfWidth + 2,
    Math.round(Math.min(width, height) * config.borderMarginRatio),
  );
  for (let y = margin; y < height - margin; y += 1) {
    for (let x = margin; x < width - margin; x += 1) {
      let strongest = 0;
      for (const direction of DIRECTIONS) {
        let lineTotal = 0;
        let sideTotal = 0;
        let samples = 0;
        for (let along = -1; along <= 1; along += 1) {
          const lineX = x + direction.dx * along;
          const lineY = y + direction.dy * along;
          lineTotal += normalized[lineY * width + lineX];
          for (const side of [-1, 1]) {
            const sideX = lineX + direction.nx * config.ridgeHalfWidth * side;
            const sideY = lineY + direction.ny * config.ridgeHalfWidth * side;
            sideTotal += normalized[sideY * width + sideX];
            samples += 1;
          }
        }
        const lineMean = lineTotal / 3;
        const sideMean = sideTotal / samples;
        strongest = Math.max(strongest, sideMean - lineMean);
      }
      const index = y * width + x;
      response[index] = strongest;
      if (strongest >= config.responseThreshold) binary[index] = 1;
    }
  }
  return { response, binary };
}

function thresholdRidgeResponse(response: Float32Array, threshold: number): Uint8Array {
  const binary = new Uint8Array(response.length);
  for (let index = 0; index < response.length; index += 1) {
    if (response[index] >= threshold) binary[index] = 1;
  }
  return binary;
}

function binaryToImage(binary: Uint8Array, width: number, height: number): RgbaImage {
  const values = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) values[index] = binary[index] ? 255 : 0;
  return createRgbaImage(values, width, height);
}

function pointInsidePolygon(point: PalmRoiPoint, polygon: PalmRoiPoint[]): boolean {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index, index += 1) {
    const currentPoint = polygon[index];
    const previousPoint = polygon[previous];
    const intersects = (currentPoint.y > point.y) !== (previousPoint.y > point.y) &&
      point.x < (previousPoint.x - currentPoint.x) * (point.y - currentPoint.y) /
        (previousPoint.y - currentPoint.y || Number.EPSILON) + currentPoint.x;
    if (intersects) inside = !inside;
  }
  return inside;
}

function distanceToPolygon(point: PalmRoiPoint, polygon: PalmRoiPoint[]): number {
  let minimum = Number.POSITIVE_INFINITY;
  polygon.forEach((from, index) => {
    const to = polygon[(index + 1) % polygon.length];
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;
    const lengthSquared = deltaX ** 2 + deltaY ** 2;
    const projection = lengthSquared
      ? Math.max(0, Math.min(1, ((point.x - from.x) * deltaX + (point.y - from.y) * deltaY) / lengthSquared))
      : 0;
    const nearestX = from.x + projection * deltaX;
    const nearestY = from.y + projection * deltaY;
    minimum = Math.min(minimum, Math.hypot(point.x - nearestX, point.y - nearestY));
  });
  return minimum;
}

function palmInteriorWeightAt(point: PalmRoiPoint, polygon: PalmRoiPoint[], feather: number): number {
  if (pointInsidePolygon(point, polygon)) return 1;
  const distance = distanceToPolygon(point, polygon);
  return distance < feather ? 0.08 + 0.92 * (1 - distance / feather) : 0.08;
}

export function buildPalmInteriorWeights(
  geometry: PalmInteriorGeometry,
  width: number,
  height: number,
): Float32Array | null {
  if (!geometry.reliable || geometry.polygon.length < 4 || geometry.width <= 0 || geometry.height <= 0) return null;
  const scaleX = width / geometry.width;
  const scaleY = height / geometry.height;
  const polygon = geometry.polygon.map((point) => ({ x: point.x * scaleX, y: point.y * scaleY }));
  const feather = Math.max(4, Math.min(width, height) * 0.06);
  const weights = new Float32Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      weights[y * width + x] = palmInteriorWeightAt({ x, y }, polygon, feather);
    }
  }
  return weights;
}

function applyPalmInteriorSuppression(
  response: Float32Array,
  weights: Float32Array,
): Float32Array {
  const output = new Float32Array(response.length);
  for (let index = 0; index < response.length; index += 1) output[index] = response[index] * weights[index];
  return output;
}

function filterNeighbors(binary: Uint8Array, width: number, height: number, minimum: number): Uint8Array {
  const output = new Uint8Array(binary.length);
  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const index = y * width + x;
      if (!binary[index]) continue;
      let count = 0;
      for (let dy = -1; dy <= 1; dy += 1) {
        for (let dx = -1; dx <= 1; dx += 1) {
          if ((dx || dy) && binary[(y + dy) * width + x + dx]) count += 1;
        }
      }
      if (count >= minimum) output[index] = 1;
    }
  }
  return output;
}

function dilate(binary: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  if (radius <= 0) return new Uint8Array(binary);
  const output = new Uint8Array(binary.length);
  for (let y = radius; y < height - radius; y += 1) {
    for (let x = radius; x < width - radius; x += 1) {
      let found = false;
      for (let dy = -radius; dy <= radius && !found; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (binary[(y + dy) * width + x + dx]) {
            found = true;
            break;
          }
        }
      }
      if (found) output[y * width + x] = 1;
    }
  }
  return output;
}

function erode(binary: Uint8Array, width: number, height: number, radius: number): Uint8Array {
  if (radius <= 0) return new Uint8Array(binary);
  const output = new Uint8Array(binary.length);
  for (let y = radius; y < height - radius; y += 1) {
    for (let x = radius; x < width - radius; x += 1) {
      let complete = true;
      for (let dy = -radius; dy <= radius && complete; dy += 1) {
        for (let dx = -radius; dx <= radius; dx += 1) {
          if (!binary[(y + dy) * width + x + dx]) {
            complete = false;
            break;
          }
        }
      }
      if (complete) output[y * width + x] = 1;
    }
  }
  return output;
}

function thinBinary(binary: Uint8Array, width: number, height: number, iterations: number): Uint8Array {
  const output = new Uint8Array(binary);
  const neighbors = (x: number, y: number) => [
    output[(y - 1) * width + x],
    output[(y - 1) * width + x + 1],
    output[y * width + x + 1],
    output[(y + 1) * width + x + 1],
    output[(y + 1) * width + x],
    output[(y + 1) * width + x - 1],
    output[y * width + x - 1],
    output[(y - 1) * width + x - 1],
  ];
  for (let iteration = 0; iteration < iterations; iteration += 1) {
    let changed = false;
    for (const phase of [0, 1]) {
      const remove: number[] = [];
      for (let y = 1; y < height - 1; y += 1) {
        for (let x = 1; x < width - 1; x += 1) {
          const index = y * width + x;
          if (!output[index]) continue;
          const n = neighbors(x, y);
          const count = n.reduce((total, value) => total + value, 0);
          const transitions = n.reduce(
            (total, value, position) => total + (value === 0 && n[(position + 1) % 8] === 1 ? 1 : 0),
            0,
          );
          const phaseCondition = phase === 0
            ? n[0] * n[2] * n[4] === 0 && n[2] * n[4] * n[6] === 0
            : n[0] * n[2] * n[6] === 0 && n[0] * n[4] * n[6] === 0;
          if (count >= 2 && count <= 6 && transitions === 1 && phaseCondition) remove.push(index);
        }
      }
      remove.forEach((index) => { output[index] = 0; });
      if (remove.length) changed = true;
    }
    if (!changed) break;
  }
  return output;
}

function neighborIndices(index: number, binary: Uint8Array, width: number, height: number): number[] {
  const x = index % width;
  const y = Math.floor(index / width);
  const result: number[] = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if ((!dx && !dy) || x + dx < 0 || x + dx >= width || y + dy < 0 || y + dy >= height) continue;
      const neighbor = (y + dy) * width + x + dx;
      if (binary[neighbor]) result.push(neighbor);
    }
  }
  return result;
}

function connectedComponents(binary: Uint8Array, width: number, height: number): number[][] {
  const visited = new Uint8Array(binary.length);
  const components: number[][] = [];
  for (let index = 0; index < binary.length; index += 1) {
    if (!binary[index] || visited[index]) continue;
    const queue = [index];
    const component: number[] = [];
    visited[index] = 1;
    for (let cursor = 0; cursor < queue.length; cursor += 1) {
      const current = queue[cursor];
      component.push(current);
      neighborIndices(current, binary, width, height).forEach((neighbor) => {
        if (!visited[neighbor]) {
          visited[neighbor] = 1;
          queue.push(neighbor);
        }
      });
    }
    components.push(component);
  }
  return components;
}

function farthestPath(start: number, allowed: Set<number>, binary: Uint8Array, width: number, height: number) {
  const queue = [start];
  const parent = new Map<number, number>();
  const distance = new Map<number, number>([[start, 0]]);
  let farthest = start;
  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const current = queue[cursor];
    if ((distance.get(current) ?? 0) > (distance.get(farthest) ?? 0)) farthest = current;
    neighborIndices(current, binary, width, height).forEach((neighbor) => {
      if (!allowed.has(neighbor) || distance.has(neighbor)) return;
      distance.set(neighbor, (distance.get(current) ?? 0) + 1);
      parent.set(neighbor, current);
      queue.push(neighbor);
    });
  }
  return { farthest, parent };
}

function simplifyPath(points: PalmLinePoint[], minimumDistance: number): PalmLinePoint[] {
  if (points.length <= 2) return points;
  const output = [points[0]];
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = output[output.length - 1];
    if (Math.hypot(points[index].x - previous.x, points[index].y - previous.y) >= minimumDistance) {
      output.push(points[index]);
    }
  }
  output.push(points[points.length - 1]);
  return output;
}

function traceCandidates(
  binary: Uint8Array,
  response: Float32Array,
  width: number,
  height: number,
  sourceScale: number,
  config: PalmLineExtractionConfig,
): PalmLineCandidate[] {
  const minimumLength = Math.min(width, height) * config.minimumLengthRatio;
  const candidates: PalmLineCandidate[] = [];
  connectedComponents(binary, width, height).forEach((component) => {
    if (component.length < minimumLength) return;
    const allowed = new Set(component);
    const endpoint = component.find((index) => neighborIndices(index, binary, width, height).length === 1) ?? component[0];
    const first = farthestPath(endpoint, allowed, binary, width, height).farthest;
    const secondPass = farthestPath(first, allowed, binary, width, height);
    const path: number[] = [secondPass.farthest];
    while (path[path.length - 1] !== first) {
      const next = secondPass.parent.get(path[path.length - 1]);
      if (next === undefined) break;
      path.push(next);
    }
    if (path.length < minimumLength) return;
    const points = simplifyPath(path.map((index) => ({
      x: (index % width) / sourceScale,
      y: Math.floor(index / width) / sourceScale,
    })), Math.max(2, 3 / sourceScale));
    let lengthPixels = 0;
    for (let index = 1; index < points.length; index += 1) {
      lengthPixels += Math.hypot(points[index].x - points[index - 1].x, points[index].y - points[index - 1].y);
    }
    candidates.push({
      id: `candidate-${candidates.length + 1}`,
      points,
      lengthPixels,
      continuity: Math.min(1, path.length / component.length),
      averageResponse: path.reduce((total, index) => total + response[index], 0) / path.length,
    });
  });
  return candidates
    .sort((left, right) => right.lengthPixels - left.lengthPixels)
    .slice(0, config.maximumCandidates)
    .map((candidate, index) => ({ ...candidate, id: `candidate-${index + 1}` }));
}

function angleBetweenDegrees(first: PalmLinePoint, second: PalmLinePoint): number {
  const firstLength = Math.hypot(first.x, first.y);
  const secondLength = Math.hypot(second.x, second.y);
  if (!firstLength || !secondLength) return 180;
  const cosine = Math.max(-1, Math.min(1,
    (first.x * second.x + first.y * second.y) / (firstLength * secondLength),
  ));
  return Math.acos(cosine) * 180 / Math.PI;
}

function bridgeHasPixelEvidence(
  from: PalmLinePoint,
  to: PalmLinePoint,
  response: Float32Array,
  width: number,
  height: number,
  sourceScale: number,
  threshold: number,
  minimumRatio: number,
): boolean {
  const analysisDistance = Math.hypot(to.x - from.x, to.y - from.y) * sourceScale;
  const steps = Math.max(1, Math.ceil(analysisDistance));
  let supported = 0;
  let sampled = 0;
  for (let step = 1; step < steps; step += 1) {
    const ratio = step / steps;
    const x = Math.round((from.x + (to.x - from.x) * ratio) * sourceScale);
    const y = Math.round((from.y + (to.y - from.y) * ratio) * sourceScale);
    if (x < 0 || x >= width || y < 0 || y >= height) return false;
    sampled += 1;
    if (response[y * width + x] >= threshold) supported += 1;
  }
  return sampled > 0 && supported / sampled >= minimumRatio;
}

function mergeEvidenceSupportedCandidates(
  sourceCandidates: PalmLineCandidate[],
  response: Float32Array,
  width: number,
  height: number,
  sourceScale: number,
  baselineConfig: PalmLineExtractionConfig,
  refinementConfig: PalmLineRefinementConfig,
): { candidates: PalmLineCandidate[]; acceptedBridgeCount: number } {
  const candidates = sourceCandidates.map((candidate) => ({
    ...candidate,
    points: candidate.points.map((point) => ({ ...point })),
  }));
  let acceptedBridgeCount = 0;
  while (true) {
    let best: {
      firstIndex: number;
      secondIndex: number;
      firstEndpoint: 0 | 1;
      secondEndpoint: 0 | 1;
      gap: number;
    } | null = null;
    for (let firstIndex = 0; firstIndex < candidates.length; firstIndex += 1) {
      for (let secondIndex = firstIndex + 1; secondIndex < candidates.length; secondIndex += 1) {
        const first = candidates[firstIndex];
        const second = candidates[secondIndex];
        if (first.points.length < 2 || second.points.length < 2) continue;
        for (const firstEndpoint of [0, 1] as const) {
          for (const secondEndpoint of [0, 1] as const) {
            const firstPoint = firstEndpoint === 0 ? first.points[0] : first.points[first.points.length - 1];
            const firstNeighbor = firstEndpoint === 0 ? first.points[1] : first.points[first.points.length - 2];
            const secondPoint = secondEndpoint === 0 ? second.points[0] : second.points[second.points.length - 1];
            const secondNeighbor = secondEndpoint === 0 ? second.points[1] : second.points[second.points.length - 2];
            const bridge = { x: secondPoint.x - firstPoint.x, y: secondPoint.y - firstPoint.y };
            const gap = Math.hypot(bridge.x, bridge.y) * sourceScale;
            if (gap <= 1 || gap > refinementConfig.maximumGapAnalysisPixels) continue;
            const firstOutward = { x: firstPoint.x - firstNeighbor.x, y: firstPoint.y - firstNeighbor.y };
            const secondOutward = { x: secondPoint.x - secondNeighbor.x, y: secondPoint.y - secondNeighbor.y };
            if (angleBetweenDegrees(firstOutward, bridge) > refinementConfig.maximumDirectionChangeDegrees ||
                angleBetweenDegrees(secondOutward, { x: -bridge.x, y: -bridge.y }) > refinementConfig.maximumDirectionChangeDegrees) continue;
            if (!bridgeHasPixelEvidence(
              firstPoint,
              secondPoint,
              response,
              width,
              height,
              sourceScale,
              baselineConfig.responseThreshold * refinementConfig.bridgeResponseFactor,
              refinementConfig.minimumBridgeSupportRatio,
            )) continue;
            if (!best || gap < best.gap) {
              best = { firstIndex, secondIndex, firstEndpoint, secondEndpoint, gap };
            }
          }
        }
      }
    }
    if (!best) break;
    const first = candidates[best.firstIndex];
    const second = candidates[best.secondIndex];
    const firstPoints = best.firstEndpoint === 1 ? first.points : [...first.points].reverse();
    const secondPoints = best.secondEndpoint === 0 ? second.points : [...second.points].reverse();
    const bridgeLength = best.gap / sourceScale;
    const mergedLength = first.lengthPixels + bridgeLength + second.lengthPixels;
    const merged: PalmLineCandidate = {
      id: first.id,
      points: [...firstPoints, ...secondPoints],
      lengthPixels: mergedLength,
      continuity: (
        first.continuity * first.lengthPixels + second.continuity * second.lengthPixels
      ) / Math.max(1, first.lengthPixels + second.lengthPixels),
      averageResponse: (
        first.averageResponse * first.lengthPixels + second.averageResponse * second.lengthPixels
      ) / Math.max(1, first.lengthPixels + second.lengthPixels),
    };
    candidates[best.firstIndex] = merged;
    candidates.splice(best.secondIndex, 1);
    acceptedBridgeCount += 1;
  }
  return {
    candidates: candidates
      .sort((left, right) => right.lengthPixels - left.lengthPixels)
      .map((candidate, index) => ({ ...candidate, id: `candidate-${index + 1}` })),
    acceptedBridgeCount,
  };
}

function drawLine(data: Uint8ClampedArray, width: number, height: number, from: PalmLinePoint, to: PalmLinePoint, color: [number, number, number], radius = 1) {
  const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y)));
  for (let step = 0; step <= steps; step += 1) {
    const x = Math.round(from.x + (to.x - from.x) * (step / steps));
    const y = Math.round(from.y + (to.y - from.y) * (step / steps));
    for (let dy = -radius; dy <= radius; dy += 1) {
      for (let dx = -radius; dx <= radius; dx += 1) {
        if (x + dx < 0 || x + dx >= width || y + dy < 0 || y + dy >= height) continue;
        const offset = ((y + dy) * width + x + dx) * 4;
        data[offset] = color[0];
        data[offset + 1] = color[1];
        data[offset + 2] = color[2];
        data[offset + 3] = 255;
      }
    }
  }
}

function buildCandidateMap(width: number, height: number, candidates: PalmLineCandidate[], sourceScale: number): RgbaImage {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let index = 3; index < data.length; index += 4) data[index] = 255;
  candidates.forEach((candidate) => {
    for (let index = 1; index < candidate.points.length; index += 1) {
      drawLine(
        data,
        width,
        height,
        { x: candidate.points[index - 1].x * sourceScale, y: candidate.points[index - 1].y * sourceScale },
        { x: candidate.points[index].x * sourceScale, y: candidate.points[index].y * sourceScale },
        [34, 211, 238],
      );
    }
  });
  return { width, height, data };
}

function buildOverlay(source: RgbaImage, candidates: PalmLineCandidate[]): RgbaImage {
  const data = new Uint8ClampedArray(source.data);
  candidates.forEach((candidate) => {
    for (let index = 1; index < candidate.points.length; index += 1) {
      drawLine(data, source.width, source.height, candidate.points[index - 1], candidate.points[index], [0, 255, 255], 1);
    }
  });
  return { width: source.width, height: source.height, data };
}

function runPalmLineExtraction(
  source: RgbaImage,
  config: PalmLineExtractionConfig,
  refinementConfig: PalmLineRefinementConfig | null,
  interiorGeometry: PalmInteriorGeometry | null,
): PalmLineExtractionResult {
  const startedAt = typeof performance === "undefined" ? Date.now() : performance.now();
  const working = resizeToGrayscale(source, config.maximumAnalysisDimension);
  const sourceContrast = calculateStandardDeviation(working.values);
  const textureEnergy = calculateTextureEnergy(working.values, working.width, working.height);
  const normalizedValues = normalizeIllumination(
    working.values,
    working.width,
    working.height,
    config,
  );
  const ridge = detectDarkRidges(normalizedValues, working.width, working.height, config);
  const interiorWeights = interiorGeometry
    ? buildPalmInteriorWeights(interiorGeometry, working.width, working.height)
    : null;
  const effectiveResponse = interiorWeights
    ? applyPalmInteriorSuppression(ridge.response, interiorWeights)
    : ridge.response;
  const thresholded = interiorWeights
    ? thresholdRidgeResponse(effectiveResponse, config.responseThreshold)
    : ridge.binary;
  const filtered = filterNeighbors(thresholded, working.width, working.height, config.minimumNeighborCount);
  const closed = erode(
    dilate(filtered, working.width, working.height, config.gapClosingRadius),
    working.width,
    working.height,
    config.gapClosingRadius,
  );
  const thinned = thinBinary(closed, working.width, working.height, config.thinningIterations);
  const activePixels = thinned.reduce((total, value) => total + value, 0);
  const candidatePixelRatio = activePixels / thinned.length;
  const baselineCandidates = traceCandidates(
    thinned,
    effectiveResponse,
    working.width,
    working.height,
    working.scale,
    config,
  );
  const refinement = refinementConfig
    ? mergeEvidenceSupportedCandidates(
        baselineCandidates,
        effectiveResponse,
        working.width,
        working.height,
        working.scale,
        config,
        refinementConfig,
      )
    : { candidates: baselineCandidates, acceptedBridgeCount: 0 };
  const candidates = refinement.candidates;
  let abstainReason: string | null = null;
  if (interiorGeometry && !interiorWeights) abstainReason = interiorGeometry.reason ?? "Palm interior mask tidak andal.";
  else if (sourceContrast < 2.5) abstainReason = "Kontras citra terlalu rendah untuk mendukung kandidat garis.";
  else if (textureEnergy > config.maximumTextureEnergy) abstainReason = "Energi tekstur terlalu tinggi; kandidat tidak dapat dipisahkan dari noise.";
  else if (candidatePixelRatio > 0.16) abstainReason = "Respons tekstur terlalu padat; kandidat tidak dapat dipisahkan dari noise.";
  else if (candidates.length === 0) abstainReason = "Tidak ada segmen terhubung yang melewati panjang minimum.";

  const acceptedCandidates = abstainReason ? [] : candidates;
  const finishedAt = typeof performance === "undefined" ? Date.now() : performance.now();
  const responseValues = new Float32Array(effectiveResponse.length);
  for (let index = 0; index < effectiveResponse.length; index += 1) {
    responseValues[index] = Math.min(255, effectiveResponse[index] / config.responseThreshold * 96);
  }
  return {
    variant: interiorGeometry ? "palm-interior" : refinementConfig ? "evidence-bridge" : "baseline",
    refinementVersion: interiorGeometry
      ? PALM_INTERIOR_EXPERIMENT_VERSION
      : refinementConfig ? PALM_LINE_REFINEMENT_VERSION : null,
    acceptedBridgeCount: refinement.acceptedBridgeCount,
    maskStatus: interiorGeometry ? interiorWeights ? "applied" : "unreliable" : "not-used",
    maskReason: interiorGeometry ? interiorGeometry.reason : null,
    status: abstainReason ? "abstain" : "detected",
    abstainReason,
    candidates: acceptedCandidates,
    normalized: createRgbaImage(normalizedValues, working.width, working.height),
    candidateMap: buildCandidateMap(working.width, working.height, acceptedCandidates, working.scale),
    overlay: buildOverlay(source, acceptedCandidates),
    ridgeResponseMap: createRgbaImage(responseValues, working.width, working.height),
    thresholdMap: binaryToImage(thresholded, working.width, working.height),
    morphologyMap: binaryToImage(closed, working.width, working.height),
    skeletonMap: binaryToImage(thinned, working.width, working.height),
    interiorMaskMap: interiorWeights
      ? createRgbaImage(Float32Array.from(interiorWeights, (value) => value * 255), working.width, working.height)
      : null,
    analysisWidth: working.width,
    analysisHeight: working.height,
    sourceContrast,
    candidatePixelRatio,
    textureEnergy,
    processingMs: finishedAt - startedAt,
  };
}

export function extractPalmLineCandidates(
  source: RgbaImage,
  config: PalmLineExtractionConfig = DEFAULT_PALM_LINE_CONFIG,
): PalmLineExtractionResult {
  return runPalmLineExtraction(source, config, null, null);
}

export function extractRefinedPalmLineCandidates(
  source: RgbaImage,
  config: PalmLineExtractionConfig = DEFAULT_PALM_LINE_CONFIG,
  refinementConfig: PalmLineRefinementConfig = DEFAULT_PALM_LINE_REFINEMENT_CONFIG,
): PalmLineExtractionResult {
  return runPalmLineExtraction(source, config, refinementConfig, null);
}

export function extractPalmInteriorLineCandidates(
  source: RgbaImage,
  interiorGeometry: PalmInteriorGeometry,
  config: PalmLineExtractionConfig = DEFAULT_PALM_LINE_CONFIG,
): PalmLineExtractionResult {
  return runPalmLineExtraction(source, config, null, interiorGeometry);
}

export function summarizePalmLineExtraction(
  result: PalmLineExtractionResult,
  parameters: PalmLineExtractionConfig = DEFAULT_PALM_LINE_CONFIG,
): PalmLineExtractionSummary {
  return {
    variant: result.variant,
    refinementVersion: result.refinementVersion,
    acceptedBridgeCount: result.acceptedBridgeCount,
    maskStatus: result.maskStatus,
    maskReason: result.maskReason,
    status: result.status,
    abstainReason: result.abstainReason,
    candidateCount: result.candidates.length,
    totalLengthPixels: result.candidates.reduce((total, candidate) => total + candidate.lengthPixels, 0),
    averageContinuity: result.candidates.length
      ? result.candidates.reduce((total, candidate) => total + candidate.continuity, 0) / result.candidates.length
      : 0,
    processingMs: result.processingMs,
    parameters: { ...parameters },
  };
}

export function wipePalmLineExtraction(result: PalmLineExtractionResult | null): void {
  if (!result) return;
  result.normalized.data.fill(0);
  result.candidateMap.data.fill(0);
  result.overlay.data.fill(0);
  result.ridgeResponseMap.data.fill(0);
  result.thresholdMap.data.fill(0);
  result.morphologyMap.data.fill(0);
  result.skeletonMap.data.fill(0);
  result.interiorMaskMap?.data.fill(0);
}

interface LineSegment {
  from: PalmLinePoint;
  to: PalmLinePoint;
}

function toSegments(lines: Array<{ points: PalmLinePoint[] }>): LineSegment[] {
  return lines.flatMap((line) => line.points.slice(1).map((to, index) => ({
    from: line.points[index],
    to,
  })).filter((segment) => Math.hypot(
    segment.to.x - segment.from.x,
    segment.to.y - segment.from.y,
  ) > 0));
}

function squaredDistanceToSegment(point: PalmLinePoint, segment: LineSegment): number {
  const deltaX = segment.to.x - segment.from.x;
  const deltaY = segment.to.y - segment.from.y;
  const lengthSquared = deltaX ** 2 + deltaY ** 2;
  const projection = lengthSquared
    ? Math.max(0, Math.min(1, (
        (point.x - segment.from.x) * deltaX +
        (point.y - segment.from.y) * deltaY
      ) / lengthSquared))
    : 0;
  const nearestX = segment.from.x + projection * deltaX;
  const nearestY = segment.from.y + projection * deltaY;
  return (point.x - nearestX) ** 2 + (point.y - nearestY) ** 2;
}

function minimumDistanceToSegments(point: PalmLinePoint, segments: LineSegment[]): number {
  if (!segments.length) return Number.POSITIVE_INFINITY;
  return Math.sqrt(segments.reduce(
    (minimum, segment) => Math.min(minimum, squaredDistanceToSegment(point, segment)),
    Number.POSITIVE_INFINITY,
  ));
}

interface WeightedDistanceSlice {
  from: PalmLinePoint;
  to: PalmLinePoint;
  length: number;
  distance: number;
}

function measureDistanceSlices(
  source: Array<{ points: PalmLinePoint[] }>,
  target: Array<{ points: PalmLinePoint[] }>,
): WeightedDistanceSlice[] {
  const targetSegments = toSegments(target);
  return toSegments(source).flatMap((segment) => {
    const length = Math.hypot(segment.to.x - segment.from.x, segment.to.y - segment.from.y);
    const steps = Math.max(1, Math.ceil(length));
    return Array.from({ length: steps }, (_, step) => {
      const startRatio = step / steps;
      const endRatio = (step + 1) / steps;
      const midpointRatio = (step + 0.5) / steps;
      return {
        from: {
          x: segment.from.x + (segment.to.x - segment.from.x) * startRatio,
          y: segment.from.y + (segment.to.y - segment.from.y) * startRatio,
        },
        to: {
          x: segment.from.x + (segment.to.x - segment.from.x) * endRatio,
          y: segment.from.y + (segment.to.y - segment.from.y) * endRatio,
        },
        length: length / steps,
        distance: minimumDistanceToSegments({
          x: segment.from.x + (segment.to.x - segment.from.x) * midpointRatio,
          y: segment.from.y + (segment.to.y - segment.from.y) * midpointRatio,
        }, targetSegments),
      };
    });
  });
}

function summarizeDistanceSlices(slices: WeightedDistanceSlice[]): PalmLineDistanceDistribution {
  const boundaries = [
    { label: "0–3 px", minimumPixels: 0, maximumPixels: 3 },
    { label: "3–6 px", minimumPixels: 3, maximumPixels: 6 },
    { label: "6–9 px", minimumPixels: 6, maximumPixels: 9 },
    { label: "9–15 px", minimumPixels: 9, maximumPixels: 15 },
    { label: ">15 px", minimumPixels: 15, maximumPixels: null },
  ];
  const totalLength = slices.reduce((total, slice) => total + slice.length, 0);
  const finite = slices.filter((slice) => Number.isFinite(slice.distance));
  const finiteLength = finite.reduce((total, slice) => total + slice.length, 0);
  const weightedQuantile = (quantile: number): number | null => {
    if (!finiteLength) return null;
    const sorted = [...finite].sort((left, right) => left.distance - right.distance);
    const target = finiteLength * quantile;
    let accumulated = 0;
    for (const slice of sorted) {
      accumulated += slice.length;
      if (accumulated >= target) return slice.distance;
    }
    return sorted[sorted.length - 1]?.distance ?? null;
  };
  return {
    meanPixels: finiteLength
      ? finite.reduce((total, slice) => total + slice.distance * slice.length, 0) / finiteLength
      : null,
    medianPixels: weightedQuantile(0.5),
    percentile90Pixels: weightedQuantile(0.9),
    bins: boundaries.map((boundary) => {
      const lengthPixels = slices.filter((slice) =>
        slice.distance >= boundary.minimumPixels &&
        (boundary.maximumPixels === null || slice.distance < boundary.maximumPixels),
      ).reduce((total, slice) => total + slice.length, 0);
      return {
        ...boundary,
        lengthPixels,
        ratio: totalLength ? lengthPixels / totalLength : 0,
      };
    }),
  };
}

/**
 * Integrates matched physical segment length, rather than counting vertices.
 * Midpoint subdivision is capped at one source pixel, so drawing density does
 * not change the score.
 */
function lengthCoverageWithinTolerance(
  source: Array<{ points: PalmLinePoint[] }>,
  target: Array<{ points: PalmLinePoint[] }>,
  tolerance: number,
): number {
  const sourceSegments = toSegments(source);
  const targetSegments = toSegments(target);
  if (!sourceSegments.length || !targetSegments.length) return 0;
  const toleranceSquared = tolerance ** 2;
  let totalLength = 0;
  let matchedLength = 0;
  sourceSegments.forEach((segment) => {
    const length = Math.hypot(segment.to.x - segment.from.x, segment.to.y - segment.from.y);
    const steps = Math.max(1, Math.ceil(length));
    const stepLength = length / steps;
    totalLength += length;
    for (let step = 0; step < steps; step += 1) {
      const ratio = (step + 0.5) / steps;
      const midpoint = {
        x: segment.from.x + (segment.to.x - segment.from.x) * ratio,
        y: segment.from.y + (segment.to.y - segment.from.y) * ratio,
      };
      if (targetSegments.some((targetSegment) =>
        squaredDistanceToSegment(midpoint, targetSegment) <= toleranceSquared)) {
        matchedLength += stepLength;
      }
    }
  });
  return totalLength ? matchedLength / totalLength : 0;
}

/** Symmetric, length-weighted pixel-tolerance comparison; this is not accuracy. */
export function evaluatePalmLineAgreement(
  candidates: PalmLineCandidate[],
  annotations: ManualPalmLineAnnotation[],
  tolerancePixels = 6,
): PalmLineAgreement | null {
  if (!toSegments(annotations).length) return null;
  const manualCoverage = lengthCoverageWithinTolerance(annotations, candidates, tolerancePixels);
  const candidatePrecision = lengthCoverageWithinTolerance(candidates, annotations, tolerancePixels);
  const harmonicScore = manualCoverage + candidatePrecision
    ? (2 * manualCoverage * candidatePrecision) / (manualCoverage + candidatePrecision)
    : 0;
  return { tolerancePixels, manualCoverage, candidatePrecision, harmonicScore };
}

/** Development-only visualization data; "outside annotation" is not a false-positive label. */
export function createPalmLineErrorDiagnostics(
  source: RgbaImage,
  candidates: PalmLineCandidate[],
  annotations: ManualPalmLineAnnotation[],
  tolerancePixels = 6,
): PalmLineErrorDiagnostics {
  const candidateSlices = measureDistanceSlices(candidates, annotations);
  const manualSlices = measureDistanceSlices(annotations, candidates);
  const candidateNearLength = candidateSlices.filter((slice) => slice.distance <= tolerancePixels)
    .reduce((total, slice) => total + slice.length, 0);
  const candidateTotal = candidateSlices.reduce((total, slice) => total + slice.length, 0);
  const manualCoveredLength = manualSlices.filter((slice) => slice.distance <= tolerancePixels)
    .reduce((total, slice) => total + slice.length, 0);
  const manualTotal = manualSlices.reduce((total, slice) => total + slice.length, 0);
  const overlay = { width: source.width, height: source.height, data: new Uint8ClampedArray(source.data) };
  candidateSlices.forEach((slice) => drawLine(
    overlay.data,
    overlay.width,
    overlay.height,
    slice.from,
    slice.to,
    slice.distance <= tolerancePixels ? [16, 185, 129] : [217, 70, 239],
    1,
  ));
  manualSlices.forEach((slice) => drawLine(
    overlay.data,
    overlay.width,
    overlay.height,
    slice.from,
    slice.to,
    slice.distance <= tolerancePixels ? [250, 204, 21] : [239, 68, 68],
    2,
  ));
  return {
    tolerancePixels,
    candidateNearLength,
    candidateOutsideAnnotationLength: candidateTotal - candidateNearLength,
    manualCoveredLength,
    manualUncoveredLength: manualTotal - manualCoveredLength,
    candidateToManual: summarizeDistanceSlices(candidateSlices),
    manualToCandidate: summarizeDistanceSlices(manualSlices),
    overlay,
  };
}

export function measurePalmInteriorCandidates(
  candidates: PalmLineCandidate[],
  geometry: PalmInteriorGeometry,
): PalmInteriorCandidateMetrics | null {
  if (!geometry.reliable || geometry.polygon.length < 4) return null;
  const feather = Math.max(4, Math.min(geometry.width, geometry.height) * 0.06);
  let outsideLengthPixels = 0;
  let totalLengthPixels = 0;
  let outsideCandidateCount = 0;
  candidates.forEach((candidate) => {
    let candidateOutside = 0;
    let candidateTotal = 0;
    toSegments([candidate]).forEach((segment) => {
      const length = Math.hypot(segment.to.x - segment.from.x, segment.to.y - segment.from.y);
      const steps = Math.max(1, Math.ceil(length));
      for (let step = 0; step < steps; step += 1) {
        const ratio = (step + 0.5) / steps;
        const x = Math.max(0, Math.min(geometry.width - 1, Math.round(segment.from.x + (segment.to.x - segment.from.x) * ratio)));
        const y = Math.max(0, Math.min(geometry.height - 1, Math.round(segment.from.y + (segment.to.y - segment.from.y) * ratio)));
        const sliceLength = length / steps;
        candidateTotal += sliceLength;
        if (palmInteriorWeightAt({ x, y }, geometry.polygon, feather) < 0.5) candidateOutside += sliceLength;
      }
    });
    totalLengthPixels += candidateTotal;
    outsideLengthPixels += candidateOutside;
    if (candidateTotal && candidateOutside / candidateTotal >= 0.25) outsideCandidateCount += 1;
  });
  return {
    candidateCount: candidates.length,
    totalLengthPixels,
    outsideCandidateCount,
    outsideLengthPixels,
  };
}
