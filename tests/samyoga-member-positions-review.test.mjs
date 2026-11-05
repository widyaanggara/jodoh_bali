import assert from "node:assert/strict";
import test from "node:test";
import {createFunctionalReview} from "./fixtures/samyoga-member-positions-review.mjs";

const report=createFunctionalReview();

test("G6B6 review: all eleven required situations are represented by actual calendar inputs",()=>{
    assert.equal(report.cases.length,9);
    assert.equal(Object.keys(report.coverage).length,11);
    assert(Object.values(report.coverage).every(Boolean));
    assert.deepEqual([...new Set(report.cases.map(c=>c.inputMembers.length))].sort(),[3,4,5,6]);
    for(const c of report.cases){
        assert.equal(c.origin,"calendar-test-inputs-computed-by-existing-engines");
        assert.equal(c.analysis.status,"analyzed");assert.equal(c.members.length,c.inputMembers.length);
    }
});

test("G6B6 review: every profile reason has exact original source, correct dimension and permitted semantics",()=>{
    let checked=0;
    for(const c of report.cases)for(const member of c.members)for(const p of member.profiles){
        if(p.status==="matched")assert.equal(p.missingDimensions.length,0);
        if(p.status==="partial")assert(p.missingDimensions.length>0);
        for(const proof of p.support){
            assert(proof.fullMasterText&&proof.fullMasterText.includes(proof.phrase));
            assert.equal(proof.polarity,"support");
            assert.notEqual(proof.semanticStatus,"ambiguous");
            assert(p.requiredDimensions.includes(proof.dimension));
            if(p.textualOnly)assert.equal(proof.semanticStatus,"textual");
            assert(proof.rationale&&proof.limitations&&proof.mappingId&&proof.masterRecordId);
            checked++;
        }
        if(p.status==="matched")for(const dimension of p.requiredDimensions)assert(p.support.some(s=>s.dimension===dimension));
    }
    assert(checked>100,"Review must cover multiple groups and profiles, not one representative quote.");
});

test("G6B6 review: chair candidates follow real graph edges without arbitrary ordering or automatic allocation",()=>{
    for(const c of report.cases){
        assert.equal(c.graph.pairs.length,c.inputMembers.length*(c.inputMembers.length-1)/2);
        for(const row of c.members){
            const edges=c.graph.pairs.filter(p=>p.memberAId===row.memberId||p.memberBId===row.memberId);
            for(const category of ["Utama","Madia","Nista"])
                assert.equal(row.samyoga.counts[category],edges.filter(p=>p.category===category).length);
            assert.equal(row.chairCandidate,row.leadershipPaths.length>0&&row.samyoga.passes);
        }
        assert.equal(c.analysis.chair.selectedChairMemberId,null);assert.equal(c.analysis.chair.deputyMemberId,null);
        assert.equal(c.analysis.chair.comparatorStatus,"UNKNOWN");
    }
    const uneven=report.cases.find(c=>c.caseId==="different-utama");
    assert.deepEqual(uneven.analysis.chair.candidateMemberIds,["member-1","member-2"]);
    assert.deepEqual(uneven.members.slice(0,2).map(m=>m.samyoga.counts.Utama),[2,3]);
    assert.equal(report.cases.find(c=>c.caseId==="single-chair").analysis.chair.status,"single_candidate");
    assert.equal(report.cases.find(c=>c.caseId==="multiple-chair").analysis.chair.status,"multiple_candidates");
});

test("G6B6 review: caution, disputed mappings and participation do not become fabricated positions",()=>{
    const review=report.cases.find(c=>c.caseId==="caution-and-disputed");
    const sungenge=review.members[0];
    assert.equal(sungenge.profiles.find(p=>p.id==="leader-direct").status,"review_required");
    assert(!sungenge.chairCandidate);assert(sungenge.contributionProfiles.includes("Komunikasi"));
    assert(review.members[1].ambiguous.some(e=>e.evidenceId==="C-PLAN-02"));
    for(const c of report.cases)for(const row of c.members){
        for(const p of row.profiles)assert(p.support.every(s=>!["C-PLAN-02","C-PLAN-03"].includes(s.evidenceId)));
        assert(!row.recommendedPositions.includes("Koordinator"));assert(!row.recommendedPositions.includes("Wakil Ketua"));
        assert(!row.recommendedPositions.includes("Anggota Kelompok"));
        if(!row.recommendedPositions.length)assert.equal(row.participationLabel,"Anggota Kelompok — Kecenderungan posisi belum spesifik.");
    }
    assert(report.cases.find(c=>c.caseId==="no-specific").members.every(m=>!m.recommendedPositions.length));
});
