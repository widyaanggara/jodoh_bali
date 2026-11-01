// Node-only synthetic fixture registry. Never import from application/runtime code.
import fs from "node:fs";

const matrixUrl = new URL("../../docs/samyoga-chair-test-matrix-g6a7.md", import.meta.url);
const markdown = fs.readFileSync(matrixUrl, "utf8");
const jsonBlocks = [...markdown.matchAll(/\x60{3}json\r?\n([\s\S]*?)\r?\n\x60{3}/g)];
if (jsonBlocks.length !== 1) throw new Error("Expected one R1 fixture document.");
const matrix = JSON.parse(jsonBlocks[0][1]);
if (matrix.fixtureVersion !== "g6a7r1-synthetic-design-fixtures-0.2" ||
    matrix.syntheticOnly !== true || matrix.cases.length !== 71) {
    throw new Error("Unrecognized R1 synthetic fixture version.");
}
const clone = (value) => structuredClone(value);
const originals = new Map(matrix.cases.map((entry) => [entry.id, entry]));
if (originals.size !== 71 || matrix.cases.some((entry) => entry.syntheticOnly !== true)) {
    throw new Error("Invalid synthetic fixture catalog.");
}
const canonicalKey = (a, b) => JSON.stringify([a, b].sort());
const reverseState = (state) => ({
    STRONGER: "WEAKER", WEAKER: "STRONGER", EQUIVALENT: "EQUIVALENT",
    INCOMPARABLE: "INCOMPARABLE", UNKNOWN: "UNKNOWN",
})[state];
const comparison = (a, b, result) => ({
    memberAId: a, memberBId: b, result,
    basisRefs: ["synthetic-test-only:relative-proof"],
    unknownReason: result === "UNKNOWN" ? "synthetic-insufficient-basis" : null,
});
const extras = new Map();
function extra(id, baseId, modify, expected, reasons = []) {
    extras.set(id, { baseId, modify, expected, reasons });
}
const expected = (status, q = [], chair = null) => ({
    status, qualifiedMemberIds: q, chairMemberId: chair, deputyMemberId: null,
});
extra("G8-TRANSITIVE-BROKEN", "R1-THREE-PARETO", (scenario) => {
    scenario.comparator.claimsTransitivity = true;
    scenario.comparator.rows = [
        comparison("a", "b", "STRONGER"), comparison("b", "c", "STRONGER"),
        comparison("a", "c", "INCOMPARABLE"),
    ];
}, expected("not_evaluated", ["a", "b", "c"]), ["COMPARATOR_INCONSISTENT"]);
extra("G8-TRANSITIVE-UNKNOWN", "G8-TRANSITIVE-BROKEN", (scenario) => {
    scenario.comparator.rows[2] = comparison("a", "c", "UNKNOWN");
}, expected("not_evaluated", ["a", "b", "c"]), ["COMPARATOR_INCONSISTENT"]);
extra("G8-TRANSITIVE-VALID", "G8-TRANSITIVE-BROKEN", (scenario) => {
    scenario.comparator.rows[2] = comparison("a", "c", "STRONGER");
}, expected("chair_only", ["a", "b", "c"], "a"));
extra("G8-STRONGER-BOTH-DIRECTIONS", "R1-STRONGER-MORE", (scenario) => {
    scenario.comparator.rows.push(comparison("b", "a", "STRONGER"));
}, expected("not_evaluated", ["a", "b"]), ["COMPARATOR_DIRECTION_MISMATCH"]);
extra("G8-REVERSE-DUPLICATE", "R1-STRONGER-MORE", (scenario) => {
    scenario.comparator.rows.push(comparison("b", "a", "WEAKER"));
}, expected("not_evaluated", ["a", "b"]), ["COMPARATOR_DUPLICATE_PAIR"]);
extra("G8-EQUIVALENT-ASYMMETRIC", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.comparator.rows.push(comparison("b", "a", "STRONGER"));
}, expected("not_evaluated", ["a", "b"]), ["COMPARATOR_DIRECTION_MISMATCH"]);
extra("G8-INCOMPARABLE-ASYMMETRIC", "R1-INCOMPARABLE-DIFF", (scenario) => {
    scenario.comparator.rows.push(comparison("b", "a", "EQUIVALENT"));
}, expected("not_evaluated", ["a", "b"]), ["COMPARATOR_DIRECTION_MISMATCH"]);
extra("G8-EQUIVALENCE-CONTRADICTION", "R1-THREE-PARETO", (scenario) => {
    scenario.comparator.rows = [
        comparison("a", "b", "EQUIVALENT"), comparison("b", "c", "EQUIVALENT"),
        comparison("a", "c", "STRONGER"),
    ];
}, expected("not_evaluated", ["a", "b", "c"]), ["COMPARATOR_INCONSISTENT"]);
extra("G8-INCOMPLETE-COMPARATOR", "R1-THREE-PARETO", (scenario) => {
    scenario.comparator.rows.pop();
}, expected("not_evaluated", ["a", "b", "c"]), ["COMPARATOR_BASIS_UNAVAILABLE"]);
extra("G8-THREE-MEMBERS-TWO-CANDIDATES", "ALL-U-3", (scenario) => {
    scenario.members.find((member) => member.id === "c").otonanState = "non_leader_after_complete_scope";
    scenario.comparator = {
        mode: "approved_relative_otonan", approval: "synthetic_assumed_approved",
        claimsTransitivity: false, rows: [comparison("a", "b", "EQUIVALENT")],
    };
}, expected("undetermined", ["a", "b"]));
extra("G8-FRACTIONAL-SUMMARY", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.summaries[0].counts.Utama = 1.5;
}, expected("not_evaluated"), ["RELATION_SUMMARY_MISMATCH"]);
extra("G8-NAN-SUMMARY", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.summaries[0].counts.Utama = NaN;
}, expected("not_evaluated"), ["RELATION_SUMMARY_MISMATCH"]);
extra("G8-UNKNOWN-CATEGORY", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.pairs[0].category = "Other";
}, expected("not_evaluated"), ["INVALID_PAIR_GRAPH"]);
extra("G8-FORGED-LEADER-PROOF", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.members[0].leaderRuleRefs = [];
}, expected("not_evaluated"), ["OTONAN_APPROVAL_INCOMPLETE"]);
extra("G8-SIZE-TWO", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.members = scenario.members.slice(0, 2);
}, expected("not_evaluated"), ["INVALID_GROUP_SHAPE"]);
extra("G8-SIZE-SEVEN", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.members.push(...["e", "f", "g"].map((id) => ({ ...clone(scenario.members[0]), id })));
}, expected("not_evaluated"), ["INVALID_GROUP_SHAPE"]);

