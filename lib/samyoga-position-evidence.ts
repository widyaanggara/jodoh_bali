import type {
    SamyogaCalendarIndicatorType,
    SamyogaMemberCalendarSnapshot,
    SamyogaWewaranCycle,
} from "./samyoga-calendar-snapshot";

export type SamyogaSymbolicDimension =
    | "directing"
    | "planning"
    | "managing"
    | "coordinating"
    | "communicating"
    | "executing"
    | "collaborating";

export type SamyogaEvidencePolarity = "support" | "caution";
export type SamyogaProvenanceStatus = "missing" | "provisional" | "verified";
export type SamyogaDomainReviewStatus = "pending" | "approved" | "rejected";

export interface SamyogaPositionEvidenceDefinition {
    evidenceId: string;
    indicatorType: SamyogaCalendarIndicatorType;
    wewaranCycle: SamyogaWewaranCycle | null;
    indicatorValue: string;
    masterRecordId: string;
    sourceField: string;
    excerpt: string;
    dimension: SamyogaSymbolicDimension;
    polarity: SamyogaEvidencePolarity;
    sourceId: string | null;
    sourcePage: string | null;
    provenanceStatus: SamyogaProvenanceStatus;
    domainReviewStatus: SamyogaDomainReviewStatus;
    ruleVersion: string;
}

export type SamyogaEvidenceInactiveReason =
    | "master-interpretation-not-found"
    | "provenance-not-verified"
    | "domain-review-not-approved"
    | "duplicate-evidence-id";

export interface SamyogaResolvedPositionEvidence
    extends SamyogaPositionEvidenceDefinition {
    memberId: string;
    active: boolean;
    inactiveReasons: readonly SamyogaEvidenceInactiveReason[];
}

// Hanya output resolver dalam proses yang sama boleh mencapai evaluator.
// Flag active pada object literal atau hasil deserialize bukan bukti resolusi.
const resolvedEvidence = new WeakSet<SamyogaResolvedPositionEvidence>();

export function isActiveSamyogaPositionEvidence(entry: SamyogaResolvedPositionEvidence): boolean {
    return resolvedEvidence.has(entry) && entry.active;
}

/**
 * Registry produksi sengaja kosong. Evidence budaya baru boleh ditambahkan
 * setelah setiap kutipan dan pemetaan dimensinya memperoleh provenance serta
 * persetujuan domain yang dapat diaudit.
 */
export const SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY:
readonly SamyogaPositionEvidenceDefinition[] = Object.freeze([]);

export function createSamyogaEvidenceIdentity(
    definition: Pick<
        SamyogaPositionEvidenceDefinition,
        | "indicatorType"
        | "wewaranCycle"
        | "indicatorValue"
        | "masterRecordId"
        | "sourceField"
    >,
): string {
    return JSON.stringify([
        definition.indicatorType,
        definition.wewaranCycle,
        definition.indicatorValue,
        definition.masterRecordId,
        definition.sourceField,
    ]);
}

export function resolveSamyogaPositionEvidence(
    snapshot: SamyogaMemberCalendarSnapshot,
    registry: readonly SamyogaPositionEvidenceDefinition[],
): SamyogaResolvedPositionEvidence[] {
    const idCounts = new Map<string, number>();
    registry.forEach(({ evidenceId }) => {
        idCounts.set(evidenceId, (idCounts.get(evidenceId) ?? 0) + 1);
    });
    const interpretations = new Map(
        snapshot.masterInterpretations.map((interpretation) => [
            createSamyogaEvidenceIdentity({
                indicatorType: interpretation.indicatorType,
                wewaranCycle: interpretation.wewaranCycle,
                indicatorValue: interpretation.indicatorValue,
                masterRecordId: interpretation.masterRecordId,
                sourceField: interpretation.sourceField,
            }),
            interpretation,
        ]),
    );

    return registry.map((definition) => {
        const interpretation = interpretations.get(createSamyogaEvidenceIdentity(definition));
        const inactiveReasons: SamyogaEvidenceInactiveReason[] = [];
        if (!interpretation || interpretation.text !== definition.excerpt) {
            inactiveReasons.push("master-interpretation-not-found");
        }
        if (
            definition.provenanceStatus !== "verified" ||
            typeof definition.sourceId !== "string" ||
            definition.sourceId.trim().length === 0
        ) {
            inactiveReasons.push("provenance-not-verified");
        }
        if (definition.domainReviewStatus !== "approved") {
            inactiveReasons.push("domain-review-not-approved");
        }

        if ((idCounts.get(definition.evidenceId) ?? 0) > 1) {
            inactiveReasons.push("duplicate-evidence-id");
        }

        const resolved: SamyogaResolvedPositionEvidence = Object.freeze({
            ...definition,
            memberId: snapshot.memberId,
            active: inactiveReasons.length === 0,
            inactiveReasons: Object.freeze(inactiveReasons),
        });
        resolvedEvidence.add(resolved);
        return resolved;
    });
}
