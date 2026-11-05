import { createSamyogaGroupCalendarSnapshots, type SamyogaMemberCalendarSnapshot } from "./samyoga-calendar-snapshot";
import { calculateSamyogaGroup, type SamyogaGroupMemberInput, type SamyogaGroupResult } from "./samyoga-group";
import { createSamyogaEvidenceIdentity, type SamyogaSymbolicDimension } from "./samyoga-position-evidence";
import {
    EXPERIMENT_DIMENSIONS, EXPERIMENT_POSITION_EVIDENCE, EXPERIMENT_PROFILE_RULES,
    POSITION_EXPERIMENT_DISCLAIMER, POSITION_EXPERIMENT_VERSION,
    type ExperimentalPositionEvidence, type ExperimentalProfileRule,
} from "./samyoga-position-experiment-rules";

export interface ExperimentalNamedMember extends SamyogaGroupMemberInput { displayName?: string }
export type ExperimentalMemberStatus =
    | "no_indicators" | "no_matching_evidence" | "partial_profile"
    | "conflicting_indicators" | "multiple_profiles" | "profile_matched";
export interface ExperimentalProfileMatch extends ExperimentalProfileRule {
    status: "matched" | "partial" | "conflict" | "unsupported";
    supportedDimensions: SamyogaSymbolicDimension[];
    missingDimensions: SamyogaSymbolicDimension[];
    conflictingDimensions: SamyogaSymbolicDimension[];
    evidenceIds: string[];
}
export interface ExperimentalOtonanInspection {
    status: ExperimentalMemberStatus;
    calculatedIndicators: SamyogaMemberCalendarSnapshot["calculatedIndicators"];
    baliDayBoundaryApplied: boolean;
    supportedDimensions: SamyogaSymbolicDimension[];
    cautionDimensions: SamyogaSymbolicDimension[];
    missingDimensions: SamyogaSymbolicDimension[];
    evidence: Readonly<ExperimentalPositionEvidence>[];
    evidenceStatus: "unverified" | "no_evidence";
    profiles: ExperimentalProfileMatch[];
    reasonCodes: string[];
}
export interface ExperimentalMemberPosition extends ExperimentalOtonanInspection {
    memberId: string;
    displayName: string;
    samyogaGate: {
        counts: { Utama: number; Madia: number; Nista: number };
        requiredUtama: number;
        passes: boolean;
        policyApprovalStatus: "pending";
    };
    leaderGate: boolean;
    chairCandidate: boolean;
}
export interface ExperimentalPositionsResult {
    status: "analyzed" | "error";
    experimental: true;
    synthetic: false;
    dataOrigin: "existing-calendar-engine";
    rulesetVersion: string;
    disclaimer: string;
    memberResults: ExperimentalMemberPosition[];
    reasonCodes: string[];
    chair: {
        status: "not_evaluated" | "no_candidate" | "single_candidate" | "multiple_candidates";
        candidateMemberIds: string[];
        singleCandidateMemberId: string | null;
        deputyMemberId: null;
        comparatorStatus: "UNKNOWN";
        priorityStatus: "not_evaluable_without_comparator";
        reasonCodes: string[];
    };
    unavailablePositions: readonly ["Koordinator", "Wakil Ketua"];
}

/** Pure inspection of an explicitly supplied snapshot. Does not claim data origin or approval. */
export function inspectExperimentalOtonanSnapshot(
    snapshot: SamyogaMemberCalendarSnapshot,
): ExperimentalOtonanInspection {
    const records = new Map(snapshot.masterInterpretations.map((row) => [
        createSamyogaEvidenceIdentity(row), row.text,
    ]));
    // Matching pending assertions is an experiment, never production evidence resolution.
    const evidence = snapshot.calculatedIndicators.length === 0 ? [] :
        EXPERIMENT_POSITION_EVIDENCE.filter((entry) =>
            records.get(createSamyogaEvidenceIdentity(entry)) === entry.excerpt);
    const supportedDimensions = EXPERIMENT_DIMENSIONS.filter((dimension) =>
        evidence.some((entry) => entry.dimension === dimension && entry.polarity === "support"));
    const cautionDimensions = EXPERIMENT_DIMENSIONS.filter((dimension) =>
        evidence.some((entry) => entry.dimension === dimension && entry.polarity === "caution"));
    const missingDimensions = EXPERIMENT_DIMENSIONS.filter((d) => !supportedDimensions.includes(d));
    const profiles: ExperimentalProfileMatch[] = EXPERIMENT_PROFILE_RULES.map((rule) => {
        const supported = rule.requiredDimensions.filter((d) => supportedDimensions.includes(d));
        const missing = rule.requiredDimensions.filter((d) => !supportedDimensions.includes(d));
        const conflicting = rule.requiredDimensions.filter((d) =>
            supportedDimensions.includes(d) && cautionDimensions.includes(d));
        return {
            ...rule,
            status: conflicting.length ? "conflict" :
                missing.length === 0 ? "matched" : supported.length ? "partial" : "unsupported",
            supportedDimensions: supported,
            missingDimensions: missing,
            conflictingDimensions: conflicting,
            evidenceIds: evidence.filter((e) => rule.requiredDimensions.includes(e.dimension)).map((e) => e.evidenceId),
        };
    });
    // Preserve the current conservative global conflict policy for complete profiles.
    const completeConflict = profiles.some((p) => p.status === "conflict" && !p.missingDimensions.length);
    if (completeConflict) {
        profiles.forEach((p) => {
            if (p.status === "matched") p.status = "conflict";
        });
    }
    const matches = profiles.filter((p) => p.status === "matched");
    const status: ExperimentalMemberStatus = snapshot.calculatedIndicators.length === 0 ? "no_indicators" :
        !evidence.length ? "no_matching_evidence" :
            completeConflict ? "conflicting_indicators" :
                matches.length > 1 ? "multiple_profiles" :
                    matches.length === 1 ? "profile_matched" :
                        profiles.some((p) => p.status === "conflict") ? "conflicting_indicators" : "partial_profile";
    return {
        status,
        calculatedIndicators: snapshot.calculatedIndicators.map((i) => ({ ...i })),
        baliDayBoundaryApplied: snapshot.baliDayBoundaryApplied,
        supportedDimensions: [...supportedDimensions],
        cautionDimensions: [...cautionDimensions],
        missingDimensions: [...missingDimensions],
        evidence: [...evidence],
        evidenceStatus: evidence.length ? "unverified" : "no_evidence",
        profiles,
        reasonCodes: [
            status.toUpperCase(),
            ...(evidence.length ? ["EVIDENCE_UNVERIFIED", "PRODUCT_MAPPING_PENDING"] : []),
            ...(cautionDimensions.length ? ["CAUTION_CONTEXT_PRESENT"] : []),
            ...(completeConflict ? ["GLOBAL_COMPLETE_PROFILE_CONFLICT"] : []),
            ...(evidence.some((e) => e.dependencyRefs.length) ? ["DEPENDENT_EVIDENCE_PRESENT"] : []),
            ...(evidence.some((e) => e.auditCaution) ? ["MAPPING_DISPUTED_IN_SOURCE_AUDIT"] : []),
        ],
    };
}

