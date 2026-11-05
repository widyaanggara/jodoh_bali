import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {spawnSync} from "node:child_process";
import test from "node:test";
import {catalogue, master, existingEvidence, profileRules, validateCatalogue, buildCoverage, simulate} from "./fixtures/samyoga-palintangan-coverage-g6b4.mjs";
import {loadTypeScriptModule as load, projectRoot} from "./samyoga-test-loader.mjs";

const clone = () => structuredClone(catalogue);
const report = buildCoverage();
const all = catalogue.records.flatMap(r => r.mappings);
const record = name => catalogue.records.find(r => r.name === name);
const mappings = name => record(name).mappings;

test("G6B4: exactly 35 unique master identities, exact names, source phrases and inactive draft", () => {
    assert.deepEqual(validateCatalogue(), {identities:35, mappingAssertions:72, existingLinks:3});
    assert.equal(new Set(catalogue.records.map(r => r.lintangId)).size, 35);
    assert.equal(all.length, 72);
    assert(all.every(m => m.active === false && m.provenanceStatus === "missing" &&
        m.culturalReviewStatus === "pending" && m.experimentalApprovalStatus === "draft_pending"));
});

test("G6B4: rejects missing, duplicate or foreign Lintang, changed name and fabricated quote", () => {
    const mutations = [
        d => d.records.pop(),
        d => {d.records[0] = structuredClone(d.records[1]);},
        d => {d.records[0].lintangId = "lintang:fake:fake";},
        d => {d.records[0].name = "invented";},
        d => {d.records[0].mappings[0].phrase = "Karakter yang tidak ada dalam master";},
        d => {d.records[0].cautionPhrases.push("fake caution");},
        d => {d.records[0].ambiguousPhrases.push("fake ambiguity");},
    ];
    for (const mutate of mutations) { const d=clone(); mutate(d); assert.throws(() => validateCatalogue(d)); }
});

test("G6B4: rejects duplicate mapping ID, fabricated evidence, mismatched source and approval activation", () => {
    const mutations = [
        d => {d.records[0].mappings[0].mappingId=d.records[0].mappings[1].mappingId;},
        d => {d.records[0].mappings[0].existingEvidenceId="C-INVENTED";},
        d => {d.records[3].mappings[0].existingEvidenceId="C-EXEC-04";},
        d => {d.records[0].sourceReference.field="label";},
        d => {d.records[0].mappings[0].active=true;},
        d => {d.records[0].mappings[0].experimentalApprovalStatus="approved";},
        d => {d.activation=true;},
    ];
    for (const mutate of mutations) { const d=clone(); mutate(d); assert.throws(() => validateCatalogue(d)); }
});

test("G6B4: assertion counts and decisions distinguish 69 new drafts from three linked existing", () => {
    assert.equal(report.existingAssertions,3);
    assert.equal(report.linkedExistingAssertions,3);
    assert.equal(report.newDraftAssertions,69);
    assert.deepEqual(report.decisions,{"DIDUKUNG TEKSTUAL":16,"PERLU INTERPRETASI":21,"AMBIGU":23,"TIDAK DIDUKUNG":12});
    assert.deepEqual(all.filter(m=>m.existingEvidenceId).map(m=>m.existingEvidenceId).sort(),
        ["C-COMM-03","C-COMM-04","C-EXEC-04"]);
    assert.equal(all.filter(m=>m.kind==="support"&&m.decision==="DIDUKUNG TEKSTUAL").length,15);
    assert.equal(all.filter(m=>m.kind==="caution").length,9);
});

test("G6B4: semantic guardrails reject bravery, friendliness, status and generic weighing as role evidence", () => {
    const rejected=(name,dimension,phrase)=>assert(mappings(name).some(m=>
        m.dimension===dimension && m.phrase===phrase && m.decision==="TIDAK DIDUKUNG"));
    rejected("Begoong","directing","Berani dalam bertindak");
    rejected("Tiwa-tiwa","collaborating","ramah");
    rejected("Tiwa-tiwa","planning","Pandai menimbang sesuatu");
    rejected("Lawean","directing","Memiliki derajat yang tinggi");
    rejected("Ru","planning","Pintar mengurus rumah tangga dan sangat teliti dalam urusan keuangan");
    assert(mappings("Udang").filter(m=>m.dimension!=="communicating").every(m=>m.decision==="AMBIGU"));
});

