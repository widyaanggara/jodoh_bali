import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const runtimeRequire = createRequire(import.meta.url);
const cache = new Map();
export function loadNetraModule(relativePath) {
  const filename = path.resolve(projectRoot, relativePath);
  if (cache.has(filename)) return cache.get(filename).exports;
  const compiled = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const loaded = { exports: {} };
  cache.set(filename, loaded);
  const localRequire = (name) => name.startsWith("@/") ? loadNetraModule(name.slice(2) + ".ts") : name.startsWith(".")
    ? loadNetraModule(path.relative(projectRoot, path.resolve(path.dirname(filename), name + ".ts")))
    : runtimeRequire(name);
  new Function("exports", "require", "module", compiled)(loaded.exports, localRequire, loaded);
  return loaded.exports;
}