// G6A.8-R1 adversarial fixtures; fixed IDs only, never user-provided scenarios.
extra("G8R1-EQUIVALENCE-UNKNOWN", "R1-THREE-PARETO", (scenario) => {
    scenario.comparator.rows = [
        comparison("a", "b", "EQUIVALENT"), comparison("a", "c", "STRONGER"),
        comparison("b", "c", "UNKNOWN"),
    ];
}, expected("not_evaluated", ["a", "b", "c"]), ["COMPARATOR_INCONSISTENT"]);
extra("G8R1-EQUIVALENCE-KNOWN", "G8R1-EQUIVALENCE-UNKNOWN", (scenario) => {
    scenario.comparator.rows[2] = comparison("b", "c", "STRONGER");
}, expected("chair_only", ["a", "b", "c"], "a"));
extra("G8R1-EQUIVALENCE-ALL-UNKNOWN", "G8R1-EQUIVALENCE-UNKNOWN", (scenario) => {
    scenario.comparator.rows[1] = comparison("a", "c", "UNKNOWN");
}, expected("undetermined", ["a", "b", "c"]));
extra("G8R1-NULL-MEMBER", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.members[0] = null;
}, expected("not_evaluated"), ["INVALID_GROUP_SHAPE"]);
extra("G8R1-NULL-SUMMARY", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.summaries[0] = null;
}, expected("not_evaluated"), ["INVALID_GROUP_SHAPE"]);
extra("G8R1-NULL-PAIR", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.pairs[0] = null;
}, expected("not_evaluated"), ["INVALID_PAIR_GRAPH"]);
extra("G8R1-NULL-COMPARATOR", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.comparator = null;
}, expected("not_evaluated", ["a", "b"]), ["COMPARATOR_BASIS_UNAVAILABLE"]);
extra("G8R1-NONARRAY-ROWS", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.comparator.rows = {};
}, expected("not_evaluated", ["a", "b"]), ["COMPARATOR_BASIS_UNAVAILABLE"]);
extra("G8R1-NULL-ROW", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.comparator.rows[0] = null;
}, expected("not_evaluated", ["a", "b"]), ["COMPARATOR_BASIS_UNAVAILABLE"]);
extra("G8R1-MALFORMED-PROOF", "R1-EQUIVALENT-DIFF", (scenario) => {
    scenario.members[0].leaderRuleRefs = null;
}, expected("not_evaluated"), ["OTONAN_APPROVAL_INCOMPLETE"]);
extra("G8R1-IMPOSSIBLE-DEGREES", "G8-THREE-MEMBERS-TWO-CANDIDATES", (scenario) => {
    scenario.summaries.find((summary) => summary.memberId === "c").counts = { Utama: 0, Madia: 2, Nista: 0 };
}, expected("not_evaluated"), ["RELATION_SUMMARY_MISMATCH"]);
extra("G8R1-BALANCED-WRONG-SUMMARY", "R1-EQUIVALENT-DIFF", (scenario) => {
    const a = scenario.summaries.find((summary) => summary.memberId === "a");
    const b = scenario.summaries.find((summary) => summary.memberId === "b");
    [a.counts, b.counts] = [b.counts, a.counts];
}, expected("not_evaluated"), ["RELATION_SUMMARY_MISMATCH"]);
extra("G8R1-SAME-SIZE-ASYMMETRIC-GRAPH", "R1-EQUIVALENT-DIFF", (scenario) => {
    const pair = scenario.pairs[1];
    scenario.pairs[0] = { ...clone(pair), a: pair.b, b: pair.a, category: "Nista" };
}, expected("not_evaluated"), ["INVALID_PAIR_GRAPH"]);

