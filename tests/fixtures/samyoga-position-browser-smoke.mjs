// Local-only Chrome CDP smoke runner. Uses only synthetic calendar test inputs.
// Run after npm run build: node tests/fixtures/samyoga-position-browser-smoke.mjs production|development
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import net from "node:net";
import {spawn,spawnSync} from "node:child_process";
import {createRequire} from "node:module";
const mode=process.argv[2];
assert(["development","production"].includes(mode));
const cwd=process.cwd(),delay=ms=>new Promise(r=>setTimeout(r,ms));
// Explicit developer audit only; regular smoke runs never save screenshots.
const auditIndex=process.argv.indexOf("--audit-dir");
const auditDir=auditIndex<0?null:path.resolve(process.argv[auditIndex+1]??"");
const labelIndex=process.argv.indexOf("--audit-label");
const auditLabel=labelIndex<0?"after":process.argv[labelIndex+1];
if(!["before","after","production"].includes(auditLabel))throw new Error("Invalid audit label");
if(auditDir&&!auditDir.startsWith(path.resolve(cwd,"coverage")+path.sep))throw new Error("Audit path must stay inside ignored coverage directory");
if(auditDir)fs.mkdirSync(auditDir,{recursive:true});
const screenshots=[];
const profile=fs.mkdtempSync(path.join(os.tmpdir(),"metemu-g6b3-chrome-"));
const children=[];let ws,logs="",exceptions=[],leaks=0;
const consoleProblems=[];
let mirror;
const samples=["2005-07-27","2005-09-18","2005-08-18","2005-07-28","2005-08-03","2005-08-21"];
const {loadTypeScriptModule}=await import("../samyoga-test-loader.mjs");
const {calculateOtonanCalendar}=loadTypeScriptModule("lib/otonan-calendar.ts");
const {analyzeSamyogaMemberPositions}=loadTypeScriptModule("lib/samyoga-member-positions.ts");
const {calculateSamyogaGroup}=loadTypeScriptModule("lib/samyoga-group.ts");
const {presentMemberPositions}=loadTypeScriptModule("lib/samyoga-position-presentation.ts");
let samFirstCharacter;
async function port(){return new Promise(resolve=>{const s=net.createServer();s.listen(0,"127.0.0.1",()=>{const p=s.address().port;s.close(()=>resolve(p));});});}
function start(exe,args,options={}){
 const child=spawn(exe,args,{cwd,windowsHide:true,stdio:["ignore","pipe","pipe"],...options});children.push(child);
 child.stdout?.on("data",x=>{logs=(logs+x).slice(-12000);});child.stderr?.on("data",x=>{logs=(logs+x).slice(-12000);});return child;
}
async function retry(fn,timeout=90000){const until=Date.now()+timeout;let last;while(Date.now()<until){try{const v=await fn();if(v)return v;}catch(e){last=e;}await delay(200);}throw new Error("Timeout: "+(last?.message??"condition"));}
let id=0;const pending=new Map();
function send(method,params={}){
 return new Promise((resolve,reject)=>{
  const n=++id,timer=setTimeout(()=>{pending.delete(n);reject(new Error(method+" timed out"));},30000);
  pending.set(n,{resolve:v=>{clearTimeout(timer);resolve(v);},reject:e=>{clearTimeout(timer);reject(e);}});
  ws.send(JSON.stringify({id:n,method,params}));
 });
}
async function evaluate(expression){const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw new Error(r.exceptionDetails.text);return r.result.value;}
async function wait(expression){try{return await retry(()=>evaluate(expression),60000);}catch{throw new Error("Condition timed out: "+expression);}}
async function click(text){
 const ok=await evaluate("(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes("+JSON.stringify(text)+"));if(!b||b.disabled)return false;b.click();return true;})()");
 assert(ok,"Button unavailable: "+text);
}
async function viewport(width){await send("Emulation.setDeviceMetricsOverride",{width,height:900,deviceScaleFactor:1,mobile:false});}
async function capture(selector,name){
 if(!auditDir)return;
 // Capture the real viewport at the target. This avoids beyond-viewport clipping
 // inconsistencies after keyboard focus, sticky headers and emulated resizes.
 const target=await evaluate("(()=>{document.activeElement?.blur();const el=document.querySelector("+JSON.stringify(selector)+");if(!el)return false;const y=el.getBoundingClientRect().top+scrollY;const header=document.querySelector('header')?.getBoundingClientRect().height??80;window.scrollTo({top:Math.max(0,y-header-16),left:0,behavior:'instant'});return true;})()");
 assert(target,"Screenshot target unavailable: "+selector);
 await delay(250);
 const size=await evaluate("({width:innerWidth,height:innerHeight})");
 const result=await send("Page.captureScreenshot",{format:"png",captureBeyondViewport:false});
 const filename=auditLabel+"-"+name+".png";
 fs.writeFileSync(path.join(auditDir,filename),Buffer.from(result.data,"base64"));
 screenshots.push({filename,selector,width:size.width,height:size.height,kind:"real-viewport-at-target"});
}
try{
 let serverCwd=cwd;
 if(mode==="development"){
  // Avoid touching an existing developer server or its .next/dev/lock.
  mirror=fs.mkdtempSync(path.join(os.tmpdir(),"metemu-g6b3-project-"));
  for(const name of ["app","components","lib","firebase","public","package.json","package-lock.json","tsconfig.json","next.config.ts","postcss.config.mjs","next-env.d.ts"]){
   const from=path.join(cwd,name);if(fs.existsSync(from))fs.cpSync(from,path.join(mirror,name),{recursive:true});
  }
  fs.symlinkSync(path.join(cwd,"node_modules"),path.join(mirror,"node_modules"),"junction");
  createRequire(import.meta.url)("@next/env").loadEnvConfig(cwd,true,{info(){},error(){}});
  serverCwd=mirror;
 }
 const webPort=await port(),chromePort=await port();
 const serverEnv={...process.env,NODE_ENV:mode};
 delete serverEnv.SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT;
 const server=start(process.execPath,[path.join(cwd,"node_modules/next/dist/bin/next"),mode==="development"?"dev":"start",...(mode==="development"?["--webpack"]:[]),"--hostname","127.0.0.1","--port",String(webPort)],{cwd:serverCwd,env:serverEnv});
 const url="http://127.0.0.1:"+webPort+"/pawongan-sinergi/kelompok";
 await retry(async()=>{if(server.exitCode!==null)throw new Error("Next exited "+server.exitCode);const r=await fetch(url,{signal:AbortSignal.timeout(5000)});return r.status===200;});
 console.log(JSON.stringify({stage:"server-ready",mode,port:webPort}));
 start("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",["--headless=new","--disable-gpu","--no-first-run","--no-default-browser-check","--disable-background-networking","--disable-component-update","--remote-debugging-port="+chromePort,"--user-data-dir="+profile,"about:blank"],{stdio:"ignore"});
 const target=await retry(async()=>{const r=await fetch("http://127.0.0.1:"+chromePort+"/json/new?about:blank",{method:"PUT"});return r.json();});
 ws=new WebSocket(target.webSocketDebuggerUrl);
 await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject;});
 ws.onmessage=event=>{
  const m=JSON.parse(event.data);
  if(m.id){const p=pending.get(m.id);if(p){pending.delete(m.id);if(m.error)p.reject(new Error(m.error.message));else p.resolve(m.result);}}
  if(m.method==="Runtime.exceptionThrown")exceptions.push(m.params.exceptionDetails.text);
  if(m.method==="Runtime.consoleAPICalled"&&["error","warning"].includes(m.params.type))consoleProblems.push({type:m.params.type,text:m.params.args.map(a=>a.value??a.description??"").join(" ").slice(0,1200)});
  if(m.method==="Fetch.requestPaused"){
   const host=new URL(m.params.request.url).hostname;
   const existingFont=["fonts.googleapis.com","fonts.gstatic.com"].includes(host);
   void send(existingFont?"Fetch.continueRequest":"Fetch.failRequest",existingFont?{requestId:m.params.requestId}:{requestId:m.params.requestId,errorReason:"BlockedByClient"}).catch(()=>{});
  }
  if(m.method==="Network.requestWillBeSent"){
   const data=(m.params.request.postData??"")+" "+m.params.request.url;
   if(samples.some(d=>data.includes(d))||data.includes("FixtureName")||data.includes("Anggota Uji"))leaks++;
  }
 };
 await send("Page.enable");await send("Runtime.enable");await send("Network.enable");
 await send("Page.bringToFront");await send("Emulation.setFocusEmulationEnabled",{enabled:true});
 // Block external telemetry; allow only the site's existing static font hosts for visual review.
 await send("Fetch.enable",{patterns:[{urlPattern:"https://*",requestStage:"Request"}]});
 await viewport(1440);await send("Page.navigate",{url});
 await wait("!!document.querySelector('form input[type=date]')");
 // SSR markup can precede hydration in a cold development compilation.
 await wait("(()=>{const f=document.querySelector('form');return f&&Object.keys(f).some(k=>k.startsWith('__reactProps$')&&typeof f[k].onSubmit==='function');})()");
 await delay(100);
 console.log(JSON.stringify({stage:"form-ready",mode}));
 const runs=[3,4,5,6].map(n=>samples.slice(0,n));
 runs.push(["2005-09-18","2005-07-27","2005-07-27"],["2005-08-03","2005-08-03","2005-08-01"]);
 if(auditDir)runs.push(["2005-07-30","2005-08-02","2005-08-18"],samples.slice(0,6));
 let runIndex=0;
 for(const dates of runs){
  runIndex++;
  const n=dates.length;
  while(await evaluate("document.querySelectorAll('form input[type=date]').length")<n)await click("Tambah anggota");
  const auditNames=!!auditDir&&runIndex<runs.length;
  await evaluate("(()=>{const dates="+JSON.stringify(dates)+",auditNames="+JSON.stringify(auditNames)+";const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;const datesEl=[...document.querySelectorAll('form input[type=date]')];datesEl.forEach((el,i)=>{for(const [element,value]of [[el,dates[i]],[document.getElementById(el.id.replace('-date','-name')),auditNames?'Anggota Uji '+String.fromCharCode(65+i):i===0?'FixtureName'+('LongLabel'.repeat(22)):'FixtureName'+i]]){setter.call(element,value);element.dispatchEvent(new Event('input',{bubbles:true}));element.dispatchEvent(new Event('change',{bubbles:true}));}});return true;})()");
  await wait("!document.querySelector('form button[type=submit]').disabled");
  if(runIndex===1){
   for(const [type,invalid,valid]of [["date","2023-02-29",dates[0]],["time","24:00","12:00"]]){
    await evaluate("(()=>{const el=document.querySelector('form input[type="+type+"]');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(el,"+JSON.stringify(invalid)+");el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
    await wait("document.querySelector('form button[type=submit]').disabled");
    await evaluate("(()=>{const el=document.querySelector('form input[type="+type+"]');const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;setter.call(el,"+JSON.stringify(valid)+");el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));return true;})()");
    await wait("!document.querySelector('form button[type=submit]').disabled");
   }
  }
  await click("Analisis Samyoga Group");
  assert(await evaluate("document.querySelector('form')===null"));
  await wait("!!document.getElementById('hasil-kelompok-title')");
  const groupInputs=dates.map((birthDate,i)=>({id:"member-"+(i+1),birthDate,birthTime:"12:00"}));
  const actualGroup=calculateSamyogaGroup(groupInputs);
  assert.equal(actualGroup.pairCount,n*(n-1)/2);
  for(const category of ["Utama","Madia","Nista"])assert(await evaluate("!!document.querySelector('[aria-label="+JSON.stringify(category+": "+actualGroup.categoryCounts[category])+"]')"));
  assert(!await evaluate("!!document.getElementById('rincian-samyoga-kelompok')"),"Pair details must start closed");
  {
   assert(!await evaluate("document.body.textContent.includes('Rekomendasi posisi belum diaktifkan')"));
   assert(await evaluate("!!document.getElementById('rekomendasi-posisi-title')"));
   assert.equal(await evaluate("document.querySelector('section[aria-labelledby=rekomendasi-posisi-title]').querySelectorAll('article').length"),n);
   const displayed=await evaluate("[...document.querySelectorAll('section[aria-labelledby=rekomendasi-posisi-title] article')].map(a=>({name:a.querySelector('[data-palintangan-name]').textContent,character:a.querySelector('[data-palintangan-character]').textContent.trim()}))");
   displayed.forEach((row,i)=>{const expected=calculateOtonanCalendar(dates[i],"12:00").lintang;assert.equal(row.name,"Lintang "+expected.lintang);assert.equal(row.character,expected.penjelasan);});
   if(dates[0]==="2005-07-27")samFirstCharacter=displayed[0].character;
   const input=dates.map((birthDate,i)=>({id:"member-"+(i+1),birthDate,birthTime:"12:00"}));
   const expected=analyzeSamyogaMemberPositions(input,calculateSamyogaGroup(input));
   const actual=await evaluate("[...document.querySelectorAll('[data-position-member]')].map(a=>({id:a.dataset.positionMember,chair:a.dataset.chairCandidate,participation:a.querySelector('[data-participation-status]')?.textContent??null,content:a.textContent,adjacent:a.querySelector('[data-lintang-box]').nextElementSibling===a.querySelector('details'),details:a.querySelectorAll('details').length,closed:!a.querySelector('details').open,summary:a.querySelector('summary').textContent.trim(),reasons:[...a.querySelectorAll('[data-position-reason]')].map(p=>p.textContent),issues:a.querySelectorAll('[data-mapping-issue]').length}))");
   actual.forEach((row,i)=>{
    const member=expected.memberResults[i],view=presentMemberPositions(member);
    assert.equal(row.id,member.memberId);assert.equal(row.chair,String(member.chairCandidate));
    assert.equal(row.participation,member.recommendedPositions.length?null:member.participationLabel);
    for(const label of member.recommendedPositions)assert(row.content.includes(label));
    assert(row.adjacent,"Disclosure must immediately follow Lintang");assert.equal(row.details,1);assert(row.closed);
    assert.equal(row.summary,member.recommendedPositions.length?"Mengapa posisi ini direkomendasikan?":"Mengapa belum ada rekomendasi?");
    assert.deepEqual(row.reasons,view.reasons.map(r=>r.label+": "+r.text));assert.equal(row.issues,0);
    for(const hidden of ["Profil parsial:","Jalur kepemimpinan","Reason codes:","mapping ambigu/disputed","C-PLAN-01","Dasawara"])assert(!row.content.includes(hidden));
   });
   assert.equal(await evaluate("document.querySelector('[data-chair-summary]').dataset.chairSummary"),expected.chair.status);
   console.log(JSON.stringify({stage:"position-results",members:n,recommended:expected.memberResults.filter(m=>m.recommendedPositions.length).length,unspecified:expected.memberResults.filter(m=>!m.recommendedPositions.length).length,chair:expected.chair.status,candidates:expected.chair.candidateMemberIds.length}));
   assert(await evaluate("document.querySelector('section[aria-labelledby=rekomendasi-posisi-title]').textContent.includes('belum divalidasi ahli')"));
   await evaluate("document.querySelector('section[aria-labelledby=rekomendasi-posisi-title] summary').focus()");
   await wait("document.activeElement===document.querySelector('section[aria-labelledby=rekomendasi-posisi-title] summary')");
   await send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:"\r",unmodifiedText:"\r"});
   await send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});
   await wait("document.querySelector('section[aria-labelledby=rekomendasi-posisi-title] details').open");
   assert(await evaluate("[...document.querySelectorAll('[data-position-member] details')].slice(1).every(d=>!d.open)"),"Position disclosures must be independent");
   await send("Input.dispatchKeyEvent",{type:"keyDown",key:" ",code:"Space",windowsVirtualKeyCode:32,nativeVirtualKeyCode:32,text:" ",unmodifiedText:" "});
   await send("Input.dispatchKeyEvent",{type:"keyUp",key:" ",code:"Space",windowsVirtualKeyCode:32});
   await wait("!document.querySelector('section[aria-labelledby=rekomendasi-posisi-title] details').open");
  }
  for(const width of [1440,390,320]){
   await viewport(width);await delay(150);
   const peerHeight=width===1440?await evaluate("document.querySelectorAll('[data-position-member]')[1].getBoundingClientRect().height"):null;
   await evaluate("document.querySelector('section[aria-labelledby=rekomendasi-posisi-title] details').open=true");
   if(peerHeight!==null){
    const expandedPeerHeight=await evaluate("document.querySelectorAll('[data-position-member]')[1].getBoundingClientRect().height");
    assert(Math.abs(peerHeight-expandedPeerHeight)<=1,"Opening evidence stretched a neighboring card");
   }
   const size=await evaluate("({viewport:innerWidth,page:document.documentElement.scrollWidth})");
   assert(size.page<=size.viewport+1,JSON.stringify({mode,n,width,size}));
   await evaluate("document.querySelector('section[aria-labelledby=rekomendasi-posisi-title] details').open=false");
   if(auditDir&&auditNames){
    const root="section[aria-labelledby=rekomendasi-posisi-title]";
    if(runIndex===4){
     await capture(root,"n6-panel-w"+width);
     await capture(root+" [data-position-member='member-1']","multiple-profiles-w"+width);
     await capture(root+" [data-position-member='member-3']","management-w"+width);
     if(auditLabel==="after"||auditLabel==="production"){
      await evaluate("document.querySelector(\"[data-position-member='member-3'] details\").open=true");
      await capture(root+" [data-position-member='member-3']","management-reason-w"+width);
      await evaluate("document.querySelector(\"[data-position-member='member-3'] details\").open=false");
     }
     await capture(root+" [data-position-member='member-4']","unspecified-w"+width);
     await capture(root+" [data-chair-summary]","no-chair-w"+width);
    }
    if(runIndex===5)await capture(root+" [data-position-member='member-1']","single-chair-w"+width);
    if(runIndex===6)await capture(root+" [data-chair-summary]","multiple-chair-w"+width);
    if(runIndex===7)await capture(root+" [data-position-member='member-1']","caution-review-w"+width);
   }
   if(auditDir&&mode==="production"&&n===6&&runIndex===4)await capture('[data-position-member]',"public-on-w"+width);
  }
  const pairButton="document.querySelector('button[aria-controls=rincian-samyoga-kelompok]')";
  await evaluate(pairButton+".focus()");
  await send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:"\r",unmodifiedText:"\r"});
  await send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});
  await wait("!!document.getElementById('rincian-samyoga-kelompok')");
  assert(await evaluate(pairButton+".getAttribute('aria-expanded')==='true'"));
  const pairRows=await evaluate("[...document.querySelectorAll('[data-samyoga-pair]')].map(a=>({key:a.dataset.samyogaPair,mods:[...a.querySelector('dl').querySelectorAll('dd')].map(x=>Number(x.textContent)),content:a.textContent,label:a.querySelector('[data-traditional-label]')?.textContent??null,meaning:a.querySelector('[data-traditional-meaning]')?.textContent??null,closed:!a.querySelector('details')?.open}))");
  assert.equal(pairRows.length,actualGroup.pairCount);
  pairRows.forEach((row,i)=>{
   const pair=actualGroup.pairs[i];assert.equal(row.key,pair.pairKey);assert.deepEqual(row.mods,[pair.modulo5,pair.modulo16]);
   assert(row.content.includes(pair.category));assert(row.content.includes("Dinamika Relasi Kelompok"));assert(row.closed);
   assert.equal(row.label,pair.sodasaRsi.label);assert.equal(row.meaning,pair.sodasaRsi.makna);
   if(pair.symbolicAttention)assert(row.content.includes("Perhatian simbolis:"));
  });
  const memberRows=await evaluate("[...document.querySelectorAll('#rincian-samyoga-kelompok article:not([data-samyoga-pair])')].map(a=>[...a.querySelectorAll('dd')].map(d=>Number(d.textContent)))");
  assert.deepEqual(memberRows,actualGroup.memberSummaries.map(m=>["Utama","Madia","Nista"].map(c=>m.categoryCounts[c])));
  await evaluate("document.querySelector('[data-traditional-reading] summary').focus()");
  await send("Input.dispatchKeyEvent",{type:"keyDown",key:"Enter",code:"Enter",windowsVirtualKeyCode:13,nativeVirtualKeyCode:13,text:"\r",unmodifiedText:"\r"});
  await send("Input.dispatchKeyEvent",{type:"keyUp",key:"Enter",code:"Enter",windowsVirtualKeyCode:13});
  await wait("document.querySelector('[data-traditional-reading]').open");
  assert(await evaluate("[...document.querySelectorAll('[data-traditional-reading]')].slice(1).every(d=>!d.open)"));
  for(const width of [1440,390,320]){
   await viewport(width);await delay(100);
   assert(await evaluate("document.documentElement.scrollWidth<=innerWidth+1"),"Expanded pair overflow");
   if(auditDir&&n===6&&runIndex===4)await capture("[data-samyoga-pair]","pair-traditional-w"+width);
  }
  await evaluate("document.querySelector('[data-traditional-reading] summary').focus()");
  await send("Input.dispatchKeyEvent",{type:"keyDown",key:" ",code:"Space",windowsVirtualKeyCode:32,nativeVirtualKeyCode:32,text:" ",unmodifiedText:" "});
  await send("Input.dispatchKeyEvent",{type:"keyUp",key:" ",code:"Space",windowsVirtualKeyCode:32});
  await wait("!document.querySelector('[data-traditional-reading]').open");
  await evaluate(pairButton+".focus()");
  await send("Input.dispatchKeyEvent",{type:"keyDown",key:" ",code:"Space",windowsVirtualKeyCode:32,nativeVirtualKeyCode:32,text:" ",unmodifiedText:" "});
  await send("Input.dispatchKeyEvent",{type:"keyUp",key:" ",code:"Space",windowsVirtualKeyCode:32});
  await wait("!document.getElementById('rincian-samyoga-kelompok')");
  assert(await evaluate(pairButton+".getAttribute('aria-expanded')==='false'"));
  await click("Lihat Detail Per Pasangan");
  assert(await evaluate("[...document.querySelectorAll('[data-traditional-reading]')].every(d=>!d.open)"),"Reopening unmounts old readings");
  console.log(JSON.stringify({stage:"pair-review-pass",mode,members:n,pairs:pairRows.length,memberSummaries:memberRows.length,categories:actualGroup.categoryCounts,traditionalExact:true,independent:true,keyboard:true}));

  await click("Analisis Ulang Samyoga Group");
  await wait("!!document.querySelector('form input[type=date]')");
  assert(!await evaluate("!!document.getElementById('rekomendasi-posisi-title')"));
  assert(await evaluate("[...document.querySelectorAll('form input[type=date],form input[type=text]')].every(el=>el.value==='')"));
  assert.equal(await evaluate("document.querySelectorAll('form input[type=date]').length"),3);
  console.log(JSON.stringify({stage:"flow-pass",mode,members:n,widths:[1440,390,320],keyboard:true,reset:true}));
 }
 assert.equal(leaks,0,"Test names/dates appeared in request bodies");
 if(auditDir)fs.writeFileSync(path.join(auditDir,auditLabel+"-screenshots.json"),JSON.stringify({mode,label:auditLabel,screenshots,consoleProblems},null,2)+"\n");
 const samyogaPrivateDataRequests=leaks;
 // Cross-feature UI parity under the timezone that exposed the legacy ISO-date bug.
 await send("Emulation.setTimezoneOverride",{timezoneId:"America/Los_Angeles"});
 await send("Page.navigate",{url:"http://127.0.0.1:"+webPort+"/ramalan-otonan"});
 await wait("(()=>{const b=[...document.querySelectorAll('button')].find(b=>b.textContent.includes('Lihat Ramalan'));return b&&Object.keys(b).some(k=>k.startsWith('__reactProps$')&&typeof b[k].onClick==='function');})()");
 await evaluate("(()=>{const setter=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;for(const [el,value]of [[document.querySelector('input[type=date]'),'2005-07-27'],[document.querySelector('input[type=time]'),'12:00']]){setter.call(el,value);el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}));}return true;})()");
 await click("Lihat Ramalan");
 await wait("[...document.querySelectorAll('h3')].some(h=>h.textContent==='Lintang Tiwa-tiwa')");
 const expectedCharacter=calculateOtonanCalendar("2005-07-27","12:00").lintang.penjelasan;
 assert(await evaluate("document.body.textContent.includes("+JSON.stringify(expectedCharacter)+")"));
 assert.equal(samFirstCharacter,expectedCharacter);
 await click("Cek Tanggal Lain");
 assert(await evaluate("document.querySelector('input[type=date]').value===''") );
 console.log(JSON.stringify({stage:"otonan-palintangan-parity",mode,timezone:"America/Los_Angeles",name:"Tiwa-tiwa",characterExact:true,reset:true}));
 assert.equal(exceptions.length,0,JSON.stringify(exceptions));
 console.log(JSON.stringify({stage:"complete",mode,uncaughtExceptions:exceptions.length,samyogaPrivateDataRequests,otonanExistingLogRequests:leaks-samyogaPrivateDataRequests,internalFlagPresent:Object.hasOwn(serverEnv,"SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT"),query:new URL(url).search,consoleProblems}));
}catch(error){console.error(error.message);if(ws?.readyState===1)try{console.error(JSON.stringify(await evaluate("({url:location.href,title:document.title,forms:document.forms.length,body:document.body.innerText.slice(0,700)})")));}catch{}console.error(JSON.stringify({exceptions}));console.error(logs);process.exitCode=1;}
finally{
 ws?.close();
 for(const c of children.reverse())if(c.exitCode===null){if(process.platform==="win32")spawnSync("taskkill",["/PID",String(c.pid),"/T","/F"],{windowsHide:true,stdio:"ignore"});else c.kill();}
 await delay(400);
 const resolved=path.resolve(profile),temp=path.resolve(os.tmpdir())+path.sep;
 if(!resolved.startsWith(temp)||!path.basename(resolved).startsWith("metemu-g6b3-chrome-"))throw new Error("Unsafe temporary profile path");
 try{fs.rmSync(resolved,{recursive:true,force:true,maxRetries:6,retryDelay:200});}catch{console.error("Temporary test profile cleanup incomplete");process.exitCode=1;}
 if(mirror){
  const target=path.resolve(mirror);
  if(!target.startsWith(temp)||!path.basename(target).startsWith("metemu-g6b3-project-"))throw new Error("Unsafe temporary project path");
  // Unlink the dependency junction before removing only our temporary copy.
  fs.unlinkSync(path.join(target,"node_modules"));
  fs.rmSync(target,{recursive:true,force:true,maxRetries:6,retryDelay:200});
 }
}
