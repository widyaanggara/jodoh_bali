"use client";

import type { ReactNode } from "react";

export default function SamyogaCareerLockedResult({ memberCount, busy, signedIn, error, onLogin, loginExpanded, loginId, children }: {
    memberCount: number;
    busy: boolean;
    signedIn: boolean;
    error: string;
    onLogin: () => void;
    loginExpanded: boolean;
    loginId: string;
    children?: ReactNode;
}) {
    return <div data-career-locked aria-label="Akses ramalan profesi" aria-busy={busy}
        className="relative min-h-[390px] overflow-hidden rounded-[18px] border border-[#ded7cf] bg-[#faf9f6]">
        <div data-career-placeholder aria-hidden="true" inert
            className="pointer-events-none absolute inset-0 grid content-start gap-4 p-6 blur-[5px] select-none sm:grid-cols-2">
            {Array.from({ length: memberCount }, (_, index) => <div key={index} data-career-placeholder-card
                className="space-y-4 rounded-xl border border-[#ded7cf] bg-white p-[18px]">
                <div className="h-5 w-1/2 rounded-md bg-[#ded7cf]" />
                <div className="h-[9px] w-[85%] rounded-md bg-[#ded7cf]" />
                <div className="h-[9px] w-[85%] rounded-md bg-[#ded7cf]" />
                <div className="h-[9px] w-[55%] rounded-md bg-[#ded7cf]" />
            </div>)}
        </div>
        <div data-career-overlay className="relative grid min-h-[390px] place-items-center bg-[#faf9f6b8] p-5">
            <div className="w-full max-w-[30rem] p-2 text-center text-stone-900 sm:p-6">
                <h3 className="font-display text-2xl font-bold">{busy ? "Memeriksa akses ramalan profesi" : signedIn ? "Verifikasi untuk melihat ramalan profesi" : "Masuk untuk melihat ramalan profesi"}</h3>
                <p role={error ? "alert" : "status"} className="mt-3 text-sm leading-relaxed text-stone-600">
                    {error || (busy ? "Hasil akan ditampilkan setelah akses Anda diverifikasi." : signedIn
                        ? "Setujui penggunaan data anggota, lalu verifikasi akses kelompok ini."
                        : "Ramalan profesi seluruh anggota tersedia setelah login dan verifikasi izin penggunaan data.")}
                </p>
                {!busy && !signedIn && <button type="button" data-career-login-cta onClick={onLogin}
                    aria-expanded={loginExpanded} aria-controls={loginExpanded ? loginId : undefined}
                    className="mt-4 inline-flex min-h-[50px] items-center justify-center rounded-xl bg-primary px-[21px] py-[13px] text-sm font-semibold text-white hover:bg-[#7f1d1d] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
                    Masuk / Daftar
                </button>}
                {signedIn && children}
            </div>
        </div>
    </div>;
}
