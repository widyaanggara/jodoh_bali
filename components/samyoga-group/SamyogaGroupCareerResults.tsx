"use client";

import { useId, useState } from "react";
import { useNetraAccount } from "@/components/netra-hasta/NetraAccountProvider";
import { useSamyogaCareer } from "@/hooks/useSamyogaCareer";
import type { SamyogaGroupDraftMember } from "@/lib/samyoga-group-form";
import type { SamyogaGroupResult } from "@/lib/samyoga-group";
import SamyogaGroupPositionExperiment from "./SamyogaGroupPositionExperiment";
import SamyogaCareerCard from "./SamyogaCareerCard";
import SamyogaCareerLockedResult from "./SamyogaCareerLockedResult";

export default function SamyogaGroupCareerResults({ members, result }: {
    members: readonly SamyogaGroupDraftMember[]; result: SamyogaGroupResult;
}) {
    const account = useNetraAccount();
    const career = useSamyogaCareer(members);
    const panelId = useId();
    const permissionId = useId();
    const [showAccess, setShowAccess] = useState(false);
    const [permission, setPermission] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [register, setRegister] = useState(false);
    const [error, setError] = useState("");
    const permissionBinding = JSON.stringify([account.uid, members.map(({ id, birthDate, birthTime }) => ({ id, birthDate, birthTime }))]);
    const [permissionContext, setPermissionContext] = useState(permissionBinding);
    if (permissionContext !== permissionBinding) {
        setPermissionContext(permissionBinding);
        setPermission(false);
        setPassword("");
        setError("");
    }
    const openAccess = () => {
        setShowAccess(true);
        requestAnimationFrame(() => document.getElementById(`${panelId}-email`)?.focus());
    };
    const needsLogin = !account.uid || career.reauthenticate;
    const permissionControls = <div className="mt-4 space-y-3">
        <label htmlFor={permissionId} className="flex items-start gap-3 rounded-xl border border-stone-200 bg-white p-3 text-left text-sm leading-relaxed">
            <input id={permissionId} type="checkbox" checked={permission} onChange={event => { setPermission(event.target.checked); if (!event.target.checked) career.clear(); }} className="mt-1 h-4 w-4 shrink-0 accent-primary" />
            Saya berhak menggunakan tanggal lahir anggota kelompok ini dan mengizinkan pemrosesan sementara untuk membuka ramalan profesi.
        </label>
        <div className="flex flex-wrap justify-center gap-3">
            <button type="button" disabled={!permission || account.loading || account.busy || career.busy || Boolean(career.data)} onClick={career.load}
                className="min-h-[50px] rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50">
                {career.busy ? "Memverifikasi kelompok..." : career.data ? "Profesi sudah terbuka" : "Verifikasi dan buka profesi"}
            </button>
            <button type="button" disabled={account.busy} onClick={async () => {
                career.clear(); setPermission(false); setError("");
                try { await account.logout(); } catch { setError("Logout belum berhasil. Coba lagi."); }
            }} className="min-h-11 rounded-xl border border-stone-300 bg-white px-5 py-2 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50">Keluar akun</button>
        </div>
    </div>;
    return <div className="space-y-8">
        <SamyogaGroupPositionExperiment members={members} result={result} />
        <section data-career-section data-career-access aria-labelledby={`${panelId}-title`} className="min-w-0 space-y-5 rounded-3xl border border-stone-200 bg-stone-50/60 p-4 sm:p-6">
            <header>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">Tambahan interpretasi tradisional</p>
                <h2 id={`${panelId}-title`} className="mt-2 break-words font-display text-2xl font-bold text-stone-900">Ramalan Profesi &mdash; Tenung Wariga Gemet</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">Menggunakan Mangsa Pranata dan hari kalender sipil, bukan Sasih Bali atau pergeseran hari pukul 06:00. Ini tafsir simbolis sumber, bukan asesmen bakat, jaminan karier, atau syarat menjalankan profesi.</p>
                <p className="mt-2 text-xs leading-relaxed text-stone-500">Hanya jika Anda membukanya, ID internal dan tanggal lahir anggota dikirim melalui permintaan server terproteksi. Nama dan jam lahir tidak dikirim. Data tidak dicatat ke log atau disimpan ke database/riwayat; izin kelompok sementara berlaku paling lama 10 menit.</p>
            </header>
            {!career.data ? <SamyogaCareerLockedResult memberCount={members.length} busy={account.loading || career.busy}
                signedIn={!needsLogin} error={career.error} onLogin={openAccess} loginExpanded={showAccess} loginId={`${panelId}-login`}>
                {permissionControls}
            </SamyogaCareerLockedResult> : <>
                {permissionControls}
                <p role="status" className="text-sm font-semibold text-primary">Ramalan profesi {career.data.members.length} anggota siap ditinjau di kartu masing-masing.</p>
                <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
                    {members.map((member, index) => <SamyogaCareerCard key={member.id}
                        memberId={member.id} displayName={member.displayName.trim() || `Anggota ${index + 1}`}
                        reading={career.data?.members.find(reading => reading.memberId === member.id)?.reading ?? null} />)}
                </div>
            </>}
            {!account.loading && needsLogin && showAccess && <form id={`${panelId}-login`} aria-label="Masuk untuk ramalan profesi" className="mx-auto w-full max-w-md space-y-3 rounded-2xl border border-stone-200 bg-white p-4 sm:p-5" onSubmit={async event => {
                event.preventDefault(); setError("");
                try { await account.login(email.trim(), password, register); career.clear(); setPermission(false); }
                catch { setError("Akun belum dapat diverifikasi. Periksa isian atau coba lagi."); }
                finally { setPassword(""); }
            }}>
                <div><label htmlFor={`${panelId}-email`} className="block text-sm font-bold">Email</label><input id={`${panelId}-email`} type="email" autoComplete="username" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} className="mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-stone-300 p-3" /></div>
                <div><label htmlFor={`${panelId}-password`} className="block text-sm font-bold">Password</label><input id={`${panelId}-password`} type="password" autoComplete={register ? "new-password" : "current-password"} required minLength={6} maxLength={128} value={password} onChange={event => setPassword(event.target.value)} className="mt-1 block min-h-11 w-full min-w-0 rounded-xl border border-stone-300 p-3" /></div>
                <button type="submit" disabled={account.busy || account.configured !== true} className="min-h-[50px] rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-50">{account.busy ? "Memverifikasi..." : register ? "Daftar dan lanjutkan" : "Masuk dan lanjutkan"}</button>
                <button type="button" disabled={account.busy} onClick={() => { setRegister(value => !value); setPassword(""); setError(""); }} className="block min-h-11 text-sm underline">{register ? "Sudah punya akun? Masuk" : "Belum punya akun? Daftar"}</button>
            </form>}
            {account.configured === false && <p role="alert" className="text-sm text-amber-900">Layanan akun belum tersedia. Hasil Samyoga publik tetap dapat digunakan.</p>}
            {error && <p role="alert" className="rounded-xl bg-amber-50 p-3 text-sm text-amber-950">{error}</p>}
        </section>
    </div>;
}
