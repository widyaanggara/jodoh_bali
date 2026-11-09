// Explicit local-only About UI check. Public educational content only; no account or member input.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const base=process.env.METEMU_LIVE_BASE_URL??"http://127.0.0.1:3049";
if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))throw Error("Local audit only");
const shots=process.argv.includes("--screenshots"),out=path.resolve("coverage/samyoga-about-browser");
fs.mkdirSync(out,{recursive:true});
const target=await(await fetch("http://127.0.0.1:9327/json/new?about:blank",{method:"PUT"})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(resolve=>ws.addEventListener("open",resolve,{once:true}));
let counter=0;const pending=new Map(),checks=[],exceptions=[];let careerRequests=0;
function send(method,params={}){return new Promise((resolve,reject)=>{
 const id=++counter,timer=setTimeout(()=>{pending.delete(id);reject(Error("CDP timeout "+method));},30000);
 pending.set(id,{resolve:v=>{clearTimeout(timer);resolve(v);},reject:e=>{clearTimeout(timer);reject(e);}});ws.send(JSON.stringify({id,method,params}));
});}
ws.addEventListener("message",({data})=>{
 const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(p){if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);}}
 if(m.method==="Runtime.exceptionThrown")exceptions.push(m.params.exceptionDetails.text);
 if(m.method==="Network.requestWillBeSent"&&m.params.request.url.includes("/api/samyoga/career"))careerRequests++;
 if(m.method==="Fetch.requestPaused"){
  const allowed=["fonts.googleapis.com","fonts.gstatic.com"].includes(new URL(m.params.request.url).hostname);
  void send(allowed?"Fetch.continueRequest":"Fetch.failRequest",allowed?{requestId:m.params.requestId}:{requestId:m.params.requestId,errorReason:"BlockedByClient"}).catch(()=>{});
 }
});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function evaluate(expression){const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;}
async function until(expression){for(let i=0;i<200;i++){if(await evaluate("Boolean("+expression+")"))return;await delay(100);}throw Error("Timeout "+expression);}
const button=text=>`[...document.querySelectorAll('button[aria-pressed]')].find(b=>b.textContent.includes(${JSON.stringify(text)}))`;
async function click(text){assert(await evaluate(`(()=>{const b=${button(text)};if(!b)return false;b.click();return true;})()`));await delay(100);}
async function keyboard(text,key){await evaluate(`${button(text)}.focus()`);await send("Input.dispatchKeyEvent",{type:"keyDown",key,code:key===" "?"Space":"Enter",windowsVirtualKeyCode:key===" "?32:13,nativeVirtualKeyCode:key===" "?32:13,text:key===" "?" ":"\r",unmodifiedText:key===" "?" ":"\r"});await send("Input.dispatchKeyEvent",{type:"keyUp",key,code:key===" "?"Space":"Enter",windowsVirtualKeyCode:key===" "?32:13});await delay(100);}
function pass(name){checks.push(name);console.log("PASS "+name);}
async function screenshot(name,selector){if(!shots)return;await evaluate(`(()=>{const e=document.querySelector(${JSON.stringify(selector)}),head=document.querySelector('header')?.getBoundingClientRect().height??80,nav=document.querySelector('main .sticky')?.getBoundingClientRect().height??88;window.scrollTo({top:Math.max(0,e.getBoundingClientRect().top+scrollY-head-nav-16),behavior:'instant'});})()`);await delay(250);const r=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});fs.writeFileSync(path.join(out,name+".png"),Buffer.from(r.data,"base64"));}
try{
 await send("Page.enable");await send("Runtime.enable");await send("Network.enable");await send("Fetch.enable",{patterns:[{urlPattern:"https://*"}]});
 assert.equal((await fetch(base+"/about")).status,200);await send("Page.navigate",{url:base+"/about"});
 await until(`(()=>{const b=${button("Ramalan Profesi")};return b&&Object.keys(b).some(k=>k.startsWith('__reactProps$')&&typeof b[k].onClick==='function');})()`);
 assert.equal(await evaluate("!!document.querySelector('[data-wariga-method]')"),false);
 assert.equal(await evaluate(`${button("Peramalan Jodoh")}.getAttribute('aria-pressed')`),"true");
 pass("About remains public and retains the original default tab");
 await keyboard("Ramalan Profesi","Enter");await until("document.querySelector('[data-wariga-method]')");
 assert.equal(await evaluate(`${button("Ramalan Profesi")}.getAttribute('aria-pressed')`),"true");
 assert(await evaluate("document.querySelector('[data-wariga-pseudocode]').textContent.includes('Tabel36[mangsa][kelompok]')"));
 assert(await evaluate("document.getElementById('wariga-ambiguity-title').parentElement.textContent.includes('4 Februari')"));
 assert(await evaluate("document.querySelector('[data-wariga-example]').textContent.includes('2025-07-06')&&document.querySelector('[data-wariga-example]').textContent.includes('Pengarang atau Wartawan')"));
 pass("Enter opens the accurate lookup, educational example and February4 ambiguity explanation");
 for(const width of [320,390,1440]){
  await send("Emulation.setDeviceMetricsOverride",{width,height:1000,deviceScaleFactor:1,mobile:false});await delay(150);
  assert(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),"Page overflow "+width);
  assert(await evaluate("document.querySelector('[data-wariga-pseudocode]').scrollWidth<=document.querySelector('[data-wariga-pseudocode]').clientWidth+1"),"Pseudocode overflow "+width);
  await screenshot("method-"+width,"[data-wariga-method]");await screenshot("example-"+width,"[data-wariga-example]");
 }
 pass("Method cards, heading and pseudocode fit 320/390/1440 without horizontal overflow");
 const link=await evaluate("(()=>{const links=[...document.querySelectorAll('a')].filter(a=>a.href.includes('/743338223/'));return {count:links.length,href:links[0]?.href,title:links[0]?.textContent,target:links[0]?.target,rel:links[0]?.rel};})()");
 assert.equal(link.count,1);assert.equal(link.href,"https://id.scribd.com/document/743338223/Tenung-Wariga-Gemet?doc_id=743338223&order=702238034");assert(link.title.includes("Tenung Wariga Gemet"));assert.equal(link.target,"_blank");assert(link.rel.includes("noopener")&&link.rel.includes("noreferrer"));
 assert.equal(await evaluate("document.querySelectorAll('#tenung-wariga-gemet-reference').length"),1);
 pass("The existing bibliography has exactly one safe canonical Scribd reference");
 for(const text of ["Peramalan Jodoh","Otonan & Astro","Pal Sri Sedana"]){
  await keyboard(text," ");await until("!document.querySelector('[data-wariga-method]')");
  assert.equal(await evaluate(`${button(text)}.getAttribute('aria-pressed')`),"true");
  assert.equal(await evaluate("document.querySelectorAll('a').length>0&&document.querySelectorAll('#tenung-wariga-gemet-reference').length===1"),true);
 }
 pass("Space switches all historical tabs; bibliography stays shared rather than duplicated");
 await click("Ramalan Profesi");assert.equal(careerRequests,0);assert.equal(exceptions.length,0);
 pass("Public About never calls the private career API and has zero rendering exceptions");
 const result={checks:checks.length,passed:checks,widths:[320,390,1440],privateCareerRequests:careerRequests,renderExceptions:exceptions,publicExample:"explicit synthetic educational example, not member results",screenshots:shots};
 fs.writeFileSync(path.join(out,"summary.json"),JSON.stringify(result,null,2)+"\n");console.log(JSON.stringify(result));
}finally{await send("Page.close").catch(()=>{});ws.close();}
