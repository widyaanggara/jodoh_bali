import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NetraAccountActions from "@/components/netra-hasta/NetraAccountActions";
import NetraOwnedContent from "@/components/netra-hasta/NetraOwnedContent";
import NetraDetailSections from "@/components/netra-hasta/NetraDetailSections";
import { getNetraAccountAccess } from "@/lib/netra-hasta/account-access.server";
import { getHistory } from "@/lib/netra-hasta/history.server";
import { AccountError } from "@/lib/netra-hasta/firebase-identity.server";
import { createDetailSnapshot, decodeDetailSnapshot } from "@/lib/netra-hasta/detail-result";

export const dynamic = "force-dynamic";
export default async function SavedNetraPage({ params }: { params: Promise<{ id: string }> }) {
  const account = await getNetraAccountAccess();
  if (account.kind !== "authenticated") redirect("/netra-hasta/akses-detail");
  let record = null;
  let error = "";
  try { record = await getHistory(account, (await params).id); }
  catch (failure) { error = failure instanceof AccountError ? failure.message : "Hasil belum dapat dibaca."; }
  if (!error && !record) notFound();
  const birth = record ? { date: record.birthDate, time: record.birthTime } : null;
  // R7 v1 did not retain a search range or time-dependent detail. Never invent a historical top 3.
  const detail = record && birth ? record.detailSnapshot ? decodeDetailSnapshot(record.detailSnapshot, birth) : createDetailSnapshot(birth) : null;
  return <div className="min-h-screen bg-[#fbf6ea] text-stone-800"><Header /><main className="mx-auto max-w-4xl px-4 py-10"><NetraOwnedContent ownerUid={account.uid}><section className="min-w-0 space-y-5 rounded-3xl bg-white p-4 sm:p-8">
    <h1 className="font-display text-3xl font-bold">Hasil tersimpan</h1><NetraAccountActions />
    {error && <p role="alert" className="text-sm text-red-800">{error}</p>}
    {record && !record.detailSnapshot && <p className="rounded-2xl bg-amber-50 p-4 text-sm">Riwayat R7 lama hanya menyimpan ringkasan. Detail di bawah dihitung ulang sekarang dengan rentang default saat ini; ini bukan snapshot top-3 atau periode usia pada waktu penyimpanan lama.</p>}
    {record && detail && <NetraDetailSections detail={detail} candidateStatus={record.rekhaStatus} saved={Boolean(record.detailSnapshot)} />}
    <Link href="/netra-hasta/riwayat" className="inline-block underline">Kembali ke riwayat dan penghapusan</Link>
  </section></NetraOwnedContent></main><Footer /></div>;
}
