import {
  PALM_INTERIOR_EXPERIMENT_VERSION,
  PALM_LINE_EXTRACTION_VERSION,
  extractPalmInteriorLineCandidates,
  extractPalmLineCandidates,
  measurePalmInteriorCandidates,
  wipePalmLineExtraction,
  type PalmLineExtractionResult,
} from "@/lib/netra-hasta/palm-line-extraction";
import type {
  PalmLineLiveVariant,
  PalmLineWorkerRequest,
  PalmLineWorkerResponse,
} from "@/lib/netra-hasta/palm-line-live";
import {
  createContentFingerprint,
  createRoiSignature,
} from "@/lib/netra-hasta/palm-ground-truth";
import { PALM_ROI_ALGORITHM_VERSION } from "@/lib/netra-hasta/palm-roi";

type PalmLineWorkerScope = {
  onmessage: ((event: MessageEvent<PalmLineWorkerRequest>) => void) | null;
  postMessage: (message: PalmLineWorkerResponse, transfer: Transferable[]) => void;
};

const workerScope = self as unknown as PalmLineWorkerScope;

function detachVariant(
  extraction: PalmLineExtractionResult,
  version: string,
  geometry: PalmLineWorkerRequest["palmInteriorGeometry"],
): PalmLineLiveVariant {
  const outside = measurePalmInteriorCandidates(extraction.candidates, geometry);
  const variant: PalmLineLiveVariant = {
    variant: extraction.variant === "palm-interior" ? "palm-interior" : "baseline",
    version,
    status: extraction.status,
    maskStatus: extraction.maskStatus,
    candidateCount: extraction.candidates.length,
    candidates: extraction.candidates,
    totalLengthPixels: extraction.candidates.reduce(
      (total, candidate) => total + candidate.lengthPixels,
      0,
    ),
    outsideCandidateCount: outside?.outsideCandidateCount ?? null,
    outsideLengthPixels: outside?.outsideLengthPixels ?? null,
    overlay: extraction.overlay,
    ridgeResponseMap: extraction.ridgeResponseMap,
    interiorMaskMap: extraction.interiorMaskMap,
    processingMs: extraction.processingMs,
    reason: extraction.abstainReason,
  };
  extraction.candidates = [];
  extraction.overlay = { width: 0, height: 0, data: new Uint8ClampedArray() };
  extraction.ridgeResponseMap = { width: 0, height: 0, data: new Uint8ClampedArray() };
  extraction.interiorMaskMap = null;
  return variant;
}

workerScope.onmessage = async ({ data: request }) => {
  let baselineExtraction: PalmLineExtractionResult | null = null;
  let interiorExtraction: PalmLineExtractionResult | null = null;
  try {
    const source = {
      width: request.width,
      height: request.height,
      data: request.data,
    };
    const sampleFingerprint = await createContentFingerprint(
      request.data.buffer as ArrayBuffer,
    );
    const roiSignature = createRoiSignature({
      sampleFingerprint,
      roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
      roiMethod: "live-baseline",
      roiWidth: request.width,
      roiHeight: request.height,
      rotationDegrees: request.rotationDegrees,
      paddingScale: null,
    });
    if (!roiSignature) throw new Error("Signature ROI live tidak dapat dibuat.");

    baselineExtraction = extractPalmLineCandidates(source);
    interiorExtraction = extractPalmInteriorLineCandidates(
      source,
      request.palmInteriorGeometry,
    );
    const baseline = detachVariant(
      baselineExtraction,
      PALM_LINE_EXTRACTION_VERSION,
      request.palmInteriorGeometry,
    );
    const interior = detachVariant(
      interiorExtraction,
      PALM_INTERIOR_EXPERIMENT_VERSION,
      request.palmInteriorGeometry,
    );
    wipePalmLineExtraction(baselineExtraction);
    wipePalmLineExtraction(interiorExtraction);
    baselineExtraction = null;
    interiorExtraction = null;

    const response: PalmLineWorkerResponse = {
      requestId: request.requestId,
      captureId: request.captureId,
      sampleId: `live-${sampleFingerprint.slice(0, 12)}`,
      sampleFingerprint,
      roiSignature,
      baseline,
      interior,
    };
    request.data.fill(0);
    const transferable = [
      baseline.overlay.data.buffer,
      baseline.ridgeResponseMap.data.buffer,
      interior.overlay.data.buffer,
      interior.ridgeResponseMap.data.buffer,
      interior.interiorMaskMap?.data.buffer,
    ].filter((buffer): buffer is ArrayBuffer => buffer instanceof ArrayBuffer);
    workerScope.postMessage(response, transferable);
  } catch {
    if (baselineExtraction) wipePalmLineExtraction(baselineExtraction);
    if (interiorExtraction) wipePalmLineExtraction(interiorExtraction);
    request.data.fill(0);
    throw new Error("Perbandingan kandidat lipatan gagal dijalankan oleh browser.");
  }
};
