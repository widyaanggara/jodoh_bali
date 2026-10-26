"use client";

import type { RefObject } from "react";
import { useEffect, useState } from "react";
import type { CameraStatus } from "@/hooks/useCamera";
import type { ScanMode } from "@/lib/netra-hasta/types";

interface CameraStageProps {
  stream: MediaStream | null;
  status: CameraStatus;
  videoRef: RefObject<HTMLVideoElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  mode: ScanMode;
  onStop: () => void;
}

export default function CameraStage({
  stream,
  status,
  videoRef,
  canvasRef,
  mode,
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
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3 text-white md:px-6">
        <div className="flex items-center gap-2 text-sm font-semibold">
          <span className={`h-2.5 w-2.5 rounded-full ${status === "active" ? "bg-emerald-400 animate-pulse" : "bg-stone-500"}`} />
          {status === "active" ? "Kamera aktif" : status === "requesting" ? "Menunggu izin" : "Kamera tidak aktif"}
        </div>
        {status === "active" && (
          <button
            type="button"
            onClick={onStop}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-bold transition hover:bg-white/10"
          >
            <span className="material-symbols-outlined text-base" aria-hidden="true">videocam_off</span>
            Hentikan
          </button>
        )}
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

        {status === "active" && (
          <div className={`pointer-events-none absolute border border-dashed border-[#f3c969]/60 ${
            mode === "hand"
              ? "inset-[7%] rounded-[2rem]"
              : "inset-x-[22%] inset-y-[8%] rounded-[48%]"
          }`}>
            <span className="absolute left-1/2 top-3 -translate-x-1/2 rounded-full bg-black/55 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-[#f7db91] backdrop-blur-sm">
              Area panduan {mode === "hand" ? "tangan" : "wajah"}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
