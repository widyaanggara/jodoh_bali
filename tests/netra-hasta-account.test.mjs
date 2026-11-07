import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadNetraModule } from "./helpers/load-netra-typescript.mjs";

const identity = loadNetraModule("lib/netra-hasta/firebase-identity.server.ts");
const history = loadNetraModule("lib/netra-hasta/history.ts");
const database = loadNetraModule("lib/netra-hasta/history.server.ts");
const http = loadNetraModule("lib/netra-hasta/account-http.server.ts");
const now = Date.now();
const seconds = Math.floor(now / 1000);
function token(changes = {}) {
  return Buffer.from('{"alg":"RS256"}').toString("base64url") + "." +
    Buffer.from(JSON.stringify({ aud: "daily-logs-a1442", iss: "https://securetoken.google.com/daily-logs-a1442", sub: "owner_A", exp: seconds + 3600, iat: seconds, auth_time: seconds, ...changes })).toString("base64url") + ".signature";
}
function response(data, status = 200) { return new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }); }
const verified = (changes = {}) => response({ users: [{ localId: "owner_A", validSince: String(seconds - 10), ...changes }] });

test("Firebase identity requires actual upstream success; decoded JWT alone is never sufficient", async () => {
  let calls = 0;
  const result = await identity.verifyFirebaseIdentity(token(), async (url, options) => {
    calls++; assert.match(url, /accounts:lookup/); assert.equal(options.cache, "no-store");
    assert.equal(JSON.parse(options.body).idToken, token()); return verified();
  }, now);
  assert.equal(result.uid, "owner_A"); assert.equal(calls, 1);
  await assert.rejects(identity.verifyFirebaseIdentity(token(), async () => response({ error: { message: "INVALID_ID_TOKEN" } }, 400), now), (e) => e.status === 401);
});
test("wrong project, issuer, expiry, malformed payload, UID and future claims fail before network", async () => {
  let calls = 0;
  const upstream = async () => { calls++; return verified(); };
  for (const value of ["fake", "a." + Buffer.from("null").toString("base64url") + ".c", token({ aud: "another-project" }), token({ iss: "evil" }), token({ exp: seconds - 1 }), token({ sub: "a/b" }), token({ iat: seconds + 500 }), token({ auth_time: seconds + 500 })]) {
    await assert.rejects(identity.verifyFirebaseIdentity(value, upstream, now), (e) => e.status === 401);
  }
  assert.equal(calls, 0);
});
test("disabled, revoked, conflicting UID and lookup failure deny access", async () => {
  for (const user of [{ disabled: true }, { validSince: String(seconds + 1) }, { localId: "owner_B" }]) await assert.rejects(identity.verifyFirebaseIdentity(token(), async () => verified(user), now), (e) => e.status === 401);
  await assert.rejects(identity.verifyFirebaseIdentity(token(), async () => { throw new Error("offline"); }, now), (e) => e.status === 503);
  await assert.rejects(identity.verifyFirebaseIdentity(token(), async () => response({ error: { message: "CONFIGURATION_NOT_FOUND" } }, 400), now), (e) => e.status === 503);
});
test("provider readiness reports cloud configuration failure, not a fake login", async () => {
  assert.equal((await identity.getAuthConfiguration(async () => response({ error: {} }, 400))).configured, false);
  assert.equal((await identity.getAuthConfiguration(async () => response({ projectId: "expected" }))).configured, true);
});
const input = { birthDate: "2005-07-27", birthTime: "06:00", rekhaStatus: "automatic_candidate", consentAccepted: true, consentVersion: history.HISTORY_CONSENT };
const ownerA = { uid: "owner_A", idToken: "a-token", expiresAt: seconds + 3600 };
const ownerB = { uid: "owner_B", idToken: "b-token", expiresAt: seconds + 3600 };
const recordId = "11111111-1111-4111-8111-111111111111";
function enabled(callback) {
  return async () => {
    const oldEnabled = process.env.NETRA_HISTORY_ENABLED, oldProject = process.env.NETRA_HISTORY_RULES_PROJECT;
    process.env.NETRA_HISTORY_ENABLED = "true"; process.env.NETRA_HISTORY_RULES_PROJECT = "daily-logs-a1442";
    try { await callback(); } finally {
      if (oldEnabled === undefined) delete process.env.NETRA_HISTORY_ENABLED; else process.env.NETRA_HISTORY_ENABLED = oldEnabled;
      if (oldProject === undefined) delete process.env.NETRA_HISTORY_RULES_PROJECT; else process.env.NETRA_HISTORY_RULES_PROJECT = oldProject;
    }
  };
}
function doc(uid, id = recordId) {
  return { name: "projects/daily-logs-a1442/databases/(default)/documents/netraHastaUsers/" + uid + "/results/" + id,
    fields: { ...Object.fromEntries(Object.entries(history.historyFields(input, uid)).map(([key, value]) => [key, { stringValue: value }])), savedAt: { timestampValue: "2026-11-07T00:00:00Z" } } };
}
test("history rejects invalid dates, forged fields, images, owner and missing explicit consent", () => {
  assert.deepEqual(history.validateHistoryInput(input), input);
  for (const change of [{ birthDate: "2001-02-29" }, { birthTime: "24:00" }, { consentAccepted: false }, { consentVersion: "other" }, { rekhaStatus: "user_confirmed" }]) assert.throws(() => history.validateHistoryInput({ ...input, ...change }));
  for (const extra of [{ ownerUid: "owner_B" }, { image: "data:image/png" }, { points: [] }, { otonan: "invented" }]) assert.throws(() => history.validateHistoryInput({ ...input, ...extra }));
});
test("minimum persisted representation excludes capture, pictures, coordinates and fabricated classes", () => {
  const fields = history.historyFields(input, ownerA.uid);
  assert.equal(fields.wuku, "Sinta"); assert.equal(fields.ownerUid, ownerA.uid); assert.equal(fields.rekhaClasses, "unsupported");
  assert.doesNotMatch(JSON.stringify(fields), /captureId|qualityWarnings|rotation|landmarks|fingerprint|points|data:image|password|idToken/);
});
test("history activation requires matching project rules confirmation", async () => {
  const old = process.env.NETRA_HISTORY_ENABLED; delete process.env.NETRA_HISTORY_ENABLED;
  try { await assert.rejects(database.listHistory(ownerA), (e) => e.code === "history_disabled"); }
  finally { if (old !== undefined) process.env.NETRA_HISTORY_ENABLED = old; }
});
test("every document path is scoped to verified UID and foreign documents are rejected", enabled(async () => {
  const record = await database.getHistory(ownerA, recordId, async (url, options) => {
    assert.match(url, /netraHastaUsers\/owner_A\/results\//);
    assert.equal(options.headers.Authorization, "Bearer a-token");
    return response(doc("owner_A"));
  });
  assert.equal(record.ownerUid, "owner_A");
  await assert.rejects(database.getHistory(ownerB, recordId, async () => response(doc("owner_A"))), (e) => e.status === 403);
}));
test("cross-user delete never targets another user's path and update is not supported", enabled(async () => {
  const calls = [];
  await assert.rejects(database.deleteHistory(ownerB, recordId, async (url, options) => {
    calls.push({ url, method: options.method ?? "GET" }); return response({}, 404);
  }), (e) => e.status === 404);
  assert.equal(calls.length, 1);
  assert.match(calls[0].url, /netraHastaUsers\/owner_B\/results\//);
  assert.equal(calls[0].method, "GET");
}));
test("create uses server UID/timestamp, immutable precondition and readback verification", enabled(async () => {
  let createdId;
  const record = await database.saveHistory(ownerA, input, async (url, options) => {
    if (url.endsWith(":commit")) {
      const write = JSON.parse(options.body).writes[0];
      assert.equal(write.update.fields.ownerUid.stringValue, "owner_A");
      assert.deepEqual(write.currentDocument, { exists: false });
      assert.deepEqual(write.updateTransforms, [{ fieldPath: "savedAt", setToServerValue: "REQUEST_TIME" }]);
      createdId = write.update.name.split("/").at(-1);
      return response({ commitTime: "2026-11-07T00:00:00Z" });
    }
    return response(doc("owner_A", createdId));
  });
  assert.equal(record.id, createdId);
}));
test("delete requires existing owned document then verifies its exact delete target", enabled(async () => {
  const calls = [];
  await database.deleteHistory(ownerA, recordId, async (url, options) => { calls.push([url, options.method ?? "GET"]); return options.method === "DELETE" ? response({}) : response(doc("owner_A")); });
  assert.equal(calls.length, 2); assert.equal(calls[1][1], "DELETE"); assert.equal(calls[0][0], calls[1][0]);
}));
test("database outage, permission denial, malformed record IDs and cursors fail closed", enabled(async () => {
  await assert.rejects(database.getHistory(ownerA, "../other"), (e) => e.status === 400);
  await assert.rejects(database.listHistory(ownerA, "x".repeat(2049)), (e) => e.status === 400);
  await assert.rejects(database.listHistory(ownerA, "", async () => response({}, 403)), (e) => e.status === 403);
  await assert.rejects(database.listHistory(ownerA, "", async () => { throw new Error("offline"); }), (e) => e.status === 503);
}));
test("CSRF guards reject foreign/missing origin and require bounded JSON bodies", async () => {
  assert.throws(() => http.requireSameOrigin(new Request("http://localhost:3026/api", { method: "POST", headers: { host: "localhost:3026", origin: "https://evil.example" } })), (e) => e.status === 403);
  assert.throws(() => http.requireSameOrigin(new Request("http://localhost:3026/api", { method: "POST", headers: { host: "localhost:3026" } })), (e) => e.status === 403);
  http.requireSameOrigin(new Request("http://localhost:3026/api", { method: "POST", headers: { host: "localhost:3026", origin: "http://localhost:3026" } }));
  await assert.rejects(http.readAccountJson(new Request("http://local", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: "x".repeat(5000) }) })), (e) => e.status === 413);
  await assert.rejects(http.readAccountJson(new Request("http://local", { method: "POST", headers: { "Content-Type": "text/plain" }, body: "{}" })), (e) => e.status === 415);
});
test("account endpoints, cookie settings and rules do not provide an alternate identity bypass", () => {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const session = fs.readFileSync(path.join(root, "app/api/netra-hasta/session/route.ts"), "utf8");
  assert.match(session, /verifyFirebaseIdentity/); assert.match(session, /httpOnly: true/); assert.match(session, /sameSite: "strict"/); assert.match(session, /secure: process.env.NODE_ENV === "production"/);
  const rules = fs.readFileSync(path.join(root, "firebase/netra-hasta.rules.fragment"), "utf8");
  assert.match(rules, /request.auth.uid == uid/); assert.match(rules, /allow update: if false/); assert.doesNotMatch(rules, /allow .*: if true/);
});

