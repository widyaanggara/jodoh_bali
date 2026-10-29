"use client";

import type {
  HandLandmarker,
  HandLandmarkerResult,
} from "@mediapipe/tasks-vision";
import { useCallback, useEffect, useRef, useState } from "react";
import type { VisionDelegate } from "@/lib/netra-hasta/types";

const WASM_ROOT = "/mediapipe/wasm";
const MODEL_PATH = "/mediapipe/models/hand_landmarker.task";

type ImageModelStatus = "loading" | "ready" | "error";

export function useImageHandLandmarker() {
  const landmarkerRef = useRef<HandLandmarker | null>(null);
  const [status, setStatus] = useState<ImageModelStatus>("loading");
  const [delegate, setDelegate] = useState<VisionDelegate | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    let createdLandmarker: HandLandmarker | null = null;

    const initialize = async () => {
      try {
        const vision = await import("@mediapipe/tasks-vision");
        const fileset = await vision.FilesetResolver.forVisionTasks(WASM_ROOT);
        const createWithDelegate = (selectedDelegate: VisionDelegate) =>
          vision.HandLandmarker.createFromOptions(fileset, {
            baseOptions: {
              modelAssetPath: MODEL_PATH,
              delegate: selectedDelegate,
            },
            runningMode: "IMAGE",
            numHands: 2,
            minHandDetectionConfidence: 0.55,
            minHandPresenceConfidence: 0.55,
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
        setDelegate(selectedDelegate);
        setStatus("ready");
      } catch {
        if (cancelled) return;
        setStatus("error");
        setError("Model Hand Landmarker IMAGE gagal dimuat dari aset lokal.");
      }
    };

    void initialize();
    return () => {
      cancelled = true;
      const landmarker = landmarkerRef.current ?? createdLandmarker;
      landmarker?.close();
      if (landmarkerRef.current === landmarker) landmarkerRef.current = null;
    };
  }, []);

  const detect = useCallback((image: ImageBitmap): HandLandmarkerResult => {
    const landmarker = landmarkerRef.current;
    if (!landmarker) throw new Error("Model IMAGE belum siap.");
    return landmarker.detect(image);
  }, []);

  return { status, delegate, error, detect };
}
