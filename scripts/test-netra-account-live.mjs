// Explicit integration test. Creates only temporary synthetic accounts and optional records.
// No credentials or tokens are written to disk or printed. Never runs in npm build.
import assert from "node:assert/strict";
import { randomBytes, randomUUID } from "node:crypto";
import { loadNetraModule } from "../tests/helpers/load-netra-typescript.mjs";

if (process.env.METEMU_RUN_FIREBASE_LIVE_TESTS !== "1") throw new Error("Set METEMU_RUN_FIREBASE_LIVE_TESTS=1 for explicit live Firebase tests.");
const { firebaseConfig } = loadNetraModule("firebase/config.ts");
const history = loadNetraModule("lib/netra-hasta/history.ts");
const base = process.env.METEMU_LIVE_BASE_URL ?? "http://127.0.0.1:3027";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error("Only a local test application is allowed.");
const useDatabase = process.argv.includes("--database");
const useBrowser = process.argv.includes("--browser");
const accounts = [];
const records = [];
const checks = [];
const report = { project: firebaseConfig.projectId, syntheticAccountsOnly: true, databaseRequested: useDatabase, checks, cleanup: [], browser: null };
const sample = { birthDate: "2005-07-27", birthTime: "06:00", rekhaStatus: "uncertain", consentAccepted: true, consentVersion: history.HISTORY_CONSENT };
const db = "https://firestore.googleapis.com/v1/projects/" + firebaseConfig.projectId + "/databases/(default)/documents";
async function google(action, body) {
  const r = await fetch("https://identitytoolkit.googleapis.com/v1/accounts:" + action + "?key=" + firebaseConfig.apiKey, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(12000) });
  const data = await r.json();
  return { status: r.status, data };
}
async function api(path, { cookie = "", method = "GET", body, origin = base } = {}) {
  const headers = { Origin: origin };
  if (cookie) headers.Cookie = cookie;
  if (body !== undefined) headers["Content-Type"] = "application/json";
  return fetch(base + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), redirect: "manual", signal: AbortSignal.timeout(20000) });
}
async function firestore(account, suffix, method = "GET", body) {
  return fetch(db + suffix, { method, headers: { Authorization: "Bearer " + account.idToken, "Content-Type": "application/json" }, body: body ? JSON.stringify(body) : undefined, signal: AbortSignal.timeout(15000) });
}
function check(name) { checks.push(name); console.log("PASS " + name); }
async function browserTest(account) {
  const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const target = await (await fetch("http://127.0.0.1:9327/json/new?about:blank", { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { ws.addEventListener("open", resolve, { once: true }); ws.addEventListener("error", reject, { once: true }); });
  let id = 0; const pending = new Map(); const exceptions = []; let imageUploads = 0; let credentialLeaks = 0; let birthLeaks = 0;
  ws.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) { const request = pending.get(message.id); pending.delete(message.id); if (message.error) request.reject(new Error(message.error.message)); else request.resolve(message.result); }
    if (message.method === "Runtime.exceptionThrown") exceptions.push(message.params.exceptionDetails.text);
    if (message.method === "Network.requestWillBeSent") {
      const request = message.params.request;
      const body = request.postData ?? "";
      if (/data:image|roi_pixel_sha256|landmarks/.test(body)) imageUploads++;
      if (body.includes(account.password) && !request.url.startsWith("https://identitytoolkit.googleapis.com/")) credentialLeaks++;
      if ((body.includes("2005-07-27") || body.includes("06:00")) && !request.url.startsWith(base + "/api/netra-hasta/history")) birthLeaks++;
    }
  });
  const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); });
  async function evaluate(expression) {
    const data = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (data.exceptionDetails) throw new Error("Browser evaluation failed: " + data.exceptionDetails.text);
    return data.result.value;
  }
  async function until(expression) { for (let n = 0; n < 300; n++) { if (await evaluate("Boolean(" + expression + ")")) return; await pause(100); } throw new Error("Browser timeout (no credentials logged)."); }
  async function fill(id, value) { await evaluate("(()=>{const el=document.getElementById(" + JSON.stringify(id) + ");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el," + JSON.stringify(value) + ");el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()"); await pause(100); }
  try {
    await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
    await send("Network.setBlockedURLs", { urls: ["https://fonts.googleapis.com/*", "https://fonts.gstatic.com/*"] });
    await send("Page.navigate", { url: base + "/netra-hasta" }); await send("Page.bringToFront");
    await until('document.querySelector("form") && Object.keys(document.querySelector("form")).some(k=>k.startsWith("__reactProps"))');
    await fill("netra-birth-date", "2005-07-27"); await fill("netra-birth-time", "06:00");
    await evaluate('document.querySelector("button[type=submit]").click()');
    await until('document.body.innerText.includes("Setuju & Aktifkan Kamera")');
    // Synthetic metadata fixture exercises login handoff only. No camera inference is claimed.
    await evaluate("(()=>{const el=document.querySelector('main');let f=el[Object.keys(el).find(k=>k.startsWith('__reactFiber'))];while(f){const v=f.memoizedProps?.value;if(v?.state?.birth&&typeof v.dispatch==='function'){v.dispatch({type:'capture',snapshot:{captureId:111,width:241,height:338,qualityMode:'normal',qualityWarnings:[],phase:'ready',candidateStatus:'uncertain',candidateCount:0,reason:'Synthetic integration fixture'}});return;}f=f.return;}throw new Error('Product context not found');})()");
    await until('document.querySelector("#netra-basic-heading")');
    await evaluate('document.querySelector("a[href=\\"/netra-hasta/detail\\"]").click()');
    await until('location.pathname==="/netra-hasta/akses-detail" && document.querySelector("#netra-email") && !document.querySelector("button[type=submit]").disabled');
    await fill("netra-email", account.email); await fill("netra-password", "wrong-password-for-live-test");
    await evaluate('document.querySelector("button[type=submit]").click()');
    await until('document.querySelector("[role=alert]") && !document.querySelector("button[type=submit]").disabled');
    check("browser_login_failure");
    await fill("netra-password", account.password);
    await evaluate('document.querySelector("button[type=submit]").click()');
    await until('location.pathname==="/netra-hasta/detail" && document.body.innerText.includes("Wuku Sinta")');
    assert.equal(await evaluate('document.cookie.includes("metemu_netra_session")'), false);
    assert.equal(await evaluate('Object.keys(localStorage).concat(Object.keys(sessionStorage)).some(k=>k.startsWith("firebase:authUser"))'), false);
    check("browser_login_success_httpOnly_cookie_and_synthetic_result_handoff");
    assert.equal(await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent==="Simpan hasil").disabled'), true);
    check("browser_save_requires_explicit_consent");
    const widths = [];
    for (const width of [320, 390, 1440]) {
      await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width !== 1440 }); await pause(150);
      const size = await evaluate("({width:innerWidth,scroll:document.documentElement.scrollWidth})");
      assert(size.scroll <= size.width, "Detail layout overflow"); widths.push(size);
    }
    if (useDatabase) {
      await evaluate('document.querySelector("input[type=checkbox]").click()');
      await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent==="Simpan hasil").click()');
      await until('document.querySelector("a").parentElement && document.body.innerText.includes("Tersimpan")');
      const href = await evaluate('Array.from(document.querySelectorAll("a")).find(a=>a.textContent==="Buka hasil tersimpan").getAttribute("href")');
      const browserRecordId = href.split("/").at(-1); records.push({ account, id: browserRecordId });
      await evaluate('Array.from(document.querySelectorAll("a")).find(a=>a.textContent==="Buka hasil tersimpan").click()');
      await until('location.pathname.includes("/riwayat/") && document.body.innerText.includes("Wuku Sinta")');
      await evaluate('Array.from(document.querySelectorAll("a")).find(a=>a.textContent.includes("Kembali ke riwayat")).click()');
      await until('document.querySelector("article")');
      await evaluate('document.querySelector("article button").click()');
      await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent==="Ya, hapus").click()');
      await until('!document.querySelector("article")');
      check("browser_consent_save_reopen_delete_real_database");
    } else {
      await send("Page.navigate", { url: base + "/netra-hasta/detail" });
      await until('document.body.innerText.includes("Hasil sementara belum tersedia")');
      check("browser_reload_requires_rescan_message");
      await send("Page.navigate", { url: base + "/netra-hasta/riwayat" });
      await until('document.body.innerText.includes("Keluar akun")');
    }
    await until('Array.from(document.querySelectorAll("button")).some(b=>b.textContent==="Keluar akun" && Object.keys(b).some(k=>k.startsWith("__reactProps")))');
    await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent==="Keluar akun").click()');
    await until('location.pathname==="/netra-hasta/akses-detail" && document.querySelector("#netra-email")');
    check("browser_logout");
    await send("Page.navigate", { url: base + "/netra-hasta" });
    await until('document.querySelector("#netra-birth-date") && Object.keys(document.querySelector("form")).some(k=>k.startsWith("__reactProps"))');
    await fill("netra-birth-date", "2005-07-27"); await fill("netra-birth-time", "06:00"); await evaluate('document.querySelector("button[type=submit]").click()');
    await until('document.body.innerText.includes("Setuju & Aktifkan Kamera")');
    const devices = await evaluate("(async()=>{try{return(await navigator.mediaDevices.enumerateDevices()).filter(d=>d.kind==='videoinput').length}catch{return 0}})()");
    await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent.includes("Setuju & Aktifkan Kamera")).click()');
    await until('document.body.innerText.includes("Kamera tidak dapat digunakan") || document.body.innerText.includes("Kamera aktif")');
    const cameraActive = await evaluate('document.body.innerText.includes("Kamera aktif")');
    await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent.includes("Ubah data / mulai ulang")).click()');
    assert.equal(imageUploads, 0, "Unexpected biometric payload");
    assert.equal(credentialLeaks, 0, "Unexpected credential destination");
    assert.equal(birthLeaks, 0, "Birth input sent without consent-save endpoint");
    return { syntheticMetadataFixture: true, resultHandoff: true, httpOnly: true, widths, imageUploads, credentialLeaks, birthLeaks, videoDevices: devices, cameraActive, physicalCaptureVerified: false, runtimeExceptions: exceptions };
  } finally { await send("Page.close").catch(() => {}); ws.close(); }
}
try {
  const readiness = await api("/api/netra-hasta/auth-config"); assert.equal(readiness.status, 200);
  const config = await readiness.json(); assert.equal(config.configured, true, "Firebase configuration must be available");
  for (const suffix of ["a", "b"]) {
    const email = "metemu-r7-" + randomUUID() + "-" + suffix + "@example.invalid";
    const password = randomBytes(24).toString("base64url");
    const created = await google("signUp", { email, password, returnSecureToken: true });
    assert.equal(created.status, 200, "Synthetic signup must succeed; check Email/Password configuration");
    accounts.push({ email, password, uid: created.data.localId, idToken: created.data.idToken });
  }
  check("firebase_two_temporary_accounts_created");
  const [a, b] = accounts;
  const failedLogin = await google("signInWithPassword", { email: a.email, password: "wrong-password-only", returnSecureToken: true });
  assert.equal(failedLogin.status, 400); check("firebase_wrong_password_rejected");
  const signed = await google("signInWithPassword", { email: a.email, password: a.password, returnSecureToken: true });
  assert.equal(signed.status, 200); a.idToken = signed.data.idToken; check("firebase_password_login_success");
  const noLogin = await api("/netra-hasta/detail"); assert.equal(noLogin.status, 307);
  const forged = await api("/api/netra-hasta/session", { method: "POST", body: { idToken: "not-a-firebase-token" } }); assert.equal(forged.status, 401);
  check("unauthenticated_detail_and_forged_token_denied");
  const forgedParts = a.idToken.split("."); forgedParts[2] = Buffer.from("forged-signature").toString("base64url");
  assert.equal((await api("/api/netra-hasta/session", { method: "POST", body: { idToken: forgedParts.join(".") } })).status, 401);
  check("forged_signature_with_valid_claims_rejected_by_firebase");
  for (const account of accounts) {
    const response = await api("/api/netra-hasta/session", { method: "POST", body: { idToken: account.idToken } });
    assert.equal(response.status, 200, "Server Firebase token verification must succeed");
    assert.equal((await response.json()).uid, account.uid);
    const setCookie = response.headers.get("set-cookie");
    assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /SameSite=strict/i);
    account.cookie = setCookie.split(";")[0];
    assert.equal((await api("/netra-hasta/detail", { cookie: account.cookie })).status, 200);
  }
  check("real_token_verified_by_server_and_detail_access_200");
  const crossOrigin = await api("/api/netra-hasta/session", { method: "DELETE", cookie: a.cookie, origin: "https://evil.example" }); assert.equal(crossOrigin.status, 403); check("csrf_origin_rejected");
  if (useDatabase) {
    const directId = randomUUID();
    const name = "projects/" + firebaseConfig.projectId + "/databases/(default)/documents/netraHastaUsers/" + a.uid + "/results/" + directId;
    const fields = Object.fromEntries(Object.entries(history.historyFields(sample, a.uid)).map(([key, value]) => [key, { stringValue: value }]));
    const create = await firestore(a, ":commit", "POST", { writes: [{ update: { name, fields }, currentDocument: { exists: false }, updateTransforms: [{ fieldPath: "savedAt", setToServerValue: "REQUEST_TIME" }] }] });
    if (create.status === 200) records.push({ account: a, id: directId });
    assert.equal(create.status, 200, "Owner database create must succeed after rules publication");
    for (const [label, method] of [["read", "GET"], ["update", "PATCH"], ["delete", "DELETE"]]) {
      const r = await firestore(b, "/netraHastaUsers/" + a.uid + "/results/" + directId, method, method === "PATCH" ? { fields } : undefined);
      assert.equal(r.status, 403, "Cross-user " + label + " must be denied");
    }
    const anonymous = await fetch(db + "/netraHastaUsers/" + a.uid + "/results/" + directId); assert.equal(anonymous.status, 403);
    const ownUpdate = await firestore(a, "/netraHastaUsers/" + a.uid + "/results/" + directId, "PATCH", { fields }); assert.equal(ownUpdate.status, 403);
    check("live_firestore_owner_create_and_cross_user_read_update_delete_denied");
    await firestore(a, "/netraHastaUsers/" + a.uid + "/results/" + directId, "DELETE");
    if (!config.historyEnabled) throw new Error("Rules verified; local history flags still disabled. Enable only this tested project and rerun API CRUD.");
    const savedResponse = await api("/api/netra-hasta/history", { method: "POST", cookie: a.cookie, body: sample });
    assert.equal(savedResponse.status, 201, "API save with consent must succeed");
    const saved = (await savedResponse.json()).record; records.push({ account: a, id: saved.id });
    assert.equal(saved.ownerUid, a.uid); assert.equal(saved.wuku, "Sinta");
    const own = await api("/api/netra-hasta/history/" + saved.id, { cookie: a.cookie }); assert.equal(own.status, 200);
    const foreign = await api("/api/netra-hasta/history/" + saved.id, { cookie: b.cookie }); assert.equal(foreign.status, 404);
    const foreignDelete = await api("/api/netra-hasta/history/" + saved.id, { method: "DELETE", cookie: b.cookie }); assert.equal(foreignDelete.status, 404);
    const invalid = await api("/api/netra-hasta/history", { method: "POST", cookie: a.cookie, body: { ...sample, ownerUid: b.uid } }); assert.equal(invalid.status, 400);
    const noConsent = await api("/api/netra-hasta/history", { method: "POST", cookie: a.cookie, body: { ...sample, consentAccepted: false } }); assert.equal(noConsent.status, 400);
    const deleted = await api("/api/netra-hasta/history/" + saved.id, { method: "DELETE", cookie: a.cookie }); assert.equal(deleted.status, 200);
    const gone = await api("/api/netra-hasta/history/" + saved.id, { cookie: a.cookie }); assert.equal(gone.status, 404);
    check("live_api_save_read_owner_isolation_validation_and_delete");
  } else {
    assert.equal((await api("/api/netra-hasta/history", { cookie: a.cookie })).status, 503);
    check("history_stays_disabled_until_rules_reviewed");
  }
  if (useBrowser) report.browser = await browserTest(a);
  const logout = await api("/api/netra-hasta/session", { method: "DELETE", cookie: a.cookie }); assert.equal(logout.status, 200);
  assert.match(logout.headers.get("set-cookie"), /Max-Age=0/);
  assert.equal((await api("/api/netra-hasta/session")).status, 401);
  check("logout_clears_httpOnly_cookie");
} catch (error) {
  report.failure = error.message;
  process.exitCode = 1;
} finally {
  for (const record of records) {
    try { const suffix = "/netraHastaUsers/" + record.account.uid + "/results/" + record.id; const existing = await firestore(record.account, suffix); if (existing.status !== 404) { if (existing.status !== 200) throw new Error("cleanup read denied"); const r = await firestore(record.account, suffix, "DELETE"); if (![200, 204, 404].includes(r.status)) throw new Error("delete denied"); } }
    catch { report.cleanup.push({ type: "record", id: record.id, status: "manual_cleanup_required" }); process.exitCode = 1; }
  }
  for (const account of accounts) {
    try { const r = await google("delete", { idToken: account.idToken }); if (r.status !== 200) throw new Error("delete denied"); report.cleanup.push({ type: "synthetic_account", status: "deleted" }); }
    catch { report.cleanup.push({ type: "synthetic_account", uid: account.uid, status: "manual_cleanup_required" }); process.exitCode = 1; }
  }
  console.log(JSON.stringify(report, null, 2));
}
