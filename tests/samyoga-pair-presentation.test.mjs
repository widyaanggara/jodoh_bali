import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import test from "node:test";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import { loadTypeScriptModule, projectRoot } from "./samyoga-test-loader.mjs";

const helper = loadTypeScriptModule("components/samyoga-group/samyoga-pair-presentation.ts");
const group = loadTypeScriptModule("lib/samyoga-group.ts");
const data = loadTypeScriptModule("lib/data.ts");
const runtimeRequire = createRequire(import.meta.url);
const filename = path.join(projectRoot, "components/samyoga-group/SamyogaGroupPairCard.tsx");
const source = fs.readFileSync(filename, "utf8");
const output = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    fileName: filename,
}).outputText;
const loadedComponent = { exports: {} };
new Function("exports", "require", "module", output)(loadedComponent.exports,
    (specifier) => specifier === "./samyoga-pair-presentation" ? helper : runtimeRequire(specifier), loadedComponent);
const PairCard = loadedComponent.exports.default;
const style = { icon: "visibility", badge: "category-badge", panel: "category-panel" };
const sample = {
    pairKey: JSON.stringify(["a", "b"]), memberAId: "a", memberBId: "b",
    category: "Nista", combinedUrip: 24, modulo5: 4, modulo16: 8,
    sodasaRsi: { sisa: 4, label: "Keturunan", makna: "Sulit Keturunan" },
    symbolicAttention: true, symbolicAttentionNote: "Perhatian simbolis, bukan kegagalan interpersonal.",
};
const render = (pair = sample) => renderToStaticMarkup(React.createElement(PairCard,
    { pair, memberAName: "Anggota A", memberBName: "Anggota B", presentation: style }));
const escapedText = (text) => renderToStaticMarkup(React.createElement("p", null, text)).slice(3, -4);

