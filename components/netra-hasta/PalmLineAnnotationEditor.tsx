"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ManualPalmLineAnnotation,
  PalmLineCandidate,
  PalmLinePoint,
} from "@/lib/netra-hasta/palm-line-extraction";
import type { RgbaImage } from "@/lib/netra-hasta/palm-preprocessing";

interface PalmLineAnnotationEditorProps {
  image: RgbaImage;
  candidates: PalmLineCandidate[];
  annotations: ManualPalmLineAnnotation[];
  showCandidates: boolean;
  showAnnotations: boolean;
  onChange: (annotations: ManualPalmLineAnnotation[]) => void;
}

export default function PalmLineAnnotationEditor({
  image,
  candidates,
  annotations,
  showCandidates,
  showAnnotations,
  onChange,
}: PalmLineAnnotationEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activePoints, setActivePoints] = useState<PalmLinePoint[] | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    canvas.width = image.width;
    canvas.height = image.height;
    context.putImageData(new ImageData(new Uint8ClampedArray(image.data), image.width, image.height), 0, 0);

    const drawPolyline = (points: PalmLinePoint[], color: string, width: number) => {
      if (points.length < 2) return;
      context.beginPath();
      context.moveTo(points[0].x, points[0].y);
      points.slice(1).forEach((point) => context.lineTo(point.x, point.y));
      context.strokeStyle = color;
      context.lineWidth = width;
      context.lineCap = "round";
      context.lineJoin = "round";
      context.stroke();
    };

    if (showCandidates) {
      candidates.forEach((candidate) => drawPolyline(candidate.points, "#00ffff", Math.max(2, image.width / 320)));
    }
    if (showAnnotations) {
      annotations.forEach((annotation) => drawPolyline(annotation.points, "#facc15", Math.max(3, image.width / 240)));
    }
    if (activePoints) drawPolyline(activePoints, "#fb7185", Math.max(3, image.width / 240));
  }, [activePoints, annotations, candidates, image, showAnnotations, showCandidates]);

  const pointFromEvent = (event: React.PointerEvent<HTMLCanvasElement>): PalmLinePoint => {
    const canvas = event.currentTarget;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(image.width - 1, ((event.clientX - bounds.left) / bounds.width) * image.width)),
      y: Math.max(0, Math.min(image.height - 1, ((event.clientY - bounds.top) / bounds.height) * image.height)),
    };
  };

  const finishLine = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activePoints) return;
    event.currentTarget.releasePointerCapture(event.pointerId);
    if (activePoints.length >= 2) {
      onChange([
        ...annotations,
        { id: `manual-${Date.now()}-${annotations.length + 1}`, points: activePoints },
      ]);
    }
    setActivePoints(null);
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-amber-300 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
        <div>
          <p className="font-bold text-stone-900">Editor anotasi manual</p>
          <p className="mt-1 text-xs text-stone-500">Tarik pointer mengikuti lipatan yang benar-benar terlihat. Kuning = manual, cyan = kandidat otomatis.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onChange(annotations.slice(0, -1))} disabled={!annotations.length} className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold disabled:opacity-40">Urungkan</button>
          <button type="button" onClick={() => onChange([])} disabled={!annotations.length} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-40">Hapus semua</button>
        </div>
      </div>
      <div className="flex min-h-72 items-center justify-center bg-stone-950 p-2">
        <canvas
          ref={canvasRef}
          aria-label="Editor anotasi garis telapak"
          className="block h-auto max-h-[46rem] w-full max-w-full touch-none cursor-crosshair"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            setActivePoints([pointFromEvent(event)]);
          }}
          onPointerMove={(event) => {
            if (!activePoints || !event.currentTarget.hasPointerCapture(event.pointerId)) return;
            const next = pointFromEvent(event);
            const previous = activePoints[activePoints.length - 1];
            if (Math.hypot(next.x - previous.x, next.y - previous.y) >= Math.max(2, image.width / 300)) {
              setActivePoints([...activePoints, next]);
            }
          }}
          onPointerUp={finishLine}
          onPointerCancel={() => setActivePoints(null)}
        />
      </div>
      <p className="border-t border-stone-100 px-4 py-2 text-center text-xs text-stone-500">{annotations.length} polyline manual · koordinat ROI {image.width} × {image.height}</p>
    </div>
  );
}
