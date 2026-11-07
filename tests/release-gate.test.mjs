import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {loadNetraModule} from "./helpers/load-netra-typescript.mjs";
test("stable release does not read/collect legacy birth logs or initialize Analytics",()=>{
 const session=fs.readFileSync("lib/session.ts","utf8"),legacy=fs.readFileSync("firebase/app.js","utf8");
 assert.doesNotMatch(session+legacy,/firebase\/firestore|firebase\/firebase|addDoc|getDocs|onSnapshot|getAnalytics/);
 const page=fs.readFileSync("app/admin-log-statistik/page.tsx","utf8");assert.doesNotMatch(page,/ambilDataLog|firebase|<table|<form|createObjectURL/);
 assert.equal(typeof loadNetraModule("lib/session.ts").saveToDatabase,"function");
});
test("dev research is absent and Docker excludes private data",()=>{
 assert(!fs.existsSync("app/dev"));assert(!fs.existsSync("backend"));assert(!fs.existsSync("dataset"));
 const ignore=fs.readFileSync(".dockerignore","utf8");for(const word of[".env*","coverage","dataset","backend","app/dev","security-audit"])assert(ignore.includes(word));
});
