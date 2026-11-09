import assert from "node:assert/strict";
import test from "node:test";
import {loadTypeScriptModule as load} from "./samyoga-test-loader.mjs";
const {createCareerHandler}=load("lib/samyoga/career-access.server.ts");
const {AccountError}=load("lib/netra-hasta/firebase-identity.server.ts");
const initial=[{id:"a",birthDate:"2025-07-06"},{id:"b",birthDate:"2025-02-04"},{id:"c",birthDate:"2025-12-01"}];
function setup(){
 let now=1000,user={uid:"owner-a",idToken:"verified-a",expiresAt:2000},calls=0;
 const engine=load("lib/samyoga/tenung-wariga-career.ts").calculateWarigaCareer;
 const handler=createCareerHandler(async()=>{if(user instanceof Error)throw user;return user;},{now:()=>now,key:new Uint8Array(32).fill(7),calculate:date=>{calls++;return engine(date);}});
 const request=(body,options={})=>handler(new Request("http://localhost:3000/api/samyoga/career",{method:"POST",headers:{host:"localhost:3000",origin:"http://localhost:3000","content-type":"application/json",...options.headers},body:typeof body==="string"?body:JSON.stringify(body)}));
 return {handler,request,setUser:value=>user=value,setNow:value=>now=value,calls:()=>calls,
  authorize:async(members=initial)=>{const r=await request({action:"authorize",members,memberPermissionConfirmed:true});assert.equal(r.status,200);return r.json();}};
}
const read=(grant,members=initial)=>({action:"analyze",members,grant:grant.grant,groupId:grant.groupId});
test("Career anonymous, forged and expired identities fail before calculation or data disclosure",async()=>{
 const s=setup();
 for(const identity of [new AccountError(401,"login_required","Denied"),new AccountError(401,"invalid_session","Denied"),{uid:"owner-a",idToken:"expired",expiresAt:999}]){
  s.setUser(identity);const r=await s.request(read({grant:"fake",groupId:"guess"}));assert.equal(r.status,401);assert.doesNotMatch(await r.text(),/professions|Pengarang|Kaso|birthDate/);
 }
 assert.equal(s.calls(),0);
});
test("Career same-origin and explicit member permission required; UID cannot be supplied by client",async()=>{
 const s=setup();
 assert.equal((await s.request({action:"authorize",members:initial,memberPermissionConfirmed:true},{headers:{origin:"https://other.test"}})).status,403);
 assert.equal((await s.request({action:"authorize",members:initial,memberPermissionConfirmed:false})).status,403);
 assert.equal((await s.request({action:"authorize",members:initial,memberPermissionConfirmed:true,ownerUid:"victim"})).status,400);
 assert.equal(s.calls(),0);
});
test("Career authorized analysis has bounded no-store response and excludes raw birth fields/names",async()=>{
 const s=setup(),grant=await s.authorize();assert.equal(grant.expiresAt,1600);assert.equal(s.calls(),0);assert.equal(grant.verifiedUid,"owner-a");
 assert.doesNotMatch(Buffer.from(grant.grant,"base64url").toString(),/2025-07-06|owner-a/);
 const r=await s.request(read(grant));assert.equal(r.status,200);assert.equal(r.headers.get("cache-control"),"private, no-store");
 const body=await r.json();assert.equal(body.members.length,3);assert.equal(s.calls(),3);assert.equal(body.members[1].reading.status,"ambiguous");
 assert.doesNotMatch(JSON.stringify(body),/birthDate|birthTime|displayName|2025-07-06/);
 const permuted=await(await s.request(read(grant,[...initial].reverse()))).json();assert.equal(permuted.members[0].memberId,"c");
});
test("Career valid login alone cannot use another UID's group or another session's grant",async()=>{
 const s=setup(),grant=await s.authorize();
 for(const who of [{uid:"owner-b",idToken:"verified-b",expiresAt:2000},{uid:"owner-a",idToken:"new-session",expiresAt:2000}]){
  s.setUser(who);const r=await s.request(read(grant));assert.equal(r.status,403);assert.doesNotMatch(await r.text(),/professions|Pengarang|birthDate/);
 }
 assert.equal(s.calls(),0);
});
test("Career changing a date, member ID, count or group ID invalidates the exact grant",async()=>{
 const s=setup(),grant=await s.authorize();
 for(const members of [initial.map((x,i)=>i?x:{...x,birthDate:"2025-07-07"}),initial.map((x,i)=>i?x:{...x,id:"other"}),[...initial,{id:"d",birthDate:"2000-02-29"}]]){
  assert.equal((await s.request(read(grant,members))).status,403);
 }
 assert.equal((await s.request({...read(grant),groupId:"other-group"})).status,403);assert.equal(s.calls(),0);
});
test("Career tampering, expiration, restart and wrong key fail closed",async()=>{
 const s=setup(),grant=await s.authorize();
 assert.equal((await s.request({...read(grant),grant:grant.grant.slice(0,-3)+"AAA"})).status,403);
 s.setNow(1600);assert.equal((await s.request(read(grant))).status,403);assert.equal(s.calls(),0);
 const fresh=createCareerHandler(async()=>({uid:"owner-a",idToken:"verified-a",expiresAt:2000}),{now:()=>1000,key:new Uint8Array(32).fill(9)});
 const r=await fresh(new Request("http://localhost:3000/api/samyoga/career",{method:"POST",headers:{host:"localhost:3000",origin:"http://localhost:3000","content-type":"application/json"},body:JSON.stringify(read(grant))}));assert.equal(r.status,403);
});
test("Career payload/schema/member constraints reject invalid data without raw-data error text",async()=>{
 const s=setup();
 for(const members of [initial.slice(0,2),Array.from({length:7},(_,i)=>({...initial[0],id:"m"+i})),initial.map((x,i)=>i?x:{...x,birthDate:"2025-02-29"}),initial.map((x,i)=>i?x:{...x,birthTime:"12:00"}),initial.map(x=>({...x,id:"duplicate"})),initial.map((x,i)=>i?x:{...x,id:"x".repeat(65)}),initial.map((x,i)=>i?x:{...x,displayName:"Private label"})]){
  const r=await s.request({action:"authorize",members,memberPermissionConfirmed:true});assert.equal(r.status,400);assert.doesNotMatch(await r.text(),/Private label|2025-02-29/);
 }
 assert.equal((await s.request("{" )).status,400);
 assert.equal((await s.request("x".repeat(4097))).status,413);
 assert.equal((await s.request({},{headers:{"content-type":"text/plain"}})).status,415);
 assert.equal(s.calls(),0);
});
test("Career bounds group lifetime to verified session and uses the supplied civil day without accepting a birth time",async()=>{
 const s=setup();s.setUser({uid:"owner-a",idToken:"verified-a",expiresAt:1050});const grant=await s.authorize();assert.equal(grant.expiresAt,1050);
 const output=await(await s.request(read(grant))).json();assert.equal(output.members[0].reading.day,"Minggu");
});
test("Career unexpected services failures never serialize exception or secret input",async()=>{
 const s=setup();s.setUser(new Error("secret diagnostic"));const r=await s.request({action:"authorize",members:initial,memberPermissionConfirmed:true});assert.equal(r.status,503);assert.doesNotMatch(await r.text(),/secret|birthDate|2025/);
});
