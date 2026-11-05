import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {createRequire} from "node:module";
import test from "node:test";
import ts from "typescript";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {loadTypeScriptModule as load,projectRoot} from "./samyoga-test-loader.mjs";
const req=createRequire(import.meta.url),read=f=>fs.readFileSync(path.join(projectRoot,f),"utf8");
const group=load("lib/samyoga-group.ts"),form=load("lib/samyoga-group-form.ts");
const rules=load("lib/samyoga-position-experiment-rules.ts");
function component(file){
 const filename=path.join(projectRoot,file),mod={exports:{}};
 const code=ts.transpileModule(read(file),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true},fileName:filename}).outputText;
 new Function("exports","require","module",code)(mod.exports,s=>{
  if(s.startsWith("@/lib/"))return load(s.slice(2)+".ts");
  if(s.startsWith(".")){
   const base=path.resolve(path.dirname(filename),s);
   return fs.existsSync(base+".ts")?load(path.relative(projectRoot,base+".ts")):component(path.relative(projectRoot,base+".tsx"));
  }
  return req(s);
 },mod);
 return mod.exports.default;
}
const Panel=component("components/samyoga-group/SamyogaGroupPositionExperiment.tsx");
const Results=component("components/samyoga-group/SamyogaGroupResults.tsx");
const members=["2005-09-18","2005-07-27","2005-07-27"].map((birthDate,i)=>({id:"m"+i,displayName:"Calendar fixture "+i,birthDate,birthTime:"12:00"}));
const props={members,result:group.calculateSamyogaGroup(members),onAnalyzeAgain(){}};
test("Legacy internal gate remains restrictive and is not used by the public group route",()=>{
 const source=read("lib/samyoga-internal-beta.server.ts"),mod={exports:{}};
 assert(source.includes('import "server-only"'));
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
 new Function("exports","require","module",code)(mod.exports,s=>{assert.equal(s,"server-only");return{};},mod);
 const gate=mod.exports.isSamyogaPositionExperimentEnabled;
 const previous=[process.env.NODE_ENV,process.env.SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT];
 try{
  for(const[node,flag,on]of [["development","",false],["development","true",false],["development","1",true],["production","1",false],["test","1",false]]){
   process.env.NODE_ENV=node;process.env.SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT=flag;assert.equal(gate(),on);
  }
  assert.equal(gate.length,0);
 }finally{
  ["NODE_ENV","SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT"].forEach((key,i)=>{if(previous[i]===undefined)delete process.env[key];else process.env[key]=previous[i];});
 }
 const page=read("app/pawongan-sinergi/kelompok/page.tsx");
 assert.doesNotMatch(page,/isSamyogaPositionExperimentEnabled|samyoga-internal-beta|process\.env|searchParams|cookies\(|headers\(|NEXT_PUBLIC_/);
});

test("Public UI: page always renders the experimental client without requiring environment or query flags",()=>{
 const source=read("app/pawongan-sinergi/kelompok/page.tsx"),mod={exports:{}};
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 new Function("exports","require","module",code)(mod.exports,s=>{
  if(s==="@/components/samyoga-group/ExperimentalSamyogaGroupClient")return{__esModule:true,default:()=>React.createElement("div",{"data-public-position-entry":true})};
  if(s==="@/components/Header"||s==="@/components/Footer")return{__esModule:true,default:()=>null};
  return req(s);
 },mod);
 const previous=[process.env.NODE_ENV,process.env.SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT];
 try{
  for(const node of ["development","production"])for(const flag of [undefined,"0","1"]){
   process.env.NODE_ENV=node;
   if(flag===undefined)delete process.env.SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT;else process.env.SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT=flag;
   const html=renderToStaticMarkup(React.createElement(mod.exports.default));
   assert(html.includes("data-public-position-entry"));assert(!html.includes("Rekomendasi posisi belum diaktifkan"));
  }
 }finally{
  ["NODE_ENV","SAMYOGA_INTERNAL_POSITIONS_EXPERIMENT"].forEach((key,i)=>{if(previous[i]===undefined)delete process.env[key];else process.env[key]=previous[i];});
 }
 const client=read("components/samyoga-group/ExperimentalSamyogaGroupClient.tsx");
 assert.match(client,/<SamyogaGroupClient renderPositions=\{renderPositions\}/);
 assert.match(client,/<SamyogaGroupPositionExperiment members=\{members\} result=\{result\}/);
 assert.doesNotMatch(client,/process\.env|searchParams|localStorage/);
});
test("G6B3 UI: disclaimer visible outside native keyboard disclosure, without audit dump",()=>{
 const html=renderToStaticMarkup(React.createElement(Panel,props));
 assert(html.split("<details")[0].includes(rules.POSITION_EXPERIMENT_DISCLAIMER));
 for(const text of ["Rekomendasi Posisi Anggota","Eksperimental","Evidence belum diverifikasi","Mengapa posisi ini direkomendasikan?","Lintang Tiwa-tiwa"])assert(html.includes(text));
 assert.match(html,/<details[^>]*><summary/);
});
test("Public UI: position slot lies after hero before pair details; bare shared renderer retains its fallback",()=>{
 const off=renderToStaticMarkup(React.createElement(Results,props));
 assert(off.includes("Rekomendasi posisi belum diaktifkan"));assert(!off.includes("rekomendasi-posisi-title"));
 const on=renderToStaticMarkup(React.createElement(Results,{...props,positionExperiment:React.createElement(Panel,props)}));
 assert(on.indexOf("Hasil Keseluruhan Samyoga Kelompok")<on.indexOf("Rekomendasi Posisi Anggota"));
 assert(on.indexOf("Rekomendasi Posisi Anggota")<on.indexOf("Lihat Detail Per Pasangan"));
});
test("G6B3 UI: reset clears position result source and experiment adds no persistence/transport",()=>{
 const reset=form.reduceSamyogaGroupFormState({...props,errors:form.EMPTY_SAMYOGA_GROUP_FORM_ERRORS},{type:"reset-form"});
 assert.equal(reset.result,null);
 const source=["lib/samyoga-position-experiment.ts","lib/samyoga-position-experiment-rules.ts","lib/samyoga-position-presentation.ts","components/samyoga-group/SamyogaGroupPositionExperiment.tsx","components/samyoga-group/ExperimentalSamyogaGroupClient.tsx"].map(read).join("\n");
 assert.doesNotMatch(source,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|firebase|analytics|console\./i);
 assert.doesNotMatch(source,/tests\/fixtures|samyoga-chair-prototype|provenanceStatus:\s*["']verified/);
});

test("G6B5 UI: all 3-6 member cards show source-based results including non-specific participation",()=>{
 const dates=["2005-07-27","2005-09-18","2005-08-18","2005-07-28","2005-08-03","2005-08-21"];
 for(const n of [3,4,5,6]){
  const input=dates.slice(0,n).map((birthDate,i)=>({id:"m"+i,displayName:"Member "+i,birthDate,birthTime:"12:00"}));
  const result=group.calculateSamyogaGroup(input);
  const html=renderToStaticMarkup(React.createElement(Panel,{members:input,result}));
  assert.equal((html.match(/data-position-member=/g)??[]).length,n);
  assert(html.includes("Lintang Tiwa-tiwa"));assert(html.includes("Manajemen"));
  if(n>=4){
   assert(html.includes("Anggota Kelompok — Kecenderungan posisi belum spesifik."));
   assert(html.includes("Mengapa belum ada rekomendasi?"));
  }
 }
});

test("Final UI: audit data remains in the evaluator rather than the disclosure",()=>{
 const input=["2005-07-30","2005-08-02","2005-08-18"].map((birthDate,i)=>({id:"m"+i,birthDate,birthTime:"12:00",displayName:"Fixture "+i}));
 const html=renderToStaticMarkup(React.createElement(Panel,{members:input,result:group.calculateSamyogaGroup(input)}));
 for(const text of ["Konteks caution dan review","Profil parsial:","Jalur kepemimpinan","mapping ambigu/disputed","Tafsir Bali asli dari engine","Reason codes:","C-PLAN-02","g6b5-otonan-contribution-v1","Comparator Otonan: UNKNOWN"])assert(!html.includes(text),text);
 assert(html.includes("Sangat tangkas dalam bekerja"));
 assert.match(html,/<details[^>]*><summary/);
});

test("G6B5 UI: invalid graph displays an error without fabricated member recommendations",()=>{
 const html=renderToStaticMarkup(React.createElement(Panel,{...props,result:{...props.result,pairs:[]}}));
 assert(html.includes('role="alert"'));assert(!html.includes("data-position-member="));
});

test("G6B6 UI: contribution profiles and symbolic chair proposal have distinct sections above original text",()=>{
 const html=renderToStaticMarkup(React.createElement(Panel,props));
 const cards=[...html.matchAll(/<article[^>]*data-position-member="[^"]*"[\s\S]*?<\/article>/g)].map(m=>m[0]);
 assert.equal(cards.length,3);
 const contributions=cards[0].match(/<div data-contribution-profiles[^>]*>([\s\S]*?)<\/div>/)[1];
 assert(contributions.includes("Komunikasi"));assert(contributions.includes("Kolaborasi"));
 assert(!contributions.includes("Kandidat Ketua"));
 assert(cards[0].includes("data-chair-proposal"));assert(cards[0].includes("Kandidat Ketua simbolis"));
 assert(cards[0].indexOf("data-contribution-profiles")<cards[0].indexOf("data-palintangan-character"));
 assert(!cards[1].includes("data-chair-proposal"));assert(!cards[2].includes("data-chair-proposal"));
});

test("Final UI: concise reasons cite actual sources and follow Lintang immediately",()=>{
 const input=Array.from({length:3},(_,i)=>({id:"m"+i,displayName:"Audit "+i,birthDate:"2005-08-18",birthTime:"12:00"}));
 const html=renderToStaticMarkup(React.createElement(Panel,{members:input,result:group.calculateSamyogaGroup(input)}));
 const sections=[...html.matchAll(/<p data-position-reason="Manajemen"[^>]*>([\s\S]*?)<\/p>/g)].map(m=>m[1]);
 assert.equal(sections.length,3);
 for(const content of sections){
  assert(content.includes("Wewaran Indra"));assert(content.includes("berbakat dalam perencanaan"));
  assert(content.includes("Wewaran Beteng"));assert(content.includes("pandai mengelola sumber daya"));
  assert(!content.includes("C-PLAN-01"));assert(!content.includes("Dasawara"));
 }
 assert.equal((html.match(/<\/blockquote><\/div><details/g)??[]).length,3);
 assert.equal((html.match(/<details/g)??[]).length,3);
 assert.doesNotMatch(html,/<details[^>]*\sopen(?:[\s=>])/);
 assert(!html.includes("data-profile-support"));assert(!html.includes("data-profile-evidence-for"));
});
