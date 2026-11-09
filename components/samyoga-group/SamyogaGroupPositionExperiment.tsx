"use client";

import { useMemo } from "react";
import type { SamyogaGroupDraftMember } from "@/lib/samyoga-group-form";
import type { SamyogaGroupResult } from "@/lib/samyoga-group";
import { analyzeSamyogaMemberPositions } from "@/lib/samyoga-member-positions";
import { presentMemberPositions } from "@/lib/samyoga-position-presentation";

export default function SamyogaGroupPositionExperiment({ members, result }: {
    members: readonly SamyogaGroupDraftMember[];
    result: SamyogaGroupResult;
}) {
    const analysis = useMemo(() => analyzeSamyogaMemberPositions(members, result), [members, result]);
    const names = new Map(analysis.memberResults.map(m => [m.memberId, m.displayName]));
    const chairNames = analysis.chair.candidateMemberIds.map(id => names.get(id)).join(", ");
    const withRecommendation = analysis.memberResults.filter(m => m.recommendedPositions.length > 0).length;

    return (
        <section aria-labelledby="rekomendasi-posisi-title" className="min-w-0 space-y-5 rounded-3xl border border-amber-200 bg-amber-50/40 p-4 sm:p-6">
            <div>
                <p className="text-xs font-bold uppercase tracking-widest text-amber-800">Beta · Eksperimental</p>
                <h2 id="rekomendasi-posisi-title" className="mt-2 break-words font-display text-2xl font-bold text-stone-900">Rekomendasi Posisi Anggota</h2>
                <p className="mt-3 text-sm leading-relaxed text-stone-700">{analysis.disclaimer}</p>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">
                    Palintangan dilengkapi tafsir Wuku dan Wewaran yang relevan. Rekomendasi bersifat simbolis dan belum menetapkan jabatan.
                </p>
                <p className="mt-2 text-xs leading-relaxed text-amber-900">
                    Evidence belum diverifikasi; review budaya dan persetujuan mapping masih diperlukan.
                </p>
            </div>
            {analysis.status === "error" ? (
                <p role="alert" className="rounded-2xl border border-rose-200 bg-white p-4 text-sm text-rose-900">
                    Analisis posisi belum dapat ditentukan karena input atau graf Samyoga tidak valid. Lakukan analisis ulang.
                </p>
            ) : (
                <>
                    <div role="status" className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 text-sm leading-relaxed text-stone-700">
                        <h3 className="font-bold text-stone-900">Kandidat Ketua simbolis</h3>
                        <p className="mt-2 break-words" data-chair-summary={analysis.chair.status}>
                            {analysis.chair.status === "no_candidate"
                                ? "Belum ada kandidat yang memenuhi profil kepemimpinan dan dukungan Samyoga sekaligus."
                                : analysis.chair.status === "single_candidate"
                                    ? chairNames + " memenuhi kriteria percobaan sebagai kandidat Ketua simbolis."
                                    : "Beberapa kandidat memenuhi kriteria percobaan: " + chairNames + ". Semua ditampilkan tanpa memilih satu Ketua."}
                        </p>
                        <p className="mt-2 text-xs text-stone-500">Kekuatan Otonan belum dapat dibandingkan. Ketua dan Wakil belum ditetapkan.</p>
                        <p className="mt-3 font-semibold" data-member-position-count>
                            {withRecommendation} dari {analysis.memberResults.length} anggota memiliki rekomendasi kontribusi atau kandidat;
                            {" "}{analysis.memberResults.length - withRecommendation} belum spesifik.
                        </p>
                    </div>
                    <div className="grid min-w-0 items-start gap-4 lg:grid-cols-2">
                        {analysis.memberResults.map(member => {
                            const presentation = presentMemberPositions(member);
                            return (
                                <article key={member.memberId} data-position-member={member.memberId} data-chair-candidate={member.chairCandidate}
                                    className="min-w-0 rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
                                    <div className="flex flex-wrap items-start justify-between gap-2">
                                        <h3 className="min-w-0 break-words font-display text-xl font-bold text-stone-900">{member.displayName}</h3>
                                        <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-bold text-amber-900">Eksperimental</span>
                                    </div>
                                    {member.contributionProfiles.length > 0 && (
                                        <div data-contribution-profiles className="mt-3">
                                            <ul aria-label="Posisi yang direkomendasikan" className="flex flex-wrap gap-2">
                                                {member.contributionProfiles.map(label => <li key={label} className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-sm font-bold text-primary">{label}</li>)}
                                            </ul>
                                        </div>
                                    )}
                                    {!member.recommendedPositions.length && (
                                        <p data-participation-status className="mt-3 inline-block rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-600">{member.participationLabel}</p>
                                    )}
                                    {member.chairCandidate && (
                                        <div data-chair-proposal className="mt-3">
                                            <span className="inline-block rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-bold text-amber-950">Kandidat Ketua simbolis</span>
                                        </div>
                                    )}
                                    <div data-lintang-box className="mt-4 rounded-xl border border-stone-200 bg-stone-50 p-3">
                                        <h4 className="font-bold text-primary" data-palintangan-name>Lintang {member.palintangan.name ?? "belum ditemukan"}</h4>
                                        <blockquote data-palintangan-character className="mt-2 break-words text-sm leading-relaxed text-stone-700">
                                            {member.palintangan.originalCharacter ?? "Teks Palintangan belum tersedia dari engine."}
                                        </blockquote>
                                    </div>
                                    <details className="mt-3 rounded-xl border border-stone-200">
                                        <summary className="min-h-11 cursor-pointer rounded-xl p-3 text-sm font-bold text-primary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                                            {member.recommendedPositions.length ? "Mengapa posisi ini direkomendasikan?" : "Mengapa belum ada rekomendasi?"}
                                        </summary>
                                        <div className="min-w-0 space-y-3 break-words border-t border-stone-100 p-3 text-sm leading-relaxed text-stone-600">
                                            {presentation.unspecifiedReason && <p>{presentation.unspecifiedReason}</p>}
                                            {presentation.reasons.map(reason => (
                                                <p key={reason.label} data-position-reason={reason.label}><strong className="text-stone-800">{reason.label}:</strong> {reason.text}</p>
                                            ))}
                                            {presentation.mappingIssues.map(issue => (
                                                <p key={issue.position} data-mapping-issue className="text-amber-900"><strong>{issue.position}:</strong> {issue.message}</p>
                                            ))}
                                        </div>
                                    </details>
                                </article>
                            );
                        })}
                    </div>
                </>
            )}
        </section>
    );
}
