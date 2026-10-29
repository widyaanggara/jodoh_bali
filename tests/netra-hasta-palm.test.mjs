import assert from "node:assert/strict";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const runtimeRequire = createRequire(import.meta.url);
const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, "..");
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

  const execute = new Function("exports", "require", "module", "__filename", "__dirname", output);
  execute(
    loadedModule.exports,
    localRequire,
    loadedModule,
    filename,
    path.dirname(filename),
  );
  return loadedModule.exports;
}

const roi = loadTypeScriptModule("lib/netra-hasta/palm-roi.ts");
const preprocessing = loadTypeScriptModule("lib/netra-hasta/palm-preprocessing.ts");
const quality = loadTypeScriptModule("lib/netra-hasta/image-quality.ts");
const captureState = loadTypeScriptModule("lib/netra-hasta/palm-capture-state.ts");
const evaluation = loadTypeScriptModule("lib/netra-hasta/palm-evaluation.ts");
const lineExtraction = loadTypeScriptModule("lib/netra-hasta/palm-line-extraction.ts");
const lineLive = loadTypeScriptModule("lib/netra-hasta/palm-line-live.ts");
const groundTruth = loadTypeScriptModule("lib/netra-hasta/palm-ground-truth.ts");
const palmExport = loadTypeScriptModule("lib/netra-hasta/palm-export.ts");
const zipArchive = loadTypeScriptModule("lib/netra-hasta/zip-archive.ts");
const camera = loadTypeScriptModule("lib/netra-hasta/camera.ts");

test("constraint kamera memakai device exact saat kamera eksternal dipilih", () => {
  assert.deepEqual(camera.createCameraVideoConstraints("external-camera"), {
    deviceId: { exact: "external-camera" },
    width: { ideal: 1280 },
    height: { ideal: 720 },
  });
  assert.deepEqual(camera.createCameraVideoConstraints(), {
    facingMode: "user",
    width: { ideal: 1280 },
    height: { ideal: 720 },
  });
});

test("daftar kamera hanya memuat video unik dan memberi label fallback", () => {
  const options = camera.createCameraDeviceOptions([
    { kind: "audioinput", deviceId: "mic", label: "Mic" },
    { kind: "videoinput", deviceId: "built-in", label: "Kamera laptop" },
    { kind: "videoinput", deviceId: "external", label: "" },
    { kind: "videoinput", deviceId: "external", label: "Duplikat" },
  ]);
  assert.deepEqual(options, [
    { deviceId: "built-in", label: "Kamera laptop" },
    { deviceId: "external", label: "Kamera 2" },
  ]);
});

test("error kamera permission, missing device, dan busy mudah dipahami", () => {
  assert.match(camera.getCameraErrorMessage({ name: "NotAllowedError" }), /Izin kamera ditolak/);
  assert.match(camera.getCameraErrorMessage({ name: "NotFoundError" }), /Kamera tidak ditemukan/);
  assert.match(camera.getCameraErrorMessage({ name: "NotReadableError" }), /digunakan aplikasi lain/);
});

function makeLandmarks(transformX = (x) => x) {
  const landmarks = Array.from({ length: 21 }, () => ({ x: 0.5, y: 0.5, z: 0 }));
  const set = (index, x, y) => {
    landmarks[index] = { x: transformX(x), y, z: 0 };
  };
  set(0, 0.5, 0.76);
  set(1, 0.34, 0.62);
  set(5, 0.34, 0.47);
  set(9, 0.48, 0.42);
  set(13, 0.59, 0.44);
  set(17, 0.69, 0.49);
  return landmarks;
}

test("ROI telapak valid, tegak, dan konsisten untuk tangan kiri/kanan", () => {
  const left = roi.calculatePalmRoiGeometry(makeLandmarks(), 1000, 1000);
  const right = roi.calculatePalmRoiGeometry(makeLandmarks((x) => 1 - x), 1000, 1000);

  assert.equal(left.ok, true);
  assert.equal(right.ok, true);
  assert.ok(Math.abs(left.geometry.rotationDegrees) < 15);
  assert.ok(Math.abs(left.geometry.palmWidth - right.geometry.palmWidth) < 0.001);
  assert.ok(Math.abs(left.geometry.palmHeight - right.geometry.palmHeight) < 0.001);
  assert.ok(Math.abs(left.geometry.outputWidth - right.geometry.outputWidth) <= 1);
});

test("ROI menolak padding yang keluar dari frame", () => {
  const nearEdge = makeLandmarks((x) => x - 0.3);
  const result = roi.calculatePalmRoiGeometry(nearEdge, 1000, 1000);
  assert.equal(result.ok, false);
  assert.equal(result.category, "padding-out-of-frame");
  assert.ok(result.diagnostics.outsideCornerIndices.length > 0);
});

test("ROI kandidat mempertahankan baseline dan melabeli fallback di batas frame", () => {
  const nearEdge = makeLandmarks((x) => x - 0.32);
  const baseline = roi.calculatePalmRoiGeometry(nearEdge, 1000, 1000);
  const candidate = roi.calculateAdaptivePalmRoiGeometry(nearEdge, 1000, 1000);

  assert.equal(baseline.ok, false);
  assert.equal(candidate.ok, true);
  assert.equal(candidate.method, "fallback-axis-aligned");
  assert.ok(candidate.geometry.sourceCorners.every((corner) =>
    corner.x >= 0 && corner.x <= 1000 && corner.y >= 0 && corner.y <= 1000));
});

test("geometri kandidat konsisten untuk handedness yang dicerminkan", () => {
  const left = roi.calculateAdaptivePalmRoiGeometry(makeLandmarks(), 1000, 1000);
  const right = roi.calculateAdaptivePalmRoiGeometry(makeLandmarks((x) => 1 - x), 1000, 1000);

  assert.equal(left.ok, true);
  assert.equal(right.ok, true);
  assert.equal(left.method, right.method);
  assert.ok(Math.abs(left.geometry.outputWidth - right.geometry.outputWidth) <= 1);
  assert.ok(Math.abs(left.geometry.outputHeight - right.geometry.outputHeight) <= 1);
});

test("dimensi ROI mengikuti resolusi frame sumber tanpa downscale preview", () => {
  const fullResolution = roi.calculatePalmRoiGeometry(makeLandmarks(), 1000, 1000);
  const halfResolution = roi.calculatePalmRoiGeometry(makeLandmarks(), 500, 500);

  assert.equal(fullResolution.ok, true);
  assert.equal(halfResolution.ok, true);
  assert.ok(Math.abs(fullResolution.geometry.outputWidth / halfResolution.geometry.outputWidth - 2) < 0.02);
  assert.ok(Math.abs(fullResolution.geometry.outputHeight / halfResolution.geometry.outputHeight - 2) < 0.02);
});

test("landmark palm-core ditransformasikan ke koordinat ROI dan konsisten saat dicerminkan", () => {
  const leftRoi = roi.calculateAdaptivePalmRoiGeometry(makeLandmarks(), 1000, 1000);
  const rightRoi = roi.calculateAdaptivePalmRoiGeometry(makeLandmarks((x) => 1 - x), 1000, 1000);
  assert.equal(leftRoi.ok, true);
  assert.equal(rightRoi.ok, true);

  const left = roi.createPalmInteriorGeometry(makeLandmarks(), 1000, 1000, leftRoi.geometry);
  const right = roi.createPalmInteriorGeometry(makeLandmarks((x) => 1 - x), 1000, 1000, rightRoi.geometry);
  const sourceWrist = { x: 500, y: 760 };
  const transformedWrist = roi.transformSourcePointToPalmRoi(sourceWrist, leftRoi.geometry);

  assert.equal(left.reliable, true);
  assert.equal(right.reliable, true);
  assert.equal(left.polygon.length, 6);
  assert.ok(transformedWrist.x >= 0 && transformedWrist.x <= left.width);
  assert.ok(transformedWrist.y >= 0 && transformedWrist.y <= left.height);
  assert.ok(Math.abs(left.areaRatio - right.areaRatio) < 0.001);
});

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

