import type { RgbaImage } from "./palm-preprocessing";

export const PALM_LINE_RUNTIME_VERSION = "dark-ridge-v1";

export interface PalmLineRuntimePoint {
  x: number;
  y: number;
}

export interface PalmLineRuntimeCandidate {
  id: string;
  points: PalmLineRuntimePoint[];
  lengthPixels: number;
  continuity: number;
  averageResponse: number;
}

export interface PalmLineRuntimeConfig {
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

export const DEFAULT_PALM_LINE_RUNTIME_CONFIG: PalmLineRuntimeConfig = {
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

export interface PalmLineRuntimeResult {
  status: "detected" | "abstain";
  abstainReason: string | null;
  candidates: PalmLineRuntimeCandidate[];
  overlay: RgbaImage;
  processingMs: number;
}

function clampByte(value: number): number {
  return Math.max(0, Math.min(255, Math.round(value)));
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

function boxBlur(
  values: Float32Array,
  width: number,
  height: number,
  radius: number,
): Float32Array {
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

function standardDeviation(values: Float32Array): number {
  const mean = values.reduce((total, value) => total + value, 0) / values.length;
  const variance = values.reduce(
    (total, value) => total + (value - mean) ** 2,
    0,
  ) / values.length;
  return Math.sqrt(variance);
}

function textureEnergy(values: Float32Array, width: number, height: number): number {
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
  config: PalmLineRuntimeConfig,
): Float32Array {
  const illumination = boxBlur(grayscale, width, height, config.illuminationRadius);
  const normalized = new Float32Array(grayscale.length);
  for (let index = 0; index < grayscale.length; index += 1) {
    normalized[index] = clampByte(
      128 + (grayscale[index] - illumination[index]) * config.localContrastGain,
    );
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
  config: PalmLineRuntimeConfig,
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
        strongest = Math.max(strongest, sideTotal / samples - lineTotal / 3);
      }
      const index = y * width + x;
      response[index] = strongest;
      if (strongest >= config.responseThreshold) binary[index] = 1;
    }
  }
  return { response, binary };
}

function filterNeighbors(
  binary: Uint8Array,
  width: number,
  height: number,
  minimum: number,
): Uint8Array {
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

function dilate(binary: Uint8Array, width: number, height: number, radius: number) {
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

function erode(binary: Uint8Array, width: number, height: number, radius: number) {
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

function thinBinary(
  binary: Uint8Array,
  width: number,
  height: number,
  iterations: number,
): Uint8Array {
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
            (total, value, position) =>
              total + (value === 0 && n[(position + 1) % 8] === 1 ? 1 : 0),
            0,
          );
          const phaseCondition = phase === 0
            ? n[0] * n[2] * n[4] === 0 && n[2] * n[4] * n[6] === 0
            : n[0] * n[2] * n[6] === 0 && n[0] * n[4] * n[6] === 0;
          if (count >= 2 && count <= 6 && transitions === 1 && phaseCondition) {
            remove.push(index);
          }
        }
      }
      remove.forEach((index) => { output[index] = 0; });
      if (remove.length) changed = true;
    }
    if (!changed) break;
  }
  return output;
}

function neighborIndices(
  index: number,
  binary: Uint8Array,
  width: number,
  height: number,
): number[] {
  const x = index % width;
  const y = Math.floor(index / width);
  const result: number[] = [];
  for (let dy = -1; dy <= 1; dy += 1) {
    for (let dx = -1; dx <= 1; dx += 1) {
      if (
        (!dx && !dy) ||
        x + dx < 0 || x + dx >= width ||
        y + dy < 0 || y + dy >= height
      ) continue;
      const neighbor = (y + dy) * width + x + dx;
      if (binary[neighbor]) result.push(neighbor);
    }
  }
  return result;
}

