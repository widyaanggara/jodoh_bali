import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { RgbaImage } from "./palm-preprocessing";

const WRIST = 0;
const INDEX_MCP = 5;
const MIDDLE_MCP = 9;
const PINKY_MCP = 17;

export interface PalmQualityConfig {
  minimumBrightness: number;
  maximumBrightness: number;
  minimumContrast: number;
  minimumSharpness: number;
  stabilityWindowMs: number;
  minimumStableSamples: number;
  maximumCentroidDeviation: number;
  maximumScaleDeviationRatio: number;
}

/**
 * Pixel metrics use the 0-255 luminance scale. Contrast is luminance standard
 * deviation and sharpness is the mean absolute four-neighbour Laplacian.
 * Stability uses normalized landmark coordinates over a timestamped window.
 * These tunable heuristics are capture guidance, not scientific measurements.
 */
export const DEFAULT_PALM_QUALITY_CONFIG: PalmQualityConfig = {
  minimumBrightness: 55,
  maximumBrightness: 205,
  minimumContrast: 22,
  minimumSharpness: 7,
  stabilityWindowMs: 700,
  minimumStableSamples: 7,
  maximumCentroidDeviation: 0.018,
  maximumScaleDeviationRatio: 0.08,
};

export interface PalmImageMetrics {
  brightness: number;
  contrast: number;
  sharpness: number;
  darkPixelRatio: number;
  brightPixelRatio: number;
}

export interface PalmPoseSample {
  timestamp: number;
  centroidX: number;
  centroidY: number;
  scale: number;
}

export interface PalmStabilityResult {
  stable: boolean;
  sampleCount: number;
  durationMs: number;
  centroidDeviation: number;
  scaleDeviationRatio: number;
}

export type PalmQualityStatus =
  | "searching"
  | "multiple-hands"
  | "clipped"
  | "too-far"
  | "too-dark"
  | "too-bright"
  | "low-contrast"
  | "blurry"
  | "unstable"
  | "ready";

export interface PalmQualityCheck {
  key: "single-hand" | "roi" | "light" | "contrast" | "sharpness" | "stability";
  label: string;
  gate: "hard" | "soft";
  passed: boolean;
  value?: string;
  target?: string;
}

export interface PalmQualityReport {
  status: PalmQualityStatus;
  isReady: boolean;
  hardGatePassed: boolean;
  softGatePassed: boolean;
  manualCaptureAllowed: boolean;
  message: string;
  checks: PalmQualityCheck[];
  imageMetrics: PalmImageMetrics | null;
  stability: PalmStabilityResult;
}

export interface PalmQualitySnapshot extends PalmQualityReport {
  capturedAt: number;
}

export function snapshotPalmQualityReport(
  report: PalmQualityReport,
  capturedAt = Date.now(),
): PalmQualitySnapshot {
  return {
    ...report,
    capturedAt,
    checks: report.checks.map((check) => ({ ...check })),
    imageMetrics: report.imageMetrics ? { ...report.imageMetrics } : null,
    stability: { ...report.stability },
  };
}

export type PalmCaptureDecisionMode = "blocked" | "normal" | "manual";

export interface PalmCaptureDecision {
  mode: PalmCaptureDecisionMode;
  canCapture: boolean;
  failedHardChecks: PalmQualityCheck[];
  failedSoftChecks: PalmQualityCheck[];
}

interface PalmCaptureDecisionInput {
  cameraActive: boolean;
  hasConsent: boolean;
  quality: PalmQualityReport;
}

/**
 * Produces the single capture decision shared by the UI and capture handler.
 * Camera/consent and every hard metric must pass. Soft failures switch the
 * action to an explicit manual override instead of blocking capture.
 */
export function getPalmCaptureDecision({
  cameraActive,
  hasConsent,
  quality,
}: PalmCaptureDecisionInput): PalmCaptureDecision {
  const failedHardChecks = quality.checks.filter(
    (check) => check.gate === "hard" && !check.passed,
  );
  const failedSoftChecks = quality.checks.filter(
    (check) => check.gate === "soft" && !check.passed,
  );
  const hardGatePassed =
    cameraActive &&
    hasConsent &&
    quality.hardGatePassed &&
    failedHardChecks.length === 0;

  if (!hardGatePassed) {
    return {
      mode: "blocked",
      canCapture: false,
      failedHardChecks,
      failedSoftChecks,
    };
  }

  return {
    mode: failedSoftChecks.length === 0 ? "normal" : "manual",
    canCapture: true,
    failedHardChecks,
    failedSoftChecks,
  };
}

