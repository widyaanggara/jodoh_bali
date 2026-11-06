import { NextResponse } from "next/server";
import { AccountError } from "./firebase-identity.server";

export function privateJson(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "private, no-store", Pragma: "no-cache" } });
}
export function accountFailure(error: unknown) {
  return error instanceof AccountError
    ? privateJson({ error: error.message, code: error.code }, error.status)
    : privateJson({ error: "Layanan belum dapat memproses permintaan.", code: "service_error" }, 503);
}
export function requireSameOrigin(request: Request) {
  let origin: URL;
  try { origin = new URL(request.headers.get("origin") ?? ""); }
  catch { throw new AccountError(403, "invalid_origin", "Permintaan harus berasal dari halaman Metemu."); }
  if (!["https:", "http:"].includes(origin.protocol) || origin.host !== request.headers.get("host")) throw new AccountError(403, "invalid_origin", "Asal permintaan tidak diizinkan.");
}
export async function readAccountJson(request: Request, limit = 4096): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.toLowerCase().split(";")[0].trim() !== "application/json") throw new AccountError(415, "invalid_content_type", "Format permintaan harus JSON.");
  const reader = request.body?.getReader();
  if (!reader) throw new AccountError(400, "invalid_body", "Data permintaan kosong.");
  const chunks: Uint8Array[] = [];
  let bytes = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      bytes += value.byteLength;
      if (bytes > limit) { await reader.cancel(); throw new AccountError(413, "payload_too_large", "Ukuran permintaan terlalu besar."); }
      chunks.push(value);
    }
    const merged = Buffer.concat(chunks);
    let value: unknown;
    try { value = JSON.parse(merged.toString("utf8")); }
    catch { throw new AccountError(400, "invalid_body", "JSON tidak valid."); }
    finally { merged.fill(0); }
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new AccountError(400, "invalid_body", "Data harus berupa objek.");
    return value as Record<string, unknown>;
  } finally { for (const chunk of chunks) chunk.fill(0); reader.releaseLock(); }
}
