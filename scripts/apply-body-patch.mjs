/**
 * Apply body patches to the monthly body files.
 *
 *   node scripts/apply-body-patch.mjs
 *
 * Reads every JSON file in tmp/patches. Each file maps a slug to a new
 * { excerpt, body }. The entry is written back into whichever monthly body
 * file already contains that slug, so the authored files stay the source of
 * truth and the patch is not a second copy.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const BODIES = "tmp/bodies";
const PATCHES = "tmp/patches";

const files = readdirSync(BODIES).filter((f) => f.endsWith(".json"));
const loaded = files.map((file) => ({
  file,
  path: join(BODIES, file),
  data: JSON.parse(readFileSync(join(BODIES, file), "utf8")),
}));

if (!existsSync(PATCHES)) {
  console.error(`No patch directory at ${PATCHES}`);
  process.exit(1);
}

let applied = 0;
const missing = [];

for (const file of readdirSync(PATCHES)) {
  if (!file.endsWith(".json")) continue;
  const patch = JSON.parse(readFileSync(join(PATCHES, file), "utf8"));

  for (const [slug, value] of Object.entries(patch)) {
    const next = typeof value === "string" ? { excerpt: value } : value;
    const target = loaded.find((entry) => slug in entry.data);
    if (!target) {
      missing.push(slug);
      continue;
    }
    target.data[slug] = {
      ...target.data[slug],
      ...next,
    };
    applied++;
  }
}

for (const entry of loaded) {
  writeFileSync(entry.path, JSON.stringify(entry.data, null, 2) + "\n");
}

console.log(`Applied ${applied} patches across ${loaded.length} files.`);
if (missing.length) {
  console.error(`Slugs not found (${missing.length}):`);
  for (const slug of missing) console.error(`  - ${slug}`);
  process.exit(1);
}