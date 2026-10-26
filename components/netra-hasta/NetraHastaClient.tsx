"use client";

import { useRef, useState } from "react";
import CameraStage from "./CameraStage";
import ConsentPanel from "./ConsentPanel";
import QualityIndicator from "./QualityIndicator";
import { useCamera } from "@/hooks/useCamera";
import { useHandLandmarker } from "@/hooks/useHandLandmarker";

export default function NetraHastaClient() {
  const [hasConsented, setHasConsented] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const camera = useCamera();
  const tracking = useHandLandmarker({
    enabled: camera.status === "active",
    videoRef,
    canvasRef,
  });

  const handleConsent = () => {
    setHasConsented(true);
    void camera.startCamera();
  };

  const handleRestart = () => {
    void camera.startCamera();
  };

  return (
    <div className="space-y-6">
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
            <CameraStage
              stream={camera.stream}
              status={camera.status}
              videoRef={videoRef}
              canvasRef={canvasRef}
              onStop={() => camera.stopCamera()}
            />

            <aside className="space-y-4 lg:sticky lg:top-24">
              <QualityIndicator
                guidance={camera.status === "active" ? tracking.guidance : "idle"}
                metrics={tracking.metrics}
                delegate={tracking.delegate}
                modelError={tracking.modelError}
                cameraNotice={camera.notice}
              />

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

              <div className="rounded-3xl border border-[#c59b3d]/20 bg-white p-5 text-sm leading-relaxed text-stone-600">
                <p className="font-bold text-stone-900">Panduan singkat</p>
                <ol className="mt-3 list-decimal space-y-2 pl-5">
                  <li>Gunakan ruangan dengan cahaya merata.</li>
                  <li>Buka telapak dan renggangkan jari secara alami.</li>
                  <li>Jaga seluruh tangan tetap di dalam garis panduan.</li>
                </ol>
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
