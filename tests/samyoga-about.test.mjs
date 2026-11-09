import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import ts from "typescript";
import {loadTypeScriptModule as load,projectRoot} from "./samyoga-test-loader.mjs";

const file=path.join(projectRoot,"components/samyoga-group/AboutWarigaMethod.tsx");
const source=fs.readFileSync(file,"utf8");
const compiled=ts.transpileModule(source,{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
const mod={exports:{}};new Function("exports","require","module",compiled)(mod.exports,createRequire(import.meta.url),mod);
const guide=mod.exports;

test("About Wariga educational example matches the actual server engine and source page",()=>{
 const example=guide.WARIGA_METHOD_EXAMPLE;
 const actual=load("lib/samyoga/tenung-wariga-career.ts").calculateWarigaCareer(example.date);
 assert.equal(actual.status,"interpreted");assert.equal(actual.day,example.day);
 assert.equal(actual.mangsa,example.mangsa);assert.equal(actual.dayGroup,example.group);
 assert.equal(actual.sourceInterval,example.interval);assert.deepEqual(actual.explicitlyPreferred,[...example.preferred]);
 assert(actual.reference.printedPages.includes(example.printedPage));assert(actual.reference.pdfPages.includes(example.pdfPage));
 assert(renderToStaticMarkup(React.createElement(guide.default)).includes(actual.methodVersion));
});
test("About guide renders the real lookup, ambiguity policy and interpretation boundaries",()=>{
 const html=renderToStaticMarkup(React.createElement(guide.default));
 for(const text of ["Metode Perhitungan Ramalan Profesi","Tenung Wariga Gemet","Minggu, Rabu, Jumat","Senin","Selasa, Kamis, Sabtu","Tabel36[mangsa][kelompok]","ambiguous","4 Februari","5 Februari","Ketua/Wakil","belum divalidasi ahli","bukan data anggota"])
  assert(html.includes(text),text);
 assert(html.includes("Pengarang atau Wartawan"));assert.doesNotMatch(html,/0\.4|0\.6|WARIGA_CAREER_RULES/);
 assert.equal(load("lib/samyoga/tenung-wariga-career.ts").calculateWarigaCareer("2025-02-04").professions.length,0);
});
test("About adds exactly one canonical bibliography link to Tenung Wariga Gemet",()=>{
 const page=fs.readFileSync(path.join(projectRoot,"app/about/page.tsx"),"utf8");
 assert.equal(guide.WARIGA_REFERENCE_URL,"https://id.scribd.com/document/743338223/Tenung-Wariga-Gemet?doc_id=743338223&order=702238034");
 assert.equal((page.match(/href=\{WARIGA_REFERENCE_URL\}/g)??[]).length,1);
 assert.equal((page.match(/id="tenung-wariga-gemet-reference"/g)??[]).length,1);
 assert.match(page,/href=\{WARIGA_REFERENCE_URL\} target="_blank" rel="noopener noreferrer"/);
 assert.equal((page.match(/<ul className="space-y-3 text-sm text-stone-600 font-mono">/g)??[]).length,1);
});
test("About public guide imports no private career data; only the explicit educational example is public",()=>{
 assert.doesNotMatch(source,/from\s+["'][^"']*(?:tenung-wariga-career|career-access\.server)["']/);
 assert.doesNotMatch(source,/WARIGA_CAREER_RULES|815053390bb523ba0b834f074335098fa/);
 assert.deepEqual([...guide.WARIGA_METHOD_EXAMPLE.preferred],["Pengarang","Wartawan"]);
});
test("About retains all eleven historical tab sections including formulas and styling",()=>{
 const text=fs.readFileSync(path.join(projectRoot,"app/about/page.tsx"),"utf8");
 const tree=ts.createSourceFile("about.tsx",text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);
 const chunks={jodoh:[],otonan:[],"pal-sri":[]};
 function visit(node){
  if(ts.isJsxExpression(node)&&node.expression&&ts.isBinaryExpression(node.expression)&&node.expression.operatorToken.kind===ts.SyntaxKind.AmpersandAmpersandToken){
   const match=node.expression.left.getText(tree).match(/^activeTab === '([^']+)'$/);
   if(match&&chunks[match[1]])chunks[match[1]].push(node.getText(tree).replaceAll("&quot;",'"').replaceAll("\r\n","\n"));
  }
  ts.forEachChild(node,visit);
 }
 visit(tree);
 const expected={jodoh:[6,"81152f9f30534339538ad7824e23790cd45963953c781f2d3acb58ab59bcc7e0"],otonan:[4,"805cfb012bcebc59d803f98502fdb98a45f508109728f10a44c446f49ef59ff9"],"pal-sri":[1,"2b07cd2257eae601415b93bdd2f3bfce5c32a3c216124ea0edb009a8344aeae2"]};
 for(const [tab,[count,hash]] of Object.entries(expected)){
  assert.equal(chunks[tab].length,count);assert.equal(createHash("sha256").update(chunks[tab].join("\n")).digest("hex"),hash,tab);
 }
});
