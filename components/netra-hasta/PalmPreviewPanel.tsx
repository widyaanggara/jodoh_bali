"use client";

import type { PalmCapture } from "@/lib/netra-hasta/palm-preprocessing";
import type { PalmQualitySnapshot } from "@/lib/netra-hasta/image-quality";
import type { PalmLineLiveState } from "@/lib/netra-hasta/palm-line-live";
import PalmImagePreviewCard from "./PalmImagePreviewCard";
import PalmLineLiveDiagnostic from "./PalmLineLiveDiagnostic";
import PalmLineResultPanel from "./PalmLineResultPanel";
import PalmQualityPanel from "./PalmQualityPanel";

interface PalmPreviewPanelProps {
  capture: PalmCapture;
  quality: PalmQualitySnapshot;
  showDeveloperDiagnostics: boolean;
  lineExtraction: PalmLineLiveState;
  onRetry: () => void;
  onDelete: () => void;
}

export default function PalmPreviewPanel({
  capture,
  quality,
  showDeveloperDiagnostics,
  lineExtraction,
  onRetry,
  onDelete,
}: PalmPreviewPanelProps) {
  return (
    <section className="rounded-[2rem] border border-[#c59b3d]/25 bg-white p-5 shadow-lg shadow-stone-900/5 md:p-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[#9f3e2f]">
            Pratinjau lokal
          </p>
          <h2 className="mt-1 font-display text-2xl font-bold text-stone-900">
            Periksa area telapak
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
            Pastikan gambar benar-benar menampilkan telapak, bukan punggung tangan.
            Area ini memakai ROI terotasi yang sama dengan hasil capture. Kandidat
            lipatan bersifat eksperimental dan tidak menafsirkan empat Rekha.
          </p>
        </div>
        <div className="text-xs text-stone-500 md:text-right">
          <p>{capture.original.width} x {capture.original.height} piksel</p>
          <p>Estimasi model: {capture.handedness ?? "tidak diketahui"}</p>
          <p>Normalisasi rotasi: {capture.rotationDegrees.toFixed(1)} derajat</p>
        </div>
      </div>

      <PalmLineResultPanel state={lineExtraction} />

      {showDeveloperDiagnostics && (
        <PalmLineLiveDiagnostic capture={capture} state={lineExtraction} />
      )}

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
        <PalmQualityPanel quality={quality} source="captured" />

        <div className="grid items-start gap-4 sm:grid-cols-3">
          <PalmImagePreviewCard
            image={capture.original}
            label="ROI Asli"
            description="Piksel langsung dari frame kamera sebagai acuan utama."
          />
          <PalmImagePreviewCard
            image={capture.grayscale}
            label="Grayscale"
            description="Konversi luminance tanpa penajaman atau pembentukan garis baru."
            processed
          />
          <PalmImagePreviewCard
            image={capture.enhanced}
            label="Enhanced Contrast"
            description="Peningkatan kontras ringan dan terbatas untuk membantu keterbacaan lipatan."
            processed
          />
        </div>
      </div>

      {capture.qualityMode === "manual-override" && (
        <div className="mt-5 rounded-2xl border border-amber-300 bg-amber-50 p-4 text-sm leading-relaxed text-amber-950" role="alert">
          <p className="font-bold">Hasil diambil melalui manual override</p>
          <p className="mt-1">
            Ekstraktor eksperimental dapat tetap berjalan untuk diagnosis, tetapi
            hasilnya tidak dianggap memenuhi syarat validasi lipatan.
          </p>
          {capture.qualityWarnings.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-xs">
              {capture.qualityWarnings.map((warning) => (
                <li key={warning}>{warning}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <p className="mt-5 rounded-2xl bg-stone-50 p-3 text-xs leading-relaxed text-stone-600">
        Kontras ditingkatkan secara linear dan dibatasi tanpa sharpening, agar tidak
        membentuk detail garis baru. Semua buffer akan dibersihkan saat hasil dihapus,
        kamera dihentikan, mode diganti, tab ditinggalkan, atau halaman ditutup.
      </p>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full bg-[#9f3e2f] px-5 py-3 font-bold text-white transition hover:bg-[#7f2f24]"
        >
          <span className="material-symbols-outlined" aria-hidden="true">replay</span>
          Ambil Ulang
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-full border border-stone-300 px-5 py-3 font-bold text-stone-700 transition hover:bg-stone-50"
        >
          <span className="material-symbols-outlined" aria-hidden="true">delete</span>
          Hapus hasil
        </button>
      </div>
    </section>
  );
}
