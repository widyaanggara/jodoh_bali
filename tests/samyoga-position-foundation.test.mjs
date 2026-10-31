import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadTypeScriptModule } from "./samyoga-test-loader.mjs";

const snapshotModule = loadTypeScriptModule("lib/samyoga-calendar-snapshot.ts");
const evidenceModule = loadTypeScriptModule("lib/samyoga-position-evidence.ts");
const recommendationModule = loadTypeScriptModule("lib/samyoga-position-recommendation.ts");
const fixtureDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");

const MEMBERS = [
  { id: "member-1", birthDate: "1990-01-15", birthTime: "12:00" },
  { id: "member-2", birthDate: "1992-07-08", birthTime: "05:59" },
  { id: "member-3", birthDate: "2000-02-29", birthTime: "06:00" },
  { id: "member-4", birthDate: "2005-07-27", birthTime: "12:00" },
  { id: "member-5", birthDate: "1988-12-31", birthTime: "23:59" },
  { id: "member-6", birthDate: "2012-02-29", birthTime: "06:00" },
];

function syntheticEvidence({
  id,
  memberId = "member-1",
  dimension,
  polarity = "support",
  active = true,
}) {
  const definition = {
    evidenceId: id,
    memberId,
    indicatorType: "saptawara",
    wewaranCycle: null,
    indicatorValue: "Synthetic",
    masterRecordId: "synthetic:1",
    sourceField: "fixture",
    excerpt: "Fixture sintetis, bukan evidence produksi.",
    dimension,
    polarity,
    sourceId: "synthetic-test-only",
    sourcePage: null,
    provenanceStatus: "verified",
    domainReviewStatus: "approved",
    ruleVersion: "synthetic-test-v1",
  };
  if (!active) definition.domainReviewStatus = "pending";
  const snapshot = {
    memberId,
    calculatedIndicators: [],
    masterInterpretations: [{
      indicatorType: definition.indicatorType,
      wewaranCycle: definition.wewaranCycle,
      indicatorValue: definition.indicatorValue,
      masterRecordId: definition.masterRecordId,
      sourceField: definition.sourceField,
      text: definition.excerpt,
    }],
  };
  return evidenceModule.resolveSamyogaPositionEvidence(snapshot, [definition])[0];
}

function syntheticRule(id, position, requiredDimensions, status = "approved") {
  return {
    ruleId: id,
    ruleVersion: "synthetic-test-v1",
    position,
    requiredDimensions,
    domainReviewStatus: status,
    rationale: "Fixture sintetis yang hanya disetujui di unit test.",
  };
}

test("snapshot kalender mendukung kelompok 3-6 anggota tanpa memutasi input", () => {
  for (const count of [3, 4, 5, 6]) {
    const members = MEMBERS.slice(0, count).map((member) => ({ ...member }));
    const before = structuredClone(members);
    const snapshots = snapshotModule.createSamyogaGroupCalendarSnapshots(members);
    assert.equal(snapshots.length, count);
    assert.deepEqual(members, before);
    assert.deepEqual(snapshots.map((snapshot) => snapshot.memberId), members.map((member) => member.id));
    assert.ok(snapshots.every((snapshot) => snapshot.calculatedIndicators.length >= 13));
    assert.ok(snapshots.every((snapshot) => snapshot.masterInterpretations.length > 0));
  }
});

test("snapshot memakai validator civil date, menerima leap day, dan menolak input invalid", () => {
  assert.doesNotThrow(() => snapshotModule.createSamyogaGroupCalendarSnapshots(MEMBERS.slice(0, 3)));

  for (const birthDate of ["2023-02-29", "2024-2-29", "2024-13-01", "not-a-date"]) {
    const members = MEMBERS.slice(0, 3).map((member) => ({ ...member }));
    members[0].birthDate = birthDate;
    assert.throws(
      () => snapshotModule.createSamyogaGroupCalendarSnapshots(members),
      (error) => error.code === "INVALID_BIRTH_DATE",
    );
  }
  const invalidTime = MEMBERS.slice(0, 3).map((member) => ({ ...member }));
  invalidTime[0].birthTime = "24:00";
  assert.throws(
    () => snapshotModule.createSamyogaGroupCalendarSnapshots(invalidTime),
    (error) => error.code === "INVALID_BIRTH_TIME",
  );
});

test("snapshot mempertahankan batas hari Bali 05:59 dan 06:00", () => {
  const members = [
    { id: "before", birthDate: "2005-07-27", birthTime: "05:59" },
    { id: "boundary", birthDate: "2005-07-27", birthTime: "06:00" },
    { id: "control", birthDate: "2005-07-27", birthTime: "12:00" },
  ];
  const [before, boundary, control] = snapshotModule.createSamyogaGroupCalendarSnapshots(members);
  const saptawara = (snapshot) => snapshot.calculatedIndicators.find(
    (entry) => entry.indicatorType === "saptawara" && entry.wewaranCycle === null,
  ).value;

  assert.equal(before.baliDayBoundaryApplied, true);
  assert.equal(boundary.baliDayBoundaryApplied, false);
  assert.notEqual(saptawara(before), saptawara(boundary));
  assert.equal(saptawara(boundary), saptawara(control));
});

test("snapshot kalender stabil lintas timezone", () => {
  const probe = path.join(fixtureDirectory, "samyoga-snapshot-timezone-probe.mjs");
  const run = (timezone) => execFileSync(process.execPath, [probe], {
    encoding: "utf8",
    env: { ...process.env, TZ: timezone },
  });
  assert.equal(run("Asia/Makassar"), run("America/Los_Angeles"));
});

