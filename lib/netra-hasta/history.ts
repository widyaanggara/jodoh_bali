import { calculateBirthCalendar, validateBirthInput, type CombinedNetraResult } from "./product-flow";
import { createDetailSnapshot, encodeDetailSnapshot, validateMatchRange, type MatchRange } from "./detail-result";

export const HISTORY_SCHEMA = "netra-history-v1";
export const DETAIL_HISTORY_SCHEMA = "netra-history-v2";
export const HISTORY_CONSENT = "netra-history-until-deleted-v1";
export const HISTORY_FIELDS = ["schemaVersion", "ownerUid", "birthDate", "birthTime", "saptawara", "pancawara", "wuku", "lintang", "rekhaStatus", "rekhaSource", "rekhaClasses", "algorithmVersion", "calendarVersion", "consentVersion", "savedAt"] as const;
export interface SaveHistoryInput {
  birthDate: string; birthTime: string;
  rekhaStatus: "automatic_candidate" | "uncertain";
  consentAccepted: true; consentVersion: typeof HISTORY_CONSENT;
  matchStartYear?: number; matchEndYear?: number;
}
export interface HistoryRecord {
  id: string; ownerUid: string; schemaVersion: typeof HISTORY_SCHEMA | typeof DETAIL_HISTORY_SCHEMA;
  birthDate: string; birthTime: string;
  saptawara: string; pancawara: string; wuku: string; lintang: string;
  rekhaStatus: "automatic_candidate" | "uncertain";
  rekhaSource: "browser-automatic-unvalidated"; rekhaClasses: "unsupported";
  algorithmVersion: "dark-ridge-v1"; calendarVersion: "calendar-web-8d154cb";
  consentVersion: typeof HISTORY_CONSENT; savedAt: string; detailSnapshot?: string;
}
export function validateHistoryInput(value: Record<string, unknown>): SaveHistoryInput {
  const withRange = Object.hasOwn(value, "matchStartYear") || Object.hasOwn(value, "matchEndYear");
  const allowed = ["birthDate", "birthTime", "rekhaStatus", "consentAccepted", "consentVersion", ...(withRange ? ["matchStartYear", "matchEndYear"] : [])];
  if (Object.keys(value).length !== allowed.length || Object.keys(value).some((key) => !allowed.includes(key))) throw new Error("Field riwayat tidak diizinkan.");
  if (typeof value.birthDate !== "string" || typeof value.birthTime !== "string" || !validateBirthInput({ date: value.birthDate, time: value.birthTime }).valid) throw new Error("Tanggal atau jam lahir tidak valid.");
  if (!["automatic_candidate", "uncertain"].includes(String(value.rekhaStatus)) || value.consentAccepted !== true || value.consentVersion !== HISTORY_CONSENT) throw new Error("Persetujuan atau status Rekha tidak valid.");
  if (withRange) validateMatchRange({ startYear: value.matchStartYear as number, endYear: value.matchEndYear as number });
  return value as unknown as SaveHistoryInput;
}
export function historyInputFromResult(result: CombinedNetraResult, range?: MatchRange): SaveHistoryInput {
  if (result.rekha.snapshot.phase === "processing") throw new Error("Tunggu pemrosesan kandidat selesai.");
  const validated = range ? validateMatchRange(range) : null;
  return { birthDate: result.birth.date, birthTime: result.birth.time, rekhaStatus: result.rekha.snapshot.candidateStatus, consentAccepted: true, consentVersion: HISTORY_CONSENT,
    ...(validated ? { matchStartYear: validated.startYear, matchEndYear: validated.endYear } : {}) };
}
export function historyFields(input: SaveHistoryInput, uid: string): Omit<HistoryRecord, "id" | "savedAt"> {
  const data = calculateBirthCalendar({ date: input.birthDate, time: input.birthTime });
  const withDetail = input.matchStartYear !== undefined && input.matchEndYear !== undefined;
  return {
    schemaVersion: withDetail ? DETAIL_HISTORY_SCHEMA : HISTORY_SCHEMA, ownerUid: uid, birthDate: input.birthDate, birthTime: input.birthTime,
    saptawara: data.saptawara.hari, pancawara: data.pancawara.nama, wuku: data.wuku.nama_wuku, lintang: data.lintang?.lintang ?? "",
    rekhaStatus: input.rekhaStatus, rekhaSource: "browser-automatic-unvalidated", rekhaClasses: "unsupported",
    algorithmVersion: "dark-ridge-v1", calendarVersion: "calendar-web-8d154cb", consentVersion: HISTORY_CONSENT,
    ...(withDetail ? { detailSnapshot: encodeDetailSnapshot(createDetailSnapshot({ date: input.birthDate, time: input.birthTime }, { startYear: input.matchStartYear!, endYear: input.matchEndYear! })) } : {}),
  };
}