test("G6B4: existing simulation matches the actual read-only inspector for all 35 identities", () => {
    const {inspectExperimentalPalintanganProfile: inspect}=load("lib/samyoga-position-experiment.ts");
    for (const source of master) {
        const id="lintang:"+source.saptawara+":"+source.pancawara;
        const actual=inspect({memberId:id,status:"found",masterRecordId:id,name:source.lintang,
            originalCharacter:source.penjelasan,evidence:existingEvidence.filter(e=>e.masterRecordId===id),
            baliDayBoundaryApplied:false});
        const simulated=report.scenarios.existing.perLintang.find(r=>r.lintangId===id);
        assert.deepEqual(actual.supportedDimensions,simulated.support);
        assert.deepEqual(actual.cautionDimensions,simulated.caution);
        assert.deepEqual(actual.profiles.map(p=>[p.profile,p.status]),simulated.profiles.map(p=>[p.profile,p.status]));
        assert.deepEqual(actual.profiles.filter(p=>p.status==="matched").map(p=>p.profile),simulated.matchedProfiles);
    }
});

test("G6B4: existing mapping remains zero Leader/management, one Operational, 32 without mapping", () => {
    const s=report.scenarios.existing;
    assert.deepEqual(s.matched,{Leader:[],Manajemen:[],Operasional:["Kukus"]});
    assert.equal(s.onlyPartial,1); assert.equal(s.noRecommendation,34);
    assert.equal(s.withoutAcceptedMapping,32); assert.equal(s.cautionOnly,1);
});

test("G6B4: textual-only support has exact per-identity dimension counts and five Operational names", () => {
    const s=report.scenarios.draftTextual;
    assert.deepEqual(Object.values(s.byDimension).map(d=>d.support),[0,0,2,8,5,0]);
    assert.deepEqual(Object.values(s.byDimension).map(d=>d.caution),[0,0,0,1,0,0]);
    assert.deepEqual(s.matched,{Leader:[],Manajemen:[],Operasional:["Uluku","Kuda","Kukus","Lumbung","Begoong"]});
    assert.equal(s.onlyPartial,10); assert.equal(s.noRecommendation,30);
    assert.equal(s.multipleProfiles,0); assert.equal(s.withoutAcceptedMapping,19);
});

test("G6B4: interpretation-only sensitivities never complete Leader or management across different identities", () => {
    const s=report.scenarios.draftInterpretive;
    assert.deepEqual(Object.values(s.byDimension).map(d=>d.support),[0,3,4,8,5,7]);
    assert.deepEqual(s.matched.Leader,[]); assert.deepEqual(s.matched.Manajemen,[]);
    assert.equal(s.onlyPartial,19); assert.equal(s.conflictWithoutMatch,1);
    assert.equal(s.withoutAcceptedMapping,7);
    for(const r of s.perLintang)assert(!(r.support.includes("planning")&&r.support.includes("managing")));
});

test("G6B4: ambiguous and rejected proposals are excluded from both draft scenarios", () => {
    for(const scenario of [report.scenarios.draftTextual,report.scenarios.draftInterpretive]) {
        assert(scenario.perLintang.every(r=>!r.support.includes("directing")));
        assert.equal(scenario.perLintang.find(r=>r.name==="Udang").support.includes("collaborating"),false);
    }
    const onlyAmbiguous=simulate(all.filter(m=>m.kind==="ambiguous"));
    assert(onlyAmbiguous.perLintang.every(r=>r.support.length===0&&r.caution.length===0));
});

test("G6B4: source-dependent phrases are not counted as independent support or ranking", () => {
    for(const name of ["Ru","Patrem","Udang"]) {
        const ms=mappings(name);
        assert.equal(new Set(ms.map(m=>m.dependencyGroup)).size,1);
        assert(ms.some((m,i)=>ms.some((n,j)=>i!==j&&m.phrase===n.phrase)));
    }
    const kukus=report.scenarios.draftInterpretive.perLintang.find(r=>r.name==="Kukus");
    assert.equal(kukus.support.filter(d=>d==="executing").length,1);
    assert.equal(report.scenarios.draftInterpretive.byDimension.executing.support,5);
});

test("G6B4: caution context is preserved without converting sensitivities to automatic penalties", () => {
    assert.equal(report.recordsWithCautionContext,33);
    assert.deepEqual(report.recordsWithoutCautionContext,["Kukus","Udang"]);
    assert.equal(report.recordsWithAmbiguousContext,35);
    assert(record("Tiwa-tiwa").cautionPhrases.includes("namun hatinya sensitif dan mudah tersinggung"));
    assert(!mappings("Tiwa-tiwa").some(m=>m.kind==="caution"));
    assert(report.scenarios.draftInterpretive.perLintang.find(r=>r.name==="Begoong").matchedProfiles.includes("Operasional"));
    const banyak=report.scenarios.draftInterpretive.perLintang.find(r=>r.name==="Banyak Angrem");
    assert(banyak.profiles.some(p=>p.profile==="Leader"&&p.status==="conflict"));
});

