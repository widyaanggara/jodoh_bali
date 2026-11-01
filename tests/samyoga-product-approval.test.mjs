import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { loadTypeScriptModule, projectRoot } from "./samyoga-test-loader.mjs";
import {
  createSyntheticEvidence,
  createSyntheticRule,
  evaluateExperimentalPolicies,
  readCandidateDocuments,
  runPositionSimulation,
} from "./fixtures/samyoga-position-simulation.mjs";

const engine = loadTypeScriptModule("lib/samyoga-position-recommendation.ts");
const registry = loadTypeScriptModule("lib/samyoga-position-evidence.ts");
const snapshotModule = loadTypeScriptModule("lib/samyoga-calendar-snapshot.ts");
const baseline = createSyntheticEvidence("a", [{ id: "test-directing", dimension: "directing" }])[0];
const evaluate = (evidence, rules) => engine.evaluateSamyogaPositionRecommendation("a", evidence, rules, "test-only-v1");

function resolveWithApproval(provenanceStatus, domainReviewStatus) {
  const definition = { ...baseline, provenanceStatus, domainReviewStatus };
  return registry.resolveSamyogaPositionEvidence({
    memberId: "a",
    masterInterpretations: [{
      indicatorType: definition.indicatorType, wewaranCycle: definition.wewaranCycle,
      indicatorValue: definition.indicatorValue, masterRecordId: definition.masterRecordId,
      sourceField: definition.sourceField, text: definition.excerpt,
    }],
  }, [definition]);
}

test("G6A.5: provenance, evidence review, rule review, dan product approval wajib independen", () => {
  for (const provenance of ["verified", "missing", "provisional"]) {
    for (const evidenceReview of ["approved", "pending", "rejected", undefined]) {
      const evidence = resolveWithApproval(provenance, evidenceReview);
      for (const ruleReview of ["approved", "pending", "rejected", undefined]) {
        for (const productApproval of ["approved", "pending", "rejected", undefined, null, true]) {
          const result = evaluate(evidence, [createSyntheticRule("Leader", ["directing"], {
            domainReviewStatus: ruleReview, productApprovalStatus: productApproval,
          })]);
          const approved = provenance === "verified" && evidenceReview === "approved"
            && ruleReview === "approved" && productApproval === "approved";
          assert.equal(result.status, approved ? "recommended" : "insufficient_basis");
        }
      }
    }
  }
});

test("G6A.5: property productApprovalStatus yang tidak ada ditolak", () => {
  const rule = createSyntheticRule("Leader", ["directing"]);
  delete rule.productApprovalStatus;
  assert.equal(evaluate([baseline], [rule]).status, "insufficient_basis");
});

test("G6A.5: product approved tidak melewati resolver, kutipan, atau identitas master", () => {
  const rule = createSyntheticRule("Leader", ["directing"]);
  assert.equal(evaluate([{ ...baseline, active: true }], [rule]).status, "insufficient_basis");
  for (const changes of [{ excerpt: "changed" }, { masterRecordId: "wrong" }, { wewaranCycle: "asatawara" }]) {
    const original = { ...baseline };
    const evidence = registry.resolveSamyogaPositionEvidence({
      memberId: "a", masterInterpretations: [{
        indicatorType: original.indicatorType, wewaranCycle: original.wewaranCycle,
        indicatorValue: original.indicatorValue, masterRecordId: original.masterRecordId,
        sourceField: original.sourceField, text: original.excerpt,
      }],
    }, [{ ...original, ...changes }]);
    assert.equal(evaluate(evidence, [rule]).status, "insufficient_basis");
  }
});

test("G6A.5: persyaratan kosong, fallback Anggota, dan evidence kosong tetap abstain", () => {
  assert.equal(evaluate([baseline], [createSyntheticRule("Leader", [])]).status, "insufficient_basis");
  assert.equal(evaluate([baseline], [createSyntheticRule("Anggota", ["directing"])]).status, "insufficient_basis");
  assert.equal(evaluate([], [createSyntheticRule("Leader", ["directing"])]).status, "insufficient_basis");
});

