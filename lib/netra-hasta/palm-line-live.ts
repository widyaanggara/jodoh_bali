import type {
  PalmLineCandidate,
  PalmLineExtractionResult,
} from "./palm-line-extraction";
import type { RgbaImage } from "./palm-preprocessing";
import type { PalmInteriorGeometry } from "./palm-roi";

export interface PalmLineWorkerRequest {
  requestId: number;
  captureId: number;
  width: number;
  height: number;
  data: Uint8ClampedArray;
  rotationDegrees: number;
  palmInteriorGeometry: PalmInteriorGeometry;
}

export interface PalmLineLiveVariant {
  variant: "baseline" | "palm-interior";
  version: string;
  status: PalmLineExtractionResult["status"];
  maskStatus: PalmLineExtractionResult["maskStatus"];
  candidateCount: number;
  candidates: PalmLineCandidate[];
  totalLengthPixels: number;
  outsideCandidateCount: number | null;
  outsideLengthPixels: number | null;
  overlay: RgbaImage;
  ridgeResponseMap: RgbaImage;
  interiorMaskMap: RgbaImage | null;
  processingMs: number;
  reason: string | null;
}

export interface PalmLineWorkerResponse {
  requestId: number;
  captureId: number;
  sampleId: string;
  sampleFingerprint: string;
  roiSignature: string;
  baseline: PalmLineLiveVariant;
  interior: PalmLineLiveVariant;
}

export interface PalmLineLiveResult extends PalmLineWorkerResponse {
  captureToPreviewMs: number;
}

export type PalmLineLiveState =
  | { phase: "idle" }
  | { phase: "processing"; requestId: number; captureId: number }
  | { phase: "ready"; result: PalmLineLiveResult }
  | { phase: "error"; requestId: number; captureId: number; reason: string };

export type PalmLineLiveAction =
  | { type: "reset" }
  | { type: "start"; requestId: number; captureId: number }
  | { type: "complete"; result: PalmLineLiveResult }
  | { type: "fail"; requestId: number; captureId: number; reason: string };

export const INITIAL_PALM_LINE_LIVE_STATE: PalmLineLiveState = { phase: "idle" };

/**
 * Rejects stale worker responses after retake, mode switch, or a newer capture.
 * This reducer intentionally contains no image processing or persistence.
 */
export function reducePalmLineLiveState(
  state: PalmLineLiveState,
  action: PalmLineLiveAction,
): PalmLineLiveState {
  if (action.type === "reset") return INITIAL_PALM_LINE_LIVE_STATE;
  if (action.type === "start") {
    return {
      phase: "processing",
      requestId: action.requestId,
      captureId: action.captureId,
    };
  }
  const responseRequestId = action.type === "complete"
    ? action.result.requestId
    : action.requestId;
  const responseCaptureId = action.type === "complete"
    ? action.result.captureId
    : action.captureId;
  if (
    state.phase !== "processing" ||
    state.requestId !== responseRequestId ||
    state.captureId !== responseCaptureId
  ) {
    return state;
  }
  if (action.type === "fail") {
    return {
      phase: "error",
      requestId: action.requestId,
      captureId: action.captureId,
      reason: action.reason,
    };
  }
  return { phase: "ready", result: action.result };
}

export function wipePalmLineWorkerResponse(
  result: PalmLineWorkerResponse | null,
): void {
  if (!result) return;
  [result.baseline, result.interior].forEach((variant) => {
    variant.overlay.data.fill(0);
    variant.ridgeResponseMap.data.fill(0);
    variant.interiorMaskMap?.data.fill(0);
    variant.candidates.forEach((candidate) => {
      candidate.points.forEach((point) => {
        point.x = 0;
        point.y = 0;
      });
      candidate.points = [];
    });
    variant.candidates = [];
  });
}

export function wipePalmLineLiveResult(result: PalmLineLiveResult | null): void {
  wipePalmLineWorkerResponse(result);
}
