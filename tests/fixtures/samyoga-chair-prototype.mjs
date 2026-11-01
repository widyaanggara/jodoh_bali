// Pure Node test prototype. No application, calendar, or production registry imports.
import { isRegisteredSyntheticChairScenario } from "./samyoga-chair-scenarios.mjs";

export const SYNTHETIC_CHAIR_POLICY_VERSION = "g6a8-pareto-synthetic-v1";
const CATEGORIES = ["Utama", "Madia", "Nista"];
const STATES = ["STRONGER", "WEAKER", "EQUIVALENT", "INCOMPARABLE", "UNKNOWN"];
const ELIGIBLE = new Set(["leader", "multiple_including_leader"]);
const OTONAN_STATES = new Set([
    ...ELIGIBLE, "non_leader_after_complete_scope", "multiple_without_leader",
    "conflicting_indicators", "insufficient_basis_after_complete_scope",
]);
const canonicalKey = (a, b) => JSON.stringify([a, b].sort());
const invert = (state) => state === "STRONGER" ? "WEAKER" : state === "WEAKER" ? "STRONGER" : state;
const sorted = (values) => [...new Set(values)].sort();

function graphError(scenario) {
    const { members, pairs, summaries } = scenario;
    if (!Array.isArray(members) || members.length < 3 || members.length > 6 ||
        members.some((member) => !member || typeof member !== "object" ||
            typeof member.id !== "string" || !member.id.trim() || member.id !== member.id.trim() ||
            !OTONAN_STATES.has(member.otonanState))) return "INVALID_GROUP_SHAPE";
    const ids = new Set(members.map((member) => member.id));
    if (ids.size !== members.length || !Array.isArray(summaries) ||
        summaries.length !== members.length || summaries.some((summary) => !summary || typeof summary !== "object") ||
        new Set(summaries.map((summary) => summary.memberId)).size !== ids.size ||
        summaries.some((summary) => !ids.has(summary.memberId))) return "INVALID_GROUP_SHAPE";
    if (!Array.isArray(pairs) || pairs.length !== members.length * (members.length - 1) / 2 ||
        pairs.some((pair) => !pair || typeof pair !== "object") ||
        new Set(pairs.map((pair) => pair.pairKey)).size !== pairs.length ||
        pairs.some((pair) => pair.a === pair.b || !ids.has(pair.a) || !ids.has(pair.b) ||
            pair.pairKey !== canonicalKey(pair.a, pair.b) || !CATEGORIES.includes(pair.category))) {
        return "INVALID_PAIR_GRAPH";
    }
    for (const summary of summaries) {
        const incident = pairs.filter((pair) => pair.a === summary.memberId || pair.b === summary.memberId);
        if (summary.pairCount !== members.length - 1 || incident.length !== members.length - 1 ||
            !summary.counts || Object.keys(summary.counts).length !== 3 ||
            CATEGORIES.some((category) => !Number.isInteger(summary.counts[category]) ||
                summary.counts[category] < 0 ||
                summary.counts[category] !== incident.filter((pair) => pair.category === category).length)) {
            return "RELATION_SUMMARY_MISMATCH";
        }
    }
    return null;
}
function readinessError(scenario) {
    if (scenario.members.some((member) => member.revision !== scenario.revision)) return "STALE_EVALUATION";
    const preset = scenario.baseApprovalPreset;
    if (preset === "production_baseline_empty_registry") return "OTONAN_BASIS_UNAVAILABLE";
    if (["required_evidence_unapproved", "otonan_rules_pending"].includes(preset)) return "OTONAN_APPROVAL_INCOMPLETE";
    if (preset !== "base_approvals_assumed_for_fixture_only") return "ALLOCATION_POLICY_UNAPPROVED";
    if (scenario.members.some((member) => [member.leaderRuleRefs, member.evidenceRefs].some((refs) =>
        !Array.isArray(refs) || !refs.length || refs.some((ref) => typeof ref !== "string" || !ref.trim())))) {
        return "OTONAN_APPROVAL_INCOMPLETE";
    }
    return null;
}
function analyzeComparator(comparator, ids) {
    if (!Array.isArray(comparator.rows)) return { error: "COMPARATOR_BASIS_UNAVAILABLE" };
    const normalized = new Map();
    for (const row of comparator.rows) {
        if (!row || typeof row !== "object") return { error: "COMPARATOR_BASIS_UNAVAILABLE" };
        const { memberAId: a, memberBId: b, result: state } = row;
        if (!ids.includes(a) || !ids.includes(b) || a === b || !STATES.includes(state) ||
            !Array.isArray(row.basisRefs) || row.basisRefs.some((ref) => typeof ref !== "string" || !ref.trim()) ||
            (state !== "UNKNOWN" && (!row.basisRefs.length || row.unknownReason !== null)) ||
            (state === "UNKNOWN" && (typeof row.unknownReason !== "string" || !row.unknownReason.trim()))) {
            return { error: "COMPARATOR_BASIS_UNAVAILABLE" };
        }
        const key = canonicalKey(a, b), normalizedState = a < b ? state : invert(state);
        if (normalized.has(key)) {
            return { error: "COMPARATOR_INCONSISTENT",
                detail: normalized.get(key) === normalizedState ? "COMPARATOR_DUPLICATE_PAIR" : "COMPARATOR_DIRECTION_MISMATCH" };
        }
        normalized.set(key, normalizedState);
    }
    if (normalized.size !== ids.length * (ids.length - 1) / 2) return { error: "COMPARATOR_BASIS_UNAVAILABLE" };
    const relation = (a, b) => a < b ? normalized.get(canonicalKey(a, b)) : invert(normalized.get(canonicalKey(a, b)));
    const parent = new Map(ids.map((id) => [id, id]));
    const root = (id) => {
        while (parent.get(id) !== id) id = parent.get(id);
        return id;
    };
    for (const a of ids) for (const b of ids) {
        if (a !== b && relation(a, b) === "EQUIVALENT") parent.set(root(a), root(b));
    }
    const quotient = new Map(), strict = new Map(ids.map((id) => [root(id), new Set()]));
    for (let i = 0; i < ids.length; i++) {
        for (let j = i + 1; j < ids.length; j++) {
            const a = ids[i], b = ids[j], state = relation(a, b), ra = root(a), rb = root(b);
            if (ra === rb && state !== "EQUIVALENT") return { error: "COMPARATOR_INCONSISTENT", detail: "EQUIVALENCE_CONTRADICTION" };
            if (ra === rb) continue;
            // Equivalent profiles must have the same state against another class,
            // including UNKNOWN. Reject mixed coverage; never fill missing proof.
            const key = canonicalKey(ra, rb), canonicalState = ra < rb ? state : invert(state);
            if (quotient.has(key) && quotient.get(key) !== canonicalState) return { error: "COMPARATOR_INCONSISTENT", detail: "EQUIVALENCE_ORDER_CONTRADICTION" };
            quotient.set(key, canonicalState);
            if (state === "STRONGER") strict.get(ra).add(rb);
            if (state === "WEAKER") strict.get(rb).add(ra);
        }
    }
    const visiting = new Set(), visited = new Set();
    const cycle = (id) => {
        if (visiting.has(id)) return true;
        if (visited.has(id)) return false;
        visiting.add(id);
        for (const next of strict.get(id)) if (cycle(next)) return true;
        visiting.delete(id); visited.add(id);
        return false;
    };
    // R1 rejects strict cycles even without a claim that all partial data is transitive.
    if ([...strict.keys()].some(cycle)) return { error: "COMPARATOR_INCONSISTENT", detail: "STRICT_CYCLE" };
    if (comparator.claimsTransitivity) {
        for (const a of ids) for (const b of ids) for (const c of ids) {
            if (a !== b && b !== c && a !== c && relation(a, b) === "STRONGER" &&
                relation(b, c) === "STRONGER" && relation(a, c) !== "STRONGER") {
                return { error: "COMPARATOR_INCONSISTENT", detail: "TRANSITIVITY_NOT_SUPPORTED" };
            }
        }
    }
    return { relation };
}
const explanations = {
    SYNTHETIC_CONTEXT_REQUIRED: "Hanya capability fixture sintetis dalam proses tes yang diterima.",
    INVALID_GROUP_SHAPE: "Struktur anggota/assessment sintetis tidak valid.",
    INVALID_PAIR_GRAPH: "Relasi harus lengkap, unik, tanpa self-pair atau ID asing.",
    RELATION_SUMMARY_MISMATCH: "Ringkasan relasi tidak sesuai graf atau N−1.",
    STALE_EVALUATION: "Revisi assessment berbeda dari revisi kelompok.",
    OTONAN_BASIS_UNAVAILABLE: "Basis Leader belum tersedia; bukan penilaian tidak layak personal.",
    OTONAN_APPROVAL_INCOMPLETE: "Asumsi approval/bukti fixture tidak lengkap.",
    ALLOCATION_POLICY_UNAPPROVED: "Kebijakan dasar eksperimen belum tersedia pada fixture.",
    OTONAN_COMPARATOR_UNAVAILABLE: "Pembanding kekuatan tidak tersedia; jumlah Utama tidak menggantikannya.",
    OTONAN_COMPARATOR_UNAPPROVED: "Pembanding belum disetujui dalam konteks fixture.",
    COMPARATOR_BASIS_UNAVAILABLE: "Record pembandingan tidak lengkap atau basisnya tidak valid.",
    COMPARATOR_INCONSISTENT: "Comparator inkonsisten; tidak ada kandidat Ketua.",
    OTONAN_COMPARISON_UNKNOWN: "UNKNOWN bukan EQUIVALENT dan tidak memberi dominasi.",
    OTONAN_RELATIVE_INCOMPARABLE: "Profil tidak dapat diurutkan oleh comparator fixture.",
    BOTH_INDICATORS_TIED: "Kesetaraan Otonan dan jumlah Utama tidak memberi dominasi.",
    NO_UNIVERSAL_DOMINATOR: "Tidak ada kandidat yang terbukti mendominasi semua kandidat lain.",
    OPPOSING_OTONAN_AND_UTAMA: "Otonan dan jumlah Utama mengunggulkan kandidat yang berbeda.",
    UNIQUE_UNIVERSAL_DOMINATOR: "Satu kandidat sintetis mendominasi semua kandidat lain.",
    SINGLE_DUAL_GATE_CANDIDATE: "Hanya satu kandidat lolos kedua gerbang; tidak ada klaim lebih kuat.",
    NO_DUAL_GATE_CANDIDATE: "Tidak ada kandidat yang lolos kedua gerbang pada fixture lengkap.",
    DEPUTY_POLICY_UNAPPROVED: "Policy Wakil masih pending; alternatif bukan penetapan Wakil.",
    NISTA_SYMBOLIC_ATTENTION: "Nista adalah perhatian simbolis, bukan diskualifikasi.",
};

