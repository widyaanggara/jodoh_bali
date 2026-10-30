import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const runtimeRequire = createRequire(import.meta.url);
const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleCache = new Map();

function loadTypeScriptModule(relativePath) {
  const filename = path.resolve(projectRoot, relativePath);
  if (moduleCache.has(filename)) return moduleCache.get(filename).exports;

  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  const loadedModule = { exports: {} };
  moduleCache.set(filename, loadedModule);

  const localRequire = (specifier) => {
    if (!specifier.startsWith(".")) return runtimeRequire(specifier);
    const resolved = path.resolve(path.dirname(filename), `${specifier}.ts`);
    return loadTypeScriptModule(path.relative(projectRoot, resolved));
  };

  const execute = new Function(
    "exports",
    "require",
    "module",
    "__filename",
    "__dirname",
    output,
  );
  execute(loadedModule.exports, localRequire, loadedModule, filename, path.dirname(filename));
  return loadedModule.exports;
}

const camera = loadTypeScriptModule("lib/netra-hasta/camera.ts");
const lineRuntime = loadTypeScriptModule("lib/netra-hasta/palm-line-runtime.ts");
const lineLive = loadTypeScriptModule("lib/netra-hasta/palm-line-live.ts");

function makeSyntheticPalm(width, height, valueAt) {
  const data = new Uint8ClampedArray(width * height * 4);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const value = Math.max(0, Math.min(255, Math.round(valueAt(x, y))));
      const offset = (y * width + x) * 4;
      data.set([value, value, value, 255], offset);
    }
  }
  return { width, height, data };
}

function makeLiveResult(requestId, captureId, fill = 255) {
  return {
    requestId,
    captureId,
    baseline: {
      variant: "baseline",
      version: lineRuntime.PALM_LINE_RUNTIME_VERSION,
      status: "detected",
      candidateCount: 1,
      candidates: [{
        id: "baseline-1",
        points: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
        lengthPixels: 1,
        continuity: 1,
        averageResponse: 10,
      }],
      totalLengthPixels: 1,
      overlay: {
        width: 2,
        height: 1,
        data: new Uint8ClampedArray([fill, fill, fill, 255, fill, fill, fill, 255]),
      },
      processingMs: 12,
      reason: null,
    },
    captureToPreviewMs: 24,
  };
}

test("konfigurasi dan pesan error kamera tetap stabil", () => {
  assert.deepEqual(camera.createCameraVideoConstraints("external-camera"), {
    deviceId: { exact: "external-camera" },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  });
  assert.match(camera.getCameraErrorMessage({ name: "NotAllowedError" }), /Izin kamera ditolak/);
  assert.match(camera.getCameraErrorMessage({ name: "NotReadableError" }), /digunakan aplikasi lain/);
});

test("runtime dark-ridge-v1 mempertahankan golden output", () => {
  const image = makeSyntheticPalm(128, 128, (x, y) => {
    const lineY = 44 + x * 0.22;
    return Math.abs(y - lineY) <= 1 ? 68 : 158;
  });
  const first = lineRuntime.extractPalmLineRuntime(image);
  const second = lineRuntime.extractPalmLineRuntime(image);

  assert.equal(lineRuntime.PALM_LINE_RUNTIME_VERSION, "dark-ridge-v1");
  assert.equal(first.status, "detected");
  assert.equal(first.candidates.length, 1);
  assert.ok(Math.abs(first.candidates[0].lengthPixels - 110.73238618387278) < 1e-9);
  assert.deepEqual(first.candidates[0].points.slice(0, 3), [
    { x: 9, y: 46 },
    { x: 12, y: 46 },
    { x: 15, y: 47 },
  ]);
  assert.deepEqual(first.candidates, second.candidates);
  assert.deepEqual(first.overlay.data, second.overlay.data);
  lineRuntime.wipePalmLineRuntime(first);
  lineRuntime.wipePalmLineRuntime(second);
});

test("adapter worker tidak mengubah koordinat atau overlay baseline", () => {
  const image = makeSyntheticPalm(128, 128, (x, y) => {
    const lineY = 44 + x * 0.22;
    return Math.abs(y - lineY) <= 1 ? 68 : 158;
  });
  const extraction = lineRuntime.extractPalmLineRuntime(image);
  const candidates = structuredClone(extraction.candidates);
  const overlay = new Uint8ClampedArray(extraction.overlay.data);
  const baseline = lineLive.detachPalmLineBaselineVariant(extraction);

  assert.deepEqual(baseline.candidates, candidates);
  assert.deepEqual(baseline.overlay.data, overlay);
  assert.equal(baseline.candidateCount, candidates.length);
  assert.equal(extraction.candidates.length, 0);
  assert.equal(extraction.overlay.data.length, 0);
  lineLive.wipePalmLineWorkerResponse({ requestId: 1, captureId: 1, baseline });
});

