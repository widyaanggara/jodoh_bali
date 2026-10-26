"use client";

import type { HandLandmarker, NormalizedLandmark } from "@mediapipe/tasks-vision";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
  LandmarkConnection,
  VisionDelegate,
} from "@/lib/netra-hasta/types";

const WASM_ROOT = "/mediapipe/wasm";
const MODEL_PATH = "/mediapipe/models/hand_landmarker.task";
const TARGET_INFERENCE_FPS = 15;
const INFERENCE_INTERVAL_MS = 1000 / TARGET_INFERENCE_FPS;

type ModelStatus = "idle" | "loading" | "ready" | "error";

export type GuidanceStatus =
  | "idle"
  | "loading"
  | "searching"
  | "too-far"
  | "clipped"
  | "detected"
  | "error";

export interface HandTrackingMetrics {
  fps: number;
  processingMs: number;
  handCount: number;
}

interface UseHandLandmarkerOptions {
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

function assessHandPosition(landmarks: NormalizedLandmark[][]): GuidanceStatus {
  if (landmarks.length === 0) return "searching";

  let isTooFar = false;
  let isClipped = false;

  for (const hand of landmarks) {
    const xValues = hand.map((point) => point.x);
    const yValues = hand.map((point) => point.y);
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const minY = Math.min(...yValues);
    const maxY = Math.max(...yValues);
    const width = maxX - minX;
    const height = maxY - minY;

    if (minX < 0.025 || maxX > 0.975 || minY < 0.025 || maxY > 0.975) {
      isClipped = true;
    }

    if (width < 0.28 || height < 0.36) {
      isTooFar = true;
    }
  }

  if (isClipped) return "clipped";
  if (isTooFar) return "too-far";
  return "detected";
}

function drawHands(
  context: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[][],
  connections: LandmarkConnection[],
) {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  context.lineCap = "round";
  context.lineJoin = "round";

  landmarks.forEach((hand, handIndex) => {
    const connectorColor = handIndex === 0 ? "#f3c969" : "#f0a68d";
    const pointColor = handIndex === 0 ? "#fff8df" : "#fff1eb";

    context.strokeStyle = connectorColor;
    context.lineWidth = Math.max(3, width / 280);
    context.shadowColor = "rgba(0, 0, 0, 0.28)";
    context.shadowBlur = 5;

    connections.forEach(({ start, end }) => {
      const from = hand[start];
      const to = hand[end];
      if (!from || !to) return;

      context.beginPath();
      context.moveTo(from.x * width, from.y * height);
      context.lineTo(to.x * width, to.y * height);
      context.stroke();
    });

    context.fillStyle = pointColor;
    context.strokeStyle = "#9f3e2f";
    context.lineWidth = Math.max(1.5, width / 640);
    context.shadowBlur = 4;

    hand.forEach((point) => {
      context.beginPath();
      context.arc(
        point.x * width,
        point.y * height,
        Math.max(3.5, width / 190),
        0,
        Math.PI * 2,
      );
      context.fill();
      context.stroke();
    });

    context.shadowBlur = 0;
  });
}

export function useHandLandmarker({
  enabled,
  videoRef,
  canvasRef,
}: UseHandLandmarkerOptions) {
  const [modelStatus, setModelStatus] = useState<ModelStatus>("idle");
  const [modelError, setModelError] = useState<string | null>(null);
  const [delegate, setDelegate] = useState<VisionDelegate | null>(null);
  const [guidance, setGuidance] = useState<GuidanceStatus>("idle");
  const [metrics, setMetrics] = useState<HandTrackingMetrics>({
    fps: 0,
    processingMs: 0,
    handCount: 0,
  });

  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const connectionsRef = useRef<LandmarkConnection[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (canvas && context) context.clearRect(0, 0, canvas.width, canvas.height);
  }, [canvasRef]);

  const stopInference = useCallback(() => {
    if (animationFrameRef.current !== null) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    clearCanvas();
  }, [clearCanvas]);