test("G6B4: inherited conflict policy is mirrored only for conditional comparison", () => {
    const entries=[
        {lintangId:"x",dimension:"executing",kind:"support"},
        {lintangId:"x",dimension:"executing",kind:"caution"},
        {lintangId:"x",dimension:"planning",kind:"support"},
        {lintangId:"x",dimension:"managing",kind:"support"},
    ];
    const result=simulate(entries,[{lintangId:"x",name:"synthetic dimension control"}]);
    assert.equal(result.perLintang[0].profiles.find(p=>p.profile==="Operasional").status,"conflict");
    assert.equal(result.perLintang[0].profiles.find(p=>p.profile==="Manajemen").status,"conflict");
    assert.deepEqual(result.perLintang[0].matchedProfiles,[]);
});

test("G6B4: alternative counts remain separate from the unchanged existing profile rules", () => {
    assert.deepEqual(profileRules.map(r=>[r.profile,[...r.requiredDimensions]]),[
        ["Leader",["directing","communicating","collaborating"]],
        ["Manajemen",["planning","managing"]],["Operasional",["executing"]]]);
    assert.deepEqual(report.alternatives.draftTextual.managingCoreOnly,["Ru","Puwuh Atarung"]);
    assert.deepEqual(report.alternatives.draftInterpretive.managingCoreOnly,["Kukus","Kartika","Ru","Puwuh Atarung"]);
    assert.deepEqual(report.alternatives.draftInterpretive.communicationProsocialCore,[{name:"Banyak Angrem",needsCautionReview:true}]);
    assert.equal(report.scenarios.draftInterpretive.multipleProfiles,0);
});

test("G6B4: no mutation, order dependence, clock or timezone dependence in coverage", () => {
    const before=JSON.stringify(catalogue);
    assert.deepEqual(buildCoverage(),buildCoverage());
    assert.equal(JSON.stringify(catalogue),before);
    const reversed=clone();reversed.records.reverse();
    const reversedReport=buildCoverage(reversed);
    assert.deepEqual(reversedReport.dimensionAudit,report.dimensionAudit);
    assert.deepEqual(reversedReport.decisions,report.decisions);
    for(const key of Object.keys(report.scenarios))
        assert.deepEqual(reversedReport.scenarios[key].byDimension,report.scenarios[key].byDimension);
    const code="import{buildCoverage}from'./tests/fixtures/samyoga-palintangan-coverage-g6b4.mjs';console.log(JSON.stringify(buildCoverage()));";
    const outputs=["Asia/Makassar","America/Los_Angeles"].map(TZ=>{
        const r=spawnSync(process.execPath,["--input-type=module","-e",code],
            {cwd:projectRoot,env:{...process.env,TZ},encoding:"utf8"});
        assert.equal(r.status,0,r.stderr);return r.stdout;
    });
    assert.equal(outputs[0],outputs[1]);
});

test("G6B4: no production import of audit fixtures and production registries remain empty/frozen", () => {
    function inspect(dir) {
        for(const entry of fs.readdirSync(dir,{withFileTypes:true})) {
            const file=path.join(dir,entry.name);
            if(entry.isDirectory())inspect(file);
            else if(/\.(ts|tsx|js|mjs)$/.test(file)) {
                const source=fs.readFileSync(file,"utf8");
                assert(!source.includes("samyoga-palintangan-mapping-g6b4"),file);
                assert(!source.includes("samyoga-palintangan-coverage-g6b4"),file);
            }
        }
    }
    for(const root of ["app","components","lib"])inspect(path.join(projectRoot,root));
    const registry=load("lib/samyoga-position-evidence.ts").SAMYOGA_PRODUCTION_EVIDENCE_REGISTRY;
    const rules=load("lib/samyoga-position-recommendation.ts").SAMYOGA_PRODUCTION_POSITION_RULES;
    assert.equal(registry.length,0);assert(Object.isFrozen(registry));
    assert.equal(rules.length,0);assert(Object.isFrozen(rules));
});

test("G6B4: documents retain all 35 exact original texts, 72 mapping IDs and valid local links", () => {
    const mapping=fs.readFileSync(path.join(projectRoot,"docs/samyoga-palintangan-mapping-g6b4.md"),"utf8");
    for(const source of master)assert(mapping.includes("> "+source.penjelasan));
    for(const m of all)assert(mapping.includes(m.mappingId));
    const docs=["samyoga-palintangan-mapping-g6b4.md","samyoga-position-profile-review-g6b4.md","samyoga-position-coverage-g6b4.md"];
    for(const filename of docs) {
        const source=fs.readFileSync(path.join(projectRoot,"docs",filename),"utf8");
        for(const [,link] of source.matchAll(/\]\(([^)]+)\)/g)) {
            const target=link.split("#")[0];
            if(target&&!target.startsWith("http"))assert(fs.existsSync(path.resolve(projectRoot,"docs",target)),link);
        }
    }
});
