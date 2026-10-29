"use client";

import { useMemo, useRef, useState } from "react";
import PalmImagePreviewCard from "./PalmImagePreviewCard";
import PalmLineAnnotationEditor from "./PalmLineAnnotationEditor";
import {
  PALM_INTERIOR_EXPERIMENT_VERSION,
  PALM_LINE_EXTRACTION_VERSION,
  PALM_LINE_PARAMETER_VERSION,
  type ManualPalmLineAnnotation,
} from "@/lib/netra-hasta/palm-line-extraction";
import {
  PALM_GROUND_TRUTH_FORMAT,
  PALM_GROUND_TRUTH_VERSION,
  evaluatePalmGroundTruth,
  parsePalmAnnotationDocument,
  resolveAnnotationCompatibility,
  type PalmAnnotationCompleteness,
  type PalmGroundTruthAnnotation,
} from "@/lib/netra-hasta/palm-ground-truth";
import type { PalmLineLiveState } from "@/lib/netra-hasta/palm-line-live";
import type { PalmCapture } from "@/lib/netra-hasta/palm-preprocessing";
import { PALM_ROI_ALGORITHM_VERSION } from "@/lib/netra-hasta/palm-roi";

interface PalmLineLiveDiagnosticProps {
  capture: PalmCapture;
  state: PalmLineLiveState;
}

function formatPercent(value: number | undefined): string {
  return value === undefined ? "-" : `${(value * 100).toFixed(1)}%`;
}

