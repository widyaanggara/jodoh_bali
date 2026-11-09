import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {spawnSync} from "node:child_process";
import {loadTypeScriptModule as load,projectRoot} from "./samyoga-test-loader.mjs";

const engine=load("lib/samyoga-member-positions.ts");
const rules=load("lib/samyoga-member-position-rules.ts");
const group=load("lib/samyoga-group.ts");
const snapshots=load("lib/samyoga-calendar-snapshot.ts");
const calendar=load("lib/otonan-calendar.ts");
const members=dates=>dates.map((birthDate,i)=>({id:"m"+i,displayName:"Calendar input "+i,birthDate,birthTime:"12:00"}));
const run=dates=>{const m=members(dates);return engine.analyzeSamyogaMemberPositions(m,group.calculateSamyogaGroup(m));};
const inspect=date=>run([date,date,date]).memberResults[0];
const pool=[];
const sourceExamples=new Map();
for(let i=0;i<420;i++){
    const date=new Date(Date.UTC(2005,6,27+i)).toISOString().slice(0,10);
    const sources=snapshots.createSamyogaGroupCalendarSnapshots(members([date,date,date]))[0].masterInterpretations;
    for(const e of engine.matchContributionMappings(sources))if(!sourceExamples.has(e.evidenceId))sourceExamples.set(e.evidenceId,sources);
    pool.push(date);
}

test("G6B5: all 36 exact source mappings are reachable through the existing calendar",()=>{
    assert.equal(rules.MEMBER_CONTRIBUTION_MAPPINGS.length,36);
    assert.equal(new Set(rules.MEMBER_CONTRIBUTION_MAPPINGS.map(e=>e.evidenceId)).size,36);
    assert.equal(sourceExamples.size,36);
    for(const e of rules.MEMBER_CONTRIBUTION_MAPPINGS){
        const sources=sourceExamples.get(e.evidenceId);
        assert(sources.some(s=>s.masterRecordId===e.masterRecordId&&s.sourceField===e.sourceField&&s.text===e.excerpt));
        assert(e.excerpt.includes(e.sourcePhrase));assert(Object.isFrozen(e));
        assert.equal(e.provenanceStatus,"missing");assert.equal(e.domainReviewStatus,"pending");assert.equal(e.productApprovalStatus,"pending");
    }
    assert.deepEqual([...new Set(rules.MEMBER_CONTRIBUTION_MAPPINGS.map(e=>e.indicatorType))].sort(),
        ["lintang","pancawara","saptawara","wewaran","wuku"]);
});

test("G6B5: exact matching rejects changed source identity, field, cycle, name and text",()=>{
    const e=rules.MEMBER_CONTRIBUTION_MAPPINGS.find(e=>e.evidenceId==="C-COMM-03");
    const source=sourceExamples.get(e.evidenceId).find(s=>s.masterRecordId===e.masterRecordId&&s.sourceField===e.sourceField);
    assert(engine.matchContributionMappings([source]).includes(e));
    for(const change of [{masterRecordId:"wrong"},{sourceField:"label"},{wewaranCycle:"triwara"},{indicatorValue:"other"},{text:source.text+" changed"},{text:"pandai berbicara"}]){
        assert(!engine.matchContributionMappings([{...source,...change}]).includes(e));
    }
    assert(engine.evaluateContributionProfiles([{...e,approved:true}]).every(p=>p.status==="unsupported"));
});

test("G6B5: all 3-6 members get structured output, without forced structural positions",()=>{
    const dates=["2005-07-27","2005-09-18","2005-08-18","2005-07-28","2005-08-03","2005-08-21"];
    for(const n of [3,4,5,6]){
        const result=run(dates.slice(0,n));assert.equal(result.status,"analyzed");
        assert.equal(result.memberResults.length,n);
        for(const m of result.memberResults){
            assert.equal(m.policyVersion,rules.MEMBER_POSITION_POLICY_VERSION);
            assert.equal(m.participationStatus,"Anggota Kelompok");
            assert(m.palintangan.originalCharacter);assert(m.otonan.interpretations.length>0);
            assert(m.profiles.every(p=>p.ruleId&&p.reasonCodes.length));
            assert(!m.recommendedPositions.includes("Koordinator"));assert(!m.recommendedPositions.includes("Wakil Ketua"));
        }
        assert.equal(result.chair.selectedChairMemberId,null);assert.equal(result.chair.deputyMemberId,null);
    }
});