const registered = new WeakSet();
function freezeDeep(value) {
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
        Object.values(value).forEach(freezeDeep);
        Object.freeze(value);
    }
    return value;
}
function buildOriginal(raw) {
    const memberIds = [...raw.memberIds];
    const pairs = [];
    const utama = new Set(raw.utamaPairs.map(([a, b]) => canonicalKey(a, b)));
    const nista = new Set(raw.nistaPairs.map(([a, b]) => canonicalKey(a, b)));
    if (utama.size !== raw.utamaPairs.length || nista.size !== raw.nistaPairs.length ||
        [...utama].some((key) => nista.has(key))) throw new Error("Malformed source fixture.");
    for (let i = 0; i < memberIds.length; i++) {
        for (let j = i + 1; j < memberIds.length; j++) {
            const a = memberIds[i], b = memberIds[j], pairKey = canonicalKey(a, b);
            pairs.push({ a, b, pairKey, category: utama.has(pairKey) ? "Utama" : nista.has(pairKey) ? "Nista" : "Madia" });
        }
    }
    const summaries = memberIds.map((memberId) => {
        const incident = pairs.filter((pair) => pair.a === memberId || pair.b === memberId);
        return {
            memberId, pairCount: incident.length,
            counts: Object.fromEntries(["Utama", "Madia", "Nista"].map((category) =>
                [category, incident.filter((pair) => pair.category === category).length])),
        };
    });
    const scenario = {
        fixtureId: raw.id, marker: "synthetic-test-only", revision: "synthetic-input-v1",
        policyVersion: "g6a8-pareto-synthetic-v1",
        baseApprovalPreset: raw.approvalPreset,
        members: memberIds.map((id) => ({
            id, label: "Synthetic member " + id, revision: "synthetic-input-v1",
            otonanState: raw.otonanByMember[id] ?? "non_leader_after_complete_scope",
            leaderRuleRefs: ["synthetic-test-only:leader-rule"],
            evidenceRefs: ["synthetic-test-only:evidence:" + id],
        })),
        pairs, summaries,
        comparator: {
            mode: raw.comparisonMode, approval: raw.comparisonApproval,
            claimsTransitivity: false, rows: clone(raw.comparisons),
        },
    };
    const mutation = raw.mutation;
    if (mutation === "duplicate_pair") pairs.push(clone(pairs[0]));
    if (mutation === "reversed_duplicate_pair") pairs.push({ ...clone(pairs[0]), a: pairs[0].b, b: pairs[0].a });
    if (mutation === "missing_pair") pairs.pop();
    if (mutation === "self_pair") pairs.push({ a: "a", b: "a", pairKey: canonicalKey("a", "a"), category: "Madia" });
    if (mutation === "foreign_pair") pairs.push({ a: "a", b: "z", pairKey: canonicalKey("a", "z"), category: "Madia" });
    if (mutation === "wrong_pair_key") pairs[0].pairKey = "wrong";
    if (mutation === "summary_mismatch") summaries[0].counts.Utama++;
    if (mutation === "negative_count") summaries[0].counts.Madia = -1;
    if (mutation === "duplicate_member_id") scenario.members[1].id = scenario.members[0].id;
    if (mutation === "missing_assessment") scenario.members[0].otonanState = null;
    if (mutation === "stale_revision") scenario.members[0].revision = "old-synthetic-revision";
    return scenario;
}
function build(id) {
    if (originals.has(id)) return buildOriginal(originals.get(id));
    const entry = extras.get(id);
    if (!entry) throw new RangeError("Unknown synthetic scenario ID.");
    const result = build(entry.baseId);
    result.fixtureId = id;
    entry.modify(result);
    return result;
}
export const SYNTHETIC_CHAIR_CASE_IDS = Object.freeze([...originals.keys(), ...extras.keys()]);

