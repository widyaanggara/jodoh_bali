import { randomUUID } from "node:crypto";
import { firebaseConfig } from "../../firebase/config";
import { AccountError, type VerifiedIdentity } from "./firebase-identity.server";
import { HISTORY_CONSENT, HISTORY_SCHEMA, HISTORY_FIELDS, historyFields, validateHistoryInput, type HistoryRecord } from "./history";

type FirestoreDocument = { name?: string; fields?: Record<string, { stringValue?: string; timestampValue?: string }> };
const database = "projects/" + firebaseConfig.projectId + "/databases/(default)";
const base = "https://firestore.googleapis.com/v1/" + database + "/documents";
export function historyEnabled() {
  return process.env.NETRA_HISTORY_ENABLED === "true" && process.env.NETRA_HISTORY_RULES_PROJECT === firebaseConfig.projectId;
}
function requireEnabled() {
  if (!historyEnabled()) throw new AccountError(503, "history_disabled", "Riwayat belum diaktifkan. Security rules perlu dipublikasikan dan diuji terlebih dahulu.");
}
function identityPath(identity: VerifiedIdentity) {
  if (!/^[A-Za-z0-9_-]{1,128}$/.test(identity.uid)) throw new AccountError(401, "invalid_identity", "Identitas akun tidak valid.");
  return "netraHastaUsers/" + identity.uid + "/results";
}
export function assertRecordId(id: string) {
  if (!/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/.test(id)) throw new AccountError(400, "invalid_record_id", "ID riwayat tidak valid.");
}
async function firestore(identity: VerifiedIdentity, url: string, init: RequestInit = {}, fetcher: typeof fetch = fetch) {
  let response: Response;
  try {
    response = await fetcher(url, { ...init, cache: "no-store", signal: AbortSignal.timeout(10000),
      headers: { "Content-Type": "application/json", Authorization: "Bearer " + identity.idToken } });
  } catch { throw new AccountError(503, "database_unavailable", "Database belum dapat dihubungi."); }
  if (response.status === 401) throw new AccountError(401, "session_expired", "Sesi berakhir. Silakan masuk kembali.");
  if (response.status === 403) throw new AccountError(403, "database_permission_denied", "Akses database ditolak. Periksa security rules proyek.");
  if (response.status === 404) return null;
  if (!response.ok) throw new AccountError(503, "database_unavailable", "Database belum siap memproses riwayat.");
  return response;
}
function decode(document: FirestoreDocument, identity: VerifiedIdentity): HistoryRecord {
  const prefix = database + "/documents/" + identityPath(identity) + "/";
  if (!document.name?.startsWith(prefix)) throw new AccountError(403, "owner_mismatch", "Riwayat bukan milik akun ini.");
  const id = document.name.slice(prefix.length);
  assertRecordId(id);
  const keys = Object.keys(document.fields ?? {});
  if (keys.length !== HISTORY_FIELDS.length || keys.some((key) => !(HISTORY_FIELDS as readonly string[]).includes(key))) throw new AccountError(400, "invalid_record", "Field riwayat tidak diizinkan.");
  const fields: Record<string, string> = {};
  for (const [key, value] of Object.entries(document.fields ?? {})) fields[key] = value.stringValue ?? value.timestampValue ?? "";
  if (fields.ownerUid !== identity.uid || fields.schemaVersion !== HISTORY_SCHEMA || fields.consentVersion !== HISTORY_CONSENT ||
      fields.rekhaClasses !== "unsupported" || fields.algorithmVersion !== "dark-ridge-v1" || fields.calendarVersion !== "calendar-web-8d154cb" || fields.rekhaSource !== "browser-automatic-unvalidated" || !Number.isFinite(Date.parse(fields.savedAt))) {
    throw new AccountError(403, "invalid_record", "Format atau pemilik riwayat tidak valid.");
  }
  let input;
  try { input = validateHistoryInput({ birthDate: fields.birthDate, birthTime: fields.birthTime, rekhaStatus: fields.rekhaStatus, consentAccepted: true, consentVersion: fields.consentVersion }); }
  catch { throw new AccountError(400, "invalid_record", "Data riwayat tidak valid."); }
  // Recompute culture/calendar labels from the unchanged engine, not a user-supplied narrative.
  return { ...historyFields(input, identity.uid), id, savedAt: fields.savedAt };
}
export async function getHistory(identity: VerifiedIdentity, id: string, fetcher: typeof fetch = fetch) {
  requireEnabled(); assertRecordId(id);
  const response = await firestore(identity, base + "/" + identityPath(identity) + "/" + id, {}, fetcher);
  return response ? decode(await response.json(), identity) : null;
}
export async function listHistory(identity: VerifiedIdentity, cursor = "", fetcher: typeof fetch = fetch) {
  requireEnabled();
  if (cursor.length > 2048 || /[\u0000-\u001f]/.test(cursor)) throw new AccountError(400, "invalid_cursor", "Cursor riwayat tidak valid.");
  const query = new URLSearchParams({ pageSize: "20", orderBy: "savedAt desc" });
  if (cursor) query.set("pageToken", cursor);
  const response = await firestore(identity, base + "/" + identityPath(identity) + "?" + query, {}, fetcher);
  if (!response) throw new AccountError(503, "database_unavailable", "Database riwayat belum tersedia.");
  const data = await response.json();
  return { records: (data.documents ?? []).map((doc: FirestoreDocument) => decode(doc, identity)), nextCursor: data.nextPageToken ?? null };
}
export async function saveHistory(identity: VerifiedIdentity, raw: Record<string, unknown>, fetcher: typeof fetch = fetch) {
  requireEnabled();
  let input;
  try { input = validateHistoryInput(raw); } catch (error) { throw new AccountError(400, "invalid_record", (error as Error).message); }
  const id = randomUUID();
  const name = database + "/documents/" + identityPath(identity) + "/" + id;
  const fields = Object.fromEntries(Object.entries(historyFields(input, identity.uid)).map(([key, value]) => [key, { stringValue: value }]));
  const response = await firestore(identity, base + ":commit", {
    method: "POST", body: JSON.stringify({ writes: [{ update: { name, fields }, currentDocument: { exists: false }, updateTransforms: [{ fieldPath: "savedAt", setToServerValue: "REQUEST_TIME" }] }] }),
  }, fetcher);
  if (!response) throw new AccountError(503, "database_unavailable", "Database tidak tersedia.");
  const record = await getHistory(identity, id, fetcher);
  if (!record) throw new AccountError(503, "readback_failed", "Hasil simpan belum dapat diverifikasi. Periksa riwayat sebelum mengulangi simpan.");
  return record;
}
export async function deleteHistory(identity: VerifiedIdentity, id: string, fetcher: typeof fetch = fetch) {
  requireEnabled(); assertRecordId(id);
  const existing = await getHistory(identity, id, fetcher);
  if (!existing) throw new AccountError(404, "not_found", "Riwayat tidak ditemukan.");
  await firestore(identity, base + "/" + identityPath(identity) + "/" + id, { method: "DELETE" }, fetcher);
}
