import type {
  PalmImageMetrics,
  StaticPalmQualityEvaluation,
} from "./image-quality";
import type { ProcessedPalmImages } from "./palm-preprocessing";
import type {
  PalmInteriorGeometry,
  PalmRoiDiagnostics,
  PalmRoiFailureCategory,
  PalmRoiMethod,
} from "./palm-roi";
import type { PalmLineExtractionSummary } from "./palm-line-extraction";
import type { PalmGroundTruthReport } from "./palm-ground-truth";

export const MAX_EVALUATION_BATCH = 30;

export type EvaluationHandGroup = "left" | "right" | "unknown";
export type EvaluationCameraGroup = "front" | "back" | "unknown";
export type HandDetectionStatus = "not-detected" | "single" | "multiple" | "error";
export type RoiEvaluationStatus = "success" | "failed" | "not-attempted";
export type ManualRoiAssessment = "unreviewed" | "correct" | "imprecise" | "failed";
export type ManualLineAssessment = "unreviewed" | "clear" | "unclear";
export type LineCandidateAssessment = "unreviewed" | "follows" | "partial" | "misses" | "abstain-correct";

export interface EvaluationMetadata {
  subjectGroup: string;
  handGroup: EvaluationHandGroup;
  cameraGroup: EvaluationCameraGroup;
}

export interface PalmEvaluationResult {
  sampleId: string;
  sampleFingerprint: string;
  roiSignature: string | null;
  roiAlgorithmVersion: string;
  sampleName: string;
  sourceWidth: number;
  sourceHeight: number;
  detectionStatus: HandDetectionStatus;
  landmarkCount: number;
  detectedHandedness: "Left" | "Right" | null;
  roiStatus: RoiEvaluationStatus;
  roiMethod: Exclude<PalmRoiMethod, "baseline"> | null;
  roiFailureCategory: PalmRoiFailureCategory | null;
  roiFailureReason: string | null;
  roiWidth: number | null;
  roiHeight: number | null;
  images: ProcessedPalmImages | null;
  diagnosticImage: ImageData | null;
  diagnostics: PalmRoiDiagnostics | null;
  palmInteriorGeometry: PalmInteriorGeometry | null;
  imageMetrics: PalmImageMetrics | null;
  metricSource: "roi" | "source";
  quality: StaticPalmQualityEvaluation;
  processingMs: number;
  roiProcessingMs: number;
  baseline: {
    roiStatus: RoiEvaluationStatus;
    failureCategory: PalmRoiFailureCategory | null;
    failureReason: string | null;
    roiWidth: number | null;
    roiHeight: number | null;
    imageMetrics: PalmImageMetrics | null;
    roiProcessingMs: number;
    diagnostics: PalmRoiDiagnostics | null;
  };
  metadata: EvaluationMetadata;
  manualRoi: ManualRoiAssessment;
  manualLines: ManualLineAssessment;
  lineExperiment: PalmLineExtractionSummary | null;
  lineRefinementExperiment: PalmLineExtractionSummary | null;
  lineInteriorExperiment: PalmLineExtractionSummary | null;
  lineInteriorMetrics: {
    baselineOutsideCandidates: number | null;
    baselineOutsideLengthPixels: number | null;
    refinementOutsideCandidates: number | null;
    refinementOutsideLengthPixels: number | null;
    interiorOutsideCandidates: number | null;
    interiorOutsideLengthPixels: number | null;
  };
  lineCandidateAssessment: LineCandidateAssessment;
}

interface FileMetadataInput {
  name: string;
  webkitRelativePath?: string;
}

function stableAnonymousHash(value: string): string {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36).toUpperCase().padStart(6, "0").slice(0, 6);
}

export function parseEvaluationMetadata(file: FileMetadataInput): EvaluationMetadata {
  const source = `${file.webkitRelativePath ?? ""}/${file.name}`.toLowerCase();
  const subjectFolder = source.split(/[\\/]/).find((part) => /^user_\d+$/.test(part));
  return {
    subjectGroup: subjectFolder ? `G-${stableAnonymousHash(subjectFolder)}` : "unknown",
    handGroup: source.includes("left_hand")
      ? "left"
      : source.includes("right_hand")
        ? "right"
        : "unknown",
    cameraGroup: source.includes("front_cam")
      ? "front"
      : source.includes("back_cam")
        ? "back"
        : "unknown",
  };
}

