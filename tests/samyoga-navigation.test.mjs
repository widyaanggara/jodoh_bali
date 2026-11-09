import assert from "node:assert/strict";
import {createRequire} from "node:module";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import React from "react";
import {renderToStaticMarkup} from "react-dom/server";
import {load} from "cheerio";
import ts from "typescript";
import {projectRoot} from "./samyoga-test-loader.mjs";

const require = createRequire(import.meta.url);
function header(pathname) {
    const file = path.join(projectRoot,"components/Header.tsx");
    const code = ts.transpileModule(fs.readFileSync(file,"utf8"),{fileName:file,
        compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2021,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
    const loaded = {exports:{}};
    new Function("exports","require","module",code)(loaded.exports,name => {
        if (name === "next/navigation") return {usePathname:() => pathname};
        if (name === "next/link") return {__esModule:true,default:({children,...props}) => React.createElement("a",props,children)};
        return require(name);
    },loaded);
    return load(renderToStaticMarkup(React.createElement(loaded.exports.default)));
}
for (const [route,label] of [["/pawongan-sinergi","Sinergi Dua Orang"],["/pawongan-sinergi/kelompok","Sinergi Kelompok"]]) {
    test(`Samyoga navigation uses exact active route ${route}, with no duplicate submenu links`, () => {
        const $=header(route),mobile=$("#metemu-mobile-navigation");
        const trigger=mobile.find("button").filter((_,el)=>$(el).text().replace("expand_more","").trim()==="Samyoga");
        assert.equal(trigger.length,1); assert.equal(trigger.attr("type"),"button");
        assert.equal(trigger.attr("aria-expanded"),"false");
        const panel=mobile.find("[role=group]").filter((_,el)=>$(el).attr("id")===trigger.attr("aria-controls"));
        assert.equal(panel.length,1); assert.equal(panel.attr("aria-hidden"),"true"); assert(panel.is("[inert]"));
        assert.deepEqual(panel.find("a").map((_,el)=>[$(el).text().trim()]).get(),["Sinergi Dua Orang","Sinergi Kelompok"]);
        assert.equal(panel.find('a[aria-current="page"]').length,1);
        assert.equal(panel.find('a[aria-current="page"]').text().trim(),label);
        assert.equal(panel.find('a[aria-current="page"]').attr("href"),route);
        assert.equal(mobile.find('a[href="/pawongan-sinergi"]').length,1);
        assert.equal(mobile.find('a[href="/pawongan-sinergi/kelompok"]').length,1);
        assert.equal($("[data-desktop-navigation] button").filter((_,el)=>$(el).text().replace("expand_more","").trim()==="Samyoga").length,1);
    });
}
test("Other navigation entries remain available and unrelated pages do not activate Samyoga", () => {
    const $=header("/netra-hasta"),mobile=$("#metemu-mobile-navigation");
    assert.equal(mobile.find('a[aria-current="page"]').attr("href"),"/netra-hasta");
    for(const route of ["/","/netra-hasta","/about","/kecocokan-pasangan","/mencari-jodoh","/ramalan-pernikahan","/mencari-otonan","/ramalan-otonan"])
        assert.equal(mobile.find(`a[href="${route}"]`).length,1,route);
    assert.equal(mobile.attr("aria-hidden"),"true"); assert(mobile.is("[inert]"));
});
test("Group page heading and metadata match the Sinergi Kelompok submenu without changing its URL", () => {
    const page=fs.readFileSync(path.join(projectRoot,"app/pawongan-sinergi/kelompok/page.tsx"),"utf8");
    const client=fs.readFileSync(path.join(projectRoot,"components/samyoga-group/SamyogaGroupClient.tsx"),"utf8");
    assert.match(page,/title: "Sinergi Kelompok \| Metemu"/);
    assert.match(client,/<h1[^>]*>Sinergi Kelompok<\/h1>/);
});
