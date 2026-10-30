"use client";

import { useEffect, useRef } from "react";
import type { RgbaImage } from "@/lib/netra-hasta/palm-preprocessing";

interface PalmImagePreviewCardProps {
  image: RgbaImage;
  label: string;
  description: string;
  processed?: boolean;
}

export default function PalmImagePreviewCard({
  image,
  label,
  description,
  processed = false,
}: PalmImagePreviewCardProps) {
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
