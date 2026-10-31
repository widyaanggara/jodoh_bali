import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createCivilDate, loadTypeScriptModule, projectRoot } from "./samyoga-test-loader.mjs";

const snapshots = loadTypeScriptModule("lib/samyoga-calendar-snapshot.ts");
const registry = loadTypeScriptModule("lib/samyoga-position-evidence.ts");
const engine = loadTypeScriptModule("lib/samyoga-position-recommendation.ts");
const calendar = loadTypeScriptModule("lib/balinese-calendar.ts");
const data = loadTypeScriptModule("lib/data.ts");
const members = ["a", "b", "c"].map((id) => ({
  id, birthDate: "2005-07-27", birthTime: "06:00",
}));

function snapshot() {
  return snapshots.createSamyogaGroupCalendarSnapshots(members)[0];
}

// Approval ini hanya untuk menguji mekanisme dengan kutipan master aktual.
// Tidak ada definisi fixture ini yang masuk registry produksi.
function definition(overrides = {}) {
  const record = snapshot().masterInterpretations[0];
  return {
    evidenceId: "test-only-evidence",
    indicatorType: record.indicatorType,
    wewaranCycle: record.wewaranCycle,
    indicatorValue: record.indicatorValue,
    masterRecordId: record.masterRecordId,
    sourceField: record.sourceField,
    excerpt: record.text,
    dimension: "directing",
    polarity: "support",
    sourceId: "synthetic-approval-test-only",
    sourcePage: null,
    provenanceStatus: "verified",
    domainReviewStatus: "approved",
    ruleVersion: "synthetic-test-only-v1",
    ...overrides,
  };
}

function rule(overrides = {}) {
  return {
    ruleId: "test-only-rule", ruleVersion: "synthetic-test-only-v1",
    position: "Leader", requiredDimensions: ["directing"],
    domainReviewStatus: "approved", rationale: "Unit test saja.", ...overrides,
  };
}

function resolve(definitions) {
  return registry.resolveSamyogaPositionEvidence(snapshot(), definitions);
}

function evaluate(evidence, rules = [rule()]) {
  return engine.evaluateSamyogaPositionRecommendation("a", evidence, rules, "synthetic-test-only-v1");
}

test("R1: active true palsu dan hasil clone tidak melewati resolver approval", () => {
  const forged = { ...definition({ provenanceStatus: "missing", domainReviewStatus: "pending" }),
    memberId: "a", active: true, inactiveReasons: [] };
  assert.equal(evaluate([forged]).status, "insufficient_basis");
  const [resolved] = resolve([definition()]);
  assert.equal(evaluate([resolved]).status, "recommended");
  assert.equal(evaluate([{ ...resolved }]).status, "insufficient_basis");
  assert.equal(evaluate([structuredClone(resolved)]).status, "insufficient_basis");
  assert.ok(Object.isFrozen(resolved));
  assert.ok(Object.isFrozen(resolved.inactiveReasons));
});

test("R1: approval evidence dan approval rule diperiksa secara terpisah", () => {
  for (const status of ["pending", "rejected"]) {
    assert.equal(evaluate(resolve([definition()]), [rule({ domainReviewStatus: status })]).status,
      "insufficient_basis");
    assert.equal(evaluate(resolve([definition({ domainReviewStatus: status })])).status,
      "insufficient_basis");
  }
});

test("R1: provenance missing/provisional atau verified tanpa sourceId ditolak", () => {
  for (const provenanceStatus of ["missing", "provisional"]) {
    assert.equal(evaluate(resolve([definition({ provenanceStatus })])).status, "insufficient_basis");
  }
  for (const sourceId of [null, "", "   "]) {
    assert.equal(evaluate(resolve([definition({ sourceId })])).status, "insufficient_basis");
  }
});

test("R1: kutipan berubah, ID master salah, field salah, dan nilai salah ditolak", () => {
  for (const change of [
    { excerpt: "Kutipan telah berubah" },
    { masterRecordId: "record-yang-tidak-ada" },
    { sourceField: "penjelasan-yang-tidak-ada" },
    { indicatorValue: "nilai-yang-tidak-ada" },
  ]) {
    const evidence = resolve([definition(change)]);
    assert.ok(evidence[0].inactiveReasons.includes("master-interpretation-not-found"));
    assert.equal(evaluate(evidence).status, "insufficient_basis");
  }
});

