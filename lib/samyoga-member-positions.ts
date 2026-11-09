import { createSamyogaGroupCalendarSnapshots, type SamyogaCalendarMasterInterpretation } from "./samyoga-calendar-snapshot";
import { calculateSamyogaGroup, type SamyogaGroupMemberInput, type SamyogaGroupResult, type SamyogaCategoryCounts } from "./samyoga-group";
import type { SamyogaSymbolicDimension } from "./samyoga-position-evidence";
import {
    CONTRIBUTION_PROFILE_RULES, MEMBER_CONTRIBUTION_MAPPINGS, MEMBER_POSITION_POLICY_VERSION,
    MEMBER_POSITION_DISCLAIMER, UNSPECIFIED_PARTICIPATION_LABEL,
    type ContributionMapping, type ContributionProfileRule,
} from "./samyoga-member-position-rules";

export interface NamedPositionMember extends SamyogaGroupMemberInput { displayName?: string }
export interface ContributionProfileResult extends ContributionProfileRule {
    status: "matched" | "partial" | "review_required" | "unsupported";
    supportedDimensions: SamyogaSymbolicDimension[];
    missingDimensions: SamyogaSymbolicDimension[];
    supportEvidenceIds: string[];
    reviewEvidenceIds: string[];
    reasonCodes: string[];
}
export interface MemberPositionResult {
    memberId: string;
    displayName: string;
    policyVersion: string;
    status: "profiles_supported" | "review_required" | "partial_profile" | "ambiguous_evidence" | "insufficient_basis";
    participationStatus: "Anggota Kelompok";
    participationLabel: string;
    palintangan: {
        name: string | null; masterRecordId: string | null; originalCharacter: string | null;
        label: string | null; meaning: string | null;
    };
    otonan: {
        indicators: { indicatorType: string; wewaranCycle: string | null; value: string }[];
        interpretations: SamyogaCalendarMasterInterpretation[];
        baliDayBoundaryApplied: boolean;
    };
    evidence: readonly Readonly<ContributionMapping>[];
    cautions: readonly Readonly<ContributionMapping>[];
    ambiguousEvidence: readonly Readonly<ContributionMapping>[];
    profiles: ContributionProfileResult[];
    contributionProfiles: string[];
    partialProfiles: string[];
    recommendedPositions: string[];
    explanations: string[];
    leadershipPaths: ("direct" | "indirect")[];
    samyogaGate: { counts: SamyogaCategoryCounts; requiredUtama: number; passes: boolean; policyApprovalStatus: "pending" };
    chairCandidate: boolean;
    reasonCodes: string[];
}
export interface MemberPositionAnalysis {
    status: "analyzed" | "error";
    policyVersion: string;
    experimental: true;
    dataOrigin: "existing-otonan-and-samyoga-engines";
    disclaimer: string;
    memberResults: MemberPositionResult[];
    chair: {
        status: "not_evaluated" | "no_candidate" | "single_candidate" | "multiple_candidates";
        candidateMemberIds: string[];
        comparatorStatus: "UNKNOWN";
        selectedChairMemberId: null;
        deputyMemberId: null;
    };
    unavailablePositions: readonly ["Koordinator", "Wakil Ketua"];
    reasonCodes: string[];
}

/** Exact identity + full text + audited phrase. This is validation, never keyword classification. */
export function matchContributionMappings(
    interpretations: readonly SamyogaCalendarMasterInterpretation[],
): readonly Readonly<ContributionMapping>[] {
    return MEMBER_CONTRIBUTION_MAPPINGS.filter(mapping => interpretations.some(source =>
        source.indicatorType === mapping.indicatorType &&
        source.wewaranCycle === mapping.wewaranCycle &&
        source.indicatorValue === mapping.indicatorValue &&
        source.masterRecordId === mapping.masterRecordId &&
        source.sourceField === mapping.sourceField &&
        source.text === mapping.excerpt && source.text.includes(mapping.sourcePhrase),
    ));
}

