import {
  PALM_LINE_RUNTIME_VERSION,
  type PalmLineRuntimeCandidate,
  type PalmLineRuntimeResult,
} from "./palm-line-runtime";
import type { RgbaImage } from "./palm-preprocessing";

export interface PalmLineWorkerRequest {
  requestId: number;
  captureId: number;
  width: number;
  height: number;
  data: Uint8ClampedArray;
}

export interface PalmLineLiveVariant {
  variant: "baseline";
  version: string;
  status: PalmLineRuntimeResult["status"];
  candidateCount: number;
  candidates: PalmLineRuntimeCandidate[];
  totalLengthPixels: number;
  overlay: RgbaImage;
  processingMs: number;
  reason: string | null;
}

export interface PalmLineWorkerResponse {
  requestId: number;
  captureId: number;
  baseline: PalmLineLiveVariant;
}

/**
 * Transfers the user-facing dark-ridge-v1 output without transforming candidate
 * coordinates or the overlay. Ownership moves to the worker response so the
 * source container can be wiped safely.
 */
export function detachPalmLineBaselineVariant(
  extraction: PalmLineRuntimeResult,
): PalmLineLiveVariant {
  const variant: PalmLineLiveVariant = {
    variant: "baseline",
    version: PALM_LINE_RUNTIME_VERSION,
    status: extraction.status,
    candidateCount: extraction.candidates.length,
    candidates: extraction.candidates,
    totalLengthPixels: extraction.candidates.reduce(
      (total, candidate) => total + candidate.lengthPixels,
      0,
    ),
    overlay: extraction.overlay,
    processingMs: extraction.processingMs,
    reason: extraction.abstainReason,
  };
  extraction.candidates = [];
  extraction.overlay = { width: 0, height: 0, data: new Uint8ClampedArray() };
  return variant;
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
  const variant = result.baseline;
  variant.overlay.data.fill(0);
  variant.candidates.forEach((candidate) => {
    candidate.points.forEach((point) => {
      point.x = 0;
      point.y = 0;
    });
    candidate.points = [];
  });
  variant.candidates = [];
}

export function wipePalmLineLiveResult(result: PalmLineLiveResult | null): void {
  wipePalmLineWorkerResponse(result);
}
