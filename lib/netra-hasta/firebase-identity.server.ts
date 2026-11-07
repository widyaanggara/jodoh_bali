import { firebaseConfig } from "../../firebase/config";

export class AccountError extends Error {
  constructor(public status: number, public code: string, message: string) { super(message); }
}
export interface VerifiedIdentity { uid: string; idToken: string; expiresAt: number }
export const SESSION_COOKIE = "metemu_netra_session";

export async function getAuthConfiguration(fetcher: typeof fetch = fetch) {
  try {
    const response = await fetcher("https://identitytoolkit.googleapis.com/v1/projects?key=" + firebaseConfig.apiKey, { cache: "no-store", signal: AbortSignal.timeout(8000) });
    if (!response.ok) return { configured: false, message: "Firebase Authentication belum siap. Aktifkan Authentication dan Email/Password pada Firebase Console proyek Metemu." };
    return { configured: true, message: null };
  } catch {
    return { configured: false, message: "Konfigurasi Firebase belum dapat diperiksa. Periksa koneksi layanan lalu coba lagi." };
  }
}

export async function verifyFirebaseIdentity(idToken: string, fetcher: typeof fetch = fetch, now = Date.now()): Promise<VerifiedIdentity> {
  if (typeof idToken !== "string" || idToken.length > 16000 || idToken.split(".").length !== 3) throw new AccountError(401, "invalid_session", "Sesi tidak valid. Silakan masuk kembali.");
  let claims: Record<string, unknown>;
  try { claims = JSON.parse(Buffer.from(idToken.split(".")[1], "base64url").toString("utf8")); }
  catch { throw new AccountError(401, "invalid_session", "Sesi tidak valid."); }
  if (!claims || typeof claims !== "object" || Array.isArray(claims)) throw new AccountError(401, "invalid_session", "Sesi tidak valid.");
  const seconds = Math.floor(now / 1000);
  if (claims.aud !== firebaseConfig.projectId || claims.iss !== "https://securetoken.google.com/" + firebaseConfig.projectId ||
      typeof claims.sub !== "string" || !/^[A-Za-z0-9_-]{1,128}$/.test(claims.sub) ||
      !Number.isInteger(claims.exp) || Number(claims.exp) <= seconds ||
      !Number.isInteger(claims.iat) || Number(claims.iat) > seconds + 30 ||
      !Number.isInteger(claims.auth_time) || Number(claims.auth_time) > seconds + 30) {
    throw new AccountError(401, "invalid_session", "Sesi tidak valid atau telah berakhir.");
  }
  let response: Response;
  try {
    response = await fetcher("https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=" + firebaseConfig.apiKey, {
      method: "POST", cache: "no-store", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }), signal: AbortSignal.timeout(8000),
    });
  } catch { throw new AccountError(503, "auth_unavailable", "Layanan verifikasi akun belum dapat dihubungi."); }
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    if (["CONFIGURATION_NOT_FOUND", "PROJECT_NOT_FOUND", "API_KEY_INVALID"].includes(error?.error?.message) || response.status >= 500 || response.status === 429) {
      throw new AccountError(503, "auth_unavailable", "Konfigurasi atau layanan Firebase Authentication belum siap.");
    }
    throw new AccountError(401, "invalid_session", "Sesi ditolak Firebase. Silakan masuk kembali.");
  }
  const data = await response.json();
  const user = data.users?.length === 1 ? data.users[0] : null;
  // Firebase lookup verifies the token. Decoded claims above never establish identity alone.
  if (!user || user.localId !== claims.sub || user.disabled || Number(user.validSince ?? 0) > Number(claims.auth_time)) {
    throw new AccountError(401, "invalid_session", "Sesi telah dicabut atau akun tidak aktif.");
  }
  return { uid: user.localId, idToken, expiresAt: Number(claims.exp) };
}
