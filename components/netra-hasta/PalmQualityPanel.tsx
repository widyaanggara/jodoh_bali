import type {
  PalmQualityCheck,
  PalmQualityReport,
} from "@/lib/netra-hasta/image-quality";

interface PalmQualityPanelProps {
  quality: PalmQualityReport;
  source: "live" | "captured";
}

function compactValue(check: PalmQualityCheck, quality: PalmQualityReport): string {
  if (check.key === "single-hand") return `${check.value ?? "0"} tangan`;
  if (check.key === "roi") return check.passed ? "Valid" : "Tidak valid";
  if (check.key === "stability") return `${quality.stability.sampleCount} frame`;
  return check.value ?? (check.passed ? "Valid" : "Belum ideal");
}

function statusStyle(check: PalmQualityCheck) {
  if (check.passed) {
    return {
      icon: "check_circle",
      row: "border-emerald-100 bg-emerald-50/60",
      iconColor: "text-emerald-600",
      valueColor: "text-emerald-800",
    };
  }
  if (check.gate === "hard") {
    return {
      icon: "block",
      row: "border-red-200 bg-red-50",
      iconColor: "text-red-600",
      valueColor: "text-red-800",
    };
  }
  return {
    icon: "warning",
    row: "border-amber-200 bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-amber-900",
  };
}

export default function PalmQualityPanel({
  quality,
  source,
}: PalmQualityPanelProps) {
  const summaryTone = !quality.hardGatePassed
    ? "border-red-200 bg-red-50 text-red-900"
    : !quality.softGatePassed
      ? "border-amber-200 bg-amber-50 text-amber-950"
      : "border-emerald-200 bg-emerald-50 text-emerald-900";

  return (
    <section className="overflow-hidden rounded-3xl border border-[#c59b3d]/20 bg-white" aria-live={source === "live" ? "polite" : "off"}>
      <div className={`border-b px-4 py-3 ${summaryTone}`}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] opacity-70">
              {source === "live" ? "Parameter live" : "Snapshot saat capture"}
            </p>
            <p className="mt-1 text-sm font-bold leading-snug">{quality.message}</p>
          </div>
          <span className="shrink-0 rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider">
            {!quality.hardGatePassed
              ? "Terblokir"
              : quality.softGatePassed
                ? "Optimal"
                : "Peringatan"}
          </span>
        </div>
      </div>

      <div className="space-y-1.5 p-3">
        {quality.checks.map((check) => {
          const style = statusStyle(check);
          return (
            <div
              key={check.key}
              className={`grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 py-2.5 ${style.row}`}
            >
              <div className="flex min-w-0 items-center gap-2.5">
                <span className={`material-symbols-outlined shrink-0 text-lg ${style.iconColor}`} aria-hidden="true">
                  {style.icon}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-stone-800">{check.label}</p>
                  <p className="text-[9px] font-extrabold uppercase tracking-wider text-stone-400">
                    {check.gate === "hard" ? "Hard Gate" : "Soft Gate"}
                  </p>
                </div>
              </div>
              <p className={`shrink-0 whitespace-nowrap text-right text-xs font-extrabold tabular-nums ${style.valueColor}`}>
                {compactValue(check, quality)}
              </p>
            </div>
          );
        })}
      </div>

      <details className="group border-t border-stone-100">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-xs font-bold text-stone-600 transition hover:bg-stone-50">
          Detail Teknis
          <span className="material-symbols-outlined text-lg transition group-open:rotate-180" aria-hidden="true">
            expand_more
          </span>
        </summary>
        <div className="space-y-2 border-t border-stone-100 bg-stone-50/70 px-4 py-3 text-xs text-stone-600">
          {quality.checks.map((check) => (
            <div key={check.key} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3">
              <span>{check.label}</span>
              <span className="text-right tabular-nums">
                {check.value ?? (check.passed ? "valid" : "gagal")}
                {check.target ? ` / ${check.target}` : ""}
              </span>
            </div>
          ))}
          <div className="border-t border-stone-200 pt-2">
            <p>
              Deviasi posisi: {Number.isFinite(quality.stability.centroidDeviation)
                ? quality.stability.centroidDeviation.toFixed(4)
                : "-"}
            </p>
            <p>
              Deviasi skala: {Number.isFinite(quality.stability.scaleDeviationRatio)
                ? `${(quality.stability.scaleDeviationRatio * 100).toFixed(1)}%`
                : "-"}
            </p>
          </div>
        </div>
      </details>
    </section>
  );
}
