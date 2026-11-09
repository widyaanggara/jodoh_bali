import assert from "node:assert/strict";
import test from "node:test";
import {loadTypeScriptModule as load} from "./samyoga-test-loader.mjs";
const {createCareerHandler}=load("lib/samyoga/career-access.server.ts");
const members=[{id:"a",birthDate:"2025-07-06"},{id:"b",birthDate:"2025-02-04"},{id:"c",birthDate:"2025-12-01"}];
function request(body){return new Request("http://localhost:3000/api/samyoga/career",{method:"POST",headers:{host:"localhost:3000",origin:"http://localhost:3000","content-type":"application/json"},body:JSON.stringify(body)});}
test("Independent process-key instances reject each other's grant, never a fallback calculation",async()=>{
 const identity=async()=>({uid:"same-owner",idToken:"same-verified-session",expiresAt:5000});
 let bCalls=0;
 const calculate=load("lib/samyoga/tenung-wariga-career.ts").calculateWarigaCareer;
 const a=createCareerHandler(identity,{now:()=>1000});
 const b=createCareerHandler(identity,{now:()=>1000,calculate:date=>{bCalls++;return calculate(date);}});
 const auth={action:"authorize",members,memberPermissionConfirmed:true};
 const grantA=await(await a(request(auth))).json();
 const readA={action:"analyze",members,groupId:grantA.groupId,grant:grantA.grant};
 assert.equal((await a(request(readA))).status,200);
 const wrong=await b(request(readA));assert.equal(wrong.status,403);assert.equal(bCalls,0);
 assert.equal(wrong.headers.get("cache-control"),"private, no-store");assert.doesNotMatch(await wrong.text(),/professions|Pengarang|Kaso/);
 const grantB=await(await b(request(auth))).json();
 const readB={action:"analyze",members,groupId:grantB.groupId,grant:grantB.grant};
 assert.equal((await b(request(readB))).status,200);assert.equal(bCalls,3);
 assert.equal((await a(request(readB))).status,403);
});
test("Stateless owner grants allow retry before expiry but do not imply one-time use or server revocation",async()=>{
 let now=1000;
 const instance=createCareerHandler(async()=>({uid:"owner",idToken:"session",expiresAt:5000}),{now:()=>now});
 const grant=await(await instance(request({action:"authorize",members,memberPermissionConfirmed:true}))).json();
 const body={action:"analyze",members,groupId:grant.groupId,grant:grant.grant};
 assert.equal(grant.expiresAt,1600);assert.equal((await instance(request(body))).status,200);
 now=1599;assert.equal((await instance(request(body))).status,200);
 now=1600;const expired=await instance(request(body));assert.equal(expired.status,403);assert.doesNotMatch(await expired.text(),/professions|Pengarang/);
});