export function evaluateSyntheticChairScenario(scenario) {
    const output = {
        marker: "synthetic-test-only", syntheticTestOnly: true, fixtureId: null,
        policyVersion: SYNTHETIC_CHAIR_POLICY_VERSION,
        status: "not_evaluated", eligibleMemberIds: [], qualifiedMemberIds: [],
        chairMemberId: null, deputyMemberId: null, deputyPolicyStatus: "pending",
        alternativeCandidateIds: [], memberDecisions: [], comparisons: [], dominancePairs: [],
        universalDominatorIds: [], reasonCodes: [], explanations: [],
        interpretationScope: "synthetic-symbolic-experiment-only",
    };
    const finish = (status, reasons, chair = null) => {
        output.status = status; output.chairMemberId = chair;
        output.reasonCodes = sorted([...output.reasonCodes, ...reasons]);
        output.explanations = output.reasonCodes.map((code) => explanations[code]).filter(Boolean);
        output.alternativeCandidateIds = output.qualifiedMemberIds.filter((id) => id !== chair);
        // G6A.8 never activates even the fixture's counterfactual deputy approval.
        if (chair && output.qualifiedMemberIds.length >= 2) {
            output.reasonCodes = sorted([...output.reasonCodes, "DEPUTY_POLICY_UNAPPROVED"]);
            if (!output.explanations.includes(explanations.DEPUTY_POLICY_UNAPPROVED)) output.explanations.push(explanations.DEPUTY_POLICY_UNAPPROVED);
        }
        return output;
    };
    if (!isRegisteredSyntheticChairScenario(scenario)) return finish("not_evaluated", ["SYNTHETIC_CONTEXT_REQUIRED"]);
    output.fixtureId = scenario.fixtureId;
    if (scenario.marker !== "synthetic-test-only" || scenario.policyVersion !== SYNTHETIC_CHAIR_POLICY_VERSION) {
        return finish("not_evaluated", ["SYNTHETIC_CONTEXT_REQUIRED"]);
    }
    const invalidGraph = graphError(scenario);
    if (invalidGraph) return finish("not_evaluated", [invalidGraph]);
    const readiness = readinessError(scenario);
    if (readiness) return finish("not_evaluated", [readiness]);
    const minimumUtama = Math.floor((scenario.members.length - 1) / 2) + 1;
    output.memberDecisions = [...scenario.members].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0).map((member) => {
        const counts = { ...scenario.summaries.find((summary) => summary.memberId === member.id).counts };
        const leader = ELIGIBLE.has(member.otonanState), majority = 2 * counts.Utama > scenario.members.length - 1;
        const attentionPairKeys = scenario.pairs.filter((pair) => pair.category === "Nista" &&
            (pair.a === member.id || pair.b === member.id)).map((pair) => pair.pairKey).sort();
        return {
            memberId: member.id, counts, minimumUtama,
            otonanGate: leader ? "QUALIFIED" : "NOT_QUALIFIED",
            samyogaGate: majority ? "QUALIFIED" : "NOT_QUALIFIED",
            otonanReason: leader ? "LEADER_SUPPORTED" : member.otonanState === "conflicting_indicators" ?
                "OTONAN_CONFLICT" : member.otonanState === "insufficient_basis_after_complete_scope" ?
                    "LEADER_BASIS_INSUFFICIENT" : "LEADER_NOT_SUPPORTED",
            samyogaReason: majority ? "UTAMA_MAJORITY_MET" : "UTAMA_MAJORITY_NOT_MET",
            leaderRuleRefs: leader ? [...member.leaderRuleRefs] : [],
            evidenceRefs: leader ? [...member.evidenceRefs] : [],
            attentionPairKeys,
        };
    });
    output.eligibleMemberIds = output.memberDecisions.filter((member) => member.otonanGate === "QUALIFIED").map((member) => member.memberId);
    output.qualifiedMemberIds = output.memberDecisions.filter((member) =>
        member.otonanGate === "QUALIFIED" && member.samyogaGate === "QUALIFIED").map((member) => member.memberId);
    const q = output.qualifiedMemberIds;
    if (scenario.pairs.some((pair) => pair.category === "Nista")) output.reasonCodes.push("NISTA_SYMBOLIC_ATTENTION");
    if (!q.length) return finish("no_qualified_candidate", ["NO_DUAL_GATE_CANDIDATE"]);
    if (q.length === 1) return finish("chair_only", ["SINGLE_DUAL_GATE_CANDIDATE"], q[0]);
    if (!scenario.comparator || typeof scenario.comparator !== "object") {
        return finish("not_evaluated", ["COMPARATOR_BASIS_UNAVAILABLE"]);
    }
    if (scenario.comparator.mode !== "approved_relative_otonan") {
        output.comparisons = q.flatMap((a, i) => q.slice(i + 1).map((b) => ({
            memberAId: a, memberBId: b, result: "UNKNOWN", unknownReason: "comparator-unavailable", basisRefs: [],
        })));
        return finish("not_evaluated", ["OTONAN_COMPARATOR_UNAVAILABLE"]);
    }
    if (scenario.comparator.approval !== "synthetic_assumed_approved") {
        return finish("not_evaluated", ["OTONAN_COMPARATOR_UNAPPROVED"]);
    }
    const analyzed = analyzeComparator(scenario.comparator, q);
    if (analyzed.error) return finish("not_evaluated", [analyzed.error, ...(analyzed.detail ? [analyzed.detail] : [])]);
    const counts = new Map(output.memberDecisions.map((member) => [member.memberId, member.counts.Utama]));
    let opposing = false;
    for (let i = 0; i < q.length; i++) {
        for (let j = i + 1; j < q.length; j++) {
            const a = q[i], b = q[j], state = analyzed.relation(a, b);
            const source = scenario.comparator.rows.find((row) => canonicalKey(row.memberAId, row.memberBId) === canonicalKey(a, b));
            output.comparisons.push({
                memberAId: a, memberBId: b, result: state,
                basisRefs: [...source.basisRefs], unknownReason: source.unknownReason,
            });
            if (state === "UNKNOWN") output.reasonCodes.push("OTONAN_COMPARISON_UNKNOWN");
            if (state === "INCOMPARABLE") output.reasonCodes.push("OTONAN_RELATIVE_INCOMPARABLE");
            if (state === "EQUIVALENT") {
                if (counts.get(a) > counts.get(b)) output.dominancePairs.push({ dominatorId: a, otherId: b });
                else if (counts.get(b) > counts.get(a)) output.dominancePairs.push({ dominatorId: b, otherId: a });
                else output.reasonCodes.push("BOTH_INDICATORS_TIED");
            }
            if (state === "STRONGER" && counts.get(a) >= counts.get(b)) output.dominancePairs.push({ dominatorId: a, otherId: b });
            if (state === "WEAKER" && counts.get(b) >= counts.get(a)) output.dominancePairs.push({ dominatorId: b, otherId: a });
            if ((state === "STRONGER" && counts.get(a) < counts.get(b)) ||
                (state === "WEAKER" && counts.get(b) < counts.get(a))) opposing = true;
        }
    }
    output.universalDominatorIds = q.filter((a) => q.every((b) => a === b ||
        output.dominancePairs.some((edge) => edge.dominatorId === a && edge.otherId === b)));
    if (output.universalDominatorIds.length > 1) return finish("not_evaluated", ["COMPARATOR_INCONSISTENT"]);
    if (output.universalDominatorIds.length === 1) {
        return finish("chair_only", ["UNIQUE_UNIVERSAL_DOMINATOR"], output.universalDominatorIds[0]);
    }
    return opposing ? finish("conflicting_priority", ["OPPOSING_OTONAN_AND_UTAMA"]) :
        finish("undetermined", ["NO_UNIVERSAL_DOMINATOR"]);
}

