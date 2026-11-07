"use client";

import Link from "next/link";
import RekhaStatusList from "./RekhaStatusList";
import { UNKNOWN_BIRTH_TIME_NOTICE, type CombinedNetraResult } from "@/lib/netra-hasta/product-flow";

export default function NetraHastaBasicResult({ result, onReset }: { result: CombinedNetraResult; onReset: () => void }) {
  const { data } = result.otonan;
  const snapshot = result.rekha.snapshot;
  return (
    <section aria-labelledby="netra-basic-heading" className="netra-basic">
      <p className="netra-section-kicker">Hasil dasar · Tanpa login</p>
      <h2 id="netra-basic-heading" className="mt-2 font-display text-2xl font-bold">Kalender kelahiran dan pindai telapak</h2>
      {!result.birth.time && <p className="mt-4 rounded-2xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">{UNKNOWN_BIRTH_TIME_NOTICE}</p>}
      <dl className="mt-5 grid grid-cols-1 gap-3 min-[390px]:grid-cols-2 lg:grid-cols-4">
        {[["Saptawara", data.saptawara.hari], ["Pancawara", data.pancawara.nama], ["Wuku", data.wuku.nama_wuku], ["Lintang", data.lintang?.lintang ?? "Belum tersedia"]].map(([title, value]) => (
          <div key={title} className="min-w-0 rounded-2xl bg-[#fffaf0] p-4"><dt className="text-xs text-stone-600">{title}</dt><dd className="mt-1 break-words font-bold">{value}</dd></div>
        ))}
      </dl>
      <div role="status" aria-live="polite" className="mt-4 rounded-2xl border border-stone-200 p-4 text-sm leading-relaxed">
        <p className="font-bold">Telapak berhasil diambil · {snapshot.width} × {snapshot.height} px</p>
        {snapshot.phase === "processing" ? <p className="mt-1">Kandidat lipatan sedang diproses lokal.</p> : snapshot.phase === "error" ? <p className="mt-1">Kandidat belum dapat diproses. Hasil kalender tetap tersedia. Silakan ambil ulang.</p> : <p className="mt-1">{snapshot.candidateStatus === "automatic_candidate" ? String(snapshot.candidateCount) + " segmen kandidat otomatis ditemukan." : "Detektor belum menemukan kandidat yang memadai (abstain)."} Hasil ini masih eksperimental.</p>}
        <p className="mt-2 text-stone-600">Heart, Head, Life, dan Fate belum diklasifikasikan oleh detektor browser. Belum tersedia tafsir Rekha.</p>
        {snapshot.qualityMode === "manual-override" && <p className="mt-2 font-medium text-amber-900">Capture manual dengan peringatan kualitas; kandidat tidak dianggap tervalidasi.</p>}
      </div>
      <div className="mt-5"><RekhaStatusList classes={result.rekha.classes} /></div>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link href="/netra-hasta/detail" prefetch={false} className="inline-flex justify-center rounded-full bg-[#9f3e2f] px-5 py-3 text-center font-bold text-white hover:bg-[#7f2f24]">Buka Ramalan Detail</Link>
        <button type="button" onClick={onReset} className="cursor-pointer rounded-full border border-stone-300 px-5 py-3 font-bold">Mulai ulang</button>
      </div>
      <p className="mt-3 text-xs leading-relaxed text-stone-600">Akses detail memerlukan login akun Firebase. Menyimpan hasil memerlukan persetujuan terpisah. Hasil dasar tetap gratis dan tersedia tanpa akun.</p>
    </section>
  );
}
