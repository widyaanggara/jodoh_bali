import type { ContributionProfileResult, MemberPositionResult } from "./samyoga-member-positions";
import type { ContributionMapping } from "./samyoga-member-position-rules";

// Display excerpts only: these never add mappings, evidence, eligibility or ranking.
// Every fragment must still occur verbatim in this member's actual source text.
const SHORT_QUOTES: Readonly<Record<string, string>> = {
    "C-DIR-01": "berjiwa pemimpin",
    "C-DIR-02": "berbakat mengatur orang",
    "C-DIR-03": "berjiwa pemimpin",
    "C-PLAN-01": "berbakat dalam perencanaan",
    "C-MAN-01": "pandai mengelola sumber daya",
    "C-MAN-02": "Pandai mengatur",
    "C-MAN-03": "Sangat teliti dalam keuangan dan aturan",
    "C-COMM-01": "komunikatif",
    "C-COMM-02": "pandai berbicara",
    "C-COMM-03": "ahli dalam merangkai kata atau mengarang",
    "C-EXEC-01": "teliti dalam bekerja",
    "C-EXEC-02": "Tenang, konsisten, dan tidak suka terburu-buru",
    "C-EXEC-03": "Rapi dalam bekerja",
    "C-EXEC-04": "rajin bekerja",
    "C-COLL-01": "senang menolong",
    "C-COLL-02": "sangat mementingkan hubungan manusia",
    "C-COLL-03": "Pendengar yang baik",
};

export interface PositionReasonSource {
    evidenceId: string;
    dimension: ContributionMapping["dimension"];
    origin: string;
    quote: string;
}
export interface PositionReason {
    label: string;
    text: string;
    sources: PositionReasonSource[];
}
export interface PositionPresentation {
    reasons: PositionReason[];
    mappingIssues: { position: string; message: string }[];
    unspecifiedReason: string | null;
}

function sourceFor(member: MemberPositionResult, evidence: ContributionMapping): PositionReasonSource | null {
    const source = member.otonan.interpretations.find(s =>
        s.indicatorType === evidence.indicatorType && s.wewaranCycle === evidence.wewaranCycle &&
        s.indicatorValue === evidence.indicatorValue && s.masterRecordId === evidence.masterRecordId &&
        s.sourceField === evidence.sourceField && s.text === evidence.excerpt);
    const quote = SHORT_QUOTES[evidence.evidenceId] ?? evidence.sourcePhrase.replace(/[.!?]+$/, "");
    if (!source || !quote || !evidence.sourcePhrase.includes(quote) || !source.text.includes(quote) ||
        quote.length > 120 || /[.!?]/.test(quote)) return null;
    const origin = evidence.indicatorType === "lintang" ? "Lintang" : evidence.indicatorType === "wuku" ? "Wuku" : "Wewaran";
    return { evidenceId: evidence.evidenceId, dimension: evidence.dimension, origin: origin + " " + evidence.indicatorValue, quote };
}

function profileSources(member: MemberPositionResult, profile: ContributionProfileResult): PositionReasonSource[] | null {
    const sources: PositionReasonSource[] = [];
    for (const dimension of profile.dimensions) {
        const candidates = member.evidence.filter(e => profile.supportEvidenceIds.includes(e.evidenceId) &&
            e.dimension === dimension && e.polarity === "support" && e.semanticStatus !== "ambiguous" &&
            (!profile.textualOnly || e.semanticStatus === "textual"));
        // Prefer the displayed Lintang when available; this is presentation order, not strength.
        const ordered = [...candidates.filter(e => e.indicatorType === "lintang"), ...candidates.filter(e => e.indicatorType !== "lintang")];
        const source = ordered.map(e => sourceFor(member, e)).find(s => s !== null);
        if (!source) return null;
        sources.push(source);
    }
    return sources.length ? sources : null;
}

/** Pure UI adapter. Audit details stay on the evaluator result, never in the card. */
export function presentMemberPositions(member: MemberPositionResult): PositionPresentation {
    const reasons: PositionReason[] = [], mappingIssues: PositionPresentation["mappingIssues"] = [];
    for (const label of member.recommendedPositions) {
        const chair = label === "Kandidat Ketua";
        const profile = member.profiles.find(p => p.status === "matched" && (chair
            ? member.chairCandidate && member.samyogaGate.passes && member.leadershipPaths.some(path => p.id === "leader-" + path)
            : p.label === label && !p.id.startsWith("leader-")));
        const sources = profile ? profileSources(member, profile) : null;
        if (!sources) {
            mappingIssues.push({ position: label, message: "Alasan singkat belum dapat ditelusuri; mapping perlu ditinjau." });
            continue;
        }
        const basis = sources.map(s => s.origin + ': “' + s.quote + '”').join("; ");
        reasons.push({ label: chair ? "Kandidat Ketua simbolis" : label,
            text: "Berdasarkan tafsir " + basis + "." + (chair ? " Dukungan relasi Samyoga juga memenuhi syarat percobaan; belum menetapkan jabatan." : ""), sources });
    }
    return {
        reasons, mappingIssues,
        unspecifiedReason: member.recommendedPositions.length ? null : member.status === "review_required"
            ? "Indikator yang tersedia masih memerlukan peninjauan sebelum posisi tertentu dapat direkomendasikan."
            : "Indikator yang tersedia belum memenuhi kriteria untuk merekomendasikan posisi tertentu.",
    };
}
