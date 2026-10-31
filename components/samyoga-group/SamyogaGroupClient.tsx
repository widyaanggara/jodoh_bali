"use client";

import Link from "next/link";
import { useEffect, useReducer, useRef, useState } from "react";
import SplashScreen from "@/components/SplashScreen";
import {
    analyzeSamyogaGroupDraft,
    createInitialSamyogaGroupFormState,
    createSamyogaGroupDraftMember,
    isSamyogaGroupDraftReady,
    reduceSamyogaGroupFormState,
    type SamyogaGroupDraftField,
} from "@/lib/samyoga-group-form";
import SamyogaGroupMemberCard from "./SamyogaGroupMemberCard";
import SamyogaGroupResults from "./SamyogaGroupResults";

const SAMYOGA_GROUP_SPLASH_DURATION_MS = 2000;

export default function SamyogaGroupClient() {
    const [state, dispatch] = useReducer(
        reduceSamyogaGroupFormState,
        undefined,
        createInitialSamyogaGroupFormState,
    );
    const nextMemberId = useRef(4);
    const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const canAnalyze = isSamyogaGroupDraftReady(state.members);

    useEffect(() => () => {
        if (analysisTimer.current) {
            clearTimeout(analysisTimer.current);
        }
    }, []);

    const addMember = () => {
        const member = createSamyogaGroupDraftMember(`member-${nextMemberId.current}`);
        nextMemberId.current += 1;
        dispatch({ type: "add-member", member });
    };

    const analyzeAgain = () => {
        nextMemberId.current = 4;
        dispatch({ type: "reset-form" });
        requestAnimationFrame(() => {
            document.getElementById("form-kelompok-title")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        });
    };

    const updateMember = (
        memberId: string,
        field: SamyogaGroupDraftField,
        value: string,
    ) => {
        dispatch({ type: "update-member", memberId, field, value });
    };

    const analyze = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (isAnalyzing) return;

        const outcome = analyzeSamyogaGroupDraft(state.members);
        if (!outcome.ok) {
            dispatch({ type: "analysis-failed", errors: outcome.errors });
            return;
        }

        setIsAnalyzing(true);
        analysisTimer.current = setTimeout(() => {
            dispatch({ type: "analysis-succeeded", result: outcome.result });
            setIsAnalyzing(false);
            analysisTimer.current = null;
        }, SAMYOGA_GROUP_SPLASH_DURATION_MS);
    };

    return (
        <main className="min-h-screen bg-background-light pb-24 text-stone-800">
            <section className="relative overflow-hidden px-4 pb-10 pt-14 sm:px-6 md:pb-14 md:pt-20">
                <div aria-hidden="true" className="absolute inset-x-0 top-0 mx-auto h-72 max-w-5xl rounded-full bg-primary/[0.04] blur-3xl" />
                <div className="relative mx-auto max-w-4xl text-center">
                    <Link
                        href="/pawongan-sinergi"
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-600 transition hover:border-primary/30 hover:text-primary"
                    >
                        <span aria-hidden="true" className="material-icons-outlined text-base">arrow_back</span>
                        Samyoga pasangan
                    </Link>
                    <p className="mt-8 text-xs font-bold uppercase tracking-[0.24em] text-primary">Eksperimen kategorikal 3–6 anggota</p>
                    <h1 className="mt-3 font-display text-4xl font-bold text-primary md:text-5xl">Samyoga Kelompok</h1>
                    <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-stone-600 md:text-lg">
                        Lihat kategori tradisional untuk seluruh pasangan unik di dalam kelompok tanpa skor, persentase, atau pemeringkatan anggota.
                    </p>
                </div>
            </section>

            <div className="mx-auto max-w-6xl space-y-10 px-4 sm:px-6">
                <section className="rounded-3xl border border-stone-200 bg-stone-50 p-4 sm:p-6">
                    <div className="flex items-start gap-3 text-sm leading-relaxed text-stone-700">
                        <span aria-hidden="true" className="material-icons-outlined mt-0.5 text-primary">privacy_tip</span>
                        <div>
                            <h2 className="font-bold text-primary">Privasi dan batas penggunaan</h2>
                            <p className="mt-1">
                                Seluruh perhitungan berlangsung lokal di browser. Tanggal dan jam lahir tidak dikirim atau disimpan.
                            </p>
                            <p className="mt-2 font-medium">
                                Interpretasi simbolis berdasarkan perhitungan kalender tradisional Bali. Bukan asesmen ilmiah tentang kepribadian, kompetensi, kesehatan, atau kinerja kelompok.
                            </p>
                        </div>
                    </div>
                </section>

                {!state.result && !isAnalyzing && (
                <form onSubmit={analyze} noValidate className="space-y-6" aria-labelledby="form-kelompok-title">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Data anggota</p>
                            <h2 id="form-kelompok-title" className="mt-1 font-display text-2xl font-bold text-stone-900">
                                Isi 3–6 anggota
                            </h2>
                            <p className="mt-1 text-sm text-stone-500">Urutan dan label anggota tidak menentukan peran kepemimpinan.</p>
                        </div>
                        <div className="rounded-full border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-stone-600" aria-live="polite">
                            {state.members.length} dari 6 anggota
                        </div>
                    </div>

                    {state.errors.form && (
                        <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-800">
                            {state.errors.form}
                        </div>
                    )}

                    <div className="grid gap-5 lg:grid-cols-2">
                        {state.members.map((member, index) => (
                            <SamyogaGroupMemberCard
                                key={member.id}
                                member={member}
                                position={index + 1}
                                canRemove={state.members.length > 3}
                                errors={state.errors.fields[member.id]}
                                onChange={(field, value) => updateMember(member.id, field, value)}
                                onRemove={() => dispatch({ type: "remove-member", memberId: member.id })}
                            />
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row">
                        <button
                            type="button"
                            onClick={addMember}
                            disabled={state.members.length >= 6}
                            className="inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-2xl border border-primary/20 bg-white px-5 py-3 font-bold text-primary transition hover:bg-primary/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <span aria-hidden="true" className="material-icons-outlined">person_add</span>
                            Tambah anggota
                        </button>
                        <button
                            type="submit"
                            disabled={!canAnalyze || isAnalyzing}
                            aria-busy={isAnalyzing}
                            className="gradient-button inline-flex min-h-12 flex-[2] items-center justify-center gap-2 rounded-2xl px-6 py-3 font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
                        >
                            <span aria-hidden="true" className={`material-icons-outlined ${isAnalyzing ? "animate-spin" : ""}`}>
                                {isAnalyzing ? "autorenew" : "account_tree"}
                            </span>
                            Analisis Samyoga Group
                        </button>
                    </div>
                    {!canAnalyze && (
                        <p className="text-center text-xs text-stone-500" aria-live="polite">
                            Lengkapi tanggal dan jam lahir valid untuk seluruh anggota sebelum menganalisis.
                        </p>
                    )}
                </form>
                )}

                {state.result ? (
                    <SamyogaGroupResults
                        result={state.result}
                        members={state.members}
                        onAnalyzeAgain={analyzeAgain}
                    />
                ) : !isAnalyzing ? (
                    <section className="rounded-3xl border border-dashed border-stone-300 bg-white px-5 py-10 text-center" aria-label="Hasil belum tersedia">
                        <span aria-hidden="true" className="material-icons-outlined text-4xl text-stone-300">hub</span>
                        <h2 className="mt-3 font-display text-xl font-bold text-stone-700">Hasil kelompok belum tersedia</h2>
                        <p className="mx-auto mt-2 max-w-lg text-sm leading-relaxed text-stone-500">
                            Setelah seluruh input valid, hasil akan menampilkan setiap pasangan unik, distribusi kategori, dan ringkasan per anggota.
                        </p>
                    </section>
                ) : null}
            </div>

            {isAnalyzing && (
                <SplashScreen message="Menganalisis komposisi Samyoga kelompok..." />
            )}
        </main>
    );
}
