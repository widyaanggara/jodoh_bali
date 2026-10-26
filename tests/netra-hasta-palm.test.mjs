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
});

test("dimensi ROI mengikuti resolusi frame sumber tanpa downscale preview", () => {
  const fullResolution = roi.calculatePalmRoiGeometry(makeLandmarks(), 1000, 1000);
  const halfResolution = roi.calculatePalmRoiGeometry(makeLandmarks(), 500, 500);

  assert.equal(fullResolution.ok, true);
  assert.equal(halfResolution.ok, true);
  assert.ok(Math.abs(fullResolution.geometry.outputWidth / halfResolution.geometry.outputWidth - 2) < 0.02);
  assert.ok(Math.abs(fullResolution.geometry.outputHeight / halfResolution.geometry.outputHeight - 2) < 0.02);
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
    original: { width: 1, height: 1, data: new Uint8ClampedArray([1, 2, 3, 255]) },
    grayscale: { width: 1, height: 1, data: new Uint8ClampedArray([4, 4, 4, 255]) },
    enhanced: { width: 1, height: 1, data: new Uint8ClampedArray([5, 5, 5, 255]) },
  };
  const artifacts = captureState.createPalmCaptureArtifacts(capture, report);
  const cleared = captureState.clearPalmCaptureArtifacts(artifacts);

  assert.deepEqual(Array.from(capture.original.data), [0, 0, 0, 0]);
  assert.deepEqual(Array.from(capture.grayscale.data), [0, 0, 0, 0]);
  assert.deepEqual(Array.from(capture.enhanced.data), [0, 0, 0, 0]);
  assert.equal(cleared.capture, null);
  assert.equal(cleared.capturedQualityMetrics, null);
});
