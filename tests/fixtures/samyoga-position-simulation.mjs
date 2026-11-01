// Offline test/experiment only. Never import this module from application code.
// Approval flags below apply to SYNTHETIC PROXIES, not to cultural evidence.
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createCivilDate, loadTypeScriptModule, projectRoot } from "../samyoga-test-loader.mjs";

const calendar = loadTypeScriptModule("lib/samyoga-calendar-snapshot.ts");
const registry = loadTypeScriptModule("lib/samyoga-position-evidence.ts");
const engine = loadTypeScriptModule("lib/samyoga-position-recommendation.ts");
const POSITIONS = ["Leader", "Management", "Operasional"];
const DIMENSIONS = ["directing", "planning", "managing", "communicating", "executing", "collaborating"];
const FIXTURE_VERSION = "g6a5-synthetic-test-only-v1";

function sortPositions(positions) {
  return [...new Set(positions)].sort((a, b) => POSITIONS.indexOf(a) - POSITIONS.indexOf(b));
}

export function createSyntheticEvidence(memberId, specs) {
  const definitions = specs.map(({ id, dimension, polarity = "support" }) => ({
    evidenceId: id,
    indicatorType: "saptawara",
    wewaranCycle: null,
    indicatorValue: "SYNTHETIC-TEST-ONLY",
    masterRecordId: `synthetic-test:${id}`,
    sourceField: "synthetic-test-excerpt",
    excerpt: `Synthetic assertion ${id}; no verified cultural source is claimed.`,
    dimension,
    polarity,
    sourceId: "synthetic-test-only-no-cultural-source",
    sourcePage: null,
    provenanceStatus: "verified",
    domainReviewStatus: "approved",
    ruleVersion: FIXTURE_VERSION,
  }));
  return registry.resolveSamyogaPositionEvidence({
    memberId,
    calculatedIndicators: [],
    masterInterpretations: definitions.map((entry) => ({
      indicatorType: entry.indicatorType,
      wewaranCycle: entry.wewaranCycle,
      indicatorValue: entry.indicatorValue,
      masterRecordId: entry.masterRecordId,
      sourceField: entry.sourceField,
      text: entry.excerpt,
    })),
  }, definitions);
}

export function createSyntheticRule(position, requiredDimensions, overrides = {}) {
  return {
    ruleId: `synthetic-test:${position}`,
    ruleVersion: FIXTURE_VERSION,
    position,
    requiredDimensions,
    domainReviewStatus: "approved",
    productApprovalStatus: "approved",
    rationale: "Synthetic test fixture; not a production or domain approval.",
    ...overrides,
  };
}

export function evaluateExperimentalPolicies(memberId, evidence, rules) {
  const evaluate = (entries, selectedRules) => engine.evaluateSamyogaPositionRecommendation(
    memberId, entries, selectedRules, FIXTURE_VERSION,
  );
  const global = evaluate(evidence, rules);
  const supportResult = evaluate(evidence.filter((entry) => entry.polarity === "support"), rules);
  const supportPositions = supportResult.recommendedPosition
    ? [supportResult.recommendedPosition]
    : supportResult.alternativePositions;
  // Per-rule comparison is an experiment. The production evaluator is unchanged.
  const outcomes = rules.map((rule) => evaluate(evidence, [rule]));
  const eligiblePositions = sortPositions(outcomes.flatMap((outcome) =>
    outcome.status === "recommended" ? [outcome.recommendedPosition] : []));
  const blockedPositions = sortPositions(outcomes.flatMap((outcome, index) =>
    outcome.status === "conflicting_indicators" ? [rules[index].position] : []));
  const status = eligiblePositions.length > 1 ? "multiple_candidates"
    : eligiblePositions.length === 1 ? "recommended"
      : blockedPositions.length > 0 ? "conflicting_indicators" : "insufficient_basis";
  return {
    supportPositions: sortPositions(supportPositions),
    global,
    perRule: {
      status,
      recommendedPosition: eligiblePositions.length === 1 ? eligiblePositions[0] : null,
      eligiblePositions,
      blockedPositions,
    },
  };
}

