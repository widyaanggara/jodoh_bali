import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadTypeScriptModule } from "./samyoga-test-loader.mjs";

const group = loadTypeScriptModule("lib/samyoga-group.ts");
const pair = loadTypeScriptModule("lib/synergy-logic.ts");
const fixtureDirectory = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures");

const MEMBER_FIXTURES = [
  { id: "anggota-a", birthDate: "1990-01-15", birthTime: "06:00" },
  { id: "anggota-b", birthDate: "1992-07-08", birthTime: "12:00" },
  { id: "anggota-c", birthDate: "2000-02-29", birthTime: "05:59" },
  { id: "anggota-d", birthDate: "2005-07-27", birthTime: "12:00" },
  { id: "anggota-e", birthDate: "1988-12-31", birthTime: "23:59" },
  { id: "anggota-f", birthDate: "2012-02-29", birthTime: "06:00" },
  { id: "anggota-g", birthDate: "1975-06-01", birthTime: "12:00" },
];

function expectValidationError(callback, code) {
  assert.throws(callback, (error) => {
    assert.equal(error.name, "SamyogaGroupValidationError");
    assert.equal(error.code, code);
    return true;
  });
}

test("kelompok 3/4/5/6 menghasilkan 3/6/10/15 pasangan", () => {
  const expectations = new Map([[3, 3], [4, 6], [5, 10], [6, 15]]);
  expectations.forEach((pairCount, memberCount) => {
    const result = group.calculateSamyogaGroup(MEMBER_FIXTURES.slice(0, memberCount));
    assert.equal(result.memberCount, memberCount);
    assert.equal(result.pairCount, pairCount);
    assert.equal(result.pairs.length, pairCount);
    assert.equal(Object.values(result.categoryCounts).reduce((total, value) => total + value, 0), pairCount);
  });
});

test("kelompok 2 dan 7 anggota ditolak dengan error terstruktur", () => {
  expectValidationError(
    () => group.calculateSamyogaGroup(MEMBER_FIXTURES.slice(0, 2)),
    "GROUP_SIZE_OUT_OF_RANGE",
  );
  expectValidationError(
    () => group.calculateSamyogaGroup(MEMBER_FIXTURES.slice(0, 7)),
    "GROUP_SIZE_OUT_OF_RANGE",
  );
});

test("duplicate ID ditolak tetapi tanggal sama dengan ID berbeda diterima", () => {
  const duplicate = MEMBER_FIXTURES.slice(0, 3).map((member) => ({ ...member }));
  duplicate[2].id = duplicate[0].id;
  expectValidationError(() => group.calculateSamyogaGroup(duplicate), "DUPLICATE_MEMBER_ID");

  const sameDate = MEMBER_FIXTURES.slice(0, 3).map((member) => ({ ...member }));
  sameDate[1].birthDate = sameDate[0].birthDate;
  sameDate[1].birthTime = sameDate[0].birthTime;
  assert.equal(group.calculateSamyogaGroup(sameDate).pairCount, 3);
});

test("tanggal dan jam invalid ditolak sebelum memanggil engine pasangan", () => {
  for (const birthDate of ["", "2024-2-29", "2023-02-29", "2024-13-01", "not-a-date"]) {
    const members = MEMBER_FIXTURES.slice(0, 3).map((member) => ({ ...member }));
    members[1].birthDate = birthDate;
    expectValidationError(() => group.calculateSamyogaGroup(members), "INVALID_BIRTH_DATE");
  }
  for (const birthTime of ["", "6:00", "24:00", "12:60", "invalid"]) {
    const members = MEMBER_FIXTURES.slice(0, 3).map((member) => ({ ...member }));
    members[1].birthTime = birthTime;
    expectValidationError(() => group.calculateSamyogaGroup(members), "INVALID_BIRTH_TIME");
  }
});

