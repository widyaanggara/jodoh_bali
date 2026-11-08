// Local-only Auth/Firestore Emulator test; no production credentials, records or human images.
import { switchAwayAndReturn } from "./helpers/netra-tab-switch.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import { syntheticPalmCaptureExpression } from "./helpers/netra-single-flow-fixture.mjs";
const base=process.env.METEMU_LIVE_BASE_URL??"http://127.0.0.1:3039",auth="http://127.0.0.1:9097",db="http://127.0.0.1:8189/v1/projects/daily-logs-a1442/databases/(default)/documents";
if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))throw Error("Local test only");
let shortExpiry=false;
fs.mkdirSync("coverage/netra-detail-gate",{recursive:true});
const checks=[],accounts=[],errors=[],detailRequests=[];let savedId=null;
async function account(action,body){const r=await fetch(auth+"/identitytoolkit.googleapis.com/v1/accounts:"+action+"?key=emulator",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});assert.equal(r.status,200);return r.json();}
const password=crypto.randomUUID(),email="inline-"+crypto.randomUUID()+"@example.invalid";
accounts.push(await account("signUp",{email,password,returnSecureToken:true}));accounts.push(await account("signUp",{email:"other-"+crypto.randomUUID()+"@example.invalid",password:crypto.randomUUID(),returnSecureToken:true}));
async function api(path,token,method="GET",body){return fetch(base+path,{method,redirect:"manual",headers:{Origin:base,...(token?{Cookie:"metemu_netra_session="+token}:{}),...(body?{"Content-Type":"application/json"}:{})},...(body?{body:JSON.stringify(body)}:{})});}
const target=await(await fetch("http://127.0.0.1:9327/json/new?about:blank",{method:"PUT"})).json(),ws=new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r=>ws.addEventListener("open",r,{once:true}));let seq=0;const pending=new Map();
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}));});
ws.addEventListener("message",({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);}if(m.method==="Network.requestWillBeSent" && m.params.request.url.endsWith("/api/netra-hasta/detail")) detailRequests.push(m.params.request.postData);if(m.method==="Runtime.exceptionThrown")errors.push(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text);if(m.method==="Fetch.requestPaused")void(async()=>{const request=m.params.request,u=new URL(request.url);if(u.pathname==="/api/netra-hasta/detail" && m.params.responseStatusCode){
if(shortExpiry && m.params.responseStatusCode===200){const raw=await send("Fetch.getResponseBody",{requestId:m.params.requestId});const value=JSON.parse(raw.base64Encoded?Buffer.from(raw.body,"base64").toString():raw.body);value.expiresAt=Math.floor(Date.now()/1000)+2;shortExpiry=false;await send("Fetch.fulfillRequest",{requestId:m.params.requestId,responseCode:200,responseHeaders:[{name:"Content-Type",value:"application/json"},{name:"Cache-Control",value:"private, no-store"}],body:Buffer.from(JSON.stringify(value)).toString("base64")});}
else await send("Fetch.continueRequest",{requestId:m.params.requestId});
return;
}if(["identitytoolkit.googleapis.com","securetoken.googleapis.com"].includes(u.hostname)){const response=await fetch(auth+"/"+u.hostname+u.pathname+u.search,{method:request.method,headers:{"Content-Type":request.headers["Content-Type"]??request.headers["content-type"]??"application/json"},...(request.postData?{body:request.postData}:{})});console.log(JSON.stringify({emulatorAuthPath:u.pathname,http:response.status}));await send("Fetch.fulfillRequest",{requestId:m.params.requestId,responseCode:response.status,responseHeaders:[{name:"Content-Type",value:"application/json"},{name:"Access-Control-Allow-Origin",value:"*"},{name:"Access-Control-Allow-Headers",value:"*"},{name:"Access-Control-Allow-Methods",value:"GET, POST, OPTIONS"}],body:Buffer.from(await response.text()).toString("base64")});}else await send("Fetch.failRequest",{requestId:m.params.requestId,errorReason:"BlockedByClient"});})();});
async function evaluate(expression){const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function until(expression){for(let n=0;n<300;n++){if(await evaluate("Boolean("+expression+")"))return;await pause(100);}console.error(JSON.stringify(await evaluate('({alerts:Array.from(document.querySelectorAll("[role=alert]")).map(e=>e.textContent),savePresent:!!document.querySelector(".netra-save"),loginPresent:!!document.getElementById("netra-email"),pathname:location.pathname})')));throw Error("Timeout "+expression);}
async function fill(id,value){await evaluate("(()=>{const e=document.getElementById("+JSON.stringify(id)+");Object.getOwnPropertyDescriptor(e.tagName==='SELECT'?HTMLSelectElement.prototype:HTMLInputElement.prototype,'value').set.call(e,"+JSON.stringify(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()");await pause(100);}
async function click(text){await evaluate("Array.from(document.querySelectorAll('button')).find(b=>b.textContent.trim()==="+JSON.stringify(text)+").click()");await pause(100);}
function pass(name){checks.push(name);console.log("PASS "+name);}
try{
assert.equal((await api("/api/netra-hasta/history")).status,401);
const detailBody={birthDate:"2005-07-27",birthTime:"",matchStartYear:2000,matchEndYear:2005};
for(const token of [null,"forged-client-token"])assert.equal((await api("/api/netra-hasta/detail",token,"POST",detailBody)).status,401);
pass("anonymous/forged direct detail API and anonymous history denied");
await send("Page.enable");await send("Runtime.enable");await send("Network.enable");await send("Fetch.enable",{patterns:[{urlPattern:"https://*"},{urlPattern:"*/api/netra-hasta/detail",requestStage:"Response"}]});await send("Page.navigate",{url:base+"/netra-hasta"});await send("Page.bringToFront");
await until('document.getElementById("netra-birth-date") && Object.keys(document.querySelector("form")).some(k=>k.startsWith("__reactProps"))');await fill("netra-birth-date","2005-07-27");await click("Lanjut Pindai Telapak");await until('document.getElementById("netra-scan-heading")');await evaluate(syntheticPalmCaptureExpression("normal"));await until('document.getElementById("netra-email") && !document.querySelector(".netra-login button[type=submit]").disabled');
assert.equal(await evaluate('document.body.innerText.includes("Ramalan Otonan lengkap") && document.body.innerText.includes("Mencari Jodoh")'),true);assert.equal(await evaluate('document.querySelector(".netra-range")===null && document.getElementById("rekha-editor-heading")===null && document.querySelector(".netra-match-card")===null'),true);
assert.equal(detailRequests.length,0);
await evaluate('document.querySelector(".netra-locked-placeholder").style.filter="none"');
assert.equal(await evaluate('document.querySelector(".netra-locked-placeholder").querySelectorAll("input,canvas,svg,button").length'),0);
await evaluate('document.querySelector(".netra-locked-placeholder").style.filter=""');
pass("anonymous sees actual Otonan, only decorative placeholders without protected calculation/request");
for(const width of [320,390,1440]){
 await send("Emulation.setDeviceMetricsOverride",{width,height:1000,deviceScaleFactor:1,mobile:width<600});
 assert(await evaluate("document.documentElement.scrollWidth<=innerWidth"));
 if(width===390){await evaluate('document.getElementById("netra-locked-detail").scrollIntoView({behavior:"instant",block:"start"})');const shot=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});fs.writeFileSync("coverage/netra-detail-gate/locked-390.png",Buffer.from(shot.data,"base64"));}
}
await evaluate('document.querySelector("#netra-preview-disclosure summary").click()');
assert.equal(await evaluate('document.querySelector(".netra-rekha-editor")===null && document.querySelector(".netra-line-result")===null'),true);
await evaluate('document.querySelector("#netra-preview-disclosure summary").click()');
pass("blur removal and expanded public preview cannot reveal actual partner/Rekha results; responsive layouts pass");
await fill("netra-email",email);await fill("netra-password",password);await click("Masuk dan lanjutkan");await until('document.querySelector(".netra-save input[type=checkbox]") && !document.querySelector(".netra-save input[type=checkbox]").disabled');
assert.equal(await evaluate('location.pathname'),"/netra-hasta");assert.equal(await evaluate('Boolean(document.querySelector(".netra-preview") && document.getElementById("rekha-editor-heading"))'),true);assert(await evaluate('Boolean(document.querySelector(".netra-range") && !document.querySelector(".netra-locked-placeholder"))'));
assert.equal(await evaluate('document.getElementById("netra-preview-disclosure").open'),false);
for(const payload of detailRequests){const value=JSON.parse(payload);assert.deepEqual(Object.keys(value).sort(),["birthDate","birthTime","matchStartYear","matchEndYear"].sort());}
pass("real Firebase Emulator login plus server session unlocks protected detail without losing capture");
await evaluate('document.querySelector("#netra-preview-disclosure summary").click()');
await until('document.getElementById("rekha-candidate")?.options.length>1');
const segment=await evaluate('document.getElementById("rekha-candidate").options[1].value');
await fill("rekha-candidate",segment);await click("Konfirmasi segmen sebagai Heart");
assert(await evaluate('document.body.innerText.includes("Dikonfirmasi pengguna") || document.body.innerText.includes("dikonfirmasi pengguna")'));
pass("actual baseline worker candidates remain available for explicit manual confirmation after verified login");
const confirmedBefore=await evaluate('JSON.stringify(Array.from(document.querySelectorAll(".netra-rekha-status")).map(e=>e.textContent))');
const roiBefore=await evaluate('Array.from(document.querySelector(".netra-rekha-photo canvas").getContext("2d").getImageData(0,0,240,340).data).reduce((a,b)=>a+b,0)');
await switchAwayAndReturn({send,evaluate,until});
assert(await evaluate('Boolean(document.querySelector(".netra-range") && document.getElementById("rekha-editor-heading"))'));
assert.equal(await evaluate('JSON.stringify(Array.from(document.querySelectorAll(".netra-rekha-status")).map(e=>e.textContent))'),confirmedBefore);
assert.equal(await evaluate('Array.from(document.querySelector(".netra-rekha-photo canvas").getContext("2d").getImageData(0,0,240,340).data).reduce((a,b)=>a+b,0)'),roiBefore);
pass("real tab switch retains verified details, manual Heart confirmation and original ROI pixels");
for(const width of [320,390,1440]){
 await send("Emulation.setDeviceMetricsOverride",{width,height:1000,deviceScaleFactor:1,mobile:width<600});
 assert(await evaluate("document.documentElement.scrollWidth<=innerWidth"));
 if(width===390){await evaluate('document.getElementById("netra-locked-detail").scrollIntoView({behavior:"instant",block:"start"})');const shot=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});fs.writeFileSync("coverage/netra-detail-gate/unlocked-390.png",Buffer.from(shot.data,"base64"));}
}
pass("verified results and manual overlay remain responsive at 320/390/1440");
await until('!document.body.innerText.includes("Mencari kandidat lipatan di perangkat ini")');await evaluate('document.querySelector(".netra-save input[type=checkbox]").click()');await click("Simpan hasil");await until('document.querySelector(".netra-save").innerText.includes("Tersimpan")');
savedId=await evaluate('document.querySelector(".netra-save a").getAttribute("href").split("/").at(-1)');
const cookies=(await send("Network.getCookies",{urls:[base]})).cookies,session=cookies.find(c=>c.name==="metemu_netra_session");assert(session?.httpOnly);assert(session.secure);const token=session.value;
const list=await api("/api/netra-hasta/history",token);assert.equal(list.status,200);const rows=(await list.json()).records;assert.equal(rows.length,1);assert.equal(rows[0].id,savedId);assert.equal(rows[0].schemaVersion,"netra-history-v2");assert.equal(JSON.parse(rows[0].detailSnapshot).matches.top.length,3);assert.doesNotMatch(JSON.stringify(rows[0]),/pixels|landmarks|points|fingerprint|data:image/);pass("explicit save/list stores actual v2 calendar/Top3 snapshot without biometrics");
assert.equal((await api("/netra-hasta/riwayat/"+savedId,token)).status,200);assert.equal((await api("/api/netra-hasta/history/"+savedId,token)).status,200);pass("owner can reopen existing saved-result API/page");
const other=accounts[1].idToken;assert.equal((await api("/api/netra-hasta/history/"+savedId,other)).status,404);assert.equal((await api("/api/netra-hasta/history/"+savedId,other,"DELETE")).status,404);
for(const t of [null,other])assert.equal((await fetch(db+"/netraHastaUsers/"+accounts[0].localId+"/results/"+savedId,{headers:t?{Authorization:"Bearer "+t}:{}})).status,403);pass("anonymous/cross-UID direct Firestore and API access remain denied");
assert.equal((await api("/api/netra-hasta/history/"+savedId,token,"DELETE")).status,200);assert.deepEqual((await(await api("/api/netra-hasta/history",token)).json()).records,[]);pass("owner deletes only synthetic saved result");
// Only the expiry timestamp is shortened in transit for this UI lifecycle test;
// all identity verification and returned detail above came from the actual server/emulator.
shortExpiry=true;
await fill("netra-match-startYear","2000");await fill("netra-match-endYear","2005");await click("Terapkan rentang");
await until('document.querySelector(".netra-range") && !document.querySelector(".netra-locked-placeholder")');
await until('document.getElementById("netra-email") && document.querySelector(".netra-locked-placeholder")');
assert(await evaluate('document.querySelector(".netra-range")===null && document.getElementById("rekha-editor-heading")===null && Boolean(document.querySelector(".netra-preview canvas"))'));
pass("short-expiry response fixture relocks partner/Rekha/editor without discarding ROI");
await fill("netra-email",email);await fill("netra-password",password);await click("Masuk dan lanjutkan");await until('document.querySelector(".netra-range") && document.getElementById("rekha-editor-heading")');
pass("reauthentication reopens same capture after expiry");
await click("Keluar akun");await until('location.pathname==="/netra-hasta/akses-detail"');assert.equal((await send("Network.getCookies",{urls:[base]})).cookies.some(c=>c.name==="metemu_netra_session"),false);assert.equal((await api("/api/netra-hasta/detail",null,"POST",detailBody)).status,401);
pass("logout clears protected session and rejects future detail requests");
for(const path of ["/dev/landmark-roi","/dev/palm-interior-mask","/dev/rekha-auto"])assert.equal((await api(path)).status,404);assert.deepEqual(errors,[]);pass("production dev routes remain 404; zero render exceptions");
}finally{
await send("Page.close").catch(()=>{});ws.close();
if(savedId)await fetch(db+"/netraHastaUsers/"+accounts[0].localId+"/results/"+savedId,{method:"DELETE",headers:{Authorization:"Bearer owner"}});
for(const a of accounts)await account("delete",{idToken:a.idToken});
}
const report={scope:"production build + Auth/Firestore Emulator; synthetic capture and accounts only",checks:checks.length,passed:checks,productionDataTouched:false};fs.writeFileSync("coverage/netra-detail-gate/auth-browser-results.json",JSON.stringify(report,null,2));console.log(JSON.stringify(report));