test("R1: Sri pada siklus berbeda tidak lolos exact matching", () => {
  const snap = snapshot();
  const record = snap.masterInterpretations.find((entry) => entry.indicatorType === "wewaran");
  assert.ok(record);
  const valid = definition({
    indicatorType: record.indicatorType, wewaranCycle: record.wewaranCycle,
    indicatorValue: record.indicatorValue, masterRecordId: record.masterRecordId,
    sourceField: record.sourceField, excerpt: record.text,
  });
  const [wrongCycle] = resolve([{ ...valid,
    wewaranCycle: record.wewaranCycle === "asatawara" ? "caturwara" : "asatawara" }]);
  assert.equal(wrongCycle.active, false);
  const sri = {
    memberId: "a", masterInterpretations: [{ indicatorType: "wewaran", wewaranCycle: "caturwara",
      indicatorValue: "Sri", masterRecordId: "wewaran:caturwara:1", sourceField: "karakter",
      text: data.caturwaraData[0].karakter }],
  };
  const [mismatch] = registry.resolveSamyogaPositionEvidence(sri, [definition({
    indicatorType: "wewaran", wewaranCycle: "asatawara", indicatorValue: "Sri",
    masterRecordId: "wewaran:caturwara:1", sourceField: "karakter", excerpt: data.caturwaraData[0].karakter,
  })]);
  assert.equal(mismatch.active, false);
});

test("R1: registry kosong dan rule kosong tetap abstain", () => {
  assert.equal(evaluate(resolve([])).status, "insufficient_basis");
  assert.equal(evaluate(resolve([definition()]), []).status, "insufficient_basis");
  for (const requiredDimensions of [[], ["not-a-dimension"], null]) {
    assert.equal(evaluate([], [rule({ requiredDimensions })]).status, "insufficient_basis");
  }
  assert.equal(evaluate(resolve([definition()]), [rule({ position: "Anggota" })]).status,
    "insufficient_basis");
});

test("R1: duplikasi ID evidence dalam registry gagal tertutup", () => {
  const definitions = [definition(), definition({ polarity: "caution" })];
  for (const definitionsInOrder of [definitions, [...definitions].reverse()]) {
    const resolved = resolve(definitionsInOrder);
    assert.ok(resolved.every((entry) => !entry.active && entry.inactiveReasons.includes("duplicate-evidence-id")));
    assert.equal(evaluate(resolved).status, "insufficient_basis");
  }
});

test("R1: referensi evidence berulang dideduplikasi dan ID ambigu lintas resolusi ditolak", () => {
  const [resolved] = resolve([definition()]);
  assert.deepEqual(evaluate([resolved, resolved]), evaluate([resolved]));
  const [collision] = resolve([definition({ polarity: "caution" })]);
  assert.equal(evaluate([resolved, collision]).status, "insufficient_basis");
  assert.deepEqual(evaluate([resolved, collision]), evaluate([collision, resolved]));
  assert.equal(evaluate([resolved], [rule(), rule({ position: "Management" })]).status,
    "insufficient_basis");
});

test("R1: konflik menahan rekomendasi walaupun ada rule bersih; alternatif provisional", () => {
  const resolved = resolve([
    definition({ evidenceId: "direct-support" }),
    definition({ evidenceId: "direct-caution", polarity: "caution" }),
    definition({ evidenceId: "plan-support", dimension: "planning" }),
  ]);
  const rules = [rule(), rule({ ruleId: "management", position: "Management", requiredDimensions: ["planning"] })];
  const result = evaluate(resolved, rules);
  assert.equal(result.status, "conflicting_indicators");
  assert.equal(result.recommendedPosition, null);
  assert.deepEqual(result.alternativePositions, ["Leader", "Management"]);
  assert.deepEqual(result.matchedRuleIds, ["management"]);
  assert.deepEqual(evaluate([...resolved].reverse(), [...rules].reverse()), result);
});

test("R1: konflik di luar dimensi rule tidak memblokir kandidat bersih", () => {
  const resolved = resolve([
    definition({ evidenceId: "direct-support" }),
    definition({ evidenceId: "plan-support", dimension: "planning" }),
    definition({ evidenceId: "plan-caution", dimension: "planning", polarity: "caution" }),
  ]);
  assert.equal(evaluate(resolved).status, "recommended");
});

test("R1: fixture tidak dapat disuntikkan ke jalur produksi", () => {
  const snap = snapshot();
  snap.evidence = resolve([definition()]);
  snap.rules = [rule()];
  const result = engine.evaluateProductionSamyogaPositionRecommendation(snap);
  assert.equal(result.status, "insufficient_basis");
  assert.deepEqual(result.activeEvidenceIds, []);
  assert.equal(Object.isFrozen(engine.SAMYOGA_PRODUCTION_POSITION_RULES), true);
  assert.equal(Object.isFrozen(registry.SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY), true);
  assert.throws(() => engine.SAMYOGA_PRODUCTION_POSITION_RULES.push(rule()), TypeError);
});

