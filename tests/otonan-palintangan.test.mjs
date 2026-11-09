import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import {spawnSync} from "node:child_process";
import {loadTypeScriptModule as load,projectRoot} from "./samyoga-test-loader.mjs";
const o=load("lib/otonan-calendar.ts"),calendar=load("lib/balinese-calendar.ts"),reverse=load("lib/otonan-logic.ts");
test("Otonan R1: shared adapter returns existing engine result without a new formula",()=>{
 for(const date of ["2005-07-27","2000-02-29","1900-01-01"])for(const time of ["05:59","06:00","12:00"]){
  const actual=o.calculateOtonanCalendar(date,time),expected=calendar.getBalineseDate(o.parseOtonanCivilDate(date),time);
  assert.equal(actual.lintang,expected.lintang);assert.equal(actual.wuku,expected.wuku);assert.equal(actual.saptawara,expected.saptawara);
  assert.equal(actual.totalUrip,expected.totalUrip);assert.equal(actual.totalUripSodasaRsi,expected.totalUripSodasaRsi);
 }
});
test("Otonan R1: Tiwa-tiwa fixture comes from actual direct and reverse engine lookup",()=>{
 const r=o.calculateOtonanCalendar("2005-07-27","12:00");
 assert.equal(r.lintang.lintang,"Tiwa-tiwa");
 assert.equal(calendar.findLintang(r.saptawara.hari,r.pancawara.nama),r.lintang);
 assert(reverse.findMasehiDates(r.saptawara.hari.split("/")[0],r.pancawara.nama,r.wuku.nama_wuku,2005,2005)
  .some(x=>x.date.getFullYear()===2005&&x.date.getMonth()===6&&x.date.getDate()===27));
});
test("Otonan R1: civil validation rejects rollover/invalid strings and invalid birth time",()=>{
 for(const date of ["2023-02-29","2026-13-01","not-a-date"])assert.throws(()=>o.calculateOtonanCalendar(date,"12:00"));
 for(const time of ["24:00","12:99",""])assert.throws(()=>o.calculateOtonanCalendar("2005-07-27",time));
});
test("Otonan R1: timezone fix reproduces old mismatch and restores shared Lintang",()=>{
 const code="import{loadTypeScriptModule as l}from'./tests/samyoga-test-loader.mjs';const c=l('lib/balinese-calendar.ts'),o=l('lib/otonan-calendar.ts');console.log(JSON.stringify({old:c.getBalineseDate(new Date('2005-07-27'),'12:00').lintang.lintang,new:o.calculateOtonanCalendar('2005-07-27','12:00').lintang.lintang}));";
 const result=["Asia/Makassar","America/Los_Angeles"].map(TZ=>{
  const r=spawnSync(process.execPath,["--input-type=module","-e",code],{cwd:projectRoot,env:{...process.env,TZ},encoding:"utf8"});assert.equal(r.status,0);return JSON.parse(r.stdout);
 });
 assert.equal(result[0].old,"Tiwa-tiwa");assert.equal(result[1].old,"Jongsarat");
 assert.equal(result[0].new,"Tiwa-tiwa");assert.equal(result[1].new,"Tiwa-tiwa");
});
test("Otonan R1: actual UI uses shared civil calculation and preserves original Lintang fields",()=>{
 const ui=fs.readFileSync(path.join(projectRoot,"app/ramalan-otonan/page.tsx"),"utf8");
 assert(ui.includes("calculateOtonanCalendar(birthDate, birthTime)"));assert(!ui.includes("new Date(birthDate)"));
 for(const field of ["result.lintang.lintang","result.lintang.label","result.lintang.makna","result.lintang.penjelasan"])assert(ui.includes(field));
});
