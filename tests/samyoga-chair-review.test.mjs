import assert from "node:assert/strict";
import test from "node:test";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { projectRoot } from "./samyoga-test-loader.mjs";
import { getSyntheticChairScenario, SYNTHETIC_CHAIR_CASE_IDS } from "./fixtures/samyoga-chair-scenarios.mjs";
import { evaluateSyntheticChairScenario } from "./fixtures/samyoga-chair-prototype.mjs";

const evaluate = (id, transforms) => evaluateSyntheticChairScenario(getSyntheticChairScenario(id, transforms));
test("G8-R1: equivalence cannot have known vs UNKNOWN ordering against the same third candidate", () => {
    const result = evaluate("G8R1-EQUIVALENCE-UNKNOWN");
    assert.equal(result.status, "not_evaluated");
    assert.equal(result.chairMemberId, null);
    assert.ok(result.reasonCodes.includes("COMPARATOR_INCONSISTENT"));
    assert.equal(evaluate("G8R1-EQUIVALENCE-KNOWN").chairMemberId, "a");
    const unknown = evaluate("G8R1-EQUIVALENCE-ALL-UNKNOWN");
    assert.equal(unknown.status, "undetermined");
    assert.equal(unknown.chairMemberId, null);
    assert.equal(unknown.comparisons.filter((row) => row.result === "UNKNOWN").length, 2);
});
test("G8-R1: malformed registered fixture objects fail closed instead of throwing", () => {
    for (const id of ["G8R1-NULL-MEMBER", "G8R1-NULL-SUMMARY", "G8R1-NULL-PAIR",
        "G8R1-NULL-COMPARATOR", "G8R1-NONARRAY-ROWS", "G8R1-NULL-ROW", "G8R1-MALFORMED-PROOF"]) {
        const result = evaluate(id);
        assert.equal(result.status, "not_evaluated", id);
        assert.equal(result.chairMemberId, null, id);
        assert.equal(result.deputyMemberId, null, id);
        assert.ok(result.reasonCodes.length, id);
    }
});
test("G8-R1: N-1 and valid global totals alone cannot validate member summaries", () => {
    const scenario = getSyntheticChairScenario("G8R1-BALANCED-WRONG-SUMMARY");
    for (const category of ["Utama", "Madia", "Nista"]) {
        assert.equal(scenario.summaries.reduce((sum, row) => sum + row.counts[category], 0),
            2 * scenario.pairs.filter((pair) => pair.category === category).length);
    }
    assert.ok(scenario.summaries.every((row) => Object.values(row.counts).reduce((a, b) => a + b, 0) === 3));
    assert.ok(evaluate("G8R1-BALANCED-WRONG-SUMMARY").reasonCodes.includes("RELATION_SUMMARY_MISMATCH"));
    assert.ok(evaluate("G8R1-IMPOSSIBLE-DEGREES").reasonCodes.includes("RELATION_SUMMARY_MISMATCH"));
});
test("G8-R1: correct edge count cannot hide a reversed duplicate, missing edge and asymmetric category", () => {
    const scenario = getSyntheticChairScenario("G8R1-SAME-SIZE-ASYMMETRIC-GRAPH");
    assert.equal(scenario.pairs.length, 6);
    assert.equal(new Set(scenario.pairs.map((pair) => pair.pairKey)).size, 5);
    const result = evaluateSyntheticChairScenario(scenario);
    assert.equal(result.status, "not_evaluated");
    assert.ok(result.reasonCodes.includes("INVALID_PAIR_GRAPH"));
});
test("G8-R1: independent incidence audit of every accepted graph", () => {
    let checked = 0;
    for (const id of SYNTHETIC_CHAIR_CASE_IDS) {
        const scenario = getSyntheticChairScenario(id), result = evaluateSyntheticChairScenario(scenario);
        if (result.reasonCodes.some((code) => ["INVALID_GROUP_SHAPE", "INVALID_PAIR_GRAPH", "RELATION_SUMMARY_MISMATCH"].includes(code))) continue;
        const members = scenario.members.map((member) => member.id);
        const expectedPairs = new Set(members.flatMap((a, index) =>
            members.slice(index + 1).map((b) => JSON.stringify([a, b].sort()))));
        assert.deepEqual(new Set(scenario.pairs.map((pair) => pair.pairKey)), expectedPairs, id);
        for (const member of members) {
            const edges = scenario.pairs.filter((pair) => pair.a === member || pair.b === member);
            const summary = scenario.summaries.find((row) => row.memberId === member);
            assert.equal(edges.length, members.length - 1, id);
            for (const category of ["Utama", "Madia", "Nista"]) {
                assert.equal(summary.counts[category], edges.filter((pair) => pair.category === category).length, id);
            }
        }
        for (const category of ["Utama", "Madia", "Nista"]) {
            assert.equal(scenario.summaries.reduce((sum, row) => sum + row.counts[category], 0),
                2 * scenario.pairs.filter((pair) => pair.category === category).length, id);
        }
        checked++;
    }
    assert.ok(checked > 60);
});
test("G8-R1: counterexample is order invariant, not solved by a favorable input order", () => {
    for (const memberOrder of [["a", "b", "c", "d", "e"], ["e", "d", "c", "b", "a"], ["b", "c", "a", "d", "e"]]) {
        const result = evaluate("G8R1-EQUIVALENCE-UNKNOWN", { memberOrder, reverseComparisons: true, reversePairs: true });
        assert.equal(result.status, "not_evaluated");
        assert.equal(result.chairMemberId, null);
    }
});
test("G8-R1: resolved transitive production graph has no sandbox path or unknown local imports", () => {
const root=projectRoot,extensions=["",".ts",".tsx",".js",".jsx",".mjs",".cjs",".json",".css"];
const roots=[];
function walk(dir){if(!fs.existsSync(dir))return;for(const ent of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,ent.name);if(ent.isDirectory())walk(f);else if(/\.[cm]?[jt]sx?$/.test(f))roots.push(f);}}
walk(path.join(root,"app"));
for(const name of ["next.config.ts","tailwind.config.ts","postcss.config.mjs"])if(fs.existsSync(name))roots.push(path.resolve(name));
const todo=[...roots],seen=new Set(),edges=[],external=new Set(),unresolved=[],computed=[];
while(todo.length){
 const file=todo.pop();if(seen.has(file))continue;seen.add(file);
 if(!/\.[cm]?[jt]sx?$/.test(file))continue;
 const tree=ts.createSourceFile(file,fs.readFileSync(file,"utf8"),ts.ScriptTarget.Latest,true);
 const specs=[];
 function visit(node){
 if((ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier))specs.push(node.moduleSpecifier.text);
 if(ts.isCallExpression(node)&&(node.expression.kind===ts.SyntaxKind.ImportKeyword||(ts.isIdentifier(node.expression)&&node.expression.text==="require"))){
 if(node.arguments.length&&ts.isStringLiteral(node.arguments[0]))specs.push(node.arguments[0].text);else computed.push(path.relative(root,file)+":"+node.getStart(tree));
 }
 ts.forEachChild(node,visit);
 }
 visit(tree);
 for(const spec of specs){
 if(!spec.startsWith(".")&&!spec.startsWith("@/")){external.add(spec);continue;}
 const stem=spec.startsWith("@/")?path.join(root,spec.slice(2)):path.resolve(path.dirname(file),spec);
 const candidates=[...extensions.map(ext=>stem+ext),...extensions.slice(1).map(ext=>path.join(stem,"index"+ext))];
 const candidate=candidates.find(f=>fs.existsSync(f)&&fs.statSync(f).isFile());
 if(!candidate){unresolved.push({from:path.relative(root,file),spec});continue;}
 const target=fs.realpathSync(candidate);
 edges.push({from:path.relative(root,file).replaceAll("\\","/"),to:path.relative(root,target).replaceAll("\\","/")});
 if(target.startsWith(path.join(root,"tests")))assert.fail("Production reaches tests: "+target);
 todo.push(target);
 }
}

    assert.equal(unresolved.length, 0);
    assert.equal(computed.length, 0);
    assert.ok(seen.size > 20);
    assert.ok(edges.length > 50);
    const scripts = JSON.parse(fs.readFileSync(path.join(projectRoot, "package.json"), "utf8")).scripts;
    for (const name of ["dev", "build", "start"]) assert.doesNotMatch(scripts[name], /tests|fixtures|synthetic|samyoga-chair/);
});
