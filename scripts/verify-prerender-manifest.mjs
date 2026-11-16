import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

const MANIFEST = join(process.cwd(), ".next", "prerender-manifest.json");

if (!existsSync(MANIFEST)) {
  console.error(
    "\n[next-sitemap] Missing .next/prerender-manifest.json.\n" +
    "The production build did not produce a usable manifest, so the sitemap would be\n" +
    "generated from stale or empty data.\n\n" +
    "Fix: delete the .next directory and run the build again:\n" +
    "  rm -rf .next && npm run build\n"
  );
  process.exit(1);
}

const raw = readFileSync(MANIFEST, "utf8").trim();

if (raw.length === 0) {
  console.error(
    "\n[next-sitemap] .next/prerender-manifest.json is empty (0 bytes).\n" +
    "This happens when a previous build was interrupted or the .next directory is stale,\n" +
    "and it makes next-sitemap fail with 'Unexpected end of JSON input'. The sitemap would\n" +
    "silently keep serving the previous build's URLs.\n\n" +
    "Fix: delete the .next directory and run the build again:\n" +
    "  rm -rf .next && npm run build\n"
  );
  process.exit(1);
}

try {
  const parsed = JSON.parse(raw);
  const routeCount = Object.keys(parsed.routes ?? {}).length;
  console.log(`[next-sitemap] prerender manifest OK — ${routeCount} prerendered routes`);
} catch {
  console.error(
    "\n[next-sitemap] .next/prerender-manifest.json is not valid JSON.\n" +
    "Delete the .next directory and rebuild before generating the sitemap.\n"
  );
  process.exit(1);
}