function connectedComponents(binary: Uint8Array, width: number, height: number) {
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

function farthestPath(
  start: number,
  allowed: Set<number>,
  binary: Uint8Array,
  width: number,
  height: number,
) {
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

function simplifyPath(
  points: PalmLineRuntimePoint[],
  minimumDistance: number,
): PalmLineRuntimePoint[] {
  if (points.length <= 2) return points;
  const output = [points[0]];
  for (let index = 1; index < points.length - 1; index += 1) {
    const previous = output[output.length - 1];
    if (
      Math.hypot(points[index].x - previous.x, points[index].y - previous.y) >=
      minimumDistance
    ) output.push(points[index]);
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
  config: PalmLineRuntimeConfig,
): PalmLineRuntimeCandidate[] {
  const minimumLength = Math.min(width, height) * config.minimumLengthRatio;
  const candidates: PalmLineRuntimeCandidate[] = [];
  connectedComponents(binary, width, height).forEach((component) => {
    if (component.length < minimumLength) return;
    const allowed = new Set(component);
    const endpoint = component.find(
      (index) => neighborIndices(index, binary, width, height).length === 1,
    ) ?? component[0];
    const first = farthestPath(endpoint, allowed, binary, width, height).farthest;
    const secondPass = farthestPath(first, allowed, binary, width, height);
    const path = [secondPass.farthest];
    while (path[path.length - 1] !== first) {
      const next = secondPass.parent.get(path[path.length - 1]);
      if (next === undefined) break;
      path.push(next);
    }
    if (path.length < minimumLength) return;
    const points = simplifyPath(
      path.map((index) => ({
        x: (index % width) / sourceScale,
        y: Math.floor(index / width) / sourceScale,
      })),
      Math.max(2, 3 / sourceScale),
    );
    let lengthPixels = 0;
    for (let index = 1; index < points.length; index += 1) {
      lengthPixels += Math.hypot(
        points[index].x - points[index - 1].x,
        points[index].y - points[index - 1].y,
      );
    }
    candidates.push({
      id: `candidate-${candidates.length + 1}`,
      points,
      lengthPixels,
      continuity: Math.min(1, path.length / component.length),
      averageResponse: path.reduce((total, index) => total + response[index], 0) /
        path.length,
    });
  });
  return candidates
    .sort((left, right) => right.lengthPixels - left.lengthPixels)
    .slice(0, config.maximumCandidates)
    .map((candidate, index) => ({ ...candidate, id: `candidate-${index + 1}` }));
}

function drawLine(
  data: Uint8ClampedArray,
  width: number,
  height: number,
  from: PalmLineRuntimePoint,
  to: PalmLineRuntimePoint,
) {
  const steps = Math.max(1, Math.ceil(Math.hypot(to.x - from.x, to.y - from.y)));
  for (let step = 0; step <= steps; step += 1) {
    const x = Math.round(from.x + (to.x - from.x) * (step / steps));
    const y = Math.round(from.y + (to.y - from.y) * (step / steps));
    for (let dy = -1; dy <= 1; dy += 1) {
      for (let dx = -1; dx <= 1; dx += 1) {
        if (x + dx < 0 || x + dx >= width || y + dy < 0 || y + dy >= height) continue;
        const offset = ((y + dy) * width + x + dx) * 4;
        data[offset] = 0;
        data[offset + 1] = 255;
        data[offset + 2] = 255;
        data[offset + 3] = 255;
      }
    }
  }
}

function buildOverlay(source: RgbaImage, candidates: PalmLineRuntimeCandidate[]): RgbaImage {
  const data = new Uint8ClampedArray(source.data);
  candidates.forEach((candidate) => {
    for (let index = 1; index < candidate.points.length; index += 1) {
      drawLine(
        data,
        source.width,
        source.height,
        candidate.points[index - 1],
        candidate.points[index],
      );
    }
  });
  return { width: source.width, height: source.height, data };
}

export function extractPalmLineRuntime(
  source: RgbaImage,
  config: PalmLineRuntimeConfig = DEFAULT_PALM_LINE_RUNTIME_CONFIG,
): PalmLineRuntimeResult {
  const startedAt = typeof performance === "undefined" ? Date.now() : performance.now();
  const working = resizeToGrayscale(source, config.maximumAnalysisDimension);
  const sourceContrast = standardDeviation(working.values);
  const sourceTextureEnergy = textureEnergy(working.values, working.width, working.height);
  const normalized = normalizeIllumination(
    working.values,
    working.width,
    working.height,
    config,
  );
  const ridge = detectDarkRidges(normalized, working.width, working.height, config);
  const filtered = filterNeighbors(
    ridge.binary,
    working.width,
    working.height,
    config.minimumNeighborCount,
  );
  const closed = erode(
    dilate(filtered, working.width, working.height, config.gapClosingRadius),
    working.width,
    working.height,
    config.gapClosingRadius,
  );
  const thinned = thinBinary(closed, working.width, working.height, config.thinningIterations);
  const candidatePixelRatio = thinned.reduce((total, value) => total + value, 0) /
    thinned.length;
  const candidates = traceCandidates(
    thinned,
    ridge.response,
    working.width,
    working.height,
    working.scale,
    config,
  );
  let abstainReason: string | null = null;
  if (sourceContrast < 2.5) {
    abstainReason = "Kontras citra terlalu rendah untuk mendukung kandidat garis.";
  } else if (sourceTextureEnergy > config.maximumTextureEnergy) {
    abstainReason = "Energi tekstur terlalu tinggi; kandidat tidak dapat dipisahkan dari noise.";
  } else if (candidatePixelRatio > 0.16) {
    abstainReason = "Respons tekstur terlalu padat; kandidat tidak dapat dipisahkan dari noise.";
  } else if (candidates.length === 0) {
    abstainReason = "Tidak ada segmen terhubung yang melewati panjang minimum.";
  }
  const acceptedCandidates = abstainReason ? [] : candidates;
  const finishedAt = typeof performance === "undefined" ? Date.now() : performance.now();
  return {
    status: abstainReason ? "abstain" : "detected",
    abstainReason,
    candidates: acceptedCandidates,
    overlay: buildOverlay(source, acceptedCandidates),
    processingMs: finishedAt - startedAt,
  };
}

export function wipePalmLineRuntime(result: PalmLineRuntimeResult | null): void {
  if (!result) return;
  result.overlay.data.fill(0);
  result.candidates.forEach((candidate) => {
    candidate.points.forEach((point) => {
      point.x = 0;
      point.y = 0;
    });
    candidate.points = [];
  });
  result.candidates = [];
}
