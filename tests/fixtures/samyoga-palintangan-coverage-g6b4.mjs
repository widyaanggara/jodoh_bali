// Offline research audit. No runtime imports this module; no date, network or persistence input.
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {loadTypeScriptModule as load} from "../samyoga-test-loader.mjs";

export const catalogue = JSON.parse(fs.readFileSync(new URL("./samyoga-palintangan-mapping-g6b4.json", import.meta.url), "utf8"));
export const master = load("lib/data.ts").dataLintang;
export const existingEvidence = load("lib/samyoga-palintangan-experiment-rules.ts").EXPERIMENT_POSITION_EVIDENCE;
export const profileRules = load("lib/samyoga-palintangan-experiment-rules.ts").EXPERIMENT_PROFILE_RULES;
const TEXTUAL = "DIDUKUNG TEKSTUAL", INTERPRET = "PERLU INTERPRETASI";
const AMBIGUOUS = "AMBIGU", REJECTED = "TIDAK DIDUKUNG";
const idOf = row => "lintang:" + row.saptawara + ":" + row.pancawara;
const unique = values => [...new Set(values)];
const decisions = [TEXTUAL, INTERPRET, AMBIGUOUS, REJECTED];
const dimensions = ["directing", "planning", "managing", "communicating", "executing", "collaborating"];

export function validateCatalogue(draft = catalogue, source = master, baseline = existingEvidence) {
    assert.equal(draft.scope, "offline-audit-only");
    assert.equal(draft.activation, false);
    assert.deepEqual(draft.dimensions, dimensions);
    assert.deepEqual(draft.decisions, decisions);
    assert.equal(source.length, 35);
    assert.equal(new Set(source.map(idOf)).size, 35);
    assert.equal(draft.records.length, 35);
    assert.deepEqual([...draft.records.map(r => r.lintangId)].sort(), source.map(idOf).sort());
    const mappingIds = new Set(), links = [];
    for (const row of draft.records) {
        const original = source.find(s => idOf(s) === row.lintangId);
        assert(original);
        assert.equal(row.name, original.lintang);
        assert.equal(row.sourceReference.file, "lib/data.ts");
        assert.equal(row.sourceReference.exportName, "dataLintang");
        assert.equal(row.sourceReference.field, "penjelasan");
        for (const key of ["relevantPhrases", "cautionPhrases", "ambiguousPhrases"]) {
            assert(Array.isArray(row[key]));
            for (const phrase of row[key]) {
                assert(phrase.length > 0);
                assert(original.penjelasan.includes(phrase), row.lintangId + ": quote differs from master");
            }
        }
        assert(row.cautionNote.length > 20);
        for (const m of row.mappings) {
            assert.match(m.mappingId, /^DRAFT-G6B4-L\d{2}-(DIR|PLAN|MAN|COMM|EXEC|COLL)-\d{2}$/);
            assert(!mappingIds.has(m.mappingId));
            mappingIds.add(m.mappingId);
            assert.equal(m.lintangId, row.lintangId);
            assert.deepEqual(m.sourceReference, row.sourceReference);
            assert(original.penjelasan.includes(m.phrase) && m.phrase.length > 0, m.mappingId + ": phrase differs from master");
            assert(dimensions.includes(m.dimension));
            assert(["support", "caution", "ambiguous"].includes(m.kind));
            assert(decisions.includes(m.decision));
            if (m.kind === "ambiguous") assert([AMBIGUOUS, REJECTED].includes(m.decision));
            else assert([TEXTUAL, INTERPRET].includes(m.decision));
            assert(m.rationale.length > 15 && m.limitations.length > 15);
            assert.equal(m.dependencyGroup, m.mappingId.match(/^(DRAFT-G6B4-L\d{2})-/)[1] + "-SOURCE");
            assert.equal(m.active, false);
            for (const item of [row, m]) {
                assert.equal(item.provenanceStatus, "missing");
                assert.equal(item.culturalReviewStatus, "pending");
                assert.equal(item.experimentalApprovalStatus, "draft_pending");
            }
            if (m.existingEvidenceId) {
                const e = baseline.find(e => e.evidenceId === m.existingEvidenceId);
                assert(e, "invented existing evidence ID");
                assert.equal(e.masterRecordId, row.lintangId);
                assert.equal(e.indicatorValue, row.name);
                assert.equal(e.excerpt, original.penjelasan);
                assert.equal(e.dimension, m.dimension);
                assert.equal(e.polarity, m.kind);
                links.push(e.evidenceId);
            }
        }
    }
    assert.deepEqual(links.sort(), baseline.map(e => e.evidenceId).sort());
    return {identities: source.length, mappingAssertions: mappingIds.size, existingLinks: links.length};
}

function profileStates(support, caution, rules = profileRules) {
    const profiles = rules.map(r => ({
        profile: r.profile,
        supported: r.requiredDimensions.filter(d => support.includes(d)),
        missing: r.requiredDimensions.filter(d => !support.includes(d)),
        conflicts: r.requiredDimensions.filter(d => support.includes(d) && caution.includes(d)),
    }));
    for (const p of profiles) p.status = p.conflicts.length ? "conflict" :
        !p.missing.length ? "matched" : p.supported.length ? "partial" : "unsupported";
    // Mirrors the frozen G6B.3-R1 policy for comparison only; it is not a new rule.
    if (profiles.some(p => p.status === "conflict" && !p.missing.length))
        for (const p of profiles) if (p.status === "matched") p.status = "conflict";
    return profiles;
}