test("G6A.5: pending rule tidak menimbulkan konflik bagi rule approved lain", () => {
  const evidence = createSyntheticEvidence("a", [
    { id: "direct", dimension: "directing" },
    { id: "caution", dimension: "directing", polarity: "caution" },
    { id: "plan", dimension: "planning" },
  ]);
  const rules = [
    createSyntheticRule("Leader", ["directing"], { productApprovalStatus: "pending" }),
    createSyntheticRule("Management", ["planning"]),
  ];
  assert.equal(evaluate(evidence, rules).recommendedPosition, "Management");
  assert.deepEqual(evaluate([...evidence].reverse(), [...rules].reverse()), evaluate(evidence, rules));
});

test("G6A.5: konflik global dan per-rule dibandingkan pada fixture yang identik", () => {
  const evidence = createSyntheticEvidence("a", [
    { id: "direction", dimension: "directing" },
    { id: "direction-caution", dimension: "directing", polarity: "caution" },
    { id: "execution", dimension: "executing" },
  ]);
  const result = evaluateExperimentalPolicies("a", evidence, [
    createSyntheticRule("Leader", ["directing"]),
    createSyntheticRule("Operasional", ["executing"]),
  ]);
  assert.equal(result.global.status, "conflicting_indicators");
  assert.equal(result.global.recommendedPosition, null);
  assert.equal(result.perRule.recommendedPosition, "Operasional");
  assert.deepEqual(result.perRule.blockedPositions, ["Leader"]);
});

let cachedReport;
function report() {
  cachedReport ??= runPositionSimulation();
  return cachedReport;
}

test("G6A.5: mekanisme 64 kombinasi sintetis mempunyai denominator dan hasil eksplisit", () => {
  const result = report().syntheticMechanism;
  assert.equal(result.supportOnly.samples, 64);
  assert.deepEqual(result.supportOnly.supportMatches, { Leader: 8, Management: 16, Operasional: 32 });
  assert.equal(result.supportOnly.noSupportMatches, 21);
  assert.equal(result.supportOnly.multipleSupportMatches, 12);
  assert.equal(result.withDirectingCaution.globalStatuses.conflicting_indicators, 8);
  assert.equal(result.withDirectingCaution.cleanCandidatesWithheldByGlobalConflict, 5);
});

test("G6A.5: simulasi hipotesis 210 hari tidak mengubah katalog dan menguji permutasi", () => {
  const result = report().candidateHypothesis;
  const baselineCounts = result.variants.catalog_cautions;
  assert.equal(baselineCounts.samples, 210);
  assert.deepEqual(baselineCounts.supportMatches, { Leader: 6, Management: 12, Operasional: 62 });
  assert.deepEqual(baselineCounts.unblockedCandidates, { Leader: 4, Management: 12, Operasional: 62 });
  assert.equal(baselineCounts.noSupportMatches, 133);
  assert.equal(baselineCounts.globalStatuses.conflicting_indicators, 2);
  assert.equal(result.invariantChecks.ruleOrderChecks, 2520);
  assert.equal(result.invariantChecks.equalIndicatorChecks, 210);
  assert.equal(result.invariantChecks.memberOrderChecks, 210);
  assert.equal(result.invariantChecks.originalCatalogUnchanged, true);
  for (const counts of Object.values(result.variants)) {
    assert.equal(Object.values(counts.globalStatuses).reduce((a, b) => a + b, 0), 210);
    assert.equal(Object.values(counts.perRuleStatuses).reduce((a, b) => a + b, 0), 210);
  }
});

test("G6A.5: perubahan dimensi dan qualification tidak disembunyikan", () => {
  const variants = report().candidateHypothesis.variants;
  assert.equal(variants.leader_plus_planning.supportMatches.Leader, 0);
  assert.equal(variants.leader_without_directing.supportMatches.Leader, 43);
  assert.equal(variants.management_without_planning.supportMatches.Management, 91);
  assert.equal(variants.operational_consistency_and_precision.supportMatches.Operasional, 6);
  assert.equal(variants.operational_consistency_only.supportMatches.Operasional, 26);
  assert.equal(variants.operational_precision_only.supportMatches.Operasional, 42);
});

