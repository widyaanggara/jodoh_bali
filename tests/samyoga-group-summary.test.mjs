import assert from "node:assert/strict";
import test from "node:test";
import { loadTypeScriptModule } from "./samyoga-test-loader.mjs";

const group = loadTypeScriptModule("lib/samyoga-group.ts");
const summaryModule = loadTypeScriptModule("lib/samyoga-group-summary.ts");

function syntheticResult({ Utama, Madia, Nista }, memberCount = 3) {
  const categories = [
    ...Array(Utama).fill("Utama"),
    ...Array(Madia).fill("Madia"),
    ...Array(Nista).fill("Nista"),
  ];
  return {
    memberCount,
    pairCount: categories.length,
    pairs: categories.map((category, index) => ({
      pairKey: `pair-${index + 1}`,
      category,
    })),
    categoryCounts: { Utama, Madia, Nista },
    memberSummaries: [],
    symbolicAttentionPairKeys: categories
      .map((category, index) => category === "Nista" ? `pair-${index + 1}` : null)
      .filter(Boolean),
    interpretationScope: "traditional-symbolic",
  };
}

function completedMembers(count) {
  const fixtures = [
    ["a", "1990-01-15", "12:00"],
    ["b", "1992-07-08", "05:59"],
    ["c", "2000-02-29", "06:00"],
    ["d", "2005-07-27", "18:30"],
    ["e", "1988-12-31", "00:00"],
    ["f", "2012-02-29", "23:59"],
  ];
  return fixtures.slice(0, count).map(([id, birthDate, birthTime]) => ({ id, birthDate, birthTime }));
}

test("ringkasan 3-6 anggota menjaga jumlah pasangan dan kategori", () => {
  for (const [memberCount, expectedPairs] of [[3, 3], [4, 6], [5, 10], [6, 15]]) {
    const result = group.calculateSamyogaGroup(completedMembers(memberCount));
    const summary = summaryModule.summarizeSamyogaGroup(result);
    assert.equal(summary.memberCount, memberCount);
    assert.equal(summary.pairCount, expectedPairs);
    assert.equal(
      Object.values(summary.categoryCounts).reduce((total, count) => total + count, 0),
      expectedPairs,
    );
  }
});

test("kategori tunggal dengan jumlah maksimum menghasilkan label dominan", () => {
  const fixtures = [
    [{ Utama: 3, Madia: 2, Nista: 1 }, "Dominan Utama"],
    [{ Utama: 1, Madia: 4, Nista: 1 }, "Dominan Madia"],
    [{ Utama: 1, Madia: 2, Nista: 3 }, "Dominan Nista"],
  ];
  for (const [counts, expected] of fixtures) {
    const summary = summaryModule.summarizeSamyogaGroup(syntheticResult(counts));
    assert.equal(summary.compositionLabel, expected);
    assert.equal(summary.hasTie, false);
    assert.equal(summary.dominantCategories.length, 1);
    assert.equal(typeof summary.overallInterpretation, "string");
    assert.ok(summary.overallInterpretation.length > 80);
  }
});

test("seri dua arah dan tiga arah menjadi Komposisi Campuran", () => {
  const twoWay = summaryModule.summarizeSamyogaGroup(
    syntheticResult({ Utama: 2, Madia: 2, Nista: 1 }),
  );
  assert.equal(twoWay.compositionLabel, "Komposisi Campuran");
  assert.equal(twoWay.hasTie, true);
  assert.deepEqual(twoWay.dominantCategories, ["Utama", "Madia"]);
  assert.match(twoWay.overallInterpretation, /tidak dapat diwakili oleh satu kategori dominan/i);

  const threeWay = summaryModule.summarizeSamyogaGroup(
    syntheticResult({ Utama: 1, Madia: 1, Nista: 1 }),
  );
  assert.equal(threeWay.compositionLabel, "Komposisi Campuran");
  assert.deepEqual(threeWay.dominantCategories, ["Utama", "Madia", "Nista"]);
});

