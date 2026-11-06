"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNetraAccount } from "./NetraAccountProvider";
import { useNetraHastaProduct } from "./NetraHastaProductProvider";

export default function NetraLoginPanel() {
  const account = useNetraAccount();
  const { state, dispatch } = useNetraHastaProduct();
  const router = useRouter();
  const [register, setRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  return (
    <section className="rounded-3xl border border-[#c59b3d]/25 bg-white p-5 sm:p-8">
      <p className="text-xs font-bold uppercase tracking-widest text-[#9f3e2f]">Netra-Hasta · Akun Firebase</p>
      <h1 className="mt-3 font-display text-3xl font-bold">{account.uid ? "Anda sudah masuk" : register ? "Daftar untuk membuka detail" : "Masuk untuk membuka detail"}</h1>
      <p className="mt-4 text-sm leading-relaxed">Hasil dasar tetap dapat dipakai tanpa akun. Login diverifikasi oleh Firebase dan server Metemu. Password tidak disimpan oleh Metemu.</p>
      <p className="mt-3 rounded-2xl bg-stone-50 p-3 text-sm">{state.result ? "Ringkasan pindai masih tersedia di memori. Login pada halaman ini untuk melanjutkan." : "Belum ada hasil pindai di memori. Setelah login, pindai ulang atau buka riwayat yang telah disimpan."} Berpindah tab atau memuat ulang halaman dapat menghapus hasil sementara; citra kamera tidak dipertahankan untuk login.</p>
      {account.loading && <p className="mt-4 text-sm" role="status">Memeriksa sesi akun...</p>}
      {account.configured === false && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-950" role="alert">{account.configurationMessage}</p>}
      {account.uid ? (
        <div className="mt-5 flex flex-col gap-3">
          <Link href={state.result ? "/netra-hasta/detail" : "/netra-hasta"} className="rounded-full bg-[#9f3e2f] px-5 py-3 text-center font-bold text-white">{state.result ? "Lanjut Ramalan Detail" : "Mulai pindai"}</Link>
          <Link href="/netra-hasta/riwayat" className="text-center underline">Lihat riwayat Anda</Link>
          <button type="button" disabled={account.busy} onClick={async () => { setError(null); try { await account.logout(); dispatch({ type: "reset" }); router.refresh(); } catch (failure) { setError((failure as Error).message); } }} className="rounded-full border border-stone-300 px-5 py-3 font-bold disabled:opacity-50">Keluar</button>
        </div>
      ) : (
        <form className="mt-5 space-y-4" onSubmit={async (event) => {
          event.preventDefault(); setError(null);
          try { await account.login(email.trim(), password, register); router.replace(state.result ? "/netra-hasta/detail" : "/netra-hasta/riwayat"); router.refresh(); }
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
    </section>
  );
}
