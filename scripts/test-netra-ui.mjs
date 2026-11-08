// Explicit local browser checks. Requires an isolated Chrome CDP on port 9327.
// Screenshots contain only empty UI / synthetic metadata, never webcam frames.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { syntheticPalmCaptureExpression } from "./helpers/netra-single-flow-fixture.mjs";

const base = process.env.METEMU_LIVE_BASE_URL ?? "http://127.0.0.1:3027";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error("Only a local test application is allowed.");
const shots = process.argv.includes("--screenshots") ? path.resolve("coverage/n8/after") : null;
if (shots) fs.mkdirSync(shots, { recursive: true });
const target = await (await fetch("http://127.0.0.1:9327/json/new?about:blank", { method: "PUT" })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => { ws.addEventListener("open", resolve, { once: true }); ws.addEventListener("error", reject, { once: true }); });
let id = 0;
const pending = new Map();
const exceptions = [];
let imageUploads = 0;
ws.addEventListener("message", ({ data }) => {
  const m = JSON.parse(data);
  if (m.id) { const request = pending.get(m.id); pending.delete(m.id); if (m.error) request.reject(new Error(m.error.message)); else request.resolve(m.result); }
  if (m.method === "Runtime.exceptionThrown") exceptions.push(m.params.exceptionDetails.text);
  if (m.method === "Network.requestWillBeSent" && /data:image|roi_pixel_sha256|landmarks/.test(m.params.request.postData ?? "")) imageUploads++;
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function evaluate(expression) {
  const value = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (value.exceptionDetails) throw new Error(value.exceptionDetails.text);
  return value.result.value;
}
async function until(expression) {
  for (let n = 0; n < 300; n++) { if (await evaluate("Boolean(" + expression + ")")) return; await pause(100); }
  throw new Error("UI condition timed out: " + expression);
}
async function fill(id, value) {
  await evaluate("(()=>{const el=document.getElementById(" + JSON.stringify(id) + ");Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(el," + JSON.stringify(value) + ");el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()");
  await pause(100);
}
async function key(key, code, text) {
  await send("Input.dispatchKeyEvent", { type: "keyDown", key, code, ...(text ? { text, unmodifiedText: text } : {}) });
  await send("Input.dispatchKeyEvent", { type: "keyUp", key, code });
  await pause(150);
}
async function layouts(name) {
  for (const width of [320, 390, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 });
    await pause(150);
    const dimensions = await evaluate("({width:innerWidth,scroll:document.documentElement.scrollWidth})");
    assert(dimensions.scroll <= dimensions.width, name + " overflow at " + width);
    if (shots) {
      await evaluate("scrollTo(0,0)");
      const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
      fs.writeFileSync(path.join(shots, name + "-" + width + ".png"), Buffer.from(shot.data, "base64"));
    }
  }
}
const checks = [];
function check(name) { checks.push(name); console.log("PASS " + name); }
try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  // External icon fonts are deliberately unavailable. New Netra controls use local SVG.
  await send("Network.setBlockedURLs", { urls: ["https://fonts.googleapis.com/*", "https://fonts.gstatic.com/*", "https://firestore.googleapis.com/*"] });
  await send("Page.navigate", { url: base + "/netra-hasta" }); await send("Page.bringToFront");
  await until('document.querySelector("#netra-birth-date") && Object.keys(document.querySelector("form")).some(k=>k.startsWith("__reactProps"))');
  await layouts("start");
  check("public_start_no_overflow_320_390_1440");
  assert.equal(await evaluate('document.querySelector("video") === null'), true);
  await evaluate('document.querySelector("button[type=submit]").focus()');
  await key("Enter", "Enter", "\r");
  await until('document.querySelector("#netra-date-error")');
  assert.equal(await evaluate('document.querySelector("#netra-birth-date").getAttribute("aria-invalid")'), "true");
  check("keyboard_submit_invalid_date_inline_accessible_error");
  await fill("netra-birth-date", "2005-07-27");
  await evaluate('document.querySelector("button[type=submit]").focus()');
  await key("Enter", "Enter", "\r");
  await until('document.querySelector("#netra-scan-heading")');
  assert.equal(await evaluate('document.querySelector("video") === null'), true);
  check("optional_birth_time_and_camera_requires_explicit_consent");
  await layouts("consent");
  assert.equal(await evaluate('document.querySelector("[role=radio]") === null && document.querySelector("[role=radiogroup]") === null'), true);
  check("product_mode_picker_not_in_dom_or_keyboard_path");
  // Synthetic pixels exercise the real worker/UI; this is not a physical hand inference test.
  await evaluate(syntheticPalmCaptureExpression("manual-override"));
  await until('document.querySelector("#netra-capture-results-heading") && document.querySelector(".netra-detail")');
  assert.equal(await evaluate('document.getElementById("netra-preview-disclosure").open'), false);
  await evaluate('document.querySelector("#netra-preview-disclosure summary").click()');
  await layouts("basic");
  assert.equal(await evaluate('document.body.innerText.includes("Ramalan Otonan lengkap") && document.body.innerText.includes("Hasil diambil melalui manual override") && document.body.innerText.includes("Mencari Jodoh")'), true);
  assert.equal(await evaluate('document.querySelector(".netra-range")===null && document.getElementById("rekha-editor-heading")===null && Boolean(document.querySelector(".netra-locked-placeholder"))'), true);
  check("public_calendar_manual_warning_and_protected_detail_placeholder");
  await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent==="Ubah data / mulai ulang").focus()');
  await key(" ", "Space", " ");
  await until('document.querySelector("#netra-birth-date")');
  assert.equal(await evaluate('document.querySelector("#netra-birth-date").value + document.querySelector("#netra-birth-time").value'), "");
  check("keyboard_space_reset_clears_birth_and_result");
  await send("Page.navigate", { url: base + "/netra-hasta/akses-detail" });
  await until('document.querySelector("#netra-email") && !document.querySelector("button[type=submit]").disabled');
  await layouts("login");
  await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent.includes("Belum punya akun?")).focus()');
  await key("Enter", "Enter", "\r");
  assert.equal(await evaluate('document.querySelector("#netra-password").autocomplete'), "new-password");
  await evaluate('Array.from(document.querySelectorAll("button")).find(b=>b.textContent.includes("Sudah punya akun?")).focus()');
  await key(" ", "Space", " ");
  assert.equal(await evaluate('document.querySelector("#netra-password").autocomplete'), "current-password");
  check("login_register_keyboard_switch_without_new_auth_logic");
  await send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
  assert.equal(await evaluate('matchMedia("(prefers-reduced-motion: reduce)").matches'), true);
  assert.equal(await evaluate('getComputedStyle(document.querySelector("button")).transitionDuration'), "0s");
  check("reduced_motion_respected");
  assert.equal(imageUploads, 0); assert.deepEqual(exceptions, []);
  check("zero_image_uploads_and_render_exceptions");
  console.log(JSON.stringify({ checks: checks.length, widths: [320, 390, 1440], imageUploads, runtimeExceptions: exceptions, physicalCaptureVerified: false }, null, 2));
} finally { await send("Page.close").catch(() => {}); ws.close(); }
