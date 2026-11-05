import { calculateOtonanCalendar } from "./otonan-calendar";
import { dataLintang } from "./data";
import { EXPERIMENT_POSITION_EVIDENCE } from "./samyoga-palintangan-experiment-rules";
import type { ExperimentalPositionEvidence } from "./samyoga-position-experiment-rules";
import type { SamyogaGroupMemberInput } from "./samyoga-group";

export interface SamyogaPalintanganProfile {
    memberId: string;
    status: "found" | "not_found";
    masterRecordId: string | null;
    name: string | null;
    saptawara: string | null;
    pancawara: string | null;
    label: string | null;
    meaning: string | null;
    originalCharacter: string | null;
    masterReference: { file: "lib/data.ts"; exportName: "dataLintang"; field: "penjelasan" };
    evidence: Readonly<ExperimentalPositionEvidence>[];
    supportEvidenceIds: string[];
    cautionEvidenceIds: string[];
    contextNote: string;
    provenanceStatus: "missing";
    culturalReviewStatus: "pending";
    interpretationStatus: "experimental";
    baliDayBoundaryApplied: boolean;
}

/** Read-only projection, always reading the existing Otonan engine and its Lintang master. */
export function createSamyogaPalintanganProfile(member: SamyogaGroupMemberInput): SamyogaPalintanganProfile {
    const lintang = calculateOtonanCalendar(member.birthDate, member.birthTime).lintang;
    const masterRecordId = lintang ? `lintang:${lintang.saptawara}:${lintang.pancawara}` : null;
    const evidence = lintang ? EXPERIMENT_POSITION_EVIDENCE.filter((e) =>
        e.masterRecordId === masterRecordId && e.indicatorValue === lintang.lintang &&
        e.wewaranCycle === null && e.sourceField === "penjelasan" &&
        e.excerpt === lintang.penjelasan) : [];
    return {
        memberId: member.id, status: lintang ? "found" : "not_found",
        masterRecordId, name: lintang?.lintang ?? null,
        saptawara: lintang?.saptawara ?? null, pancawara: lintang?.pancawara ?? null,
        label: lintang?.label ?? null, meaning: lintang?.makna ?? null,
        originalCharacter: lintang?.penjelasan ?? null,
        masterReference: { file: "lib/data.ts", exportName: "dataLintang", field: "penjelasan" },
        evidence: [...evidence],
        supportEvidenceIds: evidence.filter((e) => e.polarity === "support").map((e) => e.evidenceId),
        cautionEvidenceIds: evidence.filter((e) => e.polarity === "caution").map((e) => e.evidenceId),
        contextNote: masterRecordId === "lintang:Buda:Kliwon"
            ? "Konteks sensitif dan mudah tersinggung pada teks asli tetap berlaku; tidak dihapus oleh support komunikasi."
            : masterRecordId === "lintang:Saniscara:Umanis"
                ? "Caution komunikasi harus dibaca bersama konteks keterampilan dan keberanian pada teks asli."
                : "Baca seluruh teks asli, termasuk batas dan konteksnya. Tidak ada caution terpetakan bukan berarti bebas risiko.",
        provenanceStatus: "missing", culturalReviewStatus: "pending", interpretationStatus: "experimental",
        baliDayBoundaryApplied: Number(member.birthTime.slice(0, 2)) < 6,
    };
}

/** Inventory, not a rule registry. No copied master or automatic activation. */
export function listPalintanganMasterIdentities() {
    return Object.freeze(dataLintang.map((record) => Object.freeze({
        masterRecordId: `lintang:${record.saptawara}:${record.pancawara}`,
        ...record,
    })));
}
