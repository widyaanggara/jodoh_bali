"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PalmImagePreviewCard from "./PalmImagePreviewCard";
import PalmLineAnnotationEditor from "./PalmLineAnnotationEditor";
import { useImageHandLandmarker } from "@/hooks/useImageHandLandmarker";
import {
  analyzePalmImageQuality,
  evaluateStaticPalmQuality,
} from "@/lib/netra-hasta/image-quality";
import {
  createEvaluationSampleId,
  createPalmEvaluationCsv,
  MAX_EVALUATION_BATCH,
  parseEvaluationMetadata,
  selectBalancedEvaluationFiles,
  summarizePalmEvaluations,
  type EvaluationCameraGroup,
  type EvaluationHandGroup,
  type ManualLineAssessment,
  type ManualRoiAssessment,
  type LineCandidateAssessment,
  type PalmEvaluationResult,
} from "@/lib/netra-hasta/palm-evaluation";
import {
  preprocessPalmImage,
  wipeProcessedPalmImages,
} from "@/lib/netra-hasta/palm-preprocessing";
import {
  calculateAdaptivePalmRoiGeometry,
  calculatePalmRoiGeometry,
  createPalmInteriorGeometry,
  DEFAULT_PALM_ROI_CONFIG,
  extractPalmRoi,
  PALM_ROI_ALGORITHM_VERSION,
  type PalmRoiDiagnostics,
  type PalmRoiGeometry,
  type PalmInteriorGeometry,
} from "@/lib/netra-hasta/palm-roi";
import type { NormalizedLandmark } from "@mediapipe/tasks-vision";
import {
  DEFAULT_PALM_LINE_CONFIG,
  createPalmLineErrorDiagnostics,
  extractPalmInteriorLineCandidates,
  extractRefinedPalmLineCandidates,
  extractPalmLineCandidates,
  PALM_LINE_EXTRACTION_VERSION,
  PALM_LINE_PARAMETER_VERSION,
  PALM_LINE_REFINEMENT_VERSION,
  PALM_INTERIOR_EXPERIMENT_VERSION,
  measurePalmInteriorCandidates,
  summarizePalmLineExtraction,
  wipePalmLineExtraction,
  type ManualPalmLineAnnotation,
  type PalmLineExtractionConfig,
  type PalmLineExtractionResult,
  type PalmLineErrorDiagnostics,
} from "@/lib/netra-hasta/palm-line-extraction";
import {
  createContentFingerprint,
  createRoiSignature,
  evaluatePalmGroundTruth,
  fingerprintFile,
  PALM_GROUND_TRUTH_FORMAT,
  PALM_GROUND_TRUTH_VERSION,
  parsePalmAnnotationDocument,
  resolveAnnotationCompatibility,
  summarizeGroundTruthReports,
  type PalmAnnotationCompleteness,
  type PalmAnnotationStatus,
  type PalmGroundTruthAnnotation,
  type PalmGroundTruthReport,
} from "@/lib/netra-hasta/palm-ground-truth";
import {
  assignPalmPilotSplit,
  createPalmBenchmarkArchive,
  createPalmBenchmarkManifest,
  createPalmExportStem,
  validatePalmExportPair,
  type PalmAnnotationExportSample,
  type PalmBenchmarkManifestSample,
} from "@/lib/netra-hasta/palm-export";
import type { RgbaImage } from "@/lib/netra-hasta/palm-preprocessing";

const SOURCE_METRIC_MAX_DIMENSION = 512;
const SUPPORTED_IMAGE = /\.(jpe?g|png|webp)$/i;

function downloadLocalBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.style.display = "none";
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
}

