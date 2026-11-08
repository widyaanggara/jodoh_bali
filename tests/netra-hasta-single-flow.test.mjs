import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime.js";
import { loadNetraModule } from "./helpers/load-netra-typescript.mjs";

const flow = loadNetraModule("lib/netra-hasta/product-flow.ts");
const details = loadNetraModule("lib/netra-hasta/detail-result.ts");
const Sections = loadNetraModule("components/netra-hasta/NetraDetailSections.tsx").default;
const Product = loadNetraModule("components/netra-hasta/NetraHastaProductProvider.tsx");
const Account = loadNetraModule("components/netra-hasta/NetraAccountProvider.tsx");
const Result = loadNetraModule("components/netra-hasta/NetraCaptureResults.tsx").default;
const birth = { date: "2005-07-27", time: "" };
const capture = { captureId: 44, width: 241, height: 338, qualityMode: "manual-override", qualityWarnings: ["Sharpness below ideal"], phase: "ready", candidateStatus: "uncertain", candidateCount: 0, reason: "No evidence" };

function renderPublic() {
  const oldProduct = Product.useNetraHastaProduct, oldAccount = Account.useNetraAccount;
  Product.useNetraHastaProduct = () => ({ state: { ...flow.INITIAL_PRODUCT_STATE, birth, result: flow.buildCombinedResult(birth, capture) }, dispatch() {} });
  Account.useNetraAccount = () => ({ uid: null, loading: false, busy: false, historyEnabled: false, configured: true });
  try {
    return renderToStaticMarkup(React.createElement(AppRouterContext.Provider, { value: { replace() {}, refresh() {}, push() {}, prefetch() {}, back() {}, forward() {} } },
      React.createElement(Result, { preview: React.createElement("section", { id: "preview-fixture" }, "ROI and manual review fixture") })));
  } finally { Product.useNetraHastaProduct = oldProduct; Account.useNetraAccount = oldAccount; }
}

test("public inline results show actual calendar, but only placeholders before verified login", () => {
  const html = renderPublic();
  assert.match(html, /Ramalan Otonan lengkap/); assert.match(html, /Sinta/); assert.match(html, /Kliwon/);
  assert.match(html, /<details id="netra-preview-disclosure"/);
  assert.doesNotMatch(html, /<details[^>]*id="netra-preview-disclosure"[^>]* open/);
  assert.match(html, /Lihat pratinjau telapak dan penandaan Rekha/);
  assert.match(html, /Mencari Jodoh/); assert.match(html, /Masuk untuk melihat hasil lengkap/);
  assert.doesNotMatch(html, /netra-match-startYear|Terapkan rentang|Urutan 1|rekha-editor-heading|Simpan hasil ke akun/);
  assert.match(html, /aria-hidden="true" inert=""/);
  assert(html.indexOf("Ramalan Otonan lengkap") < html.indexOf("preview-fixture"));
  assert(html.indexOf("preview-fixture") < html.indexOf("Rentang tahun lahir pasangan"));
  assert(html.indexOf("Analisis Rekha dan statusnya") < html.indexOf('id="netra-email"'));
  assert.doesNotMatch(html, /otomatis tervalidasi|sudah dikenali otomatis/);
});

test("calendar/supporting presentation groups preserve every default detail section", () => {
  const detail = details.createDetailSnapshot(birth, { startYear: 2000, endYear: 2005 });
  const props = { detail, candidateStatus: "uncertain" };
  const full = renderToStaticMarkup(React.createElement(Sections, props));
  const calendar = renderToStaticMarkup(React.createElement(Sections, { ...props, sectionGroup: "calendar" }));
  const supporting = renderToStaticMarkup(React.createElement(Sections, { ...props, sectionGroup: "supporting" }));
  assert.match(calendar, /Ramalan Otonan lengkap/); assert.doesNotMatch(calendar, /Analisis Rekha dan statusnya/);
  assert.match(supporting, /Analisis Rekha dan statusnya/); assert.doesNotMatch(supporting, /Ramalan Otonan lengkap/);
  assert.equal(full.replace('<div class="netra-details">', '').slice(0, -6),
    calendar.replace('<div class="netra-details">', '').slice(0, -6) + supporting.replace('<div class="netra-details">', '').slice(0, -6));
});

test("retake keeps birth but discards detail/review; changed date invalidates all previous output", () => {
  const started = flow.reduceProductState(flow.INITIAL_PRODUCT_STATE, { type: "start", birth });
  const done = flow.reduceProductState(started, { type: "capture", snapshot: capture });
  const retry = flow.reduceProductState(done, { type: "capture", snapshot: null });
  assert.deepEqual(retry.birth, birth); assert.equal(retry.result, null);
  assert.equal(flow.reduceProductState(retry, { type: "review-rekha", captureId: 44, classes: done.result.rekha.classes }).result, null);
  const changed = flow.reduceProductState(done, { type: "edit", field: "date", value: "2000-02-29" });
  assert.equal(changed.birth, null); assert.equal(changed.result, null);
  assert.deepEqual(flow.reduceProductState(done, { type: "reset" }), flow.INITIAL_PRODUCT_STATE);
});

test("product derives hand and removes mode picker from DOM without deleting face implementation", () => {
  const source = fs.readFileSync("components/netra-hasta/NetraHastaClient.tsx", "utf8");
  assert.match(source, /productMode \? "hand" : selectedMode/);
  assert.match(source, /if \(productMode\) return;/);
  assert.match(source, /useFaceLandmarker/); assert.match(source, /FaceTrackingPanel/); assert.match(source, /: <ScanModePicker/);
  assert.match(source, /prefers-reduced-motion/); assert.match(source, /heading\?\.focus\(\{ preventScroll: true \}\)/);
  const form = fs.readFileSync("components/netra-hasta/NetraHastaFlow.tsx", "utf8");
  assert.match(form, /state\.result\?\.rekha\.snapshot\.captureId === captureId/);
  assert.doesNotMatch(form, /state\.result && <NetraHastaBasicResult/);
});

test("pending/error are not prematurely presented as abstain or successful Rekha", () => {
  const detail = details.createDetailSnapshot(birth, { startYear: 2000, endYear: 2005 });
  const render = candidatePhase => renderToStaticMarkup(React.createElement(Sections, { detail, candidateStatus: "uncertain", candidatePhase, sectionGroup: "supporting" }));
  assert.match(render("processing"), /sedang diproses lokal/);
  assert.doesNotMatch(render("processing"), /detektor memilih abstain/);
  assert.match(render("error"), /Pemrosesan kandidat gagal/);
  assert.match(render("ready"), /abstain/);
});
