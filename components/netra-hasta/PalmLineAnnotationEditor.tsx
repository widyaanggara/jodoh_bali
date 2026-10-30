"use client";

import { useEffect, useRef, useState } from "react";
import type {
  ManualPalmLineAnnotation,
  PalmLineLabelStatus,
  PalmLineVisibility,
  PalmVisualClass,
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

const VISUAL_CLASS_OPTIONS: Array<{ value: PalmVisualClass; label: string; color: string }> = [
  { value: "life", label: "LIFE", color: "#22c55e" },
  { value: "head", label: "HEAD", color: "#3b82f6" },
  { value: "heart", label: "HEART", color: "#f43f5e" },
  { value: "fate", label: "FATE", color: "#a855f7" },
  { value: "other", label: "OTHER", color: "#f59e0b" },
  { value: "unknown", label: "UNKNOWN", color: "#94a3b8" },
];

function annotationColor(visualClass: PalmVisualClass): string {
  return VISUAL_CLASS_OPTIONS.find((option) => option.value === visualClass)?.color ?? "#94a3b8";
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
  const [activeVisualClass, setActiveVisualClass] = useState<PalmVisualClass>("life");
  const [activeLabelStatus, setActiveLabelStatus] = useState<PalmLineLabelStatus>("provisional");
  const [activeVisibility, setActiveVisibility] = useState<Extract<PalmLineVisibility, "visible" | "obscured">>("visible");
  const [activeTruncated, setActiveTruncated] = useState(false);

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
      annotations.forEach((annotation) => drawPolyline(
        annotation.points,
        annotationColor(annotation.visualClass),
        Math.max(3, image.width / 240),
      ));
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
        {
          id: `manual-${Date.now()}-${annotations.length + 1}`,
          points: activePoints,
          visualClass: activeVisualClass,
          labelStatus: activeLabelStatus,
          visibility: activeVisibility,
          truncated: activeTruncated,
        },
      ]);
    }
    setActivePoints(null);
  };

  const updateAnnotation = (
    id: string,
    patch: Partial<Pick<ManualPalmLineAnnotation, "visualClass" | "labelStatus" | "visibility" | "truncated">>,
  ) => onChange(annotations.map((annotation) =>
    annotation.id === id ? { ...annotation, ...patch } : annotation));

  const redrawAnnotation = (annotation: ManualPalmLineAnnotation) => {
    setActiveVisualClass(annotation.visualClass);
    setActiveLabelStatus(annotation.labelStatus);
    setActiveVisibility(annotation.visibility);
    setActiveTruncated(annotation.truncated);
    onChange(annotations.filter((item) => item.id !== annotation.id));
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-amber-300 bg-white shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 px-4 py-3">
        <div>
          <p className="font-bold text-stone-900">Editor anotasi manual</p>
          <p className="mt-1 text-xs text-stone-500">Tarik pointer mengikuti lipatan yang benar-benar terlihat. Warna = kelas visual manual, cyan = kandidat otomatis.</p>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => onChange(annotations.slice(0, -1))} disabled={!annotations.length} className="rounded-xl border border-stone-300 px-3 py-2 text-xs font-bold disabled:opacity-40">Urungkan</button>
          <button type="button" onClick={() => onChange([])} disabled={!annotations.length} className="rounded-xl border border-red-200 px-3 py-2 text-xs font-bold text-red-700 disabled:opacity-40">Hapus semua</button>
        </div>
      </div>
      <div className="grid gap-3 border-b border-stone-100 bg-stone-50 p-4 sm:grid-cols-2 xl:grid-cols-4">
        <label className="text-xs font-bold text-stone-600">Kelas visual
          <select value={activeVisualClass} onChange={(event) => setActiveVisualClass(event.target.value as PalmVisualClass)} className="mt-1 block w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm">
            {VISUAL_CLASS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
        </label>
        <label className="text-xs font-bold text-stone-600">Status label
          <select value={activeLabelStatus} onChange={(event) => setActiveLabelStatus(event.target.value as PalmLineLabelStatus)} className="mt-1 block w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm">
            <option value="provisional">Provisional</option>
            <option value="verified">Verified visual</option>
            <option value="ambiguous">Ambiguous</option>
          </select>
        </label>
        <label className="text-xs font-bold text-stone-600">Visibility
          <select value={activeVisibility} onChange={(event) => setActiveVisibility(event.target.value as typeof activeVisibility)} className="mt-1 block w-full rounded-xl border border-stone-300 bg-white px-3 py-2 text-sm">
            <option value="visible">Visible</option>
            <option value="obscured">Obscured/partial</option>
          </select>
        </label>
        <label className="flex items-center gap-2 self-end rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-600">
          <input type="checkbox" checked={activeTruncated} onChange={(event) => setActiveTruncated(event.target.checked)} />
          Terpotong batas ROI
        </label>
      </div>
      <div className="flex flex-wrap gap-2 border-b border-stone-100 px-4 py-3 text-[10px] font-bold">
        {VISUAL_CLASS_OPTIONS.map((option) => <span key={option.value} className="inline-flex items-center gap-1.5 rounded-full bg-stone-50 px-2 py-1 text-stone-600"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: option.color }} />{option.label}</span>)}
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
      {annotations.length > 0 && (
        <div className="space-y-2 border-t border-stone-100 p-4">
          <p className="text-xs font-bold text-stone-700">Edit polyline manual</p>
          {annotations.map((annotation) => (
            <div key={annotation.id} className="grid items-center gap-2 rounded-2xl border border-stone-200 p-2 text-xs sm:grid-cols-[1fr_repeat(3,minmax(7rem,auto))_auto]">
              <span className="truncate font-mono text-[10px] text-stone-500" title={annotation.id}>{annotation.id}</span>
              <select aria-label={`Kelas ${annotation.id}`} value={annotation.visualClass} onChange={(event) => updateAnnotation(annotation.id, { visualClass: event.target.value as PalmVisualClass })} className="rounded-lg border border-stone-200 px-2 py-1.5">
                {VISUAL_CLASS_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <select aria-label={`Status ${annotation.id}`} value={annotation.labelStatus} onChange={(event) => updateAnnotation(annotation.id, { labelStatus: event.target.value as PalmLineLabelStatus })} className="rounded-lg border border-stone-200 px-2 py-1.5">
                <option value="provisional">Provisional</option><option value="verified">Verified</option><option value="ambiguous">Ambiguous</option>
              </select>
              <select aria-label={`Visibility ${annotation.id}`} value={annotation.visibility} onChange={(event) => updateAnnotation(annotation.id, { visibility: event.target.value as ManualPalmLineAnnotation["visibility"] })} className="rounded-lg border border-stone-200 px-2 py-1.5">
                <option value="visible">Visible</option><option value="obscured">Obscured</option>
              </select>
              <div className="flex gap-1">
                <button type="button" onClick={() => updateAnnotation(annotation.id, { truncated: !annotation.truncated })} className={`rounded-lg border px-2 py-1.5 font-bold ${annotation.truncated ? "border-orange-300 bg-orange-50 text-orange-800" : "border-stone-200"}`}>Truncated</button>
                <button type="button" onClick={() => redrawAnnotation(annotation)} className="rounded-lg border border-sky-200 px-2 py-1.5 font-bold text-sky-800">Gambar ulang</button>
                <button type="button" onClick={() => onChange(annotations.filter((item) => item.id !== annotation.id))} className="rounded-lg border border-red-200 px-2 py-1.5 font-bold text-red-700">Hapus</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <p className="border-t border-stone-100 px-4 py-2 text-center text-xs text-stone-500">{annotations.length} polyline manual · koordinat ROI {image.width} × {image.height}</p>
    </div>
  );
}
