import {
    SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY,
    isActiveSamyogaPositionEvidence,
    resolveSamyogaPositionEvidence,
    type SamyogaDomainReviewStatus,
    type SamyogaResolvedPositionEvidence,
    type SamyogaSymbolicDimension,
} from "./samyoga-position-evidence";
import type { SamyogaMemberCalendarSnapshot } from "./samyoga-calendar-snapshot";

export const SAMYOGA_POSITION_TAXONOMY = [
    "Leader",
    "Co-Leader",
    "Management",
    "Koordinator",
    "Operasional",
    "Anggota",
] as const;

export type SamyogaPosition = (typeof SAMYOGA_POSITION_TAXONOMY)[number];

export const SAMYOGA_POSITION_PRODUCT_STATUS: Readonly<Record<
    SamyogaPosition,
    "product-hypothesis" | "needs-definition" | "not-a-recommendation-fallback"
>> = Object.freeze({
    Leader: "product-hypothesis",
    "Co-Leader": "needs-definition",
    Management: "product-hypothesis",
    Koordinator: "needs-definition",
    Operasional: "product-hypothesis",
    Anggota: "not-a-recommendation-fallback",
});

export type SamyogaRecommendationStatus =
    | "recommended"
    | "multiple_candidates"
    | "conflicting_indicators"
    | "insufficient_basis";

export type SamyogaProductApprovalStatus = "pending" | "approved" | "rejected";

export interface SamyogaPositionRule {
    ruleId: string;
    ruleVersion: string;
    position: SamyogaPosition;
    requiredDimensions: readonly SamyogaSymbolicDimension[];
    domainReviewStatus: SamyogaDomainReviewStatus;
    productApprovalStatus: SamyogaProductApprovalStatus;
    rationale: string;
}

export interface SamyogaPositionRecommendation {
    memberId: string;
    status: SamyogaRecommendationStatus;
    recommendedPosition: SamyogaPosition | null;
    alternativePositions: SamyogaPosition[];
    matchedRuleIds: string[];
    activeEvidenceIds: string[];
    conflictingDimensions: SamyogaSymbolicDimension[];
    rulesetVersion: string;
    interpretationScope: "metemu-symbolic-product-framework";
}

/**
 * Tidak ada aturan jabatan produksi yang aktif sebelum domain review selesai.
 */
export const SAMYOGA_PRODUCTION_POSITION_RULES:
readonly SamyogaPositionRule[] = Object.freeze([]);

const DIMENSION_ORDER: readonly SamyogaSymbolicDimension[] = [
    "directing",
    "planning",
    "managing",
    "coordinating",
    "communicating",
    "executing",
    "collaborating",
];

function comparePosition(left: SamyogaPosition, right: SamyogaPosition): number {
    return SAMYOGA_POSITION_TAXONOMY.indexOf(left) - SAMYOGA_POSITION_TAXONOMY.indexOf(right);
}

export function evaluateSamyogaPositionRecommendation(
    memberId: string,
    evidence: readonly SamyogaResolvedPositionEvidence[],
    rules: readonly SamyogaPositionRule[],
    rulesetVersion: string,
): SamyogaPositionRecommendation {
    const compareId = (left: string, right: string) => left < right ? -1 : left > right ? 1 : 0;
    const evidenceById = new Map<string, Set<SamyogaResolvedPositionEvidence>>();
    evidence.forEach((entry) => {
        if (entry.memberId !== memberId || !isActiveSamyogaPositionEvidence(entry)) return;
        const entries = evidenceById.get(entry.evidenceId) ?? new Set();
        entries.add(entry);
        evidenceById.set(entry.evidenceId, entries);
    });
    const activeEvidence = [...evidenceById.values()]
        // ID ambigu dari dua hasil resolusi berbeda ditolak; referensi berulang dideduplikasi.
        .filter((entries) => entries.size === 1)
        .flatMap((entries) => [...entries])
        .sort((left, right) => compareId(left.evidenceId, right.evidenceId));
    const ruleIdCounts = new Map<string, number>();
    rules.forEach(({ ruleId }) => {
        ruleIdCounts.set(ruleId, (ruleIdCounts.get(ruleId) ?? 0) + 1);
    });
    const approvedRules = rules
        .filter((rule) =>
            rule.domainReviewStatus === "approved" &&
            rule.productApprovalStatus === "approved" &&
            ruleIdCounts.get(rule.ruleId) === 1 &&
            SAMYOGA_POSITION_TAXONOMY.includes(rule.position) &&
            rule.position !== "Anggota" &&
            Array.isArray(rule.requiredDimensions) &&
            rule.requiredDimensions.length > 0 &&
            rule.requiredDimensions.every((dimension) => DIMENSION_ORDER.includes(dimension))
        )
        .sort((left, right) => compareId(left.ruleId, right.ruleId));
    const supportDimensions = new Set(
        activeEvidence
            .filter((entry) => entry.polarity === "support")
            .map((entry) => entry.dimension),
    );
    const cautionDimensions = new Set(
        activeEvidence
            .filter((entry) => entry.polarity === "caution")
            .map((entry) => entry.dimension),
    );
    const conflictingDimensions = DIMENSION_ORDER.filter(
        (dimension) => supportDimensions.has(dimension) && cautionDimensions.has(dimension),
    );
    const preliminaryMatches = approvedRules.filter((rule) =>
        rule.requiredDimensions.every((dimension) => supportDimensions.has(dimension))
    );
    const conflictAffectsMatch = preliminaryMatches.some((rule) =>
        rule.requiredDimensions.some((dimension) => conflictingDimensions.includes(dimension))
    );
    const matchedRules = preliminaryMatches.filter((rule) =>
        rule.requiredDimensions.every((dimension) => !conflictingDimensions.includes(dimension))
    );
    const positions = [...new Set(matchedRules.map((rule) => rule.position))].sort(comparePosition);

    let status: SamyogaRecommendationStatus = "insufficient_basis";
    let recommendedPosition: SamyogaPosition | null = null;
    let alternativePositions: SamyogaPosition[] = [];
    // Kontrak konservatif existing: konflik pada SATU rule yang lengkap menahan
    // seluruh rekomendasi, walau rule lain bersih. Alternatif bersifat provisional.
    // Perubahan ke kebijakan per-rule memerlukan persetujuan produk/domain.
    if (conflictAffectsMatch) {
        status = "conflicting_indicators";
        alternativePositions = [...new Set(preliminaryMatches.map((rule) => rule.position))]
            .sort(comparePosition);
    } else if (positions.length === 1) {
        status = "recommended";
        [recommendedPosition] = positions;
    } else if (positions.length > 1) {
        status = "multiple_candidates";
        alternativePositions = positions;
    }

    return {
        memberId,
        status,
        recommendedPosition,
        alternativePositions,
        matchedRuleIds: matchedRules.map((rule) => rule.ruleId),
        activeEvidenceIds: activeEvidence.map((entry) => entry.evidenceId),
        conflictingDimensions,
        rulesetVersion,
        interpretationScope: "metemu-symbolic-product-framework",
    };
}

export function evaluateProductionSamyogaPositionRecommendation(
    snapshot: SamyogaMemberCalendarSnapshot,
): SamyogaPositionRecommendation {
    const evidence = resolveSamyogaPositionEvidence(
        snapshot,
        SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY,
    );
    return evaluateSamyogaPositionRecommendation(
        snapshot.memberId,
        evidence,
        SAMYOGA_PRODUCTION_POSITION_RULES,
        "production-unapproved-v0",
    );
}
