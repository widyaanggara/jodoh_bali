"use client";

import Link from "next/link";
import { useMemo, useState, type ReactNode } from "react";
import { createCalendarDetailSnapshot, defaultMatchRange, validateMatchRange } from "@/lib/netra-hasta/detail-result";
import type { CombinedNetraResult } from "@/lib/netra-hasta/product-flow";
import { useNetraHastaProduct } from "./NetraHastaProductProvider";
import NetraSavePanel from "./NetraSavePanel";
import NetraAccountActions from "./NetraAccountActions";
import NetraDetailSections from "./NetraDetailSections";
import { useNetraAccount } from "./NetraAccountProvider";
import NetraLoginPanel from "./NetraLoginPanel";
import NetraLockedDetail from "./NetraLockedDetail";
import { useProtectedNetraDetail } from "@/hooks/useProtectedNetraDetail";

function AvailableDetail({ result, inline = false, renderPalmPreview }: { result: CombinedNetraResult; inline?: boolean; renderPalmPreview?: (authorized: boolean) => ReactNode }) {
  const account = useNetraAccount();
  const [range, setRange] = useState(defaultMatchRange);
  const [draft, setDraft] = useState({ startYear: String(range.startYear), endYear: String(range.endYear) });
  const [error, setError] = useState("");
  const calendar = useMemo(() => createCalendarDetailSnapshot(result.birth), [result.birth]);
  const access = useProtectedNetraDetail(result.birth, range, result.rekha.snapshot.captureId);
  const detail = access.detail;
  const rangeForm = (
    <form className="netra-range space-y-3 border" onSubmit={(event) => { event.preventDefault(); try { const next = validateMatchRange({ startYear: Number(draft.startYear), endYear: Number(draft.endYear) }); setRange(next); setError(""); } catch (failure) { setError((failure as Error).message); } }}>
      <h2 className="font-bold">Rentang tahun lahir pasangan</h2><p className="text-xs text-stone-600">Parameter yang diperlukan engine Mencari Jodoh. Default sama dengan fitur existing: tahun ini hingga lima tahun berikutnya. Ubah sesuai rentang yang ingin diperiksa; ini bukan rentang tanggal pernikahan.</p>
      <div className="grid grid-cols-2 gap-3">{(["startYear", "endYear"] as const).map((key) => <div key={key}><label htmlFor={"netra-match-" + key} className="text-xs font-bold">{key === "startYear" ? "Tahun mulai" : "Tahun akhir"}</label><input id={"netra-match-" + key} type="number" min="1900" max="2100" required value={draft[key]} onChange={(event) => setDraft((old) => ({ ...old, [key]: event.target.value }))} className="mt-1 block w-full min-w-0 rounded-xl border border-stone-300 p-2" /></div>)}</div>
      <button type="submit" className="rounded-full border border-[#9f3e2f] px-4 py-2 text-sm font-bold text-[#9f3e2f]">Terapkan rentang</button>{error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    </form>
  );
  return <section className="netra-detail min-w-0 space-y-6">
    {account.uid && <NetraAccountActions />}
    <div className="netra-detail-heading"><span className="netra-beta">Beta / Dalam Pengembangan</span>{inline ? <h2 className="mt-4 font-display text-3xl">Hasil Netra Hasta</h2> : <h1 className="mt-4 font-display">Ramalan Detail</h1>}<p>Otonan dapat dilihat tanpa akun. Masuk untuk membuka hasil pasangan dan analisis Rekha.</p></div>
    <NetraDetailSections sectionGroup="calendar" detail={calendar} candidateStatus={result.rekha.snapshot.candidateStatus} />
    {inline && renderPalmPreview?.(Boolean(detail))}
    <section id="netra-locked-detail" className="space-y-6" aria-label="Hasil lengkap pasangan dan Rekha">
      {detail ? <>{rangeForm}<NetraDetailSections sectionGroup="supporting" candidatePhase={result.rekha.snapshot.phase} detail={detail} candidateStatus={result.rekha.snapshot.candidateStatus} candidateCount={result.rekha.snapshot.candidateCount} rekhaClasses={result.rekha.classes} /></>
        : <NetraLockedDetail busy={access.busy} error={access.error} signedIn={Boolean(account.uid) && !access.reauthenticate} onRetry={access.retry} />}
    </section>
    {(!account.uid || access.reauthenticate) && !account.loading && <section id="netra-detail-login" className="space-y-4" aria-label="Login untuk hasil lengkap"><NetraLoginPanel returnToScan detailAccessRequired forceSignIn={access.reauthenticate} onAuthenticated={access.retry} /><p className="text-xs text-stone-500">Setelah login, tanggal/jam lahir dan rentang tahun dikirim ke server Metemu untuk menghitung hasil lengkap. Tidak disimpan oleh endpoint ini. Foto dan koordinat telapak tetap di perangkat.</p></section>}
    {detail && <NetraSavePanel key={result.rekha.snapshot.captureId + ":" + range.startYear + ":" + range.endYear} result={result} matchRange={range} />}
    {!inline && <Link href="/netra-hasta" className="inline-block underline">Kembali ke hasil dasar</Link>}
  </section>;

}
/** Otonan is public; supporting results require a freshly server-verified account session. */
export default function NetraHastaDetailView({ inline = false, renderPalmPreview }: { inline?: boolean; renderPalmPreview?: (authorized: boolean) => ReactNode } = {}) {
  const { state } = useNetraHastaProduct();
  if (!state.result) return <section className="netra-empty space-y-4"><NetraAccountActions /><h1 className="font-display text-2xl font-bold">Hasil sementara belum tersedia</h1><p>Mulai kembali dari data kelahiran dan pindai telapak, atau buka hasil yang sebelumnya Anda simpan.</p><Link href="/netra-hasta" className="inline-block underline">Mulai Netra Hasta</Link><Link href="/netra-hasta/riwayat" className="ml-4 inline-block underline">Buka riwayat tersimpan</Link></section>;
  return <AvailableDetail key={state.result.rekha.snapshot.captureId} result={state.result} inline={inline} renderPalmPreview={renderPalmPreview} />;
}
