// Node-only functional review. Inputs are calendar test dates, never precomputed profiles.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {loadTypeScriptModule as load,projectRoot} from "../samyoga-test-loader.mjs";

const group=load("lib/samyoga-group.ts");
const engine=load("lib/samyoga-member-positions.ts");
const snapshots=load("lib/samyoga-calendar-snapshot.ts");
const standard=["2005-07-27","2005-09-18","2005-08-18","2005-07-28","2005-08-03","2005-08-21"];

export const FUNCTIONAL_REVIEW_INPUTS=Object.freeze([
    ...[3,4,5,6].map(n=>({id:"members-"+n,dates:standard.slice(0,n)})),
    {id:"single-chair",dates:["2005-09-18","2005-07-27","2005-07-27"]},
    {id:"multiple-chair",dates:["2005-08-03","2005-08-03","2005-08-01"]},
    {id:"no-specific",dates:["2005-07-28","2005-07-28","2005-07-28"]},
    {id:"caution-and-disputed",dates:["2005-07-30","2005-08-02","2005-08-18"]},
    {id:"different-utama",dates:["2005-08-15","2005-08-21","2005-07-27","2005-07-28"]},
].map(c=>Object.freeze({...c,dates:Object.freeze(c.dates)})));

export function createFunctionalReview() {
    const cases=FUNCTIONAL_REVIEW_INPUTS.map(input=>{
        const members=input.dates.map((birthDate,i)=>({
            id:"member-"+(i+1),displayName:"Anggota Uji "+String.fromCharCode(65+i),birthDate,birthTime:"12:00",
        }));
        const graph=group.calculateSamyogaGroup(members);
        const analysis=engine.analyzeSamyogaMemberPositions(members,graph);
        const sources=snapshots.createSamyogaGroupCalendarSnapshots(members);
        return {
            caseId:input.id,origin:"calendar-test-inputs-computed-by-existing-engines",
            inputMembers:members,graph,analysis,
            members:analysis.memberResults.map(member=>({
                memberId:member.memberId,palintangan:member.palintangan.name,
                contributionProfiles:member.contributionProfiles,leadershipPaths:member.leadershipPaths,
                recommendedPositions:member.recommendedPositions,participationLabel:member.participationLabel,
                profiles:member.profiles.map(profile=>({
                    ruleId:profile.ruleId,id:profile.id,label:profile.label,status:profile.status,
                    requiredDimensions:profile.dimensions,textualOnly:profile.textualOnly,
                    missingDimensions:profile.missingDimensions,reasonCodes:profile.reasonCodes,
                    explanation:profile.explanation,
                    support:profile.supportEvidenceIds.map(id=>{
                        const evidence=member.evidence.find(e=>e.evidenceId===id);
                        const original=sources.find(s=>s.memberId===member.memberId).masterInterpretations.find(i=>
                            i.indicatorType===evidence.indicatorType&&i.wewaranCycle===evidence.wewaranCycle&&
                            i.masterRecordId===evidence.masterRecordId&&i.sourceField===evidence.sourceField&&
                            i.indicatorValue===evidence.indicatorValue);
                        return {mappingId:evidence.mappingRuleId,evidenceId:evidence.evidenceId,
                            indicatorType:evidence.indicatorType,cycle:evidence.wewaranCycle,
                            indicator:evidence.indicatorValue,masterRecordId:evidence.masterRecordId,
                            field:evidence.sourceField,phrase:evidence.sourcePhrase,fullMasterText:original?.text,
                            dimension:evidence.dimension,polarity:evidence.polarity,semanticStatus:evidence.semanticStatus,
                            rationale:evidence.mappingRationale,limitations:evidence.interpretationLimitations};
                    }),
                    caution:profile.reviewEvidenceIds.map(id=>member.evidence.find(e=>e.evidenceId===id)),
                })),
                cautions:member.cautions,ambiguous:member.ambiguousEvidence,samyoga:member.samyogaGate,
                chairCandidate:member.chairCandidate,
            })),
        };
    });
    const rows=cases.flatMap(c=>c.members);
    return {
        version:"g6b6-functional-review-v1",scope:"local-audit-not-cultural-or-competence-validation",
        cases,
        coverage:{
            management:rows.some(r=>r.contributionProfiles.includes("Manajemen")),
            operational:rows.some(r=>r.contributionProfiles.includes("Operasional")),
            communication:rows.some(r=>r.contributionProfiles.includes("Komunikasi")),
            collaboration:rows.some(r=>r.contributionProfiles.includes("Kolaborasi")),
            leadership:rows.some(r=>r.leadershipPaths.length),
            multipleProfiles:rows.some(r=>r.contributionProfiles.length>1),
            unspecified:rows.some(r=>!r.recommendedPositions.length),
            caution:rows.some(r=>r.cautions.length),
            noChair:cases.some(c=>c.analysis.chair.status==="no_candidate"),
            singleChair:cases.some(c=>c.analysis.chair.status==="single_candidate"),
            multipleChair:cases.some(c=>c.analysis.chair.status==="multiple_candidates"),
        },
    };
}

if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url)){
    const report=createFunctionalReview();
    const index=process.argv.indexOf("--output");
    if(index>=0){
        const target=path.resolve(process.argv[index+1]??"");
        if(!target.startsWith(path.join(projectRoot,"coverage")+path.sep))throw new Error("Audit output must be inside ignored coverage directory");
        fs.mkdirSync(path.dirname(target),{recursive:true});
        fs.writeFileSync(target,JSON.stringify(report,null,2)+"\n");
    }
    process.stdout.write(JSON.stringify({cases:report.cases.length,coverage:report.coverage,unavailable:Object.entries(report.coverage).filter(([,value])=>!value).map(([key])=>key)})+"\n");
}
