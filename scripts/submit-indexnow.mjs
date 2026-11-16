#!/usr/bin/env node
/**
 * Submit changed URLs to IndexNow (Bing, Yandex, Seznam, Naver).
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs                # submit only new/changed URLs
 *   node scripts/submit-indexnow.mjs --all          # submit every URL in the sitemap
 *   node scripts/submit-indexnow.mjs --dry-run      # report what would be sent, send nothing
 *   node scripts/submit-indexnow.mjs --sitemap path/to/sitemap-0.xml
 *
 * Environment:
 *   INDEXNOW_KEY            Override the key. Defaults to the published key below.
 *   INDEXNOW_KEY_LOCATION   Override the key file URL. Defaults to the site root.
 *   INDEXNOW_HOST           Override the host. Defaults to the key location's host.
 *   INDEXNOW_STATE_FILE     Override the state file path.
 *
 * Exit codes: 0 on success, 1 on any failure.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(SCRIPT_DIR, "..");

const DEFAULT_KEY = "52dde6db977d403bb482d78f36f1bf76";
const DEFAULT_KEY_LOCATION = `https://nesscotech.com/${DEFAULT_KEY}.txt`;
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH_SIZE = 500;

const args = process.argv.slice(2);
const hasFlag = (name) => args.includes(name);
const getArg = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const dryRun = hasFlag("--dry-run");
const submitAll = hasFlag("--all");
const skipKeyCheck = hasFlag("--skip-key-check");

const sitemapPath = resolve(PROJECT_ROOT, getArg("--sitemap", join("public", "sitemap-0.xml")));
const statePath = resolve(
  PROJECT_ROOT,
  process.env.INDEXNOW_STATE_FILE ?? join("scripts", ".indexnow-state.json")
);

const key = process.env.INDEXNOW_KEY ?? DEFAULT_KEY;
const keyLocation = process.env.INDEXNOW_KEY_LOCATION ?? DEFAULT_KEY_LOCATION;

/**
 * IndexNow validates the key asynchronously and returns 202 even when it is
 * wrong, so the submission status code alone will not catch a bad or
 * unpublished key. Fetch the key file ourselves first and fail loudly.
 */
async function verifyKey() {
  if (skipKeyCheck) {
    console.warn("[indexnow] skipping key verification (--skip-key-check)");
    return;
  }

  let response;
  try {
    response = await fetch(keyLocation, { redirect: "follow" });
  } catch (err) {
    throw new Error(`could not reach keyLocation ${keyLocation}: ${err.message}`);
  }

  if (!response.ok) {
    throw new Error(
      `keyLocation ${keyLocation} returned HTTP ${response.status}; publish ${key}.txt at your site root`
    );
  }

  const body = (await response.text()).trim();
  if (body !== key) {
    const got = body.length ? body.slice(0, 64) : "<empty>";
    throw new Error(`keyLocation ${keyLocation} did not return the expected key (got ${got})`);
  }

  console.log(`[indexnow] key verified at ${keyLocation}`);
}

async function submitBatch(batch, host) {
  const body = JSON.stringify({ host, key, keyLocation, urlList: batch });

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Length": String(Buffer.byteLength(body)),
    },
    body,
  });

  if (response.status !== 200 && response.status !== 202) {
    const detail = (await response.text().catch(() => "")).slice(0, 500);
    throw new Error(`IndexNow returned HTTP ${response.status}${detail ? `: ${detail}` : ""}`);
  }

  return response.status;
}

async function main() {
  if (!existsSync(sitemapPath)) {
    throw new Error(
      `sitemap not found at ${sitemapPath}\nRun \`npm run build\` first so next-sitemap can regenerate it.`
    );
  }

  const host = process.env.INDEXNOW_HOST ?? new URL(keyLocation).hostname;

  // --- Read the sitemap -----------------------------------------------------

  const xml = readFileSync(sitemapPath, "utf8");
  const urls = [];
  for (const match of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    const url = match[1].trim();
    if (url) urls.push(url);
  }

  if (urls.length === 0) {
    throw new Error(`no <loc> entries found in ${sitemapPath}`);
  }

  // --- Work out what changed ------------------------------------------------

  let previous = [];
  if (existsSync(statePath) && !submitAll) {
    try {
      const parsed = JSON.parse(readFileSync(statePath, "utf8"));
      if (Array.isArray(parsed.urls)) previous = parsed.urls;
    } catch (err) {
      console.warn(`[indexnow] could not read state file (${err.message}); submitting all URLs`);
    }
  }

  const previousSet = new Set(previous);
  const pending = submitAll ? urls : urls.filter((u) => !previousSet.has(u));

  if (pending.length === 0) {
    console.log(`[indexnow] no new or changed URLs since the last submission (${urls.length} total)`);
    return;
  }

  if (dryRun) {
    console.log(`[indexnow] dry run — would submit ${pending.length} of ${urls.length} URLs`);
    for (const url of pending.slice(0, 20)) console.log(`  ${url}`);
    if (pending.length > 20) console.log(`  ... and ${pending.length - 20} more`);
    return;
  }

  // --- Submit ---------------------------------------------------------------

  console.log(
    `[indexnow] submitting ${pending.length} URL(s) to ${host}` +
      `${previous.length && !submitAll ? ` (${urls.length} total in sitemap)` : ""}`
  );

  await verifyKey();

  let submitted = 0;
  for (let i = 0; i < pending.length; i += BATCH_SIZE) {
    const batch = pending.slice(i, i + BATCH_SIZE);
    const status = await submitBatch(batch, host);
    submitted += batch.length;
    console.log(
      `[indexnow] batch ${Math.floor(i / BATCH_SIZE) + 1}: ${batch.length} URLs -> HTTP ${status}`
    );
  }

  // --- Persist state --------------------------------------------------------

  mkdirSync(dirname(statePath), { recursive: true });
  writeFileSync(
    statePath,
    JSON.stringify({ host, updatedAt: new Date().toISOString(), urls }, null, 2) + "\n"
  );

  console.log(`[indexnow] done — ${submitted} URL(s) submitted, state saved to ${statePath}`);
}

main().catch((err) => {
  console.error(`\n[indexnow] ${err.message}`);
  process.exitCode = 1;
});