/** Counts only existing unique edges; the supplied result must equal the actual engine result. */
function graphMatchesEngine(group: SamyogaGroupResult, expected: SamyogaGroupResult): boolean {
    return !!group && Array.isArray(group.pairs) &&
        JSON.stringify(group) === JSON.stringify(expected);
}

export function experimentalMinimumUtama(memberCount: number): number {
    if (!Number.isInteger(memberCount) || memberCount < 3 || memberCount > 6) {
        throw new RangeError("Eksperimen membutuhkan 3–6 anggota.");
    }
    return Math.floor((memberCount - 1) / 2) + 1;
}

export function analyzeExperimentalSamyogaPositions(
    members: readonly ExperimentalNamedMember[],
    group: SamyogaGroupResult,
): ExperimentalPositionsResult {
    const base: ExperimentalPositionsResult = {
        status: "error", experimental: true, synthetic: false, dataOrigin: "existing-calendar-engine",
        rulesetVersion: POSITION_EXPERIMENT_VERSION, disclaimer: POSITION_EXPERIMENT_DISCLAIMER,
        memberResults: [], reasonCodes: [],
        chair: {
            status: "not_evaluated", candidateMemberIds: [], singleCandidateMemberId: null,
            deputyMemberId: null, comparatorStatus: "UNKNOWN",
            priorityStatus: "not_evaluable_without_comparator", reasonCodes: ["EXPERIMENTAL_POLICIES_PENDING"],
        },
        unavailablePositions: ["Koordinator", "Wakil Ketua"],
    };
    try {
        const snapshots = createSamyogaGroupCalendarSnapshots(members);
        const expected = calculateSamyogaGroup(members);
        if (!graphMatchesEngine(group, expected)) return { ...base, reasonCodes: ["INVALID_OR_STALE_PAIR_GRAPH"] };
        const requiredUtama = experimentalMinimumUtama(members.length);
        const memberResults = snapshots.map((snapshot, index): ExperimentalMemberPosition => {
            const inspection = inspectExperimentalOtonanSnapshot(snapshot);
            // Incidence counts derived from verified edges, never trust a free member summary.
            const edges = expected.pairs.filter((p) =>
                p.memberAId === snapshot.memberId || p.memberBId === snapshot.memberId);
            const counts = {
                Utama: edges.filter((p) => p.category === "Utama").length,
                Madia: edges.filter((p) => p.category === "Madia").length,
                Nista: edges.filter((p) => p.category === "Nista").length,
            };
            const leaderGate = inspection.profiles.some((p) => p.profile === "Leader" && p.status === "matched");
            const passes = 2 * counts.Utama > members.length - 1;
            return {
                ...inspection, memberId: snapshot.memberId,
                displayName: members[index].displayName?.trim() || `Anggota ${index + 1}`,
                samyogaGate: { counts, requiredUtama, passes, policyApprovalStatus: "pending" },
                leaderGate, chairCandidate: leaderGate && passes,
                reasonCodes: [...inspection.reasonCodes, passes ? "SAMYOGA_SUPPORT_MET" : "SAMYOGA_SUPPORT_NOT_MET"],
            };
        });
        const candidates = memberResults.filter((r) => r.chairCandidate).map((r) => r.memberId).sort();
        return {
            ...base, status: "analyzed", memberResults,
            reasonCodes: ["EXPERIMENTAL_ONLY", "COMPARATOR_UNAVAILABLE", "NO_AUTOMATIC_DEPUTY"],
            chair: {
                ...base.chair,
                status: candidates.length === 0 ? "no_candidate" :
                    candidates.length === 1 ? "single_candidate" : "multiple_candidates",
                candidateMemberIds: candidates,
                singleCandidateMemberId: candidates.length === 1 ? candidates[0] : null,
                reasonCodes: [
                    "EXPERIMENTAL_POLICIES_PENDING", "COMPARATOR_UNAVAILABLE",
                    ...(candidates.length > 1 ? ["NO_FORCED_WINNER"] : []),
                ],
            },
        };
    } catch {
        // Do not log birth data, names or results, or persist an error payload.
        return { ...base, reasonCodes: ["INVALID_EXPERIMENT_INPUT"] };
    }
}