test("UI-R1: three category narratives match the approved presentation wording exactly", () => {
    assert.equal(helper.SAMYOGA_PAIR_DYNAMICS_TITLE, "Dinamika Relasi Kelompok");
    assert.deepEqual(helper.SAMYOGA_PAIR_CATEGORY_NARRATIVES, {
        Utama: "Hubungan ini berada pada kategori Utama menurut perhitungan simbolis Samyoga. Kategori ini bukan jaminan kecocokan atau keberhasilan kerja sama.",
        Madia: "Hubungan ini berada pada kategori Madia menurut perhitungan simbolis Samyoga. Kategori ini tidak mengukur kualitas kerja sama antaranggota secara langsung.",
        Nista: "Hubungan ini berada pada kategori Nista menurut perhitungan simbolis Samyoga. Hasil ini merupakan perhatian dalam interpretasi tradisional, bukan bukti adanya masalah pribadi atau ketidakmampuan bekerja sama.",
    });
});
test("UI-R1: primary pair information is category dynamics, not a repurposed relationship prediction", () => {
    for (const label of ["Keturunan", "Rezeki", "Kekecewaan", "Bermasalah"]) {
        for (const category of ["Utama", "Madia", "Nista"]) {
            const html = render({ ...sample, category, sodasaRsi: { sisa: 4, label, makna: "Asli: " + label } });
            const main = html.split("<details")[0];
            assert.ok(main.includes("Dinamika Relasi Kelompok"));
            assert.ok(main.includes(helper.SAMYOGA_PAIR_CATEGORY_NARRATIVES[category]));
            assert.ok(!main.includes(label));
            assert.ok(html.includes(label));
            assert.ok(html.includes("Lihat Tafsir Tradisional"));
            assert.ok(!html.includes("Sulit Koordinasi"));
        }
    }
});
test("G6B7: original traditional readings remain intact inside a closed optional disclosure", () => {
    for (const reading of data.dataSodasaRsi) {
        const pair = { ...sample, sodasaRsi: { sisa: reading.sisa, label: reading.label, makna: reading.makna } };
        const before = structuredClone(pair), html = render(pair);
        assert.ok(!html.includes("Sodasa Rsi · Mod16"));
        const main = html.split("<details")[0];
        assert.ok(!main.includes(escapedText(reading.label)));
        assert.ok(html.includes(escapedText(reading.label)));
        assert.ok(html.includes(escapedText(reading.makna)));
        assert.match(html, /<details[^>]*data-traditional-reading/);
        assert.doesNotMatch(html, /<details[^>]*\sopen(?:[\s=>])/);
        assert.deepEqual(pair, before);
    }
});
test("UI-R1: missing readings render without empty panels or substitute interpretations", () => {
    for (const reading of [null, undefined, { sisa: 0, label: "", makna: " " }, { sisa: 0, label: "Unknown", makna: "Unknown" }]) {
        const html = render({ ...sample, sodasaRsi: reading });
        assert.doesNotMatch(html, /<details\b|<summary\b|Lihat Tafsir Tradisional/);
        assert.ok(html.includes("Dinamika Relasi Kelompok"));
    }
});
test("UI-R1: Mod5/Mod16 remain exact for every group pair, without input/output mutation", () => {
    const members = ["1990-01-15", "1992-07-08", "2000-02-29", "2005-07-27", "1988-12-31", "2012-02-29"]
        .map((birthDate, index) => ({ id: "m" + index, birthDate, birthTime: "12:00" }));
    for (const [n, pairCount] of [[3, 3], [4, 6], [5, 10], [6, 15]]) {
        const result = group.calculateSamyogaGroup(members.slice(0, n)), before = structuredClone(result);
        const markup = result.pairs.map((pair) => render(pair));
        assert.equal(markup.length, pairCount);
        result.pairs.forEach((pair, index) => {
            const values = [...markup[index].matchAll(/<dd[^>]*>(\d+)<\/dd>/g)].map((match) => Number(match[1]));
            assert.deepEqual(values, [pair.modulo5, pair.modulo16]);
        });
        assert.deepEqual(result, before);
    }
});
test("UI-R1: Nista attention remains visible independently of traditional interpretation", () => {
    const main = render().split("<details")[0];
    assert.ok(main.includes("bukan bukti adanya masalah pribadi"));
    const full = render();
    assert.ok(full.includes("Perhatian simbolis:"));
    assert.ok(full.includes(sample.symbolicAttentionNote));
});
test("UI-R1: card remains local presentation and preserves responsive/accessibility primitives", () => {
    assert.match(source, /min-w-0/);
    assert.match(source, /break-words/);
    assert.match(source, /<summary aria-controls=\{readingId\}/);
    assert.match(source, /focus:ring-2/);
    assert.match(source, /useId\(\)/);
    assert.doesNotMatch(source, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|localStorage|sessionStorage|indexedDB|firebase|analytics|samyoga-chair|synthetic/i);
    const parent = fs.readFileSync(path.join(projectRoot, "components/samyoga-group/SamyogaGroupResults.tsx"), "utf8");
    assert.ok(parent.includes("showPairDetails &&"));
    assert.ok(parent.includes("result.pairs.map"));
    assert.ok(parent.includes("key={pair.pairKey}"));
    assert.ok(parent.includes("<SamyogaGroupPairCard"));
    assert.ok(!parent.includes("pair.sodasaRsi.label"));
    assert.ok(!parent.includes("pair.sodasaRsi.makna"));
    assert.match(parent, /key=\{memberSummary\.memberId\} className="min-w-0/);
    assert.match(parent, /className="break-words[^"]*">\{displayName\(memberSummary\.memberId\)\}/);
});

test("G6B7: partial readings show only available original fields without fallback text", () => {
    assert.deepEqual(helper.getSamyogaTraditionalReading({label:"Original",makna:"Unknown"}),{label:"Original",meaning:null});
    assert.deepEqual(helper.getSamyogaTraditionalReading({label:"",makna:"Original meaning"}),{label:null,meaning:"Original meaning"});
    assert.equal(helper.getSamyogaTraditionalReading({label:" UNKNOWN ",makna:" "}),null);
    const html=render({...sample,sodasaRsi:{label:"",makna:"Original meaning"}});
    assert(html.includes("data-traditional-meaning"));assert(!html.includes("data-traditional-label"));
});

test("G6B7: independent disclosures have unique linked IDs when rendered together", () => {
    const html=renderToStaticMarkup(React.createElement("div",null,
        ...[0,1,2].map(i=>React.createElement(PairCard,{key:i,pair:sample,memberAName:"A",memberBName:"B",presentation:style}))));
    const ids=[...html.matchAll(/aria-controls="([^"]+)"/g)].map(m=>m[1]);
    assert.equal(ids.length,3);assert.equal(new Set(ids).size,3);
    for(const id of ids)assert(html.includes('id="'+id+'"'));
    assert(!html.includes("<details name="));assert(!html.includes("<details open"));
});