test("record decoder rejects extra payloads and foreign version metadata", enabled(async () => {
  const extraDoc = doc("owner_A"); extraDoc.fields.image = { stringValue: "not-allowed" };
  await assert.rejects(database.getHistory(ownerA, recordId, async () => response(extraDoc)), (e) => e.status === 400);
  const oldDoc = doc("owner_A"); oldDoc.fields.calendarVersion = { stringValue: "unknown-method" };
  await assert.rejects(database.getHistory(ownerA, recordId, async () => response(oldDoc)), (e) => e.status === 403);
}));
test("missing persisted readback cannot be reported as a successful save", enabled(async () => {
  await assert.rejects(database.saveHistory(ownerA, input, async (url) => url.endsWith(":commit") ? response({}) : response({}, 404)), (e) => e.code === "readback_failed");
}));

test("history preserves an unknown birth time and never substitutes midnight or noon", enabled(async () => {
  const unknown = { ...input, birthTime: "" };
  assert.equal(history.validateHistoryInput(unknown).birthTime, "");
  assert.equal(history.historyFields(unknown, ownerA.uid).birthTime, "");
  const stored = doc("owner_A");
  stored.fields.birthTime = { stringValue: "" };
  const record = await database.getHistory(ownerA, recordId, async () => response(stored));
  assert.equal(record.birthTime, "");
  assert.equal(record.wuku, "Sinta");
}));
