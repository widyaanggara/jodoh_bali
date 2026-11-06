"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { createDetailSnapshot, defaultMatchRange, validateMatchRange } from "@/lib/netra-hasta/detail-result";
import type { CombinedNetraResult } from "@/lib/netra-hasta/product-flow";
import { useNetraHastaProduct } from "./NetraHastaProductProvider";
import NetraSavePanel from "./NetraSavePanel";
import NetraAccountActions from "./NetraAccountActions";
import NetraDetailSections from "./NetraDetailSections";

function AvailableDetail({ result }: { result: CombinedNetraResult }) {
  const [range, setRange] = useState(defaultMatchRange);
  const [draft, setDraft] = useState({ startYear: String(range.startYear), endYear: String(range.endYear) });
  const [error, setError] = useState("");
  const detail = useMemo(() => createDetailSnapshot(result.birth, range), [result.birth, range]);
  return <section className="min-w-0 space-y-5 rounded-3xl bg-white p-4 sm:p-8">
    <NetraAccountActions /><h1 className="font-display text-3xl font-bold">Ramalan Detail · Beta</h1>
    <form className="space-y-3 rounded-2xl border border-stone-200 p-4" onSubmit={(event) => { event.preventDefault(); try { const next = validateMatchRange({ startYear: Number(draft.startYear), endYear: Number(draft.endYear) }); setRange(next); setError(""); } catch (failure) { setError((failure as Error).message); } }}>
      <h2 className="font-bold">Rentang tahun lahir pasangan</h2><p className="text-xs text-stone-600">Parameter yang diperlukan engine Mencari Jodoh. Default sama dengan fitur existing: tahun ini hingga lima tahun berikutnya. Ubah sesuai rentang yang ingin diperiksa; ini bukan rentang tanggal pernikahan.</p>
      <div className="grid grid-cols-2 gap-3">{(["startYear", "endYear"] as const).map((key) => <div key={key}><label htmlFor={"netra-match-" + key} className="text-xs font-bold">{key === "startYear" ? "Tahun mulai" : "Tahun akhir"}</label><input id={"netra-match-" + key} type="number" min="1900" max="2100" required value={draft[key]} onChange={(event) => setDraft((old) => ({ ...old, [key]: event.target.value }))} className="mt-1 block w-full min-w-0 rounded-xl border border-stone-300 p-2" /></div>)}</div>
      <button type="submit" className="rounded-full border border-[#9f3e2f] px-4 py-2 text-sm font-bold text-[#9f3e2f]">Terapkan rentang</button>{error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    </form>
    <NetraDetailSections detail={detail} candidateStatus={result.rekha.snapshot.candidateStatus} candidateCount={result.rekha.snapshot.candidateCount} />
    <NetraSavePanel key={result.rekha.snapshot.captureId + ":" + range.startYear + ":" + range.endYear} result={result} matchRange={range} />
    <Link href="/netra-hasta" className="inline-block underline">Kembali ke hasil dasar</Link>
  </section>;
}
/** Render only beneath the existing server identity boundary. */
export default function NetraHastaDetailView() {
  const { state } = useNetraHastaProduct();
  if (!state.result) return <section className="space-y-4 rounded-3xl bg-white p-6"><NetraAccountActions /><h1 className="font-display text-2xl font-bold">Hasil sementara belum tersedia</h1><p>Mulai kembali dari data kelahiran dan pindai telapak, atau buka hasil yang sebelumnya Anda simpan.</p><Link href="/netra-hasta" className="inline-block underline">Mulai Netra Hasta</Link><Link href="/netra-hasta/riwayat" className="ml-4 inline-block underline">Buka riwayat tersimpan</Link></section>;
  return <AvailableDetail key={state.result.rekha.snapshot.captureId} result={state.result} />;
}