test("G6B5: original Otonan interpretations agree with engine for 35 consecutive civil dates",()=>{
    for(const date of pool.slice(0,35)){
        const actual=inspect(date),raw=calendar.calculateOtonanCalendar(date,"12:00");
        assert.equal(actual.palintangan.name,raw.lintang.lintang);
        assert.equal(actual.palintangan.originalCharacter,raw.lintang.penjelasan);
        for(const [field,text]of Object.entries({deskripsi:raw.wuku.deskripsi,sifat_umum:raw.wuku.sifat_umum,kelebihan:raw.wuku.kelebihan,kelemahan:raw.wuku.kelemahan}))
            assert(actual.otonan.interpretations.some(i=>i.indicatorType==="wuku"&&i.sourceField===field&&i.text===text));
        assert.equal(actual.otonan.indicators.find(i=>i.indicatorType==="wuku").value,raw.wuku.nama_wuku);
        assert.equal(actual.otonan.indicators.find(i=>i.indicatorType==="pancawara").value,raw.pancawara.nama);
    }
});

test("G6B5: actual dates support both direct and indirect paths without evidence-count strength",()=>{
    const direct=inspect("2005-09-18");
    assert.deepEqual(direct.leadershipPaths,["direct","indirect"]);
    assert(direct.profiles.find(p=>p.id==="leader-direct").supportEvidenceIds.includes("C-DIR-01"));
    const indirect=inspect("2005-08-01");
    assert.deepEqual(indirect.leadershipPaths,["indirect"]);
    const p=indirect.profiles.find(p=>p.id==="leader-indirect");
    assert.equal(p.status,"matched");assert.deepEqual(p.missingDimensions,[]);
    assert.equal(indirect.chairCandidate,false,"profile alone cannot bypass Samyoga");
});

test("G6B5: management, operations, communication and collaboration use actual source-based profiles",()=>{
    assert(inspect("2005-08-18").contributionProfiles.includes("Manajemen"));
    assert(inspect("2005-07-27").contributionProfiles.includes("Operasional"));
    assert(inspect("2005-07-27").contributionProfiles.includes("Komunikasi"));
    assert(inspect("2005-07-30").contributionProfiles.includes("Kolaborasi"));
    assert(inspect("2005-07-27").contributionProfiles.length>1);
    const management=inspect("2005-08-18").profiles.find(p=>p.id==="management");
    assert(management.supportEvidenceIds.includes("C-PLAN-01"));
    assert(management.supportEvidenceIds.includes("C-MAN-01"));
});

test("G6B5: non-specific output is participation, not a fabricated trait recommendation",()=>{
    const r=inspect("2005-07-28");
    assert.deepEqual(r.recommendedPositions,[]);
    assert.equal(r.participationLabel,"Anggota Kelompok — Kecenderungan posisi belum spesifik.");
    assert(r.partialProfiles.length>0);
    assert.equal(r.chairCandidate,false);
});

test("G6B5: explicit caution holds related leadership profiles, not unrelated contributions",()=>{
    const r=inspect("2005-07-30");
    assert.equal(r.profiles.find(p=>p.id==="leader-direct").status,"review_required");
    assert(r.cautions.some(e=>e.evidenceId==="C-DIR-04"));
    assert.deepEqual(r.leadershipPaths,[]);
    assert(r.contributionProfiles.includes("Komunikasi"));
    assert(r.contributionProfiles.includes("Kolaborasi"));
    assert(!r.recommendedPositions.includes("Kandidat Ketua"));
});

