import {
  evaluatePalmLineAgreement,
  type ManualPalmLineAnnotation,
  type PalmLineLabelStatus,
  type PalmLineVisibility,
  type PalmLineAgreement,
  type PalmLineCandidate,
  type PalmVisualClass,
} from "./palm-line-extraction";

export const PALM_GROUND_TRUTH_FORMAT = "metemu-palm-lines";
export const PALM_GROUND_TRUTH_VERSION = 3;
export const PALM_REKHA_PROTOCOL_VERSION = "rekha-visual-v1";
export const PALM_REKHA_REFERENCE_IDS = [
  "prd-metemu-2026-10-26",
  "paramarsh-palmistry-complete-guide",
  "pengajarpedia-palmistry-2025-10",
] as const;
export const PALM_CORE_VISUAL_CLASSES = ["life", "head", "heart", "fate"] as const;
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

export type PalmAnnotationHandedness = "left" | "right" | "unknown";

export interface PalmVisualClassState {
  visualClass: (typeof PALM_CORE_VISUAL_CLASSES)[number];
  labelStatus: PalmLineLabelStatus;
  visibility: PalmLineVisibility;
  truncated: boolean;
}

export interface PalmGroundTruthAnnotation {
  sourceVersion: 1 | 2 | 3;
  sampleId: string;
  sampleFingerprint: string | null;
  roiSignature: string | null;
  roiPixelSha256: string | null;
  roiWidth: number | null;
  roiHeight: number | null;
  roiAlgorithmVersion: string | null;
  lineExtractionVersion: string | null;
  lineParameterVersion: string | null;
  status: PalmAnnotationStatus;
  completeness: PalmAnnotationCompleteness;
  compatibility: PalmAnnotationCompatibility;
  compatibilityReason: string;
  handedness: PalmAnnotationHandedness;
  referenceIds: string[];
  annotatorId: string | null;
  protocolVersion: string | null;
  classStates: PalmVisualClassState[];
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
  version: 1 | 2 | 3;
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
    roiPixelSha256?: string | null;
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
  if (annotation.roiPixelSha256 && target.roiPixelSha256 &&
      annotation.roiPixelSha256 !== target.roiPixelSha256) {
    return { ...annotation, compatibility: "roi-mismatch", compatibilityReason: "Hash piksel ROI tidak cocok." };
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

function validVisualClass(value: unknown): value is PalmVisualClass {
  return ["life", "head", "heart", "fate", "other", "unknown"].includes(String(value));
}

function validLabelStatus(value: unknown): value is PalmLineLabelStatus {
  return value === "provisional" || value === "verified" || value === "ambiguous";
}

function validVisibility(value: unknown): value is PalmLineVisibility {
  return value === "visible" || value === "obscured" || value === "absent" || value === "undetermined";
}

function validHandedness(value: unknown): value is PalmAnnotationHandedness {
  return value === "left" || value === "right" || value === "unknown";
}

function validSha256(value: unknown): value is string {
  return typeof value === "string" && /^[a-f0-9]{64}$/i.test(value);
}

export function createDefaultPalmClassStates(): PalmVisualClassState[] {
  return PALM_CORE_VISUAL_CLASSES.map((visualClass) => ({
    visualClass,
    labelStatus: "provisional",
    visibility: "undetermined",
    truncated: false,
  }));
}

function parseClassStates(value: unknown): PalmVisualClassState[] {
  if (!Array.isArray(value)) return createDefaultPalmClassStates();
  const byClass = new Map<string, PalmVisualClassState>();
  value.forEach((item) => {
    if (!item || typeof item !== "object") return;
    const candidate = item as Record<string, unknown>;
    const visualClass = candidate.visual_class ?? candidate.visualClass;
    if (!PALM_CORE_VISUAL_CLASSES.includes(visualClass as (typeof PALM_CORE_VISUAL_CLASSES)[number]) ||
        !validLabelStatus(candidate.label_status ?? candidate.labelStatus) ||
        !validVisibility(candidate.visibility)) return;
    byClass.set(String(visualClass), {
      visualClass: visualClass as PalmVisualClassState["visualClass"],
      labelStatus: (candidate.label_status ?? candidate.labelStatus) as PalmLineLabelStatus,
      visibility: candidate.visibility,
      truncated: candidate.truncated === true,
    });
  });
  return createDefaultPalmClassStates().map((fallback) => byClass.get(fallback.visualClass) ?? fallback);
}

export function validateAnnotationPolylines(
  value: unknown,
  width: number | null,
  height: number | null,
  sourceVersion: 1 | 2 | 3 = 2,
): ManualPalmLineAnnotation[] {
  if (!Array.isArray(value) || !width || !height) return [];
  return value.flatMap((item, itemIndex) => {
    if (!item || typeof item !== "object") return [];
    const candidate = item as Record<string, unknown>;
    if (sourceVersion === 3 && (
      !validVisualClass(candidate.visual_class ?? candidate.visualClass) ||
      !validLabelStatus(candidate.label_status ?? candidate.labelStatus) ||
      !["visible", "obscured"].includes(String(candidate.visibility)) ||
      typeof candidate.truncated !== "boolean"
    )) return [];
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
      visualClass: sourceVersion === 3 && validVisualClass(candidate.visual_class ?? candidate.visualClass)
        ? (candidate.visual_class ?? candidate.visualClass) as PalmVisualClass
        : "unknown",
      labelStatus: sourceVersion === 3 && validLabelStatus(candidate.label_status ?? candidate.labelStatus)
        ? (candidate.label_status ?? candidate.labelStatus) as PalmLineLabelStatus
        : "ambiguous",
      visibility: sourceVersion === 3 &&
        ((candidate.visibility ?? "visible") === "visible" || (candidate.visibility ?? "visible") === "obscured")
        ? (candidate.visibility ?? "visible") as ManualPalmLineAnnotation["visibility"]
        : "visible",
      truncated: sourceVersion === 3 && candidate.truncated === true,
    }];
  });
}