function emptyCounts() {
  return {
    samples: 0,
    supportMatches: { Leader: 0, Management: 0, Operasional: 0 },
    unblockedCandidates: { Leader: 0, Management: 0, Operasional: 0 },
    multipleSupportMatches: 0,
    multipleUnblockedCandidates: 0,
    noSupportMatches: 0,
    noUnblockedCandidates: 0,
    globalStatuses: { recommended: 0, multiple_candidates: 0, conflicting_indicators: 0, insufficient_basis: 0 },
    perRuleStatuses: { recommended: 0, multiple_candidates: 0, conflicting_indicators: 0, insufficient_basis: 0 },
    casesWithRuleConflict: 0,
    cleanCandidatesWithheldByGlobalConflict: 0,
    policyDifferences: 0,
  };
}

function aggregate(counts, result) {
  counts.samples++;
  result.supportPositions.forEach((position) => counts.supportMatches[position]++);
  result.perRule.eligiblePositions.forEach((position) => counts.unblockedCandidates[position]++);
  if (result.supportPositions.length > 1) counts.multipleSupportMatches++;
  if (result.perRule.eligiblePositions.length > 1) counts.multipleUnblockedCandidates++;
  if (result.supportPositions.length === 0) counts.noSupportMatches++;
  if (result.perRule.eligiblePositions.length === 0) counts.noUnblockedCandidates++;
  counts.globalStatuses[result.global.status]++;
  counts.perRuleStatuses[result.perRule.status]++;
  if (result.perRule.blockedPositions.length > 0) counts.casesWithRuleConflict++;
  if (result.global.status === "conflicting_indicators" && result.perRule.eligiblePositions.length > 0) {
    counts.cleanCandidatesWithheldByGlobalConflict++;
  }
  if (result.global.status !== result.perRule.status
    || result.global.recommendedPosition !== result.perRule.recommendedPosition) counts.policyDifferences++;
}

function baseMechanismRules() {
  return [
    createSyntheticRule("Leader", ["directing", "collaborating", "communicating"]),
    createSyntheticRule("Management", ["planning", "managing"]),
    createSyntheticRule("Operasional", ["executing"]),
  ];
}

export function runSyntheticMechanismSimulation() {
  const supportOnly = emptyCounts();
  const withDirectingCaution = emptyCounts();
  let ruleOrderChecks = 0;
  for (let mask = 0; mask < 64; mask++) {
    const specs = DIMENSIONS.filter((_, index) => mask & (1 << index))
      .map((dimension) => ({ id: `mechanism:${dimension}`, dimension }));
    const rules = baseMechanismRules();
    for (const [counts, extra] of [[supportOnly, []], [withDirectingCaution, [
      { id: "mechanism:caution-directing", dimension: "directing", polarity: "caution" },
    ]]]) {
      const evidence = createSyntheticEvidence("synthetic-member", [...specs, ...extra]);
      const result = evaluateExperimentalPolicies("synthetic-member", evidence, rules);
      assert.deepEqual(evaluateExperimentalPolicies("synthetic-member", [...evidence].reverse(), [...rules].reverse()), result);
      ruleOrderChecks++;
      aggregate(counts, result);
    }
  }
  return { interpretation: "64 artificial support-presence combinations, not calendar or population data", supportOnly, withDirectingCaution, ruleOrderChecks };
}

function parseJsonBlocks(filename) {
  const text = fs.readFileSync(path.join(projectRoot, filename), "utf8");
  const blocks = [...text.matchAll(/\x60{3}json\r?\n([\s\S]*?)\r?\n\x60{3}/g)].map((match) => JSON.parse(match[1]));
  return { text, blocks };
}