async function encodeRgbaPng(image: RgbaImage): Promise<Blob> {
  const canvas = document.createElement("canvas");
  canvas.width = image.width;
  canvas.height = image.height;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas ekspor ROI tidak tersedia.");
  const copiedPixels = new Uint8ClampedArray(image.data.length);
  copiedPixels.set(image.data);
  context.putImageData(new ImageData(copiedPixels, image.width, image.height), 0, 0);
  try {
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("ROI gagal dienkode sebagai PNG lossless.");
    return blob;
  } finally {
    copiedPixels.fill(0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
  }
}

async function hashRgbaPixels(image: RgbaImage): Promise<string> {
  const copiedPixels = new Uint8Array(image.data.length);
  copiedPixels.set(image.data);
  try {
    return await createContentFingerprint(copiedPixels.buffer);
  } finally {
    copiedPixels.fill(0);
  }
}

async function verifyLosslessPng(blob: Blob, expected: RgbaImage): Promise<string> {
  if (blob.type !== "image/png" || blob.size < 8) {
    throw new Error("Encoder tidak menghasilkan file PNG yang valid.");
  }
  const bitmap = await createImageBitmap(blob);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    bitmap.close();
    throw new Error("Canvas verifikasi PNG tidak tersedia.");
  }
  let decoded: ImageData | null = null;
  try {
    if (bitmap.width !== expected.width || bitmap.height !== expected.height) {
      throw new Error(
        `Dimensi PNG ${bitmap.width}×${bitmap.height} berbeda dari ROI ${expected.width}×${expected.height}.`,
      );
    }
    context.drawImage(bitmap, 0, 0);
    decoded = context.getImageData(0, 0, bitmap.width, bitmap.height);
    if (decoded.data.length !== expected.data.length) {
      throw new Error("Jumlah byte piksel PNG berbeda dari snapshot ROI.");
    }
    for (let index = 0; index < decoded.data.length; index += 1) {
      if (decoded.data[index] !== expected.data[index]) {
        throw new Error(`Piksel PNG berbeda dari snapshot ROI pada byte ${index}.`);
      }
    }
    return await hashRgbaPixels({
      width: decoded.width,
      height: decoded.height,
      data: decoded.data,
    });
  } catch (error) {
    throw error instanceof Error
      ? error
      : new Error("PNG ROI tidak dapat diverifikasi setelah decode.");
  } finally {
    decoded?.data.fill(0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = 0;
    canvas.height = 0;
    bitmap.close();
  }
}

function analyzeCanvasAtLimitedResolution(
  source: HTMLCanvasElement,
): ReturnType<typeof analyzePalmImageQuality> {
  const scale = Math.min(
    1,
    SOURCE_METRIC_MAX_DIMENSION / Math.max(source.width, source.height),
  );
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) throw new Error("Canvas metrik tidak tersedia.");
  context.drawImage(source, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const metrics = analyzePalmImageQuality({
    width: imageData.width,
    height: imageData.height,
    data: imageData.data,
  });
  imageData.data.fill(0);
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
  return metrics;
}

function formatMetric(value: number | undefined): string {
  return value === undefined ? "-" : value.toFixed(1);
}

function formatPercent(value: number | null | undefined): string {
  return value === null || value === undefined ? "-" : `${(value * 100).toFixed(1)}%`;
}

function qualityTone(status: PalmEvaluationResult["quality"]["status"]): string {
  if (status === "valid") return "bg-emerald-100 text-emerald-800";
  if (status === "warning") return "bg-amber-100 text-amber-900";
  return "bg-red-100 text-red-800";
}

interface SelectedLineComparison {
  baseline: PalmLineExtractionResult;
  experiment: PalmLineExtractionResult;
  interior: PalmLineExtractionResult | null;
  baselineDiagnostics: PalmLineErrorDiagnostics | null;
  experimentDiagnostics: PalmLineErrorDiagnostics | null;
  interiorDiagnostics: PalmLineErrorDiagnostics | null;
}

function buildDiagnosticImage(
  source: HTMLCanvasElement,
  landmarks: NormalizedLandmark[],
  baselineGeometry: PalmRoiGeometry | null,
  baselineDiagnostics: PalmRoiDiagnostics | null,
  candidateGeometry: PalmRoiGeometry | null,
  candidateDiagnostics: PalmRoiDiagnostics | null,
): ImageData | null {
  const scale = Math.min(1, 960 / Math.max(source.width, source.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(source.width * scale));
  canvas.height = Math.max(1, Math.round(source.height * scale));
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.drawImage(source, 0, 0, canvas.width, canvas.height);

  const drawContour = (
    points: { x: number; y: number }[],
    color: string,
    dashed: boolean,
  ) => {
    if (points.length !== 4) return;
    context.save();
    context.strokeStyle = color;
    context.lineWidth = Math.max(2, 3 * scale);
    context.setLineDash(dashed ? [8, 6] : []);
    context.beginPath();
    context.moveTo(points[0].x * scale, points[0].y * scale);
    points.slice(1).forEach((point) => context.lineTo(point.x * scale, point.y * scale));
    context.closePath();
    context.stroke();
    context.restore();
  };

  drawContour(
    baselineGeometry?.sourceCorners ?? baselineDiagnostics?.candidateCorners ?? [],
    "#ef4444",
    true,
  );
  drawContour(
    candidateGeometry?.sourceCorners ?? candidateDiagnostics?.candidateCorners ?? [],
    candidateDiagnostics?.method === "fallback-axis-aligned" ? "#f59e0b" : "#10b981",
    false,
  );

  landmarks.forEach((landmark, index) => {
    const x = landmark.x * canvas.width;
    const y = landmark.y * canvas.height;
    context.beginPath();
    context.fillStyle = [0, 5, 9, 13, 17].includes(index) ? "#facc15" : "#38bdf8";
    context.arc(x, y, Math.max(2, 3 * scale), 0, Math.PI * 2);
    context.fill();
  });

  const outside = baselineDiagnostics?.outsideCornerIndices ?? [];
  outside.forEach((cornerIndex) => {
    const corner = baselineDiagnostics?.candidateCorners[cornerIndex];
    if (!corner) return;
    const x = Math.max(4, Math.min(canvas.width - 4, corner.x * scale));
    const y = Math.max(4, Math.min(canvas.height - 4, corner.y * scale));
    context.strokeStyle = "#dc2626";
    context.lineWidth = 3;
    context.beginPath();
    context.moveTo(x - 5, y - 5);
    context.lineTo(x + 5, y + 5);
    context.moveTo(x + 5, y - 5);
    context.lineTo(x - 5, y + 5);
    context.stroke();
  });

  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  context.clearRect(0, 0, canvas.width, canvas.height);
  canvas.width = 0;
  canvas.height = 0;
  return imageData;
}

export default function PalmEvaluationClient() {
  const imageModel = useImageHandLandmarker();
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);
  const [results, setResults] = useState<PalmEvaluationResult[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [notice, setNotice] = useState<string | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | null>(null);
  const [handFilter, setHandFilter] = useState<"all" | EvaluationHandGroup>("all");
  const [cameraFilter, setCameraFilter] = useState<"all" | EvaluationCameraGroup>("all");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [lineExperimentEnabled, setLineExperimentEnabled] = useState(false);
  const [showLineCandidates, setShowLineCandidates] = useState(true);
  const [showManualAnnotations, setShowManualAnnotations] = useState(true);
  const [lineVariantView, setLineVariantView] = useState<"baseline" | "evidence-bridge" | "palm-interior">("baseline");
  const [lineConfig, setLineConfig] = useState<PalmLineExtractionConfig>(DEFAULT_PALM_LINE_CONFIG);
  const [lineOutput, setLineOutput] = useState<PalmLineExtractionResult | null>(null);
  const [selectedLineComparison, setSelectedLineComparison] = useState<SelectedLineComparison | null>(null);
  const [annotations, setAnnotations] = useState<Record<string, PalmGroundTruthAnnotation>>({});
  const [isExportingPair, setIsExportingPair] = useState(false);
  const [legacyAnnotations, setLegacyAnnotations] = useState<PalmGroundTruthAnnotation[]>([]);
  const [selectedLegacyIndex, setSelectedLegacyIndex] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const directoryInputRef = useRef<HTMLInputElement>(null);
  const annotationInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<PalmEvaluationResult[]>([]);
  const runIdRef = useRef(0);

  const disposeResults = useCallback((items: PalmEvaluationResult[]) => {
    items.forEach((result) => {
      wipeProcessedPalmImages(result.images);
      result.diagnosticImage?.data.fill(0);
    });
  }, []);

  const clearResults = useCallback(() => {
    runIdRef.current += 1;
    disposeResults(resultsRef.current);
    resultsRef.current = [];
    setResults([]);
    setSelectedSampleId(null);
    setProgress({ current: 0, total: 0 });
    setAnnotations({});
    setLegacyAnnotations([]);
    setLineOutput((current) => {
      wipePalmLineExtraction(current);
      return null;
    });
    setSelectedLineComparison((current) => {
      if (current) {
        wipePalmLineExtraction(current.baseline);
        wipePalmLineExtraction(current.experiment);
        wipePalmLineExtraction(current.interior);
        current.baselineDiagnostics?.overlay.data.fill(0);
        current.experimentDiagnostics?.overlay.data.fill(0);
        current.interiorDiagnostics?.overlay.data.fill(0);
      }
      return null;
    });
  }, [disposeResults]);

  useEffect(() => {
    const directoryInput = directoryInputRef.current;
    directoryInput?.setAttribute("webkitdirectory", "");
    directoryInput?.setAttribute("directory", "");
    return () => {
      runIdRef.current += 1;
      disposeResults(resultsRef.current);
      resultsRef.current = [];
    };
  }, [disposeResults]);

  const queueFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return;
    const supported = Array.from(selectedFiles).filter(
      (file) =>
        (!file.type || file.type.startsWith("image/")) &&
        SUPPORTED_IMAGE.test(file.name),
    );
    clearResults();
    const balanced = selectBalancedEvaluationFiles(
      supported,
      MAX_EVALUATION_BATCH,
    );
    setQueuedFiles(balanced);
    setNotice(
      supported.length > MAX_EVALUATION_BATCH
        ? `${supported.length} gambar dipilih. Batch dibatasi ${MAX_EVALUATION_BATCH} sampel dan diseimbangkan antar-subjek.`
        : `${balanced.length} gambar siap diproses secara berurutan.`,
    );
  };

  const processFile = async (
    file: File,
    sampleIndex: number,
  ): Promise<PalmEvaluationResult> => {
    const startedAt = performance.now();
    const sampleFingerprint = await fingerprintFile(file);
    let bitmap: ImageBitmap | null = null;
    let frameCanvas: HTMLCanvasElement | null = null;
    let roiCanvas: HTMLCanvasElement | null = null;
    let retainedImages: PalmEvaluationResult["images"] = null;

    try {
      bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
      frameCanvas = document.createElement("canvas");
      frameCanvas.width = bitmap.width;
      frameCanvas.height = bitmap.height;
      const frameContext = frameCanvas.getContext("2d", { willReadFrequently: true });
      if (!frameContext) throw new Error("Canvas frame tidak tersedia.");
      frameContext.drawImage(bitmap, 0, 0);
      const sourceWidth = frameCanvas.width;
      const sourceHeight = frameCanvas.height;

      const detection = imageModel.detect(bitmap);
      const handCount = detection.landmarks.length;
      const detectionStatus = handCount === 0
        ? "not-detected"
        : handCount === 1
          ? "single"
          : "multiple";
      const landmarkCount = detection.landmarks.reduce(
        (total, landmarks) => total + landmarks.length,
        0,
      );
      const handednessName = detection.handedness[0]?.[0]?.categoryName;
      const detectedHandedness = handednessName === "Left" || handednessName === "Right"
        ? handednessName
        : null;

      let roiValid = false;
      let palmLargeEnough = false;
      let roiFailureReason: string | null = null;
      let roiFailureCategory: PalmEvaluationResult["roiFailureCategory"] = null;
      let roiMethod: PalmEvaluationResult["roiMethod"] = null;
      let diagnostics: PalmRoiDiagnostics | null = null;
      let palmInteriorGeometry: PalmInteriorGeometry | null = null;
      let diagnosticImage: ImageData | null = null;
      let imageMetrics = analyzeCanvasAtLimitedResolution(frameCanvas);
      let metricSource: PalmEvaluationResult["metricSource"] = "source";
      let roiProcessingMs = 0;
      let baselineGeometry: PalmRoiGeometry | null = null;
      let baselineDiagnostics: PalmRoiDiagnostics | null = null;
      let baselineStatus: PalmEvaluationResult["baseline"]["roiStatus"] = "not-attempted";
      let baselineFailureCategory: PalmEvaluationResult["baseline"]["failureCategory"] = null;
      let baselineFailureReason: string | null = null;
      let baselineRoiWidth: number | null = null;
      let baselineRoiHeight: number | null = null;
      let baselineImageMetrics: PalmEvaluationResult["baseline"]["imageMetrics"] = null;
      let baselineRoiProcessingMs = 0;

      if (handCount === 1) {
        const relaxedConfig = {
          ...DEFAULT_PALM_ROI_CONFIG,
          minimumWidthPixels: 0,
          minimumHeightPixels: 0,
        };
        const baselineStartedAt = performance.now();
        const baselineResult = calculatePalmRoiGeometry(
          detection.landmarks[0],
          frameCanvas.width,
          frameCanvas.height,
          relaxedConfig,
        );
        if (baselineResult.ok) {
          baselineGeometry = baselineResult.geometry;
          const baselineLargeEnough =
            baselineResult.geometry.palmWidth >= DEFAULT_PALM_ROI_CONFIG.minimumWidthPixels &&
            baselineResult.geometry.palmHeight >= DEFAULT_PALM_ROI_CONFIG.minimumHeightPixels;
          baselineStatus = baselineLargeEnough ? "success" : "failed";
          baselineFailureCategory = baselineLargeEnough ? null : "palm-too-small";
          baselineFailureReason = baselineLargeEnough
            ? null
            : "Ukuran telapak di bawah minimum ROI 80 x 96 piksel.";
          baselineRoiWidth = baselineLargeEnough ? baselineResult.geometry.outputWidth : null;
          baselineRoiHeight = baselineLargeEnough ? baselineResult.geometry.outputHeight : null;
          if (baselineLargeEnough) {
            const baselineCanvas = extractPalmRoi(frameCanvas, baselineResult.geometry);
            const baselineContext = baselineCanvas.getContext("2d", { willReadFrequently: true });
            if (!baselineContext) throw new Error("Canvas baseline ROI tidak tersedia.");
            const baselineImageData = baselineContext.getImageData(
              0,
              0,
              baselineCanvas.width,
              baselineCanvas.height,
            );
            baselineImageMetrics = analyzePalmImageQuality({
              width: baselineImageData.width,
              height: baselineImageData.height,
              data: baselineImageData.data,
            });
            baselineImageData.data.fill(0);
            baselineContext.clearRect(0, 0, baselineCanvas.width, baselineCanvas.height);
            baselineCanvas.width = 0;
            baselineCanvas.height = 0;
          }
          baselineDiagnostics = {
            method: "baseline",
            frameWidth: frameCanvas.width,
            frameHeight: frameCanvas.height,
            rotationDegrees: baselineResult.geometry.rotationDegrees,
            landmarks: detection.landmarks[0].map((landmark) => ({
              x: landmark.x * sourceWidth,
              y: landmark.y * sourceHeight,
            })),
            candidateCorners: baselineResult.geometry.sourceCorners,
            outsideCornerIndices: [],
            paddingScale: 1,
          };
        } else {
          baselineStatus = "failed";
          baselineFailureCategory = baselineResult.category;
          baselineFailureReason = baselineResult.reason;
          baselineDiagnostics = baselineResult.diagnostics ?? null;
        }
        baselineRoiProcessingMs = performance.now() - baselineStartedAt;

        const candidateStartedAt = performance.now();
        const geometryResult = calculateAdaptivePalmRoiGeometry(
          detection.landmarks[0],
          frameCanvas.width,
          frameCanvas.height,
          relaxedConfig,
        );
        if (geometryResult.ok) {
          diagnostics = geometryResult.diagnostics;
          roiMethod = geometryResult.method;
          roiValid = true;
          palmInteriorGeometry = createPalmInteriorGeometry(
            detection.landmarks[0],
            frameCanvas.width,
            frameCanvas.height,
            geometryResult.geometry,
          );
          palmLargeEnough =
            geometryResult.geometry.palmWidth >= DEFAULT_PALM_ROI_CONFIG.minimumWidthPixels &&
            geometryResult.geometry.palmHeight >= DEFAULT_PALM_ROI_CONFIG.minimumHeightPixels;

          if (palmLargeEnough) {
            roiCanvas = extractPalmRoi(frameCanvas, geometryResult.geometry);
            const roiContext = roiCanvas.getContext("2d", { willReadFrequently: true });
            if (!roiContext) throw new Error("Canvas ROI tidak tersedia.");
            const roiImageData = roiContext.getImageData(
              0,
              0,
              roiCanvas.width,
              roiCanvas.height,
            );
            retainedImages = preprocessPalmImage({
              width: roiImageData.width,
              height: roiImageData.height,
              data: roiImageData.data,
            });
            roiImageData.data.fill(0);
            imageMetrics = analyzePalmImageQuality(retainedImages.original);
            metricSource = "roi";
          } else {
            roiFailureCategory = "palm-too-small";
            roiFailureReason = "Ukuran telapak di bawah minimum ROI 80 x 96 piksel.";
          }
        } else {
          diagnostics = geometryResult.diagnostics ?? null;
          roiFailureCategory = geometryResult.category;
          roiFailureReason = geometryResult.reason;
        }
        roiProcessingMs = performance.now() - candidateStartedAt;
        diagnosticImage = buildDiagnosticImage(
          frameCanvas,
          detection.landmarks[0],
          baselineGeometry,
          baselineDiagnostics,
          geometryResult.ok ? geometryResult.geometry : null,
          diagnostics,
        );
      } else {
        roiFailureReason = handCount === 0
          ? "ROI tidak dibuat karena tangan tidak terdeteksi."
          : "ROI tidak dibuat karena foto berisi lebih dari satu tangan.";
      }

      const quality = evaluateStaticPalmQuality({
        handCount,
        roiValid,
        palmLargeEnough,
        imageMetrics,
      });
      let lineExperiment: PalmEvaluationResult["lineExperiment"] = null;
      let lineRefinementExperiment: PalmEvaluationResult["lineRefinementExperiment"] = null;
      let lineInteriorExperiment: PalmEvaluationResult["lineInteriorExperiment"] = null;
      let lineInteriorMetrics: PalmEvaluationResult["lineInteriorMetrics"] = {
        baselineOutsideCandidates: null,
        baselineOutsideLengthPixels: null,
        refinementOutsideCandidates: null,
        refinementOutsideLengthPixels: null,
        interiorOutsideCandidates: null,
        interiorOutsideLengthPixels: null,
      };
      if (retainedImages) {
        const extraction = extractPalmLineCandidates(retainedImages.original);
        const refinedExtraction = extractRefinedPalmLineCandidates(retainedImages.original);
        const interiorExtraction = palmInteriorGeometry
          ? extractPalmInteriorLineCandidates(retainedImages.original, palmInteriorGeometry)
          : null;
        lineExperiment = summarizePalmLineExtraction(extraction);
        lineRefinementExperiment = summarizePalmLineExtraction(refinedExtraction);
        lineInteriorExperiment = interiorExtraction ? summarizePalmLineExtraction(interiorExtraction) : null;
        if (palmInteriorGeometry) {
          const baselineInterior = measurePalmInteriorCandidates(extraction.candidates, palmInteriorGeometry);
          const refinementInterior = measurePalmInteriorCandidates(refinedExtraction.candidates, palmInteriorGeometry);
          const experimentInterior = interiorExtraction
            ? measurePalmInteriorCandidates(interiorExtraction.candidates, palmInteriorGeometry)
            : null;
          lineInteriorMetrics = {
            baselineOutsideCandidates: baselineInterior?.outsideCandidateCount ?? null,
            baselineOutsideLengthPixels: baselineInterior?.outsideLengthPixels ?? null,
            refinementOutsideCandidates: refinementInterior?.outsideCandidateCount ?? null,
            refinementOutsideLengthPixels: refinementInterior?.outsideLengthPixels ?? null,
            interiorOutsideCandidates: experimentInterior?.outsideCandidateCount ?? null,
            interiorOutsideLengthPixels: experimentInterior?.outsideLengthPixels ?? null,
          };
        }
        wipePalmLineExtraction(extraction);
        wipePalmLineExtraction(refinedExtraction);
        wipePalmLineExtraction(interiorExtraction);
      }

      return {
        sampleId: createEvaluationSampleId(sampleIndex, sampleFingerprint),
        sampleFingerprint,
        roiSignature: createRoiSignature({
          sampleFingerprint,
          roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
          roiMethod,
          roiWidth: retainedImages?.original.width ?? null,
          roiHeight: retainedImages?.original.height ?? null,
          rotationDegrees: diagnostics?.rotationDegrees ?? null,
          paddingScale: diagnostics?.paddingScale ?? null,
        }),
        roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
        sampleName: file.name,
        sourceWidth: frameCanvas.width,
        sourceHeight: frameCanvas.height,
        detectionStatus,
        landmarkCount,
        detectedHandedness,
        roiStatus: retainedImages ? "success" : handCount === 1 ? "failed" : "not-attempted",
        roiMethod,
        roiFailureCategory,
        roiFailureReason,
        roiWidth: retainedImages?.original.width ?? null,
        roiHeight: retainedImages?.original.height ?? null,
        images: retainedImages,
        diagnosticImage,
        diagnostics,
        palmInteriorGeometry,
        imageMetrics,
        metricSource,
        quality,
        processingMs: performance.now() - startedAt,
        roiProcessingMs,
        baseline: {
          roiStatus: baselineStatus,
          failureCategory: baselineFailureCategory,
          failureReason: baselineFailureReason,
          roiWidth: baselineRoiWidth,
          roiHeight: baselineRoiHeight,
          imageMetrics: baselineImageMetrics,
          roiProcessingMs: baselineRoiProcessingMs,
          diagnostics: baselineDiagnostics,
        },
        metadata: parseEvaluationMetadata(file),
        manualRoi: "unreviewed",
        manualLines: "unreviewed",
        lineExperiment,
        lineRefinementExperiment,
        lineInteriorExperiment,
        lineInteriorMetrics,
        lineCandidateAssessment: "unreviewed",
      };
    } catch {
      wipeProcessedPalmImages(retainedImages);
      const quality = evaluateStaticPalmQuality({
        handCount: 0,
        roiValid: false,
        palmLargeEnough: false,
        imageMetrics: null,
      });
      quality.reasons.unshift("File gagal diproses oleh pipeline lokal.");
      return {
        sampleId: createEvaluationSampleId(sampleIndex, sampleFingerprint),
        sampleFingerprint,
        roiSignature: null,
        roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
        sampleName: file.name,
        sourceWidth: bitmap?.width ?? 0,
        sourceHeight: bitmap?.height ?? 0,
        detectionStatus: "error",
        landmarkCount: 0,
        detectedHandedness: null,
        roiStatus: "not-attempted",
        roiMethod: null,
        roiFailureCategory: "invalid-input",
        roiFailureReason: "Pipeline gambar mengalami kesalahan.",
        roiWidth: null,
        roiHeight: null,
        images: null,
        diagnosticImage: null,
        diagnostics: null,
        palmInteriorGeometry: null,
        imageMetrics: null,
        metricSource: "source",
        quality,
        processingMs: performance.now() - startedAt,
        roiProcessingMs: 0,
        baseline: {
          roiStatus: "not-attempted",
          failureCategory: "invalid-input",
          failureReason: "Pipeline gambar mengalami kesalahan.",
          roiWidth: null,
          roiHeight: null,
          imageMetrics: null,
          roiProcessingMs: 0,
          diagnostics: null,
        },
        metadata: parseEvaluationMetadata(file),
        manualRoi: "unreviewed",
        manualLines: "unreviewed",
        lineExperiment: null,
        lineRefinementExperiment: null,
        lineInteriorExperiment: null,
        lineInteriorMetrics: {
          baselineOutsideCandidates: null,
          baselineOutsideLengthPixels: null,
          refinementOutsideCandidates: null,
          refinementOutsideLengthPixels: null,
          interiorOutsideCandidates: null,
          interiorOutsideLengthPixels: null,
        },
        lineCandidateAssessment: "unreviewed",
      };
    } finally {
      bitmap?.close();
      if (roiCanvas) {
        roiCanvas.getContext("2d")?.clearRect(0, 0, roiCanvas.width, roiCanvas.height);
        roiCanvas.width = 0;
        roiCanvas.height = 0;
      }
      if (frameCanvas) {
        frameCanvas.getContext("2d")?.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
        frameCanvas.width = 0;
        frameCanvas.height = 0;
      }
    }
  };

  const runEvaluation = async () => {
    if (imageModel.status !== "ready" || queuedFiles.length === 0 || isProcessing) return;
    const runId = runIdRef.current + 1;
    runIdRef.current = runId;
    disposeResults(resultsRef.current);
    resultsRef.current = [];
    setResults([]);
    setSelectedSampleId(null);
    setIsProcessing(true);
    setProgress({ current: 0, total: queuedFiles.length });

    for (let index = 0; index < queuedFiles.length; index += 1) {
      if (runIdRef.current !== runId) break;
      const result = await processFile(queuedFiles[index], index);
      if (runIdRef.current !== runId) {
        wipeProcessedPalmImages(result.images);
        result.diagnosticImage?.data.fill(0);
        break;
      }
      const nextResults = [...resultsRef.current, result];
      resultsRef.current = nextResults;
      setResults(nextResults);
      setSelectedSampleId((current) => current ?? result.sampleId);
      setProgress({ current: index + 1, total: queuedFiles.length });
      await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));
    }

    if (runIdRef.current === runId) {
      setIsProcessing(false);
      setQueuedFiles([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      if (directoryInputRef.current) directoryInputRef.current.value = "";
    }
  };

  const resetEvaluation = () => {
    clearResults();
    setQueuedFiles([]);
    setIsProcessing(false);
    setNotice(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    if (directoryInputRef.current) directoryInputRef.current.value = "";
  };

  const updateManualAssessment = (
    sampleId: string,
    field: "manualRoi" | "manualLines" | "lineCandidateAssessment",
    value: ManualRoiAssessment | ManualLineAssessment | LineCandidateAssessment,
  ) => {
    const nextResults = resultsRef.current.map((result) =>
      result.sampleId === sampleId ? { ...result, [field]: value } : result,
    );
    resultsRef.current = nextResults;
    setResults(nextResults);
  };

  const subjects = useMemo(
    () => [...new Set(results.map((result) => result.metadata.subjectGroup))].sort(),
    [results],
  );
  const filteredResults = useMemo(
    () => results.filter((result) =>
      (handFilter === "all" || result.metadata.handGroup === handFilter) &&
      (cameraFilter === "all" || result.metadata.cameraGroup === cameraFilter) &&
      (subjectFilter === "all" || result.metadata.subjectGroup === subjectFilter)),
    [cameraFilter, handFilter, results, subjectFilter],
  );
  const summary = useMemo(
    () => summarizePalmEvaluations(filteredResults),
    [filteredResults],
  );
  const selectedResult = results.find((result) => result.sampleId === selectedSampleId) ?? null;
  const selectedAnnotation = selectedResult
    ? annotations[selectedResult.sampleFingerprint] ?? null
    : null;
  const selectedPolylines = useMemo(
    () => selectedAnnotation?.polylines ?? [],
    [selectedAnnotation],
  );

  useEffect(() => {
    const source = selectedResult?.images?.original;
    if (!lineExperimentEnabled || !source) {
      setLineOutput((current) => {
        wipePalmLineExtraction(current);
        return null;
      });
      return;
    }
    const output = extractPalmLineCandidates(source, lineConfig);
    setLineOutput((current) => {
      wipePalmLineExtraction(current);
      return output;
    });
    return () => wipePalmLineExtraction(output);
  }, [lineConfig, lineExperimentEnabled, selectedResult?.images?.original]);

  useEffect(() => {
    const source = selectedResult?.images?.original;
    if (!lineExperimentEnabled || !source) {
      setSelectedLineComparison(null);
      return;
    }
    const baseline = extractPalmLineCandidates(source, DEFAULT_PALM_LINE_CONFIG);
    const experiment = extractRefinedPalmLineCandidates(source, DEFAULT_PALM_LINE_CONFIG);
    const interior = selectedResult?.palmInteriorGeometry
      ? extractPalmInteriorLineCandidates(source, selectedResult.palmInteriorGeometry, DEFAULT_PALM_LINE_CONFIG)
      : null;
    const baselineDiagnostics = selectedPolylines.length
      ? createPalmLineErrorDiagnostics(source, baseline.candidates, selectedPolylines, 6)
      : null;
    const experimentDiagnostics = selectedPolylines.length
      ? createPalmLineErrorDiagnostics(source, experiment.candidates, selectedPolylines, 6)
      : null;
    const interiorDiagnostics = selectedPolylines.length && interior
      ? createPalmLineErrorDiagnostics(source, interior.candidates, selectedPolylines, 6)
      : null;
    const comparison = { baseline, experiment, interior, baselineDiagnostics, experimentDiagnostics, interiorDiagnostics };
    setSelectedLineComparison(comparison);
    return () => {
      wipePalmLineExtraction(baseline);
      wipePalmLineExtraction(experiment);
      wipePalmLineExtraction(interior);
      baselineDiagnostics?.overlay.data.fill(0);
      experimentDiagnostics?.overlay.data.fill(0);
      interiorDiagnostics?.overlay.data.fill(0);
    };
  }, [lineExperimentEnabled, selectedPolylines, selectedResult?.images?.original, selectedResult?.palmInteriorGeometry]);

  const groundTruthComparison = useMemo(() => {
    const baselineReports: Record<string, PalmGroundTruthReport> = {};
    const experimentReports: Record<string, PalmGroundTruthReport> = {};
    const interiorReports: Record<string, PalmGroundTruthReport> = {};
    results.forEach((result) => {
      const annotation = annotations[result.sampleFingerprint];
      if (!annotation) return;
      if (!["exact", "legacy-confirmed"].includes(annotation.compatibility) || !result.images) {
        const unavailableInput = {
          annotation,
          candidates: [],
          extractionStatus: (result.images ? "detected" : "abstain") as "detected" | "abstain",
          abstainReason: result.images ? null : "Palm ROI tidak tersedia.",
          roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
          lineExtractionVersion: PALM_LINE_EXTRACTION_VERSION,
          lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
        };
        baselineReports[result.sampleFingerprint] = evaluatePalmGroundTruth(unavailableInput);
        experimentReports[result.sampleFingerprint] = evaluatePalmGroundTruth({
          ...unavailableInput,
          lineExtractionVersion: `${PALM_LINE_EXTRACTION_VERSION}+${PALM_LINE_REFINEMENT_VERSION}`,
        });
        interiorReports[result.sampleFingerprint] = evaluatePalmGroundTruth({
          ...unavailableInput,
          extractionStatus: "abstain",
          abstainReason: result.palmInteriorGeometry?.reason ?? "Palm interior mask tidak tersedia.",
          lineExtractionVersion: `${PALM_LINE_EXTRACTION_VERSION}+${PALM_INTERIOR_EXPERIMENT_VERSION}`,
        });
        return;
      }
      const baseline = extractPalmLineCandidates(result.images.original, DEFAULT_PALM_LINE_CONFIG);
      const experiment = extractRefinedPalmLineCandidates(result.images.original, DEFAULT_PALM_LINE_CONFIG);
      const interior = result.palmInteriorGeometry
        ? extractPalmInteriorLineCandidates(result.images.original, result.palmInteriorGeometry, DEFAULT_PALM_LINE_CONFIG)
        : null;
      baselineReports[result.sampleFingerprint] = evaluatePalmGroundTruth({
        annotation,
        candidates: baseline.candidates,
        extractionStatus: baseline.status,
        abstainReason: baseline.abstainReason,
        roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
        lineExtractionVersion: PALM_LINE_EXTRACTION_VERSION,
        lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
      });
      experimentReports[result.sampleFingerprint] = evaluatePalmGroundTruth({
        annotation,
        candidates: experiment.candidates,
        extractionStatus: experiment.status,
        abstainReason: experiment.abstainReason,
        roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
        lineExtractionVersion: `${PALM_LINE_EXTRACTION_VERSION}+${PALM_LINE_REFINEMENT_VERSION}`,
        lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
      });
      interiorReports[result.sampleFingerprint] = evaluatePalmGroundTruth({
        annotation,
        candidates: interior?.candidates ?? [],
        extractionStatus: interior?.status ?? "abstain",
        abstainReason: interior?.abstainReason ?? "Palm interior mask tidak tersedia.",
        roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
        lineExtractionVersion: `${PALM_LINE_EXTRACTION_VERSION}+${PALM_INTERIOR_EXPERIMENT_VERSION}`,
        lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
      });
      wipePalmLineExtraction(baseline);
      wipePalmLineExtraction(experiment);
      wipePalmLineExtraction(interior);
    });
    return { baselineReports, experimentReports, interiorReports };
  }, [annotations, results]);
  const groundTruthReports = groundTruthComparison.baselineReports;
  const experimentGroundTruthReports = groundTruthComparison.experimentReports;
  const interiorGroundTruthReports = groundTruthComparison.interiorReports;
  const groundTruthSummary = useMemo(
    () => summarizeGroundTruthReports(Object.values(groundTruthReports)),
    [groundTruthReports],
  );
  const experimentGroundTruthSummary = useMemo(
    () => summarizeGroundTruthReports(Object.values(experimentGroundTruthReports)),
    [experimentGroundTruthReports],
  );
  const interiorGroundTruthSummary = useMemo(
    () => summarizeGroundTruthReports(Object.values(interiorGroundTruthReports)),
    [interiorGroundTruthReports],
  );
  const lineVariantSummary = useMemo(() => {
    const valid = filteredResults.filter((result) => result.lineExperiment && result.lineRefinementExperiment);
    const average = (values: number[]) => values.length
      ? values.reduce((total, value) => total + value, 0) / values.length
      : null;
    return {
      denominator: valid.length,
      baselineSegments: valid.reduce((total, result) => total + (result.lineExperiment?.candidateCount ?? 0), 0),
      experimentSegments: valid.reduce((total, result) => total + (result.lineRefinementExperiment?.candidateCount ?? 0), 0),
      baselineLength: valid.reduce((total, result) => total + (result.lineExperiment?.totalLengthPixels ?? 0), 0),
      experimentLength: valid.reduce((total, result) => total + (result.lineRefinementExperiment?.totalLengthPixels ?? 0), 0),
      acceptedBridges: valid.reduce((total, result) => total + (result.lineRefinementExperiment?.acceptedBridgeCount ?? 0), 0),
      baselineTime: average(valid.map((result) => result.lineExperiment?.processingMs ?? 0)),
      experimentTime: average(valid.map((result) => result.lineRefinementExperiment?.processingMs ?? 0)),
      interiorSegments: valid.reduce((total, result) => total + (result.lineInteriorExperiment?.candidateCount ?? 0), 0),
      interiorLength: valid.reduce((total, result) => total + (result.lineInteriorExperiment?.totalLengthPixels ?? 0), 0),
      interiorTime: average(valid.flatMap((result) => result.lineInteriorExperiment ? [result.lineInteriorExperiment.processingMs] : [])),
      baselineOutsideCandidates: valid.reduce((total, result) => total + (result.lineInteriorMetrics.baselineOutsideCandidates ?? 0), 0),
      interiorOutsideCandidates: valid.reduce((total, result) => total + (result.lineInteriorMetrics.interiorOutsideCandidates ?? 0), 0),
    };
  }, [filteredResults]);
  const selectedGroundTruthReport = selectedResult
    ? groundTruthReports[selectedResult.sampleFingerprint] ?? null
    : null;
  const selectedExperimentGroundTruthReport = selectedResult
    ? experimentGroundTruthReports[selectedResult.sampleFingerprint] ?? null
    : null;
  const selectedInteriorGroundTruthReport = selectedResult
    ? interiorGroundTruthReports[selectedResult.sampleFingerprint] ?? null
    : null;
  const selectedVariantOutput = selectedLineComparison
    ? lineVariantView === "baseline"
      ? selectedLineComparison.baseline
      : lineVariantView === "evidence-bridge"
        ? selectedLineComparison.experiment
        : selectedLineComparison.interior
    : null;

  const updateSelectedAnnotations = (
    polylines: ManualPalmLineAnnotation[],
    status: PalmAnnotationStatus = polylines.length ? "annotated" : "unreviewed",
    completeness: PalmAnnotationCompleteness = selectedAnnotation?.completeness ?? "partial",
  ) => {
    if (!selectedResult) return;
    setAnnotations((current) => ({
      ...current,
      [selectedResult.sampleFingerprint]: {
        sourceVersion: 2,
        sampleId: selectedResult.sampleId,
        sampleFingerprint: selectedResult.sampleFingerprint,
        roiSignature: selectedResult.roiSignature,
        roiWidth: selectedResult.roiWidth,
        roiHeight: selectedResult.roiHeight,
        roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
        lineExtractionVersion: PALM_LINE_EXTRACTION_VERSION,
        lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
        status,
        completeness: status === "annotated" ? completeness : "unknown",
        compatibility: "exact",
        compatibilityReason: "Fingerprint, ROI, dan versi pipeline cocok.",
        polylines,
      },
    }));
  };

  const exportAnnotations = () => {
    const samples = results.flatMap((result) => {
      const annotation = annotations[result.sampleFingerprint];
      if (!annotation || annotation.status === "unreviewed") return [];
      return [{
        sample_id: result.sampleId,
        sample_fingerprint: result.sampleFingerprint,
        roi_signature: result.roiSignature,
        roi_width: result.roiWidth,
        roi_height: result.roiHeight,
        roi_algorithm_version: PALM_ROI_ALGORITHM_VERSION,
        line_extraction_version: PALM_LINE_EXTRACTION_VERSION,
        line_parameter_version: PALM_LINE_PARAMETER_VERSION,
        annotation_status: annotation.status,
        completeness: annotation.completeness,
        polylines: annotation.polylines,
      }];
    });
    if (!samples.length) return;
    const blob = new Blob([JSON.stringify({
      format: PALM_GROUND_TRUTH_FORMAT,
      version: PALM_GROUND_TRUTH_VERSION,
      samples,
    }, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "metemu-palm-line-annotations.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const exportSelectedRoiPair = async () => {
    const result = selectedResult;
    const annotation = selectedAnnotation;
    if (!result?.images || !annotation || annotation.status === "unreviewed") {
      setNotice("Pilih ROI dan tetapkan anotasi sebagai annotated atau undetermined sebelum ekspor.");
      return;
    }
    if (!result.roiSignature || !result.roiMethod || !result.diagnostics) {
      setNotice("Ekspor ditolak karena signature atau transformasi ROI tidak lengkap.");
      return;
    }

    setIsExportingPair(true);
    let baseline: PalmLineExtractionResult | null = null;
    let roiBytes: Uint8Array | null = null;
    let annotationBytes: Uint8Array | null = null;
    let archiveBytes: Uint8Array | null = null;
    try {
      const stem = createPalmExportStem(result.sampleId);
      const roiFilename = `${stem}-roi.png`;
      const annotationFilename = `${stem}-annotations.json`;
      const manifestFilename = `${stem}-benchmark.json`;
      const archiveFilename = `${stem}-benchmark-package.zip`;
      const roiBlob = await encodeRgbaPng(result.images.original);
      const roiBuffer = await roiBlob.arrayBuffer();
      roiBytes = new Uint8Array(roiBuffer);
      const [roiSha256, roiPixelSha256] = await Promise.all([
        createContentFingerprint(roiBuffer),
        verifyLosslessPng(roiBlob, result.images.original),
      ]);

      baseline = extractPalmLineCandidates(
        result.images.original,
        DEFAULT_PALM_LINE_CONFIG,
      );
      const interiorMetrics = result.palmInteriorGeometry
        ? measurePalmInteriorCandidates(baseline.candidates, result.palmInteriorGeometry)
        : null;
      const annotationSample: PalmAnnotationExportSample = {
        sample_id: result.sampleId,
        sample_fingerprint: result.sampleFingerprint,
        roi_signature: result.roiSignature,
        roi_width: result.images.original.width,
        roi_height: result.images.original.height,
        roi_algorithm_version: PALM_ROI_ALGORITHM_VERSION,
        annotation_status: annotation.status,
        completeness: annotation.completeness,
        polylines: annotation.polylines.map((polyline) => ({
          id: polyline.id,
          points: polyline.points.map((point) => ({ x: point.x, y: point.y })),
        })),
      };
      const annotationDocument = {
        format: PALM_GROUND_TRUTH_FORMAT,
        version: PALM_GROUND_TRUTH_VERSION,
        samples: [{
          ...annotationSample,
          line_extraction_version: PALM_LINE_EXTRACTION_VERSION,
          line_parameter_version: PALM_LINE_PARAMETER_VERSION,
        }],
      };
      const manifestSample: PalmBenchmarkManifestSample = {
        sample_id: result.sampleId,
        source_fingerprint: result.sampleFingerprint,
        roi_path: roiFilename,
        roi_sha256: roiSha256,
        roi_pixel_sha256: roiPixelSha256,
        roi_signature: result.roiSignature,
        roi_width: result.images.original.width,
        roi_height: result.images.original.height,
        roi_algorithm_version: PALM_ROI_ALGORITHM_VERSION,
        roi_method: result.roiMethod,
        rotation_degrees: result.diagnostics.rotationDegrees,
        padding_scale: result.diagnostics.paddingScale,
        subject_group: result.metadata.subjectGroup,
        hand_group: result.metadata.handGroup,
        camera_group: result.metadata.cameraGroup,
        split: assignPalmPilotSplit(result.metadata.subjectGroup),
        quality_status: result.quality.status,
        javascript_baseline: {
          algorithm_version: PALM_LINE_EXTRACTION_VERSION,
          parameter_version: PALM_LINE_PARAMETER_VERSION,
          status: baseline.status,
          abstain_reason: baseline.abstainReason,
          candidate_count: baseline.candidates.length,
          total_length_pixels: baseline.candidates.reduce(
            (total, candidate) => total + candidate.lengthPixels,
            0,
          ),
          near_outer_contour_count: interiorMetrics?.outsideCandidateCount ?? null,
          processing_time_ms: baseline.processingMs,
          candidates: baseline.candidates.map((candidate) => ({
            id: candidate.id,
            points: candidate.points.map((point) => ({ x: point.x, y: point.y })),
            length_pixels: candidate.lengthPixels,
          })),
        },
      };
      const validation = validatePalmExportPair({
        manifest: manifestSample,
        annotation: annotationSample,
        actualRoiSha256: roiSha256,
        actualPixelSha256: roiPixelSha256,
        actualWidth: result.images.original.width,
        actualHeight: result.images.original.height,
      });
      if (validation.status === "invalid") {
        throw new Error(`Pasangan ekspor tidak valid: ${validation.reasons.join(" ")}`);
      }
      const manifest = createPalmBenchmarkManifest({
        annotationsFile: annotationFilename,
        sample: manifestSample,
      });
      annotationBytes = new TextEncoder().encode(JSON.stringify(annotationDocument, null, 2));
      archiveBytes = createPalmBenchmarkArchive({
        roiFilename,
        roiBytes,
        annotationFilename,
        annotationBytes,
        manifestFilename,
        manifest,
      });
      const archiveBuffer = new ArrayBuffer(archiveBytes.byteLength);
      new Uint8Array(archiveBuffer).set(archiveBytes);
      const archiveBlob = new Blob([archiveBuffer], { type: "application/zip" });
      try {
        downloadLocalBlob(archiveBlob, archiveFilename);
      } finally {
        new Uint8Array(archiveBuffer).fill(0);
      }
      setNotice(
        `ZIP ${archiveFilename} berhasil dibuat dengan ROI PNG, anotasi v2, dan manifest ${validation.status}.`,
      );
    } catch (error) {
      setNotice(
        error instanceof Error
          ? `Paket tidak diunduh: ${error.message}`
          : "Paket tidak diunduh karena ekspor ROI gagal.",
      );
    } finally {
      roiBytes?.fill(0);
      annotationBytes?.fill(0);
      archiveBytes?.fill(0);
      wipePalmLineExtraction(baseline);
      setIsExportingPair(false);
    }
  };

  const importAnnotations = async (file: File | null) => {
    if (!file) return;
    if (file.size > 2_000_000) {
      setNotice("File anotasi ditolak karena melebihi 2 MB.");
      return;
    }
    try {
      const parsed = parsePalmAnnotationDocument(JSON.parse(await file.text()));
      if (parsed.version === 1) {
        setLegacyAnnotations(parsed.samples);
        setSelectedLegacyIndex(0);
        setNotice(`${parsed.samples.length} anotasi v1 dimuat sebagai antrean pemetaan manual. Tidak ada pencocokan otomatis berdasarkan sample_id.`);
        return;
      }
      const knownResults = new Map(results.map((result) => [result.sampleFingerprint, result]));
      const imported: Record<string, PalmGroundTruthAnnotation> = {};
      let exactCount = 0;
      let unmatchedCount = 0;
      parsed.samples.forEach((annotation) => {
        const fingerprint = annotation.sampleFingerprint;
        const result = fingerprint ? knownResults.get(fingerprint) : null;
        if (!fingerprint || !result) {
          unmatchedCount += 1;
          return;
        }
        const resolved = resolveAnnotationCompatibility(annotation, result, {
          roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
          lineExtractionVersion: PALM_LINE_EXTRACTION_VERSION,
          lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
        });
        if (resolved.compatibility === "exact") exactCount += 1;
        imported[fingerprint] = resolved;
      });
      setAnnotations((current) => ({ ...current, ...imported }));
      setNotice(`${exactCount} anotasi v2 kompatibel; ${Object.keys(imported).length - exactCount} mismatch ditahan tanpa skor; ${unmatchedCount} fingerprint tidak ada pada batch aktif.`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "File anotasi tidak valid.");
    } finally {
      if (annotationInputRef.current) annotationInputRef.current.value = "";
    }
  };

  const confirmLegacyMapping = () => {
    const legacy = legacyAnnotations[selectedLegacyIndex];
    if (!legacy || !selectedResult) return;
    if (legacy.roiWidth !== selectedResult.roiWidth || legacy.roiHeight !== selectedResult.roiHeight) {
      setNotice("Pemetaan v1 ditolak: dimensi ROI anotasi berbeda dari sampel terpilih.");
      return;
    }
    setAnnotations((current) => ({
      ...current,
      [selectedResult.sampleFingerprint]: {
        ...legacy,
        sampleId: selectedResult.sampleId,
        sampleFingerprint: selectedResult.sampleFingerprint,
        roiSignature: selectedResult.roiSignature,
        roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
        lineExtractionVersion: PALM_LINE_EXTRACTION_VERSION,
        lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
        compatibility: "legacy-confirmed",
        compatibilityReason: `Anotasi v1 ${legacy.sampleId} dipetakan manual ke sampel ini.`,
      },
    }));
    setLegacyAnnotations((current) => current.filter((_, index) => index !== selectedLegacyIndex));
    setSelectedLegacyIndex(0);
    setNotice(`Pemetaan manual ${legacy.sampleId} dikonfirmasi untuk ${selectedResult.sampleId}.`);
  };

  const exportCsv = () => {
    if (filteredResults.length === 0) return;
    const blob = new Blob([createPalmEvaluationCsv(
      filteredResults,
      groundTruthReports,
      experimentGroundTruthReports,
      interiorGroundTruthReports,
    )], {
      type: "text/csv;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "metemu-palm-evaluation.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <section className="rounded-[2rem] border border-[#c59b3d]/25 bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9f3e2f]">
              Development Tool
            </p>
            <h1 className="mt-2 font-display text-3xl font-bold text-stone-900 md:text-4xl">
              Palm Dataset Evaluation
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-600">
              Pilih file secara eksplisit dari perangkat. Semua gambar diproses lokal
              menggunakan MediaPipe IMAGE mode dan tidak dikirim ke server.
            </p>
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 px-4 py-3 text-xs text-stone-600">
            <p className="font-bold text-stone-800">Model IMAGE</p>
            <p className="mt-1">
              {imageModel.status === "loading"
                ? "Memuat aset lokal..."
                : imageModel.status === "ready"
                  ? `Siap (${imageModel.delegate})`
                  : imageModel.error}
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_auto]">
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#9f3e2f]/30 bg-[#fffaf0] px-4 py-3 text-sm font-bold text-[#7f2f24] transition hover:bg-[#f8ecd8]">
            <span className="material-symbols-outlined" aria-hidden="true">add_photo_alternate</span>
            Pilih foto
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={isProcessing}
              onChange={(event) => queueFiles(event.target.files)}
              className="sr-only"
            />
          </label>
          <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-[#9f3e2f]/30 bg-[#fffaf0] px-4 py-3 text-sm font-bold text-[#7f2f24] transition hover:bg-[#f8ecd8]">
            <span className="material-symbols-outlined" aria-hidden="true">folder_open</span>
            Pilih folder dataset
            <input
              ref={directoryInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              disabled={isProcessing}
              onChange={(event) => queueFiles(event.target.files)}
              className="sr-only"
            />
          </label>
          <button
            type="button"
            onClick={() => void runEvaluation()}
            disabled={queuedFiles.length === 0 || imageModel.status !== "ready" || isProcessing}
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-2xl bg-[#9f3e2f] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#7f2f24] disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            <span className="material-symbols-outlined" aria-hidden="true">science</span>
            Jalankan {queuedFiles.length ? `${queuedFiles.length} sampel` : "evaluasi"}
          </button>
        </div>

        <div className="mt-4 rounded-2xl border border-sky-200 bg-sky-50 p-4 text-xs leading-relaxed text-sky-900">
          Maksimum {MAX_EVALUATION_BATCH} gambar per batch. Folder hanya dibaca setelah
          dipilih pengguna; tidak ada akses otomatis ke <code>dataset/palm-hand</code>.
          Browser Chromium umumnya mendukung pemilihan folder.
        </div>
        {notice && <p className="mt-3 text-sm text-stone-600">{notice}</p>}
        {isProcessing && (
          <div className="mt-4" aria-live="polite">
            <div className="flex justify-between text-xs font-bold text-stone-600">
              <span>Memproses satu per satu</span>
              <span>{progress.current}/{progress.total}</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-stone-200">
              <div
                className="h-full rounded-full bg-[#c59b3d] transition-all"
                style={{ width: `${progress.total ? (progress.current / progress.total) * 100 : 0}%` }}
              />
            </div>
          </div>
        )}
      </section>

      {results.length > 0 && (
        <>
          <section className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <SummaryCard label="Sampel" value={summary.total} />
            <SummaryCard label="Deteksi + 21 landmark" value={summary.detectionSuccess} />
            <SummaryCard label="ROI baseline" value={summary.baselineRoiSuccess} tone="yellow" />
            <SummaryCard label="ROI kandidat" value={summary.roiSuccess} tone="green" />
            <SummaryCard label="Adaptive rotated" value={summary.nativeRoiSuccess} />
            <SummaryCard label="Fallback (wajib review)" value={summary.fallbackRoiSuccess} tone="yellow" />
            <SummaryCard label="Quality valid" value={summary.qualityValid} tone="green" />
            <SummaryCard label="Quality gagal" value={summary.qualityFailed} tone="red" />
          </section>

          <section className="grid gap-4 rounded-[2rem] border border-[#c59b3d]/25 bg-white p-5 md:grid-cols-3 md:p-7">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500">Review ROI kandidat</p>
              <p className="mt-2 text-sm text-stone-700">
                Benar <strong>{summary.manualRoiCorrect}/{summary.manualRoiReviewed}</strong> · kurang tepat <strong>{summary.manualRoiImprecise}/{summary.manualRoiReviewed}</strong> · gagal <strong>{summary.manualRoiFailed}/{summary.manualRoiReviewed}</strong>
              </p>
              <p className="mt-1 text-xs text-stone-500">Denominator hanya sampel ROI yang sudah dinilai.</p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500">Review garis</p>
              <p className="mt-2 text-sm text-stone-700">
                Jelas <strong>{summary.manualLinesClear}/{summary.manualLinesReviewed}</strong> · kurang jelas <strong>{summary.manualLinesUnclear}/{summary.manualLinesReviewed}</strong>
              </p>
              <p className="mt-1 text-xs text-stone-500">Denominator hanya penilaian garis yang valid.</p>
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-wider text-stone-500">Sharpness terpisah</p>
              <p className="mt-2 text-sm text-stone-700">Baseline ROI <strong>{formatMetric(summary.averageBaselineRoiSharpness ?? undefined)}</strong> · kandidat ROI <strong>{formatMetric(summary.averageRoiSharpness ?? undefined)}</strong> · sumber <strong>{formatMetric(summary.averageSourceSharpness ?? undefined)}</strong></p>
              <p className="mt-1 text-xs text-stone-500">Nilai sumber tidak dicampur ke rerata ROI. Waktu ROI baseline/kandidat: {formatMetric(summary.averageBaselineRoiProcessingMs ?? undefined)} / {formatMetric(summary.averageCandidateRoiProcessingMs ?? undefined)} ms.</p>
            </div>
          </section>

          <section className="rounded-[2rem] border border-cyan-200 bg-white p-5 md:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-3xl">
                <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Eksperimen development-only</p>
                <h2 className="mt-1 font-display text-2xl font-bold text-stone-900">Kandidat lipatan telapak</h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">Detektor mencari bukti ridge gelap pada piksel. Kandidat bukan label Rekha, diagnosis, interpretasi, maupun angka akurasi.</p>
              </div>
              <button type="button" onClick={() => setLineExperimentEnabled((current) => !current)} className={`rounded-2xl px-4 py-3 text-sm font-bold ${lineExperimentEnabled ? "bg-cyan-700 text-white" : "border border-cyan-300 text-cyan-800"}`}>
                {lineExperimentEnabled ? "Mode garis aktif" : "Aktifkan mode garis"}
              </button>
            </div>

            {lineExperimentEnabled && (
              <>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <RangeControl label="Threshold respons" value={lineConfig.responseThreshold} min={4} max={30} step={1} onChange={(value) => setLineConfig((current) => ({ ...current, responseThreshold: value }))} />
                  <RangeControl label="Radius pencahayaan" value={lineConfig.illuminationRadius} min={4} max={36} step={1} onChange={(value) => setLineConfig((current) => ({ ...current, illuminationRadius: value }))} />
                  <RangeControl label="Gain lokal" value={lineConfig.localContrastGain} min={0.8} max={2} step={0.05} onChange={(value) => setLineConfig((current) => ({ ...current, localContrastGain: value }))} />
                  <RangeControl label="Lebar ridge" value={lineConfig.ridgeHalfWidth} min={1} max={4} step={1} onChange={(value) => setLineConfig((current) => ({ ...current, ridgeHalfWidth: value }))} />
                  <RangeControl label="Panjang minimum" value={lineConfig.minimumLengthRatio} min={0.03} max={0.2} step={0.005} onChange={(value) => setLineConfig((current) => ({ ...current, minimumLengthRatio: value }))} />
                  <RangeControl label="Margin batas" value={lineConfig.borderMarginRatio} min={0.02} max={0.15} step={0.005} onChange={(value) => setLineConfig((current) => ({ ...current, borderMarginRatio: value }))} />
                  <RangeControl label="Gap closing" value={lineConfig.gapClosingRadius} min={0} max={2} step={1} onChange={(value) => setLineConfig((current) => ({ ...current, gapClosingRadius: value }))} />
                  <RangeControl label="Resolusi analisis" value={lineConfig.maximumAnalysisDimension} min={256} max={640} step={64} onChange={(value) => setLineConfig((current) => ({ ...current, maximumAnalysisDimension: value }))} />
                  <RangeControl label="Batas energi tekstur" value={lineConfig.maximumTextureEnergy} min={8} max={40} step={1} onChange={(value) => setLineConfig((current) => ({ ...current, maximumTextureEnergy: value }))} />
                </div>
                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold text-stone-700"><input type="checkbox" checked={showLineCandidates} onChange={(event) => setShowLineCandidates(event.target.checked)} /> Tampilkan kandidat otomatis</label>
                  <label className="flex items-center gap-2 rounded-xl border border-stone-200 px-3 py-2 text-xs font-bold text-stone-700"><input type="checkbox" checked={showManualAnnotations} onChange={(event) => setShowManualAnnotations(event.target.checked)} /> Tampilkan anotasi manual</label>
                  {(["baseline", "evidence-bridge", "palm-interior"] as const).map((variant) => <button key={variant} type="button" onClick={() => setLineVariantView(variant)} className={`rounded-xl px-3 py-2 text-xs font-bold ${lineVariantView === variant ? "bg-violet-700 text-white" : "border border-violet-300 text-violet-800"}`}>{variant === "baseline" ? PALM_LINE_EXTRACTION_VERSION : variant === "evidence-bridge" ? PALM_LINE_REFINEMENT_VERSION : PALM_INTERIOR_EXPERIMENT_VERSION}</button>)}
                  <button type="button" onClick={() => void exportSelectedRoiPair()} disabled={isExportingPair || !selectedResult?.images || !selectedAnnotation || selectedAnnotation.status === "unreviewed"} className="rounded-xl border border-violet-400 px-3 py-2 text-xs font-bold text-violet-900 disabled:opacity-40">{isExportingPair ? "Menyiapkan ZIP…" : "Ekspor paket ZIP"}</button>
                  <button type="button" onClick={exportAnnotations} disabled={!Object.values(annotations).some((item) => item.status !== "unreviewed")} className="rounded-xl border border-amber-300 px-3 py-2 text-xs font-bold text-amber-900 disabled:opacity-40">Ekspor anotasi JSON</button>
                  <label className="cursor-pointer rounded-xl border border-sky-300 px-3 py-2 text-xs font-bold text-sky-900">Impor anotasi JSON<input ref={annotationInputRef} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void importAnnotations(event.target.files?.[0] ?? null)} /></label>
                  <button type="button" onClick={() => setLineConfig(DEFAULT_PALM_LINE_CONFIG)} className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold text-stone-700">Reset parameter</button>
                </div>
                <p className="mt-3 text-xs leading-relaxed text-stone-500">Anotasi hanya berada di memori sampai diekspor secara eksplisit. Tombol paket mengunduh satu ZIP yang berisi PNG ROI lossless, anotasi JSON v2, dan manifest pengikat hash untuk sampel terpilih. Ekstrak ke <code>dataset/palm-benchmark/</code> agar tetap tercakup aturan ignore repository. Tidak ada upload jaringan atau ekspor otomatis.</p>
                <div className="mt-4 rounded-2xl border border-cyan-200 bg-cyan-50 p-4">
                  <p className="text-sm font-bold text-cyan-950">Baseline evaluasi dibekukan</p>
                  <p className="mt-1 text-xs leading-relaxed text-cyan-900">ROI {PALM_ROI_ALGORITHM_VERSION} · ekstraktor {PALM_LINE_EXTRACTION_VERSION} · parameter {PALM_LINE_PARAMETER_VERSION}. Slider hanya untuk eksperimen visual; skor ground truth selalu memakai baseline ini.</p>
                  <div className="mt-3 overflow-x-auto">
                    <table className="w-full min-w-[34rem] text-xs text-cyan-950">
                      <thead><tr><th className="py-1 text-left">Toleransi</th><th className="text-right">Coverage</th><th className="text-right">Precision</th><th className="text-right">F1</th><th className="text-right">n</th></tr></thead>
                      <tbody>{groundTruthSummary.byTolerance.map((row) => <tr key={row.tolerancePixels}><td className="py-1">{row.tolerancePixels} px</td><td className="text-right tabular-nums">{formatPercent(row.coverage)}</td><td className="text-right tabular-nums">{formatPercent(row.precision)}</td><td className="text-right tabular-nums">{formatPercent(row.f1)}</td><td className="text-right tabular-nums">{row.denominator}</td></tr>)}</tbody>
                    </table>
                  </div>
                  <p className="mt-2 text-xs text-cyan-900">Kompatibel {groundTruthSummary.compatible}/{groundTruthSummary.total} · diberi skor {groundTruthSummary.scored}/{groundTruthSummary.total} · provisional {groundTruthSummary.provisional} · abstain {groundTruthSummary.abstained}. Setiap rerata menampilkan denominatornya sendiri.</p>
                </div>
                <div className="mt-4 overflow-x-auto rounded-2xl border border-violet-200 bg-violet-50 p-4">
                  <p className="text-sm font-bold text-violet-950">Baseline versus {PALM_LINE_REFINEMENT_VERSION}</p>
                  <table className="mt-3 w-full min-w-[52rem] text-xs text-violet-950">
                    <thead><tr><th rowSpan={2} className="py-1 text-left">Toleransi</th><th colSpan={3} className="text-center">Baseline</th><th colSpan={3} className="text-center">Eksperimen</th><th rowSpan={2} className="text-right">n</th></tr><tr><th className="text-right">Cov.</th><th className="text-right">Prec.</th><th className="text-right">F1</th><th className="text-right">Cov.</th><th className="text-right">Prec.</th><th className="text-right">F1</th></tr></thead>
                    <tbody>{groundTruthSummary.byTolerance.map((row) => {
                      const experiment = experimentGroundTruthSummary.byTolerance.find((item) => item.tolerancePixels === row.tolerancePixels);
                      return <tr key={row.tolerancePixels}><td className="py-1">{row.tolerancePixels} px</td><td className="text-right tabular-nums">{formatPercent(row.coverage)}</td><td className="text-right tabular-nums">{formatPercent(row.precision)}</td><td className="text-right tabular-nums">{formatPercent(row.f1)}</td><td className="text-right tabular-nums">{formatPercent(experiment?.coverage)}</td><td className="text-right tabular-nums">{formatPercent(experiment?.precision)}</td><td className="text-right tabular-nums">{formatPercent(experiment?.f1)}</td><td className="text-right tabular-nums">{row.denominator}</td></tr>;
                    })}</tbody>
                  </table>
                  <p className="mt-3 text-xs text-violet-900">Semua ROI terfilter (n={lineVariantSummary.denominator}): segmen baseline/eksperimen <strong>{lineVariantSummary.baselineSegments}/{lineVariantSummary.experimentSegments}</strong> · panjang <strong>{lineVariantSummary.baselineLength.toFixed(0)}/{lineVariantSummary.experimentLength.toFixed(0)} px</strong> · bridge berbukti <strong>{lineVariantSummary.acceptedBridges}</strong> · waktu rata-rata <strong>{formatMetric(lineVariantSummary.baselineTime ?? undefined)}/{formatMetric(lineVariantSummary.experimentTime ?? undefined)} ms</strong>.</p>
                  <p className="mt-2 text-xs text-violet-900">Palm interior: <strong>{lineVariantSummary.interiorSegments}</strong> segmen · <strong>{lineVariantSummary.interiorLength.toFixed(0)} px</strong> · waktu <strong>{formatMetric(lineVariantSummary.interiorTime ?? undefined)} ms</strong> · kandidat dekat/di luar palm-core baseline → interior <strong>{lineVariantSummary.baselineOutsideCandidates} → {lineVariantSummary.interiorOutsideCandidates}</strong>.</p>
                  <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[62rem] text-xs"><thead><tr><th rowSpan={2} className="text-left">Tol.</th><th colSpan={3} className="text-center">Baseline C/P/F1</th><th colSpan={3} className="text-center">Bridge C/P/F1</th><th colSpan={3} className="text-center">Palm interior C/P/F1</th><th rowSpan={2} className="text-right">n interior</th></tr><tr>{["C", "P", "F1", "C", "P", "F1", "C", "P", "F1"].map((label, index) => <th key={`${label}-${index}`} className="text-right">{label}</th>)}</tr></thead><tbody>{groundTruthSummary.byTolerance.map((row) => { const bridge = experimentGroundTruthSummary.byTolerance.find((item) => item.tolerancePixels === row.tolerancePixels); const interior = interiorGroundTruthSummary.byTolerance.find((item) => item.tolerancePixels === row.tolerancePixels); return <tr key={`interior-${row.tolerancePixels}`}><td>{row.tolerancePixels} px</td><td className="text-right">{formatPercent(row.coverage)}</td><td className="text-right">{formatPercent(row.precision)}</td><td className="text-right">{formatPercent(row.f1)}</td><td className="text-right">{formatPercent(bridge?.coverage)}</td><td className="text-right">{formatPercent(bridge?.precision)}</td><td className="text-right">{formatPercent(bridge?.f1)}</td><td className="text-right">{formatPercent(interior?.coverage)}</td><td className="text-right">{formatPercent(interior?.precision)}</td><td className="text-right">{formatPercent(interior?.f1)}</td><td className="text-right">{interior?.denominator ?? 0}</td></tr>; })}</tbody></table></div>
                  <p className="mt-2 text-xs text-violet-800">Kandidat di luar anotasi parsial dilaporkan sebagai “outside annotation”, bukan false positive definitif.</p>
                </div>
                {legacyAnnotations.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-950">
                    <p className="font-bold">Pemetaan manual anotasi v1 diperlukan</p>
                    <p className="mt-1 text-xs">Pilih anotasi lama, periksa ROI sampel aktif secara visual, lalu konfirmasi. ID urutan lama tidak digunakan untuk mencocokkan otomatis.</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <select value={selectedLegacyIndex} onChange={(event) => setSelectedLegacyIndex(Number(event.target.value))} className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs">
                        {legacyAnnotations.map((item, index) => <option key={`${item.sampleId}-${index}`} value={index}>{item.sampleId} · {item.roiWidth}×{item.roiHeight} · {item.polylines.length} polyline</option>)}
                      </select>
                      <button type="button" onClick={confirmLegacyMapping} disabled={!selectedResult?.images} className="rounded-xl bg-amber-700 px-3 py-2 text-xs font-bold text-white disabled:opacity-40">Petakan ke sampel terpilih</button>
                    </div>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="rounded-[2rem] border border-[#c59b3d]/25 bg-white p-5 md:p-7">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <h2 className="font-display text-2xl font-bold text-stone-900">Hasil batch</h2>
                <p className="mt-1 text-sm text-stone-500">
                  Filter lokal membantu membandingkan tangan, kamera, dan kelompok subjek anonim.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <FilterSelect label="Tangan" value={handFilter} onChange={(value) => setHandFilter(value as typeof handFilter)} options={["all", "left", "right", "unknown"]} />
                <FilterSelect label="Kamera" value={cameraFilter} onChange={(value) => setCameraFilter(value as typeof cameraFilter)} options={["all", "front", "back", "unknown"]} />
                <FilterSelect label="Subjek" value={subjectFilter} onChange={setSubjectFilter} options={["all", ...subjects]} />
                <button type="button" onClick={exportCsv} disabled={filteredResults.length === 0} className="rounded-xl border border-emerald-300 px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 disabled:opacity-40">
                  Ekspor CSV
                </button>
                <button type="button" onClick={resetEvaluation} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-700 hover:bg-red-50">
                  Bersihkan
                </button>
              </div>
            </div>

            <div className="mt-5 overflow-x-auto rounded-2xl border border-stone-200">
              <table className="min-w-[1320px] w-full text-left text-xs">
                <thead className="bg-stone-100 text-stone-600">
                  <tr>
                    {[
                      "ID", "Deteksi", "ROI baseline → kandidat", "Resolusi", "Brightness", "Contrast",
                      "Sharpness", "Durasi", "Kualitas", "Catatan", "ROI manual", "Garis manual", "Kandidat garis", "Ground truth", "Review kandidat", "",
                    ].map((heading) => <th key={heading} className="px-3 py-3 font-bold">{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredResults.map((result) => (
                    <tr key={result.sampleId} className="align-top hover:bg-[#fffaf0]">
                      <td className="px-3 py-3 font-bold text-stone-800">{result.sampleId}</td>
                      <td className="px-3 py-3">{result.detectionStatus}<br /><span className="text-stone-400">{result.landmarkCount} landmark</span></td>
                      <td className="px-3 py-3">{result.baseline.roiStatus} → {result.roiStatus}<br /><span className="text-stone-400">{result.roiMethod ?? result.roiFailureCategory ?? "-"}</span></td>
                      <td className="px-3 py-3 tabular-nums">{result.sourceWidth}x{result.sourceHeight}<br /><span className="text-stone-400">ROI {result.roiWidth && result.roiHeight ? `${result.roiWidth}x${result.roiHeight}` : "-"}</span></td>
                      <td className="px-3 py-3 tabular-nums">{formatMetric(result.imageMetrics?.brightness)}</td>
                      <td className="px-3 py-3 tabular-nums">{formatMetric(result.imageMetrics?.contrast)}</td>
                      <td className="px-3 py-3 tabular-nums">{formatMetric(result.imageMetrics?.sharpness)}</td>
                      <td className="px-3 py-3 tabular-nums">{result.processingMs.toFixed(1)} ms</td>
                      <td className="px-3 py-3"><span className={`rounded-full px-2 py-1 font-bold ${qualityTone(result.quality.status)}`}>{result.quality.status}</span></td>
                      <td className="max-w-64 px-3 py-3 leading-relaxed text-stone-500">
                        {result.roiFailureCategory && <span className="font-bold text-red-700">{result.roiFailureCategory}: </span>}
                        {[result.roiFailureReason, ...result.quality.reasons].filter(Boolean).join(" ") || "-"}
                      </td>
                      <td className="px-3 py-3">
                        <select value={result.manualRoi} onChange={(event) => updateManualAssessment(result.sampleId, "manualRoi", event.target.value as ManualRoiAssessment)} className="rounded-lg border border-stone-200 bg-white px-2 py-1.5">
                          <option value="unreviewed">Belum dinilai</option>
                          <option value="correct">ROI benar</option>
                          <option value="imprecise">ROI kurang tepat</option>
                          <option value="failed">ROI gagal</option>
                        </select>
                      </td>
                      <td className="px-3 py-3">
                        <select value={result.manualLines} onChange={(event) => updateManualAssessment(result.sampleId, "manualLines", event.target.value as ManualLineAssessment)} className="rounded-lg border border-stone-200 bg-white px-2 py-1.5">
                          <option value="unreviewed">Belum dinilai</option>
                          <option value="clear">Garis tampak jelas</option>
                          <option value="unclear">Garis kurang jelas</option>
                        </select>
                      </td>
                      <td className="px-3 py-3 tabular-nums">
                        {result.lineExperiment
                          ? <>{result.lineExperiment.status}<br /><span className="text-stone-400">{result.lineExperiment.candidateCount} segmen · {result.lineExperiment.totalLengthPixels.toFixed(0)} px</span></>
                          : "-"}
                      </td>
                      <td className="px-3 py-3">
                        {groundTruthReports[result.sampleFingerprint]
                          ? <><span className="font-bold">{groundTruthReports[result.sampleFingerprint].compatibility}</span><br /><span className="text-stone-400">{groundTruthReports[result.sampleFingerprint].scoringStatus} · {groundTruthReports[result.sampleFingerprint].reviewStatus}</span><br /><span className="line-clamp-2 max-w-52 text-[10px] text-stone-400">{groundTruthReports[result.sampleFingerprint].reason}</span></>
                          : <span className="text-stone-400">belum ada anotasi</span>}
                      </td>
                      <td className="px-3 py-3">
                        <select value={result.lineCandidateAssessment} onChange={(event) => updateManualAssessment(result.sampleId, "lineCandidateAssessment", event.target.value as LineCandidateAssessment)} className="rounded-lg border border-stone-200 bg-white px-2 py-1.5">
                          <option value="unreviewed">Belum dinilai</option>
                          <option value="follows">Mengikuti lipatan</option>
                          <option value="partial">Sebagian mengikuti</option>
                          <option value="misses">Tidak mengikuti</option>
                          <option value="abstain-correct">Abstain tepat</option>
                        </select>
                      </td>
                      <td className="px-3 py-3"><button type="button" onClick={() => setSelectedSampleId(result.sampleId)} className="font-bold text-[#9f3e2f] hover:underline">Lihat</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {selectedResult && (
            <section className="rounded-[2rem] border border-[#c59b3d]/25 bg-white p-5 md:p-7">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-[#9f3e2f]">Detail sampel</p>
                  <h2 className="mt-1 font-display text-2xl font-bold text-stone-900">{selectedResult.sampleId}</h2>
                  <p className="mt-1 break-all text-sm text-stone-500">{selectedResult.sampleName}</p>
                </div>
                <div className="text-xs leading-relaxed text-stone-500 md:text-right">
                  <p>{selectedResult.metadata.subjectGroup} · {selectedResult.metadata.handGroup} · {selectedResult.metadata.cameraGroup}</p>
                  <p>MediaPipe: {selectedResult.detectedHandedness ?? "tidak tersedia"}</p>
                  <p>Metrik dihitung dari: {selectedResult.metricSource === "roi" ? "Palm ROI" : "gambar sumber"}</p>
                  <p>Fingerprint: {selectedResult.sampleFingerprint.slice(0, 16)}…</p>
                  <p>ROI: {selectedResult.roiSignature ?? "tidak tersedia"}</p>
                </div>
              </div>

              {selectedResult.diagnosticImage && (
                <div className="mt-6 grid items-start gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(16rem,1fr)]">
                  <PalmImagePreviewCard
                    image={selectedResult.diagnosticImage}
                    label="Diagnostik geometri"
                    description="Landmark biru/kuning; baseline merah putus-putus; kandidat hijau atau fallback jingga. Tanda silang merah menunjukkan sudut baseline di luar frame."
                    processed
                  />
                  <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4 text-sm leading-relaxed text-stone-700">
                    <p className="font-bold text-stone-900">Baseline vs kandidat</p>
                    <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
                      <dt className="text-stone-500">Baseline</dt>
                      <dd className="font-semibold">{selectedResult.baseline.roiStatus} · {selectedResult.baseline.failureCategory ?? "tanpa kegagalan"}</dd>
                      <dt className="text-stone-500">Kandidat</dt>
                      <dd className="font-semibold">{selectedResult.roiStatus} · {selectedResult.roiMethod ?? selectedResult.roiFailureCategory ?? "-"}</dd>
                      <dt className="text-stone-500">Sudut crop</dt>
                      <dd className="font-semibold tabular-nums">{selectedResult.diagnostics?.rotationDegrees.toFixed(1) ?? "-"}°</dd>
                      <dt className="text-stone-500">Skala padding</dt>
                      <dd className="font-semibold tabular-nums">{selectedResult.diagnostics ? `${Math.round(selectedResult.diagnostics.paddingScale * 100)}%` : "-"}</dd>
                      <dt className="text-stone-500">Sudut baseline keluar</dt>
                      <dd className="font-semibold tabular-nums">{selectedResult.baseline.diagnostics?.outsideCornerIndices.length ?? 0}</dd>
                    </dl>
                    {selectedResult.roiMethod === "fallback-axis-aligned" && (
                      <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-xs text-amber-950">Fallback hanya berarti crop berhasil dibuat tanpa piksel palsu. Ketepatan ROI tetap harus dikonfirmasi manual.</p>
                    )}
                  </div>
                </div>
              )}

              {selectedResult.images ? (
                <div className="mt-6 grid items-start gap-4 sm:grid-cols-3">
                  <PalmImagePreviewCard image={selectedResult.images.original} label="Palm ROI" description="Crop asli dari frame sumber tanpa downscale tambahan." />
                  <PalmImagePreviewCard image={selectedResult.images.grayscale} label="Grayscale" description="Konversi luminance deterministik." processed />
                  <PalmImagePreviewCard image={selectedResult.images.enhanced} label="Enhanced Contrast" description="Kontras ringan dengan gain terbatas, tanpa sharpening." processed />
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950">
                  <p className="font-bold">Palm ROI tidak tersedia</p>
                  <p className="mt-1">{selectedResult.roiFailureReason}</p>
                  <p className="mt-2 text-xs">Foto yang sudah berupa crop telapak dapat gagal dideteksi MediaPipe. Sistem tidak membuat landmark atau ROI palsu; gunakan penilaian manual pada tabel.</p>
                </div>
              )}

              {lineExperimentEnabled && selectedResult.images && lineOutput && (
                <div className="mt-8 border-t border-cyan-100 pt-7">
                  <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-cyan-700">Eksperimen garis · {selectedResult.sampleId}</p>
                      <h3 className="mt-1 font-display text-2xl font-bold text-stone-900">Bukti piksel dan kandidat segmen</h3>
                      <p className="mt-2 text-sm text-stone-600">Status <strong>{lineOutput.status}</strong>{lineOutput.abstainReason ? ` — ${lineOutput.abstainReason}` : ""}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-x-5 gap-y-1 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-xs text-cyan-950">
                      <span>Kandidat</span><strong className="text-right tabular-nums">{lineOutput.candidates.length}</strong>
                      <span>Total panjang</span><strong className="text-right tabular-nums">{lineOutput.candidates.reduce((total, candidate) => total + candidate.lengthPixels, 0).toFixed(0)} px</strong>
                      <span>Kontinuitas</span><strong className="text-right tabular-nums">{lineOutput.candidates.length ? (lineOutput.candidates.reduce((total, candidate) => total + candidate.continuity, 0) / lineOutput.candidates.length).toFixed(2) : "-"}</strong>
                      <span>Waktu</span><strong className="text-right tabular-nums">{lineOutput.processingMs.toFixed(1)} ms</strong>
                      <span>Analisis</span><strong className="text-right tabular-nums">{lineOutput.analysisWidth}×{lineOutput.analysisHeight}</strong>
                      <span>Kontras sumber</span><strong className="text-right tabular-nums">{lineOutput.sourceContrast.toFixed(1)}</strong>
                      <span>Energi tekstur</span><strong className="text-right tabular-nums">{lineOutput.textureEnergy.toFixed(1)}</strong>
                      <span>Rasio piksel</span><strong className="text-right tabular-nums">{(lineOutput.candidatePixelRatio * 100).toFixed(2)}%</strong>
                    </div>
                  </div>

                  <div className="mt-6 grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    <PalmImagePreviewCard image={selectedResult.images.original} label="1. Original ROI" description="Referensi asli; tidak diganti oleh hasil enhancement." />
                    <PalmImagePreviewCard image={selectedResult.images.grayscale} label="2. Grayscale" description="Luminance citra sebelum normalisasi lokal." processed />
                    <PalmImagePreviewCard image={lineOutput.normalized} label="3. Normalisasi pencahayaan" description="Koreksi pencahayaan lokal konservatif tanpa sharpening." processed />
                    {showLineCandidates && <PalmImagePreviewCard image={lineOutput.candidateMap} label="4. Peta kandidat garis" description="Hanya segmen terhubung yang melewati threshold dan panjang minimum." processed />}
                    <PalmImagePreviewCard image={showLineCandidates ? lineOutput.overlay : selectedResult.images.original} label="5. Overlay kandidat" description={showLineCandidates ? "Cyan menunjukkan kandidat otomatis di atas ROI asli." : "Kandidat disembunyikan; ROI asli tetap terlihat."} processed={showLineCandidates} />
                  </div>

                  {selectedLineComparison && (
                    <div className="mt-6 rounded-3xl border border-violet-200 bg-violet-50 p-4 md:p-5">
                      <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="font-bold text-violet-950">Diagnostik tiga varian ekstraktor</p>
                          <p className="mt-1 text-xs leading-relaxed text-violet-800">Baseline dan evidence-bridge tetap utuh. Palm-interior hanya menekan respons di luar polygon palm-core dari wrist dan MCP; ia tidak membuat respons atau garis baru.</p>
                        </div>
                        <p className="text-xs text-violet-800">Toleransi diagnostik tetap 6 px</p>
                      </div>
                      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                        <MetricTile label="Segmen baseline" value={selectedLineComparison.baseline.candidates.length.toString()} />
                        <MetricTile label="Segmen eksperimen" value={selectedLineComparison.experiment.candidates.length.toString()} />
                        <MetricTile label="Bridge diterima" value={selectedLineComparison.experiment.acceptedBridgeCount.toString()} />
                        <MetricTile label="Segmen palm interior" value={selectedLineComparison.interior?.candidates.length.toString() ?? "-"} />
                        <MetricTile label="Waktu baseline / eksperimen" value={`${selectedLineComparison.baseline.processingMs.toFixed(1)} / ${selectedLineComparison.experiment.processingMs.toFixed(1)} ms`} />
                      </div>
                      {selectedVariantOutput && <div className="mt-4 grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        <PalmImagePreviewCard image={selectedVariantOutput.ridgeResponseMap} label={`${lineVariantView}: ridge response`} description="Respons sebelum threshold; area terang memiliki respons ridge lebih kuat." processed />
                        <PalmImagePreviewCard image={selectedVariantOutput.thresholdMap} label="Setelah threshold" description="Threshold tetap 7; palm-interior mengubah respons melalui bobot mask, bukan threshold." processed />
                        <PalmImagePreviewCard image={selectedVariantOutput.morphologyMap} label="Setelah morphology" description="Neighbor filter dan closing sebelum thinning." processed />
                        <PalmImagePreviewCard image={selectedVariantOutput.skeletonMap} label="Setelah skeletonization" description="Skeleton untuk connected components dan farthest-path ranking." processed />
                        {selectedVariantOutput.interiorMaskMap && <PalmImagePreviewCard image={selectedVariantOutput.interiorMaskMap} label="Palm interior mask" description="Putih = palm-core; abu/gelap = respons tepi ditekan lembut." processed />}
                        <PalmImagePreviewCard image={selectedVariantOutput.overlay} label={`${lineVariantView}: kandidat final`} description={`Mask ${selectedVariantOutput.maskStatus}${selectedVariantOutput.maskReason ? ` — ${selectedVariantOutput.maskReason}` : ""}.`} processed />
                      </div>}
                      <div className="mt-4 grid items-start gap-4 lg:grid-cols-2">
                        <PalmImagePreviewCard image={selectedLineComparison.baseline.overlay} label="Baseline candidate overlay" description={`Analisis ${selectedLineComparison.baseline.analysisWidth}×${selectedLineComparison.baseline.analysisHeight} dipetakan kembali ke ROI ${selectedResult.images.original.width}×${selectedResult.images.original.height}.`} processed />
                        <PalmImagePreviewCard image={selectedLineComparison.experiment.overlay} label="Evidence-bridge overlay" description="Bridge hanya diterima bila arah konsisten dan setiap sampel lintasan memiliki bukti respons ridge pada citra." processed />
                        {selectedLineComparison.interior && <PalmImagePreviewCard image={selectedLineComparison.interior.overlay} label="Palm-interior overlay" description={`Mask ${selectedLineComparison.interior.maskStatus}. Kandidat tepi ditekan tanpa memangkas ROI.`} processed />}
                        {selectedLineComparison.baselineDiagnostics && <PalmImagePreviewCard image={selectedLineComparison.baselineDiagnostics.overlay} label="Error map baseline" description="Hijau: kandidat dekat anotasi; magenta: kandidat di luar anotasi; kuning: anotasi tercakup; merah: anotasi belum tercakup." processed />}
                        {selectedLineComparison.experimentDiagnostics && <PalmImagePreviewCard image={selectedLineComparison.experimentDiagnostics.overlay} label="Error map eksperimen" description="Magenta tidak otomatis berarti false positive karena ground truth saat ini masih parsial." processed />}
                        {selectedLineComparison.interiorDiagnostics && <PalmImagePreviewCard image={selectedLineComparison.interiorDiagnostics.overlay} label="Error map palm interior" description="Bandingkan bagian merah yang hilang dan magenta yang ditekan terhadap baseline." processed />}
                      </div>
                      {selectedLineComparison.baselineDiagnostics && selectedLineComparison.experimentDiagnostics ? (
                        <div className="mt-4 grid gap-4 lg:grid-cols-2">
                          <DistanceDiagnosticPanel title="Distribusi baseline" diagnostics={selectedLineComparison.baselineDiagnostics} />
                          <DistanceDiagnosticPanel title="Distribusi eksperimen" diagnostics={selectedLineComparison.experimentDiagnostics} />
                          {selectedLineComparison.interiorDiagnostics && <DistanceDiagnosticPanel title="Distribusi palm interior" diagnostics={selectedLineComparison.interiorDiagnostics} />}
                        </div>
                      ) : <p className="mt-4 rounded-xl bg-white p-3 text-xs text-violet-800">Impor atau gambar anotasi manual untuk mengaktifkan error map dan distribusi jarak.</p>}
                      <div className="mt-4 overflow-x-auto rounded-xl bg-white p-3">
                        <table className="w-full min-w-[40rem] text-xs text-stone-700">
                          <thead><tr><th className="text-left">Tol.</th><th className="text-right">Baseline C/P/F1</th><th className="text-right">Eksperimen C/P/F1</th><th className="text-right">Δ F1</th></tr></thead>
                          <tbody>{[3, 6, 9].map((tolerance) => {
                            const baselineScore = selectedGroundTruthReport?.scores.find((score) => score.tolerancePixels === tolerance);
                            const experimentScore = selectedExperimentGroundTruthReport?.scores.find((score) => score.tolerancePixels === tolerance);
                            const delta = baselineScore && experimentScore ? experimentScore.f1 - baselineScore.f1 : null;
                            return <tr key={tolerance}><td className="py-1">{tolerance} px</td><td className="text-right tabular-nums">{baselineScore ? `${formatPercent(baselineScore.coverage)} / ${formatPercent(baselineScore.precision)} / ${formatPercent(baselineScore.f1)}` : "-"}</td><td className="text-right tabular-nums">{experimentScore ? `${formatPercent(experimentScore.coverage)} / ${formatPercent(experimentScore.precision)} / ${formatPercent(experimentScore.f1)}` : "-"}</td><td className="text-right font-bold tabular-nums">{delta === null ? "-" : `${delta >= 0 ? "+" : ""}${(delta * 100).toFixed(2)} pp`}</td></tr>;
                          })}</tbody>
                        </table>
                      </div>
                      <div className="mt-4 overflow-x-auto rounded-xl bg-white p-3">
                        <p className="mb-2 text-xs font-bold text-violet-950">Baseline vs palm-interior-v1</p>
                        <table className="w-full min-w-[40rem] text-xs text-stone-700">
                          <thead><tr><th className="text-left">Tol.</th><th className="text-right">Baseline C/P/F1</th><th className="text-right">Palm interior C/P/F1</th><th className="text-right">Δ F1</th></tr></thead>
                          <tbody>{[3, 6, 9].map((tolerance) => {
                            const baselineScore = selectedGroundTruthReport?.scores.find((score) => score.tolerancePixels === tolerance);
                            const interiorScore = selectedInteriorGroundTruthReport?.scores.find((score) => score.tolerancePixels === tolerance);
                            const delta = baselineScore && interiorScore ? interiorScore.f1 - baselineScore.f1 : null;
                            return <tr key={tolerance}><td className="py-1">{tolerance} px</td><td className="text-right tabular-nums">{baselineScore ? `${formatPercent(baselineScore.coverage)} / ${formatPercent(baselineScore.precision)} / ${formatPercent(baselineScore.f1)}` : "-"}</td><td className="text-right tabular-nums">{interiorScore ? `${formatPercent(interiorScore.coverage)} / ${formatPercent(interiorScore.precision)} / ${formatPercent(interiorScore.f1)}` : "-"}</td><td className="text-right font-bold tabular-nums">{delta === null ? "-" : `${delta >= 0 ? "+" : ""}${(delta * 100).toFixed(2)} pp`}</td></tr>;
                          })}</tbody>
                        </table>
                      </div>
                      <p className="mt-3 text-xs leading-relaxed text-violet-800">Interpretasi diagnosis: banyak segmen pendek dan bridge diterima menunjukkan fragmentasi; kenaikan tajam dari toleransi 3 ke 6/9 px menunjukkan offset pusat ridge; pola magenta di batas telapak atau sela jari harus diperiksa visual. Error pemetaan skala dapat diaudit dari resolusi analisis dan ROI yang ditampilkan di atas.</p>
                    </div>
                  )}

                  <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,2fr)_minmax(18rem,1fr)]">
                    <PalmLineAnnotationEditor
                      image={selectedResult.images.original}
                      candidates={lineOutput.candidates}
                      annotations={selectedPolylines}
                      showCandidates={showLineCandidates}
                      showAnnotations={showManualAnnotations}
                      onChange={updateSelectedAnnotations}
                    />
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-stone-200 bg-stone-50 p-4">
                        <p className="font-bold text-stone-900">Status anotasi</p>
                        <div className="mt-3 flex flex-wrap gap-2">
                          <button type="button" onClick={() => updateSelectedAnnotations(selectedPolylines, selectedPolylines.length ? "annotated" : "unreviewed", "complete")} className="rounded-xl border border-emerald-300 px-3 py-2 text-xs font-bold text-emerald-800">Anotasi lengkap</button>
                          <button type="button" onClick={() => updateSelectedAnnotations(selectedPolylines, selectedPolylines.length ? "annotated" : "unreviewed", "partial")} className="rounded-xl border border-amber-300 px-3 py-2 text-xs font-bold text-amber-900">Anotasi parsial</button>
                          <button type="button" onClick={() => updateSelectedAnnotations([], "undetermined")} className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold text-stone-700">Belum dapat ditentukan</button>
                        </div>
                        <p className="mt-3 text-xs text-stone-500">Status: <strong>{selectedAnnotation?.status ?? "unreviewed"}</strong> · kelengkapan <strong>{selectedAnnotation?.completeness ?? "unknown"}</strong> · kompatibilitas <strong>{selectedAnnotation?.compatibility ?? "unmatched"}</strong>. Sistem tidak memberi nama budaya pada polyline.</p>
                      </div>
                      <div className="rounded-3xl border border-stone-200 bg-white p-4">
                        <p className="font-bold text-stone-900">Kesesuaian geometris</p>
                        {selectedGroundTruthReport?.scoringStatus === "scored" ? (
                          <div className="mt-3 space-y-3 text-xs">
                            {selectedGroundTruthReport.scores.map((score) => <dl key={score.tolerancePixels} className="grid grid-cols-[1fr_auto] gap-1 border-b border-stone-100 pb-2"><dt className="font-bold">Toleransi {score.tolerancePixels} px</dt><dd /><dt>Coverage</dt><dd className="font-bold">{formatPercent(score.coverage)}</dd><dt>Precision</dt><dd className="font-bold">{formatPercent(score.precision)}</dd><dt>F1</dt><dd className="font-bold">{formatPercent(score.f1)}</dd></dl>)}
                            <p className={selectedGroundTruthReport.reviewStatus === "provisional" ? "text-amber-700" : "text-stone-500"}>{selectedGroundTruthReport.reason}</p>
                          </div>
                        ) : <p className="mt-2 text-xs text-stone-500">{selectedGroundTruthReport?.reason ?? "Gambar polyline manual untuk menghitung kesesuaian. Skor ini bukan akurasi sistem."}</p>}
                      </div>
                      <div className="rounded-3xl border border-cyan-200 bg-cyan-50 p-4 text-xs leading-relaxed text-cyan-950">
                        Respons parameter saat ini: threshold {lineConfig.responseThreshold}, radius pencahayaan {lineConfig.illuminationRadius}, gain {lineConfig.localContrastGain.toFixed(2)}, lebar ridge {lineConfig.ridgeHalfWidth}, panjang minimum {(lineConfig.minimumLengthRatio * 100).toFixed(1)}%.
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}

function MetricTile({ label, value }: { label: string; value: string }) {
  return <div className="rounded-xl border border-violet-200 bg-white p-3"><p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">{label}</p><p className="mt-1 font-bold tabular-nums text-violet-950">{value}</p></div>;
}

function DistanceDiagnosticPanel({ title, diagnostics }: { title: string; diagnostics: PalmLineErrorDiagnostics }) {
  const distributions = [
    { label: "Kandidat → anotasi", value: diagnostics.candidateToManual },
    { label: "Anotasi → kandidat", value: diagnostics.manualToCandidate },
  ];
  return (
    <div className="rounded-2xl border border-violet-200 bg-white p-4 text-xs text-stone-700">
      <p className="font-bold text-stone-900">{title}</p>
      <p className="mt-1 text-stone-500">Dekat/jauh kandidat: {diagnostics.candidateNearLength.toFixed(0)}/{diagnostics.candidateOutsideAnnotationLength.toFixed(0)} px · anotasi tercakup/belum: {diagnostics.manualCoveredLength.toFixed(0)}/{diagnostics.manualUncoveredLength.toFixed(0)} px.</p>
      {distributions.map((distribution) => <div key={distribution.label} className="mt-3 border-t border-stone-100 pt-2">
        <p className="font-semibold">{distribution.label}</p>
        <p className="mt-1 text-stone-500">mean {formatMetric(distribution.value.meanPixels ?? undefined)} · median {formatMetric(distribution.value.medianPixels ?? undefined)} · p90 {formatMetric(distribution.value.percentile90Pixels ?? undefined)} px</p>
        <div className="mt-2 grid grid-cols-5 gap-1">{distribution.value.bins.map((bin) => <div key={bin.label} title={`${bin.lengthPixels.toFixed(1)} px`} className="rounded bg-stone-100 p-1 text-center"><span className="block text-[9px] text-stone-500">{bin.label}</span><strong className="tabular-nums">{formatPercent(bin.ratio)}</strong></div>)}</div>
      </div>)}
    </div>
  );
}

function SummaryCard({ label, value, tone = "stone" }: { label: string; value: number; tone?: "stone" | "green" | "yellow" | "red" }) {
  const tones = {
    stone: "border-stone-200 bg-white text-stone-800",
    green: "border-emerald-200 bg-emerald-50 text-emerald-800",
    yellow: "border-amber-200 bg-amber-50 text-amber-900",
    red: "border-red-200 bg-red-50 text-red-800",
  };
  return <div className={`rounded-2xl border p-4 ${tones[tone]}`}><p className="text-[10px] font-bold uppercase tracking-wider opacity-60">{label}</p><p className="mt-1 text-2xl font-extrabold tabular-nums">{value}</p></div>;
}

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return (
    <label className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
      <span className="sr-only">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-semibold normal-case tracking-normal text-stone-700">
        {options.map((option) => <option key={option} value={option}>{option === "all" ? `Semua ${label.toLowerCase()}` : option}</option>)}
      </select>
    </label>
  );
}

function RangeControl({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="rounded-2xl border border-stone-200 bg-stone-50 p-3">
      <span className="flex items-center justify-between gap-2 text-xs font-bold text-stone-700">
        <span>{label}</span>
        <span className="tabular-nums text-cyan-800">{value}</span>
      </span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} className="mt-3 w-full accent-cyan-700" />
    </label>
  );
}
