import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { loadNetraModule } from "./helpers/load-netra-typescript.mjs";

const flow = loadNetraModule("lib/netra-hasta/product-flow.ts");
const BasicResult = loadNetraModule("components/netra-hasta/NetraHastaBasicResult.tsx").default;
const input = { date: "2005-07-27", time: "06:00" };
const snapshot = { captureId: 123, width: 241, height: 338, qualityMode: "normal", qualityWarnings: [], phase: "ready", candidateStatus: "automatic_candidate", candidateCount: 3, reason: null };
function render(changes = {}) {
  return renderToStaticMarkup(createElement(BasicResult, { result: flow.buildCombinedResult(input, { ...snapshot, ...changes }), onReset() {} }));
}
test("basic result renders actual calendar values, candidate count and gated detail link", () => {
  const html = render();
  assert.match(html, /Sinta/);
  assert.match(html, /Kliwon/);
  assert.match(html, /3 segmen kandidat otomatis/);
  assert.match(html, /href="\/netra-hasta\/detail"/);
  assert.match(html, /Buka Ramalan Detail/);
  assert.match(html, /Heart, Head, Life, dan Fate belum diklasifikasikan/);
  assert.doesNotMatch(html, /<img|<canvas|data:image|<input/);
});
test("processing, abstain and error are distinct in basic results", () => {
  assert.match(render({ phase: "processing", candidateCount: 0 }), /sedang diproses lokal/);
  assert.match(render({ candidateStatus: "uncertain", candidateCount: 0 }), /abstain/);
  assert.match(render({ phase: "error" }), /Hasil kalender tetap tersedia/);
});
test("manual capture warning remains visible without a validated Rekha claim", () => {
  assert.match(render({ qualityMode: "manual-override" }), /Capture manual dengan peringatan kualitas/);
  assert.match(render(), /Menyimpan hasil memerlukan persetujuan terpisah/);
});

test("basic result explains uncertainty when birth time is not provided", () => {
  const result = flow.buildCombinedResult({ ...input, time: "" }, snapshot);
  const html = renderToStaticMarkup(createElement(BasicResult, { result, onReset() {} }));
  assert.match(html, /Jam lahir tidak diketahui/);
  assert.match(html, /tanpa penyesuaian sebelum pukul 06:00/);
  assert.match(html, /Sinta/);
});