test("G6B5: disputed planning is visible but cannot fill management criteria",()=>{
    const r=inspect("2005-08-02");
    assert(r.ambiguousEvidence.some(e=>e.evidenceId==="C-PLAN-02"));
    for(const p of r.profiles)assert(!p.supportEvidenceIds.includes("C-PLAN-02"));
    const ids=rules.MEMBER_CONTRIBUTION_MAPPINGS.filter(e=>e.semanticStatus==="ambiguous").map(e=>e.evidenceId);
    assert.deepEqual(ids,["C-PLAN-02","C-PLAN-03"]);
    for(const id of ["C-DIR-04","C-COMM-04","C-COLL-04"])
        assert.equal(rules.MEMBER_CONTRIBUTION_MAPPINGS.find(e=>e.evidenceId===id).semanticStatus,"interpretive");
});

test("G6B5: independent groups have zero, one and multiple actual dual-gate candidates",()=>{
    const single=run(["2005-09-18","2005-07-27","2005-07-27"]);
    assert.equal(single.chair.status,"single_candidate");assert.deepEqual(single.chair.candidateMemberIds,["m0"]);
    const multiple=run(["2005-08-03","2005-08-03","2005-08-01"]);
    assert.equal(multiple.chair.status,"multiple_candidates");assert.deepEqual(multiple.chair.candidateMemberIds,["m0","m1","m2"]);
    assert.equal(run(["2005-07-28","2005-07-28","2005-07-28"]).chair.status,"no_candidate");
    for(const r of [single,multiple]){
        assert.equal(r.chair.comparatorStatus,"UNKNOWN");
        assert.equal(r.chair.selectedChairMemberId,null);assert.equal(r.chair.deputyMemberId,null);
    }
});

test("G6B5: different Utama counts never select a winner when comparator is UNKNOWN",()=>{
    const r=run(["2005-08-15","2005-08-21","2005-07-27","2005-07-28"]);
    assert.deepEqual(r.chair.candidateMemberIds,["m0","m1"]);
    assert.equal(r.memberResults[0].samyogaGate.counts.Utama,2);
    assert.equal(r.memberResults[1].samyogaGate.counts.Utama,3);
    assert.equal(r.chair.selectedChairMemberId,null);
    assert.equal(r.memberResults[3].samyogaGate.counts.Utama,3);
    assert.equal(r.memberResults[3].chairCandidate,false,"Utama cannot create a leadership profile");
});

test("G6B5: Samyoga incidence counts and 2/2/3/3 thresholds come from full actual graphs",()=>{
    for(const n of [3,4,5,6]){
        const m=members(pool.slice(20,20+n)),g=group.calculateSamyogaGroup(m);
        const r=engine.analyzeSamyogaMemberPositions(m,g);
        for(const row of r.memberResults){
            const edges=g.pairs.filter(p=>p.memberAId===row.memberId||p.memberBId===row.memberId);
            for(const c of ["Utama","Madia","Nista"])assert.equal(row.samyogaGate.counts[c],edges.filter(p=>p.category===c).length);
            assert.equal(row.samyogaGate.requiredUtama,[2,2,3,3][n-3]);
        }
    }
});

test("G6B5: malformed, stale, duplicate and forged graphs fail without partial candidate publication",()=>{
    const m=members(["2005-09-18","2005-07-27","2005-07-27"]),good=group.calculateSamyogaGroup(m);
    const variants=[
        {...good,pairs:good.pairs.slice(1)},
        {...good,pairs:[good.pairs[0],good.pairs[0],good.pairs[2]]},
        {...good,pairs:good.pairs.map((p,i)=>i===0?{...p,category:"Utama",modulo16:999}:p)},
        {...good,memberSummaries:good.memberSummaries.map(r=>({...r,categoryCounts:{Utama:99,Madia:0,Nista:0}}))},
    ];
    for(const g of variants){const r=engine.analyzeSamyogaMemberPositions(m,g);assert.equal(r.status,"error");assert.deepEqual(r.memberResults,[]);assert.deepEqual(r.chair.candidateMemberIds,[]);}
    assert.equal(engine.analyzeSamyogaMemberPositions(m.map((x,i)=>i===0?{...x,birthDate:"2005-08-18"}:x),good).status,"error");
});

