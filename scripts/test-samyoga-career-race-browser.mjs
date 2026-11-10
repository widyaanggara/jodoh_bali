// Loopback-only production-browser race regression. Synthetic Auth Emulator users.
// No credentials, member payloads or private response bodies are written to traces.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {createBrowserEmulatorAccount} from './helpers/netra-auth-emulator-browser.mjs';
const base=process.env.METEMU_LIVE_BASE_URL??'http://127.0.0.1:3049';
assert.match(base,/^http:\/\/(127\.0\.0\.1|localhost):\d+$/);
const clockOnly=process.argv.includes('--clock-only');
const target=await(await fetch('http://127.0.0.1:9327/json/new?about:blank',{method:'PUT'})).json();
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r,{once:true}));
let serial=0;const pending=new Map(),exceptions=[],checks=[];
const send=(method,params={})=>new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error('CDP timeout: '+method));},30000);pending.set(id,{resolve:value=>{clearTimeout(timer);resolve(value);},reject});ws.send(JSON.stringify({id,method,params}));});
const account=await createBrowserEmulatorAccount();
ws.addEventListener('message',({data})=>{const m=JSON.parse(data);if(m.id){const p=pending.get(m.id);pending.delete(m.id);if(p){if(m.error)p.reject(Error(m.error.message));else p.resolve(m.result);}}if(m.method==='Runtime.exceptionThrown')exceptions.push(m.params.exceptionDetails.text);if(m.method==='Fetch.requestPaused')void(async()=>{if(await account.intercept(m.params,send))return;const u=new URL(m.params.request.url);if(['fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname))await send('Fetch.continueRequest',{requestId:m.params.requestId});else await send('Fetch.failRequest',{requestId:m.params.requestId,errorReason:'BlockedByClient'});})().catch(()=>{});});
async function ev(expression){const r=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.exception?.description??r.exceptionDetails.text);return r.result.value;}
const pause=ms=>new Promise(r=>setTimeout(r,ms));
async function until(expression){const end=Date.now()+25000;while(Date.now()<end){if(await ev('Boolean('+expression+')'))return;await pause(15);}throw Error('UI condition timed out: '+expression);}
async function fill(selector,value){await ev(`(()=>{const e=document.querySelector(${JSON.stringify(selector)});if(!e)throw Error('Missing input');Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set.call(e,${JSON.stringify(value)});e.dispatchEvent(new Event('input',{bubbles:true}));e.dispatchEvent(new Event('change',{bubbles:true}));})()`);}
async function click(text){assert(await ev(`(()=>{const e=[...document.querySelectorAll('button')].find(e=>e.textContent.includes(${JSON.stringify(text)}));if(!e||e.disabled)return false;e.click();return true;})()`),'Unavailable button: '+text);}
async function consent(){await until("document.querySelector('[data-career-access] input[type=checkbox]')");await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");await until("[...document.querySelectorAll('button')].some(e=>e.textContent==='Verifikasi dan buka profesi'&&!e.disabled)");}
async function resetGroup(extra=false){if(await ev("Boolean([...document.querySelectorAll('button')].find(e=>e.textContent.includes('Analisis Ulang')))")){await click('Analisis Ulang');await until("document.querySelector('#member-1-date')");}if(extra)await click('Tambah anggota');for(let i=0;i<(extra?4:3);i++)await fill('#member-'+(i+1)+'-date',['2025-07-06','2025-02-04','2025-12-01','2000-02-29'][i]);await click('Analisis Samyoga Group');await until("document.querySelector('[data-career-section]')");}
async function login(){await click('Masuk / Daftar');await until("document.querySelector('[data-career-access] input[type=email]')");await fill('[data-career-access] input[type=email]',account.email);await fill('[data-career-access] input[type=password]',account.password);await click('Masuk dan lanjutkan');await until("document.querySelector('[data-career-access] input[type=checkbox]')");}
async function ready(count=3){await until(`document.querySelectorAll('[data-career-card]').length===${count}`);}
async function count(){return ev("window.__careerProbe.events.filter(e=>e.event==='start'&&e.stage==='authorize').length");}
async function check(name,fn){try{await fn();checks.push({name,pass:true});console.log('PASS '+name);}catch(error){checks.push({name,pass:false,message:error.message});console.log('FAIL '+name+': '+error.message);throw error;}}
const initialization=`(()=>{
 const real=window.fetch.bind(window),timer=window.setTimeout.bind(window);
 const probe=window.__careerProbe={events:[],hold:null,pending:[],releases:[],failure:null,slowStart:false};
 // Controlled task scheduling exposes the pre-effect click window, not a production delay.
 window.setTimeout=(fn,ms,...args)=>timer(fn,probe.slowStart&&ms===0?250:ms,...args);
 window.fetch=async(input,options)=>{
  const url=new URL(typeof input==='string'?input:input.url,location.href),method=options?.method??'GET';
  const stage=url.pathname==='/api/samyoga/career'?JSON.parse(options.body).action:url.pathname==='/api/netra-hasta/session'?'session-'+method:null;
  if(!stage)return real(input,options);
  const at=performance.now();probe.events.push({event:'start',stage,at});
  const fail=probe.failure?.stage===stage?probe.failure:null; if(fail)probe.failure=null;
  if(probe.hold===stage){probe.hold=null;probe.pending.push(stage);await new Promise(resolve=>probe.releases.push(resolve));}
  try{
   if(fail?.timeout)await new Promise((_,reject)=>options.signal.addEventListener('abort',()=>reject(options.signal.reason),{once:true}));
   const response=fail?Response.json({error:'Controlled error fixture'},{status:fail.status}):await real(input,options);
   probe.events.push({event:'end',stage,status:response.status,ms:Math.round(performance.now()-at)});return response;
  }catch(error){probe.events.push({event:'error',stage,kind:error.name,ms:Math.round(performance.now()-at)});throw error;}
 };
})()`;
try{
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');await send('Network.clearBrowserCookies');await send('Fetch.enable',{patterns:[{urlPattern:'https://*',requestStage:'Request'}]});await send('Page.addScriptToEvaluateOnNewDocument',{source:initialization});
 await send('Page.navigate',{url:base+'/pawongan-sinergi/kelompok'});await until("(()=>{const f=document.querySelector('form');return f&&Object.keys(f).some(k=>k.startsWith('__reactProps$'));})()");await resetGroup();
 await check('fresh login: server-session response held, no career request before readiness, one-click verification',async()=>{
  await ev("window.__careerProbe.hold='session-POST'");
  await click('Masuk / Daftar');await until("document.querySelector('[data-career-access] input[type=email]')");await fill('[data-career-access] input[type=email]',account.email);await fill('[data-career-access] input[type=password]',account.password);await click('Masuk dan lanjutkan');
  await until("window.__careerProbe.pending.includes('session-POST')");assert.equal(await count(),0);assert.equal(await ev("document.querySelectorAll('[data-career-access] input[type=checkbox]').length"),0);
  await ev("window.__careerProbe.releases.shift()()");await consent();await click('Verifikasi dan buka profesi');await ready();assert.equal(await count(),1);
 });
 await check('logout, relogin then immediately verify once',async()=>{await click('Keluar akun');await until("document.querySelector('[data-career-login-cta]')");await login();await consent();const before=await count();await click('Verifikasi dan buka profesi');await ready();assert.equal(await count(),before+1);});
 await check('changed members then one-click verification uses new context',async()=>{await resetGroup(true);await consent();const before=await count();await click('Verifikasi dan buka profesi');await ready(4);assert.equal(await count(),before+1);});
 await check('explicit session-ready check then one click',async()=>{await click('Keluar akun');await until("document.querySelector('[data-career-login-cta]')");await login();assert.equal(await ev("fetch('/api/netra-hasta/session').then(r=>r.status)"),200);await consent();await click('Verifikasi dan buka profesi');await ready(4);});
 if(!clockOnly){
 await check('busy starts before delayed effect; repeated clicks create exactly one authorize/analyze pair',async()=>{
  await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");await consent();const before=await count();
  await ev("window.__careerProbe.slowStart=true;const b=[...document.querySelectorAll('button')].find(e=>e.textContent==='Verifikasi dan buka profesi');for(let i=0;i<5;i++)b.click()");
  await until("[...document.querySelectorAll('button')].some(e=>e.textContent==='Memverifikasi kelompok...'&&e.disabled)");
  assert.equal(await count(),before,'must lock before the 250ms deferred-effect fixture starts fetch');await ev('window.__careerProbe.slowStart=false');await ready(4);assert.equal(await count(),before+1);
 });
 for(const [stage,status]of [['authorize',401],['analyze',403],['analyze',500]])await check('controlled '+stage+' '+status+' shows error, stays locked, retry succeeds',async()=>{
  await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");await consent();await ev(`window.__careerProbe.failure={stage:${JSON.stringify(stage)},status:${status}}`);await click('Verifikasi dan buka profesi');await until("document.querySelector('[data-career-overlay] [role=alert]')");assert.equal(await ev("document.querySelectorAll('[data-career-card]').length"),0);
  if(status===401){await login();await consent();}await click('Verifikasi dan buka profesi');await ready(4);
 });
 await check('real 15s AbortSignal timeout clears busy and supports retry',async()=>{await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");await consent();await ev("window.__careerProbe.failure={stage:'authorize',timeout:true}");await click('Verifikasi dan buka profesi');await until("document.querySelector('[data-career-overlay] [role=alert]')");assert.match(await ev("document.querySelector('[data-career-overlay] [role=alert]').textContent"),/waktu|koneksi/i);await click('Verifikasi dan buka profesi');await ready(4);});
 await check('old authorize response during member/context change cannot reveal old results',async()=>{
  await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");await consent();await ev("window.__careerProbe.hold='authorize'");await click('Verifikasi dan buka profesi');await until("window.__careerProbe.pending.includes('authorize')");await resetGroup();await ev('window.__careerProbe.releases.shift()()');assert.equal(await ev("document.querySelectorAll('[data-career-card]').length"),0);await consent();await click('Verifikasi dan buka profesi');await ready();
 });
 await check('late analyze response and permission withdrawal stay locked',async()=>{
  await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");await consent();await ev("window.__careerProbe.hold='analyze'");await click('Verifikasi dan buka profesi');await until("window.__careerProbe.pending.includes('analyze')");await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");await ev('window.__careerProbe.releases.shift()()');await until("[...document.querySelectorAll('button')].some(e=>e.textContent==='Verifikasi dan buka profesi'&&e.disabled)");assert.equal(await ev("document.querySelectorAll('[data-career-card]').length"),0);
 });
 }
 for(const offset of [-2000,660000])await check('HTTP200 results open with client clock offset '+offset+'ms; server expiry remains enforced',async()=>{
  if(await ev("document.querySelector('[data-career-access] input[type=checkbox]').checked"))await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");
  await consent();await ev(`window.__originalWallClock=Date.now;Date.now=()=>window.__originalWallClock()+${offset}`);
  try{await click('Verifikasi dan buka profesi');await ready(await ev("document.querySelectorAll('[data-position-member]').length"));}finally{await ev('Date.now=window.__originalWallClock;delete window.__originalWallClock');}
  await ev("document.querySelector('[data-career-access] input[type=checkbox]').click()");
 });
 assert.equal(exceptions.length,0);
}finally{
 const trace=await ev('window.__careerProbe?.events??[]').catch(()=>[]);const out=path.resolve('coverage/samyoga-career-race-browser');fs.mkdirSync(out,{recursive:true});fs.writeFileSync(path.join(out,'summary.json'),JSON.stringify({checks,trace,exceptions,productionTouched:false,scope:'real Firebase Auth Emulator; local production build; controlled scheduling, HTTP error and timeout fixtures'},null,2)+'\n');
 await account.cleanup().catch(()=>{});await send('Page.close').catch(()=>{});ws.close();
}
