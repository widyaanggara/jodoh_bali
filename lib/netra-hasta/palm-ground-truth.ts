import {
  evaluatePalmLineAgreement,
  type ManualPalmLineAnnotation,
  type PalmLineAgreement,
  type PalmLineCandidate,
} from "./palm-line-extraction";

export const PALM_GROUND_TRUTH_FORMAT = "metemu-palm-lines";
export const PALM_GROUND_TRUTH_VERSION = 2;
export const PALM_GROUND_TRUTH_TOLERANCES = [3, 6, 9] as const;

export type PalmAnnotationStatus = "unreviewed" | "annotated" | "undetermined";
export type PalmAnnotationCompleteness = "complete" | "partial" | "unknown";
export type PalmAnnotationCompatibility =
  | "exact"
  | "legacy-confirmed"
  | "legacy-needs-mapping"
  | "roi-mismatch"
  | "version-mismatch"
  | "unmatched"
  | "invalid";

export interface PalmGroundTruthAnnotation {
  sourceVersion: 1 | 2;
  sampleId: string;
  sampleFingerprint: string | null;
  roiSignature: string | null;
  roiWidth: number | null;
  roiHeight: number | null;
  roiAlgorithmVersion: string | null;
  lineExtractionVersion: string | null;
  lineParameterVersion: string | null;
  status: PalmAnnotationStatus;
  completeness: PalmAnnotationCompleteness;
  compatibility: PalmAnnotationCompatibility;
  compatibilityReason: string;
  polylines: ManualPalmLineAnnotation[];
}

export interface PalmGroundTruthScore {
  tolerancePixels: number;
  coverage: number;
  precision: number;
  f1: number;
}

export interface PalmGroundTruthReport {
  annotationStatus: PalmAnnotationStatus;
  annotationCompleteness: PalmAnnotationCompleteness;
  compatibility: PalmAnnotationCompatibility;
  reviewStatus: "not-reviewed" | "provisional" | "reviewed";
  scoringStatus: "scored" | "unavailable" | "abstain";
  reason: string;
  roiAlgorithmVersion: string;
  lineExtractionVersion: string;
  lineParameterVersion: string;
  scores: PalmGroundTruthScore[];
}

export interface PalmAnnotationDocument {
  format: typeof PALM_GROUND_TRUTH_FORMAT;
  version: 1 | 2;
  samples: PalmGroundTruthAnnotation[];
}

export function resolveAnnotationCompatibility(
  annotation: PalmGroundTruthAnnotation,
  target: {
    sampleId: string;
    sampleFingerprint: string;
    roiSignature: string | null;
    roiWidth: number | null;
    roiHeight: number | null;
  },
  versions: {
    roiAlgorithmVersion: string;
    lineExtractionVersion: string;
    lineParameterVersion: string;
  },
): PalmGroundTruthAnnotation {
  if (annotation.sourceVersion === 1) {
    return {
      ...annotation,
      compatibility: "legacy-needs-mapping",
      compatibilityReason: "Format v1 wajib dipetakan manual.",
    };
  }
  if (annotation.sampleFingerprint !== target.sampleFingerprint) {
    return { ...annotation, compatibility: "unmatched", compatibilityReason: "Fingerprint sampel tidak cocok." };
  }
  if (annotation.roiSignature !== target.roiSignature ||
      annotation.roiWidth !== target.roiWidth || annotation.roiHeight !== target.roiHeight) {
    return { ...annotation, compatibility: "roi-mismatch", compatibilityReason: "Fingerprint cocok, tetapi signature atau dimensi ROI berbeda." };
  }
  if (annotation.roiAlgorithmVersion !== versions.roiAlgorithmVersion ||
      annotation.lineExtractionVersion !== versions.lineExtractionVersion ||
      annotation.lineParameterVersion !== versions.lineParameterVersion) {
    return { ...annotation, compatibility: "version-mismatch", compatibilityReason: "Versi ROI, ekstraktor, atau parameter baseline berbeda." };
  }
  return {
    ...annotation,
    sampleId: target.sampleId,
    compatibility: "exact",
    compatibilityReason: "Fingerprint, ROI, dan versi pipeline cocok.",
  };
}

function bytesToHex(bytes: Uint8Array): string {
  return Array.from(bytes, (value) => value.toString(16).padStart(2, "0")).join("");
}