test("stale result ditolak dan retake membersihkan buffer", () => {
  let state = lineLive.reducePalmLineLiveState(
    lineLive.INITIAL_PALM_LINE_LIVE_STATE,
    { type: "start", requestId: 1, captureId: 100 },
  );
  state = lineLive.reducePalmLineLiveState(
    state,
    { type: "start", requestId: 2, captureId: 200 },
  );
  const stale = lineLive.reducePalmLineLiveState(
    state,
    { type: "complete", result: makeLiveResult(1, 100) },
  );
  assert.deepEqual(stale, state);

  const result = makeLiveResult(2, 200, 99);
  const ready = lineLive.reducePalmLineLiveState(
    stale,
    { type: "complete", result },
  );
  assert.equal(ready.phase, "ready");
  lineLive.wipePalmLineLiveResult(result);
  assert.ok(result.baseline.overlay.data.every((value) => value === 0));
  assert.deepEqual(result.baseline.candidates, []);
  assert.equal(lineLive.reducePalmLineLiveState(ready, { type: "reset" }).phase, "idle");
});

test("jalur produksi tidak mengimpor riset atau transport biometrik", () => {
  const productionFiles = [
    "app/netra-hasta/page.tsx",
    "components/netra-hasta/NetraHastaClient.tsx",
    "components/netra-hasta/PalmPreviewPanel.tsx",
    "components/netra-hasta/PalmLineResultPanel.tsx",
    "hooks/usePalmLineExtraction.ts",
    "workers/palm-line.worker.ts",
    "lib/netra-hasta/palm-line-live.ts",
    "lib/netra-hasta/palm-line-runtime.ts",
  ];
  const source = productionFiles
    .map((filename) => fs.readFileSync(path.resolve(projectRoot, filename), "utf8"))
    .join("\n");

  assert.equal(/PalmLineLiveDiagnostic|PalmLineAnnotationEditor|PalmEvaluationClient/.test(source), false);
  assert.equal(/palm-interior-v1|evidence-bridge-v1|palm-ground-truth|palm-evaluation|palm-export|zip-archive/.test(source), false);
  assert.equal(/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|indexedDB|firebase/i.test(source), false);
  assert.match(source, /Beta\s*·\s*Dalam Pengembangan/i);
  assert.match(source, /WORKER_TIMEOUT_MS\s*=\s*15_000/);
});

test("worker browser adalah JavaScript baseline-only yang sudah dibundel", () => {
  const hook = fs.readFileSync(
    path.resolve(projectRoot, "hooks/usePalmLineExtraction.ts"),
    "utf8",
  );
  const worker = fs.readFileSync(
    path.resolve(projectRoot, "public/workers/palm-line.worker.js"),
    "utf8",
  );

  assert.match(hook, /new Worker\(["']\/workers\/palm-line\.worker\.js["']/);
  assert.doesNotMatch(hook, /palm-line\.worker\.ts|type:\s*["']module["']/);
  assert.match(worker, /dark-ridge-v1/);
  assert.doesNotMatch(worker, /palm-interior-v1|evidence-bridge-v1|palm-ground-truth/);
  assert.doesNotMatch(worker, /^\s*(?:import|export)\s/m);
});

test("bundle worker dapat dieksekusi dan mengembalikan golden baseline", () => {
  const workerSource = fs.readFileSync(
    path.resolve(projectRoot, "public/workers/palm-line.worker.js"),
    "utf8",
  );
  let response = null;
  const workerSelf = {
    onmessage: null,
    postMessage(message) {
      response = message;
    },
  };
  const context = vm.createContext({
    self: workerSelf,
    performance,
    ArrayBuffer,
    Float32Array,
    Float64Array,
    Uint8Array,
    Uint8ClampedArray,
  });
  vm.runInContext(workerSource, context);

  const image = makeSyntheticPalm(128, 128, (x, y) => {
    const lineY = 44 + x * 0.22;
    return Math.abs(y - lineY) <= 1 ? 68 : 158;
  });
  workerSelf.onmessage({
    data: {
      requestId: 7,
      captureId: 11,
      width: image.width,
      height: image.height,
      data: image.data,
    },
  });

  assert.equal(response.requestId, 7);
  assert.equal(response.captureId, 11);
  assert.equal(response.baseline.version, "dark-ridge-v1");
  assert.equal(response.baseline.candidateCount, 1);
  assert.ok(Math.abs(response.baseline.totalLengthPixels - 110.73238618387278) < 1e-9);
  assert.deepEqual(
    Array.from(response.baseline.candidates[0].points.slice(0, 3), ({ x, y }) => ({ x, y })),
    [{ x: 9, y: 46 }, { x: 12, y: 46 }, { x: 15, y: 47 }],
  );
  assert.ok(image.data.every((value) => value === 0));
});