// Only fixed IDs and identity/order transforms can mint an in-process capability.
// No approval boolean, birth data, or arbitrary scenario can be supplied here.
export function getSyntheticChairScenario(id, transforms = {}) {
    const allowed = ["memberOrder", "rename", "reverseComparisons", "reversePairs"];
    if (Object.keys(transforms).some((key) => !allowed.includes(key))) {
        throw new TypeError("Only identity/order transforms are supported.");
    }
    const scenario = build(id);
    if (transforms.memberOrder) {
        const order = transforms.memberOrder;
        const ids = scenario.members.map((member) => member.id);
        if (order.length !== ids.length || new Set(order).size !== ids.length ||
            order.some((id) => !ids.includes(id))) throw new TypeError("Not a member permutation.");
        scenario.members = order.map((id) => scenario.members.find((member) => member.id === id));
    }
    if (transforms.rename) {
        const rename = transforms.rename, ids = scenario.members.map((member) => member.id);
        const values = ids.map((id) => rename[id]);
        if (Object.keys(rename).length !== ids.length || new Set(values).size !== ids.length ||
            values.some((value) => typeof value !== "string" || !value.trim() || value !== value.trim())) {
            throw new TypeError("Expected a complete bijective ID mapping.");
        }
        scenario.members.forEach((member) => { member.id = rename[member.id]; });
        scenario.summaries.forEach((summary) => { summary.memberId = rename[summary.memberId]; });
        scenario.pairs.forEach((pair) => {
            pair.a = rename[pair.a]; pair.b = rename[pair.b]; pair.pairKey = canonicalKey(pair.a, pair.b);
        });
        scenario.comparator.rows.forEach((row) => {
            row.memberAId = rename[row.memberAId]; row.memberBId = rename[row.memberBId];
        });
    }
    if (transforms.reversePairs) {
        scenario.pairs.reverse();
        scenario.pairs.forEach((pair) => { [pair.a, pair.b] = [pair.b, pair.a]; });
    }
    if (transforms.reverseComparisons) {
        scenario.comparator.rows.reverse();
        scenario.comparator.rows.forEach((row) => {
            [row.memberAId, row.memberBId] = [row.memberBId, row.memberAId];
            row.result = reverseState(row.result);
        });
    }
    freezeDeep(scenario);
    registered.add(scenario);
    return scenario;
}
export function isRegisteredSyntheticChairScenario(scenario) {
    return registered.has(scenario);
}
export function getSyntheticChairExpectation(id) {
    if (extras.has(id)) return clone(extras.get(id).expected);
    if (!originals.has(id)) throw new RangeError("Unknown synthetic scenario ID.");
    const original = clone(originals.get(id).expected);
    // G6A.8 never proposes a deputy: no real deputy policy has been approved.
    if (original.status === "chair_and_deputy_proposed") original.status = "chair_only";
    original.deputyMemberId = null;
    return original;
}
export function getSyntheticChairRequiredReasons(id) {
    if (extras.has(id)) return [...extras.get(id).reasons];
    const entry = originals.get(id);
    return entry.requiredReason ? [entry.requiredReason] : [];
}

