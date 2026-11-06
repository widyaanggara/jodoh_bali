"use client";

import Link from "next/link";
import { useState } from "react";
import { historyInputFromResult } from "@/lib/netra-hasta/history";
import type { CombinedNetraResult } from "@/lib/netra-hasta/product-flow";
import { useNetraAccount } from "./NetraAccountProvider";
import type { MatchRange } from "@/lib/netra-hasta/detail-result";

export default function NetraSavePanel({ result, matchRange }: { result: CombinedNetraResult; matchRange?: MatchRange }) {
  const account = useNetraAccount();
  const [consented, setConsented] = useState(false);
  const [busy, setBusy] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);
  const [error, setError] = useState("");
  return (
    <section className="space-y-3 rounded-2xl border border-stone-200 p-4">
      <h2 className="font-bold">Simpan ke riwayat akun</h2>
      <p className="text-sm leading-relaxed text-stone-600">Yang disimpan: tanggal/jam lahir, hasil Otonan lengkap, parameter dan tiga hasil Mencari Jodoh, status/sumber Rekha, versi metode, dan waktu simpan. Snapshot dibekukan oleh server saat Anda menyimpan. Data hanya untuk akun Anda dan tersimpan hingga Anda menghapusnya melalui riwayat. Foto, video, ROI, koordinat, dan template biometrik tidak disimpan.</p>
      {!account.historyEnabled && <p role="status" className="text-sm text-amber-900">Penyimpanan belum diaktifkan. Security rules database perlu dipublikasikan dan diuji terlebih dahulu.</p>}
      <label className="flex items-start gap-3 text-sm"><input type="checkbox" checked={consented} disabled={!account.historyEnabled || busy || Boolean(savedId)} onChange={(event) => setConsented(event.target.checked)} className="mt-1 shrink-0" /><span>Saya menyetujui penyimpanan data tersebut hingga saya menghapusnya.</span></label>
      <button type="button" disabled={!consented || !account.historyEnabled || busy || Boolean(savedId) || result.rekha.snapshot.phase === "processing"} onClick={async () => {
        setBusy(true); setError("");
        try {
          const response = await fetch("/api/netra-hasta/history", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(historyInputFromResult(result, matchRange)) });
          const data = await response.json();
          if (!response.ok || !data.record?.id) throw new Error(data.error ?? "Riwayat belum berhasil disimpan.");
          setSavedId(data.record.id);
        } catch (failure) { setError((failure as Error).message); }
        finally { setBusy(false); }
      }} className="rounded-full bg-[#9f3e2f] px-5 py-3 font-bold text-white disabled:opacity-50">{busy ? "Menyimpan..." : savedId ? "Tersimpan" : "Simpan hasil"}</button>
      {savedId && <p role="status" className="text-sm"><Link href={"/netra-hasta/riwayat/" + savedId} className="underline">Buka hasil tersimpan</Link></p>}
      {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    </section>
  );
}