test("ekstraksi garis deterministik mengikuti ridge sintetis", () => {
  const image = makeSyntheticPalm(128, 128, (x, y) => {
    const lineY = 42 + x * 0.25;
    return Math.abs(y - lineY) <= 1 ? 72 : 155;
  });
  const first = lineExtraction.extractPalmLineCandidates(image);
  const second = lineExtraction.extractPalmLineCandidates(image);

  assert.equal(first.status, "detected");
  assert.ok(first.candidates.length >= 1);
  assert.ok(first.candidates[0].lengthPixels > 50);
  assert.deepEqual(first.candidates, second.candidates);
  lineExtraction.wipePalmLineExtraction(first);
  lineExtraction.wipePalmLineExtraction(second);
});

test("pipeline ROI capture menghasilkan overlay kandidat pada koordinat citra yang sama", () => {
  const roiImage = makeSyntheticPalm(128, 128, (x, y) => {
    const lineY = 44 + x * 0.22;
    return Math.abs(y - lineY) <= 1 ? 68 : 158;
  });
  const processed = preprocessing.preprocessPalmImage(roiImage);
  const sourceBefore = new Uint8ClampedArray(processed.original.data);
  const extraction = lineExtraction.extractPalmLineCandidates(processed.original);
  const interior = lineExtraction.extractPalmInteriorLineCandidates(
    processed.original,
    makeInteriorGeometry(),
  );

  assert.equal(extraction.status, "detected");
  assert.equal(extraction.overlay.width, processed.original.width);
  assert.equal(extraction.overlay.height, processed.original.height);
  assert.equal(interior.overlay.width, extraction.overlay.width);
  assert.equal(interior.overlay.height, extraction.overlay.height);
  assert.equal(interior.analysisWidth, extraction.analysisWidth);
  assert.equal(interior.analysisHeight, extraction.analysisHeight);
  assert.deepEqual(processed.original.data, sourceBefore);
  const point = extraction.candidates[0].points[Math.min(1, extraction.candidates[0].points.length - 1)];
  const x = Math.max(0, Math.min(extraction.overlay.width - 1, Math.round(point.x)));
  const y = Math.max(0, Math.min(extraction.overlay.height - 1, Math.round(point.y)));
  const pixel = (y * extraction.overlay.width + x) * 4;
  assert.deepEqual(Array.from(extraction.overlay.data.slice(pixel, pixel + 3)), [0, 255, 255]);

  lineExtraction.wipePalmLineExtraction(extraction);
  lineExtraction.wipePalmLineExtraction(interior);
  preprocessing.wipeProcessedPalmImages(processed);
});

function makeLiveLineResult(requestId, captureId, fill = 255) {
  const makeVariant = (variant) => ({
    variant,
    version: variant === "baseline"
      ? lineExtraction.PALM_LINE_EXTRACTION_VERSION
      : lineExtraction.PALM_INTERIOR_EXPERIMENT_VERSION,
    status: "detected",
    maskStatus: variant === "baseline" ? "not-used" : "applied",
    candidateCount: 1,
    candidates: [{
      id: `${variant}-1`,
      points: [{ x: 0, y: 0 }, { x: 1, y: 0 }],
      lengthPixels: 1,
      continuity: 1,
      averageResponse: 10,
    }],
    totalLengthPixels: 1,
    outsideCandidateCount: variant === "baseline" ? 1 : 0,
    outsideLengthPixels: variant === "baseline" ? 1 : 0,
    overlay: {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray([fill, fill, fill, 255, fill, fill, fill, 255]),
    },
    ridgeResponseMap: {
      width: 2,
      height: 1,
      data: new Uint8ClampedArray(8).fill(fill),
    },
    interiorMaskMap: variant === "palm-interior"
      ? { width: 2, height: 1, data: new Uint8ClampedArray(8).fill(fill) }
      : null,
    processingMs: 12,
    reason: null,
  });
  return {
    requestId,
    captureId,
    sampleId: "live-test",
    sampleFingerprint: "a".repeat(64),
    roiSignature: "roi-live-test",
    baseline: makeVariant("baseline"),
    interior: makeVariant("palm-interior"),
    captureToPreviewMs: 24,
  };
}

test("live line reducer menolak hasil worker lama setelah capture baru", () => {
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
    { type: "complete", result: makeLiveLineResult(1, 100) },
  );
  assert.deepEqual(stale, state);

  const current = lineLive.reducePalmLineLiveState(
    stale,
    { type: "complete", result: makeLiveLineResult(2, 200) },
  );
  assert.equal(current.phase, "ready");
  assert.equal(current.result.captureId, 200);
});

test("live line reducer menolak error worker lama setelah retake", () => {
  const state = {
    phase: "processing",
    requestId: 8,
    captureId: 800,
  };
  const afterStaleFailure = lineLive.reducePalmLineLiveState(state, {
    type: "fail",
    requestId: 7,
    captureId: 700,
    reason: "worker lama gagal",
  });
  assert.deepEqual(afterStaleFailure, state);
});

test("retake mereset status dan membersihkan buffer overlay lama", () => {
  const result = makeLiveLineResult(3, 300, 99);
  const ready = lineLive.reducePalmLineLiveState(
    { phase: "processing", requestId: 3, captureId: 300 },
    { type: "complete", result },
  );
  lineLive.wipePalmLineLiveResult(result);
  const reset = lineLive.reducePalmLineLiveState(ready, { type: "reset" });

  assert.equal(reset.phase, "idle");
  assert.ok(result.baseline.overlay.data.every((value) => value === 0));
  assert.ok(result.interior.ridgeResponseMap.data.every((value) => value === 0));
  assert.deepEqual(result.baseline.candidates, []);
});

