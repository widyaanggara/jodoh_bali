import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import { loadNetraModule } from "./helpers/load-netra-typescript.mjs";
const { createProtectedDetailHandler } = loadNetraModule("lib/netra-hasta/detail-access.server.ts");
const { AccountError } = loadNetraModule("lib/netra-hasta/firebase-identity.server.ts");
const engine = loadNetraModule("lib/netra-hasta/detail-result.ts");
const jodoh = loadNetraModule("lib/jodoh-logic.ts");
const birth = { date: "2005-07-27", time: "" };
const range = { startYear: 2000, endYear: 2005 };
const body = { birthDate: birth.date, birthTime: birth.time, matchStartYear: range.startYear, matchEndYear: range.endYear };
const identity = { uid: "synthetic-owner", expiresAt: Math.floor(Date.now() / 1000) + 3600, idToken: "synthetic" };
function request(value = body, headers = {}) {
  return new Request("https://metemu.example/api/netra-hasta/detail", { method: "POST", headers: { "Content-Type": "application/json", Origin: "https://metemu.example", Host: "metemu.example", ...headers }, body: JSON.stringify(value) });
}
test("anonymous, forged and expired sessions fail before calculation or input parsing", async () => {
  for (const code of ["login_required", "invalid_session", "session_expired"]) {
    let calls = 0;
    const handler = createProtectedDetailHandler(async () => { throw new AccountError(401, code, "Login required"); }, () => { calls++; });
    const response = await handler(request({ ownerUid: identity.uid }));
    assert.equal(response.status, 401); assert.equal(calls, 0);
    assert.deepEqual(await response.json(), { error: "Login required", code });
    assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  }
});
test("same-origin protection rejects cross-site requests before identity verification", async () => {
  let called = false;
  const handler = createProtectedDetailHandler(async () => { called = true; return identity; });
  for (const origin of ["https://evil.example", "null", ""]) assert.equal((await handler(request(body, { Origin: origin }))).status, 403);
  assert.equal(called, false);
});
test("verified sessions receive unchanged existing detail with private no-store headers", async () => {
  const response = await createProtectedDetailHandler(async () => identity)(request());
  assert.equal(response.status, 200);
  assert.equal(response.headers.get("Cache-Control"), "private, no-store");
  const value = await response.json(), expected = engine.createDetailSnapshot(birth, range);
  assert.equal(value.verifiedUid, identity.uid); assert.equal(value.expiresAt, identity.expiresAt);
  const normalize = d => { const copy = structuredClone(d); delete copy.generatedAt; return copy; };
  assert.deepEqual(normalize(value.detail), normalize(expected));
  assert.doesNotMatch(JSON.stringify(value), /data:image|points|landmarks|idToken|pixels|fingerprint/);
});
test("bounded input rejects invalid dates/time/ranges, impersonation and biometric payloads", async () => {
  let calls = 0;
  const handler = createProtectedDetailHandler(async () => identity, () => { calls++; });
  const invalid = [null, [], {}, { ...body, birthDate: "2001-02-29" }, { ...body, birthDate: [birth.date] }, { ...body, birthTime: "25:00" }, { ...body, birthTime: null }, { ...body, matchStartYear: "2000" }, { ...body, matchEndYear: 2100 }, { ...body, ownerUid: "other" }, { ...body, points: [] }, { ...body, pixels: "x".repeat(5000) }];
  for (const value of invalid) {
    const response = await handler(request(value));
    assert([400, 413].includes(response.status), JSON.stringify(value).slice(0, 120));
  }
  assert.equal(calls, 0);
  assert.equal((await handler(request(body, { "Content-Type": "text/plain" }))).status, 415);
});
test("auth/network failures fail closed without returning calculation or secret errors", async () => {
  const response = await createProtectedDetailHandler(async () => { throw Error("private credential detail"); })(request());
  assert.equal(response.status, 503); assert.doesNotMatch(JSON.stringify(await response.json()), /credential|matches|calendar/);
});
test("public calendar helper never calculates or includes protected partner results", () => {
  const original = jodoh.findIdealMatches;
  jodoh.findIdealMatches = () => { throw Error("Partner calculation must not run before login"); };
  try {
    const result = engine.createCalendarDetailSnapshot(birth);
    assert(result.calendar.wuku); assert(!Object.hasOwn(result, "matches"));
  } finally { jodoh.findIdealMatches = original; }
});
test("route uses real server identity and UI gates supporting results/review without CSS reliance", () => {
  const route = fs.readFileSync("app/api/netra-hasta/detail/route.ts", "utf8");
  assert.match(route, /createProtectedDetailHandler\(requireNetraIdentity\)/);
  const hook = fs.readFileSync("hooks/useProtectedNetraDetail.ts", "utf8");
  for (const expression of [/verifiedUid !== uid/, /AbortController/, /if \(!active\) return/, /expiresAt/, /current\?\.phase === "ready"/, /if \(!uid \|\| account.loading\) return/]) assert.match(hook, expression);
  const preview = fs.readFileSync("components/netra-hasta/PalmPreviewPanel.tsx", "utf8");
  assert.match(preview, /rekhaReviewEnabled && onRekhaReview/);
  assert.match(preview, /rekhaReviewEnabled \? <PalmLineResultPanel/);
});
