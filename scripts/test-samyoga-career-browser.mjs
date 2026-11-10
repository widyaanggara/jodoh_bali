// Explicit local-only browser/Auth Emulator test. Synthetic dates/accounts only.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {createBrowserEmulatorAccount} from "./helpers/netra-auth-emulator-browser.mjs";
const base=process.env.METEMU_LIVE_BASE_URL??"http://127.0.0.1:3049";
if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))throw Error("Local test only");
const screenshots=process.argv.includes("--screenshots");
const out=path.resolve("coverage/samyoga-career-lock-browser");fs.mkdirSync(out,{recursive:true});
const target=await(await fetch("http://127.0.0.1:9327/json/new?about:blank",{method:"PUT"})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(resolve=>ws.addEventListener("open",resolve,{once:true}));
let id=0,shortExpiry=false,rejectSession=false;
const pending=new Map(),checks=[],exceptions=[],careerPayloads=[],sensitiveUrls=[];
const accounts=[];
const send=(method,params={})=>new Promise((resolve,reject)=>{
 const n=++id,timer=setTimeout(()=>{pending.delete(n);reject(Error("CDP timeout "+method));},30000);
 pending.set(n,{resolve:v=>{clearTimeout(timer);resolve(v);},reject:e=>{clearTimeout(timer);reject(e);}});
 ws.send(JSON.stringify({id:n,method,params}));
});
ws.addEventListener("message",({data})=>{
 const m=JSON.parse(data);
 if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(p){if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);}}
 if(m.method==="Runtime.exceptionThrown")exceptions.push(m.params.exceptionDetails.text);
 if(m.method==="Network.requestWillBeSent"){
  const r=m.params.request;
  if(r.url.endsWith("/api/samyoga/career")&&r.postData)careerPayloads.push(JSON.parse(r.postData));
  if(/2025-07-06|2025-07-07|2025-02-04|2025-12-01/.test(r.url))sensitiveUrls.push(r.url);
 }
 if(m.method==="Fetch.requestPaused")void(async()=>{
  const r=m.params.request,url=new URL(r.url);
  if(url.pathname==="/api/samyoga/career"&&m.params.responseStatusCode){
   if(rejectSession){rejectSession=false;await send("Fetch.fulfillRequest",{requestId:m.params.requestId,responseCode:401,responseHeaders:[{name:"Content-Type",value:"application/json"},{name:"Cache-Control",value:"private, no-store"}],body:Buffer.from(JSON.stringify({error:"Sesi tidak valid."})).toString("base64")});return;}

   if(shortExpiry&&m.params.responseStatusCode===200){
    const raw=await send("Fetch.getResponseBody",{requestId:m.params.requestId});
    const value=JSON.parse(raw.base64Encoded?Buffer.from(raw.body,"base64").toString():raw.body);
    if(value.members){value.expiresAt=Math.floor(Date.now()/1000)+2;value.validForMs=1000;shortExpiry=false;
     await send("Fetch.fulfillRequest",{requestId:m.params.requestId,responseCode:200,responseHeaders:[{name:"Content-Type",value:"application/json"},{name:"Cache-Control",value:"private, no-store"}],body:Buffer.from(JSON.stringify(value)).toString("base64")});return;}
   }
   await send("Fetch.continueRequest",{requestId:m.params.requestId});return;
  }
  if(["identitytoolkit.googleapis.com","securetoken.googleapis.com"].includes(url.hostname)){
   const response=await fetch("http://127.0.0.1:9097/"+url.hostname+url.pathname+url.search,{method:r.method,headers:{"Content-Type":r.headers["Content-Type"]??r.headers["content-type"]??"application/json"},...(r.postData?{body:r.postData}:{})});
   await send("Fetch.fulfillRequest",{requestId:m.params.requestId,responseCode:response.status,responseHeaders:[{name:"Content-Type",value:"application/json"},{name:"Access-Control-Allow-Origin",value:"*"},{name:"Access-Control-Allow-Headers",value:"*"},{name:"Access-Control-Allow-Methods",value:"GET, POST, OPTIONS"}],body:Buffer.from(await response.text()).toString("base64")});
  }else if(["fonts.googleapis.com","fonts.gstatic.com"].includes(url.hostname)) await send("Fetch.continueRequest",{requestId:m.params.requestId});
  else await send("Fetch.failRequest",{requestId:m.params.requestId,errorReason:"BlockedByClient"});
 })().catch(()=>{});
});
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function evaluate(expression){const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;}
async function until(expression){for(let i=0;i<250;i++){if(await evaluate("Boolean("+expression+")"))return;await pause(100);}throw Error("Condition timed out: "+expression);}
async function fill(selector,value){await evaluate("(()=>{const e=document.querySelector("+JSON.stringify(selector)+");if(!e)throw Error('Input not found');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,"+JSON.stringify(value)+");e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()");await pause(75);}
async function click(text){assert(await evaluate("(()=>{const e=[...document.querySelectorAll('button')].find(b=>b.textContent.includes("+JSON.stringify(text)+"));if(!e||e.disabled)return false;e.click();return true;})()"),"Button unavailable: "+text);await pause(75);}
function pass(name){checks.push(name);console.log("PASS "+name);}
async function api(body,cookie=""){
 return fetch(base+"/api/samyoga/career",{method:"POST",headers:{Origin:base,"Content-Type":"application/json",...(cookie?{Cookie:cookie}:{})},body:JSON.stringify(body)});
}
const input=[{id:"member-1",birthDate:"2025-07-06"},{id:"member-2",birthDate:"2025-02-04"},{id:"member-3",birthDate:"2025-12-01"}];
async function analyze(){for(const m of input)await fill("#"+m.id+"-date",m.birthDate);await click("Analisis Samyoga Group");await until("document.querySelector('[data-career-section]')");}
async function viewport(width){await send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:false});await pause(150);assert(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),"Overflow "+width);}
async function shot(name){if(!screenshots)return;const image=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});fs.writeFileSync(path.join(out,name+".png"),Buffer.from(image.data,"base64"));}
try{
 const account=await createBrowserEmulatorAccount();accounts.push(account);
 const other=await createBrowserEmulatorAccount();accounts.push(other);
 await send("Page.enable");await send("Runtime.enable");await send("Network.enable");
 await send("Network.clearBrowserCookies");
 await send("Fetch.enable",{patterns:[{urlPattern:"https://*",requestStage:"Request"},{urlPattern:"*://*/api/samyoga/career",requestStage:"Response"}]});
 await send("Page.navigate",{url:base+"/pawongan-sinergi/kelompok"});
 await until("(()=>{const f=document.querySelector('form');return f&&Object.keys(f).some(k=>k.startsWith('__reactProps$')&&typeof f[k].onSubmit==='function');})()");await analyze();
 await until("document.querySelector('[data-career-login-cta]')");
 assert.equal(careerPayloads.length,0);assert.equal(await evaluate("document.querySelectorAll('[data-career-card] dl').length"),0);
 const anon=await api({action:"authorize",members:input,memberPermissionConfirmed:true});assert.equal(anon.status,401);assert.doesNotMatch(await anon.text(),/professions|Pengarang|Kaso/);
 const forged=Buffer.from(JSON.stringify({alg:"none"})).toString("base64url")+"."+Buffer.from(JSON.stringify({aud:"daily-logs-a1442",iss:"https://securetoken.google.com/daily-logs-a1442",sub:"forged",exp:1,iat:1,auth_time:1})).toString("base64url")+".fake";
 assert.equal((await api({action:"authorize",members:input,memberPermissionConfirmed:true},"metemu_netra_session="+forged)).status,401);
 const seconds=Math.floor(Date.now()/1000),fakeFuture=Buffer.from(JSON.stringify({alg:"none"})).toString("base64url")+"."+Buffer.from(JSON.stringify({aud:"daily-logs-a1442",iss:"https://securetoken.google.com/daily-logs-a1442",sub:"forged",user_id:"forged",exp:seconds+300,iat:seconds,auth_time:seconds,firebase:{identities:{},sign_in_provider:"password"}})).toString("base64url")+".fake";
 assert.equal((await api({action:"authorize",members:input,memberPermissionConfirmed:true},"metemu_netra_session="+fakeFuture)).status,401);
 const html=await(await fetch(base+"/pawongan-sinergi/kelompok")).text();assert.doesNotMatch(html,/815053390bb523ba0b834f074335098fa|Wiraswasta perdagangan|explicitlyPreferred/);
 pass("anonymous HTML, cards and API do not disclose career results; forged/expired session denied");
 assert.equal(await evaluate("document.querySelectorAll('[data-position-member] [data-career-card]').length"),0);
 assert(await evaluate("Boolean(document.querySelector('[aria-labelledby=\"rekomendasi-posisi-title\"]').compareDocumentPosition(document.querySelector('[data-career-section]'))&Node.DOCUMENT_POSITION_FOLLOWING)"));
 assert.equal(await evaluate("document.querySelectorAll('[data-career-placeholder][aria-hidden=true][inert]').length"),1);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-overlay]').length"),1);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-login-cta]').length"),1);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-card]').length"),0);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-placeholder-card]').length"),3);
 assert(await evaluate("getComputedStyle(document.querySelector('[data-career-placeholder]')).filter==='blur(5px)'&&getComputedStyle(document.querySelector('[data-career-overlay]')).filter==='none'&&getComputedStyle(document.querySelector('[data-career-section] header')).filter==='none'"));
 assert.equal(await evaluate("document.querySelectorAll('[data-position-member]').length"),3);
 for(const width of [320,390,768,1440]){await viewport(width);await evaluate("document.querySelector('[data-career-section]').scrollIntoView({block:'start'});window.scrollBy(0,-96)");await shot("locked-"+width);}
 pass("all free position cards precede the independent locked career section; one blurred dummy container and one sharp overlay/CTA at 320/390/768/1440");
 await viewport(390);
 await evaluate("document.querySelector('[data-career-login-cta]').focus()");
 await send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:"\r",unmodifiedText:"\r"});
 await send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13});await until("document.querySelector('[data-career-access] input[type=email]')");
 await fill("[data-career-access] input[type=email]",account.email);await fill("[data-career-access] input[type=password]","incorrect-test-password");
 await click("Masuk dan lanjutkan");await until("document.querySelector('[data-career-access] [role=alert]')");
 assert.equal(await evaluate("document.querySelectorAll('[data-career-card]').length"),0);
 assert.equal(careerPayloads.length,0);
 pass("failed login keeps the single lock and shows a safe error without requesting or revealing careers");
 await fill("[data-career-access] input[type=password]",account.password);
 await click("Masuk dan lanjutkan");await until("document.querySelector('[data-career-access] input[type=checkbox]')");
 assert.equal(await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').checked"),false);assert.equal(careerPayloads.length,0);
 pass("real shared Firebase Emulator login retains public group and still requires member permission");
 await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').focus()");
 await send("Input.dispatchKeyEvent",{type:"keyDown",key:" ",code:"Space",windowsVirtualKeyCode:32,nativeVirtualKeyCode:32,text:" ",unmodifiedText:" "});
 await send("Input.dispatchKeyEvent",{type:"keyUp",key:" ",code:"Space",windowsVirtualKeyCode:32,nativeVirtualKeyCode:32});
 assert(await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').checked"));await click("Verifikasi dan buka profesi");
 await until("document.querySelectorAll('[data-career-status=interpreted]').length===2&&document.querySelectorAll('[data-career-status=ambiguous]').length===1");
 assert.equal(careerPayloads.length,2);assert.deepEqual(careerPayloads.map(x=>x.action),["authorize","analyze"]);
 assert(!/displayName|birthTime/.test(JSON.stringify(careerPayloads)));assert.equal(sensitiveUrls.length,0);
 assert(await evaluate("document.querySelector('[data-career-card]').textContent.includes('Pengarang, Wartawan')"));
 assert(await evaluate("document.querySelectorAll('[data-career-card]')[1].textContent.includes('tidak dipaksakan')"));
 assert(await evaluate("document.querySelectorAll('[data-career-card]')[2].textContent.includes('Kemiliteran, Seni lukis')"));
 pass("explicit permission plus server grant unlocks all member readings; Feb4 abstains and dual emphasis remains visible");
 assert(await evaluate("JSON.stringify([...document.querySelectorAll('[data-position-member]')].map(e=>e.dataset.positionMember))===JSON.stringify([...document.querySelectorAll('[data-career-member]')].map(e=>e.dataset.careerMember))"));
 assert(await evaluate("JSON.stringify([...document.querySelectorAll('[data-position-member]')].map(e=>e.querySelector('h3').textContent))===JSON.stringify([...document.querySelectorAll('[data-career-member]')].map(e=>e.querySelector('h3').textContent))"));
 assert.equal(await evaluate("document.querySelectorAll('[data-position-member] [data-career-card]').length"),0);
 assert(await evaluate("[...document.querySelectorAll('[data-career-access] button')].some(e=>e.textContent==='Profesi sudah terbuka'&&e.disabled)"));
 await viewport(768);assert.equal(careerPayloads.length,2);
 pass("opened career cards match position identities/order and layout changes never recalculate the results");
 const cookies=(await send("Network.getCookies",{urls:[base]})).cookies;
 const cookieA="metemu_netra_session="+cookies.find(x=>x.name==="metemu_netra_session").value;
 const grantResponse=await api({action:"authorize",members:input,memberPermissionConfirmed:true},cookieA);assert.equal(grantResponse.status,200);const grant=await grantResponse.json();
 const otherToken=await(await fetch("http://127.0.0.1:9097/identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=emulator",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:other.email,password:other.password,returnSecureToken:true})})).json();
 const otherSession=await fetch(base+"/api/netra-hasta/session",{method:"POST",headers:{Origin:base,"Content-Type":"application/json"},body:JSON.stringify({idToken:otherToken.idToken})});assert.equal(otherSession.status,200);
 const cookieB=otherSession.headers.get("set-cookie").split(";")[0];
 const body={action:"analyze",members:input,groupId:grant.groupId,grant:grant.grant};
 for(const [payload,cookie]of [[body,cookieB],[{...body,groupId:crypto.randomUUID()},cookieA],[{...body,members:input.map((x,i)=>i?x:{...x,birthDate:"2025-07-07"})},cookieA]]){
  const r=await api(payload,cookie);assert.equal(r.status,403);assert.doesNotMatch(await r.text(),/professions|Pengarang|birthDate/);
 }
 pass("actual server denies cross-UID group grant, guessed group ID and changed member date");
 await viewport(1440);await evaluate("document.querySelector('[data-career-section]').scrollIntoView({block:'start'});window.scrollBy(0,-96)");await shot("opened-section-1440");
 for(const width of [320,390,768,1440]){await viewport(width);await evaluate("document.querySelector('[data-career-card]').scrollIntoView({block:'center'})");await shot("opened-"+width);}
 pass("career cards remain readable without overflow at 320/390/768/1440");
 await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').click()");
 await until("document.querySelectorAll('[data-career-card] dl').length===0");
 await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').click()");shortExpiry=true;await click("Verifikasi dan buka profesi");
 await until("document.querySelectorAll('[data-career-status=interpreted]').length===2");
 await until("document.querySelectorAll('[data-career-card] dl').length===0");
 pass("revoking permission and short-expiry response fixture relock every career card");
 await click("Verifikasi dan buka profesi");await until("document.querySelectorAll('[data-career-status=interpreted]').length===2");
 await click("Analisis Ulang");await until("document.querySelectorAll('form input[type=date]').length===3");
 input[0].birthDate="2025-07-07";await analyze();
 assert.equal(await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').checked"),false);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-card] dl').length"),0);
 await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').click()");await click("Verifikasi dan buka profesi");
 await until("document.querySelectorAll('[data-career-status=interpreted]').length===2");
 assert(await evaluate("document.querySelector('[data-career-card]').textContent.includes('Senin')&&document.querySelector('[data-career-card]').textContent.includes('Pegawai')"));
 pass("changed birth date on a logged-in new analysis clears previous permission/grant and recomputes the new weekday");
 await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').click()");
 await until("document.querySelector('[data-career-overlay]')");
 await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').click()");
 rejectSession=true;await click("Verifikasi dan buka profesi");
 await until("document.querySelector('[data-career-login-cta]')");
 assert.equal(await evaluate("document.querySelectorAll('[data-career-card]').length"),0);
 assert.equal(await evaluate("document.querySelectorAll('[data-position-member]').length"),3);
 pass("explicit 401 response fixture relocks the whole section and requires login again without blurring public positions");
 await click("Masuk / Daftar");await until("document.querySelector('[data-career-access] input[type=email]')");
 await fill("[data-career-access] input[type=email]",account.email);await fill("[data-career-access] input[type=password]",account.password);await click("Masuk dan lanjutkan");
 await until("document.querySelector('[data-career-access] input[type=checkbox]')");
 await evaluate("document.querySelector('[data-career-access] input[type=checkbox]').click()");await click("Verifikasi dan buka profesi");
 await until("document.querySelectorAll('[data-career-status=interpreted]').length===2");

 await click("Keluar akun");await until("document.querySelectorAll('[data-career-card] dl').length===0");
 assert.equal(await evaluate("fetch('/api/samyoga/career',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({action:'authorize',members:"+JSON.stringify(input)+",memberPermissionConfirmed:true})}).then(r=>r.status)"),401);
 pass("logout clears browser session and career results while public Samyoga remains available");
 await click("Analisis Ulang");await until("document.querySelectorAll('form input[type=date]').length===3");
 assert(await evaluate("[...document.querySelectorAll('form input[type=date]')].every(e=>e.value==='')"));
 await click("Tambah anggota");assert.equal(await evaluate("document.querySelectorAll('form input[type=date]').length"),4);
 await evaluate("document.querySelector('[aria-label=\"Hapus Anggota 4\"]').click()");assert.equal(await evaluate("document.querySelectorAll('form input[type=date]').length"),3);
 await analyze();assert.equal(await evaluate("document.querySelectorAll('[data-career-card] dl').length"),0);
 pass("reset/new analysis and member add/remove cannot retain an earlier career result or grant");
 await click("Analisis Ulang");await until("document.querySelectorAll('form input[type=date]').length===3");
 await click("Tambah anggota");input.push({id:"member-4",birthDate:"2000-02-29"});await analyze();
 assert.equal(await evaluate("document.querySelectorAll('[data-position-member]').length"),4);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-member]').length"),0);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-overlay]').length"),1);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-login-cta]').length"),1);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-placeholder-card]').length"),4);
 assert.equal(await evaluate("document.querySelectorAll('[data-career-card] dl').length"),0);
 pass("changed member count starts a four-member analysis with four free position cards and a single group lock without member-level CTAs");
 assert.equal(exceptions.length,0);assert.equal(sensitiveUrls.length,0);
 assert(await evaluate("![localStorage,sessionStorage].some(storage=>Object.values(storage).some(v=>/2025-07-06|2025-07-07|2025-02-04|2025-12-01/.test(v)))"));
 pass("zero rendering exceptions, birth data in URLs or persistent browser storage");
 const summary={checks:checks.length,passed:checks,productionDataTouched:false,accounts:"temporary emulator accounts only",expirationCase:"explicit response-expiry and 401 fixtures",screenshots};
 fs.writeFileSync(path.join(out,"summary.json"),JSON.stringify(summary,null,2)+"\n");console.log(JSON.stringify(summary));
}finally{
 for(const account of accounts)await account.cleanup().catch(()=>{});
 await send("Page.close").catch(()=>{});ws.close();
}
