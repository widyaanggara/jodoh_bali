"use client";

import Link from "next/link";
import { UNKNOWN_BIRTH_TIME_NOTICE } from "@/lib/netra-hasta/product-flow";
import { useNetraHastaProduct } from "./NetraHastaProductProvider";
import NetraSavePanel from "./NetraSavePanel";
import NetraAccountActions from "./NetraAccountActions";

/** Render only beneath the server account boundary, never a client login toggle. */
export default function NetraHastaDetailView() {
  const { state } = useNetraHastaProduct();
  const result = state.result;
  if (!result) return <section className="space-y-4 rounded-3xl bg-white p-6"><NetraAccountActions /><h1 className="font-display text-2xl font-bold">Hasil sementara belum tersedia</h1><p>Mulai kembali dari data kelahiran dan pindai telapak, atau buka hasil yang sebelumnya Anda simpan.</p><Link href="/netra-hasta" className="inline-block underline">Mulai Netra Hasta</Link><Link href="/netra-hasta/riwayat" className="ml-4 inline-block underline">Buka riwayat tersimpan</Link></section>;
  const otonan = result.otonan.data;
  return (
    <section className="space-y-5 rounded-3xl bg-white p-5 sm:p-8">
      <NetraAccountActions /><h1 className="font-display text-3xl font-bold">Ramalan Detail · Beta</h1>
      {!result.birth.time && <p className="rounded-2xl bg-amber-50 p-3 text-sm leading-relaxed text-amber-950">{UNKNOWN_BIRTH_TIME_NOTICE}</p>}
      <div><h2 className="font-bold">Otonan existing · Wuku {otonan.wuku.nama_wuku}</h2><p className="mt-2 text-sm leading-relaxed">{otonan.wuku.sifat_umum}</p></div>
      {otonan.lintang && <div><h2 className="font-bold">Lintang {otonan.lintang.lintang}</h2><p className="mt-2 text-sm leading-relaxed">{otonan.lintang.penjelasan}</p></div>}
      <div><h2 className="font-bold">Ketersediaan Rekha</h2><ul className="mt-2 space-y-2 text-sm">{result.rekha.classes.map((line) => <li key={line.name}><strong className="capitalize">{line.name}</strong>: belum didukung. {line.reason}</li>)}</ul></div>
      <p className="rounded-2xl bg-amber-50 p-4 text-sm">Interpretasi simbolis dari data existing, bukan validasi ilmiah atau budaya terhadap kandidat garis otomatis.</p>
      <NetraSavePanel key={result.rekha.snapshot.captureId} result={result} />
      <Link href="/netra-hasta" className="inline-block underline">Kembali ke hasil dasar</Link>
    </section>
  );
}
