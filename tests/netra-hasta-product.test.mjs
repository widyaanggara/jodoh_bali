import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { loadNetraModule } from "./helpers/load-netra-typescript.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const flow = loadNetraModule("lib/netra-hasta/product-flow.ts");
const calendar = loadNetraModule("lib/balinese-calendar.ts");
const access = loadNetraModule("lib/netra-hasta/account-access.server.ts");
const birth = { date: "2005-07-27", time: "06:00" };
const capture = { capturedAt: 123, original: { width: 120, height: 180, data: new Uint8ClampedArray([9, 8, 7, 255]) }, qualityMode: "normal", qualityWarnings: [] };
const ready = { phase: "ready", result: { captureId: 123, baseline: { status: "detected", candidateCount: 3, reason: null } } };
const snapshot = () => flow.createPalmProductSnapshot(capture, ready);

test("civil birth date accepts leap day and rejects rollover, future and unsupported years", () => {
  assert.equal(flow.validateBirthInput({ date: "2000-02-29", time: "23:59" }).valid, true);
  for (const date of ["2001-02-29", "2000-02-30", "2000-13-01", "2000-00-10", "2000-01-00", "1899-12-31", "9999-01-01", "2005-7-27", "invalid", ""]) {
    const r = flow.validateBirthInput({ date, time: "12:00" });
    assert.equal(r.valid, false, date);
    assert(r.errors.date);
  }
});
test("time is optional but nonempty input must remain strict HH:mm", () => {
  assert.equal(flow.validateBirthInput({ ...birth, time: "" }).valid, true);
  for (const time of ["24:00", "12:60", "6:00", "06", "NaN", "12:30:00"]) {
    const r = flow.validateBirthInput({ ...birth, time });
    assert.equal(r.valid, false, time);
    assert(r.errors.time);
  }
});
test("future comparison uses WITA civil today", () => {
  assert.equal(flow.getWitaToday(new Date("2026-11-05T17:00:00Z")), "2026-11-06");
  assert.equal(flow.validateBirthInput({ date: "2026-11-07", time: "06:00" }, "2026-11-06").valid, false);
});
test("existing anchor and 05:59/06:00 boundary are unchanged", () => {
  const after = flow.buildCombinedResult(birth, snapshot()).otonan.data;
  assert.equal(after.wuku.nama_wuku, "Sinta");
  assert.match(after.saptawara.hari, /Buda/);
  assert.equal(after.pancawara.nama, "Kliwon");
  const before = flow.buildCombinedResult({ ...birth, time: "05:59" }, snapshot()).otonan.data;
  const expected = calendar.getBalineseDate(new Date(2005, 6, 26, 12), "06:00");
  assert.deepEqual(before.wewaran, expected.wewaran);
  assert.equal(before.saptawara.hari, expected.saptawara.hari);
});
test("birth adapter matches existing calendar for leap day, pre-anchor and ordinary dates", () => {
  for (const date of ["2000-02-29", "1990-01-01", "2020-12-31"]) {
    const [y, m, d] = date.split("-").map(Number);
    const expected = calendar.getBalineseDate(new Date(y, m - 1, d, 12), "04:35");
    const actual = flow.buildCombinedResult({ date, time: "04:35" }, snapshot()).otonan.data;
    for (const key of ["wuku", "pancawara", "saptawara", "wewaran", "lintang"]) assert.deepEqual(actual[key], expected[key]);
  }
});
test("metadata snapshot has no frames, coordinates, landmarks or source identity", () => {
  const s = snapshot();
  assert.equal(s.candidateStatus, "automatic_candidate");
  assert.equal(s.candidateCount, 3);
  assert.doesNotMatch(JSON.stringify(s), /original|pixels|landmarks|fingerprint|points|overlay|Uint8/);
  assert.equal(capture.original.data[0], 9);
});
test("stale worker result cannot become the current product result", () => {
  const stale = flow.createPalmProductSnapshot({ ...capture, capturedAt: 456 }, ready);
  assert.equal(stale.phase, "processing");
  assert.equal(stale.candidateCount, 0);
  assert.equal(stale.candidateStatus, "uncertain");
});
test("abstain and worker errors stay uncertain", () => {
  const abstain = flow.createPalmProductSnapshot(capture, { ...ready, result: { ...ready.result, baseline: { status: "abstain", candidateCount: 0, reason: "No evidence" } } });
  assert.equal(abstain.candidateStatus, "uncertain");
  const failure = flow.createPalmProductSnapshot(capture, { phase: "error", captureId: 123, requestId: 1, reason: "Timeout" });
  assert.equal(failure.phase, "error");
  assert.equal(failure.reason, "Timeout");
});
test("four semantic classes are unsupported; automatic candidates never become confirmed", () => {
  const r = flow.buildCombinedResult(birth, snapshot());
  assert.deepEqual(r.rekha.classes.map((c) => c.name), ["heart", "head", "life", "fate"]);
  assert(r.rekha.classes.every((c) => c.status === "unsupported" && c.origin === "unavailable" && c.methodVersion === null));
  assert.equal(r.rekha.interpretation, null);
  assert.equal(r.rekha.methodVersion, "dark-ridge-v1");
  assert.equal(r.rekha.roiMethod, "baseline");
  assert.equal(r.storage.automaticSaveEnabled, false);
});
test("manual override warning survives and is not promoted to validated output", () => {
  const manual = { ...capture, qualityMode: "manual-override", qualityWarnings: ["Sharpness 6.5 / target 7"] };
  const s = flow.createPalmProductSnapshot(manual, ready);
  manual.qualityWarnings.push("later mutation");
  assert.deepEqual(s.qualityWarnings, ["Sharpness 6.5 / target 7"]);
  assert(flow.buildCombinedResult(birth, s).rekha.classes.every((c) => c.status === "unsupported"));
});
test("public workflow validates before start, captures, retakes and resets without mutating input", () => {
  const original = structuredClone(flow.INITIAL_PRODUCT_STATE);
  assert.equal(flow.reduceProductState(original, { type: "start", birth: { date: "", time: "" } }), original);
  const started = flow.reduceProductState(original, { type: "start", birth });
  const done = flow.reduceProductState(started, { type: "capture", snapshot: snapshot() });
  assert(done.result);
  const retry = flow.reduceProductState(done, { type: "capture", snapshot: null });
  assert.equal(retry.result, null);
  assert.deepEqual(retry.birth, birth);
  assert.deepEqual(flow.reduceProductState(done, { type: "reset" }), flow.INITIAL_PRODUCT_STATE);
  assert.deepEqual(original, flow.INITIAL_PRODUCT_STATE);
});
test("editing birth invalidates prior result and a late capture after reset is ignored", () => {
  const done = flow.reduceProductState(flow.reduceProductState(flow.INITIAL_PRODUCT_STATE, { type: "start", birth }), { type: "capture", snapshot: snapshot() });
  const edited = flow.reduceProductState(done, { type: "edit", field: "time", value: "05:59" });
  assert.equal(edited.result, null);
  assert.equal(edited.birth, null);
  const reset = flow.reduceProductState(done, { type: "reset" });
  assert.equal(flow.reduceProductState(reset, { type: "capture", snapshot: snapshot() }).result, null);
});
test("birth results match across Asia/Makassar, UTC and America/Los_Angeles", () => {
  const helper = new URL("./helpers/load-netra-typescript.mjs", import.meta.url).href;
  const program = 'import {loadNetraModule} from ' + JSON.stringify(helper) + ';const m=loadNetraModule("lib/netra-hasta/product-flow.ts");console.log(JSON.stringify(["2005-07-27","2000-02-29","1990-01-01"].flatMap(date=>["05:59","06:00"].map(time=>m.buildCombinedResult({date,time},{captureId:1,width:100,height:100,qualityMode:"normal",qualityWarnings:[],phase:"ready",candidateStatus:"uncertain",candidateCount:0,reason:null}).otonan))));';
  const outputs = ["Asia/Makassar", "UTC", "America/Los_Angeles"].map((TZ) => {
    const child = spawnSync(process.execPath, ["--input-type=module", "-e", program], { cwd: root, env: { ...process.env, TZ }, encoding: "utf8" });
    assert.equal(child.status, 0, child.stderr);
    return child.stdout;
  });
  assert.equal(outputs[0], outputs[1]);
  assert.equal(outputs[0], outputs[2]);
});
test("server detail boundary requires Firebase identity verification", async () => {
  assert.equal(typeof access.getNetraAccountAccess, "function");
  const boundary = fs.readFileSync(path.join(root, "lib/netra-hasta/account-access.server.ts"), "utf8");
  assert.match(boundary, /verifyFirebaseIdentity/);
  assert.match(boundary, /cookies/);
  const source = fs.readFileSync(path.join(root, "app/netra-hasta/detail/page.tsx"), "utf8");
  assert.match(source, /await getNetraAccountAccess/);
  assert.match(source, /account.kind !== "authenticated"/);
  assert.match(source, /redirect\("\/netra-hasta\/akses-detail"\)/);
});
test("new product paths cannot invoke logging, transport or persistent storage", () => {
  const files = ["lib/netra-hasta/product-flow.ts", "components/netra-hasta/NetraHastaFlow.tsx", "components/netra-hasta/NetraHastaBasicResult.tsx", "components/netra-hasta/NetraHastaDetailView.tsx", "components/netra-hasta/NetraHastaProductProvider.tsx"];
  const code = files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n");
  assert.doesNotMatch(code, /\bfetch\s*\(|sendBeacon|XMLHttpRequest|localStorage|sessionStorage|indexedDB|from\s+["'][^"']*firebase|useSession|logActivity|saveToDatabase|user_confirmed"\s*,\s*origin/i);
  const provider = fs.readFileSync(path.join(root, files.at(-1)), "utf8");
  assert.match(provider, /pagehide/);
  assert.match(provider, /visibilitychange/);
});

test("capture normal and manual sharpness 6.5 preserve the existing quality threshold", () => {
  const quality = loadNetraModule("lib/netra-hasta/image-quality.ts");
  const evaluate = (sharpness) => quality.evaluatePalmQuality({
    handCount: 1, roiValid: true, palmLargeEnough: true,
    imageMetrics: { brightness: 140, contrast: 40, sharpness, darkPixelRatio: 0, brightPixelRatio: 0 },
    stability: { stable: true, sampleCount: 12, durationMs: 1000, centroidDeviation: 0, scaleDeviationRatio: 0 },
  });
  assert.equal(quality.DEFAULT_PALM_QUALITY_CONFIG.minimumSharpness, 7);
  assert.equal(quality.getPalmCaptureDecision({ cameraActive: true, hasConsent: true, quality: evaluate(10) }).mode, "normal");
  const manual = quality.getPalmCaptureDecision({ cameraActive: true, hasConsent: true, quality: evaluate(6.5) });
  assert.equal(manual.mode, "manual");
  assert.equal(manual.canCapture, true);
  assert.deepEqual(manual.failedSoftChecks.map((c) => c.key), ["sharpness"]);
});
test("hard capture gates cannot be bypassed by the product workflow", () => {
  const quality = loadNetraModule("lib/netra-hasta/image-quality.ts");
  const base = {
    handCount: 1, roiValid: true, palmLargeEnough: true,
    imageMetrics: { brightness: 140, contrast: 40, sharpness: 10, darkPixelRatio: 0, brightPixelRatio: 0 },
    stability: { stable: true, sampleCount: 12, durationMs: 1000, centroidDeviation: 0, scaleDeviationRatio: 0 },
  };
  for (const change of [{ handCount: 0 }, { handCount: 2 }, { roiValid: false }, { palmLargeEnough: false }, { stability: { ...base.stability, stable: false } }]) {
    const decision = quality.getPalmCaptureDecision({ cameraActive: true, hasConsent: true, quality: quality.evaluatePalmQuality({ ...base, ...change }) });
    assert.equal(decision.canCapture, false);
    assert.equal(decision.mode, "blocked");
  }
  for (const permissions of [{ cameraActive: false, hasConsent: true }, { cameraActive: true, hasConsent: false }]) {
    assert.equal(quality.getPalmCaptureDecision({ ...permissions, quality: quality.evaluatePalmQuality(base) }).canCapture, false);
  }
});

test("unknown birth time is preserved without inventing noon or a pre-sunrise adjustment", () => {
  const result = flow.buildCombinedResult({ ...birth, time: "" }, snapshot());
  const expected = calendar.getBalineseDate(new Date(2005, 6, 27, 12));
  assert.equal(result.birth.time, "");
  assert.equal(result.birth.timeBasis, "unknown-birth-time");
  assert.deepEqual(result.otonan.data.wewaran, expected.wewaran);
  const started = flow.reduceProductState(flow.INITIAL_PRODUCT_STATE, { type: "start", birth: { ...birth, time: "" } });
  assert.equal(started.birth.time, "");
  assert.equal(flow.validateBirthInput({ ...birth, time: undefined }).valid, false);
  assert.equal(flow.validateBirthInput({ ...birth, time: " " }).valid, false);
});
