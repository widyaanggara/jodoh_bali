"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import CameraStage from "./CameraStage";
import ConsentPanel from "./ConsentPanel";
import FaceTrackingPanel from "./FaceTrackingPanel";
import PalmCapturePanel from "./PalmCapturePanel";
import PalmPreviewPanel from "./PalmPreviewPanel";
import QualityIndicator from "./QualityIndicator";
import ScanModePicker from "./ScanModePicker";
import { useCamera } from "@/hooks/useCamera";
import { useFaceLandmarker } from "@/hooks/useFaceLandmarker";
import { useHandLandmarker } from "@/hooks/useHandLandmarker";
import { usePalmLineExtraction } from "@/hooks/usePalmLineExtraction";
import { getPalmCaptureDecision } from "@/lib/netra-hasta/image-quality";
import {
  clearPalmCaptureArtifacts,
  createEmptyPalmCaptureArtifacts,
  createPalmCaptureArtifacts,
  type PalmCaptureArtifacts,
} from "@/lib/netra-hasta/palm-capture-state";
import type { ScanMode } from "@/lib/netra-hasta/types";
import {
  calculatePalmRoiGeometry,
  createPalmInteriorGeometry,
  extractPalmRoi,
} from "@/lib/netra-hasta/palm-roi";
import {
  preprocessPalmImage,
  type PalmCapture,
} from "@/lib/netra-hasta/palm-preprocessing";

