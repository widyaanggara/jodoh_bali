import { cookies } from "next/headers";
import { AccountError, SESSION_COOKIE, verifyFirebaseIdentity, type VerifiedIdentity } from "./firebase-identity.server";

export type NetraAccountAccess =
  | { kind: "unavailable"; reason: "auth_unavailable" }
  | { kind: "unauthenticated" }
  | ({ kind: "authenticated"; verifiedUserId: string } & VerifiedIdentity);

export async function getNetraAccountAccess(): Promise<NetraAccountAccess> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return { kind: "unauthenticated" };
  try {
    const identity = await verifyFirebaseIdentity(token);
    return { kind: "authenticated", verifiedUserId: identity.uid, ...identity };
  } catch (error) {
    if (error instanceof AccountError && error.status === 503) return { kind: "unavailable", reason: "auth_unavailable" };
    return { kind: "unauthenticated" };
  }
}

export async function requireNetraIdentity(): Promise<VerifiedIdentity> {
  const account = await getNetraAccountAccess();
  if (account.kind === "unavailable") throw new AccountError(503, "auth_unavailable", "Verifikasi akun belum dapat dihubungi.");
  if (account.kind !== "authenticated") throw new AccountError(401, "login_required", "Masuk kembali untuk melanjutkan.");
  return { uid: account.uid, idToken: account.idToken, expiresAt: account.expiresAt };
}
