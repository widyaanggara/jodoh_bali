"use client";

import { useEffect, useRef } from "react";
import type {
  PalmCapture,
  RgbaImage,
} from "@/lib/netra-hasta/palm-preprocessing";
import type { PalmQualitySnapshot } from "@/lib/netra-hasta/image-quality";
import PalmQualityPanel from "./PalmQualityPanel";

interface PalmPreviewPanelProps {
  capture: PalmCapture;
  quality: PalmQualitySnapshot;
  onRetry: () => void;
  onDelete: () => void;
}

interface ImageCanvasProps {
  image: RgbaImage;
  label: string;
  description: string;
  processed?: boolean;
}

function ImageCanvas({
  image,
  label,
  description,
  processed = false,
}: ImageCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    canvas.width = image.width;
    canvas.height = image.height;
    context.putImageData(
      new ImageData(new Uint8ClampedArray(image.data), image.width, image.height),
      0,
      0,
    );
    return () => context.clearRect(0, 0, canvas.width, canvas.height);
  }, [image]);

  return (
    <figure className="overflow-hidden rounded-3xl border border-[#c59b3d]/20 bg-white shadow-sm">
      <figcaption className="border-b border-stone-100 px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <p className="font-bold text-stone-800">{label}</p>
          {processed && (
            <span className="shrink-0 rounded-full bg-amber-100 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-amber-900">
              Diproses
            </span>
          )}
        </div>
        <p className="mt-1 text-xs leading-relaxed text-stone-500">{description}</p>
      </figcaption>
      <div className="flex min-h-52 items-center justify-center overflow-hidden bg-stone-950 p-2 sm:min-h-64">
        <canvas
          ref={canvasRef}
          className="block h-auto max-h-[34rem] w-full max-w-full"
          aria-label={label}
        />
      </div>
      <p className="border-t border-stone-100 px-4 py-2 text-center text-xs font-semibold tabular-nums text-stone-500">
        {image.width} x {image.height} piksel
      </p>
    </figure>
  );
}

export default function PalmPreviewPanel({
  capture,
  quality,
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
            Tahap ini belum mendeteksi atau menafsirkan garis telapak.
          </p>
        </div>
        <div className="text-xs text-stone-500 md:text-right">
          <p>{capture.original.width} x {capture.original.height} piksel</p>
          <p>Estimasi model: {capture.handedness ?? "tidak diketahui"}</p>
          <p>Normalisasi rotasi: {capture.rotationDegrees.toFixed(1)} derajat</p>
        </div>
      </div>

      <div className="mt-6 grid items-start gap-5 lg:grid-cols-[minmax(17rem,22rem)_minmax(0,1fr)]">
        <PalmQualityPanel quality={quality} source="captured" />

        <div className="grid items-start gap-4 sm:grid-cols-3">
          <ImageCanvas
            image={capture.original}
            label="ROI Asli"
            description="Piksel langsung dari frame kamera sebagai acuan utama."
          />
          <ImageCanvas
            image={capture.grayscale}
            label="Grayscale"
            description="Konversi luminance tanpa penajaman atau pembentukan garis baru."
            processed
          />
          <ImageCanvas
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
            Gambar ini belum otomatis memenuhi syarat analisis garis tangan pada
            Milestone 3B.
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
          Ulangi pemindaian
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
