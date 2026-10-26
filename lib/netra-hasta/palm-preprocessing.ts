export interface RgbaImage {
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface PalmPreprocessingConfig {
  lowPercentile: number;
  highPercentile: number;
  maximumContrastGain: number;
}

export const DEFAULT_PALM_PREPROCESSING_CONFIG: PalmPreprocessingConfig = {
  lowPercentile: 0.05,
  highPercentile: 0.95,
  maximumContrastGain: 1.35,
};

export interface ProcessedPalmImages {
  original: RgbaImage;
  grayscale: RgbaImage;
  enhanced: RgbaImage;
}

export interface PalmCapture extends ProcessedPalmImages {
  capturedAt: number;
  handedness: "Left" | "Right" | null;
  rotationDegrees: number;
  qualityMode: "normal" | "manual-override";
  qualityWarnings: string[];
}

export function wipePalmCapture(capture: PalmCapture | null): void {
  if (!capture) return;
  capture.original.data.fill(0);
  capture.grayscale.data.fill(0);
  capture.enhanced.data.fill(0);
}

function cloneImage(source: RgbaImage): RgbaImage {
  return {
    width: source.width,
    height: source.height,
    data: new Uint8ClampedArray(source.data),
  };
}

export function convertToGrayscale(source: RgbaImage): RgbaImage {
  const output = new Uint8ClampedArray(source.data.length);

  for (let index = 0; index < source.data.length; index += 4) {
    const red = source.data[index];
    const green = source.data[index + 1];
    const blue = source.data[index + 2];
    const luminance = Math.round(0.299 * red + 0.587 * green + 0.114 * blue);
    output[index] = luminance;
    output[index + 1] = luminance;
    output[index + 2] = luminance;
    output[index + 3] = source.data[index + 3];
  }

  return { width: source.width, height: source.height, data: output };
}

function percentileFromHistogram(
  histogram: Uint32Array,
  totalPixels: number,
  percentile: number,
): number {
  const target = Math.max(0, Math.min(totalPixels - 1, Math.floor(totalPixels * percentile)));
  let cumulative = 0;
  for (let value = 0; value < histogram.length; value += 1) {
    cumulative += histogram[value];
    if (cumulative > target) return value;
  }
  return 255;
}

/**
 * Applies capped linear contrast expansion around the percentile midpoint.
 * No sharpening or edge synthesis is used, which limits creation of false lines.
 */
export function enhancePalmContrast(
  grayscale: RgbaImage,
  config: PalmPreprocessingConfig = DEFAULT_PALM_PREPROCESSING_CONFIG,
): RgbaImage {
  const histogram = new Uint32Array(256);
  const totalPixels = grayscale.width * grayscale.height;
  for (let index = 0; index < grayscale.data.length; index += 4) {
    histogram[grayscale.data[index]] += 1;
  }

  const low = percentileFromHistogram(histogram, totalPixels, config.lowPercentile);
  const high = percentileFromHistogram(histogram, totalPixels, config.highPercentile);
  const range = Math.max(1, high - low);
  const gain = Math.min(config.maximumContrastGain, 255 / range);
  const midpoint = (low + high) / 2;
  const output = new Uint8ClampedArray(grayscale.data.length);

  for (let index = 0; index < grayscale.data.length; index += 4) {
    const value = Math.round(128 + (grayscale.data[index] - midpoint) * gain);
    const clamped = Math.max(0, Math.min(255, value));
    output[index] = clamped;
    output[index + 1] = clamped;
    output[index + 2] = clamped;
    output[index + 3] = grayscale.data[index + 3];
  }

  return { width: grayscale.width, height: grayscale.height, data: output };
}

export function preprocessPalmImage(source: RgbaImage): ProcessedPalmImages {
  const original = cloneImage(source);
  const grayscale = convertToGrayscale(original);
  const enhanced = enhancePalmContrast(grayscale);
  return { original, grayscale, enhanced };
}