test("R1: dua anggota boleh mendapat kandidat sama, evidence anggota lain diabaikan", () => {
  const snaps = snapshots.createSamyogaGroupCalendarSnapshots(members);
  const evidenceA = registry.resolveSamyogaPositionEvidence(snaps[0], [definition()]);
  const evidenceB = registry.resolveSamyogaPositionEvidence(snaps[1], [definition()]);
  assert.equal(evaluate(evidenceB).status, "insufficient_basis");
  for (const memberId of ["a", "b"]) {
    const result = engine.evaluateSamyogaPositionRecommendation(memberId,
      [...evidenceA, ...evidenceB], [rule()], "synthetic-test-only-v1");
    assert.equal(result.recommendedPosition, "Leader");
  }
});

test("R1: input runtime bukan string serta ukuran/ID invalid menghasilkan error terstruktur", () => {
  for (const [field, code] of [["birthTime", "INVALID_BIRTH_TIME"], ["birthDate", "INVALID_BIRTH_DATE"]]) {
    for (const value of [null, undefined, 600, ["06:00"], { toString: () => field === "birthTime" ? "06:00" : "2005-07-27" }]) {
      assert.throws(() => snapshots.createSamyogaGroupCalendarSnapshots([
        { ...members[0], [field]: value }, ...members.slice(1),
      ]), (error) => error.name === "SamyogaGroupValidationError" && error.code === code);
    }
  }
  assert.throws(() => snapshots.createSamyogaGroupCalendarSnapshots(null), { code: "INVALID_GROUP_INPUT" });
  assert.throws(() => snapshots.createSamyogaGroupCalendarSnapshots(members.slice(0, 2)), { code: "GROUP_SIZE_OUT_OF_RANGE" });
  assert.throws(() => snapshots.createSamyogaGroupCalendarSnapshots([members[0], members[0], members[2]]), { code: "DUPLICATE_MEMBER_ID" });
});

test("R1: newline akhir ditolak meskipun regex dollar pada validator existing dapat menerimanya", () => {
  for (const [field, value, code] of [
    ["birthDate", "2005-07-27\n", "INVALID_BIRTH_DATE"],
    ["birthTime", "06:00\n", "INVALID_BIRTH_TIME"],
  ]) {
    assert.throws(() => snapshots.createSamyogaGroupCalendarSnapshots([
      { ...members[0], [field]: value }, ...members.slice(1),
    ]), { code });
  }
});

test("R1: permutasi anggota mempertahankan snapshot per ID dan tidak memutasi master", () => {
  const before = structuredClone(data.wukuData);
  const direct = snapshots.createSamyogaGroupCalendarSnapshots(members);
  const reversed = snapshots.createSamyogaGroupCalendarSnapshots([...members].reverse());
  for (const entry of direct) assert.deepEqual(reversed.find((other) => other.memberId === entry.memberId), entry);
  direct[0].masterInterpretations[0].text = "changed detached snapshot";
  assert.deepEqual(data.wukuData, before);
  assert.notEqual(snapshots.createSamyogaGroupCalendarSnapshots(members)[0].masterInterpretations[0].text,
    "changed detached snapshot");
});

test("R1: seluruh siklus 210 hari memakai nama dan teks master dari cycle yang benar", () => {
  const ordinaryMasters = {
    ekawara: data.ekawaraData, dwiwara: data.dwiwaraData, triwara: data.triwaraData,
    caturwara: data.caturwaraData, pancawara: data.pancawaraData, asatawara: data.asatawaraData,
    sangawara: data.sangawaraData, dasawara: data.dasawaraData,
  };
  for (let day = 0; day < 210; day++) {
    const date = createCivilDate(2005, 7, 27);
    date.setDate(date.getDate() + day);
    const dateText = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    const snap = snapshots.createSamyogaGroupCalendarSnapshots(members.map((member) => ({ ...member, birthDate: dateText })))[0];
    const expected = calendar.getBalineseDate(date, "06:00");
    for (const [cycle, value] of Object.entries(expected.wewaran)) {
      assert.equal(snap.calculatedIndicators.find((entry) => entry.wewaranCycle === cycle).value, value);
    }
    for (const entry of snap.masterInterpretations.filter((item) => ordinaryMasters[item.wewaranCycle])) {
      const record = ordinaryMasters[entry.wewaranCycle].find((item) => item.nama === entry.indicatorValue);
      assert.ok(record);
      assert.equal(entry.text, record.karakter);
      assert.equal(entry.masterRecordId, `wewaran:${entry.wewaranCycle}:${record.id}`);
    }
  }
});

test("R1: jalur produksi tidak mengimpor fixture sintetis", () => {
  for (const filename of ["lib/samyoga-position-evidence.ts", "lib/samyoga-position-recommendation.ts",
    "lib/samyoga-calendar-snapshot.ts", "components/samyoga-group/SamyogaGroupClient.tsx"]) {
    const source = fs.readFileSync(path.join(projectRoot, filename), "utf8");
    assert.doesNotMatch(source, /(?:from|import\s*\()\s*["'][^"']*(?:tests|fixtures)/);
  }
});
