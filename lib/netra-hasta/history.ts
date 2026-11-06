import { calculateBirthCalendar, validateBirthInput, type CombinedNetraResult } from "./product-flow";

export const HISTORY_SCHEMA = "netra-history-v1";
export const HISTORY_CONSENT = "netra-history-until-deleted-v1";
export const HISTORY_FIELDS = ["schemaVersion", "ownerUid", "birthDate", "birthTime", "saptawara", "pancawara", "wuku", "lintang", "rekhaStatus", "rekhaSource", "rekhaClasses", "algorithmVersion", "calendarVersion", "consentVersion", "savedAt"] as const;
export interface SaveHistoryInput {
  birthDate: string; birthTime: string;
  rekhaStatus: "automatic_candidate" | "uncertain";
  consentAccepted: true; consentVersion: typeof HISTORY_CONSENT;
}
export interface HistoryRecord {
  id: string; ownerUid: string; schemaVersion: typeof HISTORY_SCHEMA;
  birthDate: string; birthTime: string;
  saptawara: string; pancawara: string; wuku: string; lintang: string;
  rekhaStatus: "automatic_candidate" | "uncertain";
  rekhaSource: "browser-automatic-unvalidated"; rekhaClasses: "unsupported";
  algorithmVersion: "dark-ridge-v1"; calendarVersion: "calendar-web-8d154cb";
  consentVersion: typeof HISTORY_CONSENT; savedAt: string;
}
export function validateHistoryInput(value: Record<string, unknown>): SaveHistoryInput {
  const allowed = ["birthDate", "birthTime", "rekhaStatus", "consentAccepted", "consentVersion"];
  if (Object.keys(value).length !== allowed.length || Object.keys(value).some((key) => !allowed.includes(key))) throw new Error("Field riwayat tidak diizinkan.");
  if (typeof value.birthDate !== "string" || typeof value.birthTime !== "string" || !validateBirthInput({ date: value.birthDate, time: value.birthTime }).valid) throw new Error("Tanggal atau jam lahir tidak valid.");
  if (!["automatic_candidate", "uncertain"].includes(String(value.rekhaStatus)) || value.consentAccepted !== true || value.consentVersion !== HISTORY_CONSENT) throw new Error("Persetujuan atau status Rekha tidak valid.");
  return value as unknown as SaveHistoryInput;
}
export function historyInputFromResult(result: CombinedNetraResult): SaveHistoryInput {
  if (result.rekha.snapshot.phase === "processing") throw new Error("Tunggu pemrosesan kandidat selesai.");
  return { birthDate: result.birth.date, birthTime: result.birth.time, rekhaStatus: result.rekha.snapshot.candidateStatus, consentAccepted: true, consentVersion: HISTORY_CONSENT };
}
export function historyFields(input: SaveHistoryInput, uid: string): Omit<HistoryRecord, "id" | "savedAt"> {
  const data = calculateBirthCalendar({ date: input.birthDate, time: input.birthTime });
  return {
    schemaVersion: HISTORY_SCHEMA, ownerUid: uid, birthDate: input.birthDate, birthTime: input.birthTime,
    saptawara: data.saptawara.hari, pancawara: data.pancawara.nama, wuku: data.wuku.nama_wuku, lintang: data.lintang?.lintang ?? "",
    rekhaStatus: input.rekhaStatus, rekhaSource: "browser-automatic-unvalidated" as const, rekhaClasses: "unsupported" as const,
    algorithmVersion: "dark-ridge-v1" as const, calendarVersion: "calendar-web-8d154cb" as const, consentVersion: HISTORY_CONSENT,
  };
}
