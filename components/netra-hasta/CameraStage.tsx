"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";
import type { CameraStatus } from "@/hooks/useCamera";
import type { CameraDeviceOption } from "@/lib/netra-hasta/camera";
import type { ScanMode } from "@/lib/netra-hasta/types";

interface CameraStageProps {
  stream: MediaStream | null;
  status: CameraStatus;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  mode: ScanMode;
  devices: CameraDeviceOption[];
  selectedDeviceId: string | null;
  onCameraChange: (deviceId: string) => void;
  onStop: () => void;
}

export default function CameraStage({
  stream,
  status,
  videoRef,
  canvasRef,
  mode,
  devices,
  selectedDeviceId,
  onCameraChange,
  onStop,
}: CameraStageProps) {
  const [aspectRatio, setAspectRatio] = useState("4 / 3");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.srcObject = stream;
    if (stream) void video.play().catch(() => undefined);

    return () => {
      if (video.srcObject === stream) video.srcObject = null;
    };
  }, [stream, videoRef]);

  const handleMetadata = () => {
    const video = videoRef.current;
    if (video?.videoWidth && video.videoHeight) {
      setAspectRatio(`${video.videoWidth} / ${video.videoHeight}`);
    }
  };

  return (
    <section className="overflow-hidden rounded-[2rem] border border-[#c59b3d]/25 bg-[#211815] shadow-2xl shadow-black/15">
      <div className="flex flex-col gap-3 border-b border-white/10 px-4 py-3 text-white sm:flex-row sm:items-center sm:justify-between md:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className={`h-2.5 w-2.5 rounded-full ${status === "active" ? "bg-emerald-400 animate-pulse" : "bg-stone-500"}`} />
          {status === "active" ? "Kamera aktif" : status === "requesting" ? "Menunggu izin" : "Kamera tidak aktif"}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {devices.length > 1 && (
            <label className="flex items-center gap-2 text-xs font-semibold">
              <span className="sr-only">Pilih kamera</span>
              <select
                value={selectedDeviceId ?? ""}
                onChange={(event) => onCameraChange(event.target.value)}
                disabled={status === "requesting"}
                aria-label="Pilih kamera"
                className="max-w-52 rounded-full border border-white/20 bg-[#342722] px-3 py-1.5 text-xs text-white outline-none focus-visible:ring-2 focus-visible:ring-[#f3c969]"
              >
                {!selectedDeviceId && <option value="">Pilih kamera</option>}
                {devices.map((device) => (
                  <option key={device.deviceId} value={device.deviceId}>{device.label}</option>
                ))}
              </select>
            </label>
          )}
          {status === "active" && (
            <button
              type="button"
              onClick={onStop}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f3c969]"
            >
              <span className="material-symbols-outlined text-base" aria-hidden="true">videocam_off</span>
              Hentikan
            </button>
          )}
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-5xl bg-black" style={{ aspectRatio }}>
        <video
          ref={videoRef}
          onLoadedMetadata={handleMetadata}
          muted
          playsInline
          className="absolute inset-0 h-full w-full -scale-x-100 object-contain"
          aria-label={`Pratinjau kamera untuk pemindaian ${mode === "hand" ? "tangan" : "wajah"}`}
        />
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full -scale-x-100"
          aria-hidden="true"
        />

        {status !== "active" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-[#211815] px-6 text-center text-white">
            <span className="material-symbols-outlined text-5xl text-[#e0b85d]" aria-hidden="true">
              {status === "requesting" ? "hourglass_top" : mode === "hand" ? "back_hand" : "face"}
            </span>
            <p className="font-display text-xl font-semibold">
              {status === "requesting" ? "Menunggu izin kamera" : "Kamera belum aktif"}
            </p>
          </div>
        )}

        {status === "active" && mode === "face" && (
          <div className="pointer-events-none absolute inset-x-[22%] inset-y-[8%] rounded-[48%] border border-dashed border-[#f3c969]/60">
            <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f7db91] backdrop-blur-sm">
              Area panduan wajah
            </span>
          </div>
        )}

        {status === "active" && mode === "hand" && (
          <div className="pointer-events-none absolute inset-x-3 bottom-3 flex justify-center sm:inset-x-5">
            <p className="max-w-md rounded-full bg-black/65 px-3 py-1.5 text-center text-[10px] font-bold leading-snug text-[#f7db91] backdrop-blur-sm sm:text-xs">
              Garis emas mengikuti telapak secara live — ROI final ditentukan saat dijepret
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
