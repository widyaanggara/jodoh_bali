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
  const localRequire = (name) => {
    if (!name.startsWith("@/") && !name.startsWith(".")) return runtimeRequire(name);
    const base = name.startsWith("@/") ? path.resolve(projectRoot, name.slice(2)) : path.resolve(path.dirname(filename), name);
    const resolved = [base + ".ts", base + ".tsx"].find((file) => fs.existsSync(file));
    if (!resolved) throw new Error("Local TypeScript module not found: " + name);
    return loadNetraModule(path.relative(projectRoot, resolved));
  };
  new Function("exports", "require", "module", compiled)(loaded.exports, localRequire, loaded);
  return loaded.exports;
}
