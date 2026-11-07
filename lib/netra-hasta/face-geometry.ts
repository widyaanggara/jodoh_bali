import type { Matrix, NormalizedLandmark } from "@mediapipe/tasks-vision";

const FACE_TOP = 10;
const GLABELLA = 168;
const NOSE_BASE = 2;
const CHIN = 152;
const FACE_LEFT = 234;
const FACE_RIGHT = 454;

const RADIANS_TO_DEGREES = 180 / Math.PI;

export interface FaceOrientation {
  yaw: number;
  pitch: number;
  roll: number;
}

export interface FaceGeometry {
  relativeWidth: number;
  relativeHeight: number;
  heightToWidthRatio: number;
  upperFaceRatio: number;
  middleFaceRatio: number;
  lowerFaceRatio: number;
  bounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  orientation: FaceOrientation | null;
}

interface PixelPoint {
  x: number;
  y: number;
}

function toPixelPoint(
  landmark: NormalizedLandmark,
  imageWidth: number,
  imageHeight: number,
): PixelPoint {
  return {
    x: landmark.x * imageWidth,
    y: landmark.y * imageHeight,
  };
}

function distance(a: PixelPoint, b: PixelPoint): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(maximum, Math.max(minimum, value));
}

/**
 * Extracts Euler angles from MediaPipe's row-major 4x4 pose matrix.
 * The absolute values are intended for a conservative alignment gate, not for
 * calibrated pose measurement. Camera optics and model jitter affect results.
 */
export function getFaceOrientation(matrix?: Matrix): FaceOrientation | null {
  if (!matrix || matrix.rows !== 4 || matrix.columns !== 4 || matrix.data.length < 16) {
    return null;
  }

  const rotation = matrix.data;
  const yaw = Math.asin(clamp(-rotation[8], -1, 1));
  const pitch = Math.atan2(rotation[9], rotation[10]);
  const roll = Math.atan2(rotation[4], rotation[0]);

  return {
    yaw: yaw * RADIANS_TO_DEGREES,
    pitch: pitch * RADIANS_TO_DEGREES,
    roll: roll * RADIANS_TO_DEGREES,
  };
}

/**
 * Computes normalized, reproducible geometry only. It intentionally does not
 * attach cultural, personality, health, ethnicity, or attractiveness meaning.
 */
export function calculateFaceGeometry(
  landmarks: NormalizedLandmark[],
  imageWidth: number,
  imageHeight: number,
  transformationMatrix?: Matrix,
): FaceGeometry | null {
  if (
    landmarks.length <= FACE_RIGHT ||
    imageWidth <= 0 ||
    imageHeight <= 0
  ) {
    return null;
  }

  const xValues = landmarks.map((point) => point.x);
  const yValues = landmarks.map((point) => point.y);
  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);
  const minY = Math.min(...yValues);
  const maxY = Math.max(...yValues);

  const top = toPixelPoint(landmarks[FACE_TOP], imageWidth, imageHeight);
  const glabella = toPixelPoint(landmarks[GLABELLA], imageWidth, imageHeight);
  const noseBase = toPixelPoint(landmarks[NOSE_BASE], imageWidth, imageHeight);
  const chin = toPixelPoint(landmarks[CHIN], imageWidth, imageHeight);
  const left = toPixelPoint(landmarks[FACE_LEFT], imageWidth, imageHeight);
  const right = toPixelPoint(landmarks[FACE_RIGHT], imageWidth, imageHeight);

  const faceWidth = distance(left, right);
  const faceHeight = distance(top, chin);
  if (faceWidth === 0 || faceHeight === 0) return null;

  return {
    relativeWidth: maxX - minX,
    relativeHeight: maxY - minY,
    heightToWidthRatio: faceHeight / faceWidth,
    upperFaceRatio: distance(top, glabella) / faceHeight,
    middleFaceRatio: distance(glabella, noseBase) / faceHeight,
    lowerFaceRatio: distance(noseBase, chin) / faceHeight,
    bounds: { minX, maxX, minY, maxY },
    orientation: getFaceOrientation(transformationMatrix),
  };
}
