// Explicit local CDP test. No camera fixture or file is available in the product UI.
// --roi <local PNG> is an opt-in diagnostic input, never uploaded to an HTTP endpoint.
// --screenshots exports locally under ignored coverage; never runs in build.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { loadNetraModule } from "../tests/helpers/load-netra-typescript.mjs";
const quality = loadNetraModule("lib/netra-hasta/image-quality.ts");
const report = quality.evaluatePalmQuality({ handCount: 1, roiValid: true, palmLargeEnough: true, imageMetrics: { brightness: 140, contrast: 40, sharpness: 10, darkPixelRatio: 0, brightPixelRatio: 0 }, stability: { stable: true, sampleCount: 12, durationMs: 1000, centroidDeviation: 0, scaleDeviationRatio: 0 } });
const base = process.env.METEMU_LIVE_BASE_URL ?? "http://127.0.0.1:3027";
if (!/^http:\/\/(127\.0\.0\.1|localhost):\d+$/.test(base)) throw new Error("Only a local test application is allowed.");
const roiIndex = process.argv.indexOf("--roi");
const localPng = roiIndex >= 0 ? fs.readFileSync(process.argv[roiIndex + 1]).toString("base64") : null;
const label = roiIndex >= 0 ? path.basename(process.argv[roiIndex + 1]).replace(/[^a-zA-Z0-9-]/g, "-") : "synthetic";
const shots = process.argv.includes("--screenshots") ? path.resolve("coverage/rekha-web") : null;
if (shots) fs.mkdirSync(shots, { recursive: true });
const target = await (await fetch("http://127.0.0.1:9327/json/new?about:blank", { method: "PUT" })).json();
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve) => ws.addEventListener("open", resolve, { once: true }));
let id = 0; const pending = new Map(); const exceptions = []; let biometricUploads = 0;
ws.addEventListener("message", ({ data }) => {
  const m = JSON.parse(data);
  if (m.id) { const r = pending.get(m.id); pending.delete(m.id); if (m.error) r.reject(new Error(m.error.message)); else r.resolve(m.result); }
  if (m.method === "Runtime.exceptionThrown") exceptions.push(m.params.exceptionDetails.text);
  if (m.method === "Network.requestWillBeSent" && /data:image|candidateId|user_drawn|user_confirmed|points":/.test(m.params.request.postData ?? "")) biometricUploads++;
});
const send = (method, params = {}) => new Promise((resolve, reject) => { const n = ++id; pending.set(n, { resolve, reject }); ws.send(JSON.stringify({ id: n, method, params })); });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
async function evaluate(expression) {
  const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description ?? r.exceptionDetails.text);
  return r.result.value;
}
async function until(expression) { for (let n = 0; n < 300; n++) { if (await evaluate("Boolean(" + expression + ")")) return; await pause(100); } throw new Error("Browser timeout: " + expression); }
async function fill(id, value) { await evaluate("(()=>{const el=document.getElementById(" + JSON.stringify(id) + ");Object.getOwnPropertyDescriptor(el.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(el," + JSON.stringify(value) + ");el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));})()"); await pause(100); }
async function click(text) { await evaluate("Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()===" + JSON.stringify(text) + ").click()"); await pause(150); }
const provider = "(()=>{let el=document.querySelector('main');let f=el[Object.keys(el).find(k=>k.startsWith('__reactFiber'))];while(f.return)f=f.return;const find=n=>{const v=n.memoizedProps?.value;if(v?.state&&Object.hasOwn(v.state,'draft')&&typeof v.dispatch==='function')return v;for(let c=n.child;c;c=c.sibling){const v=find(c);if(v)return v;}return null;};return find(f.stateNode.current);})()";
async function layouts() {
  for (const width of [320, 390, 1440]) {
    await send("Emulation.setDeviceMetricsOverride", { width, height: 1000, deviceScaleFactor: 1, mobile: width < 600 }); await pause(150);
    assert(await evaluate("document.documentElement.scrollWidth<=innerWidth"), "Layout overflow at " + width);
    assert(await evaluate("(()=>{const c=document.querySelector('.netra-rekha-photo canvas'),s=document.querySelector('.netra-rekha-photo svg');const a=c.getBoundingClientRect(),b=s.getBoundingClientRect();return Math.abs(a.width-b.width)<.1&&Math.abs(a.height-b.height)<.1&&Math.abs(a.left-b.left)<.1&&Math.abs(a.top-b.top)<.1})()"), "Canvas/overlay alignment");
    if (shots) {
      const rect = await evaluate("(()=>{scrollTo(0,0);const r=document.querySelector('.netra-rekha-editor').getBoundingClientRect();return {x:r.left,y:r.top,width:r.width,height:r.height,scale:1}})()");
      const image = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true, clip: rect });
      fs.writeFileSync(path.join(shots, label + "-" + width + ".png"), Buffer.from(image.data, "base64"));
    }
  }
}
try {
  await send("Page.enable"); await send("Runtime.enable"); await send("Network.enable");
  await send("Network.setBlockedURLs", { urls: ["https://fonts.googleapis.com/*", "https://fonts.gstatic.com/*"] });
  await send("Page.navigate", { url: base + "/netra-hasta" }); await send("Page.bringToFront");
  await until('document.querySelector("#netra-birth-date") && Object.keys(document.querySelector("form")).some(k=>k.startsWith("__reactProps"))');
  await fill("netra-birth-date", "2005-07-27"); await click("Lanjut Pindai Telapak");
  await until('document.querySelector("[role=radio]")');
  // Inject a known capture into existing React hooks ONLY from this developer test.
  // The existing worker receives real image pixels and runs unchanged.
  const injection = "(async()=>{const png=" + JSON.stringify(localPng) + ";const canvas=document.createElement('canvas');let width=240,height=340;let context=canvas.getContext('2d');if(png){const bytes=Uint8Array.from(atob(png),c=>c.charCodeAt(0));const bitmap=await createImageBitmap(new Blob([bytes],{type:'image/png'}));width=bitmap.width;height=bitmap.height;canvas.width=width;canvas.height=height;context.drawImage(bitmap,0,0);bitmap.close();bytes.fill(0);}else{canvas.width=width;canvas.height=height;context.fillStyle='#c9c0ac';context.fillRect(0,0,width,height);context.strokeStyle='#524b40';context.lineWidth=5;for(let n=0;n<5;n++){context.beginPath();context.moveTo(30,40+n*52);context.bezierCurveTo(60,30+n*52,160,80+n*52,210,45+n*52);context.stroke();}}const pixels=context.getImageData(0,0,width,height);const original={width,height,data:new Uint8ClampedArray(pixels.data)};const capture={original,grayscale:{width,height,data:new Uint8ClampedArray(pixels.data)},enhanced:{width,height,data:new Uint8ClampedArray(pixels.data)},capturedAt:Date.now(),handedness:null,rotationDegrees:0,qualityMode:'normal',qualityWarnings:[]};canvas.width=0;canvas.height=0;let f=document.querySelector('main')[Object.keys(document.querySelector('main')).find(k=>k.startsWith('__reactFiber'))];while(f.return)f=f.return;const find=node=>{if(node.memoizedProps?.productMode===true&&node.memoizedProps?.onPalmSummaryChange)return node;for(let child=node.child;child;child=child.sibling){const found=find(child);if(found)return found;}return null;};const client=find(f);if(!client)throw new Error('Camera client not found');client.memoizedState.queue.dispatch(true);const artifacts={capture,capturedQualityMetrics:{..." + JSON.stringify(report) + ",capturedAt:capture.capturedAt}};client.memoizedState.next.next.queue.dispatch(artifacts);for(let h=client.memoizedState;h;h=h.next){if(h.memoizedState?.current?.capture===null&&'capturedQualityMetrics'in h.memoizedState.current)h.memoizedState.current=artifacts;}return {width,height};})()";
  const dimensions = await evaluate(injection);
  await until('document.querySelector("#rekha-editor-heading") && document.querySelector("#rekha-candidate").options.length>1 || document.body.innerText.includes("Detektor memilih abstain")');
  await until(provider + '.result !== null'.replace(".result", ".state.result"));
  const candidateCount = await evaluate('document.querySelector("#rekha-candidate").options.length-1');
  const before = await evaluate("JSON.stringify(" + provider + ".state.result.rekha.classes)");
  assert(!before.includes("user_drawn") && !before.includes("user_confirmed"));
  await layouts();
  console.log(JSON.stringify({ fixture: localPng ? "explicit-local-human-roi" : "synthetic-pixel-fixture", dimensions, automaticUnlabelledCandidates: candidateCount, semanticAutomaticClasses: 0 }));
  if (!localPng) {
    assert(candidateCount > 0, "Synthetic ridge fixture must produce real worker candidates");
    const value = await evaluate('document.querySelector("#rekha-candidate").options[1].value');
    await fill("rekha-candidate", value); await click("Konfirmasi segmen sebagai Heart");
    assert.equal(await evaluate(provider + ".state.result.rekha.classes[0].status"), "user_confirmed");
    await fill("rekha-class", "head"); await click("Konfirmasi segmen sebagai Head");
    assert(await evaluate('document.querySelector(".netra-rekha-controls [role=alert]").textContent.includes("sudah dipakai")'));
    await click("Belum dapat dipastikan"); assert.equal(await evaluate(provider + ".state.result.rekha.classes[1].status"), "uncertain");
    await fill("rekha-class", "fate"); await click("Tandai garis sendiri");
    await fill("rekha-x", "40"); await fill("rekha-y", "130"); await click("Tambah titik dari koordinat");
    await fill("rekha-x", "100"); await fill("rekha-y", "250"); await click("Tambah titik dari koordinat");
    await click("Gunakan penandaan Fate");
    assert.equal(await evaluate(provider + ".state.result.rekha.classes[3].status"), "user_drawn");
    assert.equal(await evaluate('Array.from(document.querySelectorAll(".netra-rekha-photo polyline")).filter(p=>p.getAttribute("stroke-dasharray")==="7 4").length'), 1);
    await layouts();
    await click("Hapus label Fate"); assert.equal(await evaluate(provider + ".state.result.rekha.classes[3].status"), "unsupported");
    await fill("rekha-class", "life"); await click("Tandai garis sendiri");
    // Real pointer input on a scaled SVG, not direct hook injection into the editor.
    await evaluate("document.querySelector('.netra-rekha-photo').scrollIntoView({block:'center'})");
    const bounds = await evaluate("(()=>{const r=document.querySelector('.netra-rekha-photo svg').getBoundingClientRect();return {x:r.x,y:r.y,w:r.width,h:r.height}})()");
    for (const [x, y] of [[.3, .3], [.6, .6]]) {
      await send("Input.dispatchMouseEvent", { type: "mousePressed", x: bounds.x + bounds.w * x, y: bounds.y + bounds.h * y, button: "left", clickCount: 1 });
      await send("Input.dispatchMouseEvent", { type: "mouseReleased", x: bounds.x + bounds.w * x, y: bounds.y + bounds.h * y, button: "left", clickCount: 1 });
    }
    await click("Gunakan penandaan Life");
    assert.equal(await evaluate(provider + ".state.result.rekha.classes[2].status"), "user_drawn");
    await evaluate("void(window.__rekhaCanvas=document.querySelector('.netra-rekha-photo canvas'))");
    await click("Ambil Ulang");
    await until('!document.querySelector("#rekha-editor-heading")');
    assert.equal(await evaluate("window.__rekhaCanvas.width+window.__rekhaCanvas.height"), 0);
    assert.equal(await evaluate(provider + ".state.result"), null);
    console.log("PASS confirm, duplicate prevention, uncertain, manual coordinates, pointer drawing, deletion, retake, and canvas cleanup");
  }
  await click("Ubah data / mulai ulang"); await until('document.querySelector("#netra-birth-date")');
  assert.equal(await evaluate('document.querySelector("#netra-birth-date").value'), "");
  assert.equal(biometricUploads, 0); assert.deepEqual(exceptions, []);
  console.log("PASS native ROI overlay alignment, 320/390/1440, reset, zero biometric HTTP uploads, zero rendering exceptions");
} finally { await send("Page.close").catch(() => {}); ws.close(); }
