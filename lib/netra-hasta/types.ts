export type ScanMode = "hand" | "face";

export type VisionDelegate = "GPU" | "CPU";

export interface LandmarkConnection {
  start: number;
  end: number;
}
