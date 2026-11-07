import type { RekhaClass, RekhaClassResult } from "./product-flow";
import type { PalmLineRuntimeCandidate, PalmLineRuntimePoint } from "./palm-line-runtime";

export const REKHA_REVIEW_VERSION = "rekha-user-review-v1";
export const REKHA_NAMES = ["heart", "head", "life", "fate"] as const;
export const REKHA_COLORS: Record<RekhaClass, string> = { heart: "#be185d", head: "#1d4ed8", life: "#047857", fate: "#a16207" };
export const REKHA_LABELS: Record<RekhaClass, string> = { heart: "Heart", head: "Head", life: "Life", fate: "Fate" };
export interface RekhaMark {
  name: RekhaClass;
  status: "user_confirmed" | "user_drawn" | "uncertain";
  points: PalmLineRuntimePoint[];
  candidateId?: string;
}
export type RekhaMarks = Partial<Record<RekhaClass, RekhaMark>>;

export function roiPoint(clientX: number, clientY: number, rect: { left: number; top: number; width: number; height: number }, width: number, height: number): PalmLineRuntimePoint | null {
  if (![clientX, clientY, rect.left, rect.top, rect.width, rect.height, width, height].every(Number.isFinite) || rect.width <= 0 || rect.height <= 0 || width < 2 || height < 2 || !Number.isInteger(width) || !Number.isInteger(height)) return null;
  if (clientX < rect.left || clientY < rect.top || clientX > rect.left + rect.width || clientY > rect.top + rect.height) return null;
  return { x: Math.min(width - 1, (clientX - rect.left) * width / rect.width), y: Math.min(height - 1, (clientY - rect.top) * height / rect.height) };
}
export function validateRekhaPoints(points: readonly PalmLineRuntimePoint[], width: number, height: number): boolean {
  return Number.isInteger(width) && Number.isInteger(height) && width >= 2 && height >= 2 && points.length >= 2 && points.length <= 512 &&
    points.every((p) => Number.isFinite(p.x) && Number.isFinite(p.y) && p.x >= 0 && p.y >= 0 && p.x <= width - 1 && p.y <= height - 1) &&
    points.some((p) => Math.hypot(p.x - points[0].x, p.y - points[0].y) >= 1);
}
export function drawRekha(name: RekhaClass, points: readonly PalmLineRuntimePoint[], width: number, height: number): RekhaMark {
  if (!REKHA_NAMES.includes(name) || !validateRekhaPoints(points, width, height)) throw new Error("Tandai sedikitnya dua titik berbeda di dalam ROI (maksimal 512 titik).");
  return { name, status: "user_drawn", points: points.map(({ x, y }) => ({ x, y })) };
}
export function confirmRekha(name: RekhaClass, candidateId: string, candidates: readonly PalmLineRuntimeCandidate[], width: number, height: number): RekhaMark {
  const candidate = candidates.find((c) => c.id === candidateId);
  if (!REKHA_NAMES.includes(name) || !candidate || !validateRekhaPoints(candidate.points, width, height)) throw new Error("Pilih kandidat otomatis yang valid pada capture ini.");
  return { name, status: "user_confirmed", candidateId, points: candidate.points.map(({ x, y }) => ({ x, y })) };
}
/** Never pass coordinates beyond the capture editor. Labels are explicit user judgements. */
export function summarizeRekha(marks: RekhaMarks): RekhaClassResult[] {
  return REKHA_NAMES.map((name) => {
    const mark = marks[name];
    if (!mark) return { name, status: "unsupported", origin: "unavailable", methodVersion: null, reason: "Klasifikasi otomatis belum didukung; belum ada penandaan pengguna." };
    if (mark.status === "uncertain") return { name, status: "uncertain", origin: "unavailable", methodVersion: REKHA_REVIEW_VERSION, reason: "Pengguna belum dapat memastikan garis ini; bukan bukti bahwa garis tidak ada." };
    return { name, status: mark.status, origin: mark.status === "user_drawn" ? "user_drawing" : "user_confirmation", methodVersion: REKHA_REVIEW_VERSION,
      reason: mark.status === "user_drawn" ? "Lintasan ditandai pengguna pada foto ROI; bukan deteksi otomatis atau validasi ahli." : "Label dipilih pengguna untuk satu segmen dark-ridge-v1; bukan klasifikasi otomatis atau validasi ahli." };
  });
}
/** Copy only this version's metadata allowlist; reject promotion into automatic results. */
export function validateRekhaSummary(value: readonly RekhaClassResult[]): RekhaClassResult[] | null {
  if (value.length !== 4 || REKHA_NAMES.some((name, i) => value[i]?.name !== name)) return null;
  const marks: RekhaMarks = {};
  for (const row of value) {
    if (row.status === "unsupported") { if (row.origin !== "unavailable" || row.methodVersion !== null) return null; continue; }
    const origin = row.status === "user_drawn" ? "user_drawing" : row.status === "user_confirmed" ? "user_confirmation" : row.status === "uncertain" ? "unavailable" : null;
    if (!origin || row.origin !== origin || row.methodVersion !== REKHA_REVIEW_VERSION) return null;
    marks[row.name] = { name: row.name, status: row.status as RekhaMark["status"], points: [] };
  }
  return summarizeRekha(marks);
}
export function wipeRekhaMarks(marks: RekhaMarks): void {
  for (const mark of Object.values(marks)) { for (const point of mark.points) { point.x = 0; point.y = 0; } mark.points.length = 0; delete mark.candidateId; }
}