test("identitas evidence membedakan nama Wewaran sama pada siklus berbeda", () => {
  const base = {
    indicatorType: "wewaran",
    indicatorValue: "Sri",
    sourceField: "karakter",
  };
  const caturwara = evidenceModule.createSamyogaEvidenceIdentity({
    ...base,
    wewaranCycle: "caturwara",
    masterRecordId: "wewaran:caturwara:1",
  });
  const asatawara = evidenceModule.createSamyogaEvidenceIdentity({
    ...base,
    wewaranCycle: "asatawara",
    masterRecordId: "wewaran:asatawara:1",
  });
  assert.notEqual(caturwara, asatawara);
});

test("evidence tanpa provenance atau review tidak pernah aktif", () => {
  const snapshot = snapshotModule.createSamyogaGroupCalendarSnapshots(MEMBERS.slice(0, 3))[0];
  const interpretation = snapshot.masterInterpretations[0];
  const definition = {
    evidenceId: "draft-missing-source",
    indicatorType: interpretation.indicatorType,
    wewaranCycle: interpretation.wewaranCycle,
    indicatorValue: interpretation.indicatorValue,
    masterRecordId: interpretation.masterRecordId,
    sourceField: interpretation.sourceField,
    excerpt: interpretation.text,
    dimension: "collaborating",
    polarity: "support",
    sourceId: null,
    sourcePage: null,
    provenanceStatus: "missing",
    domainReviewStatus: "pending",
    ruleVersion: "draft-v0",
  };
  const [resolved] = evidenceModule.resolveSamyogaPositionEvidence(snapshot, [definition]);
  assert.equal(resolved.active, false);
  assert.deepEqual(resolved.inactiveReasons, [
    "provenance-not-verified",
    "domain-review-not-approved",
  ]);
});

test("registry dan rules produksi kosong sehingga selalu abstain", () => {
  assert.equal(evidenceModule.SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY.length, 0);
  assert.equal(recommendationModule.SAMYOGA_PRODUCTION_POSITION_RULES.length, 0);
  for (const snapshot of snapshotModule.createSamyogaGroupCalendarSnapshots(MEMBERS.slice(0, 6))) {
    const result = recommendationModule.evaluateProductionSamyogaPositionRecommendation(snapshot);
    assert.equal(result.status, "insufficient_basis");
    assert.equal(result.recommendedPosition, null);
    assert.deepEqual(result.alternativePositions, []);
  }
});

test("evaluator sintetis menghasilkan satu dan beberapa kandidat tanpa skor", () => {
  const evidence = [
    syntheticEvidence({ id: "direction", dimension: "directing" }),
    syntheticEvidence({ id: "collaboration", dimension: "collaborating" }),
    syntheticEvidence({ id: "planning", dimension: "planning" }),
    syntheticEvidence({ id: "managing", dimension: "managing" }),
  ];
  const leaderRule = syntheticRule("leader", "Leader", ["directing", "collaborating"]);
  const one = recommendationModule.evaluateSamyogaPositionRecommendation(
    "member-1",
    evidence,
    [leaderRule],
    "synthetic-test-v1",
  );
  assert.equal(one.status, "recommended");
  assert.equal(one.recommendedPosition, "Leader");

  const multiple = recommendationModule.evaluateSamyogaPositionRecommendation(
    "member-1",
    evidence,
    [leaderRule, syntheticRule("management", "Management", ["planning", "managing"])],
    "synthetic-test-v1",
  );
  assert.equal(multiple.status, "multiple_candidates");
  assert.deepEqual(multiple.alternativePositions, ["Leader", "Management"]);
});

test("evaluator mengabaikan evidence dan rule yang belum disetujui", () => {
  const evidence = [syntheticEvidence({ id: "inactive", dimension: "directing", active: false })];
  const result = recommendationModule.evaluateSamyogaPositionRecommendation(
    "member-1",
    evidence,
    [syntheticRule("pending", "Leader", ["directing"], "pending")],
    "synthetic-test-v1",
  );
  assert.equal(result.status, "insufficient_basis");
  assert.deepEqual(result.activeEvidenceIds, []);
});

test("evaluator melaporkan konflik evidence sintetis", () => {
  const evidence = [
    syntheticEvidence({ id: "direction-support", dimension: "directing" }),
    syntheticEvidence({ id: "direction-caution", dimension: "directing", polarity: "caution" }),
  ];
  const result = recommendationModule.evaluateSamyogaPositionRecommendation(
    "member-1",
    evidence,
    [syntheticRule("leader", "Leader", ["directing"])],
    "synthetic-test-v1",
  );
  assert.equal(result.status, "conflicting_indicators");
  assert.deepEqual(result.conflictingDimensions, ["directing"]);
});

test("permutasi evidence dan rule tidak mengubah rekomendasi", () => {
  const evidence = [
    syntheticEvidence({ id: "planning", dimension: "planning" }),
    syntheticEvidence({ id: "managing", dimension: "managing" }),
  ];
  const rules = [
    syntheticRule("management-b", "Management", ["planning"]),
    syntheticRule("management-a", "Management", ["planning", "managing"]),
  ];
  const direct = recommendationModule.evaluateSamyogaPositionRecommendation(
    "member-1",
    evidence,
    rules,
    "synthetic-test-v1",
  );
  const permuted = recommendationModule.evaluateSamyogaPositionRecommendation(
    "member-1",
    [...evidence].reverse(),
    [...rules].reverse(),
    "synthetic-test-v1",
  );
  assert.deepEqual(permuted, direct);
});