/** Interprets only fixed internal catalogue objects; no user flags or production approvals. */
export function evaluateContributionProfiles(
    evidence: readonly Readonly<ContributionMapping>[],
): ContributionProfileResult[] {
    const trusted = MEMBER_CONTRIBUTION_MAPPINGS.filter(entry => evidence.includes(entry));
    return CONTRIBUTION_PROFILE_RULES.map(rule => {
        const support = trusted.filter(e =>
            e.polarity === "support" && e.semanticStatus !== "ambiguous" &&
            (!rule.textualOnly || e.semanticStatus === "textual") && rule.dimensions.includes(e.dimension));
        const supported = rule.dimensions.filter(d => support.some(e => e.dimension === d));
        const missing = rule.dimensions.filter(d => !supported.includes(d));
        const review = trusted.filter(e => e.cautionEffect === "review" && e.reviewProfiles.includes(rule.id));
        const complete = missing.length === 0;
        return {
            ...rule,
            status: complete ? review.length ? "review_required" : "matched" :
                supported.length ? "partial" : "unsupported",
            supportedDimensions: [...supported], missingDimensions: [...missing],
            supportEvidenceIds: support.map(e => e.evidenceId),
            reviewEvidenceIds: review.map(e => e.evidenceId),
            reasonCodes: [
                complete ? review.length ? "PROFILE_CONTEXT_REVIEW_REQUIRED" : "PROFILE_DIMENSIONS_SUPPORTED" :
                    supported.length ? "PROFILE_PARTIAL" : "PROFILE_BASIS_INSUFFICIENT",
                ...(rule.textualOnly ? ["TEXTUAL_SUPPORT_REQUIRED"] : []),
                "EXPERIMENTAL_MAPPING", "PROVENANCE_UNVERIFIED",
            ],
        };
    });
}

