import { getBalineseDate } from "../balinese-calendar";
import type { DetailSnapshot } from "./detail-result";
import type { BalineseDate } from "../types";
import { PALM_LINE_RUNTIME_VERSION } from "./palm-line-runtime";
import { PALM_ROI_ALGORITHM_VERSION } from "./palm-roi";
import type { PalmCapture } from "./palm-preprocessing";
import type { PalmLineLiveState } from "./palm-line-live";

export const NETRA_RESULT_VERSION = "netra-hasta-result-v2";
export const NETRA_MIN_BIRTH_YEAR = 1900;
export const UNKNOWN_BIRTH_TIME_NOTICE = "Jam lahir tidak diketahui. Hasil memakai tanggal yang diisi tanpa penyesuaian sebelum pukul 06:00; hari Bali dapat berbeda jika kelahiran terjadi sebelum pukul 06:00.";
export type RekhaStatus = "automatic_candidate" | "user_confirmed" | "user_drawn" | "uncertain" | "unsupported";
export type RekhaClass = "heart" | "head" | "life" | "fate";
export interface BirthInput { date: string; time: string }
export type BirthErrors = Partial<Record<"date" | "time", string>>;
export type BirthValidation = { valid: true; value: BirthInput } | { valid: false; errors: BirthErrors };

export function getWitaToday(now = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Makassar", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
  const part = (name: string) => parts.find((p) => p.type === name)?.value ?? "";
  return part("year") + "-" + part("month") + "-" + part("day");
}

export function validateBirthInput(input: BirthInput, today = getWitaToday()): BirthValidation {
  const errors: BirthErrors = {};
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(input.date);
  if (!match) errors.date = "Isi tanggal lahir dengan format YYYY-MM-DD.";
  else {
    const [, year, month, day] = match.map(Number);
    const civil = new Date(year, month - 1, day, 12);
    if (year < NETRA_MIN_BIRTH_YEAR || civil.getFullYear() !== year || civil.getMonth() !== month - 1 || civil.getDate() !== day) {
      errors.date = "Tanggal tidak valid. Rentang tanggal yang didukung dimulai tahun 1900.";
    } else if (input.date > today) errors.date = "Tanggal lahir tidak boleh berada di masa depan.";
  }
  if (typeof input.time !== "string" || (input.time !== "" && !/^([01]\d|2[0-3]):[0-5]\d$/.test(input.time))) errors.time = "Isi jam lahir dalam format HH:mm (00:00–23:59).";
  return Object.keys(errors).length ? { valid: false, errors } : { valid: true, value: { ...input } };
}

export interface PalmProductSnapshot {
  captureId: number;
  width: number;
  height: number;
  qualityMode: PalmCapture["qualityMode"];
  qualityWarnings: string[];
  phase: "processing" | "ready" | "error";
  candidateStatus: "automatic_candidate" | "uncertain";
  candidateCount: number;
  reason: string | null;
}

export function createPalmProductSnapshot(capture: PalmCapture, state: PalmLineLiveState): PalmProductSnapshot {
  const matching = state.phase !== "idle" && (state.phase === "ready" ? state.result.captureId : state.captureId) === capture.capturedAt;
  const baseline = matching && state.phase === "ready" ? state.result.baseline : null;
  return {
    captureId: capture.capturedAt, width: capture.original.width, height: capture.original.height,
    qualityMode: capture.qualityMode, qualityWarnings: [...capture.qualityWarnings],
    phase: baseline ? "ready" : matching && state.phase === "error" ? "error" : "processing",
    candidateStatus: baseline?.status === "detected" && baseline.candidateCount > 0 ? "automatic_candidate" : "uncertain",
    candidateCount: baseline?.candidateCount ?? 0,
    reason: baseline?.reason ?? (matching && state.phase === "error" ? state.reason : null),
  };
}