export function createEvaluationSampleId(index: number, fingerprint?: string): string {
  return fingerprint
    ? `palm-${fingerprint.slice(0, 12)}`
    : `sample-${String(index + 1).padStart(3, "0")}`;
}

export function selectBalancedEvaluationFiles<T extends FileMetadataInput>(
  files: T[],
  limit = MAX_EVALUATION_BATCH,
): T[] {
  const groups = new Map<string, T[]>();
  files.forEach((file, index) => {
    const subjectGroup = parseEvaluationMetadata(file).subjectGroup;
    const key = subjectGroup === "unknown" ? `unknown-${index}` : subjectGroup;
    groups.set(key, [...(groups.get(key) ?? []), file]);
  });

  const queues = [...groups.values()];
  const strata = ["left-front", "left-back", "right-front", "right-back"];
  const selected: T[] = [];
  let round = 0;
  while (selected.length < limit && queues.some((queue) => queue.length > 0)) {
    queues.forEach((queue, groupIndex) => {
      if (selected.length >= limit) return;
      const desiredStratum = strata[(groupIndex + round) % strata.length];
      const desiredIndex = queue.findIndex((file) => {
        const metadata = parseEvaluationMetadata(file);
        return `${metadata.handGroup}-${metadata.cameraGroup}` === desiredStratum;
      });
      const [next] = queue.splice(desiredIndex >= 0 ? desiredIndex : 0, 1);
      if (next) selected.push(next);
    });
    round += 1;
  }
  return selected;
}

export interface EvaluationSummary {
  total: number;
  detectionSuccess: number;
  roiSuccess: number;
  nativeRoiSuccess: number;
  fallbackRoiSuccess: number;
  baselineRoiSuccess: number;
  qualityValid: number;
  qualityWarning: number;
  qualityFailed: number;
  manualRoiReviewed: number;
  manualRoiCorrect: number;
  manualRoiImprecise: number;
  manualRoiFailed: number;
  manualLinesReviewed: number;
  manualLinesClear: number;
  manualLinesUnclear: number;
  averageRoiSharpness: number | null;
  averageBaselineRoiSharpness: number | null;
  averageSourceSharpness: number | null;
  averageProcessingMs: number | null;
  averageBaselineRoiProcessingMs: number | null;
  averageCandidateRoiProcessingMs: number | null;
}

function averageMetric(values: number[]): number | null {
  return values.length
    ? values.reduce((total, value) => total + value, 0) / values.length
    : null;
}

export function summarizePalmEvaluations(
  results: PalmEvaluationResult[],
): EvaluationSummary {
  const manualRoi = results.filter((result) => result.manualRoi !== "unreviewed");
  const manualLines = results.filter((result) => result.manualLines !== "unreviewed");
  return {
    total: results.length,
    detectionSuccess: results.filter(
      (result) => result.detectionStatus === "single" && result.landmarkCount === 21,
    ).length,
    roiSuccess: results.filter((result) => result.roiStatus === "success").length,
    nativeRoiSuccess: results.filter(
      (result) => result.roiStatus === "success" && result.roiMethod === "adaptive-rotated",
    ).length,
    fallbackRoiSuccess: results.filter(
      (result) => result.roiStatus === "success" && result.roiMethod === "fallback-axis-aligned",
    ).length,
    baselineRoiSuccess: results.filter((result) => result.baseline.roiStatus === "success").length,
    qualityValid: results.filter((result) => result.quality.status === "valid").length,
    qualityWarning: results.filter((result) => result.quality.status === "warning").length,
    qualityFailed: results.filter((result) => result.quality.status === "failed").length,
    manualRoiReviewed: manualRoi.length,
    manualRoiCorrect: manualRoi.filter((result) => result.manualRoi === "correct").length,
    manualRoiImprecise: manualRoi.filter((result) => result.manualRoi === "imprecise").length,
    manualRoiFailed: manualRoi.filter((result) => result.manualRoi === "failed").length,
    manualLinesReviewed: manualLines.length,
    manualLinesClear: manualLines.filter((result) => result.manualLines === "clear").length,
    manualLinesUnclear: manualLines.filter((result) => result.manualLines === "unclear").length,
    averageRoiSharpness: averageMetric(
      results.flatMap((result) =>
        result.metricSource === "roi" && result.imageMetrics
          ? [result.imageMetrics.sharpness]
          : [],
      ),
    ),
    averageBaselineRoiSharpness: averageMetric(
      results.flatMap((result) =>
        result.baseline.imageMetrics ? [result.baseline.imageMetrics.sharpness] : [],
      ),
    ),
    averageSourceSharpness: averageMetric(
      results.flatMap((result) =>
        result.metricSource === "source" && result.imageMetrics
          ? [result.imageMetrics.sharpness]
          : [],
      ),
    ),
    averageProcessingMs: averageMetric(results.map((result) => result.processingMs)),
    averageBaselineRoiProcessingMs: averageMetric(
      results.map((result) => result.baseline.roiProcessingMs),
    ),
    averageCandidateRoiProcessingMs: averageMetric(
      results.map((result) => result.roiProcessingMs),
    ),
  };
}

