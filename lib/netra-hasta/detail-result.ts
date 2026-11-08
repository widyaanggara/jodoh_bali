import { getBalineseDate } from "../balinese-calendar";
import { findIdealMatches, getZodiak } from "../jodoh-logic";
import { getPalSriSedanaData, getCurrentPeriodAnalysis, getLabelRezeki } from "../pal-sri-sedana";
import { getWitaToday, validateBirthInput, type BirthInput } from "./product-flow";

export const DETAIL_VERSION = "netra-detail-r7.2-v1";
export const DETAIL_MAX_BYTES = 48000;
export interface MatchRange { startYear: number; endYear: number }
export function defaultMatchRange(): MatchRange {
  const year = Number(getWitaToday().slice(0, 4));
  return { startYear: year, endYear: year + 5 };
}
export function validateMatchRange(range: MatchRange): MatchRange {
  if (!Number.isInteger(range.startYear) || !Number.isInteger(range.endYear) || range.startYear < 1900 || range.endYear > 2100 || range.endYear < range.startYear || range.endYear - range.startYear > 10) {
    throw new Error("Pilih rentang 1900–2100, paling banyak 11 tahun, dengan tahun akhir tidak lebih kecil dari tahun mulai.");
  }
  return { ...range };
}
export function civilDateString(date: Date): string {
  return String(date.getFullYear()).padStart(4, "0") + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}
export function createCalendarDetailSnapshot(birth: BirthInput) {
  if (!validateBirthInput(birth).valid) throw new Error("Data kelahiran belum valid.");
  const [year, month, day] = birth.date.split("-").map(Number);
  const civil = new Date(year, month - 1, day, 12);
  const calendar = getBalineseDate(civil, birth.time || undefined);
  const zodiac = getZodiak(civil);
  const palData = getPalSriSedanaData(calendar.totalUrip);
  const analysis = palData ? getCurrentPeriodAnalysis(civil, palData) : null;
  return {
    version: DETAIL_VERSION, generatedAt: new Date().toISOString(), birth: { ...birth },
    methods: { calendar: "calendar-web-8d154cb", matches: "jodoh-web-8d154cb", pal: "pal-sri-sedana-web-8d154cb" },
    calendar, zodiac,
    pal: palData && analysis ? { data: palData, analysis, label: getLabelRezeki(analysis.value) } : null,
  };
}
export type CalendarDetailSnapshot = ReturnType<typeof createCalendarDetailSnapshot>;

export function createDetailSnapshot(birth: BirthInput, requested: MatchRange = defaultMatchRange()) {
  const range = validateMatchRange(requested);
  const calendarDetail = createCalendarDetailSnapshot(birth);
  const [year, month, day] = birth.date.split("-").map(Number);
  const civil = new Date(year, month - 1, day, 12);
  const matches = findIdealMatches(civil, birth.time, range.startYear, range.endYear);
  return {
    ...calendarDetail,
    generatedAt: new Date().toISOString(),
    matches: {
      range, ordering: "engine-chronological" as const, totalFound: matches.length,
      top: matches.slice(0, 3).map((match, index) => ({
        rank: index + 1, date: civilDateString(match.date), wuku: match.balineseDate.wuku.nama_wuku,
        saptawara: match.balineseDate.saptawara.hari, pancawara: match.balineseDate.pancawara.nama,
        category: match.kategori.kategori, meaning: match.kategori.makna,
        hybridScore: match.hybridScore, hybridStatus: match.hybridStatus,
        mod16Label: match.mod16Result.label, mod16Meaning: match.mod16Result.makna,
      })),
    },
  };
}
export type DetailSnapshot = ReturnType<typeof createDetailSnapshot>;
export function encodeDetailSnapshot(snapshot: DetailSnapshot): string {
  const encoded = JSON.stringify(snapshot);
  if (new TextEncoder().encode(encoded).byteLength > DETAIL_MAX_BYTES) throw new Error("Snapshot detail melebihi batas ukuran.");
  return encoded;
}
export function decodeDetailSnapshot(encoded: string, birth: BirthInput): DetailSnapshot {
  if (typeof encoded !== "string" || new TextEncoder().encode(encoded).byteLength > DETAIL_MAX_BYTES) throw new Error("Snapshot detail tidak valid.");
  const value = JSON.parse(encoded) as DetailSnapshot;
  if (!value || value.version !== DETAIL_VERSION || value.birth?.date !== birth.date || value.birth?.time !== birth.time || !Number.isFinite(Date.parse(value.generatedAt))) throw new Error("Identitas atau versi snapshot tidak cocok.");
  const expected = createDetailSnapshot(birth, validateMatchRange(value.matches?.range));
  // Frozen clock-dependent values are retained. Stable master/engine outputs must match.
  const stableCalendar = (calendar: DetailSnapshot["calendar"]) => { const stable = { ...calendar }; delete stable.nextOtonan; return stable; };
  if (JSON.stringify(value.methods) !== JSON.stringify(expected.methods) ||
      JSON.stringify(stableCalendar(value.calendar)) !== JSON.stringify(stableCalendar(expected.calendar)) ||
      JSON.stringify(value.zodiac) !== JSON.stringify(expected.zodiac) ||
      JSON.stringify(value.matches) !== JSON.stringify(expected.matches) ||
      JSON.stringify(value.pal?.data ?? null) !== JSON.stringify(expected.pal?.data ?? null)) throw new Error("Snapshot berbeda dari engine atau master versi yang didukung.");
  if (typeof value.calendar.nextOtonan !== "string" || value.calendar.nextOtonan.length > 100) throw new Error("Otonan berikutnya tidak valid.");
  if (value.pal) {
    const a = value.pal.analysis;
    if (!Number.isInteger(a.currentAge) || a.currentAge < -1 || a.currentAge > 250 || !Number.isInteger(a.periodIndex) || a.periodIndex < -1 || a.periodIndex > 42 || !Number.isInteger(a.value) || a.value < 0 || a.value > 8 ||
      typeof a.interpretation !== "string" || a.interpretation.length > 500 ||
      JSON.stringify(value.pal.label) !== JSON.stringify(getLabelRezeki(a.value))) throw new Error("Analisis Pal Sri Sedana tidak valid.");
  }
  // Strip undeclared root/nested payloads by returning a bounded explicit structure.
  return { ...expected, generatedAt: value.generatedAt, calendar: { ...expected.calendar, nextOtonan: value.calendar.nextOtonan },
    pal: value.pal && expected.pal ? { ...expected.pal, analysis: { currentAge: value.pal.analysis.currentAge, periodIndex: value.pal.analysis.periodIndex, value: value.pal.analysis.value, interpretation: value.pal.analysis.interpretation }, label: expected.pal ? getLabelRezeki(value.pal.analysis.value) : value.pal.label } : null };
}