export function readCandidateDocuments() {
  const catalog = parseJsonBlocks("docs/samyoga-position-evidence-catalog.md");
  const ruleDocument = parseJsonBlocks("docs/samyoga-position-ruleset-review.md");
  const candidates = catalog.blocks.filter((entry) => entry.evidenceId);
  const rules = ruleDocument.blocks.filter((entry) => POSITIONS.includes(entry.position));
  assert.equal(candidates.length, 22);
  assert.equal(rules.length, 3);
  for (const entry of candidates) {
    assert.equal(entry.domainReviewStatus, "pending");
    assert.equal(entry.provenanceStatus, "missing");
    assert.equal(entry.sourceId, null);
    assert.equal(entry.sourcePage, null);
    assert.equal(entry.productApprovalStatus, "pending");
  }
  for (const rule of rules) {
    assert.equal(rule.domainReviewStatus, "pending");
    assert.equal(rule.productApprovalStatus, "pending");
    assert.notEqual(rule.activationStatus, "active");
  }
  return { candidates, rules, catalogSha256: createHash("sha256").update(catalog.text).digest("hex"), rulesetSha256: createHash("sha256").update(ruleDocument.text).digest("hex") };
}

export function prepareHypothesisInput(snapshot, candidates, documentRules, options = {}) {
  // Use original pending catalog only for exact-match membership, never as active evidence.
  const matching = registry.resolveSamyogaPositionEvidence(snapshot, candidates)
    .filter((entry) => !entry.inactiveReasons.includes("master-interpretation-not-found"));
  assert.ok(matching.every((entry) => !entry.active));
  const specs = matching.filter((entry) => options.cautions !== false || entry.polarity !== "caution")
    .map((entry) => ({ id: `hypothesis:${entry.evidenceId}`, dimension: entry.dimension, polarity: entry.polarity }));
  if (options.injectDirectingCaution) specs.push({ id: "injected-test-only-directing-caution", dimension: "directing", polarity: "caution" });
  const operational = documentRules.find((rule) => rule.position === "Operasional");
  const supports = new Set(matching.filter((entry) => entry.polarity === "support").map((entry) => entry.evidenceId));
  const hasConsistency = operational.evidenceQualification.consistencyEvidenceIds.some((id) => supports.has(id));
  const hasPrecision = operational.evidenceQualification.precisionEvidenceIds.some((id) => supports.has(id));
  const qualifies = options.facet === "and" ? hasConsistency && hasPrecision
    : options.facet === "consistency" ? hasConsistency
      : options.facet === "precision" ? hasPrecision : hasConsistency || hasPrecision;
  const rules = documentRules.filter((rule) => rule.position !== "Operasional" || qualifies)
    .map((rule) => {
      let dimensions = [...rule.requiredDimensions];
      if (options.changePosition === rule.position) {
        if (options.removeDimension) dimensions = dimensions.filter((dimension) => dimension !== options.removeDimension);
        if (options.addDimension) dimensions.push(options.addDimension);
      }
      return createSyntheticRule(rule.position, dimensions);
    });
  return { evidence: createSyntheticEvidence(snapshot.memberId, specs), rules, matchingIds: matching.map((entry) => entry.evidenceId).sort() };
}

const VARIANTS = [
  ["catalog_support_only", { cautions: false }],
  ["catalog_cautions", {}],
  ["leader_without_directing", { changePosition: "Leader", removeDimension: "directing" }],
  ["leader_without_collaborating", { changePosition: "Leader", removeDimension: "collaborating" }],
  ["leader_without_communicating", { changePosition: "Leader", removeDimension: "communicating" }],
  ["leader_plus_planning", { changePosition: "Leader", addDimension: "planning" }],
  ["management_without_planning", { changePosition: "Management", removeDimension: "planning" }],
  ["management_without_managing", { changePosition: "Management", removeDimension: "managing" }],
  ["operational_consistency_and_precision", { facet: "and" }],
  ["operational_consistency_only", { facet: "consistency" }],
  ["operational_precision_only", { facet: "precision" }],
  ["synthetic_directing_caution_added", { injectDirectingCaution: true }],
];

function omitMemberId(result) {
  const copy = structuredClone(result);
  delete copy.global.memberId;
  return copy;
}