export function validatePalmGroundTruthAnnotation(
  annotation: PalmGroundTruthAnnotation,
): { valid: boolean; reasons: string[] } {
  const reasons: string[] = [];
  if (annotation.sourceVersion !== 3) return { valid: true, reasons };
  if (!annotation.sampleFingerprint || !validSha256(annotation.sampleFingerprint)) reasons.push("Fingerprint sumber tidak valid.");
  if (!annotation.roiSignature) reasons.push("ROI signature tidak tersedia.");
  if (!annotation.roiPixelSha256 || !validSha256(annotation.roiPixelSha256)) reasons.push("SHA-256 piksel ROI tidak tersedia atau tidak valid.");
  if (!annotation.roiWidth || !annotation.roiHeight) reasons.push("Dimensi ROI tidak valid.");
  if (!validHandedness(annotation.handedness)) reasons.push("Handedness anotasi tidak valid.");
  if (annotation.protocolVersion !== PALM_REKHA_PROTOCOL_VERSION) reasons.push("Versi protokol anotasi tidak cocok.");
  if (!annotation.annotatorId || !/^[a-z0-9][a-z0-9_-]{2,63}$/i.test(annotation.annotatorId)) reasons.push("ID anotator anonim tidak valid.");
  if (!annotation.referenceIds.length) reasons.push("Reference ID belum dicatat.");
  if (annotation.classStates.length !== PALM_CORE_VISUAL_CLASSES.length) reasons.push("Status empat kelas visual belum lengkap.");

  annotation.polylines.forEach((polyline) => {
    if (!validVisualClass(polyline.visualClass)) reasons.push(`Kelas visual ${polyline.id} tidak valid.`);
    if (!validLabelStatus(polyline.labelStatus)) reasons.push(`Label status ${polyline.id} tidak valid.`);
    if (polyline.visibility !== "visible" && polyline.visibility !== "obscured") reasons.push(`Visibility polyline ${polyline.id} tidak valid.`);
    if (polyline.points.length < 2) reasons.push(`Polyline ${polyline.id} tidak memiliki cukup titik.`);
    if (annotation.roiWidth && annotation.roiHeight && polyline.points.some((point) =>
      !Number.isFinite(point.x) || !Number.isFinite(point.y) ||
      point.x < 0 || point.x >= annotation.roiWidth! || point.y < 0 || point.y >= annotation.roiHeight!)) {
      reasons.push(`Polyline ${polyline.id} berada di luar ROI.`);
    }
  });

  annotation.classStates.forEach((state) => {
    const matching = annotation.polylines.filter((polyline) => polyline.visualClass === state.visualClass);
    if (state.visibility === "absent" && matching.length) reasons.push(`${state.visualClass} dinyatakan absent tetapi masih memiliki polyline.`);
    if (state.visibility === "undetermined" && matching.length) reasons.push(`${state.visualClass} masih undetermined tetapi memiliki polyline berlabel.`);
    if (state.visibility === "visible" && matching.length === 0) reasons.push(`${state.visualClass} dinyatakan visible tetapi belum memiliki polyline.`);
  });
  return { valid: reasons.length === 0, reasons };
}

