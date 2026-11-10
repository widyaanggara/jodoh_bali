import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';
import {projectRoot} from './samyoga-test-loader.mjs';
const require=createRequire(import.meta.url);
const pause=()=>new Promise(resolve=>setTimeout(resolve,5));
const members=[{id:'a',birthDate:'2025-07-06',birthTime:'12:00'},{id:'b',birthDate:'2025-02-04',birthTime:'12:00'},{id:'c',birthDate:'2025-12-01',birthTime:'12:00'}];
// Deterministic hook scheduler: real hook code, controlled account updates/network,
// dependency cleanup and rerenders. No tokens, dates or names in diagnostics.
function harness(){
 const slots=[],effects=[];let cursor=0,dirty=false,output,props=members;
 const account={uid:'test-owner',loading:false,busy:false};
 const react={
  useState(initial){const i=cursor++;if(!(i in slots))slots[i]=typeof initial==='function'?initial():initial;return [slots[i],value=>{slots[i]=typeof value==='function'?value(slots[i]):value;dirty=true;}];},
  useRef(initial){const i=cursor++;return slots[i]??(slots[i]={current:initial});},
  useMemo(fn,deps){const i=cursor++,old=slots[i];if(!old||deps.some((d,n)=>!Object.is(d,old.deps[n])))slots[i]={deps,value:fn()};return slots[i].value;},
  useEffect(fn,deps){const i=cursor++,old=slots[i];if(!old||deps.some((d,n)=>!Object.is(d,old.deps[n]))){slots[i]={deps,cleanup:old?.cleanup};effects.push(()=>{slots[i].cleanup?.();slots[i].cleanup=fn();});}},
 };
 const file=path.join(projectRoot,'hooks/useSamyogaCareer.ts');
 const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022},fileName:file}).outputText;
 const mod={exports:{}};
 new Function('exports','require','module',code)(mod.exports,spec=>spec==='react'?react:spec.includes('NetraAccountProvider')?{useNetraAccount:()=>account}:spec.includes('career-contract')?{CAREER_METHOD_VERSION:'twg-gemet-v1'}:require(spec),mod);
 const hook=mod.exports.useSamyogaCareer;
 function render(){let count=0;do{dirty=false;cursor=0;output=hook(props);if(++count>20)throw Error('Render loop');}while(dirty);while(effects.length)effects.shift()();return output;}
 return {account,get value(){return output;},render,setMembers(value){props=value;render();},async flush(){for(let i=0;i<4;i++){await pause();render();}},close(){for(const slot of slots)slot?.cleanup?.();}};
}
function network(t){
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=(_url,options)=>new Promise((resolve,reject)=>{const call={action:JSON.parse(options.body).action,signal:options.signal,resolve:body=>resolve(Response.json(body)),reject};calls.push(call);});
 t.after(()=>{globalThis.fetch=original;});return calls;
}
function grant(){return {verifiedUid:'test-owner',groupId:'test-group',grant:'opaque',expiresAt:Math.floor(Date.now()/1000)+60};}
function reading(input=members){return {...grant(),validForMs:59000,methodVersion:'twg-gemet-v1',members:input.map(m=>({memberId:m.id,reading:{methodVersion:'twg-gemet-v1',status:'interpreted',explanation:'Test only',professions:[],explicitlyPreferred:null,reference:{printedPages:[],pdfPages:[]}}}))};}
async function open(h,calls){h.value.load();h.render();await h.flush();calls.at(-1).resolve(grant());await h.flush();calls.at(-1).resolve(reading());await h.flush();}
test('Career click immediately locks verification and rapid clicks use one flight',async t=>{
 const calls=network(t),h=harness();t.after(()=>h.close());h.render();
 h.value.load();h.render();assert.equal(h.value.busy,true,'busy must start in click render, before deferred work');
 h.value.load();h.value.load();h.render();await h.flush();assert.equal(calls.length,1);
 calls[0].resolve(grant());await h.flush();assert.equal(calls.length,2);calls[1].resolve(reading());await h.flush();assert(h.value.data);
 h.value.load();h.render();await h.flush();assert.equal(calls.length,2,'ready result does not request again');
});
test('Career cannot start before account loading/busy completes; fresh login opens in one click',async t=>{
 const calls=network(t),h=harness();t.after(()=>h.close());h.account.busy=true;h.render();h.value.load();h.render();await h.flush();assert.equal(calls.length,0);
 h.account.busy=false;h.render();await open(h,calls);assert(h.value.data);assert.equal(calls.length,2);
});
test('Career logout and immediate relogin cannot reuse old activation/result',async t=>{
 const calls=network(t),h=harness();t.after(()=>h.close());h.render();await open(h,calls);assert(h.value.data);
 h.account.uid=null;h.render();assert.equal(h.value.data,null);h.account.uid='test-owner';h.render();assert.equal(h.value.data,null);await open(h,calls);assert(h.value.data);assert.equal(calls.length,4);
});
test('Career late old response after member change/return never opens or clears a newer flight',async t=>{
 const calls=network(t),h=harness();t.after(()=>h.close());h.render();h.value.load();h.render();await h.flush();calls[0].resolve(grant());await h.flush();const old=calls[1];
 h.setMembers(members.map((m,i)=>i?m:{...m,birthDate:'2025-07-07'}));assert.equal(h.value.data,null);assert.equal(old.signal.aborted,true);
 h.setMembers(members);h.value.load();h.render();await h.flush();old.resolve(reading());await h.flush();assert.equal(h.value.data,null);assert.equal(h.value.busy,true);
 calls[2].resolve(grant());await h.flush();calls[3].resolve(reading());await h.flush();assert(h.value.data);
});
for(const status of [401,403,500])test('Career HTTP '+status+' shows retry error and unlocks loading',async t=>{
 const original=globalThis.fetch;let n=0;globalThis.fetch=async()=>{n++;return Response.json({}, {status});};t.after(()=>globalThis.fetch=original);
 const h=harness();t.after(()=>h.close());h.render();h.value.load();h.render();await h.flush();assert.equal(h.value.busy,false);assert(h.value.error);assert.equal(h.value.reauthenticate,status===401);assert.equal(h.value.data,null);
 h.value.load();h.render();await h.flush();assert.equal(n,2);
});
test('Career network timeout exposes retry and does not leave loading stuck',async t=>{
 const calls=network(t),h=harness();t.after(()=>h.close());h.render();h.value.load();h.render();await h.flush();calls[0].reject(new DOMException('Timeout','TimeoutError'));await h.flush();assert.equal(h.value.busy,false);assert.match(h.value.error,/waktu|koneksi/i);h.value.load();h.render();await h.flush();assert.equal(calls.length,2);
});
test('Career permission withdrawal aborts and ignores response even when network ignores abort',async t=>{
 const calls=network(t),h=harness();t.after(()=>h.close());h.render();h.value.load();h.render();await h.flush();h.value.clear();h.render();assert(calls[0].signal.aborted);calls[0].resolve(grant());await h.flush();assert.equal(h.value.data,null);assert.equal(calls.length,1);
});
for(const offset of [-2000,660000])test('Career valid HTTP200 result accepts server lifetime with client clock offset '+offset,async t=>{
 const realNow=Date.now,expiresAt=Math.floor(realNow()/1000)+600;
 const calls=network(t),h=harness();t.after(()=>{h.close();Date.now=realNow;});
 h.render();h.value.load();h.render();await h.flush();calls[0].resolve(grant());await h.flush();
 Date.now=()=>realNow()+offset;
 calls[1].resolve({...reading(),expiresAt,validForMs:599000});await h.flush();
 assert(h.value.data,'both HTTP200 responses were valid; local wall clock must not reject the result');
});

test('Career missing/out-of-range server lifetime cannot unlock an HTTP200 result',async t=>{
 const calls=network(t),h=harness();t.after(()=>h.close());h.render();
 for(const validForMs of [undefined,0,-1,600001]){
  h.value.load();h.render();await h.flush();calls.at(-1).resolve(grant());await h.flush();calls.at(-1).resolve({...reading(),validForMs});await h.flush();assert.equal(h.value.data,null);assert(h.value.error);
 }
});
test('Career response whose server lifetime elapsed in transit stays locked',async t=>{
 const calls=network(t),h=harness();t.after(()=>h.close());h.render();h.value.load();h.render();await h.flush();calls[0].resolve(grant());await h.flush();calls[1].resolve({...reading(),validForMs:1});await h.flush();assert.equal(h.value.data,null);assert(h.value.error);
});
