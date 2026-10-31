import assert from "node:assert/strict";
import test from "node:test";
import { createCivilDate, loadTypeScriptModule } from "./samyoga-test-loader.mjs";

const { calculateLeadershipSynergy } = loadTypeScriptModule("lib/synergy-logic.ts");

function calculate(leftDate, rightDate, leftTime = "12:00", rightTime = "12:00") {
  return calculateLeadershipSynergy(
    createCivilDate(...leftDate),
    leftTime,
    createCivilDate(...rightDate),
    rightTime,
  );
}

function core(result) {
  return {
    combinedUrip: result.combinedUrip,
    modulo5: result.modulo5,
    modulo16: result.modulo16,
    category: result.hybridStatus,
    sodasaSisa: result.sodasaRsi.sisa,
  };
}

const REACHABLE_BASELINE = [
  [14, 4, 14, "Nista", [2005, 8, 30], [2005, 8, 30]],
  [15, 5, 15, "Nista", [2005, 8, 30], [2005, 8, 2]],
  [16, 1, 16, "Utama", [2005, 8, 2], [2005, 8, 2]],
  [17, 2, 1, "Madia", [2005, 8, 2], [2005, 7, 31]],
  [18, 3, 2, "Nista", [2005, 7, 31], [2005, 7, 31]],
  [19, 4, 3, "Nista", [2005, 7, 31], [2005, 8, 5]],
  [20, 5, 4, "Madia", [2005, 7, 31], [2005, 8, 10]],
  [21, 1, 5, "Utama", [2005, 7, 31], [2005, 8, 1]],
  [22, 2, 6, "Nista", [2005, 7, 31], [2005, 7, 28]],
  [23, 3, 7, "Madia", [2005, 7, 31], [2005, 8, 24]],
  [24, 4, 8, "Nista", [2005, 7, 31], [2005, 7, 27]],
  [25, 5, 9, "Madia", [2005, 7, 31], [2005, 7, 30]],
  [26, 1, 10, "Utama", [2005, 7, 28], [2005, 7, 28]],
  [27, 2, 11, "Utama", [2005, 7, 28], [2005, 8, 24]],
  [28, 3, 12, "Utama", [2005, 7, 28], [2005, 7, 27]],
  [29, 4, 13, "Nista", [2005, 7, 28], [2005, 7, 30]],
  [30, 5, 14, "Nista", [2005, 7, 27], [2005, 7, 27]],
  [31, 1, 15, "Nista", [2005, 7, 27], [2005, 7, 30]],
  [32, 2, 16, "Utama", [2005, 7, 27], [2005, 8, 6]],
  [33, 3, 1, "Madia", [2005, 7, 27], [2005, 8, 13]],
  [34, 4, 2, "Nista", [2005, 7, 30], [2005, 8, 13]],
  [35, 5, 3, "Nista", [2005, 8, 6], [2005, 8, 13]],
  [36, 1, 4, "Madia", [2005, 8, 13], [2005, 8, 13]],
];

test("baseline mencakup seluruh total urip pasangan yang dapat dicapai", () => {
  const actual = REACHABLE_BASELINE.map(([combined, modulo5, modulo16, category, left, right]) => ({
    expected: { combinedUrip: combined, modulo5, modulo16, category, sodasaSisa: modulo16 },
    actual: core(calculate(left, right)),
  }));
  actual.forEach(({ expected, actual: result }) => assert.deepEqual(result, expected));
  assert.deepEqual([...new Set(actual.map(({ actual: result }) => result.modulo5))].sort(), [1, 2, 3, 4, 5]);
  assert.deepEqual([...new Set(actual.map(({ actual: result }) => result.modulo16))].sort((a, b) => a - b), Array.from({ length: 16 }, (_, index) => index + 1));
});

test("baseline menormalisasi remainder nol menjadi Mod5=5 dan Mod16=16", () => {
  assert.equal(calculate([2005, 8, 30], [2005, 8, 2]).modulo5, 5);
  assert.equal(calculate([2005, 8, 2], [2005, 8, 2]).modulo16, 16);
});

test("baseline membekukan remainder Mod16 13, 14, 15, dan 16", () => {
  const selected = REACHABLE_BASELINE
    .filter(([, , modulo16]) => [13, 14, 15, 16].includes(modulo16))
    .map(([, , modulo16, category, left, right]) => ({ modulo16, category, actual: core(calculate(left, right)) }));
  selected.forEach(({ modulo16, category, actual }) => {
    assert.equal(actual.modulo16, modulo16);
    assert.equal(actual.category, category);
  });
});

test("baseline pasangan simetris untuk tanggal dan waktu yang ditukar", () => {
  const inputs = [];
  for (let day = 1; day <= 21; day += 1) {
    for (const time of ["05:59", "06:00", "23:59"]) {
      inputs.push({ date: [1990, 1, day], time });
    }
  }
  for (const left of inputs) {
    for (const right of inputs) {
      assert.deepEqual(
        core(calculate(left.date, right.date, left.time, right.time)),
        core(calculate(right.date, left.date, right.time, left.time)),
      );
    }
  }
});

test("baseline mempertahankan batas hari tradisional 05:59 dan 06:00", () => {
  assert.deepEqual(core(calculate([1990, 1, 15], [1992, 7, 8], "05:59")), {
    combinedUrip: 28,
    modulo5: 3,
    modulo16: 12,
    category: "Utama",
    sodasaSisa: 12,
  });
  assert.deepEqual(core(calculate([1990, 1, 15], [1992, 7, 8], "06:00")), {
    combinedUrip: 25,
    modulo5: 5,
    modulo16: 9,
    category: "Madia",
    sodasaSisa: 9,
  });
});

test("baseline menerima leap day dan tanggal sebelum anchor", () => {
  assert.deepEqual(core(calculate([2000, 2, 29], [1992, 7, 8])), {
    combinedUrip: 25,
    modulo5: 5,
    modulo16: 9,
    category: "Madia",
    sodasaSisa: 9,
  });
  assert.deepEqual(core(calculate([1990, 1, 15], [1992, 7, 8])), {
    combinedUrip: 25,
    modulo5: 5,
    modulo16: 9,
    category: "Madia",
    sodasaSisa: 9,
  });
});

test("baseline mendokumentasikan invalid Date yang masih crash", () => {
  assert.throws(
    () => calculateLeadershipSynergy(new Date(Number.NaN), "12:00", createCivilDate(1992, 7, 8), "12:00"),
    TypeError,
  );
});

test("baseline mendokumentasikan birthTime invalid yang masih diterima", () => {
  const invalidTime = calculateLeadershipSynergy(
    createCivilDate(1990, 1, 15),
    "invalid",
    createCivilDate(1992, 7, 8),
    "12:00",
  );
  const noon = calculate([1990, 1, 15], [1992, 7, 8]);
  assert.deepEqual(core(invalidTime), core(noon));
});
