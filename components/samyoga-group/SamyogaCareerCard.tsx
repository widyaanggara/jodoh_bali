"use client";

import type { CareerReading } from "@/lib/samyoga/career-contract";

export default function SamyogaCareerCard({ memberId, displayName, reading }: {
    memberId: string; displayName: string; reading: CareerReading | null;
}) {
    if (!reading) return null;
    return <article data-career-card data-career-member={memberId} data-career-status={reading.status} className="min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="break-words font-display text-xl font-bold text-stone-900">{displayName}</h3>
        <dl className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div><dt className="text-xs text-stone-500">Mangsa Pranata</dt><dd className="mt-1 font-bold">{reading.mangsa ?? "Belum dapat dipastikan"}</dd></div>
            <div><dt className="text-xs text-stone-500">Hari dan kelompok</dt><dd className="mt-1 font-bold">{reading.day} &middot; {reading.dayGroup}</dd></div>
        </dl>
        <p className="mt-2 text-xs text-stone-500">{reading.sourceInterval}</p>
        {reading.status === "ambiguous" ? <p role="status" className="mt-3 rounded-lg bg-amber-50 p-3 text-sm text-amber-950">{reading.explanation}</p> : <>
            <h4 className="mt-4 text-sm font-bold text-stone-800">Bidang yang disebut sumber</h4>
            <ul className="mt-2 flex flex-wrap gap-2" aria-label="Bidang profesi dari sumber">
                {reading.professions.map(value => <li key={value} className="max-w-full break-words rounded-lg border border-stone-200 bg-white px-2 py-1 text-xs text-stone-700">{value}</li>)}
            </ul>
            <p className="mt-3 text-sm"><strong>Penekanan eksplisit sumber:</strong> {reading.explicitlyPreferred?.join(", ") ?? "Tidak ada satu profesi paling cocok yang dinyatakan tegas."}</p>
            {reading.preferenceNote && <p className="mt-2 text-xs leading-relaxed text-amber-900">{reading.preferenceNote}</p>}
            <p className="mt-3 text-sm leading-relaxed text-stone-600">{reading.explanation}</p>
        </>}
        <p className="mt-4 border-t border-stone-200 pt-3 text-xs leading-relaxed text-stone-500">Rujukan: {reading.reference.title}, halaman cetak {reading.reference.printedPages.join(", ")} (PDF {reading.reference.pdfPages.join(", ")}). {reading.reference.attribution}. Ringkasan ulang Metemu &middot; {reading.methodVersion}.</p>
    </article>;
}
