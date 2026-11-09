// Local-only navigation smoke test. No real member input, account or biometric data.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
const base=process.env.METEMU_LIVE_BASE_URL??"http://127.0.0.1:3049";
if(!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(base))throw Error("Local test only");
const out=path.resolve("coverage/samyoga-navigation-browser"),shots=process.argv.includes("--screenshots");
fs.mkdirSync(out,{recursive:true});
const target=await(await fetch("http://127.0.0.1:9327/json/new?about:blank",{method:"PUT"})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(resolve=>ws.addEventListener("open",resolve,{once:true}));
let seq=0;const pending=new Map(),errors=[],checks=[];
function send(method,params={}){return new Promise((resolve,reject)=>{const id=++seq,timer=setTimeout(()=>{pending.delete(id);reject(Error("CDP timeout "+method));},30000);pending.set(id,{resolve:r=>{clearTimeout(timer);resolve(r);},reject:e=>{clearTimeout(timer);reject(e);}});ws.send(JSON.stringify({id,method,params}));});}
ws.addEventListener("message",({data})=>{
 const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(p){if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);}}
 if(m.method==="Runtime.exceptionThrown")errors.push(m.params.exceptionDetails.exception?.description??m.params.exceptionDetails.text);
 if(m.method==="Fetch.requestPaused"){
  const allowed=["fonts.googleapis.com","fonts.gstatic.com"].includes(new URL(m.params.request.url).hostname);
  void send(allowed?"Fetch.continueRequest":"Fetch.failRequest",allowed?{requestId:m.params.requestId}:{requestId:m.params.requestId,errorReason:"BlockedByClient"}).catch(()=>{});
 }
});
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function evaluate(expression){const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;}
async function until(expression){for(let i=0;i<200;i++){if(await evaluate("Boolean("+expression+")"))return;await delay(100);}throw Error("Timeout "+expression);}
const desktop=name=>`[...document.querySelectorAll('[data-desktop-navigation] button')].find(b=>b.textContent.includes(${JSON.stringify(name)}))`;
const mobile=name=>`[...document.querySelectorAll('#metemu-mobile-navigation button')].find(b=>b.textContent.includes(${JSON.stringify(name)}))`;
const panel=button=>`document.getElementById((${button}).getAttribute('aria-controls'))`;
const toggle=`document.querySelector('button[aria-controls="metemu-mobile-navigation"]')`;
async function key(key){const code=key===" "?"Space":key,number={Enter:13," ":32,Escape:27,Tab:9}[key];await send("Input.dispatchKeyEvent",{type:"keyDown",key,code,windowsVirtualKeyCode:number,nativeVirtualKeyCode:number,...(["Enter"," "].includes(key)?{text:key===" "?" ":"\r",unmodifiedText:key===" "?" ":"\r"}:{})});await send("Input.dispatchKeyEvent",{type:"keyUp",key,code,windowsVirtualKeyCode:number,nativeVirtualKeyCode:number});await delay(100);}
async function activate(button,keyName="Enter"){await evaluate(`(${button}).focus()`);await key(keyName);}
async function pointer(element){const rect=await evaluate(`(()=>{const r=(${element}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2};})()`);await send("Input.dispatchMouseEvent",{type:"mouseMoved",...rect});await delay(80);await send("Input.dispatchMouseEvent",{type:"mousePressed",button:"left",clickCount:1,...rect});await send("Input.dispatchMouseEvent",{type:"mouseReleased",button:"left",clickCount:1,...rect});await delay(120);}
async function navigate(route){await send("Page.navigate",{url:base+route});await until("(()=>{const h=document.querySelector('header');return h&&Object.keys(h).some(k=>k.startsWith('__reactProps$')&&typeof h[k].onKeyDown==='function');})()");}
async function viewport(width){await send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:false});await delay(150);assert(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),"Overflow "+width);}
async function screenshot(name){if(!shots)return;await delay(350);const r=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});fs.writeFileSync(path.join(out,name+".png"),Buffer.from(r.data,"base64"));}
function pass(name){checks.push(name);console.log("PASS "+name);}
async function assertSubmenu(button,active){
 assert.equal(await evaluate(`(${button}).getAttribute('aria-expanded')`),"true");
 assert.deepEqual(await evaluate(`[...(${panel(button)}).querySelectorAll('a')].map(a=>({name:a.textContent.trim(),href:a.getAttribute('href')}))`),[
  {name:"Sinergi Dua Orang",href:"/pawongan-sinergi"},{name:"Sinergi Kelompok",href:"/pawongan-sinergi/kelompok"}]);
 assert.equal(await evaluate(`(${panel(button)}).querySelectorAll('a[aria-current="page"]').length`),1);
 assert.equal(await evaluate(`(${panel(button)}).querySelector('a[aria-current="page"]').getAttribute('href')`),active);
}
try{
 await send("Page.enable");await send("Runtime.enable");await send("Network.enable");await send("Fetch.enable",{patterns:[{urlPattern:"https://*"}]});
 for(const route of ["/pawongan-sinergi","/pawongan-sinergi/kelompok"])assert.equal((await fetch(base+route)).status,200);
 await viewport(1440);await navigate("/pawongan-sinergi");
 await activate(desktop("Samyoga"));await assertSubmenu(desktop("Samyoga"),"/pawongan-sinergi");
 assert(await evaluate(`(${desktop("Samyoga")}).classList.contains('border-primary')`));
 await key("Tab");assert.equal(await evaluate("document.activeElement.getAttribute('href')"),"/pawongan-sinergi");
 await key("Tab");assert.equal(await evaluate("document.activeElement.getAttribute('href')"),"/pawongan-sinergi/kelompok");
 await key("Escape");assert(await evaluate(`document.activeElement===(${desktop("Samyoga")})&&(${desktop("Samyoga")}).getAttribute('aria-expanded')==='false'`));
 await activate(desktop("Samyoga")," ");await key("Tab");await key("Tab");await key("Tab");
 assert.equal(await evaluate("document.activeElement.getAttribute('href')"),"/netra-hasta");
 assert.equal(await evaluate(`(${desktop("Samyoga")}).getAttribute('aria-expanded')`),"false");
 pass("desktop Enter/Space and Tab access both exact routes; Escape restores focus and Tab exit closes the submenu");
 await pointer(desktop("Samyoga"));await assertSubmenu(desktop("Samyoga"),"/pawongan-sinergi");await screenshot("desktop-pair");
 await pointer(`(${panel(desktop("Samyoga"))}).querySelector('a[href="/pawongan-sinergi/kelompok"]')`);
 await until("location.pathname==='/pawongan-sinergi/kelompok'&&document.querySelector('h1')?.textContent==='Sinergi Kelompok'");
 assert.equal(await evaluate(`(${desktop("Samyoga")}).getAttribute('aria-expanded')`),"false");
 await activate(desktop("Samyoga"));await assertSubmenu(desktop("Samyoga"),"/pawongan-sinergi/kelompok");await screenshot("desktop-group");await key("Escape");
 pass("real mouse hover/click opens Samyoga and client navigation reaches the existing group URL with the correct title and active state");
 for(const [name,count]of [["Peramalan Jodoh",3],["Petunjuk Otonan",2]]){await activate(desktop(name));assert.equal(await evaluate(`(${panel(desktop(name))}).querySelectorAll('a').length`),count);await key("Escape");}
 assert.equal(await evaluate("document.querySelectorAll('[data-desktop-navigation] a[href=\"/netra-hasta\"]').length"),1);
 pass("existing Jodoh/Otonan dropdowns and the single Netra Hasta entry remain intact");
 for(const width of [320,390,768]){
  await viewport(width);await navigate("/pawongan-sinergi/kelompok");
  assert(await evaluate("document.getElementById('metemu-mobile-navigation').inert"));
  await activate(toggle," ");await activate(mobile("Samyoga"));
  await assertSubmenu(mobile("Samyoga"),"/pawongan-sinergi/kelompok");
  assert.equal(await evaluate(`(${panel(mobile("Samyoga"))}).inert`),false);
  await key("Tab");assert.equal(await evaluate("document.activeElement.getAttribute('href')"),"/pawongan-sinergi");
  await key("Tab");assert.equal(await evaluate("document.activeElement.getAttribute('href')"),"/pawongan-sinergi/kelompok");
  await key("Escape");assert(await evaluate(`document.activeElement===(${mobile("Samyoga")})&&(${panel(mobile("Samyoga"))}).inert`));
  await key("Tab");assert.equal(await evaluate("document.activeElement.getAttribute('href')"),"/netra-hasta");
  await key("Escape");assert(await evaluate(`document.getElementById('metemu-mobile-navigation').inert&&document.activeElement===(${toggle})`));
  await pointer(toggle);await pointer(mobile("Samyoga"));await assertSubmenu(mobile("Samyoga"),"/pawongan-sinergi/kelompok");
  await viewport(width);await screenshot("mobile-"+width);
  await pointer(`(${panel(mobile("Samyoga"))}).querySelector('a[href="/pawongan-sinergi"]')`);
  await until("location.pathname==='/pawongan-sinergi'");
  assert(await evaluate("document.getElementById('metemu-mobile-navigation').inert"));
  await pointer(toggle);await pointer(mobile("Samyoga"));await assertSubmenu(mobile("Samyoga"),"/pawongan-sinergi");
  await pointer(`(${panel(mobile("Samyoga"))}).querySelector('a[href="/pawongan-sinergi/kelompok"]')`);
  await until("location.pathname==='/pawongan-sinergi/kelompok'&&document.querySelector('h1')?.textContent==='Sinergi Kelompok'");
  assert(await evaluate("document.getElementById('metemu-mobile-navigation').inert"));
  pass(`mobile ${width}: both routes navigate, active state follows the URL, Enter/Space/Escape work and collapsed links leave the tab order`);
 }
 await viewport(1440);await activate(desktop("Samyoga"));await pointer("document.querySelector('h1')");
 assert.equal(await evaluate(`(${desktop("Samyoga")}).getAttribute('aria-expanded')`),"false");
 assert.equal(errors.length,0);pass("outside pointer closes the dropdown; no rendering exceptions or horizontal overflow");
 fs.writeFileSync(path.join(out,"summary.json"),JSON.stringify({checks:checks.length,passed:checks,widths:[320,390,768,1440],renderExceptions:errors,productionDataTouched:false,screenshots:shots},null,2)+"\n");
}finally{await send("Page.close").catch(()=>{});ws.close();}
