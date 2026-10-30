"use client";

import type {
  FaceLandmarker,
  Matrix,
  NormalizedLandmark,
} from "@mediapipe/tasks-vision";
import type { RefObject } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  calculateFaceGeometry,
  type FaceGeometry,
} from "@/lib/netra-hasta/face-geometry";
import type {
  LandmarkConnection,
  VisionDelegate,
} from "@/lib/netra-hasta/types";

const WASM_ROOT = "/mediapipe/wasm";
const MODEL_PATH = "/mediapipe/models/face_landmarker.task";
const TARGET_INFERENCE_FPS = 15;
const INFERENCE_INTERVAL_MS = 1000 / TARGET_INFERENCE_FPS;
const ORIENTATION_LIMIT_DEGREES = 15;

type ModelStatus = "idle" | "loading" | "ready" | "error";

export type FaceGuidanceStatus =
  | "idle"
  | "loading"
  | "searching"
  | "too-far"
  | "too-close"
  | "clipped"
  | "tilted"
  | "ready"
  | "error";

export interface FaceTrackingMetrics {
  fps: number;
  processingMs: number;
  landmarkCount: number;
}

interface UseFaceLandmarkerOptions {
  enabled: boolean;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

interface FaceConnectionGroups {
  tessellation: LandmarkConnection[];
  contours: LandmarkConnection[];
  irises: LandmarkConnection[];
}

function assessFacePosition(geometry: FaceGeometry | null): FaceGuidanceStatus {
  if (!geometry) return "searching";

  const { bounds, relativeWidth, relativeHeight, orientation } = geometry;
  if (
    bounds.minX < 0.02 ||
    bounds.maxX > 0.98 ||
    bounds.minY < 0.02 ||
    bounds.maxY > 0.98
  ) {
    return "clipped";
  }

  if (relativeWidth < 0.24 || relativeHeight < 0.34) return "too-far";
  if (relativeWidth > 0.72 || relativeHeight > 0.88) return "too-close";

  if (
    orientation &&
    (Math.abs(orientation.yaw) > ORIENTATION_LIMIT_DEGREES ||
      Math.abs(orientation.pitch) > ORIENTATION_LIMIT_DEGREES ||
      Math.abs(orientation.roll) > ORIENTATION_LIMIT_DEGREES)
  ) {
    return "tilted";
  }

  return "ready";
}

function drawConnections(
  context: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[],
  connections: LandmarkConnection[],
) {
  const { width, height } = context.canvas;
  connections.forEach(({ start, end }) => {
    const from = landmarks[start];
    const to = landmarks[end];
    if (!from || !to) return;

    context.moveTo(from.x * width, from.y * height);
    context.lineTo(to.x * width, to.y * height);
  });
}

function drawFaceMesh(
  context: CanvasRenderingContext2D,
  landmarks: NormalizedLandmark[][],
  connections: FaceConnectionGroups,
) {
  const { width, height } = context.canvas;
  context.clearRect(0, 0, width, height);
  const face = landmarks[0];
  if (!face) return;

  context.save();
  context.lineCap = "round";
  context.lineJoin = "round";
  context.shadowColor = "rgba(0, 0, 0, 0.2)";
  context.shadowBlur = 2;

  context.beginPath();
  context.strokeStyle = "rgba(243, 201, 105, 0.36)";
  context.lineWidth = Math.max(0.7, width / 1450);
  drawConnections(context, face, connections.tessellation);
  context.stroke();

  context.beginPath();
  context.strokeStyle = "rgba(255, 241, 210, 0.9)";
  context.lineWidth = Math.max(1.4, width / 650);
  drawConnections(context, face, connections.contours);
  context.stroke();

  context.beginPath();
  context.strokeStyle = "#f0a68d";
  context.lineWidth = Math.max(1.6, width / 580);
  drawConnections(context, face, connections.irises);
  context.stroke();

  context.fillStyle = "rgba(255, 248, 223, 0.78)";
  const radius = Math.max(0.9, width / 1050);
  face.forEach((point) => {
    context.beginPath();
    context.arc(point.x * width, point.y * height, radius, 0, Math.PI * 2);
    context.fill();
  });

  context.restore();
}

export function useFaceLandmarker({
  enabled,
  videoRef,
  canvasRef,
}: UseFaceLandmarkerOptions) {
  const [modelStatus, setModelStatus] = useState<ModelStatus>("idle");
  const [modelError, setModelError] = useState<string | null>(null);
  const [delegate, setDelegate] = useState<VisionDelegate | null>(null);
  const [guidance, setGuidance] = useState<FaceGuidanceStatus>("idle");
  const [geometry, setGeometry] = useState<FaceGeometry | null>(null);
  const [metrics, setMetrics] = useState<FaceTrackingMetrics>({
    fps: 0,
    processingMs: 0,
    landmarkCount: 0,
  });

  const landmarkerRef = useRef<FaceLandmarker | null>(null);
  const connectionGroupsRef = useRef<FaceConnectionGroups>({
    tessellation: [],
    contours: [],
    irises: [],
  });
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
    let createdLandmarker: FaceLandmarker | null = null;

    if (!enabled) {
      stopInference();
      landmarkerRef.current?.close();
      landmarkerRef.current = null;
      setModelStatus("idle");
      setModelError(null);
      setDelegate(null);
      setGuidance("idle");
      setGeometry(null);
      setMetrics({ fps: 0, processingMs: 0, landmarkCount: 0 });
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
          vision.FaceLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath: MODEL_PATH,
              delegate: selectedDelegate,
            },
            runningMode: "VIDEO",
            numFaces: 1,
            minFaceDetectionConfidence: 0.55,
            minFacePresenceConfidence: 0.55,
            minTrackingConfidence: 0.5,
            outputFaceBlendshapes: false,
            outputFacialTransformationMatrixes: true,
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
        connectionGroupsRef.current = {
          tessellation: vision.FaceLandmarker.FACE_LANDMARKS_TESSELATION,
          contours: vision.FaceLandmarker.FACE_LANDMARKS_CONTOURS,
          irises: [
            ...vision.FaceLandmarker.FACE_LANDMARKS_LEFT_IRIS,
            ...vision.FaceLandmarker.FACE_LANDMARKS_RIGHT_IRIS,
          ],
        };
        setDelegate(selectedDelegate);
        setModelStatus("ready");
        setGuidance("searching");
      } catch {
        if (cancelled) return;
        setModelStatus("error");
        setModelError(
          "Model wajah gagal dimuat. Pastikan aset MediaPipe tersedia, lalu mulai ulang kamera.",
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
      connectionGroupsRef.current = { tessellation: [], contours: [], irises: [] };
    };
  }, [enabled, stopInference]);

  useEffect(() => {
    if (!enabled || modelStatus !== "ready") return;

    let lastVideoTime = -1;
    let lastInferenceAt = 0;
    let metricsWindowStartedAt = performance.now();
    let metricsFrames = 0;
    let metricsProcessingTotal = 0;
    let latestLandmarkCount = 0;
    let latestGeometry: FaceGeometry | null = null;

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
        const face = result.faceLandmarks[0];
        const transformationMatrix: Matrix | undefined =
          result.facialTransformationMatrixes[0];

        latestGeometry = face
          ? calculateFaceGeometry(
              face,
              video.videoWidth,
              video.videoHeight,
              transformationMatrix,
            )
          : null;
        latestLandmarkCount = face?.length ?? 0;

        drawFaceMesh(context, result.faceLandmarks, connectionGroupsRef.current);
        setGuidance(assessFacePosition(latestGeometry));

        metricsFrames += 1;
        metricsProcessingTotal += processingMs;
        const metricsElapsed = performance.now() - metricsWindowStartedAt;

        if (metricsElapsed >= 750) {
          setMetrics({
            fps: (metricsFrames * 1000) / metricsElapsed,
            processingMs: metricsProcessingTotal / metricsFrames,
            landmarkCount: latestLandmarkCount,
          });
          setGeometry(latestGeometry);
          metricsWindowStartedAt = performance.now();
          metricsFrames = 0;
          metricsProcessingTotal = 0;
        }
      } catch {
        stopInference();
        setModelStatus("error");
        setModelError("Inferensi wajah berhenti karena runtime MediaPipe mengalami kesalahan.");
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
    geometry,
    metrics,
  };
}
