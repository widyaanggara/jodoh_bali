"use client";

import type { SamyogaGroupPairResult } from "@/lib/samyoga-group";
import {
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
        </article>
    );
}