export async function createContentFingerprint(data: ArrayBuffer): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", data);
  return bytesToHex(new Uint8Array(digest));
}

export async function fingerprintFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  try {
    return await createContentFingerprint(buffer);
  } finally {
    new Uint8Array(buffer).fill(0);
  }
}

function stableHash(value: string): string {
  let first = 2166136261;
  let second = 3335557771;
  for (let index = 0; index < value.length; index += 1) {
    const code = value.charCodeAt(index);
    first = Math.imul(first ^ code, 16777619);
    second = Math.imul(second ^ code, 2246822519);
  }
  return `${(first >>> 0).toString(16).padStart(8, "0")}${(second >>> 0).toString(16).padStart(8, "0")}`;
}

export function createRoiSignature(input: {
  sampleFingerprint: string;
  roiAlgorithmVersion: string;
  roiMethod: string | null;
  roiWidth: number | null;
  roiHeight: number | null;
  rotationDegrees: number | null;
  paddingScale: number | null;
}): string | null {
  if (!input.roiMethod || !input.roiWidth || !input.roiHeight) return null;
  const canonical = [
    input.sampleFingerprint,
    input.roiAlgorithmVersion,
    input.roiMethod,
    input.roiWidth,
    input.roiHeight,
    input.rotationDegrees?.toFixed(4) ?? "",
    input.paddingScale?.toFixed(4) ?? "",
  ].join("|");
  return `roi-${stableHash(canonical)}`;
}

function validStatus(value: unknown): value is PalmAnnotationStatus {
  return value === "unreviewed" || value === "annotated" || value === "undetermined";
}

function validCompleteness(value: unknown): value is PalmAnnotationCompleteness {
  return value === "complete" || value === "partial" || value === "unknown";
}

export function validateAnnotationPolylines(
  value: unknown,
  width: number | null,
  height: number | null,
): ManualPalmLineAnnotation[] {
  if (!Array.isArray(value) || !width || !height) return [];
  return value.flatMap((item, itemIndex) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as { id?: unknown; points?: unknown };
    if (!Array.isArray(candidate.points) || candidate.points.length < 2) return [];
    const points = candidate.points.flatMap((point) => {
      if (!point || typeof point !== "object") return [];
      const typed = point as { x?: unknown; y?: unknown };
      if (typeof typed.x !== "number" || typeof typed.y !== "number" ||
          !Number.isFinite(typed.x) || !Number.isFinite(typed.y) ||
          typed.x < 0 || typed.x >= width || typed.y < 0 || typed.y >= height) return [];
      return [{ x: typed.x, y: typed.y }];
    });
    if (points.length !== candidate.points.length) return [];
    return [{
      id: typeof candidate.id === "string" ? candidate.id : `imported-${itemIndex + 1}`,
      points,
    }];
  });
}

export function parsePalmAnnotationDocument(value: unknown): PalmAnnotationDocument {
  if (!value || typeof value !== "object") throw new Error("Dokumen anotasi bukan objek.");
  const document = value as { format?: unknown; version?: unknown; samples?: unknown };
  if (document.format !== PALM_GROUND_TRUTH_FORMAT ||
      (document.version !== 1 && document.version !== 2) ||
      !Array.isArray(document.samples)) {
    throw new Error("Format atau versi anotasi tidak dikenali.");
  }
  const version = document.version;
  const samples = document.samples.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const sample = item as Record<string, unknown>;
    const roiWidth = typeof sample.roi_width === "number" ? sample.roi_width : null;
    const roiHeight = typeof sample.roi_height === "number" ? sample.roi_height : null;
    const status = validStatus(sample.status ?? sample.annotation_status)
      ? (sample.status ?? sample.annotation_status) as PalmAnnotationStatus
      : "unreviewed";
    return [{
      sourceVersion: version as 1 | 2,
      sampleId: typeof sample.sample_id === "string" ? sample.sample_id : "legacy-unlabeled",
      sampleFingerprint: version === 2 && typeof sample.sample_fingerprint === "string"
        ? sample.sample_fingerprint : null,
      roiSignature: version === 2 && typeof sample.roi_signature === "string" ? sample.roi_signature : null,
      roiWidth,
      roiHeight,
      roiAlgorithmVersion: version === 2 && typeof sample.roi_algorithm_version === "string"
        ? sample.roi_algorithm_version : null,
      lineExtractionVersion: version === 2 && typeof sample.line_extraction_version === "string"
        ? sample.line_extraction_version : null,
      lineParameterVersion: version === 2 && typeof sample.line_parameter_version === "string"
        ? sample.line_parameter_version : null,
      status,
      completeness: validCompleteness(sample.completeness) ? sample.completeness : "unknown",
      compatibility: version === 1 ? "legacy-needs-mapping" as const : "unmatched" as const,
      compatibilityReason: version === 1
        ? "Format v1 tidak memiliki fingerprint dan signature ROI; pemetaan manual wajib."
        : "Belum dicocokkan dengan batch aktif.",
      polylines: validateAnnotationPolylines(sample.polylines, roiWidth, roiHeight),
    }];
  });
  return { format: PALM_GROUND_TRUTH_FORMAT, version, samples };
}

