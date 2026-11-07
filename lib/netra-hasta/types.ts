import type { NormalizedLandmark } from "@mediapipe/tasks-vision";

export type ScanMode = "hand" | "face";

export type VisionDelegate = "GPU" | "CPU";

export interface LandmarkConnection {
  start: number;
  end: number;
}

export interface HandObservation {
  landmarks: NormalizedLandmark[];
  handedness: "Left" | "Right" | null;
  timestamp: number;
}
