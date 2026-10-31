"use client";

import { useState } from "react";
import type { SamyogaGroupResult, SamyogaCategory } from "@/lib/samyoga-group";
import {
    getSamyogaMemberDisplayName,
    type SamyogaGroupDraftMember,
} from "@/lib/samyoga-group-form";
import {
    SAMYOGA_PAIR_DETAILS_INITIAL_OPEN,
    createSamyogaGroupNetworkGeometry,
    summarizeSamyogaGroup,
    toggleSamyogaPairDetails,
    type SamyogaGroupCompositionLabel,
} from "@/lib/samyoga-group-summary";

interface SamyogaGroupResultsProps {
    result: SamyogaGroupResult;
    members: readonly SamyogaGroupDraftMember[];
    onAnalyzeAgain: () => void;
}

const CATEGORY_PRESENTATION: Record<SamyogaCategory, {
    icon: string;
    badge: string;
    panel: string;
    bar: string;
    explanation: string;
}> = {
    Utama: {
        icon: "verified",
        badge: "border-emerald-200 bg-emerald-50 text-emerald-800",
        panel: "border-emerald-100",
        bar: "bg-emerald-500",
        explanation: "Kategori simbolis Utama menurut aturan Samyoga pasangan yang aktif.",
    },
    Madia: {
        icon: "balance",
        badge: "border-amber-200 bg-amber-50 text-amber-800",
        panel: "border-amber-100",
        bar: "bg-amber-400",
        explanation: "Kategori simbolis Madia menurut aturan Samyoga pasangan yang aktif.",
    },
    Nista: {
        icon: "visibility",
        badge: "border-rose-200 bg-rose-50 text-rose-800",
        panel: "border-rose-100",
        bar: "bg-rose-400",
        explanation: "Kategori simbolis Nista menandai pasangan yang perlu diperhatikan dalam pembacaan tradisional.",
    },
};

const CATEGORIES: readonly SamyogaCategory[] = ["Utama", "Madia", "Nista"];

const COMPOSITION_BADGE: Record<SamyogaGroupCompositionLabel, string> = {
    "Dominan Utama": "border-emerald-200 bg-emerald-100 text-emerald-800",
    "Dominan Madia": "border-amber-200 bg-amber-100 text-amber-800",
    "Dominan Nista": "border-rose-200 bg-rose-100 text-rose-800",
    "Komposisi Campuran": "border-primary/20 bg-primary/10 text-primary",
};