  useEffect(() => {
    let cancelled = false;
    let createdLandmarker: HandLandmarker | null = null;

    if (!enabled) {
      stopInference();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      connectionsRef.current = [];
      setModelStatus("idle");
      setModelError(null);
      setDelegate(null);
      setGuidance("idle");
      setMetrics({ fps: 0, processingMs: 0, handCount: 0 });
      return;
    }

    const initialize = async () => {
      setModelStatus("loading");
      setModelError(null);
      setGuidance("loading");

      try {
        const vision = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_ROOT);

        const createWithDelegate = (selectedDelegate: VisionDelegate) =>
          vision.HandLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath: MODEL_PATH,
              delegate: selectedDelegate,
            },
            runningMode: "VIDEO",
            numHands: 2,
            minHandDetectionConfidence: 0.55,
            minHandPresenceConfidence: 0.55,
            minTrackingConfidence: 0.5,
          });

        let selectedDelegate: VisionDelegate = "GPU";
        try {
          createdLandmarker = await createWithDelegate("GPU");
        } catch {
          selectedDelegate = "CPU";
          createdLandmarker = await createWithDelegate("CPU");
        }

        if (cancelled) {
          createdLandmarker.close();
          return;
        }

        landmarkerRef.current = createdLandmarker;
        connectionsRef.current = vision.HandLandmarker.HAND_CONNECTIONS;
        setDelegate(selectedDelegate);
        setModelStatus("ready");
        setGuidance("searching");
      } catch {
        if (cancelled) return;
        setModelStatus("error");
        setModelError(
          "Model tangan gagal dimuat. Pastikan aset MediaPipe tersedia, lalu mulai ulang kamera.",
        );
        setGuidance("error");
      }
    };

    void initialize();

    return () => {
      cancelled = true;
      stopInference();
      const landmarker = landmarkerRef.current ?? createdLandmarker;
      landmarker?.close();
      if (landmarkerRef.current === landmarker) landmarkerRef.current = null;
      connectionsRef.current = [];
    };
  }, [enabled, stopInference]);

  useEffect(() => {
    if (!enabled || modelStatus !== "ready") return;

    let lastVideoTime = -1;
    let lastInferenceAt = 0;
    let metricsWindowStartedAt = performance.now();
    let metricsFrames = 0;
    let metricsProcessingTotal = 0;

    const renderLoop = (timestamp: number) => {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const landmarker = landmarkerRef.current;

      if (
        document.hidden ||
        !video ||
        !canvas ||
        !landmarker ||
        video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA
      ) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      if (
        timestamp - lastInferenceAt < INFERENCE_INTERVAL_MS ||
        video.currentTime === lastVideoTime
      ) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      lastInferenceAt = timestamp;
      lastVideoTime = video.currentTime;

      if (canvas.width !== video.videoWidth || canvas.height !== video.videoHeight) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
      }

      const context = canvas.getContext("2d");
      if (!context) {
        animationFrameRef.current = requestAnimationFrame(renderLoop);
        return;
      }

      try {
        const startedAt = performance.now();
        const result = landmarker.detectForVideo(video, startedAt);
        const processingMs = performance.now() - startedAt;

        drawHands(context, result.landmarks, connectionsRef.current);
        setGuidance(assessHandPosition(result.landmarks));

        metricsFrames += 1;
        metricsProcessingTotal += processingMs;
        const metricsElapsed = performance.now() - metricsWindowStartedAt;

        if (metricsElapsed >= 750) {
          setMetrics({
            fps: (metricsFrames * 1000) / metricsElapsed,
            processingMs: metricsProcessingTotal / metricsFrames,
            handCount: result.landmarks.length,
          });
          metricsWindowStartedAt = performance.now();
          metricsFrames = 0;
          metricsProcessingTotal = 0;
        }
      } catch {
        stopInference();
        setModelStatus("error");
        setModelError("Inferensi berhenti karena runtime MediaPipe mengalami kesalahan.");
        setGuidance("error");
        return;
      }

      animationFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animationFrameRef.current = requestAnimationFrame(renderLoop);
    return stopInference;
  }, [canvasRef, enabled, modelStatus, stopInference, videoRef]);

  return {
    modelStatus,
    modelError,
    delegate,
    guidance,
    metrics,
  };
}
