import type {
  FaceGuidanceStatus,
  FaceTrackingMetrics,
} from "@/hooks/useFaceLandmarker";
import type { FaceGeometry } from "@/lib/netra-hasta/face-geometry";
import type { VisionDelegate } from "@/lib/netra-hasta/types";

interface FaceTrackingPanelProps {
  guidance: FaceGuidanceStatus;
  metrics: FaceTrackingMetrics;
  geometry: FaceGeometry | null;
  delegate: VisionDelegate | null;
  modelError: string | null;
  cameraNotice: string | null;
}

const GUIDANCE_COPY: Record<
  FaceGuidanceStatus,
  { icon: string; title: string; detail: string; tone: string }
> = {
  idle: {
    icon: "photo_camera",
    title: "Kamera belum aktif",
    detail: "Aktifkan kamera untuk memulai pemetaan wajah.",
    tone: "border-stone-200 bg-white text-stone-700",
  },
  loading: {
    icon: "model_training",
    title: "Memuat model wajah",
    detail: "Model dan runtime dibaca dari aset lokal Metemu.",
    tone: "border-amber-200 bg-amber-50 text-amber-900",
  },
  searching: {
    icon: "face",
    title: "Arahkan wajah ke kamera",
    detail: "Posisikan satu wajah di tengah area panduan.",
    tone: "border-sky-200 bg-sky-50 text-sky-900",
  },
  "too-far": {
    icon: "zoom_in",
    title: "Dekatkan wajah",
    detail: "Wajah masih terlalu kecil untuk pengukuran yang stabil.",
    tone: "border-amber-200 bg-amber-50 text-amber-900",
  },
  "too-close": {
    icon: "zoom_out",
    title: "Jauhkan wajah sedikit",
    detail: "Sisakan ruang di sekeliling kepala agar kontur terlihat utuh.",
    tone: "border-amber-200 bg-amber-50 text-amber-900",
  },
  clipped: {
    icon: "center_focus_strong",
    title: "Pastikan wajah terlihat utuh",
    detail: "Geser posisi agar dahi, dagu, dan sisi wajah tidak terpotong.",
    tone: "border-orange-200 bg-orange-50 text-orange-900",
  },
  tilted: {
    icon: "screen_rotation",
    title: "Hadapkan wajah lurus",
    detail: "Kurangi kemiringan atau arah pandang hingga berada dalam batas ±15°.",
    tone: "border-violet-200 bg-violet-50 text-violet-900",
  },
  ready: {
    icon: "check_circle",
    title: "Posisi wajah sesuai",
    detail: "Mesh dan rasio teknis tampil tanpa menghasilkan interpretasi pribadi.",
    tone: "border-emerald-200 bg-emerald-50 text-emerald-900",
  },
  error: {
    icon: "error",
    title: "Pemrosesan AI berhenti",
    detail: "Hentikan kamera dan coba mulai kembali.",
    tone: "border-red-200 bg-red-50 text-red-900",
  },
};

export default function FaceTrackingPanel({
  guidance,
  metrics,
  geometry,
  delegate,
  modelError,
  cameraNotice,
}: FaceTrackingPanelProps) {
  const copy = GUIDANCE_COPY[guidance];
  const orientation = geometry?.orientation;

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
        <section className="rounded-3xl border border-[#c59b3d]/20 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-lg font-bold text-stone-900">Data teknis wajah</h3>
            <span className="rounded-full bg-[#fbf6ea] px-2.5 py-1 text-[10px] font-bold text-[#9f3e2f]">
              {delegate}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Metric label="Landmark" value={String(metrics.landmarkCount)} />
            <Metric label="FPS AI" value={formatNumber(metrics.fps, 1)} />
            <Metric label="Proses" value={metrics.processingMs ? `${metrics.processingMs.toFixed(1)} ms` : "—"} />
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <Metric label="Lebar relatif" value={formatPercent(geometry?.relativeWidth)} />
            <Metric label="Tinggi relatif" value={formatPercent(geometry?.relativeHeight)} />
            <Metric label="Tinggi : lebar" value={formatNumber(geometry?.heightToWidthRatio, 3)} />
            <Metric label="Posisi kepala" value={guidance === "ready" ? "Sesuai" : "Menyesuaikan"} />
          </div>

          <div className="mt-3 rounded-2xl bg-[#fbf6ea] p-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-stone-500">Proporsi zona wajah</p>
            <div className="mt-2 grid grid-cols-3 gap-2 text-center text-xs">
              <Ratio label="Atas" value={geometry?.upperFaceRatio} />
              <Ratio label="Tengah" value={geometry?.middleFaceRatio} />
              <Ratio label="Bawah" value={geometry?.lowerFaceRatio} />
            </div>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <Metric label="Yaw" value={formatDegrees(orientation?.yaw)} />
            <Metric label="Pitch" value={formatDegrees(orientation?.pitch)} />
            <Metric label="Roll" value={formatDegrees(orientation?.roll)} />
          </div>

          <p className="mt-3 text-[11px] leading-relaxed text-stone-400">
            Rasio dinormalisasi terhadap frame dan bentuk wajah. Sudut adalah estimasi pose, bukan pengukuran fisik absolut atau penilaian pribadi.
          </p>
        </section>
      )}
    </div>
  );
}

function formatNumber(value: number | undefined, digits: number): string {
  return value ? value.toFixed(digits) : "—";
}

function formatPercent(value: number | undefined): string {
  return value ? `${(value * 100).toFixed(1)}%` : "—";
}

function formatDegrees(value: number | undefined): string {
  return value === undefined ? "—" : `${value.toFixed(1)}°`;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#c59b3d]/15 bg-white p-2.5 text-center">
      <p className="truncate text-[9px] font-bold uppercase tracking-wider text-stone-400">{label}</p>
      <p className="mt-1 truncate text-xs font-extrabold text-stone-800">{value}</p>
    </div>
  );
}

function Ratio({ label, value }: { label: string; value: number | undefined }) {
  return (
    <div>
      <p className="font-extrabold text-stone-800">{formatPercent(value)}</p>
      <p className="text-[10px] text-stone-500">{label}</p>
    </div>
  );
}