test("integrasi live tidak memiliki transport atau penyimpanan biometrik", () => {
  const sources = [
    "components/netra-hasta/NetraHastaClient.tsx",
    "components/netra-hasta/PalmCapturePanel.tsx",
    "components/netra-hasta/PalmLineLiveDiagnostic.tsx",
    "components/netra-hasta/PalmLineResultPanel.tsx",
    "hooks/useHandLandmarker.ts",
    "hooks/usePalmLineExtraction.ts",
    "workers/palm-line.worker.ts",
    "lib/netra-hasta/palm-line-live.ts",
  ].map((filename) => fs.readFileSync(path.resolve(projectRoot, filename), "utf8")).join("\n");

  assert.equal(/\bfetch\s*\(/.test(sources), false);
  assert.equal(/XMLHttpRequest|sendBeacon|localStorage|indexedDB|firebase/i.test(sources), false);
});

test("hasil kandidat pengguna jujur dan baseline tetap berjalan di production", () => {
  const clientSource = fs.readFileSync(
    path.join(projectRoot, "components/netra-hasta/NetraHastaClient.tsx"),
    "utf8",
  );
  const resultSource = fs.readFileSync(
    path.join(projectRoot, "components/netra-hasta/PalmLineResultPanel.tsx"),
    "utf8",
  );
  const workerHookSource = fs.readFileSync(
    path.join(projectRoot, "hooks/usePalmLineExtraction.ts"),
    "utf8",
  );

  assert.match(clientSource, /enabled:\s*mode\s*===\s*["']hand["']/);
  assert.match(clientSource, /showDeveloperDiagnostics\s*=\s*process\.env\.NODE_ENV\s*===\s*["']development["']/);
  assert.match(resultSource, /kandidat hasil deteksi otomatis/i);
  assert.match(resultSource, /kontur luar tangan atau bayangan/i);
  assert.match(resultSource, /belum tervalidasi/i);
  assert.match(resultSource, /memilih abstain/i);
  assert.equal(/kepribadian|karier|confidence|Rekha Hayu|Rekha Jnana|Rekha Hredaya|Rekha Bhaga/i.test(resultSource), false);
  assert.match(workerHookSource, /WORKER_TIMEOUT_MS\s*=\s*15_000/);
  assert.match(workerHookSource, /onmessageerror/);
});

test("ekstraksi garis abstain pada citra polos dan bayangan halus", () => {
  const plain = makeSyntheticPalm(96, 96, () => 128);
  const shadow = makeSyntheticPalm(96, 96, (x) => 70 + x * 1.2);
  const plainResult = lineExtraction.extractPalmLineCandidates(plain);
  const shadowResult = lineExtraction.extractPalmLineCandidates(shadow);

  assert.equal(plainResult.status, "abstain");
  assert.equal(shadowResult.status, "abstain");
  assert.equal(plainResult.candidates.length, 0);
});

test("ekstraksi garis tidak mengubah blur atau noise menjadi klaim akurasi", () => {
  const blurred = makeSyntheticPalm(128, 128, (x, y) => {
    const distance = Math.abs(y - (58 + x * 0.12));
    return 150 - Math.max(0, 28 - distance * 7);
  });
  let seed = 12345;
  const noisy = makeSyntheticPalm(128, 128, () => {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    return 128 + ((seed % 81) - 40);
  });
  const blurredResult = lineExtraction.extractPalmLineCandidates(blurred);
  const noisyResult = lineExtraction.extractPalmLineCandidates(noisy);

  assert.ok(["detected", "abstain"].includes(blurredResult.status));
  assert.equal(noisyResult.status, "abstain");
});

test("refinement hanya menjembatani fragmen searah dengan bukti respons ridge", () => {
  const image = makeSyntheticPalm(180, 100, (x, y) => {
    if (Math.abs(y - 50) > 1) return 170;
    if ((x >= 16 && x <= 72) || (x >= 82 && x <= 160)) return 75;
    if (x > 72 && x < 82) return 164;
    return 170;
  });
  const config = {
    ...lineExtraction.DEFAULT_PALM_LINE_CONFIG,
    gapClosingRadius: 0,
    minimumNeighborCount: 1,
    minimumLengthRatio: 0.03,
  };
  const baseline = lineExtraction.extractPalmLineCandidates(image, config);
  const refined = lineExtraction.extractRefinedPalmLineCandidates(image, config);

  assert.equal(baseline.variant, "baseline");
  assert.equal(refined.variant, "evidence-bridge");
  assert.ok(baseline.candidates.length >= 2);
  assert.ok(refined.acceptedBridgeCount >= 1);
  assert.ok(refined.candidates.length < baseline.candidates.length);
  lineExtraction.wipePalmLineExtraction(baseline);
  lineExtraction.wipePalmLineExtraction(refined);
});

test("refinement tidak menggambar bridge melintasi celah tanpa bukti piksel", () => {
  const image = makeSyntheticPalm(180, 100, (x, y) => {
    if (Math.abs(y - 50) > 1) return 170;
    return (x >= 16 && x <= 72) || (x >= 82 && x <= 160) ? 75 : 170;
  });
  const config = {
    ...lineExtraction.DEFAULT_PALM_LINE_CONFIG,
    gapClosingRadius: 0,
    minimumNeighborCount: 1,
    minimumLengthRatio: 0.03,
  };
  const baseline = lineExtraction.extractPalmLineCandidates(image, config);
  const refined = lineExtraction.extractRefinedPalmLineCandidates(image, config);

  assert.equal(refined.acceptedBridgeCount, 0);
  assert.deepEqual(refined.candidates, baseline.candidates);
  lineExtraction.wipePalmLineExtraction(baseline);
  lineExtraction.wipePalmLineExtraction(refined);
});

test("refinement mempertahankan abstain pada citra tanpa bukti garis", () => {
  const plain = makeSyntheticPalm(96, 96, () => 128);
  const refined = lineExtraction.extractRefinedPalmLineCandidates(plain);

  assert.equal(refined.status, "abstain");
  assert.equal(refined.candidates.length, 0);
  assert.equal(refined.acceptedBridgeCount, 0);
  lineExtraction.wipePalmLineExtraction(refined);
});

function makeInteriorGeometry(width = 128, height = 128) {
  return {
    polygon: [
      { x: 20, y: 20 },
      { x: width - 20, y: 20 },
      { x: width - 20, y: height - 20 },
      { x: 20, y: height - 20 },
    ],
    width,
    height,
    areaRatio: ((width - 40) * (height - 40)) / (width * height),
    reliable: true,
    reason: null,
  };
}

test("palm-interior mask menekan kandidat tepi tanpa mengubah baseline", () => {
  const geometry = makeInteriorGeometry();
  const image = makeSyntheticPalm(128, 128, (x, y) => {
    const edgeRidge = Math.abs(x - 10) <= 1 && y >= 12 && y <= 116;
    const interiorRidge = Math.abs(y - 64) <= 1 && x >= 28 && x <= 104;
    return edgeRidge ? 90 : interiorRidge ? 72 : 165;
  });
  const config = {
    ...lineExtraction.DEFAULT_PALM_LINE_CONFIG,
    minimumNeighborCount: 1,
    minimumLengthRatio: 0.025,
  };
  const before = lineExtraction.extractPalmLineCandidates(image, config);
  const interior = lineExtraction.extractPalmInteriorLineCandidates(image, geometry, config);
  const after = lineExtraction.extractPalmLineCandidates(image, config);
  const baselineEdge = lineExtraction.measurePalmInteriorCandidates(before.candidates, geometry);
  const interiorEdge = lineExtraction.measurePalmInteriorCandidates(interior.candidates, geometry);

  assert.deepEqual(after.candidates, before.candidates);
  assert.equal(interior.maskStatus, "applied");
  assert.ok(baselineEdge.outsideCandidateCount >= 1);
  assert.ok(interiorEdge.outsideCandidateCount < baselineEdge.outsideCandidateCount);
  assert.ok(interior.candidates.some((candidate) => candidate.points.some((point) => point.y >= 55 && point.y <= 72)));
  lineExtraction.wipePalmLineExtraction(before);
  lineExtraction.wipePalmLineExtraction(interior);
  lineExtraction.wipePalmLineExtraction(after);
});

test("soft mask mempertahankan bukti garis valid dekat batas palm-core", () => {
  const geometry = makeInteriorGeometry();
  const weights = lineExtraction.buildPalmInteriorWeights(geometry, 128, 128);
  assert.ok(weights);
  assert.equal(weights[64 * 128 + 64], 1);
  assert.ok(weights[64 * 128 + 18] > 0.5);
  assert.ok(weights[5 * 128 + 5] < 0.1);

  const nearBoundary = makeSyntheticPalm(128, 128, (x, y) =>
    Math.abs(y - 18) <= 1 && x >= 28 && x <= 104 ? 45 : 165);
  const result = lineExtraction.extractPalmInteriorLineCandidates(nearBoundary, geometry, {
    ...lineExtraction.DEFAULT_PALM_LINE_CONFIG,
    minimumNeighborCount: 1,
    minimumLengthRatio: 0.025,
  });
  assert.equal(result.status, "detected");
  assert.ok(result.candidates.length >= 1);
  lineExtraction.wipePalmLineExtraction(result);
});

test("palm-interior abstain ketika geometri mask tidak andal atau citra polos", () => {
  const plain = makeSyntheticPalm(96, 96, () => 128);
  const unreliable = { ...makeInteriorGeometry(96, 96), reliable: false, reason: "mask invalid" };
  const invalidResult = lineExtraction.extractPalmInteriorLineCandidates(plain, unreliable);
  const flatResult = lineExtraction.extractPalmInteriorLineCandidates(plain, makeInteriorGeometry(96, 96));

  assert.equal(invalidResult.status, "abstain");
  assert.equal(invalidResult.maskStatus, "unreliable");
  assert.equal(invalidResult.abstainReason, "mask invalid");
  assert.equal(flatResult.status, "abstain");
  assert.equal(flatResult.candidates.length, 0);
  lineExtraction.wipePalmLineExtraction(invalidResult);
  lineExtraction.wipePalmLineExtraction(flatResult);
});

test("diagnostik error memisahkan kandidat dekat, anotasi tak tercakup, dan distribusi jarak", () => {
  const source = makeSyntheticPalm(120, 80, () => 128);
  const candidates = [{ id: "candidate", points: [{ x: 10, y: 20 }, { x: 110, y: 20 }], lengthPixels: 100, continuity: 1, averageResponse: 10 }];
  const annotations = [{ id: "manual", points: [{ x: 10, y: 25 }, { x: 110, y: 25 }] }];
  const diagnostics = lineExtraction.createPalmLineErrorDiagnostics(source, candidates, annotations, 6);

  assert.ok(Math.abs(diagnostics.candidateToManual.meanPixels - 5) < 0.01);
  assert.ok(Math.abs(diagnostics.manualToCandidate.medianPixels - 5) < 0.01);
  assert.ok(diagnostics.candidateNearLength > 99);
  assert.ok(diagnostics.manualCoveredLength > 99);
  assert.equal(diagnostics.candidateOutsideAnnotationLength, 0);
  assert.equal(diagnostics.candidateToManual.bins.find((bin) => bin.label === "3–6 px").ratio, 1);
  diagnostics.overlay.data.fill(0);
});

test("kesesuaian geometris memakai toleransi piksel simetris", () => {
  const candidate = [{
    id: "candidate-1",
    points: [{ x: 10, y: 20 }, { x: 90, y: 20 }],
    lengthPixels: 80,
    continuity: 1,
    averageResponse: 20,
  }];
  const exact = [{ id: "manual-1", points: [{ x: 10, y: 20 }, { x: 90, y: 20 }] }];
  const distant = [{ id: "manual-2", points: [{ x: 10, y: 40 }, { x: 90, y: 40 }] }];

  assert.equal(lineExtraction.evaluatePalmLineAgreement(candidate, exact, 6).harmonicScore, 1);
  assert.equal(lineExtraction.evaluatePalmLineAgreement(candidate, distant, 6).harmonicScore, 0);
});

test("grayscale deterministik dan tidak mengubah buffer sumber", () => {
  const source = {
    width: 2,
    height: 1,
    data: new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 128]),
  };
  const result = preprocessing.preprocessPalmImage(source);

  assert.deepEqual(Array.from(result.grayscale.data), [76, 76, 76, 255, 150, 150, 150, 128]);
  assert.deepEqual(Array.from(source.data), [255, 0, 0, 255, 0, 255, 0, 128]);
  assert.notEqual(result.original.data, source.data);
  assert.equal(result.enhanced.width, source.width);
  assert.equal(result.enhanced.height, source.height);
});

test("stabilitas memakai jendela waktu, deviasi centroid, dan perubahan skala", () => {
  const stableSamples = Array.from({ length: 7 }, (_, index) => ({
    timestamp: index * 100,
    centroidX: 0.5 + (index % 2) * 0.002,
    centroidY: 0.5,
    scale: 0.7 + (index % 2) * 0.01,
  }));
  const movingSamples = stableSamples.map((sample, index) => ({
    ...sample,
    centroidX: 0.45 + index * 0.025,
  }));

  assert.equal(quality.calculatePalmStability(stableSamples, 600).stable, true);
  assert.equal(quality.calculatePalmStability(movingSamples, 600).stable, false);
});

test("metrik citra membedakan bidang rata dari pola berkontras", () => {
  const uniform = new Uint8ClampedArray(8 * 8 * 4);
  const checker = new Uint8ClampedArray(8 * 8 * 4);
  for (let pixel = 0; pixel < 64; pixel += 1) {
    const index = pixel * 4;
    uniform.set([120, 120, 120, 255], index);
    const value = (Math.floor(pixel / 8) + (pixel % 8)) % 2 ? 230 : 25;
    checker.set([value, value, value, 255], index);
  }

  const uniformMetrics = quality.analyzePalmImageQuality({ width: 8, height: 8, data: uniform });
  const checkerMetrics = quality.analyzePalmImageQuality({ width: 8, height: 8, data: checker });
  assert.equal(uniformMetrics.contrast, 0);
  assert.equal(uniformMetrics.sharpness, 0);
  assert.ok(checkerMetrics.contrast > 90);
  assert.ok(checkerMetrics.sharpness > 100);
});

function makeQualityInput(overrides = {}) {
  return {
    handCount: 1,
    roiValid: true,
    palmLargeEnough: true,
    imageMetrics: {
      brightness: 120,
      contrast: 30,
      sharpness: 8,
      darkPixelRatio: 0,
      brightPixelRatio: 0,
    },
    stability: {
      stable: true,
      sampleCount: 7,
      durationMs: 600,
      centroidDeviation: 0.005,
      scaleDeviationRatio: 0.02,
    },
    ...overrides,
  };
}

test("capture normal aktif ketika hard gate dan soft gate lulus", () => {
  const report = quality.evaluatePalmQuality(makeQualityInput());
  const decision = quality.getPalmCaptureDecision({
    cameraActive: true,
    hasConsent: true,
    quality: report,
  });

  assert.equal(report.isReady, true);
  assert.equal(report.hardGatePassed, true);
  assert.equal(report.softGatePassed, true);
  assert.equal(decision.mode, "normal");
  assert.equal(decision.canCapture, true);
});

test("sharpness 6.5 mengaktifkan manual override tanpa menurunkan target 7", () => {
  const report = quality.evaluatePalmQuality(
    makeQualityInput({
      imageMetrics: {
        brightness: 120,
        contrast: 30,
        sharpness: 6.5,
        darkPixelRatio: 0,
        brightPixelRatio: 0,
      },
    }),
  );
  const decision = quality.getPalmCaptureDecision({
    cameraActive: true,
    hasConsent: true,
    quality: report,
  });

  assert.equal(report.isReady, false);
  assert.equal(report.hardGatePassed, true);
  assert.equal(report.manualCaptureAllowed, true);
  assert.equal(report.checks.find((check) => check.key === "sharpness").target, "min. 7.0");
  assert.equal(decision.mode, "manual");
  assert.equal(decision.canCapture, true);
  assert.deepEqual(decision.failedSoftChecks.map((check) => check.key), ["sharpness"]);
});

test("manual override tetap terkunci ketika hard gate stabilitas gagal", () => {
  const report = quality.evaluatePalmQuality(
    makeQualityInput({
      stability: {
        stable: false,
        sampleCount: 4,
        durationMs: 300,
        centroidDeviation: 0.04,
        scaleDeviationRatio: 0.12,
      },
    }),
  );
  const decision = quality.getPalmCaptureDecision({
    cameraActive: true,
    hasConsent: true,
    quality: report,
  });

  assert.equal(report.status, "unstable");
  assert.equal(report.hardGatePassed, false);
  assert.equal(report.manualCaptureAllowed, false);
  assert.equal(decision.mode, "blocked");
  assert.equal(decision.canCapture, false);
  assert.deepEqual(decision.failedHardChecks.map((check) => check.key), ["stability"]);
});

test("snapshot kualitas capture tidak ikut berubah ketika metrik live di-reset", () => {
  const liveReport = quality.evaluatePalmQuality(
    makeQualityInput({
      imageMetrics: {
        brightness: 118,
        contrast: 27,
        sharpness: 6.5,
        darkPixelRatio: 0.01,
        brightPixelRatio: 0.02,
      },
    }),
  );
  const capture = {
    capturedAt: 123456,
    handedness: "Right",
    rotationDegrees: 2.5,
    qualityMode: "manual-override",
    qualityWarnings: ["Ketajaman: 6.5 (target min. 7.0)"],
    palmInteriorGeometry: makeInteriorGeometry(2, 1),
    original: { width: 2, height: 1, data: new Uint8ClampedArray(8).fill(10) },
    grayscale: { width: 2, height: 1, data: new Uint8ClampedArray(8).fill(20) },
    enhanced: { width: 2, height: 1, data: new Uint8ClampedArray(8).fill(30) },
  };
  const artifacts = captureState.createPalmCaptureArtifacts(capture, liveReport);

  liveReport.imageMetrics.sharpness = 0;
  liveReport.checks.find((check) => check.key === "sharpness").value = "0.0";
  const resetLiveReport = quality.createInitialPalmQualityReport();

  assert.equal(resetLiveReport.imageMetrics, null);
  assert.equal(artifacts.capturedQualityMetrics.capturedAt, 123456);
  assert.equal(artifacts.capturedQualityMetrics.imageMetrics.sharpness, 6.5);
  assert.equal(
    artifacts.capturedQualityMetrics.checks.find((check) => check.key === "sharpness").value,
    "6.5",
  );
});

test("cleanup menghapus buffer citra dan snapshot metrik capture", () => {
  const report = quality.evaluatePalmQuality(makeQualityInput());
  const capture = {
    capturedAt: 654321,
    handedness: "Left",
    rotationDegrees: 0,
    qualityMode: "normal",
    qualityWarnings: [],
    palmInteriorGeometry: makeInteriorGeometry(1, 1),
    original: { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 255]) },
    grayscale: { width: 1, height: 1, data: new Uint8ClampedArray([4, 4, 4, 255]) },
    enhanced: { width: 1, height: 1, data: new Uint8ClampedArray([5, 5, 5, 255]) },
  };
  const artifacts = captureState.createPalmCaptureArtifacts(capture, report);
  const cleared = captureState.clearPalmCaptureArtifacts(artifacts);

  assert.deepEqual(Array.from(capture.original.data), [0, 0, 0, 0]);
  assert.deepEqual(Array.from(capture.grayscale.data), [0, 0, 0, 0]);
  assert.deepEqual(Array.from(capture.enhanced.data), [0, 0, 0, 0]);
  assert.deepEqual(capture.palmInteriorGeometry.polygon, []);
  assert.equal(cleared.capture, null);
  assert.equal(cleared.capturedQualityMetrics, null);
});

test("evaluasi foto statis tidak membutuhkan metrik stabilitas VIDEO", () => {
  const staticResult = quality.evaluateStaticPalmQuality({
    handCount: 1,
    roiValid: true,
    palmLargeEnough: true,
    imageMetrics: {
      brightness: 120,
      contrast: 30,
      sharpness: 8,
      darkPixelRatio: 0,
      brightPixelRatio: 0,
    },
  });

  assert.equal(staticResult.status, "valid");
  assert.deepEqual(staticResult.reasons, []);
  assert.equal("stability" in staticResult, false);
});

test("metadata folder dianonimkan dan batch diseimbangkan antar-subjek", () => {
  const files = [
    ...Array.from({ length: 6 }, (_, index) => ({
      name: `left_hand_front_cam_${index}.jpg`,
      webkitRelativePath: `palm-hand/user_1/left_hand_front_cam/image_${index}.jpg`,
    })),
    ...Array.from({ length: 2 }, (_, index) => ({
      name: `right_hand_back_cam_${index}.jpg`,
      webkitRelativePath: `palm-hand/user_2/right_hand_back_cam/image_${index}.jpg`,
    })),
    ...Array.from({ length: 2 }, (_, index) => ({
      name: `left_hand_back_cam_${index}.jpg`,
      webkitRelativePath: `palm-hand/user_3/left_hand_back_cam/image_${index}.jpg`,
    })),
  ];
  const selected = evaluation.selectBalancedEvaluationFiles(files, 6);
  const groups = selected.map((file) => evaluation.parseEvaluationMetadata(file).subjectGroup);
  const metadata = evaluation.parseEvaluationMetadata(files[0]);

  assert.equal(selected.length, 6);
  assert.equal(new Set(groups.slice(0, 3)).size, 3);
  assert.match(metadata.subjectGroup, /^G-[A-Z0-9]{6}$/);
  assert.equal(metadata.subjectGroup.includes("user_1"), false);
  assert.equal(metadata.handGroup, "left");
  assert.equal(metadata.cameraGroup, "front");

  const stratifiedFiles = Array.from({ length: 8 }, (_, subjectIndex) =>
    [
      "left_hand_front_cam",
      "left_hand_back_cam",
      "right_hand_front_cam",
      "right_hand_back_cam",
    ].map((folder) => ({
      name: `${folder}.jpg`,
      webkitRelativePath: `palm-hand/user_${subjectIndex + 1}/${folder}/${folder}.jpg`,
    })),
  ).flat();
  const stratified = evaluation.selectBalancedEvaluationFiles(stratifiedFiles, 8);
  const strata = stratified.map((file) => {
    const item = evaluation.parseEvaluationMetadata(file);
    return `${item.handGroup}-${item.cameraGroup}`;
  });
  const subjectGroups = new Set(
    stratified.map((file) => evaluation.parseEvaluationMetadata(file).subjectGroup),
  );

  assert.equal(subjectGroups.size, 8);
  assert.equal(strata.filter((value) => value === "left-front").length, 2);
  assert.equal(strata.filter((value) => value === "left-back").length, 2);
  assert.equal(strata.filter((value) => value === "right-front").length, 2);
  assert.equal(strata.filter((value) => value === "right-back").length, 2);
});

function makeEvaluationResult(overrides = {}) {
  return {
    sampleId: "sample-001",
    sampleFingerprint: "a".repeat(64),
    roiSignature: "roi-abc123",
    roiAlgorithmVersion: roi.PALM_ROI_ALGORITHM_VERSION,
    sampleName: "private-person-name.jpg",
    sourceWidth: 640,
    sourceHeight: 480,
    detectionStatus: "single",
    landmarkCount: 21,
    detectedHandedness: "Left",
    roiStatus: "success",
    roiMethod: "adaptive-rotated",
    roiFailureCategory: null,
    roiFailureReason: null,
    roiWidth: 241,
    roiHeight: 338,
    images: null,
    diagnosticImage: null,
    diagnostics: null,
    palmInteriorGeometry: null,
    imageMetrics: {
      brightness: 120,
      contrast: 30,
      sharpness: 8,
      darkPixelRatio: 0,
      brightPixelRatio: 0,
    },
    metricSource: "roi",
    quality: {
      status: "valid",
      reasons: [],
      brightnessPassed: true,
      contrastPassed: true,
      sharpnessPassed: true,
    },
    processingMs: 12.5,
    roiProcessingMs: 1.5,
    baseline: {
      roiStatus: "success",
      failureCategory: null,
      failureReason: null,
      roiWidth: 260,
      roiHeight: 350,
      imageMetrics: {
        brightness: 118,
        contrast: 28,
        sharpness: 7,
        darkPixelRatio: 0,
        brightPixelRatio: 0,
      },
      roiProcessingMs: 0.5,
      diagnostics: null,
    },
    metadata: { subjectGroup: "G-ABC123", handGroup: "left", cameraGroup: "front" },
    manualRoi: "correct",
    manualLines: "clear",
    lineExperiment: {
      variant: "baseline",
      refinementVersion: null,
      acceptedBridgeCount: 0,
      maskStatus: "not-used",
      maskReason: null,
      status: "detected",
      abstainReason: null,
      candidateCount: 3,
      totalLengthPixels: 240,
      averageContinuity: 0.8,
      processingMs: 8,
      parameters: { ...lineExtraction.DEFAULT_PALM_LINE_CONFIG },
    },
    lineRefinementExperiment: {
      variant: "evidence-bridge",
      refinementVersion: lineExtraction.PALM_LINE_REFINEMENT_VERSION,
      acceptedBridgeCount: 1,
      maskStatus: "not-used",
      maskReason: null,
      status: "detected",
      abstainReason: null,
      candidateCount: 2,
      totalLengthPixels: 245,
      averageContinuity: 0.82,
      processingMs: 9,
      parameters: { ...lineExtraction.DEFAULT_PALM_LINE_CONFIG },
    },
    lineInteriorExperiment: {
      variant: "palm-interior",
      refinementVersion: lineExtraction.PALM_INTERIOR_EXPERIMENT_VERSION,
      acceptedBridgeCount: 0,
      maskStatus: "applied",
      maskReason: null,
      status: "detected",
      abstainReason: null,
      candidateCount: 2,
      totalLengthPixels: 180,
      averageContinuity: 0.84,
      processingMs: 10,
      parameters: { ...lineExtraction.DEFAULT_PALM_LINE_CONFIG },
    },
    lineInteriorMetrics: {
      baselineOutsideCandidates: 2,
      baselineOutsideLengthPixels: 80,
      refinementOutsideCandidates: 1,
      refinementOutsideLengthPixels: 50,
      interiorOutsideCandidates: 0,
      interiorOutsideLengthPixels: 0,
    },
    lineCandidateAssessment: "follows",
    ...overrides,
  };
}

test("statistik evaluator memisahkan deteksi, ROI, kualitas, review, dan sumber sharpness", () => {
  const results = [
    makeEvaluationResult(),
    makeEvaluationResult({
      sampleId: "sample-002",
      roiStatus: "failed",
      roiMethod: null,
      roiFailureCategory: "core-out-of-frame",
      metricSource: "source",
      imageMetrics: {
        brightness: 120,
        contrast: 30,
        sharpness: 14,
        darkPixelRatio: 0,
        brightPixelRatio: 0,
      },
      quality: {
        status: "failed",
        reasons: ["ROI gagal"],
        brightnessPassed: true,
        contrastPassed: true,
        sharpnessPassed: true,
      },
      manualRoi: "unreviewed",
      manualLines: "unreviewed",
      baseline: {
        roiStatus: "failed",
        failureCategory: "padding-out-of-frame",
        failureReason: "Padding keluar",
        roiWidth: null,
        roiHeight: null,
        imageMetrics: null,
        roiProcessingMs: 0.6,
        diagnostics: null,
      },
    }),
    makeEvaluationResult({
      sampleId: "sample-003",
      detectionStatus: "single",
      landmarkCount: 20,
      manualRoi: "imprecise",
      manualLines: "unclear",
      roiMethod: "fallback-axis-aligned",
      quality: {
        status: "warning",
        reasons: ["Sharpness rendah"],
        brightnessPassed: true,
        contrastPassed: true,
        sharpnessPassed: false,
      },
    }),
  ];

  const summary = evaluation.summarizePalmEvaluations(results);
  assert.equal(summary.detectionSuccess, 2);
  assert.equal(summary.roiSuccess, 2);
  assert.equal(summary.baselineRoiSuccess, 2);
  assert.equal(summary.qualityValid, 1);
  assert.equal(summary.manualRoiReviewed, 2);
  assert.equal(summary.manualRoiCorrect, 1);
  assert.equal(summary.manualRoiImprecise, 1);
  assert.equal(summary.manualLinesReviewed, 2);
  assert.equal(summary.averageRoiSharpness, 8);
  assert.equal(summary.averageBaselineRoiSharpness, 7);
  assert.equal(summary.averageSourceSharpness, 14);
});

test("CSV hanya memuat hasil numerik dan kelompok anonim", () => {
  const csv = evaluation.createPalmEvaluationCsv([makeEvaluationResult()]);

  assert.match(csv, /sample-001/);
  assert.match(csv, /G-ABC123/);
  assert.equal(csv.includes("private-person-name"), false);
  assert.equal(csv.includes("landmark_x"), false);
  assert.equal(csv.includes("image_data"), false);
});

test("fingerprint konten menjaga identitas sampel saat urutan batch berubah", async () => {
  const firstFingerprint = await groundTruth.createContentFingerprint(
    new TextEncoder().encode("same-palm-image").buffer,
  );
  const secondFingerprint = await groundTruth.createContentFingerprint(
    new TextEncoder().encode("same-palm-image").buffer,
  );
  const differentFingerprint = await groundTruth.createContentFingerprint(
    new TextEncoder().encode("different-palm-image").buffer,
  );

  assert.equal(firstFingerprint, secondFingerprint);
  assert.notEqual(firstFingerprint, differentFingerprint);
  assert.equal(
    evaluation.createEvaluationSampleId(0, firstFingerprint),
    evaluation.createEvaluationSampleId(29, secondFingerprint),
  );
});

function makeGroundTruthAnnotation(overrides = {}) {
  return {
    sourceVersion: 2,
    sampleId: "palm-aabbcc",
    sampleFingerprint: "a".repeat(64),
    roiSignature: "roi-abc123",
    roiWidth: 200,
    roiHeight: 120,
    roiAlgorithmVersion: roi.PALM_ROI_ALGORITHM_VERSION,
    lineExtractionVersion: lineExtraction.PALM_LINE_EXTRACTION_VERSION,
    lineParameterVersion: lineExtraction.PALM_LINE_PARAMETER_VERSION,
    status: "annotated",
    completeness: "complete",
    compatibility: "exact",
    compatibilityReason: "cocok",
    polylines: [{ id: "manual-1", points: [{ x: 10, y: 50 }, { x: 110, y: 50 }] }],
    ...overrides,
  };
}

const frozenVersions = {
  roiAlgorithmVersion: roi.PALM_ROI_ALGORITHM_VERSION,
  lineExtractionVersion: lineExtraction.PALM_LINE_EXTRACTION_VERSION,
  lineParameterVersion: lineExtraction.PALM_LINE_PARAMETER_VERSION,
};

test("import anotasi v1 tidak dipetakan diam-diam berdasarkan sample_id", () => {
  const parsed = groundTruth.parsePalmAnnotationDocument({
    format: "metemu-palm-lines",
    version: 1,
    samples: [{
      sample_id: "sample-001",
      roi_width: 200,
      roi_height: 120,
      status: "annotated",
      polylines: [{ id: "old", points: [{ x: 1, y: 1 }, { x: 10, y: 10 }] }],
    }],
  });

  assert.equal(parsed.samples[0].sampleFingerprint, null);
  assert.equal(parsed.samples[0].compatibility, "legacy-needs-mapping");
  assert.equal(parsed.samples[0].completeness, "unknown");
});

test("compatibility menolak ROI atau versi baseline yang berbeda", () => {
  const annotation = makeGroundTruthAnnotation();
  const target = {
    sampleId: "palm-aabbcc",
    sampleFingerprint: "a".repeat(64),
    roiSignature: "roi-different",
    roiWidth: 200,
    roiHeight: 120,
  };
  const roiMismatch = groundTruth.resolveAnnotationCompatibility(annotation, target, frozenVersions);
  const versionMismatch = groundTruth.resolveAnnotationCompatibility(
    annotation,
    { ...target, roiSignature: "roi-abc123" },
    { ...frozenVersions, lineParameterVersion: "future-baseline" },
  );
  const fingerprintMismatch = groundTruth.resolveAnnotationCompatibility(
    annotation,
    { ...target, sampleFingerprint: "b".repeat(64), roiSignature: "roi-abc123" },
    frozenVersions,
  );

  assert.equal(roiMismatch.compatibility, "roi-mismatch");
  assert.equal(versionMismatch.compatibility, "version-mismatch");
  assert.equal(fingerprintMismatch.compatibility, "unmatched");
});

test("ground truth kosong dan abstain tidak menghasilkan skor palsu", () => {
  const empty = groundTruth.evaluatePalmGroundTruth({
    annotation: makeGroundTruthAnnotation({ polylines: [] }),
    candidates: [],
    extractionStatus: "detected",
    abstainReason: null,
    ...frozenVersions,
  });
  const abstain = groundTruth.evaluatePalmGroundTruth({
    annotation: makeGroundTruthAnnotation(),
    candidates: [],
    extractionStatus: "abstain",
    abstainReason: "Citra terlalu polos.",
    ...frozenVersions,
  });

  assert.equal(empty.scoringStatus, "unavailable");
  assert.deepEqual(empty.scores, []);
  assert.equal(abstain.scoringStatus, "abstain");
  assert.deepEqual(abstain.scores, []);
});

test("evaluasi length-weighted menangani fragmen dan menghukum false positive", () => {
  const annotation = makeGroundTruthAnnotation({ completeness: "partial" });
  const fragmented = [
    { id: "a", points: [{ x: 10, y: 50 }, { x: 45, y: 50 }], lengthPixels: 35, continuity: 1, averageResponse: 10 },
    { id: "b", points: [{ x: 55, y: 50 }, { x: 110, y: 50 }], lengthPixels: 55, continuity: 1, averageResponse: 10 },
  ];
  const withFalsePositive = [
    ...fragmented,
    { id: "false", points: [{ x: 10, y: 90 }, { x: 190, y: 90 }], lengthPixels: 180, continuity: 1, averageResponse: 10 },
  ];
  const fragmentReport = groundTruth.evaluatePalmGroundTruth({
    annotation,
    candidates: fragmented,
    extractionStatus: "detected",
    abstainReason: null,
    ...frozenVersions,
  });
  const falsePositiveReport = groundTruth.evaluatePalmGroundTruth({
    annotation,
    candidates: withFalsePositive,
    extractionStatus: "detected",
    abstainReason: null,
    ...frozenVersions,
  });
  const fragmentAt3 = fragmentReport.scores.find((score) => score.tolerancePixels === 3);
  const falseAt3 = falsePositiveReport.scores.find((score) => score.tolerancePixels === 3);

  assert.equal(fragmentReport.reviewStatus, "provisional");
  assert.ok(fragmentAt3.coverage > 0.8 && fragmentAt3.coverage < 1);
  assert.equal(fragmentAt3.precision, 1);
  assert.ok(falseAt3.precision < fragmentAt3.precision);
  assert.ok(falseAt3.f1 < fragmentAt3.f1);
});

test("length-weighted score tidak berubah karena kerapatan vertex polyline", () => {
  const sparse = [{ id: "sparse", points: [{ x: 0, y: 10 }, { x: 100, y: 10 }], lengthPixels: 100, continuity: 1, averageResponse: 1 }];
  const denseManual = [{ id: "dense", points: Array.from({ length: 101 }, (_, x) => ({ x, y: 10 })) }];
  const score = lineExtraction.evaluatePalmLineAgreement(sparse, denseManual, 3);

  assert.equal(score.manualCoverage, 1);
  assert.equal(score.candidatePrecision, 1);
  assert.equal(score.harmonicScore, 1);
});

test("CSV ground truth memuat status dan sensitivitas tanpa koordinat", () => {
  const report = groundTruth.evaluatePalmGroundTruth({
    annotation: makeGroundTruthAnnotation(),
    candidates: [{ id: "candidate", points: [{ x: 10, y: 50 }, { x: 110, y: 50 }], lengthPixels: 100, continuity: 1, averageResponse: 1 }],
    extractionStatus: "detected",
    abstainReason: null,
    ...frozenVersions,
  });
  const csv = evaluation.createPalmEvaluationCsv(
    [makeEvaluationResult()],
    { ["a".repeat(64)]: report },
    { ["a".repeat(64)]: { ...report, lineExtractionVersion: `${lineExtraction.PALM_LINE_EXTRACTION_VERSION}+${lineExtraction.PALM_LINE_REFINEMENT_VERSION}` } },
  );

  assert.match(csv, /annotation_compatibility/);
  assert.match(csv, /coverage_t3/);
  assert.match(csv, /experiment_coverage_t3/);
  assert.match(csv, /evidence-bridge-v1/);
  assert.match(csv, /baseline-2026-10-27/);
  assert.equal(csv.includes("polylines"), false);
  assert.equal(csv.includes("points"), false);
});

function makePalmExportPair(overrides = {}) {
  const shaA = "a".repeat(64);
  const shaB = "b".repeat(64);
  const manifest = {
    sample_id: "palm-export-001",
    source_fingerprint: shaA,
    roi_path: "palm-export-001-roi.png",
    roi_sha256: shaB,
    roi_pixel_sha256: "c".repeat(64),
    roi_signature: "roi-signature-exact",
    roi_width: 200,
    roi_height: 120,
    roi_algorithm_version: roi.PALM_ROI_ALGORITHM_VERSION,
    roi_method: "adaptive-oriented",
    rotation_degrees: 2.5,
    padding_scale: 1,
    subject_group: "subject-anon-1",
    hand_group: "right",
    camera_group: "front",
    split: "development",
    quality_status: "warning",
    javascript_baseline: {
      algorithm_version: lineExtraction.PALM_LINE_EXTRACTION_VERSION,
      parameter_version: lineExtraction.PALM_LINE_PARAMETER_VERSION,
      status: "detected",
      abstain_reason: null,
      candidate_count: 1,
      total_length_pixels: 80,
      near_outer_contour_count: 0,
      processing_time_ms: 2,
      candidates: [{ id: "candidate-1", length_pixels: 80, points: [{ x: 10, y: 30 }, { x: 90, y: 30 }] }],
    },
    ...overrides,
  };
  const annotation = {
    sample_id: manifest.sample_id,
    sample_fingerprint: manifest.source_fingerprint,
    roi_signature: manifest.roi_signature,
    roi_width: manifest.roi_width,
    roi_height: manifest.roi_height,
    roi_algorithm_version: manifest.roi_algorithm_version,
    annotation_status: "annotated",
    completeness: "partial",
    polylines: [{ id: "manual-1", points: [{ x: 10, y: 30 }, { x: 90, y: 30 }] }],
  };
  return { manifest, annotation, shaB };
}

test("split pilot stabil pada tingkat subjek", () => {
  const first = palmExport.assignPalmPilotSplit("subject-anon-1");
  assert.equal(palmExport.assignPalmPilotSplit("subject-anon-1"), first);
  assert.ok(["development", "holdout"].includes(first));
});

test("validasi ekspor menerima identitas file, piksel, ROI, dan anotasi yang tepat", () => {
  const { manifest, annotation, shaB } = makePalmExportPair();
  const validation = palmExport.validatePalmExportPair({
    manifest,
    annotation,
    actualRoiSha256: shaB,
    actualPixelSha256: "c".repeat(64),
    actualWidth: 200,
    actualHeight: 120,
  });

  assert.deepEqual(validation, { status: "valid", reasons: [] });
});

test("manifest ekspor mengikat file anotasi dan ROI secara eksplisit", () => {
  const { manifest } = makePalmExportPair();
  const document = palmExport.createPalmBenchmarkManifest({
    annotationsFile: "palm-export-001-annotations.json",
    sample: manifest,
  });

  assert.equal(document.format, "metemu-palm-benchmark");
  assert.equal(document.version, 1);
  assert.equal(document.annotations, "palm-export-001-annotations.json");
  assert.equal(document.samples[0].roi_path, "palm-export-001-roi.png");
  assert.equal(document.samples[0].roi_sha256, "b".repeat(64));
});

test("paket benchmark ZIP berisi tepat PNG, anotasi, dan manifest yang saling merujuk", () => {
  const { manifest } = makePalmExportPair();
  const document = palmExport.createPalmBenchmarkManifest({
    annotationsFile: "palm-export-001-annotations.json",
    sample: manifest,
  });
  const pngBytes = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10, 1, 2, 3]);
  const annotationBytes = new TextEncoder().encode(JSON.stringify({
    format: "metemu-palm-lines",
    version: 2,
    samples: [],
  }));
  const archive = palmExport.createPalmBenchmarkArchive({
    roiFilename: "palm-export-001-roi.png",
    roiBytes: pngBytes,
    annotationFilename: "palm-export-001-annotations.json",
    annotationBytes,
    manifestFilename: "palm-export-001-benchmark.json",
    manifest: document,
  });
  const entries = zipArchive.readStoredZipEntries(archive);

  assert.deepEqual([...entries.keys()].sort(), [
    "palm-export-001-annotations.json",
    "palm-export-001-benchmark.json",
    "palm-export-001-roi.png",
  ]);
  assert.deepEqual(entries.get("palm-export-001-roi.png"), pngBytes);
  const packagedManifest = JSON.parse(new TextDecoder().decode(entries.get("palm-export-001-benchmark.json")));
  assert.equal(packagedManifest.annotations, "palm-export-001-annotations.json");
  assert.equal(packagedManifest.samples[0].roi_path, "palm-export-001-roi.png");
});