export function analyzeSamyogaMemberPositions(
    members: readonly NamedPositionMember[], group: SamyogaGroupResult,
): MemberPositionAnalysis {
    const base: MemberPositionAnalysis = {
        status: "error", policyVersion: MEMBER_POSITION_POLICY_VERSION, experimental: true,
        dataOrigin: "existing-otonan-and-samyoga-engines", disclaimer: MEMBER_POSITION_DISCLAIMER,
        memberResults: [], unavailablePositions: ["Koordinator", "Wakil Ketua"],
        chair: { status: "not_evaluated", candidateMemberIds: [], comparatorStatus: "UNKNOWN", selectedChairMemberId: null, deputyMemberId: null },
        reasonCodes: [],
    };
    try {
        const expected = calculateSamyogaGroup(members);
        // Includes every pair field, summary and input result; no free Utama count or stale graph.
        if (JSON.stringify(group) !== JSON.stringify(expected))
            return { ...base, reasonCodes: ["INVALID_OR_STALE_PAIR_GRAPH"] };
        const snapshots = createSamyogaGroupCalendarSnapshots(members);
        const requiredUtama = Math.floor((members.length - 1) / 2) + 1;
        const memberResults = snapshots.map((snapshot, index): MemberPositionResult => {
            const evidence = matchContributionMappings(snapshot.masterInterpretations);
            const profiles = evaluateContributionProfiles(evidence);
            const leadershipPaths: ("direct" | "indirect")[] = [];
            if (profiles.some(p => p.id === "leader-direct" && p.status === "matched")) leadershipPaths.push("direct");
            if (profiles.some(p => p.id === "leader-indirect" && p.status === "matched")) leadershipPaths.push("indirect");
            const contributionProfiles = profiles.filter(p => !p.id.startsWith("leader-") && p.status === "matched").map(p => p.label);
            const incident = expected.pairs.filter(p => p.memberAId === snapshot.memberId || p.memberBId === snapshot.memberId);
            const counts = {
                Utama: incident.filter(p => p.category === "Utama").length,
                Madia: incident.filter(p => p.category === "Madia").length,
                Nista: incident.filter(p => p.category === "Nista").length,
            };
            const passes = 2 * counts.Utama > members.length - 1;
            const chairCandidate = leadershipPaths.length > 0 && passes;
            const recommendedPositions = [...contributionProfiles, ...(chairCandidate ? ["Kandidat Ketua"] : [])];
            const ambiguousEvidence = evidence.filter(e => e.semanticStatus === "ambiguous");
            const cautions = evidence.filter(e => e.polarity === "caution");
            const lintang = snapshot.masterInterpretations.filter(i => i.indicatorType === "lintang");
            const readLintang = (field: string) => lintang.find(i => i.sourceField === field)?.text ?? null;
            const status = recommendedPositions.length ? "profiles_supported" :
                profiles.some(p => p.status === "review_required") ? "review_required" :
                    profiles.some(p => p.status === "partial") ? "partial_profile" :
                        ambiguousEvidence.length ? "ambiguous_evidence" : "insufficient_basis";
            return {
                memberId: snapshot.memberId,
                displayName: members[index].displayName?.trim() || "Anggota " + (index + 1),
                policyVersion: MEMBER_POSITION_POLICY_VERSION, status,
                participationStatus: "Anggota Kelompok",
                participationLabel: recommendedPositions.length ? "Anggota Kelompok" : UNSPECIFIED_PARTICIPATION_LABEL,
                palintangan: {
                    name: lintang[0]?.indicatorValue ?? null,
                    masterRecordId: lintang[0]?.masterRecordId ?? null,
                    originalCharacter: readLintang("penjelasan"), label: readLintang("label"), meaning: readLintang("makna"),
                },
                otonan: {
                    indicators: snapshot.calculatedIndicators.map(({ indicatorType, wewaranCycle, value }) => ({ indicatorType, wewaranCycle, value })),
                    interpretations: snapshot.masterInterpretations.map(i => ({ ...i })),
                    baliDayBoundaryApplied: snapshot.baliDayBoundaryApplied,
                },
                evidence, cautions, ambiguousEvidence, profiles, contributionProfiles,
                partialProfiles: profiles.filter(p => p.status === "partial").map(p => p.label),
                recommendedPositions,
                explanations: profiles.filter(p => p.status === "matched").map(p => p.explanation),
                leadershipPaths,
                samyogaGate: { counts, requiredUtama, passes, policyApprovalStatus: "pending" },
                chairCandidate,
                reasonCodes: [
                    status.toUpperCase(), "PALINTANGAN_PRIMARY_WITH_BALI_CONTEXT", "EXPERIMENTAL_ONLY",
                    "PROVENANCE_UNVERIFIED", "CULTURAL_REVIEW_PENDING", "COMPARATOR_UNKNOWN", "NO_AUTOMATIC_DEPUTY",
                    ...(evidence.some(e => e.dependencyRefs.length) ? ["DEPENDENT_SOURCE_DERIVATION"] : []),
                    ...(cautions.length ? ["CAUTION_CONTEXT_RETAINED"] : []),
                    ...(ambiguousEvidence.length ? ["AMBIGUOUS_MAPPING_NOT_USED_AS_SUPPORT"] : []),
                    passes ? "SAMYOGA_MAJORITY_MET" : "SAMYOGA_MAJORITY_NOT_MET",
                ],
            };
        });
        // Sort only for stable serialization, never for relative strength or role priority.
        const candidateMemberIds = memberResults.filter(m => m.chairCandidate).map(m => m.memberId).sort();
        return {
            ...base, status: "analyzed", memberResults,
            chair: {
                ...base.chair, candidateMemberIds,
                status: candidateMemberIds.length === 0 ? "no_candidate" :
                    candidateMemberIds.length === 1 ? "single_candidate" : "multiple_candidates",
            },
            reasonCodes: ["INTERNAL_EXPERIMENT_ONLY", "POLICY_APPROVAL_PENDING", "NO_FORCED_WINNER", "NO_AUTOMATIC_DEPUTY"],
        };
    } catch {
        return { ...base, reasonCodes: ["INVALID_POSITION_INPUT"] };
    }
}