export interface RekhaClassResult {
  name: RekhaClass;
  status: RekhaStatus;
  origin: "automatic" | "user_confirmation" | "user_drawing" | "unavailable";
  methodVersion: string | null;
  reason: string;
}
export interface CombinedNetraResult {
  schemaVersion: typeof NETRA_RESULT_VERSION;
  /** Optional full-detail view/snapshot contract; never contains camera pixels. */
  detail?: DetailSnapshot;
  birth: BirthInput & { timeBasis: "birth-local-civil" | "unknown-birth-time"; dayBoundary: "06:00" };
  otonan: {
    origin: "existing-balinese-calendar";
    methodVersion: "calendar-web-8d154cb";
    data: Pick<BalineseDate, "wuku" | "pancawara" | "saptawara" | "wewaran" | "lintang">;
  };
  rekha: {
    origin: "browser-local";
    methodVersion: typeof PALM_LINE_RUNTIME_VERSION;
    roiVersion: typeof PALM_ROI_ALGORITHM_VERSION;
    roiMethod: "baseline";
    snapshot: PalmProductSnapshot;
    classes: RekhaClassResult[];
    interpretation: null;
  };
  storage: { mode: "memory-only"; automaticSaveEnabled: false; accountSavePolicy: "verified-account-and-explicit-consent" };
}

export function calculateBirthCalendar(birth: BirthInput): CombinedNetraResult["otonan"]["data"] {
  if (!validateBirthInput(birth).valid) throw new Error("Data kelahiran belum valid.");
  const [year, month, day] = birth.date.split("-").map(Number);
  const result = getBalineseDate(new Date(year, month - 1, day, 12), birth.time || undefined);
  return { wuku: result.wuku, pancawara: result.pancawara, saptawara: result.saptawara, wewaran: result.wewaran, lintang: result.lintang };
}

export function buildCombinedResult(birth: BirthInput, snapshot: PalmProductSnapshot): CombinedNetraResult {
  const data = calculateBirthCalendar(birth);
  return {
    schemaVersion: NETRA_RESULT_VERSION,
    birth: { ...birth, timeBasis: birth.time ? "birth-local-civil" : "unknown-birth-time", dayBoundary: "06:00" },
    otonan: { origin: "existing-balinese-calendar", methodVersion: "calendar-web-8d154cb",
      data },
    rekha: { origin: "browser-local", methodVersion: PALM_LINE_RUNTIME_VERSION, roiVersion: PALM_ROI_ALGORITHM_VERSION,
      roiMethod: "baseline", snapshot: { ...snapshot, qualityWarnings: [...snapshot.qualityWarnings] },
      classes: (["heart", "head", "life", "fate"] as const).map((name) => ({
        name, status: "unsupported", origin: "unavailable", methodVersion: null,
        reason: "Detektor browser menghasilkan kandidat lipatan tanpa klasifikasi empat Rekha.",
      })), interpretation: null },
    storage: { mode: "memory-only", automaticSaveEnabled: false, accountSavePolicy: "verified-account-and-explicit-consent" },
  };
}

export interface ProductState { draft: BirthInput; birth: BirthInput | null; result: CombinedNetraResult | null }
export const INITIAL_PRODUCT_STATE: ProductState = { draft: { date: "", time: "" }, birth: null, result: null };
export type ProductAction =
  | { type: "edit"; field: keyof BirthInput; value: string }
  | { type: "start"; birth: BirthInput }
  | { type: "capture"; snapshot: PalmProductSnapshot | null }
  | { type: "reset" };

export function reduceProductState(state: ProductState, action: ProductAction): ProductState {
  if (action.type === "reset") return { draft: { date: "", time: "" }, birth: null, result: null };
  if (action.type === "edit") return { draft: { ...state.draft, [action.field]: action.value }, birth: null, result: null };
  if (action.type === "start") {
    if (!validateBirthInput(action.birth).valid) return state;
    return { draft: { ...action.birth }, birth: { ...action.birth }, result: null };
  }
  return { ...state, result: state.birth && action.snapshot ? buildCombinedResult(state.birth, action.snapshot) : null };
}
