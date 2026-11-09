import assert from "node:assert/strict";
import {createRequire} from "node:module";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import ts from "typescript";
import {loadTypeScriptModule, projectRoot} from "./samyoga-test-loader.mjs";

const runtimeRequire = createRequire(import.meta.url);
const members = [
    {id:"z", displayName:"  Ayu  ", birthDate:"2025-07-06", birthTime:"12:00"},
    {id:"a", displayName:"", birthDate:"2025-02-04", birthTime:"12:00"},
    {id:"m", displayName:"Made", birthDate:"2025-12-01", birthTime:"12:00"},
];
function component(file, mocks = {}) {
    const filename = path.join(projectRoot, file);
    const code = ts.transpileModule(fs.readFileSync(filename,"utf8"), {fileName:filename,
        compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    const mod = {exports:{}};
    new Function("exports","require","module",code)(mod.exports,specifier => {
        if (specifier in mocks) return mocks[specifier];
        return runtimeRequire(specifier);
    },mod);
    return mod.exports.default;
}
const Card = component("components/samyoga-group/SamyogaCareerCard.tsx");
const Locked = component("components/samyoga-group/SamyogaCareerLockedResult.tsx");
function render(data = null, uid = null) {
    const Results = component("components/samyoga-group/SamyogaGroupCareerResults.tsx", {
        "@/components/netra-hasta/NetraAccountProvider": {useNetraAccount:() => ({uid,loading:false,busy:false,configured:true})},
        "@/hooks/useSamyogaCareer": {useSamyogaCareer:() => ({data,busy:false,error:"",reauthenticate:false,clear(){},load(){}})},
        "./SamyogaCareerCard": {__esModule:true,default:Card},
        "./SamyogaCareerLockedResult": {__esModule:true,default:Locked},
        "./SamyogaGroupPositionExperiment": {__esModule:true,default:() => React.createElement("section",{"data-position-results":true},
            ...members.map(member => React.createElement("article",{"data-position-member":member.id,key:member.id},"Public position")))},
    });
    return renderToStaticMarkup(React.createElement(Results,{members,result:{}}));
}
test("Career section follows all free positions; anonymous HTML has one skeleton container, overlay and login CTA", () => {
    const html = render();
    assert(html.lastIndexOf("data-position-member") < html.indexOf("data-career-section"));
    assert.equal((html.match(/data-career-locked/g) ?? []).length,1);
    assert.equal((html.match(/data-career-card/g) ?? []).length,0);
    assert.equal((html.match(/data-career-placeholder=/g) ?? []).length,1);
    assert.equal((html.match(/data-career-overlay/g) ?? []).length,1);
    assert.equal((html.match(/data-career-login-cta/g) ?? []).length,1);
    assert.equal((html.match(/aria-hidden="true" inert=""/g) ?? []).length,1);
    assert.match(html,/Ramalan Profesi.*Tenung Wariga Gemet/);
    assert.match(html,/Masuk untuk melihat ramalan profesi/);
    assert.match(html,/Masuk \/ Daftar/);
    assert.doesNotMatch(html,/Pengarang|Wartawan|Kemiliteran|explicitlyPreferred|<dl|halaman cetak/);
});
test("Verified career cards retain input order, trimmed/fallback names and ID-based response matching", () => {
    const {calculateWarigaCareer} = loadTypeScriptModule("lib/samyoga/tenung-wariga-career.ts");
    const data = {members:[...members].reverse().map(member => ({memberId:member.id,reading:calculateWarigaCareer(member.birthDate)}))};
    const html = render(data,"verified-owner");
    assert.deepEqual([...html.matchAll(/data-career-member="([^"]+)"/g)].map(match=>match[1]),["z","a","m"]);
    assert.match(html,/>Ayu<\/h3>/); assert.match(html,/>Anggota 2<\/h3>/); assert.match(html,/>Made<\/h3>/);
    assert.equal((html.match(/data-career-status="interpreted"/g) ?? []).length,2);
    assert.equal((html.match(/data-career-status="ambiguous"/g) ?? []).length,1);
    const cards = html.split("data-career-card").slice(1);
    assert.match(cards[0],/Pengarang, Wartawan/);
    assert.match(cards[1],/tidak dipaksakan/);
    assert.match(cards[2],/Kemiliteran, Seni lukis/);
    assert.doesNotMatch(html,/data-career-placeholder/);
    assert.match(html,/disabled=""[^>]*>Profesi sudah terbuka/);
});
test("A cleared or expired career result returns to skeletons while preserving free position results", () => {
    const html = render(null,"verified-owner");
    assert.equal((html.match(/data-position-member=/g) ?? []).length,3);
    assert.equal((html.match(/data-career-locked/g) ?? []).length,1);
    assert.equal((html.match(/data-career-card/g) ?? []).length,0);
    assert.match(html,/Verifikasi dan buka profesi/);
    assert.doesNotMatch(html,/Bidang yang disebut sumber|halaman cetak/);
});
test("Position component has no profession dependency or render slot; all protected position markup remains", () => {
    const source = fs.readFileSync(path.join(projectRoot,"components/samyoga-group/SamyogaGroupPositionExperiment.tsx"),"utf8");
    assert.doesNotMatch(source,/renderCareer|SamyogaCareer|tenung-wariga-career|career-access/);
    for (const marker of ["data-chair-summary","data-contribution-profiles","data-lintang-box","Mengapa posisi ini direkomendasikan?","Ketua dan Wakil belum ditetapkan."]) assert(source.includes(marker));
});
test("Only the group skeleton is blurred; the overlay, title/description and verified cards are separate", () => {
    const source = fs.readFileSync(path.join(projectRoot,"components/samyoga-group/SamyogaCareerLockedResult.tsx"),"utf8");
    assert.equal((source.match(/blur-\[5px\]/g) ?? []).length,1);
    const skeleton = source.split('data-career-placeholder aria-hidden')[1].split('<div data-career-overlay')[0];
    assert.doesNotMatch(skeleton,/reading|professions|explanation|children/);
    assert.doesNotMatch(source.split('<div data-career-overlay')[1],/blur-/);
    const card = fs.readFileSync(path.join(projectRoot,"components/samyoga-group/SamyogaCareerCard.tsx"),"utf8");
    assert.doesNotMatch(card,/blur-|data-career-locked|<button|<svg/);
    const html = render();
    assert(html.indexOf("</header>") < html.indexOf("data-career-locked"));
});
test("A six-member lock still has one CTA; loading and safe error states never contain real results", () => {
    const props = {memberCount:6,busy:false,signedIn:false,error:"",onLogin(){},loginExpanded:false,loginId:"test-login"};
    const html = renderToStaticMarkup(React.createElement(Locked,props));
    assert.equal((html.match(/data-career-placeholder-card/g) ?? []).length,6);
    assert.equal((html.match(/data-career-login-cta/g) ?? []).length,1);
    const loading = renderToStaticMarkup(React.createElement(Locked,{...props,busy:true}));
    assert.match(loading,/aria-busy="true"/); assert.doesNotMatch(loading,/<button|Pengarang|Wartawan/);
    const error = renderToStaticMarkup(React.createElement(Locked,{...props,error:"Akses belum dapat diverifikasi."}));
    assert.match(error,/role="alert"/); assert.match(error,/Akses belum dapat diverifikasi/);
    assert.doesNotMatch(error,/Pengarang|Wartawan/);
});
