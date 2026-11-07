import { AccountError, SESSION_COOKIE, verifyFirebaseIdentity } from "@/lib/netra-hasta/firebase-identity.server";
import { requireNetraIdentity } from "@/lib/netra-hasta/account-access.server";
import { accountFailure, privateJson, readAccountJson, requireSameOrigin } from "@/lib/netra-hasta/account-http.server";

export async function POST(request: Request) {
  try {
    requireSameOrigin(request);
    const body = await readAccountJson(request, 17000);
    if (Object.keys(body).length !== 1 || typeof body.idToken !== "string") throw new AccountError(400, "invalid_body", "Token akun diperlukan.");
    const identity = await verifyFirebaseIdentity(body.idToken);
    const response = privateJson({ uid: identity.uid });
    response.cookies.set(SESSION_COOKIE, identity.idToken, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: Math.max(0, Math.min(3600, identity.expiresAt - Math.floor(Date.now() / 1000))) });
    return response;
  } catch (error) { return accountFailure(error); }
}
export async function GET() {
  try { const identity = await requireNetraIdentity(); return privateJson({ uid: identity.uid }); }
  catch (error) { return accountFailure(error); }
}
export async function DELETE(request: Request) {
  try {
    requireSameOrigin(request);
    const response = privateJson({ signedOut: true });
    response.cookies.set(SESSION_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: 0 });
    return response;
  } catch (error) { return accountFailure(error); }
}