test("interpretasi kategori tetap simbolis dan tidak menjanjikan keberhasilan", () => {
  const summaries = [
    { counts: { Utama: 3, Madia: 2, Nista: 1 }, phrase: /kecenderungan keselarasan/i },
    { counts: { Utama: 1, Madia: 3, Nista: 2 }, phrase: /komposisi menengah/i },
    { counts: { Utama: 1, Madia: 2, Nista: 3 }, phrase: /tidak berarti kelompok gagal/i },
    { counts: { Utama: 2, Madia: 2, Nista: 1 }, phrase: /komposisi hasil Samyoga yang beragam/i },
  ].map(({ counts, phrase }) => ({
    phrase,
    summary: summaryModule.summarizeSamyogaGroup(syntheticResult(counts)),
  }));

  for (const { summary, phrase } of summaries) {
    assert.match(summary.overallInterpretation, phrase);
    assert.doesNotMatch(summary.overallInterpretation, /pasti sukses|kecocokan \d+%|produktivitas|kepemimpinan/i);
  }
});

test("ringkasan menolak jumlah kategori atau rincian pasangan yang tidak konsisten", () => {
  const invalid = syntheticResult({ Utama: 2, Madia: 1, Nista: 0 });
  invalid.pairCount = 4;
  assert.throws(
    () => summaryModule.summarizeSamyogaGroup(invalid),
    /tidak konsisten/i,
  );
});

test("ringkasan tidak memutasi hasil engine", () => {
  const result = syntheticResult({ Utama: 2, Madia: 1, Nista: 0 });
  const snapshot = structuredClone(result);
  const summary = summaryModule.summarizeSamyogaGroup(result);
  summary.categoryCounts.Utama = 99;
  summary.dominantCategories.push("Nista");
  assert.deepEqual(result, snapshot);
});

test("permutasi anggota menghasilkan ringkasan komposisi identik", () => {
  const members = completedMembers(6);
  const original = summaryModule.summarizeSamyogaGroup(group.calculateSamyogaGroup(members));
  const permuted = summaryModule.summarizeSamyogaGroup(
    group.calculateSamyogaGroup([members[5], members[2], members[0], members[4], members[1], members[3]]),
  );
  assert.deepEqual(permuted.categoryCounts, original.categoryCounts);
  assert.equal(permuted.compositionLabel, original.compositionLabel);
  assert.deepEqual(permuted.dominantCategories, original.dominantCategories);
});

test("kontrol detail tertutup di awal dan dapat ditoggle dua arah", () => {
  assert.equal(summaryModule.SAMYOGA_PAIR_DETAILS_INITIAL_OPEN, false);
  assert.equal(summaryModule.toggleSamyogaPairDetails(false), true);
  assert.equal(summaryModule.toggleSamyogaPairDetails(true), false);
});

test("simbol jaringan mengikuti jumlah anggota dan seluruh pasangan unik", () => {
  for (const memberCount of [3, 4, 5, 6]) {
    const geometry = summaryModule.createSamyogaGroupNetworkGeometry(memberCount);
    const expectedConnections = memberCount * (memberCount - 1) / 2;
    assert.equal(geometry.nodes.length, memberCount);
    assert.equal(geometry.connections.length, expectedConnections);
    assert.equal(
      new Set(geometry.connections.map(({ from, to }) => `${from}-${to}`)).size,
      expectedConnections,
    );
    assert.ok(geometry.connections.every(({ from, to }) => from < to));
  }
});

test("simbol jaringan menolak jumlah di luar 3-6 anggota", () => {
  assert.throws(() => summaryModule.createSamyogaGroupNetworkGeometry(2), RangeError);
  assert.throws(() => summaryModule.createSamyogaGroupNetworkGeometry(7), RangeError);
  assert.throws(() => summaryModule.createSamyogaGroupNetworkGeometry(3.5), RangeError);
});