export default function NetraHastaClient() {
  const [hasConsented, setHasConsented] = useState(false);
  const [mode, setMode] = useState<ScanMode>("hand");
  const [palmArtifacts, setPalmArtifacts] = useState(
    createEmptyPalmCaptureArtifacts,
  );
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [hasCaptureConsent, setHasCaptureConsent] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);
  const captureInProgressRef = useRef(false);
  const palmArtifactsRef = useRef<PalmCaptureArtifacts>(palmArtifacts);
  const palmCapture = palmArtifacts.capture;
  const palmLineExperimentEnabled = process.env.NODE_ENV === "development";
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camera = useCamera();
  const handTracking = useHandLandmarker({
    enabled: camera.status === "active" && mode === "hand",
    videoRef,
    canvasRef,
  });
  const faceTracking = useFaceLandmarker({
    enabled: camera.status === "active" && mode === "face",
    videoRef,
    canvasRef,
  });
  const palmLineExtraction = usePalmLineExtraction({
    enabled: palmLineExperimentEnabled && mode === "hand",
    capture: palmCapture,
  });

  const handleConsent = () => {
    setHasConsented(true);
    void camera.startCamera();
  };

  const handleRestart = () => {
    setHasCaptureConsent(false);
    void camera.startCamera();
  };

  const clearPalmCapture = useCallback(() => {
    captureInProgressRef.current = false;
    setIsCapturing(false);
    const clearedArtifacts = clearPalmCaptureArtifacts(palmArtifactsRef.current);
    palmArtifactsRef.current = clearedArtifacts;
    setPalmArtifacts(clearedArtifacts);
    setCaptureError(null);
    setHasCaptureConsent(false);
  }, []);

  useEffect(() => {
    const clearWhenPageLeaves = () => {
      if (document.hidden) clearPalmCapture();
    };
    const clearOnPageHide = () => clearPalmCapture();

    document.addEventListener("visibilitychange", clearWhenPageLeaves);
    window.addEventListener("pagehide", clearOnPageHide);
    return () => {
      document.removeEventListener("visibilitychange", clearWhenPageLeaves);
      window.removeEventListener("pagehide", clearOnPageHide);
      palmArtifactsRef.current = clearPalmCaptureArtifacts(
        palmArtifactsRef.current,
      );
    };
  }, [clearPalmCapture]);

  const handleModeChange = (nextMode: ScanMode) => {
    clearPalmCapture();
    setMode(nextMode);
  };

  const handleStop = () => {
    clearPalmCapture();
    camera.stopCamera();
  };

  const handlePalmCapture = () => {
    if (captureInProgressRef.current) return;
    captureInProgressRef.current = true;
    setIsCapturing(true);

    try {
      const video = videoRef.current;
      const observation = handTracking.getLatestHandObservation();
      const decision = getPalmCaptureDecision({
        cameraActive: camera.status === "active",
        hasConsent: hasCaptureConsent,
        quality: handTracking.palmQuality,
      });
      setCaptureError(null);

      if (
        mode !== "hand" ||
        !video ||
        !video.videoWidth ||
        !video.videoHeight
      ) {
        setCaptureError(
          "Kualitas frame berubah. Posisikan kembali telapak lalu coba lagi.",
        );
        return;
      }

      if (!decision.canCapture) {
        setCaptureError(
          decision.failedHardChecks.length > 0
            ? `Syarat wajib belum terpenuhi: ${decision.failedHardChecks.map((check) => check.label).join(", ")}.`
            : "Aktifkan kamera dan berikan persetujuan sebelum mengambil gambar.",
        );
        return;
      }

      if (!observation || performance.now() - observation.timestamp > 400) {
        setCaptureError(
          "Landmark terbaru tidak tersedia. Tahan telapak di depan kamera.",
        );
        return;
      }

      const geometryResult = calculatePalmRoiGeometry(
        observation.landmarks,
        video.videoWidth,
        video.videoHeight,
      );
      if (!geometryResult.ok) {
        setCaptureError(geometryResult.reason);
        return;
      }

      const frameCanvas = document.createElement("canvas");
      frameCanvas.width = video.videoWidth;
      frameCanvas.height = video.videoHeight;
      const frameContext = frameCanvas.getContext("2d", {
        willReadFrequently: true,
      });
      if (!frameContext) {
        setCaptureError("Browser tidak dapat menyiapkan frame telapak.");
        return;
      }

      let roiCanvas: HTMLCanvasElement | null = null;
      try {
        frameContext.drawImage(video, 0, 0, frameCanvas.width, frameCanvas.height);
        roiCanvas = extractPalmRoi(frameCanvas, geometryResult.geometry);
        const roiContext = roiCanvas.getContext("2d", {
          willReadFrequently: true,
        });
        if (!roiContext) throw new Error("Kanvas ROI tidak tersedia.");

        const imageData = roiContext.getImageData(
          0,
          0,
          roiCanvas.width,
          roiCanvas.height,
        );
        const processed = preprocessPalmImage({
          width: imageData.width,
          height: imageData.height,
          data: imageData.data,
        });
        imageData.data.fill(0);
        const capture: PalmCapture = {
          ...processed,
          capturedAt: Date.now(),
          handedness: observation.handedness,
          rotationDegrees: geometryResult.geometry.rotationDegrees,
          qualityMode: decision.mode === "normal" ? "normal" : "manual-override",
          qualityWarnings: decision.failedSoftChecks.map(
            (check) =>
              `${check.label}: ${check.value ?? "gagal"} (target ${check.target ?? "ideal"})`,
          ),
          palmInteriorGeometry: createPalmInteriorGeometry(
            observation.landmarks,
            video.videoWidth,
            video.videoHeight,
            geometryResult.geometry,
          ),
        };

        const previousArtifacts = palmArtifactsRef.current;
        clearPalmCaptureArtifacts(previousArtifacts);
        const nextArtifacts = createPalmCaptureArtifacts(
          capture,
          handTracking.palmQuality,
        );
        palmArtifactsRef.current = nextArtifacts;
        setPalmArtifacts(nextArtifacts);
      } catch {
        setCaptureError("Gambar telapak gagal diproses. Silakan coba lagi.");
      } finally {
        frameContext.clearRect(0, 0, frameCanvas.width, frameCanvas.height);
        frameCanvas.width = 0;
        frameCanvas.height = 0;
        if (roiCanvas) {
          roiCanvas.width = 0;
          roiCanvas.height = 0;
        }
      }
    } finally {
      captureInProgressRef.current = false;
      setIsCapturing(false);
    }
  };

  return (
    <div className="space-y-6">
      <ScanModePicker
        mode={mode}
        disabled={camera.status === "requesting"}
        onChange={handleModeChange}
      />

      {!hasConsented ? (
        <ConsentPanel
          isRequesting={camera.status === "requesting"}
          onConsent={handleConsent}
        />
      ) : (
        <>
          {camera.error && (
            <section className="rounded-3xl border border-red-200 bg-red-50 p-5 text-red-900" role="alert">
              <div className="flex items-start gap-3">
                <span className="material-symbols-outlined" aria-hidden="true">no_photography</span>
                <div className="flex-1">
                  <h2 className="font-bold">Kamera tidak dapat digunakan</h2>
                  <p className="mt-1 text-sm leading-relaxed">{camera.error}</p>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="mt-4 cursor-pointer rounded-full bg-red-900 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-800"
                  >
                    Coba lagi
                  </button>
                </div>
              </div>
            </section>
          )}

          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-4">
              <CameraStage
                stream={camera.stream}
                status={camera.status}
                videoRef={videoRef}
                canvasRef={canvasRef}
                mode={mode}
                onStop={handleStop}
              />

              {mode === "hand" && (
                <div className="rounded-3xl border border-[#c59b3d]/20 bg-white p-5 text-sm leading-relaxed text-stone-600 shadow-lg shadow-stone-900/5">
                  <p className="font-bold text-stone-900">Panduan Hasta Rekha</p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5">
                    <li>Gunakan ruangan dengan cahaya merata.</li>
                    <li>Buka telapak dan renggangkan jari secara alami.</li>
                    <li>
                      Ikuti garis emas pada area telapak; jari tetap terlihat agar
                      orientasi dapat dihitung.
                    </li>
                  </ol>
                </div>
              )}
            </div>

            <aside className="space-y-4 lg:sticky lg:top-24">
              {mode === "hand" ? (
                <QualityIndicator
                  guidance={camera.status === "active" ? handTracking.guidance : "idle"}
                  metrics={handTracking.metrics}
                  delegate={handTracking.delegate}
                  modelError={handTracking.modelError}
                  cameraNotice={camera.notice}
                />
              ) : (
                <FaceTrackingPanel
                  guidance={camera.status === "active" ? faceTracking.guidance : "idle"}
                  metrics={faceTracking.metrics}
                  geometry={faceTracking.geometry}
                  delegate={faceTracking.delegate}
                  modelError={faceTracking.modelError}
                  cameraNotice={camera.notice}
                />
              )}

              {mode === "hand" && camera.status === "active" && !palmCapture && (
                <PalmCapturePanel
                  key={camera.stream?.id ?? "no-stream"}
                  cameraStatus={camera.status}
                  quality={handTracking.palmQuality}
                  hasCaptureConsent={hasCaptureConsent}
                  isCapturing={isCapturing}
                  captureError={captureError}
                  onConsentChange={setHasCaptureConsent}
                  onCapture={handlePalmCapture}
                />
              )}

              {camera.status === "idle" && (
                <button
                  type="button"
                  onClick={handleRestart}
                  className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9f3e2f] px-5 py-3 font-bold text-white transition hover:bg-[#7f2f24]"
                >
                  <span className="material-symbols-outlined text-xl" aria-hidden="true">videocam</span>
                  Aktifkan kembali
                </button>
              )}

              {mode === "face" && (
                <div className="rounded-3xl border border-[#c59b3d]/20 bg-white p-5 text-sm leading-relaxed text-stone-600">
                  <p className="font-bold text-stone-900">Panduan Rupa Lakshana</p>
                  <ol className="mt-3 list-decimal space-y-2 pl-5">
                    <li>Gunakan cahaya merata dari arah depan.</li>
                    <li>Posisikan satu wajah di tengah area oval.</li>
                    <li>Hadapkan kepala lurus dengan ekspresi netral.</li>
                  </ol>
                </div>
              )}
            </aside>
          </div>

          {mode === "hand" && palmCapture && palmArtifacts.capturedQualityMetrics && (
            <PalmPreviewPanel
              key={palmCapture.capturedAt}
              capture={palmCapture}
              quality={palmArtifacts.capturedQualityMetrics}
              lineExperimentEnabled={palmLineExperimentEnabled}
              lineExtraction={palmLineExtraction}
              onRetry={clearPalmCapture}
              onDelete={clearPalmCapture}
            />
          )}
        </>
      )}
    </div>
  );
}
