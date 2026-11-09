import assert from "node:assert/strict";
import {createHash} from "node:crypto";
import {createRequire} from "node:module";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import ts from "typescript";
import {createFunctionalReview} from "./fixtures/samyoga-member-positions-review.mjs";
import {projectRoot} from "./samyoga-test-loader.mjs";

test("Career feature leaves all nine baseline group/position/chair review snapshots byte-identical",()=>{
 const serialized=JSON.stringify(createFunctionalReview())+"\n";
 assert.equal(createHash("sha256").update(serialized).digest("hex"),"92a7522dd7e567ca001e6d592840f8c9f76ff978d2791517cc7d6212e50348c7");
});
test("Career member card renders nothing when no verified reading is provided",()=>{
 const file=path.join(projectRoot,"components/samyoga-group/SamyogaCareerCard.tsx");
 const code=ts.transpileModule(fs.readFileSync(file,"utf8"),{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
 const mod={exports:{}};new Function("exports","require","module",code)(mod.exports,createRequire(import.meta.url),mod);
 const html=renderToStaticMarkup(React.createElement(mod.exports.default,{memberId:"sample-a",displayName:"Anggota 1",reading:null}));
 assert.equal(html,"");
 assert.doesNotMatch(html,/Pengarang|explicitlyPreferred|<dl|Bidang profesi dari sumber|halaman cetak/);
});
test("Career client modules never import the profession engine or server access rules",()=>{
 for(const file of ["hooks/useSamyogaCareer.ts","components/samyoga-group/SamyogaCareerCard.tsx","components/samyoga-group/SamyogaCareerLockedResult.tsx","components/samyoga-group/SamyogaGroupCareerResults.tsx","lib/samyoga/career-contract.ts"]){
  const source=fs.readFileSync(path.join(projectRoot,file),"utf8");
  assert.doesNotMatch(source,/from\s+["'][^"']*(?:tenung-wariga-career|career-access\.server)["']/);
  assert.doesNotMatch(source,/WARIGA_CAREER_RULES|815053390bb523ba0b834f074335098fa/);
 }
});