test("paket benchmark membatalkan ekspor saat referensi manifest tidak cocok", () => {
  const { manifest } = makePalmExportPair({ roi_path: "missing-roi.png" });
  const document = palmExport.createPalmBenchmarkManifest({
    annotationsFile: "annotations.json",
    sample: manifest,
  });

  assert.throws(() => palmExport.createPalmBenchmarkArchive({
    roiFilename: "actual-roi.png",
    roiBytes: new Uint8Array([1]),
    annotationFilename: "annotations.json",
    annotationBytes: new Uint8Array([2]),
    manifestFilename: "benchmark.json",
    manifest: document,
  }), /Referensi file/);
});

test("validasi ekspor menolak hash, signature, dimensi, dan koordinat yang berubah", () => {
  const { manifest, annotation } = makePalmExportPair();
  annotation.roi_signature = "different";
  annotation.roi_width = 199;
  annotation.polylines[0].points[1].x = 999;
  const validation = palmExport.validatePalmExportPair({
    manifest,
    annotation,
    actualRoiSha256: "d".repeat(64),
    actualPixelSha256: "e".repeat(64),
    actualWidth: 199,
    actualHeight: 120,
  });

  assert.equal(validation.status, "invalid");
  assert.match(validation.reasons.join(" "), /file ROI/);
  assert.match(validation.reasons.join(" "), /piksel ROI/);
  assert.match(validation.reasons.join(" "), /ROI signature/);
  assert.match(validation.reasons.join(" "), /Dimensi/);
});