export function evaluatePalmGroundTruth(input: {
  annotation: PalmGroundTruthAnnotation;
  candidates: PalmLineCandidate[];
  extractionStatus: "detected" | "abstain";
  abstainReason: string | null;
  roiAlgorithmVersion: string;
  lineExtractionVersion: string;
  lineParameterVersion: string;
}): PalmGroundTruthReport {
  const base = {
    annotationStatus: input.annotation.status,
    annotationCompleteness: input.annotation.completeness,
    compatibility: input.annotation.compatibility,
    reviewStatus: input.annotation.completeness === "complete" ? "reviewed" as const : "provisional" as const,
    roiAlgorithmVersion: input.roiAlgorithmVersion,
    lineExtractionVersion: input.lineExtractionVersion,
    lineParameterVersion: input.lineParameterVersion,
  };
  if (!["exact", "legacy-confirmed"].includes(input.annotation.compatibility)) {
    return { ...base, scoringStatus: "unavailable", reason: input.annotation.compatibilityReason, scores: [] };
  }
  if (input.annotation.status === "undetermined") {
    return { ...base, reviewStatus: "not-reviewed", scoringStatus: "unavailable", reason: "Anotasi ditandai belum dapat ditentukan.", scores: [] };
  }
  if (input.annotation.status !== "annotated" || !input.annotation.polylines.length) {
    return { ...base, reviewStatus: "not-reviewed", scoringStatus: "unavailable", reason: "Tidak ada ground truth polyline yang valid.", scores: [] };
  }
  if (input.extractionStatus === "abstain") {
    return { ...base, scoringStatus: "abstain", reason: input.abstainReason ?? "Ekstraktor abstain.", scores: [] };
  }
  const scores = PALM_GROUND_TRUTH_TOLERANCES.flatMap((tolerancePixels) => {
    const agreement: PalmLineAgreement | null = evaluatePalmLineAgreement(
      input.candidates,
      input.annotation.polylines,
      tolerancePixels,
    );
    return agreement ? [{
      tolerancePixels,
      coverage: agreement.manualCoverage,
      precision: agreement.candidatePrecision,
      f1: agreement.harmonicScore,
    }] : [];
  });
  return {
    ...base,
    scoringStatus: scores.length ? "scored" : "unavailable",
    reason: scores.length
      ? input.annotation.completeness === "complete"
        ? "Ground truth kompatibel dan lengkap."
        : "Skor provisional karena anotasi belum dinyatakan lengkap."
      : "Skor tidak tersedia.",
    scores,
  };
}

export function summarizeGroundTruthReports(reports: PalmGroundTruthReport[]) {
  const scored = reports.filter((report) => report.scoringStatus === "scored");
  const provisional = scored.filter((report) => report.reviewStatus === "provisional").length;
  return {
    total: reports.length,
    compatible: reports.filter((report) => ["exact", "legacy-confirmed"].includes(report.compatibility)).length,
    scored: scored.length,
    provisional,
    abstained: reports.filter((report) => report.scoringStatus === "abstain").length,
    byTolerance: PALM_GROUND_TRUTH_TOLERANCES.map((tolerancePixels) => {
      const values = scored.flatMap((report) => report.scores.filter((score) => score.tolerancePixels === tolerancePixels));
      const average = (field: "coverage" | "precision" | "f1") => values.length
        ? values.reduce((total, score) => total + score[field], 0) / values.length
        : null;
      return { tolerancePixels, denominator: values.length, coverage: average("coverage"), precision: average("precision"), f1: average("f1") };
    }),
  };
}
