"use client";

import type { CameraStatus } from "@/hooks/useCamera";
import {
  getPalmCaptureDecision,
  type PalmQualityReport,
} from "@/lib/netra-hasta/image-quality";

interface PalmCapturePanelProps {
  cameraStatus: CameraStatus;
  quality: PalmQualityReport;
  hasCaptureConsent: boolean;
  isCapturing: boolean;
  captureError: string | null;
  onConsentChange: (consented: boolean) => void;
  onCapture: () => void;
}

export default function PalmCapturePanel({
  cameraStatus,
  quality,
  hasCaptureConsent,
  isCapturing,
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
    <section className="space-y-4 rounded-[2rem] border border-[#c59b3d]/25 bg-white p-4 shadow-lg shadow-stone-900/5 sm:p-5">
      <div className="space-y-4">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9f3e2f]">
            Capture telapak
          </p>
          <h3 className="mt-1 font-display text-xl font-bold text-stone-900">
            Jepret saat telapak stabil
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Garis emas adalah panduan live berbasis landmark. ROI sebenarnya baru
            dihitung dari frame resolusi asli ketika tombol ditekan.
          </p>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-stone-700">
            Hadapkan sisi telapak, renggangkan jari secara alami, dan pertahankan
            pangkal jari serta sisi telapak di dalam panduan.
          </p>
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-sm leading-relaxed text-stone-700">
          <input
            type="checkbox"
            checked={hasCaptureConsent}
            onChange={(event) => onConsentChange(event.target.checked)}
            disabled={cameraStatus !== "active" || isCapturing}
            className="mt-1 h-4 w-4 shrink-0 accent-[#9f3e2f]"
          />
          <span>
            Saya setuju satu frame diproses sementara di perangkat ini untuk membuat
            pratinjau telapak.
          </span>
        </label>
      </div>

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

      {captureError && (
        <p className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-900" role="alert">
          {captureError}
        </p>
      )}

      <button
        type="button"
        onClick={onCapture}
        disabled={!decision.canCapture || isCapturing}
        aria-busy={isCapturing}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9f3e2f] px-5 py-3 font-bold text-white transition hover:bg-[#7f2f24] disabled:cursor-not-allowed disabled:bg-stone-300"
      >
        <span className="material-symbols-outlined" aria-hidden="true">photo_camera</span>
        {isCapturing
          ? "Memproses frame…"
          : decision.mode === "manual"
            ? "Ambil Gambar Sekarang"
            : "Jepret Telapak"}
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
