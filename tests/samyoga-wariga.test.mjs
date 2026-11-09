import assert from "node:assert/strict";
import {spawnSync} from "node:child_process";
import test from "node:test";
import {loadTypeScriptModule as load,projectRoot} from "./samyoga-test-loader.mjs";

const {calculateWarigaCareer:calculate,WARIGA_MANGSA,WARIGA_CAREER_RULES}=load("lib/samyoga/tenung-wariga-career.ts");
// Independently curated from the supplied book's printed pages 3-15.
// Not all rows name one best profession: null is intentional, not missing data.
const cases=[
 ["Kaso","Eka","2025-07-06",["Pengarang","Wartawan"],[3]],
 ["Kaso","Dwi","2025-07-07",["Pegawai"],[3]],
 ["Kaso","Tri","2025-07-01",["Ahli bangunan"],[3]],
 ["Karo","Eka","2025-08-03",["Wiraswasta perdagangan"],[4]],
 ["Karo","Dwi","2025-08-04",["Seniman musik dan lagu"],[4]],
 ["Karo","Tri","2025-08-05",["Aparat pemerintah","Penegak hukum","ABRI","Industri tekstil","Biro jasa","Pegawai atau pemimpin biro bangunan dan real estate"],[4]],
 ["Katiga","Eka","2025-09-07",["Wartawan","Komunikasi"],[5]],
 ["Katiga","Dwi","2025-09-01",["Pengacara atau pembela perkara"],[5,6]],
 ["Katiga","Tri","2025-09-02",["Penerbit","Percetakan"],[6]],
 ["Kapat","Eka","2025-10-01",["Tata ruang","Dekorasi interior"],[6,7]],
 ["Kapat","Dwi","2025-10-06",["Pengarang"],[7]],
 ["Kapat","Tri","2025-10-02",["Polisi","Penegakan hukum"],[7]],
 ["Kalima","Eka","2025-11-02",["Polisi"],[7]],
 ["Kalima","Dwi","2025-11-03",["Pembangunan","Kontraktor"],[8]],
 ["Kalima","Tri","2025-11-01",["Kosmetik","Kapsalon"],[8]],
 ["Kanem","Eka","2025-12-05",["Penerbit"],[8]],
 ["Kanem","Dwi","2025-12-01",["Kemiliteran","Seni lukis"],[8,9]],
 ["Kanem","Tri","2025-12-02",["Pembela perkara","Biro pengacara atau LBH"],[9]],
 ["Kapitu","Eka","2025-01-01",["Produser film"],[9,10]],
 ["Kapitu","Dwi","2025-01-06",null,[10]],
 ["Kapitu","Tri","2025-01-07",["Wartawan"],[10]],
 ["Kawulu","Eka","2025-02-05",["Perdagangan alat elektronik"],[10,11]],
 ["Kawulu","Dwi","2025-02-10",["Pengarang"],[11]],
 ["Kawulu","Tri","2025-02-06",["Pegawai negeri"],[11]],
 ["Kasanga","Eka","2025-03-02",["Wartawan","Koresponden media"],[12]],
 ["Kasanga","Dwi","2025-03-03",["Psikologi"],[12]],
 ["Kasanga","Tri","2025-03-04",["Perkapalan"],[12]],
 ["Kasadasa","Eka","2025-04-06",["Wartawan"],[13]],
 ["Kasadasa","Dwi","2025-04-07",null,[13]],
 ["Kasadasa","Tri","2025-04-01",["Pengarang"],[13]],
 ["Desta","Eka","2025-05-04",["Seni"],[14]],
 ["Desta","Dwi","2025-05-05",null,[14]],
 ["Desta","Tri","2025-05-01",["Wirausaha teknik","Pabrik teknik","Bengkel"],[14]],
 ["Saddha","Eka","2025-06-01",null,[14,15]],
 ["Saddha","Dwi","2025-06-02",["Pelukis"],[15]],
 ["Saddha","Tri","2025-06-03",["Penerbit"],[15]],
];
for(const [mangsa,dayGroup,date,preferred,pages] of cases)test(`Wariga source row ${mangsa}/${dayGroup}`,()=>{
 const r=calculate(date);assert.equal(r.status,"interpreted");assert.equal(r.mangsa,mangsa);assert.equal(r.dayGroup,dayGroup);
 assert.deepEqual(r.explicitlyPreferred,preferred);assert.deepEqual(r.reference.printedPages,pages);
 assert.deepEqual(r.reference.pdfPages,pages.map(x=>x+5));assert(r.professions.length>0);assert(r.explanation.length>20);
});
test("Wariga has exactly twelve Mangsa and all 36 day-group rules",()=>{
 assert.equal(WARIGA_MANGSA.length,12);assert.equal(cases.length,36);
 assert.deepEqual(Object.keys(WARIGA_CAREER_RULES).sort(),WARIGA_MANGSA.map(x=>x.name).sort());
 for(const row of Object.values(WARIGA_CAREER_RULES))assert.deepEqual(Object.keys(row).sort(),["Dwi","Eka","Tri"]);
});
test("Wariga checks every documented interval boundary, without substituting general Pranata dates",()=>{
 const boundaries={"06-22":"Saddha","06-23":"Kaso","08-02":"Kaso","08-03":"Karo","08-25":"Karo","08-26":"Katiga","09-18":"Katiga","09-19":"Kapat","10-13":"Kapat","10-14":"Kalima","11-09":"Kalima","11-10":"Kanem","12-22":"Kanem","12-23":"Kapitu","01-01":"Kapitu","02-03":"Kapitu","02-05":"Kawulu","03-01":"Kawulu","03-02":"Kasanga","03-26":"Kasanga","03-27":"Kasadasa","04-19":"Kasadasa","04-20":"Desta","05-12":"Desta","05-13":"Saddha"};
 for(const [date,mangsa] of Object.entries(boundaries))for(const year of [2000,2025])assert.equal(calculate(`${year}-${date}`).mangsa,mangsa,date);
});
test("Wariga Feb4 abstains in leap and common years; Feb5 is unambiguous",()=>{
 for(const year of [1900,2000,2024,2025,2100]){
  const r=calculate(`${year}-02-04`);assert.equal(r.status,"ambiguous");assert.equal(r.mangsa,null);assert.deepEqual(r.professions,[]);assert.equal(r.explicitlyPreferred,null);
  assert.equal(calculate(`${year}-02-05`).mangsa,"Kawulu");
 }
 assert.equal(calculate("2000-02-29").mangsa,"Kawulu");assert.equal(calculate("2024-02-29").mangsa,"Kawulu");
});
test("Wariga rejects invalid civil dates instead of rollover",()=>{
 for(const d of ["1900-02-29","2100-02-29","2025-02-29","2025-04-31","2025-13-01","2025-00-01","2025-01-00","2025-2-01","not-a-date",null,{},new Date(NaN)])assert.throws(()=>calculate(d));
});
test("Wariga covers a whole common/leap year with only the documented February4 ambiguity",()=>{
 for(const year of [2024,2025]){
  let days=0,ambiguities=0;
  for(let stamp=Date.UTC(year,0,1);stamp<Date.UTC(year+1,0,1);stamp+=86400000){const r=calculate(new Date(stamp).toISOString().slice(0,10));days++;if(r.status==="ambiguous")ambiguities++;}
  assert.equal(days,year===2024?366:365);assert.equal(ambiguities,1);
 }
});
test("Wariga weekday groups cover Sunday through Saturday from civil Gregorian dates",()=>{
 const names=["Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"],groups=["Eka","Dwi","Tri","Eka","Tri","Eka","Tri"];
 for(let i=0;i<7;i++){const r=calculate(`2025-07-${String(6+i).padStart(2,"0")}`);assert.equal(r.day,names[i]);assert.equal(r.dayGroup,groups[i]);}
});
test("Wariga returns independent copies and keeps dual/null source emphasis without a ranking",()=>{
 const a=calculate("2025-07-06"),b=calculate("2025-07-06");assert.deepEqual(a,b);a.professions.length=0;a.reference.printedPages.push(99);assert.deepEqual(calculate("2025-07-06"),b);
 assert.equal(calculate("2025-12-01").explicitlyPreferred.length,2);assert(calculate("2025-12-01").preferenceNote);
 assert.equal(calculate("2025-04-07").explicitlyPreferred,null);
});
test("Wariga full outputs are identical in Makassar and Los_Angeles",()=>{
 const dates=[...cases.map(x=>x[2]),"2024-02-29","2025-02-04","0000-01-01","9999-12-31"];
 const code=`import{loadTypeScriptModule as l}from'./tests/samyoga-test-loader.mjs';console.log(JSON.stringify(${JSON.stringify(dates)}.map(l('lib/samyoga/tenung-wariga-career.ts').calculateWarigaCareer)));`;
 const results=["Asia/Makassar","America/Los_Angeles"].map(TZ=>{const r=spawnSync(process.execPath,["--input-type=module","-e",code],{cwd:projectRoot,env:{...process.env,TZ},encoding:"utf8"});assert.equal(r.status,0,r.stderr);return r.stdout;});
 assert.equal(results[0],results[1]);
});
