import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const runtimeRequire = createRequire(import.meta.url);
export const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const moduleCache = new Map();

export function loadTypeScriptModule(relativePath) {
  const filename = path.resolve(projectRoot, relativePath);
  if (moduleCache.has(filename)) return moduleCache.get(filename).exports;

  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      esModuleInterop: true,
    },
    fileName: filename,
  }).outputText;
  const loadedModule = { exports: {} };
  moduleCache.set(filename, loadedModule);

  const localRequire = (specifier) => {
    if (!specifier.startsWith(".")) return runtimeRequire(specifier);
    const resolved = path.resolve(path.dirname(filename), `${specifier}.ts`);
    return loadTypeScriptModule(path.relative(projectRoot, resolved));
  };

  const execute = new Function(
    "exports",
    "require",
    "module",
    "__filename",
    "__dirname",
    output,
  );
  execute(loadedModule.exports, localRequire, loadedModule, filename, path.dirname(filename));
  return loadedModule.exports;
}

export function createCivilDate(year, month, day) {
  const date = new Date(0);
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return date;
}
