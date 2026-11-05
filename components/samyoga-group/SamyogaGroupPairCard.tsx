"use client";

import { useId } from "react";
import type { SamyogaGroupPairResult } from "@/lib/samyoga-group";
import {
    getSamyogaTraditionalReading,
    SAMYOGA_PAIR_CATEGORY_NARRATIVES,
    SAMYOGA_PAIR_DYNAMICS_TITLE,
} from "./samyoga-pair-presentation";

interface SamyogaGroupPairCardProps {
    pair: SamyogaGroupPairResult;
    memberAName: string;
    memberBName: string;
    presentation: { icon: string; badge: string; panel: string };
}

export default function SamyogaGroupPairCard({
    pair,
    memberAName,
    memberBName,
    presentation,
}: SamyogaGroupPairCardProps) {
    const reading = getSamyogaTraditionalReading(pair.sodasaRsi);
    const readingId = useId();
    return (
        <article
            data-samyoga-pair={pair.pairKey}
            className={"min-w-0 rounded-3xl border bg-white p-5 shadow-sm " + presentation.panel}
        >
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
                <div className="min-w-0 flex-1 basis-40">
                    <p className="text-xs font-bold uppercase tracking-wider text-stone-400">Pasangan</p>
                    <h4 className="mt-1 break-words font-display text-lg font-bold text-stone-900">
                        {memberAName} <span className="text-stone-400">dan</span> {memberBName}
                    </h4>
                </div>
                <span className={"inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold " + presentation.badge}>
                    <span aria-hidden="true" className="material-icons-outlined text-sm">{presentation.icon}</span>
                    {pair.category}
                </span>
            </div>

            <div className="mt-4">
                <h5 className="font-display text-base font-bold text-stone-900">{SAMYOGA_PAIR_DYNAMICS_TITLE}</h5>
                <p className="mt-2 break-words text-sm leading-relaxed text-stone-600">
                    {SAMYOGA_PAIR_CATEGORY_NARRATIVES[pair.category]}
                </p>
            </div>
            <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div className="min-w-0 rounded-2xl bg-stone-50 p-3">
                    <dt className="text-xs text-stone-400">Remainder Mod5</dt>
                    <dd className="mt-1 font-bold text-stone-800">{pair.modulo5}</dd>
                </div>
                <div className="min-w-0 rounded-2xl bg-stone-50 p-3">
                    <dt className="text-xs text-stone-400">Remainder Mod16</dt>
                    <dd className="mt-1 font-bold text-stone-800">{pair.modulo16}</dd>
                </div>
            </dl>

            {pair.symbolicAttention && (
                <p className="mt-3 break-words rounded-2xl border border-rose-100 bg-rose-50/70 p-3 text-xs leading-relaxed text-rose-900">
                    <strong>Perhatian simbolis:</strong> {pair.symbolicAttentionNote}
                </p>
            )}
            {reading && (
                <details data-traditional-reading className="mt-4 rounded-2xl border border-stone-200">
                    <summary aria-controls={readingId} className="min-h-11 cursor-pointer rounded-2xl p-3 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                        Lihat Tafsir Tradisional
                    </summary>
                    <div id={readingId} className="space-y-3 break-words border-t border-stone-100 p-3 text-sm leading-relaxed text-stone-600">
                        <p className="text-xs text-stone-500">Tafsir ini berasal dari konteks pembacaan pasangan tradisional dan tidak digunakan sebagai penilaian kemampuan organisasi.</p>
                        <dl className="space-y-3">
                            {reading.label && <div><dt className="text-xs font-bold text-stone-500">Label Sodasa Rsi</dt><dd data-traditional-label className="mt-1 font-semibold text-stone-800">{reading.label}</dd></div>}
                            {reading.meaning && <div><dt className="text-xs font-bold text-stone-500">Makna tradisional</dt><dd data-traditional-meaning className="mt-1">{reading.meaning}</dd></div>}
                        </dl>
                    </div>
                </details>
            )}
        </article>
    );
}