test("canonical pair key menghilangkan pasangan duplikat", () => {
  const result = group.calculateSamyogaGroup(MEMBER_FIXTURES.slice(0, 6));
  const keys = result.pairs.map((entry) => entry.pairKey);
  assert.equal(new Set(keys).size, keys.length);
  result.pairs.forEach((entry) => {
    assert.equal(entry.pairKey, group.createCanonicalSamyogaPairKey(entry.memberAId, entry.memberBId));
  });
});

test("permutasi anggota menghasilkan output kategorikal identik", () => {
  const members = MEMBER_FIXTURES.slice(0, 5);
  const permuted = [members[4], members[1], members[3], members[0], members[2]];
  assert.deepEqual(group.calculateSamyogaGroup(permuted), group.calculateSamyogaGroup(members));
});

test("engine kelompok tidak memutasi input", () => {
  const members = MEMBER_FIXTURES.slice(0, 4).map((member) => ({ ...member }));
  const snapshot = structuredClone(members);
  group.calculateSamyogaGroup(members);
  assert.deepEqual(members, snapshot);
});

test("setiap pasangan konsisten dengan engine existing", () => {
  const members = MEMBER_FIXTURES.slice(0, 6);
  const byId = new Map(members.map((member) => [member.id, member]));
  const result = group.calculateSamyogaGroup(members);
  result.pairs.forEach((entry) => {
    const left = byId.get(entry.memberAId);
    const right = byId.get(entry.memberBId);
    const expected = pair.calculateLeadershipSynergy(
      group.parseSamyogaCivilDate(left.birthDate),
      left.birthTime,
      group.parseSamyogaCivilDate(right.birthDate),
      right.birthTime,
    );
    assert.equal(entry.category, expected.hybridStatus);
    assert.equal(entry.combinedUrip, expected.combinedUrip);
    assert.equal(entry.modulo5, expected.modulo5);
    assert.equal(entry.modulo16, expected.modulo16);
    assert.equal(entry.sodasaRsi.sisa, expected.sodasaRsi.sisa);
  });
});

test("ringkasan per anggota dan kandidat perhatian simbolis konsisten", () => {
  const result = group.calculateSamyogaGroup(MEMBER_FIXTURES.slice(0, 6));
  result.memberSummaries.forEach((summary) => {
    assert.equal(summary.pairCount, 5);
    assert.equal(
      Object.values(summary.categoryCounts).reduce((total, value) => total + value, 0),
      summary.pairCount,
    );
  });
  assert.deepEqual(
    result.symbolicAttentionPairKeys,
    result.pairs.filter((entry) => entry.category === "Nista").map((entry) => entry.pairKey),
  );
  result.pairs.filter((entry) => entry.category === "Nista").forEach((entry) => {
    assert.equal(entry.symbolicAttention, true);
    assert.match(entry.symbolicAttentionNote, /simbolis/i);
    assert.match(entry.symbolicAttentionNote, /bukan kegagalan interpersonal/i);
  });
});

test("civil-date dan hasil kelompok stabil di Asia/Makassar dan America/Los_Angeles", () => {
  const probe = path.join(fixtureDirectory, "samyoga-timezone-probe.mjs");
  const run = (timezone) => execFileSync(process.execPath, [probe], {
    encoding: "utf8",
    env: { ...process.env, TZ: timezone },
  });
  const makassar = run("Asia/Makassar");
  const losAngeles = run("America/Los_Angeles");
  assert.equal(losAngeles, makassar);
  assert.deepEqual(JSON.parse(makassar), group.calculateSamyogaGroup([
    { id: "anggota-c", birthDate: "2000-02-29", birthTime: "05:59" },
    { id: "anggota-a", birthDate: "1990-01-15", birthTime: "06:00" },
    { id: "anggota-b", birthDate: "2005-07-27", birthTime: "12:00" },
    { id: "anggota-d", birthDate: "1988-12-31", birthTime: "23:59" },
  ]));
});