function csvCell(value: string | number | null): string {
  const normalized = value === null ? "" : String(value);
  return `"${normalized.replaceAll('"', '""')}"`;
}

export function createPalmEvaluationCsv(
  results: PalmEvaluationResult[],
  groundTruthReports: Record<string, PalmGroundTruthReport> = {},
  experimentGroundTruthReports: Record<string, PalmGroundTruthReport> = {},
  interiorGroundTruthReports: Record<string, PalmGroundTruthReport> = {},
): string {
  const header = [
    "sample_id",
    "sample_fingerprint",
    "roi_signature",
    "roi_algorithm_version",
    "subject_group",
    "hand_group",
    "camera_group",
    "detection_status",
    "landmark_count",
    "mediapipe_handedness",
    "roi_status",
    "roi_method",
    "roi_failure_category",
    "baseline_roi_status",
    "baseline_failure_category",
    "source_resolution",
    "roi_resolution",
    "brightness",
    "contrast",
    "sharpness",
    "baseline_roi_sharpness",
    "metric_source",
    "processing_ms",
    "roi_processing_ms",
    "baseline_roi_processing_ms",
    "quality_status",
    "failure_notes",
    "baseline_failure_notes",
    "manual_roi",
    "manual_lines",
    "line_extraction_status",
    "line_candidate_count",
    "line_total_length_px",
    "line_average_continuity",
    "line_processing_ms",
    "line_response_threshold",
    "line_illumination_radius",
    "line_minimum_length_ratio",
    "line_candidate_assessment",
    "refinement_version",
    "refinement_status",
    "refinement_bridge_count",
    "refinement_candidate_count",
    "refinement_total_length_px",
    "refinement_processing_ms",
    "baseline_outside_candidate_count",
    "baseline_outside_length_px",
    "palm_interior_version",
    "palm_interior_mask_status",
    "palm_interior_status",
    "palm_interior_candidate_count",
    "palm_interior_total_length_px",
    "palm_interior_outside_candidate_count",
    "palm_interior_outside_length_px",
    "palm_interior_processing_ms",
    "annotation_status",
    "annotation_completeness",
    "annotation_compatibility",
    "annotation_review_status",
    "ground_truth_scoring_status",
    "ground_truth_reason",
    "line_extraction_version",
    "line_parameter_version",
    "coverage_t3",
    "precision_t3",
    "f1_t3",
    "coverage_t6",
    "precision_t6",
    "f1_t6",
    "coverage_t9",
    "precision_t9",
    "f1_t9",
    "experiment_coverage_t3",
    "experiment_precision_t3",
    "experiment_f1_t3",
    "experiment_coverage_t6",
    "experiment_precision_t6",
    "experiment_f1_t6",
    "experiment_coverage_t9",
    "experiment_precision_t9",
    "experiment_f1_t9",
    "interior_coverage_t3",
    "interior_precision_t3",
    "interior_f1_t3",
    "interior_coverage_t6",
    "interior_precision_t6",
    "interior_f1_t6",
    "interior_coverage_t9",
    "interior_precision_t9",
    "interior_f1_t9",
  ];
  const rows = results.map((result) => {
    const report = groundTruthReports[result.sampleFingerprint];
    const experimentReport = experimentGroundTruthReports[result.sampleFingerprint];
    const interiorReport = interiorGroundTruthReports[result.sampleFingerprint];
    const score = (
      source: PalmGroundTruthReport | undefined,
      tolerance: number,
      field: "coverage" | "precision" | "f1",
    ) => {
      const value = source?.scores.find((item) => item.tolerancePixels === tolerance)?.[field];
      return value === undefined ? "" : value.toFixed(6);
    };
    return [
    result.sampleId,
    result.sampleFingerprint,
    result.roiSignature,
    result.roiAlgorithmVersion,
    result.metadata.subjectGroup,
    result.metadata.handGroup,
    result.metadata.cameraGroup,
    result.detectionStatus,
    result.landmarkCount,
    result.detectedHandedness,
    result.roiStatus,
    result.roiMethod,
    result.roiFailureCategory,
    result.baseline.roiStatus,
    result.baseline.failureCategory,
    `${result.sourceWidth}x${result.sourceHeight}`,
    result.roiWidth && result.roiHeight ? `${result.roiWidth}x${result.roiHeight}` : "",
    result.imageMetrics?.brightness.toFixed(2) ?? "",
    result.imageMetrics?.contrast.toFixed(2) ?? "",
    result.imageMetrics?.sharpness.toFixed(2) ?? "",
    result.baseline.imageMetrics?.sharpness.toFixed(2) ?? "",
    result.metricSource,
    result.processingMs.toFixed(2),
    result.roiProcessingMs.toFixed(2),
    result.baseline.roiProcessingMs.toFixed(2),
    result.quality.status,
    [result.roiFailureReason, ...result.quality.reasons].filter(Boolean).join(" | "),
    result.baseline.failureReason,
    result.manualRoi,
    result.manualLines,
    result.lineExperiment?.status ?? "",
    result.lineExperiment?.candidateCount ?? "",
    result.lineExperiment?.totalLengthPixels.toFixed(2) ?? "",
    result.lineExperiment?.averageContinuity.toFixed(4) ?? "",
    result.lineExperiment?.processingMs.toFixed(2) ?? "",
    result.lineExperiment?.parameters.responseThreshold ?? "",
    result.lineExperiment?.parameters.illuminationRadius ?? "",
    result.lineExperiment?.parameters.minimumLengthRatio ?? "",
    result.lineCandidateAssessment,
    result.lineRefinementExperiment?.refinementVersion ?? "",
    result.lineRefinementExperiment?.status ?? "",
    result.lineRefinementExperiment?.acceptedBridgeCount ?? "",
    result.lineRefinementExperiment?.candidateCount ?? "",
    result.lineRefinementExperiment?.totalLengthPixels.toFixed(2) ?? "",
    result.lineRefinementExperiment?.processingMs.toFixed(2) ?? "",
    result.lineInteriorMetrics.baselineOutsideCandidates,
    result.lineInteriorMetrics.baselineOutsideLengthPixels?.toFixed(2) ?? "",
    result.lineInteriorExperiment?.refinementVersion ?? "",
    result.lineInteriorExperiment?.maskStatus ?? "",
    result.lineInteriorExperiment?.status ?? "",
    result.lineInteriorExperiment?.candidateCount ?? "",
    result.lineInteriorExperiment?.totalLengthPixels.toFixed(2) ?? "",
    result.lineInteriorMetrics.interiorOutsideCandidates,
    result.lineInteriorMetrics.interiorOutsideLengthPixels?.toFixed(2) ?? "",
    result.lineInteriorExperiment?.processingMs.toFixed(2) ?? "",
    report?.annotationStatus ?? "unreviewed",
    report?.annotationCompleteness ?? "unknown",
    report?.compatibility ?? "unmatched",
    report?.reviewStatus ?? "not-reviewed",
    report?.scoringStatus ?? "unavailable",
    report?.reason ?? "Tidak ada anotasi yang dipetakan.",
    report?.lineExtractionVersion ?? "",
    report?.lineParameterVersion ?? "",
    score(report, 3, "coverage"),
    score(report, 3, "precision"),
    score(report, 3, "f1"),
    score(report, 6, "coverage"),
    score(report, 6, "precision"),
    score(report, 6, "f1"),
    score(report, 9, "coverage"),
    score(report, 9, "precision"),
    score(report, 9, "f1"),
    score(experimentReport, 3, "coverage"),
    score(experimentReport, 3, "precision"),
    score(experimentReport, 3, "f1"),
    score(experimentReport, 6, "coverage"),
    score(experimentReport, 6, "precision"),
    score(experimentReport, 6, "f1"),
    score(experimentReport, 9, "coverage"),
    score(experimentReport, 9, "precision"),
    score(experimentReport, 9, "f1"),
    score(interiorReport, 3, "coverage"),
    score(interiorReport, 3, "precision"),
    score(interiorReport, 3, "f1"),
    score(interiorReport, 6, "coverage"),
    score(interiorReport, 6, "precision"),
    score(interiorReport, 6, "f1"),
    score(interiorReport, 9, "coverage"),
    score(interiorReport, 9, "precision"),
    score(interiorReport, 9, "f1"),
  ];
  });
  return [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\r\n");
}
