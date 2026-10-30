import {
  snapshotPalmQualityReport,
  type PalmQualityReport,
  type PalmQualitySnapshot,
} from "./image-quality";
import {
  wipePalmCapture,
  type PalmCapture,
} from "./palm-preprocessing";

export interface PalmCaptureArtifacts {
  capture: PalmCapture | null;
  capturedQualityMetrics: PalmQualitySnapshot | null;
}

export function createEmptyPalmCaptureArtifacts(): PalmCaptureArtifacts {
  return { capture: null, capturedQualityMetrics: null };
}

export function createPalmCaptureArtifacts(
  capture: PalmCapture,
  liveQualityMetrics: PalmQualityReport,
): PalmCaptureArtifacts {
  return {
    capture,
    capturedQualityMetrics: snapshotPalmQualityReport(
      liveQualityMetrics,
      capture.capturedAt,
    ),
  };
}

export function clearPalmCaptureArtifacts(
  artifacts: PalmCaptureArtifacts,
): PalmCaptureArtifacts {
  wipePalmCapture(artifacts.capture);
  return createEmptyPalmCaptureArtifacts();
}