export default function SamyogaGroupResults({ result, members, onAnalyzeAgain }: SamyogaGroupResultsProps) {
    const [showPairDetails, setShowPairDetails] = useState(SAMYOGA_PAIR_DETAILS_INITIAL_OPEN);
    const summary = summarizeSamyogaGroup(result);
    const displayName = (memberId: string) => getSamyogaMemberDisplayName(members, memberId);

    return (
        <section aria-labelledby="hasil-kelompok-title" className="space-y-8">
            <article className="relative overflow-hidden rounded-[3rem] border border-accent-gold/10 bg-surface-light p-6 text-center shadow-2xl shadow-stone-200/50 sm:p-8 md:p-14">
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_32%,rgba(34,197,94,0.17),transparent_58%)] blur-3xl"
                />
                <div aria-hidden="true" className="pointer-events-none absolute -left-20 -top-20 h-52 w-52 rounded-full border border-emerald-200/40" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full border border-accent-gold/20" />

                <div className="relative z-10 mx-auto max-w-3xl">
                    <p className="text-xs font-bold uppercase tracking-[0.22em] text-primary">Hasil Keseluruhan Samyoga Kelompok</p>
                    <h2 id="hasil-kelompok-title" className="mt-3 font-display text-3xl font-bold text-stone-900 md:text-4xl">
                        Analisis Dinamika Kelompok
                    </h2>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-stone-400">
                        Berdasarkan komposisi pasangan unik dalam Samyoga kelompok
                    </p>

                    <GroupNetworkSymbol memberCount={summary.memberCount} />

                    <div className="space-y-3">
                        <div>
                            <span className="inline-flex items-center rounded-full bg-gradient-to-br from-emerald-500 to-emerald-700 px-7 py-3 text-base font-bold text-white shadow-xl shadow-emerald-500/20 sm:px-10 sm:text-lg">
                                <span aria-hidden="true">✨</span>&nbsp; Komposisi Kelompok &nbsp;<span aria-hidden="true">✨</span>
                            </span>
                        </div>
                        <div>
                            <span className={`inline-flex rounded-full border px-4 py-1.5 text-xs font-bold uppercase tracking-widest ${COMPOSITION_BADGE[summary.compositionLabel]}`}>
                                {summary.compositionLabel}
                            </span>
                        </div>
                    </div>

                    <p className="mx-auto mt-6 max-w-2xl font-display text-base italic leading-relaxed text-stone-700 sm:text-lg">
                        &ldquo;{summary.overallInterpretation}&rdquo;
                    </p>
                    <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-stone-500">
                        {summary.compositionExplanation}
                    </p>

                    <div aria-hidden="true" className="mx-auto my-8 h-1 max-w-xs rounded-full bg-gradient-to-r from-transparent via-emerald-300/70 to-transparent" />

                    <dl className="mx-auto grid max-w-md grid-cols-2 gap-3">
                        <SummaryCard label="Anggota" value={summary.memberCount} icon="groups" />
                        <SummaryCard label="Pasangan unik" value={summary.pairCount} icon="hub" />
                    </dl>

                    <div aria-labelledby="komposisi-title" className="mt-7 rounded-3xl border border-white/80 bg-white/75 p-4 text-left shadow-sm backdrop-blur-sm sm:p-5">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 id="komposisi-title" className="font-display text-lg font-bold text-stone-900">Distribusi kategori</h3>
                            <p className="text-xs text-stone-500">Total {summary.pairCount} pasangan unik</p>
                        </div>
                        <div className="mt-4 flex h-3 w-full overflow-hidden rounded-full bg-stone-100" aria-hidden="true">
                            {CATEGORIES.map((category) => summary.categoryCounts[category] > 0 && (
                                <span
                                    key={category}
                                    className={CATEGORY_PRESENTATION[category].bar}
                                    style={{ flexGrow: summary.categoryCounts[category] }}
                                />
                            ))}
                        </div>
                        <dl className="mt-4 grid grid-cols-3 gap-2 sm:gap-3">
                            {CATEGORIES.map((category) => (
                                <div key={category} className={`rounded-2xl border p-3 sm:p-4 ${CATEGORY_PRESENTATION[category].badge}`}>
                                    <dt className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider sm:text-xs">
                                        <span aria-hidden="true" className="material-icons-outlined text-sm sm:text-base">{CATEGORY_PRESENTATION[category].icon}</span>
                                        {category}
                                    </dt>
                                    <dd className="mt-1 text-2xl font-bold sm:text-3xl" aria-label={`${category}: ${summary.categoryCounts[category]}`}>
                                        {summary.categoryCounts[category]}
                                    </dd>
                                </div>
                            ))}
                        </dl>
                    </div>

                    {summary.symbolicAttentionPairCount > 0 && (
                        <div className="mt-5 rounded-2xl border border-rose-100 bg-rose-50/80 p-4 text-left">
                            <div className="flex items-start gap-3">
                                <span aria-hidden="true" className="material-icons-outlined mt-0.5 text-rose-700">visibility</span>
                                <div>
                                    <h3 className="font-bold text-rose-950">Perhatian simbolis Nista</h3>
                                    <p className="mt-1 text-sm leading-relaxed text-rose-900">{summary.symbolicAttentionExplanation}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 border-t border-dashed border-stone-200 pt-5 text-left text-xs leading-relaxed text-stone-500 sm:text-center">
                        <p>
                            Interpretasi simbolis berdasarkan perhitungan kalender tradisional Bali. Bukan asesmen ilmiah tentang kepribadian, kompetensi, kesehatan, atau kinerja kelompok.
                        </p>
                        <p className="mt-2">
                            Label dominan adalah aturan penyajian Metemu untuk merangkum komposisi kategori, bukan aturan tradisional baru atau bukti validitas prediksi empiris.
                        </p>
                    </div>
                </div>
            </article>

            <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <button
                    type="button"
                    onClick={onAnalyzeAgain}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/25 bg-white px-6 py-3 text-sm font-bold text-primary shadow-sm transition hover:-translate-y-0.5 hover:bg-primary/[0.04] hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <span aria-hidden="true" className="material-icons-outlined text-lg">refresh</span>
                    Analisis Ulang Samyoga Group
                </button>
                <button
                    type="button"
                    aria-expanded={showPairDetails}
                    aria-controls="rincian-samyoga-kelompok"
                    onClick={() => setShowPairDetails((currentValue) => toggleSamyogaPairDetails(currentValue))}
                    className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-bold text-white shadow-md transition hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                    <span aria-hidden="true" className="material-icons-outlined text-lg">
                        {showPairDetails ? "expand_less" : "expand_more"}
                    </span>
                    {showPairDetails ? "Sembunyikan Detail Per Pasangan" : "Lihat Detail Per Pasangan"}
                </button>
            </div>

            {showPairDetails && (
                <div id="rincian-samyoga-kelompok" className="space-y-8 rounded-3xl border border-stone-200 bg-stone-50/60 p-4 md:p-6">
                    <div>
                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Seluruh pasangan unik</p>
                            <h3 className="mt-1 font-display text-2xl font-bold text-stone-900">Rincian pasangan</h3>
                        </div>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {result.pairs.map((pair) => {
                                const presentation = CATEGORY_PRESENTATION[pair.category];
                                return (
                                    <article key={pair.pairKey} className={`rounded-3xl border bg-white p-5 shadow-sm ${presentation.panel}`}>
                                        <div className="flex flex-wrap items-start justify-between gap-3">
                                            <div>
                                                <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Pasangan</p>
                                                <h4 className="mt-1 font-display text-lg font-bold text-stone-900">
                                                    {displayName(pair.memberAId)} <span aria-hidden="true" className="text-stone-300">dan</span> {displayName(pair.memberBId)}
                                                </h4>
                                            </div>
                                            <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${presentation.badge}`}>
                                                <span aria-hidden="true" className="material-icons-outlined text-sm">{presentation.icon}</span>
                                                {pair.category}
                                            </span>
                                        </div>

                                        <p className="mt-4 text-sm leading-relaxed text-stone-600">{presentation.explanation}</p>
                                        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                                            <div className="rounded-2xl bg-stone-50 p-3">
                                                <dt className="text-xs text-stone-400">Remainder Mod5</dt>
                                                <dd className="mt-1 font-bold text-stone-800">{pair.modulo5}</dd>
                                            </div>
                                            <div className="rounded-2xl bg-stone-50 p-3">
                                                <dt className="text-xs text-stone-400">Remainder Mod16</dt>
                                                <dd className="mt-1 font-bold text-stone-800">{pair.modulo16}</dd>
                                            </div>
                                        </dl>
                                        <div className="mt-3 rounded-2xl border border-stone-100 p-3 text-sm">
                                            <p className="font-bold text-stone-800">{pair.sodasaRsi.label}</p>
                                            <p className="mt-1 text-stone-500">{pair.sodasaRsi.makna}</p>
                                        </div>
                                        {pair.symbolicAttention && (
                                            <p className="mt-3 rounded-2xl border border-rose-100 bg-rose-50/70 p-3 text-xs leading-relaxed text-rose-900">
                                                <strong>Perhatian simbolis:</strong> {pair.symbolicAttentionNote}
                                            </p>
                                        )}
                                    </article>
                                );
                            })}
                        </div>
                    </div>

                    <div>
                        <div className="mb-4">
                            <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Tanpa pemeringkatan</p>
                            <h3 className="mt-1 font-display text-2xl font-bold text-stone-900">Ringkasan setiap anggota</h3>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                            {result.memberSummaries.map((memberSummary) => (
                                <article key={memberSummary.memberId} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
                                    <h4 className="font-display text-lg font-bold text-stone-900">{displayName(memberSummary.memberId)}</h4>
                                    <p className="mt-1 text-xs text-stone-400">Terlibat dalam {memberSummary.pairCount} pasangan unik</p>
                                    <dl className="mt-4 grid grid-cols-3 gap-2 text-center">
                                        {CATEGORIES.map((category) => (
                                            <div key={category} className="rounded-xl bg-stone-50 px-2 py-3">
                                                <dt className="text-[11px] font-medium text-stone-500">{category}</dt>
                                                <dd className="mt-1 text-lg font-bold text-stone-900">{memberSummary.categoryCounts[category]}</dd>
                                            </div>
                                        ))}
                                    </dl>
                                    {memberSummary.symbolicAttentionPairKeys.length > 0 && (
                                        <p className="mt-3 text-xs leading-relaxed text-stone-500">
                                            {memberSummary.symbolicAttentionPairKeys.length} pasangan masuk perhatian simbolis; ini bukan penilaian negatif terhadap anggota.
                                        </p>
                                    )}
                                </article>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button
                            type="button"
                            onClick={() => setShowPairDetails(false)}
                            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-primary/30 bg-white px-5 py-2.5 text-sm font-bold text-primary hover:bg-primary/[0.04] focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        >
                            <span aria-hidden="true" className="material-icons-outlined text-lg">expand_less</span>
                            Sembunyikan Detail Per Pasangan
                        </button>
                    </div>
                </div>
            )}
        </section>
    );
}

function GroupNetworkSymbol({ memberCount }: { memberCount: number }) {
    const geometry = createSamyogaGroupNetworkGeometry(memberCount);

    return (
        <div className="relative mx-auto my-7 h-44 w-52 sm:my-9 sm:h-52 sm:w-60">
            <div aria-hidden="true" className="absolute inset-5 rounded-full bg-emerald-300/20 blur-2xl" />
            <svg
                aria-hidden="true"
                focusable="false"
                viewBox="0 0 240 200"
                className="relative h-full w-full text-emerald-600 drop-shadow-[0_12px_28px_rgba(16,185,129,0.28)]"
            >
                <defs>
                    <linearGradient
                        id="groupNetworkGradient"
                        gradientUnits="userSpaceOnUse"
                        x1="44"
                        y1="20"
                        x2="196"
                        y2="180"
                    >
                        <stop offset="0%" stopColor="#6ee7b7" />
                        <stop offset="50%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#047857" />
                    </linearGradient>
                    <filter id="groupNetworkGlow" x="-40%" y="-40%" width="180%" height="180%">
                        <feGaussianBlur stdDeviation="3" result="networkBlur" />
                        <feMerge>
                            <feMergeNode in="networkBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <g fill="none" stroke="url(#groupNetworkGradient)" strokeLinecap="round" filter="url(#groupNetworkGlow)">
                    {geometry.connections.map((connection) => {
                        const from = geometry.nodes[connection.from];
                        const to = geometry.nodes[connection.to];
                        return (
                            <line
                                key={`${connection.from}-${connection.to}`}
                                x1={from.x}
                                y1={from.y}
                                x2={to.x}
                                y2={to.y}
                                strokeWidth={connection.perimeter ? 3.25 : 2.25}
                                opacity={connection.perimeter ? 0.9 : 0.58}
                            />
                        );
                    })}
                </g>

                {geometry.nodes.map((node) => (
                    <g key={node.index} data-member-profile-icon="true">
                        <circle cx={node.x} cy={node.y} r="17" fill="#ffffff" opacity="0.94" />
                        <circle
                            cx={node.x}
                            cy={node.y}
                            r="13"
                            fill="url(#groupNetworkGradient)"
                            stroke="#ecfdf5"
                            strokeWidth="2.5"
                            filter="url(#groupNetworkGlow)"
                        />
                        <circle cx={node.x} cy={node.y - 4} r="3.25" fill="#ffffff" />
                        <path
                            d={`M ${node.x - 6.5} ${node.y + 7.5} C ${node.x - 6.2} ${node.y + 2.5}, ${node.x - 3.4} ${node.y + 0.5}, ${node.x} ${node.y + 0.5} C ${node.x + 3.4} ${node.y + 0.5}, ${node.x + 6.2} ${node.y + 2.5}, ${node.x + 6.5} ${node.y + 7.5} Z`}
                            fill="#ffffff"
                        />
                    </g>
                ))}
            </svg>
        </div>
    );
}

function SummaryCard({ label, value, icon }: { label: string; value: number; icon: string }) {
    return (
        <div className="rounded-2xl border border-white/70 bg-white/80 p-4">
            <dt className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-primary">
                <span aria-hidden="true" className="material-icons-outlined text-base">{icon}</span>
                {label}
            </dt>
            <dd className="mt-2 text-3xl font-bold text-stone-900" aria-label={`${label}: ${value}`}>{value}</dd>
        </div>
    );
}
