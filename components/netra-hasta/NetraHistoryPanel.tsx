"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useNetraAccount } from "./NetraAccountProvider";
import NetraAccountActions from "./NetraAccountActions";
import type { HistoryRecord } from "@/lib/netra-hasta/history";

export default function NetraHistoryPanel() {
  const account = useNetraAccount();
  const [records, setRecords] = useState<HistoryRecord[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    void fetch("/api/netra-hasta/history", { cache: "no-store", signal: controller.signal }).then(async (response) => {
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Riwayat belum dapat dibaca.");
      setRecords(data.records); setCursor(data.nextCursor);
    }).catch((failure) => { if (!controller.signal.aborted) setError(failure.message); });
    return () => controller.abort();
  }, [account.uid]);
  return (
    <section className="space-y-5 rounded-3xl bg-white p-5 sm:p-8">
      <h1 className="font-display text-3xl font-bold">Riwayat Netra Hasta</h1>
      <NetraAccountActions />
      <p className="text-sm text-stone-600">Hanya data yang Anda simpan dengan persetujuan. Data tersimpan hingga Anda menghapusnya. Tidak ada citra telapak atau koordinat biometrik.</p>
      {!records.length && !error && <p className="text-sm">Belum ada hasil tersimpan atau riwayat sedang dimuat.</p>}
      {records.filter((record) => record.ownerUid === account.uid).map((record) => <article key={record.id} className="space-y-2 rounded-2xl border border-stone-200 p-4">
        <h2 className="font-bold">Wuku {record.wuku} · {record.birthDate}</h2>
        <p className="text-sm">{record.saptawara} · {record.pancawara} · {record.birthTime || "Jam lahir tidak diketahui"}</p>
        <p className="break-words text-xs text-stone-500">Disimpan {new Date(record.savedAt).toLocaleString("id-ID")}</p>
        <div className="flex flex-wrap gap-4 text-sm"><Link href={"/netra-hasta/riwayat/" + record.id} className="underline">Buka hasil</Link><button type="button" disabled={Boolean(deleting)} onClick={() => setDeleting(record.id)} className="text-red-800 underline">Hapus</button></div>
        {deleting === record.id && <div className="rounded-xl bg-red-50 p-3 text-sm" role="alert"><p>Hapus hasil ini dari database akun Anda?</p><div className="mt-2 flex gap-4"><button type="button" disabled={busy} className="font-bold text-red-800 underline" onClick={async () => { setBusy(true); setError(""); try { const response = await fetch("/api/netra-hasta/history/" + record.id, { method: "DELETE" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setRecords((old) => old.filter((r) => r.id !== record.id)); setDeleting(null); } catch (failure) { setError((failure as Error).message); } finally { setBusy(false); } }}>Ya, hapus</button><button type="button" disabled={busy} onClick={() => setDeleting(null)} className="underline">Batal</button></div></div>}
      </article>)}
      {cursor && <button type="button" disabled={busy} onClick={async () => { setBusy(true); try { const response = await fetch("/api/netra-hasta/history?cursor=" + encodeURIComponent(cursor), { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setRecords((old) => [...old, ...data.records.filter((r: HistoryRecord) => !old.some((item) => item.id === r.id))]); setCursor(data.nextCursor); } catch (failure) { setError((failure as Error).message); } finally { setBusy(false); } }} className="rounded-full border px-4 py-2 text-sm">Muat riwayat berikutnya</button>}
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
      <Link href="/netra-hasta" className="inline-block text-sm underline">Mulai pindai baru</Link>
    </section>
  );
}