export function runCandidateHypothesisSimulation(documents = readCandidateDocuments()) {
  const before = JSON.stringify(documents);
  const variants = Object.fromEntries(VARIANTS.map(([name]) => [name, emptyCounts()]));
  const seen = new Set();
  const policyDifferenceExamples = [];
  let productionAbstentions = 0;
  let ruleOrderChecks = 0;
  let equalIndicatorChecks = 0;
  let memberOrderChecks = 0;
  for (let dayIndex = 0; dayIndex < 210; dayIndex++) {
    const date = createCivilDate(2005, 7, 27);
    date.setDate(date.getDate() + dayIndex);
    const civilDate = [String(date.getFullYear()).padStart(4, "0"), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-");
    const members = ["synthetic-a", "synthetic-b", "synthetic-c"].map((id) => ({ id, birthDate: civilDate, birthTime: "06:00" }));
    const snapshots = calendar.createSamyogaGroupCalendarSnapshots(members);
    const reversed = calendar.createSamyogaGroupCalendarSnapshots([...members].reverse());
    assert.deepEqual(reversed.find((entry) => entry.memberId === snapshots[0].memberId), snapshots[0]);
    memberOrderChecks++;
    const production = engine.evaluateProductionSamyogaPositionRecommendation(snapshots[0]);
    assert.equal(production.status, "insufficient_basis");
    productionAbstentions++;
    for (const [variant, options] of VARIANTS) {
      const input = prepareHypothesisInput(snapshots[0], documents.candidates, documents.rules, options);
      input.matchingIds.forEach((id) => seen.add(id));
      const result = evaluateExperimentalPolicies(snapshots[0].memberId, input.evidence, input.rules);
      assert.deepEqual(evaluateExperimentalPolicies(snapshots[0].memberId, [...input.evidence].reverse(), [...input.rules].reverse()), result);
      ruleOrderChecks++;
      aggregate(variants[variant], result);
      if (variant === "catalog_cautions") {
        const other = prepareHypothesisInput(snapshots[1], documents.candidates, documents.rules, options);
        assert.deepEqual(omitMemberId(evaluateExperimentalPolicies(snapshots[1].memberId, other.evidence, other.rules)), omitMemberId(result));
        equalIndicatorChecks++;
        if (result.global.status !== result.perRule.status && policyDifferenceExamples.length < 3) {
          policyDifferenceExamples.push({ dayIndex, matchingCandidateIds: input.matchingIds, globalStatus: result.global.status, globalPrimary: result.global.recommendedPosition, perRule: result.perRule });
        }
      }
    }
  }
  assert.equal(JSON.stringify(documents), before);
  assert.equal(registry.SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY.length, 0);
  assert.equal(engine.SAMYOGA_PRODUCTION_POSITION_RULES.length, 0);
  return {
    interpretation: "Hypothetical projection of pending G6A.4 tags into synthetic proxies; no cultural or product approval is granted",
    cycle: { anchorCivilDate: "2005-07-27", birthTime: "06:00", days: 210 },
    candidateCount: documents.candidates.length,
    matchingCandidateCount: seen.size,
    variants,
    policyDifferenceExamples,
    invariantChecks: { productionAbstentions, ruleOrderChecks, equalIndicatorChecks, memberOrderChecks, originalCatalogUnchanged: true },
  };
}

export function runPositionSimulation() {
  const documents = readCandidateDocuments();
  return {
    schemaVersion: "g6a5-offline-simulation-v1",
    inputCatalogCheckpoint: "e41bd993e0e22a4ffab68f5ed1b7ccc314fee336",
    notice: "Calendar/test combination counts only: not population data, job suitability, accuracy, or human compatibility percentages. No production recommendations.",
    inputArtifacts: { catalogSha256: documents.catalogSha256, rulesetSha256: documents.rulesetSha256 },
    syntheticMechanism: runSyntheticMechanismSimulation(),
    candidateHypothesis: runCandidateHypothesisSimulation(documents),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.stdout.write(`${JSON.stringify(runPositionSimulation(), null, 2)}\n`);
}
