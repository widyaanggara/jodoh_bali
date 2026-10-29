import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import { fileURLToPath } from "node:url";

const [outputPath, roiPath, annotationPath, manifestPath] = process.argv.slice(2);
if (!outputPath || !roiPath || !annotationPath || !manifestPath) {
  throw new Error("Usage: node create-palm-zip-fixture.mjs output.zip roi.png annotations.json manifest.json");
}

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const modulePath = path.resolve(testDirectory, "../lib/netra-hasta/zip-archive.ts");
const output = ts.transpileModule(fs.readFileSync(modulePath, "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  fileName: modulePath,
}).outputText;
const loaded = { exports: {} };
new Function("exports", "require", "module", "__filename", "__dirname", output)(
  loaded.exports,
  () => { throw new Error("zip-archive.ts tidak boleh memiliki runtime dependency."); },
  loaded,
  modulePath,
  path.dirname(modulePath),
);

const archive = loaded.exports.createStoredZip([
  { name: path.basename(roiPath), data: new Uint8Array(fs.readFileSync(roiPath)) },
  { name: path.basename(annotationPath), data: new Uint8Array(fs.readFileSync(annotationPath)) },
  { name: path.basename(manifestPath), data: new Uint8Array(fs.readFileSync(manifestPath)) },
]);
fs.writeFileSync(outputPath, archive);
archive.fill(0);