test("G6B5: dates, time, duplicate IDs and group size errors are structured",()=>{
    const m=members(["2005-09-18","2005-07-27","2005-07-27"]),good=group.calculateSamyogaGroup(m);
    for(const change of [{birthDate:"2025-02-29"},{birthTime:"24:00"},{id:"m1"}])
        assert.equal(engine.analyzeSamyogaMemberPositions(m.map((x,i)=>i===0?{...x,...change}:x),good).status,"error");
    for(const n of [2,7]){
        const invalid=members(Array(n).fill("2005-07-27"));
        assert.equal(engine.analyzeSamyogaMemberPositions(invalid,good).status,"error");
    }
});

test("G6B5: names, extra user flags and permutations cannot change individual profiles or candidate set",()=>{
    const m=members(["2005-08-15","2005-08-21","2005-07-27","2005-07-28"]);
    const before=JSON.stringify(m),base=engine.analyzeSamyogaMemberPositions(m,group.calculateSamyogaGroup(m));
    const changed=m.slice().reverse().map(x=>({...x,displayName:"Other "+x.id,approved:true,rank:100,zodiak:"arbitrary",leader:true}));
    const actual=engine.analyzeSamyogaMemberPositions(changed,group.calculateSamyogaGroup(changed));
    assert.deepEqual(actual.chair,base.chair);
    for(const row of actual.memberResults){
        const old=base.memberResults.find(x=>x.memberId===row.memberId);
        assert.deepEqual({...row,displayName:old.displayName},old);
    }
    assert.equal(JSON.stringify(m),before);
});

test("G6B5: boundary 05:59/06:00 uses the same Otonan engine once",()=>{
    const m=members(["2005-07-27","2005-07-27","2005-07-27"]);
    const result=time=>{const a=m.map(x=>({...x,birthTime:time}));return engine.analyzeSamyogaMemberPositions(a,group.calculateSamyogaGroup(a));};
    const before=result("05:59"),after=result("06:00");
    assert(before.memberResults.every(r=>r.otonan.baliDayBoundaryApplied));
    assert(after.memberResults.every(r=>!r.otonan.baliDayBoundaryApplied));
    assert.equal(before.memberResults[0].palintangan.name,"Jongsarat");
    assert.equal(after.memberResults[0].palintangan.name,"Tiwa-tiwa");
});

test("G6B5: complete recommendation output is identical across Makassar and Los Angeles",()=>{
    const code="import{loadTypeScriptModule as l}from'./tests/samyoga-test-loader.mjs';const g=l('lib/samyoga-group.ts'),e=l('lib/samyoga-member-positions.ts');const m="+JSON.stringify(members(["2005-09-18","2005-07-27","2005-08-18","2005-07-28"]))+";console.log(JSON.stringify(e.analyzeSamyogaMemberPositions(m,g.calculateSamyogaGroup(m))));";
    const out=["Asia/Makassar","America/Los_Angeles"].map(TZ=>{
        const r=spawnSync(process.execPath,["--input-type=module","-e",code],{cwd:projectRoot,env:{...process.env,TZ},encoding:"utf8"});
        assert.equal(r.status,0,r.stderr);return r.stdout;
    });assert.equal(out[0],out[1]);
});

test("G6B5: no transport, persistence, scoring input or Western horoscope enters new recommendation modules",()=>{
    const files=["lib/samyoga-member-positions.ts","lib/samyoga-member-position-rules.ts","components/samyoga-group/SamyogaGroupPositionExperiment.tsx"];
    const source=files.map(f=>fs.readFileSync(path.join(projectRoot,f),"utf8")).join("\n");
    assert.doesNotMatch(source,/\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|firebase|analytics|console\./i);
    assert.doesNotMatch(source,/getZodiak|jodoh-logic|\.zodiak|zodiak\s*:|totalUrip/);
    assert.doesNotMatch(source,/tests\/fixtures|samyoga-chair-prototype|provenanceStatus:\s*["']verified/);
    const registry=load("lib/samyoga-position-evidence.ts").SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY;
    const productionRules=load("lib/samyoga-position-recommendation.ts").SAMYOGA_PRODUCTION_POSITION_RULES;
    assert.equal(registry.length,0);assert(Object.isFrozen(registry));assert.equal(productionRules.length,0);assert(Object.isFrozen(productionRules));
});
