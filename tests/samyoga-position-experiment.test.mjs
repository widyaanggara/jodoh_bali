import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { createCivilDate, loadTypeScriptModule as load, projectRoot } from "./samyoga-test-loader.mjs";
// Preserve G6B.3 multi-indicator regression as an explicitly archived baseline.
const ex=load("lib/samyoga-position-experiment-baseline-g6b3.ts"), rules=load("lib/samyoga-position-experiment-rules.ts");
const cal=load("lib/samyoga-calendar-snapshot.ts"), group=load("lib/samyoga-group.ts");
const registry=load("lib/samyoga-position-evidence.ts"), production=load("lib/samyoga-position-recommendation.ts");
const make=dates=>dates.map((birthDate,i)=>({id:String.fromCharCode(97+i),displayName:"Calendar fixture "+i,birthDate,birthTime:"12:00"}));
const run=m=>ex.analyzeExperimentalSamyogaPositions(m,group.calculateSamyogaGroup(m));
const inspect=date=>ex.inspectExperimentalOtonanSnapshot(cal.createSamyogaGroupCalendarSnapshots(make([date,date,date]))[0]);
const single=make(["2005-09-18","2005-07-27","2005-07-27"]);
// Inputs discovered through a 210-day scan of the existing engine, not human subjects or invented graphs.
const multiple=[{"id":"a","displayName":"Calendar fixture 0","birthDate":"2005-09-18","birthTime":"12:00"},{"id":"b","displayName":"Calendar fixture 1","birthDate":"2005-10-30","birthTime":"12:00"},{"id":"c","displayName":"Calendar fixture 2","birthDate":"2005-07-27","birthTime":"12:00"},{"id":"d","displayName":"Calendar fixture 3","birthDate":"2005-07-27","birthTime":"12:00"},{"id":"e","displayName":"Calendar fixture 4","birthDate":"2005-07-27","birthTime":"12:00"},{"id":"f","displayName":"Calendar fixture 5","birthDate":"2005-07-30","birthTime":"12:00"}];
test("G6B3: 22 mappings preserve exact catalogue data, pending reviews and dependencies",()=>{
 const catalog=[...fs.readFileSync(path.join(projectRoot,"docs/samyoga-position-evidence-catalog.md"),"utf8").matchAll(/\x60{3}json\r?\n([\s\S]*?)\r?\n\x60{3}/g)].map(m=>JSON.parse(m[1]));
 assert.equal(rules.EXPERIMENT_POSITION_EVIDENCE.length,22);
 for(const e of rules.EXPERIMENT_POSITION_EVIDENCE){
  const original=catalog.find(r=>r.evidenceId===e.evidenceId);
  for(const key of ["indicatorType","wewaranCycle","indicatorValue","masterRecordId","sourceField","excerpt","dimension","polarity","sourceId","sourcePage","provenanceStatus","domainReviewStatus","productApprovalStatus","mappingRationale"])assert.equal(e[key],original[key]);
  assert.equal(e.provenanceStatus,"missing");assert.equal(e.productApprovalStatus,"pending");
  assert(Object.isFrozen(e));assert(Object.isFrozen(e.dependencyRefs));
 }
});
for(const [date,profile,status]of [["2005-09-18","Leader","matched"],["2005-08-18","Leader","partial"],["2005-08-18","Manajemen","matched"],["2005-07-27","Operasional","matched"]]){
 test("G6B3: actual calendar "+date+" "+profile+" "+status,()=>assert.equal(inspect(date).profiles.find(p=>p.profile===profile).status,status));
}
test("G6B3: Operasional is explicitly incomplete, not a complete role qualification",()=>{
 assert.match(inspect("2005-07-27").profiles.find(p=>p.profile==="Operasional").scopeNote,/belum lengkap/);
});
test("G6B3: unsupported Coordinator/deputy and no fallback Anggota",()=>{
 const r=run(single);assert.deepEqual(r.unavailablePositions,["Koordinator","Wakil Ketua"]);assert.equal(r.chair.deputyMemberId,null);
 assert(!r.memberResults.flatMap(m=>m.profiles).some(p=>["Anggota","Koordinator","Wakil Ketua"].includes(p.profile)));
});
test("G6B3: actual indicators with no matching assertion are not partial profiles",()=>{
 const r=inspect("2005-08-04");assert(r.calculatedIndicators.length);assert.equal(r.status,"no_matching_evidence");assert.equal(r.evidenceStatus,"no_evidence");
});
test("G6B3: unavailable snapshot fault injection, not claimed as actual calendar output",()=>{
 const actual=cal.createSamyogaGroupCalendarSnapshots(single)[0];
 const r=ex.inspectExperimentalOtonanSnapshot({...actual,calculatedIndicators:[],masterInterpretations:[]});
 assert.equal(r.status,"no_indicators");assert.equal(r.evidence.length,0);
});
test("G6B3: altered quote fault injection cannot manufacture a match",()=>{
 const actual=cal.createSamyogaGroupCalendarSnapshots(single)[0];
 const changed={...actual,masterInterpretations:actual.masterInterpretations.map(r=>({...r,text:r.text+" changed"}))};
 assert.equal(ex.inspectExperimentalOtonanSnapshot(changed).evidence.length,0);
});
test("G6B3: pending evidence and caution remain explicit without numeric penalties",()=>{
 const r=inspect("2005-07-28");assert(r.cautionDimensions.includes("directing"));assert.equal(r.status,"conflicting_indicators");
 assert(r.reasonCodes.includes("EVIDENCE_UNVERIFIED"));assert.equal(r.evidenceStatus,"unverified");
});
test("G6B3: complete profile conflicts conservatively hold all matched profiles",()=>{
 let checked=0;
 for(let i=0;i<210;i++){
  const d=createCivilDate(2005,7,27);d.setDate(d.getDate()+i);
  const date=[d.getFullYear(),String(d.getMonth()+1).padStart(2,"0"),String(d.getDate()).padStart(2,"0")].join("-");
  const r=inspect(date);
  if(r.reasonCodes.includes("GLOBAL_COMPLETE_PROFILE_CONFLICT")){checked++;assert(!r.profiles.some(p=>p.status==="matched"));}
 }
 assert(checked>0);
});
test("G6B3: same quote across two dimensions retains dependency without intensity",()=>{
 const r=inspect("2005-09-18"),a=r.evidence.find(e=>e.evidenceId==="C-DIR-01"),b=r.evidence.find(e=>e.evidenceId==="C-MAN-02");
 assert.equal(a.excerpt,b.excerpt);assert(a.dependencyRefs.includes(b.evidenceId));
 assert.equal(new Set(r.supportedDimensions).size,r.supportedDimensions.length);
});
test("G6B3: two profiles may match one actual calendar member",()=>{
 const r=inspect("2005-11-16");assert.equal(r.status,"multiple_profiles");
 assert.deepEqual(r.profiles.filter(p=>p.status==="matched").map(p=>p.profile),["Manajemen","Operasional"]);
});
test("G6B3: two Leaders/Chair candidates with different engine Utama counts remain unresolved",()=>{
 const r=run(multiple),c=r.memberResults.filter(m=>m.chairCandidate);
 assert.equal(c.length,2);assert.notEqual(c[0].samyogaGate.counts.Utama,c[1].samyogaGate.counts.Utama);
 assert(c.every(m=>m.leaderGate&&m.samyogaGate.passes));assert.equal(r.chair.status,"multiple_candidates");
 assert.equal(r.chair.comparatorStatus,"UNKNOWN");assert.equal(r.chair.singleCandidateMemberId,null);assert.equal(r.chair.deputyMemberId,null);
});
test("G6B3: single candidate and no candidate are separate states",()=>{
 assert.equal(run(single).chair.status,"single_candidate");
 assert.equal(run(make(["2005-07-27","2005-07-27","2005-07-27"])).chair.status,"no_candidate");
});
test("G6B3: thresholds 2/2/3/3 and counts come from actual unique edges",()=>{
 assert.deepEqual([3,4,5,6].map(ex.experimentalMinimumUtama),[2,2,3,3]);
 for(const n of [3,4,5,6]){
  const members=multiple.slice(0,n),graph=group.calculateSamyogaGroup(members),r=run(members);
  for(const m of r.memberResults){
   const count=graph.pairs.filter(p=>(p.memberAId===m.memberId||p.memberBId===m.memberId)&&p.category==="Utama").length;
   assert.equal(m.samyogaGate.counts.Utama,count);assert.equal(m.samyogaGate.passes,2*count>n-1);
  }
 }
});
test("G6B3: incomplete, duplicate, forged and stale graphs return errors",()=>{
 const graph=group.calculateSamyogaGroup(single);
 const broken=[{...graph,pairs:graph.pairs.slice(1)},{...graph,pairs:[graph.pairs[0],graph.pairs[0],graph.pairs[2]]},{...graph,memberSummaries:graph.memberSummaries.map(m=>({...m,categoryCounts:{Utama:99,Madia:0,Nista:0}}))}];
 for(const g of broken){const r=ex.analyzeExperimentalSamyogaPositions(single,g);assert.equal(r.status,"error");assert.equal(r.memberResults.length,0);}
 assert.equal(ex.analyzeExperimentalSamyogaPositions(make(["2005-08-04","2005-08-04","2005-08-04"]),graph).status,"error");
});
test("G6B3: permutation/renaming does not alter substantive outcomes or mutate input",()=>{
 const before=structuredClone(multiple);
 const norm=r=>({chair:r.chair,members:r.memberResults.map(m=>({...m,displayName:undefined})).sort((a,b)=>a.memberId.localeCompare(b.memberId))});
 assert.deepEqual(norm(run(multiple)),norm(run(multiple.slice().reverse().map(m=>({...m,displayName:"Changed "+m.id})))));
 assert.deepEqual(multiple,before);
});
test("G6B3: invalid dates, times and IDs produce structured errors",()=>{
 for(const change of [{birthDate:"2023-02-29"},{birthTime:"24:00"},{birthDate:"invalid"},{id:""}]){
  const m=single.map((r,i)=>i===0?{...r,...change}:r);
  assert.deepEqual(ex.analyzeExperimentalSamyogaPositions(m,group.calculateSamyogaGroup(single)).reasonCodes,["INVALID_EXPERIMENT_INPUT"]);
 }
});
test("G6B3: boundary 05:59/06:00 follows existing snapshot engine",()=>{
 const a=run(single.map(m=>({...m,birthTime:"05:59"}))),b=run(single.map(m=>({...m,birthTime:"06:00"})));
 assert(a.memberResults.every(m=>m.baliDayBoundaryApplied));assert(b.memberResults.every(m=>!m.baliDayBoundaryApplied));
 assert.notDeepEqual(a.memberResults[0].calculatedIndicators,b.memberResults[0].calculatedIndicators);
});
test("G6B3: pending experimental objects cannot bypass production capabilities",()=>{
 assert.equal(registry.SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY.length,0);assert(Object.isFrozen(registry.SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY));
 assert.equal(production.SAMYOGA_PRODUCTION_POSITION_RULES.length,0);assert(Object.isFrozen(production.SAMYOGA_PRODUCTION_POSITION_RULES));
 assert.equal(registry.isActiveSamyogaPositionEvidence({...rules.EXPERIMENT_POSITION_EVIDENCE[0],memberId:"a",active:true,inactiveReasons:[]}),false);
 assert.equal(production.evaluateProductionSamyogaPositionRecommendation(cal.createSamyogaGroupCalendarSnapshots(single)[0]).status,"insufficient_basis");
});
