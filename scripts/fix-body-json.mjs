/**
 * One-off repair for body files where a literal \n ended up after a closing
 * quote. Validates each file with JSON.parse and rewrites it if the repair
 * makes it parse.
 *
 *   node scripts/fix-body-json.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const dir = process.argv[2] ?? "tmp/bodies";

for (const file of readdirSync(dir)) {
  if (!file.endsWith(".json")) continue;
  const path = join(dir, file);
  const original = readFileSync(path, "utf8");

  try {
    JSON.parse(original);
    console.log(`${file}: already valid`);
    continue;
  } catch {
    // fall through to repair
  }

  const repaired = original.replace(/["]\\n/g, `"${"\n"}`);
  try {
    JSON.parse(repaired);
  } catch (error) {
    console.error(`${file}: still invalid after repair - ${error.message}`);
    process.exitCode = 1;
    continue;
  }
  writeFileSync(path, repaired);
  console.log(`${file}: repaired`);
}