import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import { loadTypeScriptModule, projectRoot } from "./samyoga-test-loader.mjs";
import {
    SYNTHETIC_CHAIR_CASE_IDS, getSyntheticChairScenario,
    getSyntheticChairExpectation, getSyntheticChairRequiredReasons,
} from "./fixtures/samyoga-chair-scenarios.mjs";
import {
    evaluateSyntheticChairScenario, SYNTHETIC_CHAIR_POLICY_VERSION,
} from "./fixtures/samyoga-chair-prototype.mjs";

const evaluate = (id, transforms) => evaluateSyntheticChairScenario(getSyntheticChairScenario(id, transforms));
const decision = (result) => ({
    status: result.status, qualifiedMemberIds: result.qualifiedMemberIds,
    chairMemberId: result.chairMemberId, deputyMemberId: result.deputyMemberId,
});
for (const id of SYNTHETIC_CHAIR_CASE_IDS) {
    test("G6A.8 synthetic oracle: " + id, () => {
        const result = evaluate(id);
        assert.deepEqual(decision(result), getSyntheticChairExpectation(id));
        for (const code of getSyntheticChairRequiredReasons(id)) assert.ok(result.reasonCodes.includes(code), code);
        assert.equal(result.marker, "synthetic-test-only");
        assert.equal(result.syntheticTestOnly, true);
        assert.equal(result.policyVersion, SYNTHETIC_CHAIR_POLICY_VERSION);
        assert.equal(result.deputyMemberId, null);
        assert.equal(result.deputyPolicyStatus, "pending");
        assert.ok(result.reasonCodes.length > 0);
        assert.ok(result.explanations.length > 0);
        if (result.chairMemberId) assert.ok(result.qualifiedMemberIds.includes(result.chairMemberId));
        if (result.chairMemberId && result.qualifiedMemberIds.length >= 2) {
            assert.deepEqual(result.universalDominatorIds, [result.chairMemberId]);
            for (const otherId of result.qualifiedMemberIds.filter((memberId) => memberId !== result.chairMemberId)) {
                assert.ok(result.dominancePairs.some((edge) =>
                    edge.dominatorId === result.chairMemberId && edge.otherId === otherId));
            }
        }
        if (["not_evaluated", "undetermined", "conflicting_priority", "no_qualified_candidate"].includes(result.status)) {
            assert.equal(result.chairMemberId, null);
        }
    });
}
test("G6A.8: all 71 R1 cases are covered; five deputy counterfactuals remain alternatives", () => {
    const matrix = fs.readFileSync(path.join(projectRoot, "docs/samyoga-chair-test-matrix-g6a7.md"), "utf8");
    const reference = JSON.parse([...matrix.matchAll(/\x60{3}json\r?\n([\s\S]*?)\r?\n\x60{3}/g)][0][1]);
    assert.equal(reference.cases.length, 71);
    let counterfactuals = 0;
    for (const entry of reference.cases) {
        assert.ok(SYNTHETIC_CHAIR_CASE_IDS.includes(entry.id));
        if (entry.expected.status === "chair_and_deputy_proposed") {
            const result = evaluate(entry.id);
            counterfactuals++;
            assert.equal(result.status, "chair_only");
            assert.ok(result.alternativeCandidateIds.includes(entry.expected.deputyMemberId));
        }
    }
    assert.equal(counterfactuals, 5);
});
test("G6A.8: opaque fixture capability rejects raw/clone/serialized approval flags", () => {
    const scenario = getSyntheticChairScenario("R1-EQUIVALENT-DIFF");
    for (const input of [null, undefined, {}, true, { approved: true },
        { ...scenario, approved: true }, structuredClone(scenario), JSON.parse(JSON.stringify(scenario))]) {
        const result = evaluateSyntheticChairScenario(input);
        assert.equal(result.status, "not_evaluated");
        assert.deepEqual(result.reasonCodes, ["SYNTHETIC_CONTEXT_REQUIRED"]);
    }
    assert.throws(() => { scenario.comparator.approval = "approved"; }, TypeError);
    assert.throws(() => getSyntheticChairScenario("R1-EQUIVALENT-DIFF", { approved: true }), TypeError);
    assert.throws(() => getSyntheticChairScenario("unknown"), RangeError);
});
test("G6A.8: eligibility, majority and missing approval are separate", () => {
    const failedMajority = evaluate("STRONG-FAIL");
    assert.ok(failedMajority.eligibleMemberIds.includes("a"));
    assert.ok(!failedMajority.qualifiedMemberIds.includes("a"));
    assert.equal(failedMajority.chairMemberId, "b");
    for (const id of ["EMPTY-REGISTRY", "EVIDENCE-PENDING", "RULE-PENDING", "MAJORITY-PENDING"]) {
        const result = evaluate(id);
        assert.equal(result.status, "not_evaluated");
        assert.deepEqual(result.eligibleMemberIds, []);
        assert.deepEqual(result.qualifiedMemberIds, []);
    }
    const missingComparator = evaluate("R1-METHOD-UNAPPROVED");
    assert.equal(missingComparator.status, "not_evaluated");
    assert.deepEqual(missingComparator.qualifiedMemberIds, ["a", "b"]);
});
test("G6A.8: UNKNOWN and INCOMPARABLE never produce dominance from higher Utama", () => {
    for (const id of ["R1-UNKNOWN-DIFF", "R1-INCOMPARABLE-DIFF", "NO-PROVEN-DIFFERENCE"]) {
        const result = evaluate(id);
        assert.equal(result.status, "undetermined");
        assert.equal(result.chairMemberId, null);
        assert.deepEqual(result.dominancePairs, []);
        assert.ok(result.comparisons.every((comparison) => comparison.result !== "EQUIVALENT"));
    }
    const unavailable = evaluate("TWO-DIFF");
    assert.equal(unavailable.status, "not_evaluated");
    assert.ok(unavailable.comparisons.every((comparison) => comparison.result === "UNKNOWN"));
});
test("G6A.8: direction, equivalence, strict cycles and claimed transitivity fail closed", () => {
    for (const id of [
        "G8-STRONGER-BOTH-DIRECTIONS", "G8-REVERSE-DUPLICATE", "G8-EQUIVALENT-ASYMMETRIC",
        "G8-INCOMPARABLE-ASYMMETRIC", "G8-EQUIVALENCE-CONTRADICTION",
        "G8-TRANSITIVE-BROKEN", "G8-TRANSITIVE-UNKNOWN", "COMPARATOR-CYCLE",
    ]) {
        const result = evaluate(id);
        assert.equal(result.status, "not_evaluated");
        assert.equal(result.chairMemberId, null);
        assert.ok(result.reasonCodes.includes("COMPARATOR_INCONSISTENT"));
    }
    assert.equal(evaluate("G8-TRANSITIVE-VALID").chairMemberId, "a");
});
test("G6A.8: missing pairwise records differ from explicit UNKNOWN", () => {
    for (const id of ["COMPARATOR-MISSING", "G8-INCOMPLETE-COMPARATOR"]) {
        const result = evaluate(id);
        assert.equal(result.status, "not_evaluated");
        assert.ok(result.reasonCodes.includes("COMPARATOR_BASIS_UNAVAILABLE"));
    }
    assert.equal(evaluate("R1-LOWER-UNKNOWN").chairMemberId, "a");
});
test("G6A.8: Nista is explanatory and does not disqualify a majority candidate", () => {
    for (const id of ["NISTA-STILL-PASS", "NISTA-SIX"]) {
        const result = evaluate(id);
        const member = result.memberDecisions.find((entry) => entry.memberId === "a");
        assert.equal(member.samyogaGate, "QUALIFIED");
        assert.equal(member.attentionPairKeys.length, 1);
        assert.equal(result.chairMemberId, "a");
    }
});
function permutations(values) {
    return values.length ? values.flatMap((value, index) =>
        permutations(values.filter((_, otherIndex) => index !== otherIndex)).map((tail) => [value, ...tail])) : [[]];
}
test("G6A.8: all permutations for N=3..6 preserve both gates and chair (870 checks)", () => {
    let checks = 0;
    for (const n of [3, 4, 5, 6]) {
        const id = "B" + n + "-PASS", scenario = getSyntheticChairScenario(id), baseline = evaluate(id);
        for (const memberOrder of permutations(scenario.members.map((member) => member.id))) {
            assert.deepEqual(evaluate(id, { memberOrder, reversePairs: true }), baseline);
            checks++;
        }
    }
    assert.equal(checks, 870);
});
test("G6A.8: multi-candidate permutations and reversal preserve all five states (144 checks)", () => {
    let checks = 0;
    for (const id of ["R1-THREE-PARETO", "R1-EQUIVALENT-DIFF"]) {
        const scenario = getSyntheticChairScenario(id), baseline = evaluate(id);
        for (const memberOrder of permutations(scenario.members.map((member) => member.id))) {
            assert.deepEqual(evaluate(id, { memberOrder, reversePairs: true, reverseComparisons: true }), baseline);
            checks++;
        }
    }
    assert.equal(checks, 144);
    for (const id of ["R1-UNKNOWN-DIFF", "R1-INCOMPARABLE-DIFF", "R1-STRONGER-LESS",
        "R1-EQUIVALENT-TIE", "R1-STRONGER-EQUAL"]) {
        assert.deepEqual(evaluate(id, { reverseComparisons: true }), evaluate(id));
    }
});
test("G6A.8: rename IDs and labels are not a tie-break; inputs/results are detached", () => {
    for (const id of ["R1-THREE-PARETO", "R1-EQUIVALENT-TIE"]) {
        const scenario = getSyntheticChairScenario(id);
        const rename = Object.fromEntries(scenario.members.map((member, index) => [member.id, "id-" + (20 - index)]));
        const baseline = evaluate(id), renamed = evaluate(id, { rename });
        assert.equal(renamed.status, baseline.status);
        assert.equal(renamed.chairMemberId, baseline.chairMemberId ? rename[baseline.chairMemberId] : null);
        assert.deepEqual(renamed.qualifiedMemberIds, baseline.qualifiedMemberIds.map((id) => rename[id]).sort());
    }
    const scenario = getSyntheticChairScenario("R1-THREE-PARETO"), before = structuredClone(scenario);
    const first = evaluateSyntheticChairScenario(scenario);
    first.memberDecisions[0].counts.Utama = 999;
    first.comparisons[0].basisRefs.push("mutated-output");
    assert.deepEqual(scenario, before);
    assert.equal(evaluateSyntheticChairScenario(scenario).chairMemberId, "a");
});
test("G6A.8: prototype never touches production evidence/rules", () => {
    const evidence = loadTypeScriptModule("lib/samyoga-position-evidence.ts");
    const rules = loadTypeScriptModule("lib/samyoga-position-recommendation.ts");
    for (const id of SYNTHETIC_CHAIR_CASE_IDS) evaluate(id);
    assert.equal(evidence.SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY.length, 0);
    assert.equal(rules.SAMYOGA_PRODUCTION_POSITION_RULES.length, 0);
});
function sourceFiles(directory) {
    if (!fs.existsSync(directory)) return [];
    return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
        const filename = path.join(directory, entry.name);
        return entry.isDirectory() ? sourceFiles(filename) : /\.(?:[cm]?[jt]sx?)$/.test(entry.name) ? [filename] : [];
    });
}
test("G6A.8: production import/export graph cannot reach the Node synthetic sandbox", () => {
    const files = ["app", "components", "lib", "hooks", "firebase"].flatMap((directory) => sourceFiles(path.join(projectRoot, directory)));
    files.push(...fs.readdirSync(projectRoot, { withFileTypes: true })
        .filter((entry) => entry.isFile() && /\.(?:[cm]?[jt]sx?)$/.test(entry.name))
        .map((entry) => path.join(projectRoot, entry.name)));
    assert.ok(files.length > 10);
    for (const filename of files) {
        const source = fs.readFileSync(filename, "utf8");
        const tree = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
        function visit(node) {
            let specifier;
            if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier &&
                ts.isStringLiteral(node.moduleSpecifier)) specifier = node.moduleSpecifier.text;
            if (ts.isCallExpression(node) && (node.expression.kind === ts.SyntaxKind.ImportKeyword ||
                (ts.isIdentifier(node.expression) && node.expression.text === "require")) &&
                node.arguments.length && ts.isStringLiteral(node.arguments[0])) specifier = node.arguments[0].text;
            if (specifier) {
                assert.doesNotMatch(specifier, /(?:tests|fixtures|samyoga-chair|synthetic-chair)/, filename);
                if (specifier.startsWith(".") || specifier.startsWith("@/")) {
                    const target = specifier.startsWith("@/") ? path.resolve(projectRoot, specifier.slice(2)) :
                        path.resolve(path.dirname(filename), specifier);
                    assert.ok(!target.startsWith(path.join(projectRoot, "tests")), filename);
                }
            }
            ts.forEachChild(node, visit);
        }
        visit(tree);
    }
    for (const filename of ["tests/fixtures/samyoga-chair-prototype.mjs", "tests/fixtures/samyoga-chair-scenarios.mjs"]) {
        const source = fs.readFileSync(path.join(projectRoot, filename), "utf8");
        assert.doesNotMatch(source, /(?:from|import\s*\()\s*["'][^"']*(?:\/lib\/|\/app\/|firebase|analytics)/);
        assert.doesNotMatch(source, /\b(?:fetch|sendBeacon|XMLHttpRequest|localStorage|sessionStorage|indexedDB|writeFile|appendFile)\b/);
    }
});

