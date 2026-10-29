import { PALM_ROI_ALGORITHM_VERSION } from "./palm-roi";
import { createStoredZip, readStoredZipEntries } from "./zip-archive";

export const PALM_BENCHMARK_FORMAT = "metemu-palm-benchmark";
export const PALM_BENCHMARK_VERSION = 1;

export type PalmPilotSplit = "development" | "holdout";
export type PalmExportValidationStatus = "valid" | "invalid" | "undetermined";

export interface PalmExportPoint {
  x: number;
  y: number;
}

export interface PalmExportCandidate {
  id: string;
  points: PalmExportPoint[];
  length_pixels: number;
}

export interface PalmJavaScriptBaselineExport {
  algorithm_version: string;
  parameter_version: string;
  status: "detected" | "abstain";
  abstain_reason: string | null;
  candidate_count: number;
  total_length_pixels: number;
  near_outer_contour_count: number | null;
  processing_time_ms: number;
  candidates: PalmExportCandidate[];
}

export interface PalmBenchmarkManifestSample {
  sample_id: string;
  source_fingerprint: string;
  roi_path: string;
  roi_sha256: string;
  roi_pixel_sha256: string;
  roi_signature: string;
  roi_width: number;
  roi_height: number;
  roi_algorithm_version: string;
  roi_method: string;
  rotation_degrees: number;
  padding_scale: number;
  subject_group: string;
  hand_group: string;
  camera_group: string;
  split: PalmPilotSplit;
  quality_status: string;
  javascript_baseline: PalmJavaScriptBaselineExport;
}

export interface PalmBenchmarkManifest {
  format: typeof PALM_BENCHMARK_FORMAT;
  version: typeof PALM_BENCHMARK_VERSION;
  annotations: string;
  samples: PalmBenchmarkManifestSample[];
}

export interface PalmAnnotationExportSample {
  sample_id: string;
  sample_fingerprint: string;
  roi_signature: string | null;
  roi_width: number | null;
  roi_height: number | null;
  roi_algorithm_version: string | null;
  annotation_status?: string;
  status?: string;
  completeness?: string;
  polylines?: Array<{ id?: string; points?: PalmExportPoint[] }>;
}

function stableHash(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Subject-level deterministic split; every image from one subject stays together. */
export function assignPalmPilotSplit(subjectGroup: string): PalmPilotSplit {
  return stableHash(subjectGroup) % 4 === 0 ? "holdout" : "development";
}

export function createPalmExportStem(sampleId: string): string {
  const safe = sampleId.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return safe || "palm-sample";
}

export function createPalmBenchmarkManifest(input: {
  annotationsFile: string;
  sample: PalmBenchmarkManifestSample;
}): PalmBenchmarkManifest {
  return {
    format: PALM_BENCHMARK_FORMAT,
    version: PALM_BENCHMARK_VERSION,
    annotations: input.annotationsFile,
    samples: [input.sample],
  };
}

export function createPalmBenchmarkArchive(input: {
  roiFilename: string;
  roiBytes: Uint8Array;
  annotationFilename: string;
  annotationBytes: Uint8Array;
  manifestFilename: string;
  manifest: PalmBenchmarkManifest;
}): Uint8Array {
  const sample = input.manifest.samples[0];
  if (input.manifest.samples.length !== 1 || !sample) {
    throw new Error("Paket ekspor harus memuat tepat satu sampel.");
  }
  if (sample.roi_path !== input.roiFilename || input.manifest.annotations !== input.annotationFilename) {
    throw new Error("Referensi file di manifest tidak cocok dengan isi paket.");
  }
  const manifestBytes = new TextEncoder().encode(JSON.stringify(input.manifest, null, 2));
  const archive = createStoredZip([
    { name: input.roiFilename, data: input.roiBytes },
    { name: input.annotationFilename, data: input.annotationBytes },
    { name: input.manifestFilename, data: manifestBytes },
  ]);
  const packaged = readStoredZipEntries(archive);
  const required = [input.roiFilename, input.annotationFilename, input.manifestFilename];
  if (packaged.size !== required.length || required.some((name) => !packaged.has(name))) {
    throw new Error("Paket ZIP tidak lengkap; unduhan dibatalkan.");
  }
  return archive;
}

function validSha256(value: string): boolean {
  return /^[a-f0-9]{64}$/i.test(value);
}

function validPolylines(
  value: PalmAnnotationExportSample["polylines"],
  width: number,
  height: number,
): boolean {
  return Boolean(value?.length && value.every((polyline) =>
    Array.isArray(polyline.points) && polyline.points.length >= 2 &&
    polyline.points.every((point) =>
      Number.isFinite(point.x) && Number.isFinite(point.y) &&
      point.x >= 0 && point.x < width && point.y >= 0 && point.y < height,
    ),
  ));
}

/** Pure validation shared by UI tests; it never repairs or rescales mismatches. */
export function validatePalmExportPair(input: {
  manifest: PalmBenchmarkManifestSample;
  annotation: PalmAnnotationExportSample | null;
  actualRoiSha256: string;
  actualPixelSha256: string;
  actualWidth: number;
  actualHeight: number;
}): { status: PalmExportValidationStatus; reasons: string[] } {
  const { manifest, annotation } = input;
  const reasons: string[] = [];
  if (!validSha256(manifest.source_fingerprint)) reasons.push("Fingerprint sumber tidak valid.");
  if (!validSha256(manifest.roi_sha256) || manifest.roi_sha256 !== input.actualRoiSha256) {
    reasons.push("SHA-256 file ROI tidak cocok.");
  }
  if (!validSha256(manifest.roi_pixel_sha256) || manifest.roi_pixel_sha256 !== input.actualPixelSha256) {
    reasons.push("SHA-256 piksel ROI tidak cocok.");
  }
  if (manifest.roi_width !== input.actualWidth || manifest.roi_height !== input.actualHeight) {
    reasons.push("Dimensi file ROI tidak cocok.");
  }
  if (manifest.roi_algorithm_version !== PALM_ROI_ALGORITHM_VERSION) {
    reasons.push("Versi algoritma ROI tidak cocok.");
  }
  if (!annotation) {
    reasons.push("Anotasi pasangan tidak ditemukan.");
    return { status: "invalid", reasons };
  }
  if (annotation.sample_id !== manifest.sample_id ||
      annotation.sample_fingerprint !== manifest.source_fingerprint) {
    reasons.push("Identitas anonim atau fingerprint anotasi tidak cocok.");
  }
  if (annotation.roi_signature !== manifest.roi_signature) reasons.push("ROI signature tidak cocok.");
  if (annotation.roi_width !== manifest.roi_width || annotation.roi_height !== manifest.roi_height) {
    reasons.push("Dimensi anotasi tidak cocok.");
  }
  if (annotation.roi_algorithm_version !== manifest.roi_algorithm_version) {
    reasons.push("Versi ROI anotasi tidak cocok.");
  }
  const status = annotation.annotation_status ?? annotation.status ?? "unreviewed";
  if (reasons.length) return { status: "invalid", reasons };
  if (status === "undetermined") {
    return { status: "undetermined", reasons: ["Anotasi ditandai belum dapat ditentukan."] };
  }
  if (status !== "annotated" || !validPolylines(annotation.polylines, manifest.roi_width, manifest.roi_height)) {
    return { status: "invalid", reasons: ["Polyline manual tidak tersedia atau berada di luar ROI."] };
  }
  return { status: "valid", reasons: [] };
}
