import assert from "node:assert/strict";
import test from "node:test";
import {loadTypeScriptModule as load} from "./samyoga-test-loader.mjs";
const {calculateSamyogaGroup}=load("lib/samyoga-group.ts");
const {analyzeSamyogaMemberPositions}=load("lib/samyoga-member-positions.ts");
const {presentMemberPositions}=load("lib/samyoga-position-presentation.ts");
const analyze=dates=>{
 const members=dates.map((birthDate,i)=>({id:"member-"+i,birthDate,birthTime:"12:00"}));
 return analyzeSamyogaMemberPositions(members,calculateSamyogaGroup(members)).memberResults;
};

test("Presentation: 420 calendar fixtures preserve evaluator data and trace every displayed reason",()=>{
 const reached=new Set(),kinds=new Set();let reasons=0;
 for(let day=0;day<420;day++){
  const date=new Date(Date.UTC(2005,6,1+day)).toISOString().slice(0,10);
  const members=analyze([date,date,date]);
  for(const member of members){
   const before=JSON.stringify(member),view=presentMemberPositions(member);
   member.evidence.forEach(e=>reached.add(e.evidenceId));
   assert.equal(JSON.stringify(member),before);
   assert.deepEqual(view.mappingIssues,[],date);
   assert.equal(view.reasons.length,member.recommendedPositions.length);
   for(const reason of view.reasons){
    reasons++;kinds.add(reason.label);
    assert(reason.text.length<440,reason.text);
    assert.equal((reason.text.match(/[.!?]/g)??[]).length,reason.label==="Kandidat Ketua simbolis"?2:1);
    assert.doesNotMatch(reason.text,/Dasawara|Reason codes|C-PLAN|G6B5|provenance|disputed/i);
    const profile=member.profiles.find(p=>p.status==="matched"&&(reason.label==="Kandidat Ketua simbolis"?p.id.startsWith("leader-"):p.label===reason.label));
    assert(profile);
    assert.deepEqual(reason.sources.map(s=>s.dimension),profile.dimensions);
    for(const source of reason.sources){
     const evidence=member.evidence.find(e=>e.evidenceId===source.evidenceId);
     assert(profile.supportEvidenceIds.includes(evidence.evidenceId));
     assert.equal(evidence.polarity,"support");assert.notEqual(evidence.semanticStatus,"ambiguous");
     assert(evidence.sourcePhrase.includes(source.quote));assert(evidence.excerpt.includes(source.quote));
     assert(reason.text.includes(source.origin));assert(reason.text.includes(source.quote));
     assert(source.origin.startsWith(evidence.indicatorType==="lintang"?"Lintang ":evidence.indicatorType==="wuku"?"Wuku ":"Wewaran "));
    }
   }
  }
 }
 assert.equal(reached.size,36);assert.equal(kinds.size,5);assert(reasons>100);
});

test("Presentation: non-Lintang management cites both actual dimensions without attributing them to Lintang",()=>{
 const member=analyze(["2005-08-18","2005-08-18","2005-08-18"])[0];
 const reason=presentMemberPositions(member).reasons.find(r=>r.label==="Manajemen");
 assert.deepEqual(reason.sources.map(s=>s.evidenceId),["C-PLAN-01","C-MAN-01"]);
 assert(reason.text.includes("Wewaran Indra"));assert(reason.text.includes("Wewaran Beteng"));
 assert(!reason.text.includes("Lintang Salah Ukur"));
});

test("Presentation: missing or mismatched evidence is a mapping issue, never a fabricated reason",()=>{
 const member=analyze(["2005-08-18","2005-08-18","2005-08-18"])[0];
 for(const evidence of [[],member.evidence.map(e=>({...e,excerpt:e.excerpt+" altered"}))]){
  const view=presentMemberPositions({...member,evidence});
  assert.equal(view.reasons.length,0);assert.equal(view.mappingIssues.length,member.recommendedPositions.length);
  assert(view.mappingIssues.every(i=>i.message.includes("mapping perlu ditinjau")));
 }
});

test("Presentation: no specific position has one concise explanation, no invented traits",()=>{
 const member=analyze(["2005-07-28","2005-07-28","2005-07-28"])[0];
 const view=presentMemberPositions(member);
 assert.deepEqual(view.reasons,[]);assert.deepEqual(view.mappingIssues,[]);
 assert.equal(view.unspecifiedReason,"Indikator yang tersedia belum memenuhi kriteria untuk merekomendasikan posisi tertentu.");
 assert(presentMemberPositions({...member,status:"review_required"}).unspecifiedReason.includes("memerlukan peninjauan"));
});

test("Presentation: chair explanations require the existing matched path and Samyoga gate",()=>{
 const member=analyze(["2005-09-18","2005-07-27","2005-07-27"])[0];
 assert(member.chairCandidate);
 const reason=presentMemberPositions(member).reasons.find(r=>r.label==="Kandidat Ketua simbolis");
 assert(reason);assert(reason.text.includes("belum menetapkan jabatan"));
 for(const changed of [{...member,chairCandidate:false},{...member,leadershipPaths:[]},{...member,samyogaGate:{...member.samyogaGate,passes:false}}]){
  const view=presentMemberPositions(changed);
  assert(!view.reasons.some(r=>r.label==="Kandidat Ketua simbolis"));
  assert(view.mappingIssues.some(i=>i.position==="Kandidat Ketua"));
 }
});
