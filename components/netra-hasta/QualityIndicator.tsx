import type {
  GuidanceStatus,
  HandTrackingMetrics,
} from "@/hooks/useHandLandmarker";

interface QualityIndicatorProps {
  guidance: GuidanceStatus;
  metrics: HandTrackingMetrics;
  delegate: "GPU" | "CPU" | null;
  modelError: string | null;
  cameraNotice: string | null;
}

const GUIDANCE_COPY: Record<
  GuidanceStatus,
  { icon: string; title: string; detail: string; tone: string }
> = {
  idle: {
    icon: "photo_camera",
    title: "Kamera belum aktif",
    detail: "Berikan persetujuan untuk memulai pemindaian.",
    tone: "border-stone-200 bg-white text-stone-700",
  },
  loading: {
    icon: "model_training",
    title: "Memuat model AI",
    detail: "Model dan runtime dibaca dari aset lokal Metemu.",
    tone: "border-amber-200 bg-amber-50 text-amber-900",
  },
  searching: {
    icon: "back_hand",
    title: "Arahkan tangan ke kamera",
    detail: "Buka telapak dan letakkan seluruh tangan di dalam garis panduan.",
    tone: "border-sky-200 bg-sky-50 text-sky-900",
  },
  "too-far": {
    icon: "zoom_in",
    title: "Dekatkan tangan",
    detail: "Telapak masih terlalu kecil untuk dipindai dengan stabil.",
    tone: "border-amber-200 bg-amber-50 text-amber-900",
  },
  clipped: {
    icon: "center_focus_strong",
    title: "Pastikan tangan terlihat utuh",
    detail: "Geser tangan agar pergelangan dan ujung jari tidak terpotong.",
    tone: "border-orange-200 bg-orange-50 text-orange-900",
  },
  detected: {
    icon: "check_circle",
    title: "Tangan terdeteksi",
    detail: "Landmark tangan tampil secara langsung. Tahap ini belum membaca garis telapak.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  error: {
    icon: "error",
    title: "Pemrosesan AI berhenti",
    detail: "Hentikan kamera dan coba mulai kembali.",
    tone: "border-red-200 bg-red-50 text-red-900",
  },
};

export default function QualityIndicator({
  guidance,
  metrics,
  delegate,
  modelError,
  cameraNotice,
}: QualityIndicatorProps) {
  const copy = GUIDANCE_COPY[guidance];

  return (
    <div className="space-y-3" aria-live="polite">
      <div className={`rounded-3xl border p-5 ${copy.tone}`}>
        <div className="flex items-start gap-3">
          <span className="material-symbols-outlined mt-0.5" aria-hidden="true">{copy.icon}</span>
          <div>
            <h3 className="font-bold">{copy.title}</h3>
            <p className="mt-1 text-sm leading-relaxed opacity-80">{modelError ?? copy.detail}</p>
          </div>
        </div>
      </div>

      {cameraNotice && guidance === "idle" && (
        <p className="rounded-2xl border border-stone-200 bg-white px-4 py-3 text-sm text-stone-600">
          {cameraNotice}
        </p>
      )}

      {delegate && (
        <div className="grid grid-cols-3 gap-2">
          <Metric label="Tangan" value={String(metrics.handCount)} />
          <Metric label="FPS AI" value={metrics.fps ? metrics.fps.toFixed(1) : "—"} />
          <Metric label="Proses" value={metrics.processingMs ? `${metrics.processingMs.toFixed(1)} ms` : "—"} />
          <p className="col-span-3 text-center text-[11px] text-stone-400">
            Runtime aktif dengan delegate {delegate}
          </p>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-[#c59b3d]/15 bg-white p-3 text-center">
      <p className="text-[10px] font-bold uppercase tracking-widest text-stone-400">{label}</p>
      <p className="mt-1 text-sm font-extrabold text-stone-800">{value}</p>
    </div>
  );
}