export function createPalmPoseSample(
  landmarks: NormalizedLandmark[],
  timestamp: number,
): PalmPoseSample | null {
  const points = [WRIST, INDEX_MCP, MIDDLE_MCP, PINKY_MCP].map(
    (index) => landmarks[index],
  );
  if (points.some((point) => !point)) return null;

  const centroidX = points.reduce((total, point) => total + point.x, 0) / points.length;
  const centroidY = points.reduce((total, point) => total + point.y, 0) / points.length;
  const palmWidth = Math.hypot(
    landmarks[INDEX_MCP].x - landmarks[PINKY_MCP].x,
    landmarks[INDEX_MCP].y - landmarks[PINKY_MCP].y,
  );
  const palmHeight = Math.hypot(
    landmarks[WRIST].x - landmarks[MIDDLE_MCP].x,
    landmarks[WRIST].y - landmarks[MIDDLE_MCP].y,
  );

  return {
    timestamp,
    centroidX,
    centroidY,
    scale: palmWidth + palmHeight,
  };
}

export function calculatePalmStability(
  samples: PalmPoseSample[],
  now: number,
  config: PalmQualityConfig = DEFAULT_PALM_QUALITY_CONFIG,
): PalmStabilityResult {
  const recentSamples = samples.filter(
    (sample) => now - sample.timestamp <= config.stabilityWindowMs,
  );
  if (recentSamples.length === 0) {
    return {
      stable: false,
      sampleCount: 0,
      durationMs: 0,
      centroidDeviation: Number.POSITIVE_INFINITY,
      scaleDeviationRatio: Number.POSITIVE_INFINITY,
    };
  }

  const meanX = recentSamples.reduce((total, sample) => total + sample.centroidX, 0) / recentSamples.length;
  const meanY = recentSamples.reduce((total, sample) => total + sample.centroidY, 0) / recentSamples.length;
  const meanScale = recentSamples.reduce((total, sample) => total + sample.scale, 0) / recentSamples.length;
  const centroidDeviation = Math.max(
    ...recentSamples.map((sample) =>
      Math.hypot(sample.centroidX - meanX, sample.centroidY - meanY),
    ),
  );
  const scaleDeviationRatio = meanScale
    ? Math.max(...recentSamples.map((sample) => Math.abs(sample.scale - meanScale))) / meanScale
    : Number.POSITIVE_INFINITY;
  const durationMs = now - recentSamples[0].timestamp;

  return {
    stable:
      recentSamples.length >= config.minimumStableSamples &&
      durationMs >= config.stabilityWindowMs * 0.65 &&
      centroidDeviation <= config.maximumCentroidDeviation &&
      scaleDeviationRatio <= config.maximumScaleDeviationRatio,
    sampleCount: recentSamples.length,
    durationMs,
    centroidDeviation,
    scaleDeviationRatio,
  };
}

/**
 * Estimates luminance, standard-deviation contrast, and mean absolute
 * Laplacian sharpness. Values are heuristics for capture guidance, not
 * calibrated scientific image-quality measurements.
 */
export function analyzePalmImageQuality(image: RgbaImage): PalmImageMetrics {
  const pixelCount = image.width * image.height;
  if (pixelCount === 0) {
    return { brightness: 0, contrast: 0, sharpness: 0, darkPixelRatio: 1, brightPixelRatio: 0 };
  }

  const luminance = new Float32Array(pixelCount);
  let sum = 0;
  let darkPixels = 0;
  let brightPixels = 0;

  for (let pixel = 0, index = 0; pixel < pixelCount; pixel += 1, index += 4) {
    const value =
      0.299 * image.data[index] +
      0.587 * image.data[index + 1] +
      0.114 * image.data[index + 2];
    luminance[pixel] = value;
    sum += value;
    if (value < 30) darkPixels += 1;
    if (value > 235) brightPixels += 1;
  }

  const brightness = sum / pixelCount;
  let varianceSum = 0;
  luminance.forEach((value) => {
    varianceSum += (value - brightness) ** 2;
  });
  const contrast = Math.sqrt(varianceSum / pixelCount);

  let laplacianSum = 0;
  let laplacianCount = 0;
  for (let y = 1; y < image.height - 1; y += 1) {
    for (let x = 1; x < image.width - 1; x += 1) {
      const center = y * image.width + x;
      const laplacian =
        4 * luminance[center] -
        luminance[center - 1] -
        luminance[center + 1] -
        luminance[center - image.width] -
        luminance[center + image.width];
      laplacianSum += Math.abs(laplacian);
      laplacianCount += 1;
    }
  }

  return {
    brightness,
    contrast,
    sharpness: laplacianCount ? laplacianSum / laplacianCount : 0,
    darkPixelRatio: darkPixels / pixelCount,
    brightPixelRatio: brightPixels / pixelCount,
  };
}

