import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadNetraModule } from "./helpers/load-netra-typescript.mjs";
const review = loadNetraModule("lib/netra-hasta/rekha-review.ts");
const flow = loadNetraModule("lib/netra-hasta/product-flow.ts");
const history = loadNetraModule("lib/netra-hasta/history.ts");
const List = loadNetraModule("components/netra-hasta/RekhaStatusList.tsx").default;
const Editor = loadNetraModule("components/netra-hasta/RekhaCaptureEditor.tsx").default;
const birth = { date: "2005-07-27", time: "" };
const points = [{ x: 10, y: 20 }, { x: 40, y: 60 }, { x: 50, y: 100 }];
const candidate = { id: "real-segment", points, lengthPixels: 90, continuity: 1, averageResponse: 10 };
const snapshot = { captureId: 11, width: 120, height: 180, phase: "ready", qualityMode: "normal", qualityWarnings: [], candidateStatus: "automatic_candidate", candidateCount: 1, reason: null };
const start = () => flow.reduceProductState(flow.reduceProductState(flow.INITIAL_PRODUCT_STATE, { type: "start", birth }), { type: "capture", snapshot });
test("empty review never fabricates four automatic classes or Fate", () => {
  const rows = review.summarizeRekha({});
  assert.equal(rows.length, 4); assert(rows.every((r) => r.status === "unsupported" && r.origin === "unavailable"));
});
test("pointer mapping preserves native ROI coordinates at mobile and desktop scales", () => {
  for (const displayWidth of [160, 320, 580]) {
    const rect = { left: 20, top: 50, width: displayWidth, height: displayWidth * 1.5 };
    assert.deepEqual(review.roiPoint(20 + displayWidth / 2, 50 + displayWidth * .75, rect, 120, 180), { x: 60, y: 90 });
    assert.equal(review.roiPoint(19, 50, rect, 120, 180), null);
    assert.deepEqual(review.roiPoint(20 + displayWidth, 50 + displayWidth * 1.5, rect, 120, 180), { x: 119, y: 179 });
  }
  assert.equal(review.roiPoint(0, 0, { left: 0, top: 0, width: 0, height: 0 }, 120, 180), null);
  assert.equal(review.roiPoint(NaN, 0, { left: 0, top: 0, width: 10, height: 10 }, 120, 180), null);
});
test("drawing requires in-bounds distinct points and clones data without extrapolation", () => {
  const mark = review.drawRekha("fate", points, 120, 180);
  assert.equal(mark.status, "user_drawn"); assert.deepEqual(mark.points, points); assert.notEqual(mark.points, points);
  for (const invalid of [[], [points[0]], [{ x: 5, y: 5 }, { x: 5, y: 5 }], [{ x: -1, y: 5 }, points[1]], [{ x: 120, y: 5 }, points[1]], [{ x: NaN, y: 0 }, points[1]], Array(513).fill(points[0])]) assert.throws(() => review.drawRekha("heart", invalid, 120, 180));
  assert.throws(() => review.drawRekha("other", points, 120, 180));
});
test("confirmation uses only the exact selected candidate with explicit user provenance", () => {
  const mark = review.confirmRekha("heart", "real-segment", [candidate], 120, 180);
  assert.deepEqual(mark.points, points); assert.equal(mark.status, "user_confirmed"); assert.notEqual(mark.points[0], points[0]);
  assert.throws(() => review.confirmRekha("heart", "missing", [candidate], 120, 180));
  assert.throws(() => review.confirmRekha("heart", "real-segment", [{ ...candidate, points: [{ x: 200, y: 0 }, points[1]] }], 120, 180));
});
test("all four labels retain drawn, confirmed, uncertain, unsupported separately", () => {
  const rows = review.summarizeRekha({ heart: review.confirmRekha("heart", candidate.id, [candidate], 120, 180), head: review.drawRekha("head", points, 120, 180), life: { name: "life", status: "uncertain", points: [] } });
  assert.deepEqual(rows.map((r) => r.status), ["user_confirmed", "user_drawn", "uncertain", "unsupported"]);
  assert.equal(rows[0].origin, "user_confirmation"); assert.equal(rows[1].origin, "user_drawing");
  assert.doesNotMatch(JSON.stringify(rows), /"points"|"candidateId"|"data"|"x"|"y"/);
});
test("review reducer ignores stale capture, invalid promotion, and strips extra coordinates", () => {
  const state = start(); const rows = review.summarizeRekha({ fate: review.drawRekha("fate", points, 120, 180) });
  assert.equal(flow.reduceProductState(state, { type: "review-rekha", captureId: 9, classes: rows }), state);
  const invalid = structuredClone(rows); invalid[0].status = "automatic_candidate";
  assert.equal(flow.reduceProductState(state, { type: "review-rekha", captureId: 11, classes: invalid }), state);
  rows[3].points = points;
  const next = flow.reduceProductState(state, { type: "review-rekha", captureId: 11, classes: rows });
  assert.equal(next.result.rekha.classes[3].status, "user_drawn"); assert(!("points" in next.result.rekha.classes[3]));
  assert.equal(state.result.rekha.classes[3].status, "unsupported");
});
test("worker updates preserve review for same ROI but retake/reset clear it", () => {
  const state = flow.reduceProductState(start(), { type: "review-rekha", captureId: 11, classes: review.summarizeRekha({ life: review.drawRekha("life", points, 120, 180) }) });
  assert.equal(flow.reduceProductState(state, { type: "capture", snapshot: { ...snapshot, candidateCount: 2 } }).result.rekha.classes[2].status, "user_drawn");
  assert.equal(flow.reduceProductState(state, { type: "capture", snapshot: { ...snapshot, captureId: 12 } }).result.rekha.classes[2].status, "unsupported");
  assert.equal(flow.reduceProductState(state, { type: "capture", snapshot: { ...snapshot, width: 121 } }).result.rekha.classes[2].status, "unsupported");
  for (const action of [{ type: "reset" }, { type: "capture", snapshot: null }, { type: "edit", field: "time", value: "06:00" }]) assert.equal(flow.reduceProductState(state, action).result, null);
});
test("history request remains byte-identical after user review, no class or coordinate upload", () => {
  const original = start().result;
  const reviewed = flow.reduceProductState(start(), { type: "review-rekha", captureId: 11, classes: review.summarizeRekha({ fate: review.drawRekha("fate", points, 120, 180) }) }).result;
  assert.deepEqual(history.historyInputFromResult(reviewed), history.historyInputFromResult(original));
  const body = JSON.stringify(history.historyInputFromResult(reviewed));
  assert.doesNotMatch(body, /user_drawn|points|candidateId|fate|coordinates/);
});
test("cleanup zeroes owned review coordinates without modifying detector candidates", () => {
  const mark = review.confirmRekha("head", candidate.id, [candidate], 120, 180); const savedPoint = mark.points[0]; const marks = { head: mark };
  review.wipeRekhaMarks(marks); assert.deepEqual(savedPoint, { x: 0, y: 0 }); assert.equal(mark.points.length, 0);
  assert.deepEqual(candidate.points, points);
});
test("rendered status and editor preserve honest sources and empty drawing", () => {
  const rows = review.summarizeRekha({ fate: review.drawRekha("fate", points, 120, 180) });
  const html = renderToStaticMarkup(createElement(List, { classes: rows }));
  assert.match(html, /Ditandai pengguna/); assert.match(html, /bukan deteksi otomatis/);
  const original = { width: 120, height: 180, data: new Uint8ClampedArray(120 * 180 * 4) };
  const editor = renderToStaticMarkup(createElement(Editor, { capture: { original, capturedAt: 11 }, extraction: { phase: "idle" }, onReview() {} }));
  assert.match(editor, /viewBox="0 0 120 180"/); assert.match(editor, /Tandai garis sendiri/);
  assert.match(editor, /Belum dapat dipastikan/); assert.doesNotMatch(editor, /<polyline[^>]*points="[^"]+/);
  assert.match(editor, /Penandaan tidak disimpan ke riwayat/);
});
test("review implementation has no network or automatic persistent storage", () => {
  const source = ["lib/netra-hasta/rekha-review.ts", "components/netra-hasta/RekhaCaptureEditor.tsx", "components/netra-hasta/RekhaStatusList.tsx"].map((f) => fs.readFileSync(f, "utf8")).join("\n");
  assert.doesNotMatch(source, /\bfetch\s*\(|sendBeacon|XMLHttpRequest|localStorage|sessionStorage|indexedDB|firebase|toDataURL|toBlob/);
});
