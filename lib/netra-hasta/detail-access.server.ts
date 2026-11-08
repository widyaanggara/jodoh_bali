import { createDetailSnapshot, validateMatchRange } from "./detail-result";
import { validateBirthInput } from "./product-flow";
import { AccountError, type VerifiedIdentity } from "./firebase-identity.server";
import { accountFailure, privateJson, readAccountJson, requireSameOrigin } from "./account-http.server";

/** Stateless computation only: no Firestore write, biometric input, or client-selected UID. */
export function createProtectedDetailHandler(identify: () => Promise<VerifiedIdentity>, calculate = createDetailSnapshot) {
  return async (request: Request) => {
    try {
      requireSameOrigin(request);
      const identity = await identify();
      const body = await readAccountJson(request);
      const fields = ["birthDate", "birthTime", "matchStartYear", "matchEndYear"];
      if (Object.keys(body).length !== fields.length || Object.keys(body).some(key => !fields.includes(key)) || typeof body.birthDate !== "string" || typeof body.birthTime !== "string") throw new AccountError(400, "invalid_detail_input", "Data hasil lengkap tidak valid.");
      const birth = validateBirthInput({ date: body.birthDate as string, time: body.birthTime as string });
      if (!birth.valid) throw new AccountError(400, "invalid_detail_input", "Tanggal atau jam lahir tidak valid.");
      let range;
      try { range = validateMatchRange({ startYear: body.matchStartYear as number, endYear: body.matchEndYear as number }); }
      catch { throw new AccountError(400, "invalid_detail_input", "Rentang tahun tidak valid."); }
      return privateJson({ verifiedUid: identity.uid, expiresAt: identity.expiresAt, detail: calculate(birth.value, range) });
    } catch (error) { return accountFailure(error); }
  };
}