test("G6A.5: seluruh kandidat asli tetap pending/missing dan tidak memasuki produksi", () => {
  const documents = readCandidateDocuments();
  assert.ok(documents.candidates.every((entry) => entry.domainReviewStatus === "pending"
    && entry.provenanceStatus === "missing" && entry.sourceId === null));
  assert.equal(registry.SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY.length, 0);
  assert.equal(engine.SAMYOGA_PRODUCTION_POSITION_RULES.length, 0);
  assert.equal(report().candidateHypothesis.invariantChecks.productionAbstentions, 210);
  const snapshot = snapshotModule.createSamyogaGroupCalendarSnapshots(["a", "b", "c"].map((id) => ({
    id, birthDate: "2000-02-29", birthTime: "05:59",
  })))[0];
  snapshot.evidence = [baseline];
  snapshot.rules = [createSyntheticRule("Leader", ["directing"])];
  snapshot.productApprovalStatus = "approved";
  assert.equal(engine.evaluateProductionSamyogaPositionRecommendation(snapshot).status, "insufficient_basis");
});

test("G6A.5: report lengkap deterministik lintas timezone", () => {
  const harness = path.join(projectRoot, "tests/fixtures/samyoga-position-simulation.mjs");
  const run = (timezone) => execFileSync(process.execPath, [harness], {
    encoding: "utf8", env: { ...process.env, TZ: timezone }, maxBuffer: 2 * 1024 * 1024,
  });
  assert.equal(run("Asia/Makassar"), run("America/Los_Angeles"));
});

test("G6A.5: runtime/UI tidak mengimpor harness dan fixture test", () => {
  for (const file of ["lib/samyoga-position-recommendation.ts", "lib/samyoga-position-evidence.ts",
    "lib/samyoga-calendar-snapshot.ts", "components/samyoga-group/SamyogaGroupClient.tsx",
    "components/samyoga-group/SamyogaGroupResults.tsx"]) {
    const source = fs.readFileSync(path.join(projectRoot, file), "utf8");
    assert.doesNotMatch(source, /(?:from|import\s*\()\s*["'][^"']*(?:tests|fixtures|simulation)/);
    assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|logActivity|firebase/);
  }
});

test("G6A.5: artefak report cocok persis dengan harness deterministik", () => {
  const artifact = JSON.parse(fs.readFileSync(path.join(projectRoot,
    "docs/samyoga-position-simulation-results.json"), "utf8"));
  assert.deepEqual(artifact, report());
});

test("G6A.5: worksheet sumber lengkap, kutipannya tepat, dan semua keputusan tetap pending", () => {
  const source = fs.readFileSync(path.join(projectRoot, "docs/samyoga-position-source-verification.md"), "utf8");
  const worksheets = [...source.matchAll(/\x60{3}json\r?\n([\s\S]*?)\r?\n\x60{3}/g)]
    .map((match) => JSON.parse(match[1]));
  const candidates = readCandidateDocuments().candidates;
  assert.equal(worksheets.length, 22);
  assert.equal(new Set(worksheets.map((entry) => entry.evidenceId)).size, 22);
  for (const worksheet of worksheets) {
    const candidate = candidates.find((entry) => entry.evidenceId === worksheet.evidenceId);
    assert.ok(candidate);
    for (const field of ["indicatorType", "wewaranCycle", "indicatorValue", "masterRecordId", "sourceField", "excerpt", "polarity"]) {
      assert.equal(worksheet[field], candidate[field]);
    }
    assert.equal(worksheet.proposedDimension, candidate.dimension);
    assert.deepEqual(worksheet.masterLocation, candidate.sourceLocation);
    assert.equal(worksheet.traditionalTextVerification.status, "missing");
    assert.equal(worksheet.traditionalTextVerification.confirmedPage, null);
    assert.equal(worksheet.traditionalTextVerification.confirmedSourceId, null);
    assert.equal(worksheet.traditionalTextVerification.confirmedSourceLocation, null);
    assert.ok(worksheet.traditionalTextVerification.bibliographyToInspect.length > 0);
    for (const review of [worksheet.traditionalTextVerification,
      worksheet.culturalInterpretationReview, worksheet.productPositionMappingReview]) {
      assert.equal(review.reviewDate, null);
      assert.equal(review.reviewer, null);
    }
    assert.equal(worksheet.traditionalTextVerification.expertDecision, "pending");
    assert.equal(worksheet.culturalInterpretationReview.expertDecision, "pending");
    assert.equal(worksheet.productPositionMappingReview.productDecision, "pending");
  }
});