test("validasi ekspor menolak polyline di luar koordinat ROI", () => {
  const { manifest, annotation, shaB } = makePalmExportPair();
  annotation.polylines[0].points[1].y = 120;
  const validation = palmExport.validatePalmExportPair({
    manifest,
    annotation,
    actualRoiSha256: shaB,
    actualPixelSha256: "c".repeat(64),
    actualWidth: 200,
    actualHeight: 120,
  });

  assert.equal(validation.status, "invalid");
  assert.match(validation.reasons.join(" "), /di luar ROI/);
});

test("status undetermined dipertahankan dan tidak dianggap anotasi valid", () => {
  const { manifest, annotation, shaB } = makePalmExportPair();
  annotation.annotation_status = "undetermined";
  annotation.polylines = [];
  const validation = palmExport.validatePalmExportPair({
    manifest,
    annotation,
    actualRoiSha256: shaB,
    actualPixelSha256: "c".repeat(64),
    actualWidth: 200,
    actualHeight: 120,
  });

  assert.equal(validation.status, "undetermined");
});

test("ekspor benchmark tetap dev-only dan tidak menambah autosave atau upload", () => {
  const pageSource = fs.readFileSync(path.join(projectRoot, "app/dev/palm-evaluation/page.tsx"), "utf8");
  const clientSource = fs.readFileSync(path.join(projectRoot, "components/netra-hasta/PalmEvaluationClient.tsx"), "utf8");

  assert.match(pageSource, /NODE_ENV\s*!==\s*["']development["']/);
  assert.match(pageSource, /notFound\(\)/);
  assert.equal(/localStorage|indexedDB|firebase|fetch\s*\(/i.test(clientSource), false);
});
