"use client";

import PalmImagePreviewCard from "./PalmImagePreviewCard";
import type { PalmLineLiveState } from "@/lib/netra-hasta/palm-line-live";

interface PalmLineResultPanelProps {
  state: PalmLineLiveState;
}

export default function PalmLineResultPanel({ state }: PalmLineResultPanelProps) {
  const baseline = state.phase === "ready" ? state.result.baseline : null;

  return (
    <section className="mt-6 rounded-3xl border border-[#c59b3d]/25 bg-[#fffaf0] p-4 md:p-5">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-display text-xl font-bold text-stone-900">
          Kandidat lipatan telapak
        </h3>
        <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wide text-amber-900">
          Eksperimental
        </span>
      </div>

      {state.phase === "idle" && (
        <p className="mt-3 text-sm text-stone-600" role="status">
          Kandidat akan diproses lokal setelah ROI telapak tersedia.
        </p>
      )}

      {state.phase === "processing" && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-stone-800" role="status" aria-live="polite">
          <span className="material-symbols-outlined animate-spin text-[#9f3e2f]" aria-hidden="true">progress_activity</span>
          <div>
            <p className="font-bold">Mencari kandidat lipatan di perangkat ini</p>
            <p className="mt-0.5 text-xs text-stone-500">Proses berjalan di background tanpa mengunggah ROI.</p>
          </div>
        </div>
      )}

      {state.phase === "error" && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert">
          <p className="font-bold">Analisis kandidat tidak selesai</p>
          <p className="mt-1">{state.reason}</p>
        </div>
      )}

      {baseline && (
        <div className="mt-4 grid items-start gap-4 md:grid-cols-[minmax(15rem,22rem)_minmax(0,1fr)]">
          <PalmImagePreviewCard
            image={baseline.overlay}
            label="Overlay kandidat otomatis"
            description="Garis cyan menunjukkan kandidat dark-ridge-v1 pada koordinat ROI yang sama."
            processed
          />
          <div className="space-y-3">
            {baseline.status === "detected" ? (
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-950" role="status">
                <p className="font-bold">Kandidat berhasil ditampilkan</p>
                <p className="mt-1">
                  {baseline.candidateCount} segmen kandidat · panjang total {baseline.totalLengthPixels.toFixed(0)} piksel.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950" role="status">
                <p className="font-bold">Detektor memilih abstain</p>
                <p className="mt-1">
                  {baseline.reason ?? "Tidak ada struktur dengan dukungan piksel yang cukup."}
                  Ini bukan skor nol dan bukan kegagalan kamera.
                </p>
              </div>
            )}
            <div className="rounded-2xl bg-white p-4 text-xs leading-relaxed text-stone-600">
              <p className="font-bold text-stone-800">Batas hasil</p>
              <p className="mt-1">
                Garis yang tampil hanya kandidat hasil deteksi otomatis. Belum semua
                lipatan dapat dikenali, sedangkan kontur luar tangan atau bayangan
                masih dapat salah terdeteksi.
              </p>
              <p className="mt-2">
                Hasil ini belum tervalidasi sebagai pembacaan budaya maupun prediksi
                ilmiah dan tidak memberi label Rekha otomatis.
              </p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
