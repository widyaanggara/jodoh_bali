import assert from "node:assert/strict";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { loadNetraModule } from "./helpers/load-netra-typescript.mjs";

const detail = loadNetraModule("lib/netra-hasta/detail-result.ts");
const calendar = loadNetraModule("lib/balinese-calendar.ts");
const jodoh = loadNetraModule("lib/jodoh-logic.ts");
const pal = loadNetraModule("lib/pal-sri-sedana.ts");
const history = loadNetraModule("lib/netra-hasta/history.ts");
const repository = loadNetraModule("lib/netra-hasta/history.server.ts");
const Sections = loadNetraModule("components/netra-hasta/NetraDetailSections.tsx").default;
const birth = { date: "2005-07-27", time: "06:00" };
const range = { startYear: 2000, endYear: 2005 };
const snapshot = detail.createDetailSnapshot(birth, range);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

test("all Otonan fields, zodiac and Pal Sri Sedana come directly from existing engines", () => {
  const civil = new Date(2005, 6, 27, 12);
  assert.deepEqual(snapshot.calendar, calendar.getBalineseDate(civil, birth.time));
  assert.deepEqual(snapshot.zodiac, jodoh.getZodiak(civil));
  assert.deepEqual(snapshot.pal.data, pal.getPalSriSedanaData(snapshot.calendar.totalUrip));
  assert.deepEqual(snapshot.pal.analysis, pal.getCurrentPeriodAnalysis(civil, snapshot.pal.data));
  assert.deepEqual(snapshot.pal.label, pal.getLabelRezeki(snapshot.pal.analysis.value));
});
test("top three dates/scores/order equal the untouched Mencari Jodoh engine", () => {
  const expected = jodoh.findIdealMatches(new Date(2005, 6, 27, 12), birth.time, range.startYear, range.endYear);
  assert.equal(snapshot.matches.totalFound, expected.length);
  assert.deepEqual(snapshot.matches.top.map((m) => [m.date, m.hybridScore, m.category, m.mod16Label]), expected.slice(0, 3).map((m) => [detail.civilDateString(m.date), m.hybridScore, m.kategori.kategori, m.mod16Result.label]));
  assert.equal(snapshot.matches.ordering, "engine-chronological");
  assert.equal(snapshot.matches.top[0].date, "2000-02-07");
});
test("before-sunrise and unknown-time contracts preserve existing engine output", () => {
  for (const time of ["05:59", "06:00", ""]) {
    const value = detail.createDetailSnapshot({ ...birth, time }, { startYear: 2000, endYear: 2000 });
    const expected = calendar.getBalineseDate(new Date(2005, 6, 27, 12), time || undefined);
    assert.deepEqual(value.calendar.wewaran, expected.wewaran);
    assert.deepEqual(value.matches.top.map((m) => m.date), jodoh.findIdealMatches(new Date(2005, 6, 27, 12), time, 2000, 2000).slice(0, 3).map((m) => detail.civilDateString(m.date)));
  }
});
test("invalid dates/times/ranges never enter expensive engine search", () => {
  for (const bad of [{ date: "2001-02-29", time: "" }, { date: "", time: "06:00" }, { ...birth, time: "25:00" }]) assert.throws(() => detail.createDetailSnapshot(bad, range));
  for (const bad of [{ startYear: 2005, endYear: 2000 }, { startYear: 2000, endYear: 2011 }, { startYear: 1899, endYear: 1900 }, { startYear: 2000.5, endYear: 2005 }, { startYear: 2000, endYear: 2101 }]) assert.throws(() => detail.validateMatchRange(bad));
});
test("short result sets keep their actual count rather than fabricating dates", () => {
  const source = fs.readFileSync(path.join(root, "lib/netra-hasta/detail-result.ts"), "utf8");
  assert.match(source, /matches\.slice\(0, 3\)/);
  const sparse = structuredClone(snapshot);
  sparse.matches.top = sparse.matches.top.slice(0, 1); sparse.matches.totalFound = 1;
  const html = renderToStaticMarkup(createElement(Sections, { detail: sparse, candidateStatus: "uncertain" }));
  assert.match(html, /Hanya 1 hasil tersedia/);
  assert.doesNotMatch(html, /Urutan 2/);
});
test("snapshot roundtrip freezes next Otonan, age period and exact top three", () => {
  const encoded = detail.encodeDetailSnapshot(snapshot);
  assert.deepEqual(detail.decodeDetailSnapshot(encoded, birth), snapshot);
  const frozen = structuredClone(snapshot); frozen.calendar.nextOtonan = "Minggu, 1 Januari 2023"; frozen.generatedAt = "2023-01-01T00:00:00Z"; frozen.pal.analysis.currentAge = 17;
  const decoded = detail.decodeDetailSnapshot(JSON.stringify(frozen), birth);
  assert.equal(decoded.calendar.nextOtonan, frozen.calendar.nextOtonan);
  assert.equal(decoded.pal.analysis.currentAge, 17);
  assert.deepEqual(decoded.matches.top, snapshot.matches.top);
});
test("snapshot mismatch, unsupported versions, changed scores and oversized snapshots are rejected", () => {
  for (const change of [(s) => { s.version = "fake"; }, (s) => { s.birth.date = "2000-01-01"; }, (s) => { s.matches.top[0].hybridScore = 100; }, (s) => { s.calendar.wuku.sifat_umum = "Invented"; }]) {
    const modified = structuredClone(snapshot); change(modified);
    assert.throws(() => detail.decodeDetailSnapshot(JSON.stringify(modified), birth));
  }
  assert.throws(() => detail.decodeDetailSnapshot("x".repeat(48001), birth));
});
test("detail rendering includes every existing Otonan category and four honest unsupported statuses", () => {
  const html = renderToStaticMarkup(createElement(Sections, { detail: snapshot, candidateStatus: "automatic_candidate", candidateCount: 3 }));
  for (const text of ["Otonan berikutnya", "Lintang kelahiran", "Penyimbolan", "Karakter &amp; keberuntungan", "Zodiak", "Elemen", "Hari hoki", "Warna hoki", "Angka hoki", "Sifat karakter", "Pal Sri Sedana", "Analisis periode", "Mencari Jodoh", "tanggal lahir pasangan", "bukan tanggal pernikahan", "Heart", "Head", "Life", "Fate"]) assert(html.includes(text), text);
  assert.equal((html.match(/· belum didukung/g) ?? []).length, 4);
  assert.match(html, /3 segmen kandidat otomatis/);
});
test("unknown birth time remains explicit in detail", () => {
  const value = detail.createDetailSnapshot({ ...birth, time: "" }, range);
  assert.match(renderToStaticMarkup(createElement(Sections, { detail: value, candidateStatus: "uncertain" })), /Jam lahir tidak diketahui/);
});
test("stable calendar/zodiac/match data remain identical across timezones", () => {
  const helper = new URL("./helpers/load-netra-typescript.mjs", import.meta.url).href;
  const code = 'import {loadNetraModule} from ' + JSON.stringify(helper) + ';const m=loadNetraModule("lib/netra-hasta/detail-result.ts");const r=m.createDetailSnapshot({date:"2000-02-29",time:"05:59"},{startYear:1999,endYear:2000});delete r.calendar.nextOtonan;console.log(JSON.stringify({calendar:r.calendar,zodiac:r.zodiac,matches:r.matches}));';
  const output = ["Asia/Makassar", "UTC", "America/Los_Angeles"].map((TZ) => {
    const child = spawnSync(process.execPath, ["--input-type=module", "-e", code], { cwd: root, env: { ...process.env, TZ }, encoding: "utf8" });
    assert.equal(child.status, 0, child.stderr); return child.stdout;
  });
  assert.equal(output[0], output[1]); assert.equal(output[0], output[2]);
});
const input = { birthDate: birth.date, birthTime: birth.time, rekhaStatus: "uncertain", consentAccepted: true, consentVersion: history.HISTORY_CONSENT };
const uid = "detail_owner";
const identity = { uid, idToken: "synthetic-only", expiresAt: 9999999999 };
const id = "11111111-1111-4111-8111-111111111111";
function document(fields) {
  return { name: "projects/daily-logs-a1442/databases/(default)/documents/netraHastaUsers/" + uid + "/results/" + id,
    fields: { ...Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, { stringValue: value }])), savedAt: { timestampValue: "2026-11-07T00:00:00Z" } } };
}
test("history v1 remains readable while v2 captures a full reproducible server-generated detail", async () => {
  const original = { enabled: process.env.NETRA_HISTORY_ENABLED, project: process.env.NETRA_HISTORY_RULES_PROJECT };
  process.env.NETRA_HISTORY_ENABLED = "true"; process.env.NETRA_HISTORY_RULES_PROJECT = "daily-logs-a1442";
  try {
    const legacy = history.historyFields(input, uid);
    assert.equal(legacy.schemaVersion, "netra-history-v1"); assert.equal(legacy.detailSnapshot, undefined);
    const newFields = history.historyFields(history.validateHistoryInput({ ...input, matchStartYear: 2000, matchEndYear: 2005 }), uid);
    assert.equal(newFields.schemaVersion, "netra-history-v2"); assert(newFields.detailSnapshot);
    for (const fields of [legacy, newFields]) {
      const record = await repository.getHistory(identity, id, async () => new Response(JSON.stringify(document(fields)), { status: 200 }));
      assert.equal(record.schemaVersion, fields.schemaVersion);
      assert.equal(record.detailSnapshot, fields.detailSnapshot);
    }
  } finally {
    for (const [key, value] of [["NETRA_HISTORY_ENABLED", original.enabled], ["NETRA_HISTORY_RULES_PROJECT", original.project]]) { if (value === undefined) delete process.env[key]; else process.env[key] = value; }
  }
});
test("range payload is validated and cannot inject a client snapshot or birth-date ownership", () => {
  for (const extra of [{ matchStartYear: 2000 }, { matchStartYear: "2000", matchEndYear: 2005 }, { detailSnapshot: "{}" }, { ownerUid: "other" }]) assert.throws(() => history.validateHistoryInput({ ...input, ...extra }));
});
test("detail routes keep server auth; calendar and matching formulas remain in their existing modules", () => {
  for (const name of ["app/netra-hasta/detail/page.tsx", "app/netra-hasta/riwayat/[id]/page.tsx"]) {
    const source = fs.readFileSync(path.join(root, name), "utf8");
    assert.match(source, /await getNetraAccountAccess/); assert.match(source, /account.kind !== "authenticated"/);
  }
  const source = fs.readFileSync(path.join(root, "lib/netra-hasta/detail-result.ts"), "utf8");
  assert.match(source, /findIdealMatches\(civil, birth.time/);
  assert.doesNotMatch(source, /\.sort\(|0\.4|0\.6|REFERENCE_DATE|%\s*(5|16|210)/);
});
