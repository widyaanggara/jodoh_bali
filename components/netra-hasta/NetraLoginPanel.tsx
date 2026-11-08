"use client";

import Link from "next/link";
import NetraIcon from "./NetraIcon";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNetraAccount } from "./NetraAccountProvider";
import { useNetraHastaProduct } from "./NetraHastaProductProvider";

export default function NetraLoginPanel({ returnToScan = false, detailAccessRequired = false, forceSignIn = false, onAuthenticated }: { returnToScan?: boolean; detailAccessRequired?: boolean; forceSignIn?: boolean; onAuthenticated?: () => void } = {}) {
  const account = useNetraAccount();
  const { state, dispatch } = useNetraHastaProduct();
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const scanTarget = detailAccessRequired ? "/netra-hasta#netra-locked-detail" : "/netra-hasta#netra-inline-detail";
  const signedIn = Boolean(account.uid) && !forceSignIn;
  const Heading = returnToScan ? "h3" : "h1";
  return (
    <section className="netra-login">
      <div className="netra-login-intro">
      <NetraIcon name="shield" className="netra-section-symbol" />
      <p className="mt-5 netra-section-kicker">Netra Hasta</p>
      <Heading className="mt-3 font-display text-3xl font-bold">{signedIn ? "Anda sudah masuk" : detailAccessRequired ? (register ? "Daftar untuk melihat hasil lengkap" : "Masuk untuk melihat hasil lengkap") : returnToScan ? (register ? "Daftar untuk menyimpan hasil" : "Masuk untuk menyimpan hasil") : register ? "Daftar untuk membuka detail" : "Masuk untuk membuka detail"}</Heading>
      <p className="mt-4 text-sm leading-relaxed">{detailAccessRequired ? "Otonan tetap terlihat tanpa akun. Masuk untuk membuka hasil pasangan dan analisis Rekha." : returnToScan ? "Otonan dapat dibaca tanpa akun. Hasil pasangan, Rekha, dan penyimpanan memerlukan login." : "Hasil dasar tetap dapat dipakai tanpa akun."} Login diverifikasi oleh Firebase dan server Metemu. Password tidak disimpan oleh Metemu.</p>
      </div><div className="netra-login-content">
      {returnToScan ? <p className="rounded-2xl bg-stone-50 p-3 text-sm">Hasil dan pratinjau masih tersedia sementara di halaman ini. Berpindah tab tidak menghapus hasil. Memuat ulang atau meninggalkan halaman dapat menghapusnya. Penyimpanan memerlukan persetujuan terpisah.</p> : <p className="rounded-2xl bg-stone-50 p-3 text-sm">{state.result ? "Ringkasan pindai masih tersedia di memori. Login pada halaman ini untuk melanjutkan." : "Belum ada hasil pindai di memori. Setelah login, pindai ulang atau buka riwayat yang telah disimpan."} Berpindah tab tidak menghapus hasil sementara. Memuat ulang atau meninggalkan halaman dapat menghapusnya; citra kamera tidak disimpan secara persisten.</p>}
      {account.loading && <p className="mt-4 text-sm" role="status">Memeriksa sesi akun...</p>}
      {account.configured === false && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950" role="alert">{account.configurationMessage}</p>}
      {signedIn ? (
        <div className="mt-5 flex flex-col gap-3">
          <Link href={returnToScan ? scanTarget : state.result ? "/netra-hasta/detail" : "/netra-hasta"} onClick={() => { if (returnToScan) router.refresh(); }} className="rounded-full bg-[#9f3e2f] px-5 py-3 text-center font-bold text-white">{state.result ? (returnToScan ? "Kembali ke hasil dan penyimpanan" : "Lanjut Ramalan Detail") : "Mulai pindai"}</Link>
          <Link href="/netra-hasta/riwayat" className="text-center underline">Lihat riwayat Anda</Link>
          <button type="button" disabled={account.busy} onClick={async () => { setError(null); try { await account.logout(); dispatch({ type: "reset" }); router.refresh(); } catch (failure) { setError((failure as Error).message); } }} className="rounded-full border border-stone-300 px-5 py-3 font-bold disabled:opacity-50">Keluar</button>
        </div>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={async (event) => {
          event.preventDefault(); setError(null);
          try { await account.login(email.trim(), password, register); onAuthenticated?.(); router.replace(returnToScan ? scanTarget : state.result ? "/netra-hasta/detail" : "/netra-hasta/riwayat"); router.refresh(); }
          catch (failure) { setError((failure as Error).message); }
          finally { setPassword(""); }
        }}>
          <div><label htmlFor="netra-email" className="block text-sm font-bold">Email</label><input id="netra-email" type="email" autoComplete="username" maxLength={254} required value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 block w-full min-w-0 rounded-xl border border-stone-300 p-3" /></div>
          <div><label htmlFor="netra-password" className="block text-sm font-bold">Password</label><input id="netra-password" type="password" autoComplete={register ? "new-password" : "current-password"} required minLength={6} maxLength={128} value={password} onChange={(event) => setPassword(event.target.value)} className="mt-2 block w-full min-w-0 rounded-xl border border-stone-300 p-3" /></div>
          <button type="submit" disabled={account.busy || account.loading || account.configured !== true} className="w-full rounded-full bg-[#9f3e2f] px-5 py-3 font-bold text-white disabled:opacity-50">{account.busy ? "Memverifikasi akun..." : register ? "Daftar dan lanjutkan" : "Masuk dan lanjutkan"}</button>
          <button type="button" disabled={account.busy} onClick={() => { setRegister(!register); setError(null); setPassword(""); }} className="w-full text-sm underline">{register ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}</button>
        </form>
      )}
      {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm text-red-900" role="alert">{error}</p>}
      <Link href="/netra-hasta" className="mt-6 inline-block text-sm underline">Kembali ke hasil dasar</Link>
      </div>
    </section>
  );
}