export function simulate(entries, records = catalogue.records) {
    const perLintang = records.map(r => {
        const matches = entries.filter(m => m.lintangId === r.lintangId);
        const support = dimensions.filter(d => matches.some(m => m.dimension === d && m.kind === "support"));
        const caution = dimensions.filter(d => matches.some(m => m.dimension === d && m.kind === "caution"));
        const profiles = profileStates(support, caution);
        return {
            lintangId: r.lintangId, name: r.name, support, caution,
            matchedProfiles: profiles.filter(p => p.status === "matched").map(p => p.profile),
            profiles,
        };
    });
    const byDimension = Object.fromEntries(dimensions.map(d => [d, {
        support: perLintang.filter(r => r.support.includes(d)).length,
        caution: perLintang.filter(r => r.caution.includes(d)).length,
    }]));
    const matched = Object.fromEntries(profileRules.map(p => [p.profile, perLintang.filter(r => r.matchedProfiles.includes(p.profile)).map(r => r.name)]));
    return {
        acceptedAssertionsForScenario: entries.length,
        byDimension,
        matched,
        multipleProfiles: perLintang.filter(r => r.matchedProfiles.length > 1).length,
        onlyPartial: perLintang.filter(r => !r.matchedProfiles.length && r.profiles.some(p => p.status === "partial") && !r.profiles.some(p => p.status === "conflict")).length,
        conflictWithoutMatch: perLintang.filter(r => !r.matchedProfiles.length && r.profiles.some(p => p.status === "conflict")).length,
        noRecommendation: perLintang.filter(r => !r.matchedProfiles.length).length,
        withoutPositiveSupport: perLintang.filter(r => !r.support.length).length,
        withoutAcceptedMapping: perLintang.filter(r => !r.support.length && !r.caution.length).length,
        cautionOnly: perLintang.filter(r => !r.support.length && r.caution.length).length,
        perLintang,
    };
}

export function buildCoverage(draft = catalogue) {
    validateCatalogue(draft);
    const mappings = draft.records.flatMap(r => r.mappings);
    const existing = existingEvidence.map(e => ({
        lintangId: e.masterRecordId, dimension: e.dimension, kind: e.polarity,
    }));
    const strict = mappings.filter(m => m.decision === TEXTUAL && m.kind !== "ambiguous");
    const interpreted = mappings.filter(m => [TEXTUAL, INTERPRET].includes(m.decision) && m.kind !== "ambiguous");
    const scenarios = {
        existing: simulate(existing, draft.records),
        draftTextual: simulate(strict, draft.records),
        draftInterpretive: simulate(interpreted, draft.records),
    };
    const decisionsCount = Object.fromEntries(decisions.map(d => [d, mappings.filter(m => m.decision === d).length]));
    const dimensionAudit = Object.fromEntries(dimensions.map(d => [d, {
        textualSupport: unique(mappings.filter(m => m.dimension === d && m.kind === "support" && m.decision === TEXTUAL).map(m => m.lintangId)).length,
        interpretiveSupportAdditional: unique(mappings.filter(m => m.dimension === d && m.kind === "support" && m.decision === INTERPRET).map(m => m.lintangId)).filter(id => !mappings.some(m => m.lintangId === id && m.dimension === d && m.kind === "support" && m.decision === TEXTUAL)).length,
        cautionAnyDraft: unique(mappings.filter(m => m.dimension === d && m.kind === "caution").map(m => m.lintangId)).length,
        ambiguous: unique(mappings.filter(m => m.dimension === d && m.decision === AMBIGUOUS).map(m => m.lintangId)).length,
        rejected: unique(mappings.filter(m => m.dimension === d && m.decision === REJECTED).map(m => m.lintangId)).length,
    }]));
    const alternatives = Object.fromEntries(Object.entries(scenarios).map(([key, value]) => [key, {
        managingCoreOnly: value.perLintang.filter(r => r.support.includes("managing")).map(r => r.name),
        communicationProsocialCore: value.perLintang.filter(r => r.support.includes("communicating") && r.support.includes("collaborating")).map(r => ({
            name: r.name, needsCautionReview: r.caution.includes("communicating") || r.caution.includes("collaborating"),
        })),
    }]));
    return {
        version: draft.catalogueVersion, identities: draft.records.length, existingAssertions: existingEvidence.length,
        draftAssertions: mappings.length, linkedExistingAssertions: mappings.filter(m => m.existingEvidenceId).length,
        newDraftAssertions: mappings.filter(m => !m.existingEvidenceId).length,
        decisions: decisionsCount, dimensionAudit,
        recordsWithCautionContext: draft.records.filter(r => r.cautionPhrases.length).length,
        recordsWithoutCautionContext: draft.records.filter(r => !r.cautionPhrases.length).map(r => r.name),
        recordsWithAmbiguousContext: draft.records.filter(r => r.ambiguousPhrases.length).length,
        withoutAnyNonRejectedProposal: draft.records.filter(r => !r.mappings.some(m => m.decision !== REJECTED)).length,
        scenarios, alternatives,
    };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    process.stdout.write(JSON.stringify(buildCoverage(), null, 2) + "\n");
