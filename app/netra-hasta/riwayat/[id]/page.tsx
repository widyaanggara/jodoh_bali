import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetraAccountActions from "@/components/netra-hasta/NetraAccountActions";
import NetraOwnedContent from "@/components/netra-hasta/NetraOwnedContent";
import { getNetraAccountAccess } from "@/lib/netra-hasta/account-access.server";
import { getHistory } from "@/lib/netra-hasta/history.server";
import { AccountError } from "@/lib/netra-hasta/firebase-identity.server";
import { calculateBirthCalendar, UNKNOWN_BIRTH_TIME_NOTICE } from "@/lib/netra-hasta/product-flow";

export const dynamic = "force-dynamic";
export default async function SavedNetraPage({ params }: { params: Promise<{ id: string }> }) {
  const account = await getNetraAccountAccess();
  if (account.kind !== "authenticated") redirect("/netra-hasta/akses-detail");
  let record = null;
  let error = "";
  try { record = await getHistory(account, (await params).id); }
  catch (failure) { error = failure instanceof AccountError ? failure.message : "Hasil belum dapat dibaca."; }
  if (!error && !record) notFound();
  const calendar = record ? calculateBirthCalendar({ date: record.birthDate, time: record.birthTime }) : null;
  return <div className="min-h-screen bg-[#fbf6ea] text-stone-800"><Header /><main className="mx-auto max-w-4xl px-4 py-10"><NetraOwnedContent ownerUid={account.uid}><section className="space-y-4 rounded-3xl bg-white p-5 sm:p-8"><h1 className="font-display text-3xl font-bold">Hasil tersimpan</h1><NetraAccountActions />
    {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    {record && <><p>{record.birthDate} · {record.birthTime ? record.birthTime + " waktu setempat" : "Jam lahir tidak diketahui"}</p>{!record.birthTime && <p className="rounded-xl bg-amber-50 p-3 text-sm">{UNKNOWN_BIRTH_TIME_NOTICE}</p>}<h2 className="text-xl font-bold">{record.saptawara} · {record.pancawara} · Wuku {record.wuku}</h2><p>Lintang: {record.lintang || "Belum tersedia"}</p>{calendar && <><p className="text-sm leading-relaxed">{calendar.wuku.sifat_umum}</p>{calendar.lintang && <p className="text-sm leading-relaxed">{calendar.lintang.penjelasan}</p>}</>}<p className="text-sm">Kandidat otomatis: {record.rekhaStatus === "automatic_candidate" ? "pernah tersedia; belum tervalidasi" : "belum dapat dipastikan"}. Heart, Head, Life, dan Fate belum diklasifikasikan. Citra dan koordinat tidak disimpan.</p><p className="text-xs text-stone-600">Metode {record.algorithmVersion}; kalender {record.calendarVersion}. Interpretasi simbolis, bukan asesmen ilmiah atau tafsir Rekha tervalidasi.</p></>}
    <Link href="/netra-hasta/riwayat" className="inline-block underline">Kembali ke riwayat dan penghapusan</Link>
  </section></NetraOwnedContent></main><Footer /></div>;
}
