"use client";

import { useEffect, useReducer, useRef } from "react";
import {
  INITIAL_PALM_LINE_LIVE_STATE,
  reducePalmLineLiveState,
  wipePalmLineLiveResult,
  wipePalmLineWorkerResponse,
  type PalmLineLiveResult,
  type PalmLineWorkerRequest,
  type PalmLineWorkerResponse,
} from "@/lib/netra-hasta/palm-line-live";
import type { PalmCapture } from "@/lib/netra-hasta/palm-preprocessing";

interface UsePalmLineExtractionInput {
  enabled: boolean;
  capture: PalmCapture | null;
}

const WORKER_TIMEOUT_MS = 15_000;

export function usePalmLineExtraction({
  enabled,
  capture,
}: UsePalmLineExtractionInput) {
  const [state, dispatch] = useReducer(
    reducePalmLineLiveState,
    INITIAL_PALM_LINE_LIVE_STATE,
  );
  const nextRequestIdRef = useRef(0);
  const retainedResultRef = useRef<PalmLineLiveResult | null>(null);

  useEffect(() => {
    const requestId = nextRequestIdRef.current + 1;
    nextRequestIdRef.current = requestId;
    let worker: Worker | null = null;
    let cancelled = false;
    let startTimer: number | null = null;
    let workerTimeout: number | null = null;

    const clearWorkerTimeout = () => {
      if (workerTimeout !== null) {
        window.clearTimeout(workerTimeout);
        workerTimeout = null;
      }
    };

    wipePalmLineLiveResult(retainedResultRef.current);
    retainedResultRef.current = null;

    if (!enabled || !capture) {
      dispatch({ type: "reset" });
      return;
    }

    const captureId = capture.capturedAt;
    dispatch({ type: "start", requestId, captureId });
    startTimer = window.setTimeout(() => {
      if (cancelled) return;
      if (typeof Worker === "undefined") {
        dispatch({
          type: "fail",
          requestId,
          captureId,
          reason: "Browser ini tidak mendukung pemrosesan kandidat di background.",
        });
        return;
      }

      const inputData = new Uint8ClampedArray(capture.original.data);
      try {
        worker = new Worker("/workers/palm-line.worker.js", {
          name: "metemu-palm-line",
        });
        worker.onmessage = ({ data }: MessageEvent<PalmLineWorkerResponse>) => {
          clearWorkerTimeout();
          if (
            cancelled ||
            data.requestId !== requestId ||
            data.captureId !== captureId
          ) {
            wipePalmLineWorkerResponse(data);
            return;
          }
          const result: PalmLineLiveResult = {
            ...data,
            captureToPreviewMs: Math.max(0, Date.now() - captureId),
          };
          retainedResultRef.current = result;
          dispatch({ type: "complete", result });
          worker?.terminate();
          worker = null;
        };
        worker.onerror = (event) => {
          event.preventDefault();
          clearWorkerTimeout();
          if (!cancelled) {
            dispatch({
              type: "fail",
              requestId,
              captureId,
              reason: "Worker ekstraksi kandidat lipatan berhenti secara tidak terduga.",
            });
          }
          worker?.terminate();
          worker = null;
        };
        worker.onmessageerror = () => {
          clearWorkerTimeout();
          if (!cancelled) {
            dispatch({
              type: "fail",
              requestId,
              captureId,
              reason: "Hasil worker kandidat tidak dapat dibaca oleh browser.",
            });
          }
          worker?.terminate();
          worker = null;
        };
        const request: PalmLineWorkerRequest = {
          requestId,
          captureId,
          width: capture.original.width,
          height: capture.original.height,
          data: inputData,
        };
        worker.postMessage(request, [inputData.buffer]);
        workerTimeout = window.setTimeout(() => {
          if (cancelled) return;
          dispatch({
            type: "fail",
            requestId,
            captureId,
            reason: "Analisis kandidat melewati batas waktu. Ambil ulang foto untuk mencoba lagi.",
          });
          worker?.terminate();
          worker = null;
        }, WORKER_TIMEOUT_MS);
      } catch {
        clearWorkerTimeout();
        if (inputData.byteLength > 0) inputData.fill(0);
        dispatch({
          type: "fail",
          requestId,
          captureId,
          reason: "Browser gagal memulai worker kandidat lipatan.",
        });
        worker?.terminate();
        worker = null;
      }
    }, 0);

    return () => {
      cancelled = true;
      if (startTimer !== null) window.clearTimeout(startTimer);
      clearWorkerTimeout();
      worker?.terminate();
      worker = null;
      wipePalmLineLiveResult(retainedResultRef.current);
      retainedResultRef.current = null;
    };
  }, [capture, enabled]);

  return state;
}