function downloadJson(filename: string, value: unknown): void {
  const blob = new Blob([JSON.stringify(value, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export default function PalmLineLiveDiagnostic({
  capture,
  state,
}: PalmLineLiveDiagnosticProps) {
  const annotationInputRef = useRef<HTMLInputElement>(null);
  const [showCandidates, setShowCandidates] = useState(true);
  const [editorVariant, setEditorVariant] = useState<"baseline" | "interior">("baseline");
  const [annotation, setAnnotation] = useState<PalmGroundTruthAnnotation | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const result = state.phase === "ready" ? state.result : null;

  const reports = useMemo(() => {
    if (!result || !annotation) return null;
    const common = {
      annotation,
      roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
      lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
    };
    return {
      baseline: evaluatePalmGroundTruth({
        ...common,
        candidates: result.baseline.candidates,
        extractionStatus: result.baseline.status,
        abstainReason: result.baseline.reason,
        lineExtractionVersion: PALM_LINE_EXTRACTION_VERSION,
      }),
      interior: evaluatePalmGroundTruth({
        ...common,
        candidates: result.interior.candidates,
        extractionStatus: result.interior.status,
        abstainReason: result.interior.reason,
        lineExtractionVersion: `${PALM_LINE_EXTRACTION_VERSION}+${PALM_INTERIOR_EXPERIMENT_VERSION}`,
      }),
    };
  }, [annotation, result]);

  const updateManualAnnotation = (
    polylines: ManualPalmLineAnnotation[],
    completeness: PalmAnnotationCompleteness = annotation?.completeness ?? "partial",
  ) => {
    if (!result) return;
    setAnnotation({
      sourceVersion: 2,
      sampleId: result.sampleId,
      sampleFingerprint: result.sampleFingerprint,
      roiSignature: result.roiSignature,
      roiWidth: capture.original.width,
      roiHeight: capture.original.height,
      roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
      lineExtractionVersion: PALM_LINE_EXTRACTION_VERSION,
      lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
      status: polylines.length ? "annotated" : "unreviewed",
      completeness,
      compatibility: "exact",
      compatibilityReason: "Anotasi dibuat pada ROI live aktif yang sama.",
      polylines,
    });
    setNotice(polylines.length
      ? "Anotasi berada di memori browser dan belum disimpan."
      : "Anotasi live dibersihkan.");
  };

  const importAnnotation = async (file: File | null) => {
    if (!file || !result) return;
    try {
      const document = parsePalmAnnotationDocument(JSON.parse(await file.text()));
      const candidate = document.samples.find(
        (sample) => sample.sampleFingerprint === result.sampleFingerprint,
      ) ?? document.samples[0];
      if (!candidate) throw new Error("Dokumen anotasi tidak memiliki sampel.");
      const resolved = resolveAnnotationCompatibility(candidate, {
        sampleId: result.sampleId,
        sampleFingerprint: result.sampleFingerprint,
        roiSignature: result.roiSignature,
        roiWidth: capture.original.width,
        roiHeight: capture.original.height,
      }, {
        roiAlgorithmVersion: PALM_ROI_ALGORITHM_VERSION,
        lineExtractionVersion: PALM_LINE_EXTRACTION_VERSION,
        lineParameterVersion: PALM_LINE_PARAMETER_VERSION,
      });
      setAnnotation(resolved);
      setNotice(resolved.compatibility === "exact"
        ? "Anotasi cocok tepat; skor lokal diaktifkan."
        : `Scoring ditolak: ${resolved.compatibilityReason}`);
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Anotasi tidak dapat dibaca.");
    } finally {
      if (annotationInputRef.current) annotationInputRef.current.value = "";
    }
  };

  const exportAnnotation = () => {
    if (!annotation?.polylines.length) return;
    downloadJson("metemu-live-palm-annotation.json", {
      format: PALM_GROUND_TRUTH_FORMAT,
      version: PALM_GROUND_TRUTH_VERSION,
      samples: [{
        sample_id: annotation.sampleId,
        sample_fingerprint: annotation.sampleFingerprint,
        roi_signature: annotation.roiSignature,
        roi_width: annotation.roiWidth,
        roi_height: annotation.roiHeight,
        roi_algorithm_version: annotation.roiAlgorithmVersion,
        line_extraction_version: annotation.lineExtractionVersion,
        line_parameter_version: annotation.lineParameterVersion,
        annotation_status: annotation.status,
        completeness: annotation.completeness,
        polylines: annotation.polylines,
      }],
    });
  };

  const exportDiagnostics = () => {
    if (!result) return;
    downloadJson("metemu-live-palm-diagnostic.json", {
      format: "metemu-live-palm-diagnostic",
      version: 1,
      sample_id: result.sampleId,
      sample_fingerprint: result.sampleFingerprint,
      roi_signature: result.roiSignature,
      roi_resolution: `${capture.original.width}x${capture.original.height}`,
      roi_algorithm_version: PALM_ROI_ALGORITHM_VERSION,
      line_parameter_version: PALM_LINE_PARAMETER_VERSION,
      annotation_compatibility: annotation?.compatibility ?? "unreviewed",
      variants: [result.baseline, result.interior].map((variant) => ({
        variant: variant.version,
        status: variant.status,
        mask_status: variant.maskStatus,
        candidate_count: variant.candidateCount,
        total_length_px: Number(variant.totalLengthPixels.toFixed(2)),
        outside_candidate_count: variant.outsideCandidateCount,
        outside_length_px: variant.outsideLengthPixels === null
          ? null
          : Number(variant.outsideLengthPixels.toFixed(2)),
        processing_ms: Number(variant.processingMs.toFixed(2)),
      })),
      note: "Ekspor eksplisit lokal; tidak memuat gambar atau koordinat kandidat otomatis.",
    });
  };

  return (
    <div className="mt-6 rounded-3xl border border-cyan-200 bg-cyan-50/70 p-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-bold text-cyan-950">Perbandingan kandidat lipatan telapak</p>
            <span className="rounded-full bg-cyan-700 px-2.5 py-1 text-[0.65rem] font-extrabold uppercase tracking-wide text-white">
              Eksperimental · developer
            </span>
          </div>
          <p className="mt-1 max-w-3xl text-xs leading-relaxed text-cyan-900">
            dark-ridge-v1 dan palm-interior-v1 menerima piksel ROI, orientasi, skala,
            dan koordinat yang sama dari satu capture. Palm-interior tetap HOLD dan
            tidak memengaruhi hasil kecocokan.
          </p>
        </div>
        {result && (
          <button type="button" onClick={() => setShowCandidates((current) => !current)} className="shrink-0 rounded-full border border-cyan-300 bg-white px-4 py-2 text-xs font-bold text-cyan-900">
            {showCandidates ? "Sembunyikan kandidat" : "Tampilkan kandidat"}
          </button>
        )}
      </div>

      {state.phase === "processing" && (
        <div className="mt-4 flex items-center gap-3 rounded-2xl bg-white p-4 text-sm text-cyan-950" role="status">
          <span className="material-symbols-outlined animate-spin" aria-hidden="true">progress_activity</span>
          <div><p className="font-bold">Memproses dua varian di background</p><p className="mt-0.5 text-xs">Landmark tidak dideteksi ulang dan loop webcam tidak menjalankan ekstraksi ini.</p></div>
        </div>
      )}
      {state.phase === "error" && (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900" role="alert"><strong>Diagnostik gagal.</strong> {state.reason} Ambil ulang foto untuk mencoba lagi.</div>
      )}

      {result && (
        <>
          <div className="mt-4 grid items-start gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <PalmImagePreviewCard image={capture.original} label="Original ROI" description="Satu referensi piksel untuk kedua varian." />
            {result.interior.interiorMaskMap && <PalmImagePreviewCard image={result.interior.interiorMaskMap} label="Palm interior mask" description={`Mask ${result.interior.maskStatus}; putih = palm-core, gelap = respons ditekan.`} processed />}
            <PalmImagePreviewCard image={result.baseline.ridgeResponseMap} label="Ridge response · baseline" description="Respons dark-ridge-v1 sebelum kandidat final." processed />
            <PalmImagePreviewCard image={result.interior.ridgeResponseMap} label="Ridge response · palm interior" description="Respons yang sama setelah pembobotan mask eksperimen." processed />
            <PalmImagePreviewCard image={showCandidates ? result.baseline.overlay : capture.original} label="Kandidat akhir · baseline" description="Cyan = kandidat dark-ridge-v1." processed={showCandidates} />
            <PalmImagePreviewCard image={showCandidates ? result.interior.overlay : capture.original} label="Kandidat akhir · palm interior" description="Cyan = kandidat palm-interior-v1; belum dipromosikan." processed={showCandidates} />
          </div>

          <div className="mt-4 overflow-x-auto rounded-2xl bg-white p-4">
            <table className="w-full min-w-[46rem] text-xs text-stone-700">
              <thead><tr><th className="pb-2 text-left">Varian</th><th className="pb-2 text-right">Status</th><th className="pb-2 text-right">Kandidat</th><th className="pb-2 text-right">Panjang</th><th className="pb-2 text-right">Di luar palm-core</th><th className="pb-2 text-right">Waktu</th></tr></thead>
              <tbody>{[result.baseline, result.interior].map((variant) => <tr key={variant.variant}><td className="py-1 font-bold">{variant.version}</td><td className="text-right">{variant.status}</td><td className="text-right tabular-nums">{variant.candidateCount}</td><td className="text-right tabular-nums">{variant.totalLengthPixels.toFixed(1)} px</td><td className="text-right tabular-nums">{variant.outsideCandidateCount ?? "-"} · {variant.outsideLengthPixels?.toFixed(1) ?? "-"} px</td><td className="text-right tabular-nums">{variant.processingMs.toFixed(1)} ms</td></tr>)}</tbody>
            </table>
            <p className="mt-3 text-xs text-stone-500">Capture ke seluruh preview: {result.captureToPreviewMs.toFixed(0)} ms. Pengurangan jumlah garis bukan bukti peningkatan akurasi.</p>
          </div>

          {(result.baseline.status === "abstain" || result.interior.status === "abstain") && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-3 text-xs leading-relaxed text-amber-950" role="status">
              <strong>Abstention dipertahankan.</strong> Baseline: {result.baseline.reason ?? "tidak abstain"}. Palm interior: {result.interior.reason ?? "tidak abstain"}.
            </div>
          )}

          <div className="mt-6 border-t border-cyan-200 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="mr-auto font-bold text-cyan-950">Evaluasi ground truth lokal</p>
              {(["baseline", "interior"] as const).map((variant) => <button key={variant} type="button" onClick={() => setEditorVariant(variant)} className={`rounded-xl px-3 py-2 text-xs font-bold ${editorVariant === variant ? "bg-cyan-800 text-white" : "border border-cyan-300 bg-white text-cyan-900"}`}>{variant === "baseline" ? PALM_LINE_EXTRACTION_VERSION : PALM_INTERIOR_EXPERIMENT_VERSION}</button>)}
              <label className="cursor-pointer rounded-xl border border-sky-300 bg-white px-3 py-2 text-xs font-bold text-sky-900">Impor anotasi JSON<input ref={annotationInputRef} type="file" accept="application/json,.json" className="sr-only" onChange={(event) => void importAnnotation(event.target.files?.[0] ?? null)} /></label>
              <button type="button" disabled={!annotation?.polylines.length} onClick={exportAnnotation} className="rounded-xl border border-amber-300 bg-white px-3 py-2 text-xs font-bold text-amber-900 disabled:opacity-40">Ekspor anotasi</button>
              <button type="button" onClick={exportDiagnostics} className="rounded-xl border border-emerald-300 bg-white px-3 py-2 text-xs font-bold text-emerald-900">Ekspor diagnostik</button>
            </div>
            <p className="mt-2 text-xs text-cyan-900">Scoring hanya aktif bila fingerprint, ROI signature, dimensi, dan versi baseline cocok tepat. Tidak ada autosave.</p>
            {notice && <p className="mt-2 rounded-xl bg-white p-3 text-xs text-stone-700">{notice}</p>}

            <div className="mt-4 grid items-start gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(20rem,1fr)]">
              <PalmLineAnnotationEditor image={capture.original} candidates={editorVariant === "baseline" ? result.baseline.candidates : result.interior.candidates} annotations={annotation?.polylines ?? []} showCandidates={showCandidates} showAnnotations onChange={updateManualAnnotation} />
              <div className="space-y-3">
                <div className="rounded-2xl bg-white p-4 text-xs text-stone-700">
                  <p className="font-bold text-stone-950">Kompatibilitas</p>
                  <p className="mt-2">{annotation?.compatibility ?? "belum ada anotasi"}</p>
                  <p className="mt-1 break-words text-stone-500">Fingerprint {result.sampleFingerprint.slice(0, 16)}… · {result.roiSignature}</p>
                  <div className="mt-3 flex gap-2"><button type="button" disabled={!annotation?.polylines.length} onClick={() => updateManualAnnotation(annotation?.polylines ?? [], "partial")} className="rounded-lg border border-amber-300 px-2 py-1 font-bold disabled:opacity-40">Parsial</button><button type="button" disabled={!annotation?.polylines.length} onClick={() => updateManualAnnotation(annotation?.polylines ?? [], "complete")} className="rounded-lg border border-emerald-300 px-2 py-1 font-bold disabled:opacity-40">Lengkap</button></div>
                </div>
                <div className="overflow-x-auto rounded-2xl bg-white p-4">
                  <table className="w-full min-w-[22rem] text-xs"><thead><tr><th className="text-left">Tol.</th><th className="text-right">Baseline C/P/F1</th><th className="text-right">Interior C/P/F1</th></tr></thead><tbody>{[3, 6, 9].map((tolerance) => { const baseline = reports?.baseline.scores.find((score) => score.tolerancePixels === tolerance); const interior = reports?.interior.scores.find((score) => score.tolerancePixels === tolerance); return <tr key={tolerance}><td className="py-1">{tolerance} px</td><td className="text-right">{baseline ? `${formatPercent(baseline.coverage)} / ${formatPercent(baseline.precision)} / ${formatPercent(baseline.f1)}` : "-"}</td><td className="text-right">{interior ? `${formatPercent(interior.coverage)} / ${formatPercent(interior.precision)} / ${formatPercent(interior.f1)}` : "-"}</td></tr>; })}</tbody></table>
                  <p className="mt-3 text-stone-500">{reports?.baseline.reason ?? annotation?.compatibilityReason ?? "Gambar polyline manual untuk memulai evaluasi."}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
