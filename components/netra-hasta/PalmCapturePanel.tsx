"use client";

import type { CameraStatus } from "@/hooks/useCamera";
import {
  getPalmCaptureDecision,
  type PalmQualityReport,
} from "@/lib/netra-hasta/image-quality";
import PalmQualityPanel from "./PalmQualityPanel";

interface PalmCapturePanelProps {
  cameraStatus: CameraStatus;
  quality: PalmQualityReport;
  hasCaptureConsent: boolean;
  captureError: string | null;
  onConsentChange: (consented: boolean) => void;
  onCapture: () => void;
}

export default function PalmCapturePanel({
  cameraStatus,
  quality,
  hasCaptureConsent,
  captureError,
  onConsentChange,
  onCapture,
}: PalmCapturePanelProps) {
  const decision = getPalmCaptureDecision({
    cameraActive: cameraStatus === "active",
    hasConsent: hasCaptureConsent,
    quality,
  });
  const sharpnessFailed = decision.failedSoftChecks.some(
    (check) => check.key === "sharpness",
  );

  return (
    <section className="space-y-4">
      <div className="rounded-3xl border border-[#c59b3d]/20 bg-white p-5">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9f3e2f]">
          Palm Capture
        </p>
        <h3 className="mt-1 font-display text-xl font-bold text-stone-900">
          Ambil area telapak
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-stone-600">
          Sistem hanya menyimpan piksel ROI telapak sementara di memori browser.
          Tidak ada foto yang diunggah atau disimpan permanen.
        </p>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-stone-700">
          Hadapkan sisi telapak ke kamera, renggangkan jari agar tidak menutupi
          area telapak, dan jauhkan wajah dari latar belakang tangan.
        </p>
      </div>

      <PalmQualityPanel quality={quality} source="live" />

      {quality.manualCaptureAllowed && (
        <div className="rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm leading-relaxed text-amber-950" role="alert">
          <p className="font-bold">Kualitas belum ideal</p>
          <p className="mt-1">
            {sharpnessFailed
              ? "Ketajaman gambar belum ideal. Anda tetap dapat mengambil gambar, tetapi hasil analisis garis tangan mungkin kurang akurat."
              : "Pencahayaan atau kontras belum ideal. Anda tetap dapat mengambil gambar, tetapi hasil analisis garis tangan mungkin kurang akurat."}
          </p>
          <p className="mt-2 text-xs">
            Capture manual tidak otomatis dinyatakan layak untuk analisis Milestone 3B.
          </p>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 bg-white p-3 text-sm leading-relaxed text-stone-700">
        <input
          type="checkbox"
          checked={hasCaptureConsent}
          onChange={(event) => onConsentChange(event.target.checked)}
          disabled={cameraStatus !== "active"}
          className="mt-1 h-4 w-4 accent-[#9f3e2f]"
        />
        <span>
          Saya setuju satu frame diproses sementara di perangkat ini untuk membuat
          pratinjau telapak.
        </span>
      </label>

      {captureError && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">
          {captureError}
        </p>
      )}

      <button
        type="button"
        onClick={onCapture}
        disabled={!decision.canCapture}
        className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9f3e2f] px-5 py-3 font-bold text-white transition hover:bg-[#7f2f24] disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        <span className="material-symbols-outlined" aria-hidden="true">photo_camera</span>
        {decision.mode === "manual" ? "Ambil Gambar Sekarang" : "Ambil Telapak"}
      </button>

      {!decision.canCapture && hasCaptureConsent && decision.failedHardChecks.length > 0 && (
        <p className="text-xs font-semibold leading-relaxed text-red-700">
          Capture terkunci karena syarat wajib gagal: {decision.failedHardChecks.map((check) => check.label).join(", ")}.
        </p>
      )}

      <p className="text-xs leading-relaxed text-stone-500">
        Landmark tangan tidak dapat memastikan sisi telapak atau punggung tangan.
        Pastikan garis telapak terlihat pada pratinjau sebelum melanjutkan.
      </p>
    </section>
  );
}
