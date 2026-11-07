import type { ReactNode } from "react";
import type { DetailSnapshot } from "@/lib/netra-hasta/detail-result";
import { getLabelRezeki } from "@/lib/pal-sri-sedana";
import { UNKNOWN_BIRTH_TIME_NOTICE } from "@/lib/netra-hasta/product-flow";

function Section({ title, children, open = false }: { title: string; children: ReactNode; open?: boolean }) {
  return <details open={open} className="netra-disclosure min-w-0 border bg-white"><summary className="cursor-pointer break-words p-4 font-display text-xl font-bold focus-visible:outline-2 focus-visible:outline-[#9f3e2f]">{title}</summary><div className="netra-disclosure-body space-y-4 border-t border-stone-100 text-sm">{children}</div></details>;
}
function Info({ label, value }: { label: string; value: ReactNode }) {
  return <div className="netra-info min-w-0"><dt className="text-xs text-stone-500">{label}</dt><dd className="mt-1 break-words font-medium">{value}</dd></div>;
}
export default function NetraDetailSections({ detail, candidateStatus, candidateCount, saved = false }: {
  detail: DetailSnapshot; candidateStatus: "automatic_candidate" | "uncertain"; candidateCount?: number; saved?: boolean;
}) {
  const { calendar: c, zodiac: z, matches, pal, birth } = detail;
  return <div className="netra-details">
    <section aria-label="Identitas hasil" className="netra-result-identity">
      <h2 className="font-display text-2xl font-bold">Kelahiran {birth.date}</h2>
      <p className="mt-2 text-sm">{birth.time ? birth.time + " waktu setempat" : "Jam lahir tidak diketahui"} · {saved ? "Snapshot saat disimpan" : "Hasil sementara"}</p>
      <p className="mt-2 text-xs text-stone-500">Dihitung {detail.generatedAt.slice(0, 10)}. Otonan berikutnya dan periode usia mengikuti waktu penghitungan ini.</p>
      {!birth.time && <p className="mt-3 rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{UNKNOWN_BIRTH_TIME_NOTICE}</p>}
    </section>
    <section className="netra-result-summary border">
      <h2 className="font-display text-xl font-bold">Ringkasan interpretasi simbolis</h2>
      <p className="mt-2 text-sm leading-relaxed">{c.saptawara.hari} · {c.pancawara.nama} · Wuku {c.wuku.nama_wuku}{c.lintang ? " · Lintang " + c.lintang.lintang : ""}.</p>
      <p className="mt-2 text-sm leading-relaxed">{c.wuku.sifat_umum}</p>
      <p className="mt-3 text-xs text-stone-600">Teks berasal dari sumber existing Metemu. Interpretasi simbolis ini bukan asesmen ilmiah, bukti kecocokan nyata, atau tafsir dari garis telapak.</p>
    </section>
    <Section title="Ramalan Otonan lengkap" open>
      <dl className="grid gap-3 sm:grid-cols-2">
        <Info label="Saptawara" value={c.saptawara.hari} /><Info label="Pancawara" value={c.pancawara.nama} />
        <Info label="Wuku" value={c.wuku.nama_wuku} /><Info label="Otonan berikutnya saat penghitungan" value={c.nextOtonan ?? "Belum tersedia"} />
        <Info label="Total Urip (Mod 5)" value={c.totalUrip} /><Info label="Total Urip (Mod 16)" value={c.totalUripSodasaRsi} />
      </dl>
      <Section title="Lintang kelahiran" open>{c.lintang ? <>
        <h3 className="font-bold">Lintang {c.lintang.lintang}</h3><p className="italic">{c.lintang.label}</p>
        <p><strong>Penyimbolan:</strong> {c.lintang.makna}</p><p><strong>Karakter & keberuntungan:</strong> {c.lintang.penjelasan}</p>
      </> : <p>Lintang belum tersedia pada engine existing.</p>}</Section>
      <Section title="Zodiak" open><h3 className="font-bold">{z.nama}</h3><dl className="grid gap-3 sm:grid-cols-2">
        <Info label="Elemen" value={z.elemen} /><Info label="Hari hoki" value={z.hariHoki} />
        <Info label="Warna hoki" value={z.warnaHoki} /><Info label="Angka hoki" value={z.angkaHoki.join(", ")} />
      </dl><p><strong>Sifat karakter:</strong> {z.sifat}</p></Section>
      <Section title="Pal Sri Sedana" open>{pal ? <>
        <h3 className="font-bold">Grafik Nasib Pal Sri Sedana</h3><p>Siklus sumber dalam periode 6 tahunan, ditampilkan sampai usia 108 tahun. Tinggi batang menunjukkan nilai simbolis 0–8; nilai nol tetap nol.</p>
        <div className="flex h-32 items-end gap-1 overflow-hidden" role="img" aria-label="Grafik siklus Pal Sri Sedana usia 0 sampai 108 tahun">
          {Array.from({ length: 18 }, (_, i) => { const value = pal.data.siklus[i % pal.data.siklus.length]; return <div key={i} className="flex min-w-0 flex-1 flex-col justify-end text-center"><span className="text-[9px]">{value}</span><div className="border border-stone-300" style={{ height: value * 11, backgroundColor: getLabelRezeki(value).color }} /><span className="mt-1 text-[8px]">{i * 6}</span></div>; })}
        </div>
        <details><summary className="cursor-pointer font-bold">Tabel nilai dan keterangan siklus</summary><div className="mt-2 max-h-80 overflow-y-auto"><table className="w-full text-left text-xs"><thead><tr><th className="p-2">Usia</th><th className="p-2">Nilai</th><th className="p-2">Keterangan sumber</th></tr></thead><tbody>{Array.from({ length: 18 }, (_, i) => { const value = pal.data.siklus[i % pal.data.siklus.length]; const label = getLabelRezeki(value); return <tr key={i} className="border-t border-stone-100"><td className="p-2">{i * 6}–{(i + 1) * 6}</td><td className="p-2">{value}</td><td className="p-2"><strong>{label.label}</strong><br />{label.desc}</td></tr>; })}</tbody></table></div></details>
        <h3 className="font-bold">Analisis periode saat penghitungan</h3><p>Usia {pal.analysis.currentAge} tahun · periode {pal.analysis.periodIndex * 6}–{(pal.analysis.periodIndex + 1) * 6} tahun · nilai {pal.analysis.value}</p>
        <p className="font-bold">{pal.label.label}</p><p>{pal.label.desc}</p><p className="italic">{pal.analysis.interpretation}</p>
      </> : <p>Data Pal Sri Sedana tidak tersedia untuk Urip {c.totalUrip}.</p>}</Section>
      <Section title="Rincian kalender dan Wuku">
        <dl className="grid gap-3 sm:grid-cols-2">{Object.entries(c.wewaran ?? {}).map(([key, value]) => <Info key={key} label={key} value={value} />)}</dl>
        <p>{c.wuku.deskripsi}</p><p><strong>Kelebihan:</strong> {c.wuku.kelebihan}</p><p><strong>Kelemahan:</strong> {c.wuku.kelemahan}</p><p><strong>Rekomendasi pasangan Wuku:</strong> {c.wuku.rekomendasi_pasangan.join(", ")}</p>
        <p><strong>Sifat Saptawara:</strong> {c.saptawara.sifat}</p><p>{c.saptawara.karakter}</p><p><strong>Karakter Pancawara:</strong> {c.pancawara.karakter}</p>
        {c.sadwara && <p><strong>Sadwara {c.sadwara.nama}:</strong> {c.sadwara.arti} {c.sadwara.sifat} {c.sadwara.pesan}</p>}
      </Section>
    </Section>
    <Section title="Mencari Jodoh — 3 hasil teratas" open>
      <p>Rekomendasi <strong>tanggal lahir pasangan</strong>, bukan tanggal pernikahan. Rentang {matches.range.startYear}–{matches.range.endYear}; semua bulan.</p>
      <p className="text-xs text-stone-600">Urutan mengikuti engine existing: tanggal menaik yang lolos Hybrid Score ≥95. Nomor menunjukkan urutan hasil, bukan ranking orang atau jaminan kecocokan.</p>
      <ol className="netra-match-list">{matches.top.map((match) => <li key={match.date} className="netra-match-card border">
        <h3 className="font-bold">Urutan {match.rank} · {match.date}</h3><p className="mt-1">Wuku {match.wuku} · {match.pancawara} · {match.saptawara}</p>
        <p className="mt-2 font-bold">{match.category} · {match.hybridStatus} · Hybrid Score {match.hybridScore}%</p>
        <p className="mt-2">{match.meaning}</p><p className="mt-1">{match.mod16Label}: {match.mod16Meaning}</p>
      </li>)}</ol>
      {matches.top.length < 3 && <p role="status">Hanya {matches.top.length} hasil tersedia karena engine tidak menemukan tiga tanggal yang memenuhi syarat pada rentang ini.</p>}
      <p className="text-xs text-stone-500">{matches.totalFound} tanggal memenuhi syarat; ditampilkan paling banyak tiga hasil pertama. Nilai simbolis existing bukan probabilitas ilmiah.</p>
    </Section>
    <Section title="Analisis Rekha dan statusnya" open>
      <p>{candidateStatus === "automatic_candidate" ? (candidateCount === undefined ? "Kandidat lipatan otomatis tercatat saat scan." : candidateCount + " segmen kandidat otomatis tersedia.") : "Kandidat lipatan belum dapat dipastikan atau detektor memilih abstain."} Sumber: browser, dark-ridge-v1; belum tervalidasi.</p>
      <ul className="netra-rekha-grid grid gap-3 sm:grid-cols-2">{["Heart", "Head", "Life", "Fate"].map((name) => <li key={name} className="rounded-xl bg-stone-50 p-3"><strong>{name}</strong> · belum didukung{ name === "Fate" ? ". Model riset existing juga belum memiliki kelas Fate." : ". Browser belum mengklasifikasikan kelas ini dan belum ada hasil pengguna yang tervalidasi."}</li>)}</ul>
      <p className="text-xs text-stone-600">Tidak ada garis manual yang diklaim otomatis, gambar atau koordinat yang disimpan, maupun tafsir empat Rekha yang dibuat.</p>
    </Section>
  </div>;
}