export function serializePalmGroundTruthAnnotation(annotation: PalmGroundTruthAnnotation) {
  return {
    sample_id: annotation.sampleId,
    sample_fingerprint: annotation.sampleFingerprint,
    roi_signature: annotation.roiSignature,
    roi_pixel_sha256: annotation.roiPixelSha256,
    roi_width: annotation.roiWidth,
    roi_height: annotation.roiHeight,
    roi_algorithm_version: annotation.roiAlgorithmVersion,
    line_extraction_version: annotation.lineExtractionVersion,
    line_parameter_version: annotation.lineParameterVersion,
    annotation_status: annotation.status,
    completeness: annotation.completeness,
    handedness: annotation.handedness,
    reference_ids: annotation.referenceIds,
    annotator_id: annotation.annotatorId,
    protocol_version: annotation.protocolVersion,
    class_states: annotation.classStates.map((state) => ({
      visual_class: state.visualClass,
      label_status: state.labelStatus,
      visibility: state.visibility,
      truncated: state.truncated,
    })),
    polylines: annotation.polylines.map((polyline) => ({
      id: polyline.id,
      visual_class: polyline.visualClass,
      label_status: polyline.labelStatus,
      visibility: polyline.visibility,
      truncated: polyline.truncated,
      points: polyline.points.map((point) => ({ x: point.x, y: point.y })),
    })),
  };
}

export function parsePalmAnnotationDocument(value: unknown): PalmAnnotationDocument {
  if (!value || typeof value !== "object") throw new Error("Dokumen anotasi bukan objek.");
  const document = value as { format?: unknown; version?: unknown; samples?: unknown };
  if (document.format !== PALM_GROUND_TRUTH_FORMAT ||
      (document.version !== 1 && document.version !== 2 && document.version !== 3) ||
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
    const polylines = validateAnnotationPolylines(sample.polylines, roiWidth, roiHeight, version);
    if (version === 3 && Array.isArray(sample.polylines) && polylines.length !== sample.polylines.length) {
      throw new Error("Polyline anotasi v3 memiliki enum, koordinat, atau metadata yang tidak valid.");
    }
    const rawClassStates = Array.isArray(sample.class_states) ? sample.class_states : [];
    const rawClassNames = rawClassStates.map((state) =>
      state && typeof state === "object"
        ? String((state as Record<string, unknown>).visual_class ?? (state as Record<string, unknown>).visualClass)
        : "");
    const validClassStateInput = rawClassStates.length === PALM_CORE_VISUAL_CLASSES.length &&
      new Set(rawClassNames).size === PALM_CORE_VISUAL_CLASSES.length &&
      rawClassStates.every((state) => {
        if (!state || typeof state !== "object") return false;
        const record = state as Record<string, unknown>;
        return PALM_CORE_VISUAL_CLASSES.includes(String(record.visual_class ?? record.visualClass) as PalmVisualClassState["visualClass"]) &&
          validLabelStatus(record.label_status ?? record.labelStatus) &&
          validVisibility(record.visibility) &&
          typeof record.truncated === "boolean";
      });
    const classStates = version === 3 ? parseClassStates(sample.class_states) : createDefaultPalmClassStates();
    if (version === 3 && !validClassStateInput) {
      throw new Error("Status empat kelas visual anotasi v3 tidak valid.");
    }
    return [{
      sourceVersion: version as 1 | 2 | 3,
      sampleId: typeof sample.sample_id === "string" ? sample.sample_id : "legacy-unlabeled",
      sampleFingerprint: version >= 2 && typeof sample.sample_fingerprint === "string"
        ? sample.sample_fingerprint : null,
      roiSignature: version >= 2 && typeof sample.roi_signature === "string" ? sample.roi_signature : null,
      roiPixelSha256: version === 3 && validSha256(sample.roi_pixel_sha256) ? sample.roi_pixel_sha256 : null,
      roiWidth,
      roiHeight,
      roiAlgorithmVersion: version >= 2 && typeof sample.roi_algorithm_version === "string"
        ? sample.roi_algorithm_version : null,
      lineExtractionVersion: version >= 2 && typeof sample.line_extraction_version === "string"
        ? sample.line_extraction_version : null,
      lineParameterVersion: version >= 2 && typeof sample.line_parameter_version === "string"
        ? sample.line_parameter_version : null,
      status,
      completeness: validCompleteness(sample.completeness) ? sample.completeness : "unknown",
      compatibility: version === 1 ? "legacy-needs-mapping" as const : "unmatched" as const,
      compatibilityReason: version === 1
        ? "Format v1 tidak memiliki fingerprint dan signature ROI; pemetaan manual wajib."
        : "Belum dicocokkan dengan batch aktif.",
      handedness: version === 3 && validHandedness(sample.handedness) ? sample.handedness : "unknown",
      referenceIds: version === 3 && Array.isArray(sample.reference_ids)
        ? sample.reference_ids.filter((reference): reference is string => typeof reference === "string" && reference.length > 0)
        : [],
      annotatorId: version === 3 && typeof sample.annotator_id === "string" ? sample.annotator_id : null,
      protocolVersion: version === 3 && typeof sample.protocol_version === "string" ? sample.protocol_version : null,
      classStates,
      polylines,
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