interface EvaluatePalmQualityInput {
  handCount: number;
  roiValid: boolean;
  palmLargeEnough: boolean;
  imageMetrics: PalmImageMetrics | null;
  stability: PalmStabilityResult;
  config?: PalmQualityConfig;
}

export function evaluatePalmQuality({
  handCount,
  roiValid,
  palmLargeEnough,
  imageMetrics,
  stability,
  config = DEFAULT_PALM_QUALITY_CONFIG,
}: EvaluatePalmQualityInput): PalmQualityReport {
  const singleHand = handCount === 1;
  const lightPassed = Boolean(
    imageMetrics &&
      imageMetrics.brightness >= config.minimumBrightness &&
      imageMetrics.brightness <= config.maximumBrightness,
  );
  const contrastPassed = Boolean(
    imageMetrics && imageMetrics.contrast >= config.minimumContrast,
  );
  const sharpnessPassed = Boolean(
    imageMetrics && imageMetrics.sharpness >= config.minimumSharpness,
  );

  const checks: PalmQualityCheck[] = [
    {
      key: "single-hand",
      label: "Satu tangan",
      gate: "hard",
      passed: singleHand,
      value: String(handCount),
      target: "harus 1",
    },
    {
      key: "roi",
      label: "ROI valid dan utuh",
      gate: "hard",
      passed: roiValid && palmLargeEnough,
      target: "tidak terpotong; min. 80 x 96 px",
    },
    {
      key: "stability",
      label: "Stabil",
      gate: "hard",
      passed: stability.stable,
      value: `${stability.sampleCount} frame / ${Math.round(stability.durationMs)} ms`,
      target: `min. ${config.minimumStableSamples} frame / ${Math.round(config.stabilityWindowMs * 0.65)} ms`,
    },
    {
      key: "light",
      label: "Pencahayaan",
      gate: "soft",
      passed: lightPassed,
      value: imageMetrics ? imageMetrics.brightness.toFixed(1) : "-",
      target: `${config.minimumBrightness}-${config.maximumBrightness}`,
    },
    {
      key: "contrast",
      label: "Kontras",
      gate: "soft",
      passed: contrastPassed,
      value: imageMetrics ? imageMetrics.contrast.toFixed(1) : "-",
      target: `min. ${config.minimumContrast.toFixed(1)}`,
    },
    {
      key: "sharpness",
      label: "Ketajaman",
      gate: "soft",
      passed: sharpnessPassed,
      value: imageMetrics ? imageMetrics.sharpness.toFixed(1) : "-",
      target: `min. ${config.minimumSharpness.toFixed(1)}`,
    },
  ];

  const hardGatePassed = checks
    .filter((check) => check.gate === "hard")
    .every((check) => check.passed);
  const softGatePassed = checks
    .filter((check) => check.gate === "soft")
    .every((check) => check.passed);

  let status: PalmQualityStatus = "ready";
  let message = "Posisi sesuai, siap mengambil gambar.";

  if (handCount === 0) {
    status = "searching";
    message = "Arahkan telapak tangan ke kamera.";
  } else if (handCount > 1) {
    status = "multiple-hands";
    message = "Pastikan hanya satu tangan berada di dalam kamera.";
  } else if (!roiValid) {
    status = "clipped";
    message = "Pastikan seluruh telapak dan pangkal pergelangan terlihat.";
  } else if (!palmLargeEnough) {
    status = "too-far";
    message = "Dekatkan tangan sedikit.";
  } else if (!stability.stable) {
    status = "unstable";
    message = "Tahan tangan agar tidak bergerak.";
  } else if (imageMetrics && imageMetrics.brightness < config.minimumBrightness) {
    status = "too-dark";
    message = "Pencahayaan terlalu redup.";
  } else if (imageMetrics && imageMetrics.brightness > config.maximumBrightness) {
    status = "too-bright";
    message = "Pencahayaan terlalu terang.";
  } else if (!contrastPassed) {
    status = "low-contrast";
    message = "Tambahkan cahaya merata agar detail telapak lebih jelas.";
  } else if (!sharpnessPassed) {
    status = "blurry";
    message = "Ketajaman gambar belum ideal. Anda tetap dapat mengambil gambar, tetapi hasil analisis garis tangan mungkin kurang akurat.";
  }

  return {
    status,
    isReady: hardGatePassed && softGatePassed,
    hardGatePassed,
    softGatePassed,
    manualCaptureAllowed: hardGatePassed && !softGatePassed,
    message,
    checks,
    imageMetrics,
    stability,
  };
}

export function createInitialPalmQualityReport(): PalmQualityReport {
  return evaluatePalmQuality({
    handCount: 0,
    roiValid: false,
    palmLargeEnough: false,
    imageMetrics: null,
    stability: calculatePalmStability([], 0),
  });
}
