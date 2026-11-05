import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import {spawnSync} from "node:child_process";
import test from "node:test";
import {loadTypeScriptModule as load,createCivilDate,projectRoot} from "./samyoga-test-loader.mjs";
const o=load("lib/otonan-calendar.ts"),p=load("lib/samyoga-palintangan.ts");
const g=load("lib/samyoga-group.ts"),e=load("lib/samyoga-position-experiment.ts");
const rules=load("lib/samyoga-palintangan-experiment-rules.ts"),data=load("lib/data.ts");
const make=dates=>dates.map((birthDate,i)=>({id:"m"+i,displayName:"Palintangan fixture "+i,birthDate,birthTime:"12:00"}));
const run=members=>e.analyzeExperimentalSamyogaPositions(members,g.calculateSamyogaGroup(members));
const sample=date=>run(make([date,date,date])).memberResults[0];
const fixtures=new Map();
for(let i=0;i<210;i++){
 const d=createCivilDate(2005,7,27);d.setDate(d.getDate()+i);
 const date=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
 const r=p.createSamyogaPalintanganProfile({id:"fixture",birthDate:date,birthTime:"12:00"});
 if(!fixtures.has(r.masterRecordId))fixtures.set(r.masterRecordId,date);
}
test("R1 Palintangan: inventory is 35 unique identities, read-only and not duplicated master",()=>{
 const before=JSON.stringify(data.dataLintang),list=p.listPalintanganMasterIdentities();
 assert.equal(list.length,35);assert.equal(new Set(list.map(x=>x.masterRecordId)).size,35);assert.equal(fixtures.size,35);
 assert(Object.isFrozen(list));assert(list.every(Object.isFrozen));assert.equal(JSON.stringify(data.dataLintang),before);
});
test("R1 Palintangan: all 35 engine identities and original text equal the Otonan shared calculation",()=>{
 for(const [key,date]of fixtures)for(const time of ["05:59","06:00","12:00"]){
  const expected=o.calculateOtonanCalendar(date,time).lintang;
  const profile=p.createSamyogaPalintanganProfile({id:key,birthDate:date,birthTime:time});
  assert.equal(profile.name,expected.lintang);assert.equal(profile.originalCharacter,expected.penjelasan);
  assert.equal(profile.label,expected.label);assert.equal(profile.meaning,expected.makna);
  assert.equal(profile.masterRecordId,"lintang:"+expected.saptawara+":"+expected.pancawara);
  assert.equal(profile.provenanceStatus,"missing");assert.equal(profile.culturalReviewStatus,"pending");
 }
});
test("R1 Palintangan: only three explicit catalogue mappings are active; no keyword matching",()=>{
 assert.deepEqual(rules.EXPERIMENT_POSITION_EVIDENCE.map(x=>x.evidenceId),["C-COMM-03","C-COMM-04","C-EXEC-04"]);
 assert(rules.EXPERIMENT_POSITION_EVIDENCE.every(x=>x.indicatorType==="lintang"&&x.provenanceStatus==="missing"));
 for(const date of fixtures.values()){
  const r=sample(date);assert(r.evidence.every(x=>x.indicatorType==="lintang"));
  assert.equal(r.calculatedIndicators.length,1);assert.equal(r.calculatedIndicators[0].indicatorType,"lintang");
 }
});
test("R1 Palintangan: actual Tiwa-tiwa is communication support with original sensitivity retained",()=>{
 const r=sample("2005-07-27");assert.equal(r.palintangan.name,"Tiwa-tiwa");
 assert.deepEqual(r.evidence.map(x=>x.evidenceId),["C-COMM-03"]);
 assert.deepEqual(r.supportedDimensions,["communicating"]);assert.equal(r.profiles.find(x=>x.profile==="Leader").status,"partial");
 assert(r.palintangan.originalCharacter.includes("sensitif dan mudah tersinggung"));
});
test("R1 Palintangan: Kukus is limited Operasional, not fabricated Manajemen",()=>{
 const r=sample("2005-08-08");assert.equal(r.palintangan.name,"Kukus");
 assert.equal(r.profiles.find(x=>x.profile==="Operasional").status,"matched");
 assert.equal(r.profiles.find(x=>x.profile==="Manajemen").status,"unsupported");
 assert.match(r.profiles.find(x=>x.profile==="Operasional").scopeNote,/belum lengkap/);
});
test("R1 Palintangan: Begoong caution is distinct from positive support",()=>{
 const r=sample("2005-08-27");assert.equal(r.palintangan.name,"Begoong");
 assert.equal(r.status,"caution_only");assert.deepEqual(r.cautionDimensions,["communicating"]);
 assert.deepEqual(r.supportedDimensions,[]);assert(!r.profiles.some(p=>p.status==="matched"));
});
test("R1 Palintangan: an ambiguous/unmapped Gajah keeps its full text with no invented profile",()=>{
 const r=sample("2005-08-28");assert.equal(r.palintangan.name,"Gajah");
 assert.equal(r.status,"no_matching_evidence");assert.equal(r.evidence.length,0);
 assert.equal(r.palintangan.originalCharacter,o.calculateOtonanCalendar("2005-08-28","12:00").lintang.penjelasan);
});
test("R1 Palintangan: changed text cannot create a mapped assertion",()=>{
 const original=p.createSamyogaPalintanganProfile({id:"m",birthDate:"2005-07-27",birthTime:"12:00"});
 const changed={...original,originalCharacter:original.originalCharacter+" different"};
 assert.equal(e.inspectExperimentalPalintanganProfile(changed).evidence.length,0);
});
test("R1 Palintangan: Leader/Manajemen unsatisfied coverage is explicit for all 35 identities",()=>{
 assert.deepEqual(rules.PALINTANGAN_PROFILE_COVERAGE.map(c=>[c.profile,c.canCompleteWithCurrentMappings]),[["Leader",false],["Manajemen",false],["Operasional",true]]);
 for(const date of fixtures.values())assert(!sample(date).profiles.some(p=>["Leader","Manajemen"].includes(p.profile)&&p.status==="matched"));
});
test("R1 Palintangan: former multi-candidate group has no Palintangan Leader, never gets count fallback",()=>{
 const members=make(["2005-09-18","2005-10-30","2005-07-27","2005-07-27","2005-07-27","2005-07-30"]),r=run(members);
 assert.equal(r.memberResults[0].samyogaGate.counts.Utama,4);assert.equal(r.memberResults[1].samyogaGate.counts.Utama,3);
 assert.equal(r.chair.status,"no_candidate");assert.equal(r.chair.comparatorStatus,"UNKNOWN");assert.equal(r.chair.deputyMemberId,null);
 assert(!r.memberResults.some(m=>m.leaderGate));
});
test("R1 Palintangan: group size/order/name do not change individual profile",()=>{
 const members=make(["2005-07-27","2005-08-08","2005-08-27","2005-08-28","2005-07-27","2005-08-08"]);
 for(const n of [3,4,5,6]){
  const a=run(members.slice(0,n)),b=run(members.slice(0,n).reverse().map(m=>({...m,displayName:"Other "+m.id})));
  assert.equal(a.memberResults.length,n);assert.equal(a.status,"analyzed");
  for(const row of a.memberResults){
   assert.deepEqual(row.palintangan,b.memberResults.find(x=>x.memberId===row.memberId).palintangan);
   assert.deepEqual(row.profiles,b.memberResults.find(x=>x.memberId===row.memberId).profiles);
   assert.equal(row.palintangan.originalCharacter,p.createSamyogaPalintanganProfile(members.find(m=>m.id===row.memberId)).originalCharacter);
  }
 }
});
test("R1 Palintangan: boundary adjustment happens exactly once through shared engine",()=>{
 const members=make(["2005-07-27","2005-07-27","2005-07-27"]);
 const a=run(members.map(m=>({...m,birthTime:"05:59"}))),b=run(members.map(m=>({...m,birthTime:"06:00"})));
 assert(a.memberResults.every(r=>r.baliDayBoundaryApplied));assert(b.memberResults.every(r=>!r.baliDayBoundaryApplied));
 assert.notEqual(a.memberResults[0].palintangan.name,b.memberResults[0].palintangan.name);
});
test("R1 Palintangan: invalid date/time and stale graph produce structured errors",()=>{
 const good=make(["2005-07-27","2005-08-08","2005-08-27"]),graph=g.calculateSamyogaGroup(good);
 for(const change of [{birthDate:"2023-02-29"},{birthTime:"25:00"}]){
  const bad=good.map((m,i)=>i===0?{...m,...change}:m);assert.equal(e.analyzeExperimentalSamyogaPositions(bad,graph).status,"error");
 }
 assert.equal(e.analyzeExperimentalSamyogaPositions(good,{...graph,pairs:[]}).status,"error");
});
test("R1 Palintangan: unrelated user profile fields cannot change eligibility or explanation",()=>{
 const members=make(["2005-07-27","2005-08-08","2005-08-27"]),a=run(members);
 assert.deepEqual(run(members.map(m=>({...m,zodiak:{name:"arbitrary",leader:true},approved:true,rank:1}))),a);
 const files=["lib/otonan-calendar.ts","lib/samyoga-palintangan.ts","lib/samyoga-palintangan-experiment-rules.ts","lib/samyoga-position-experiment.ts","components/samyoga-group/SamyogaGroupPositionExperiment.tsx"];
 const source=files.map(f=>fs.readFileSync(path.join(projectRoot,f),"utf8")).join("\n");
 assert.doesNotMatch(source,/getZodiak|jodoh-logic|\.zodiak|zodiak\s*:/i);
});
test("R1 Palintangan: all 35 profiles are identical across Makassar and Los Angeles",()=>{
 const code="import{loadTypeScriptModule as l}from'./tests/samyoga-test-loader.mjs';import crypto from'node:crypto';const p=l('lib/samyoga-palintangan.ts');const dates="+JSON.stringify([...fixtures.values()])+";console.log(crypto.createHash('sha256').update(JSON.stringify(dates.flatMap(date=>['05:59','06:00','12:00'].map(time=>p.createSamyogaPalintanganProfile({id:'fixture',birthDate:date,birthTime:time}))))).digest('hex'));";
 const out=["Asia/Makassar","America/Los_Angeles"].map(TZ=>{
  const r=spawnSync(process.execPath,["--input-type=module","-e",code],{cwd:projectRoot,env:{...process.env,TZ},encoding:"utf8"});assert.equal(r.status,0,r.stderr);return r.stdout.trim();
 });assert.equal(out[0],out[1]);assert.equal(out[0].length,crypto.createHash("sha256").digest("hex").length);
});
