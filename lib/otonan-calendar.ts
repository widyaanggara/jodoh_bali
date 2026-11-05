import { getBalineseDate } from "./balinese-calendar";
import { parseSamyogaCivilDate, validateSamyogaBirthTime } from "./samyoga-group";
import type { BalineseDate } from "./types";

// Reuse the validated civil-date contract; never interpret YYYY-MM-DD as UTC.
export const parseOtonanCivilDate = parseSamyogaCivilDate;

/** Shared input adapter; calendar formulas, anchor and master remain in the existing engine. */
export function calculateOtonanCalendar(birthDate: string, birthTime: string): BalineseDate {
    const civilDate = parseOtonanCivilDate(birthDate);
    const time = validateSamyogaBirthTime(birthTime);
    return getBalineseDate(civilDate, time);
}
