/**
 * Build the 2025 blog backfill staging files.
 *
 *   node scripts/build-blog-2025.mjs
 *
 * Reads scripts/data/blog-topics-2025.mjs and writes tmp/2025.js plus a
 * review CSV. Bodies come from tmp/bodies-2025/<file>.json, keyed by slug.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TOPIC_PLAN_2025 } from "./data/blog-topics-2025.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const BODIES = join(ROOT, "tmp/bodies-2025");

const START = Date.UTC(2025, 0, 1);
const DAYS = 365;
const DAY_MS = 86_400_000;

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/, "");
}

function knownServices() {
  return new Set(
    [
      ...readFileSync(join(ROOT, "src/lib/config.ts"), "utf8").matchAll(
        /href:\s*"\/services\/([^"]+)"/g
      ),
    ].map((m) => m[1])
  );
}

/**
 * Slugs already in use: the legacy TypeScript array and the 2023-2024
 * backfill. A collision here would make the import overwrite a live post.
 */
function existingSlugs() {
  const legacy = [
    ...readFileSync(join(ROOT, "src/lib/blog.ts"), "utf8").matchAll(
      /^\s+slug:\s*"([^"]+)"/gm
    ),
  ].map((m) => m[1]);
  const req = createRequire(join(ROOT, "scripts/noop.cjs"));
  const backfill = req("../tmp/2023-2024.js");
  return new Set([...legacy, ...backfill.map((p) => p.slug)]);
}

function isoDate(offsetDays) {
  return new Date(START + offsetDays * DAY_MS).toISOString().slice(0, 10);
}

function displayDate(offsetDays) {
  return new Date(START + offsetDays * DAY_MS).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

function trimAtWord(text, max, min = 130) {
  if (text.length <= max) return text;
  const window = text.slice(0, max + 1);
  const stop = Math.max(
    window.lastIndexOf(". "),
    window.lastIndexOf("? "),
    window.lastIndexOf("! ")
  );
  if (stop + 1 >= 150) return window.slice(0, stop + 1).trim();
  let space = -1;
  for (let i = max - 1; i >= min; i--) {
    if (text[i] === " ") {
      space = i;
      break;
    }
  }
  const head = (space > 0 ? text.slice(0, space) : text.slice(0, max - 1)).replace(
    /[\s,;:.\-]+$/,
    ""
  );
  if (head.length >= 150) return head;
  return `${head}…`;
}

function plainParagraph(paragraph) {
  return paragraph
    .replace(/^#{1,6}\s*/, "")
    .replace(/^[-*]\s+/, "")
    .replace(/^\d+\.\s+/, "")
    .replace(/\*\*/g, "")
    .trim();
}

/**
 * Keep excerpts inside the 150-160 range the site expects. Empty excerpts are
 * derived from the article's opening prose; short ones are extended from it.
 */
function normaliseExcerpt(excerpt, body) {
  const opening = plainParagraph(body.split("\n\n")[0] ?? "");
  if (!excerpt.trim()) {
    return opening ? trimAtWord(opening, 160) : "";
  }
  if (excerpt.length > 160) return trimAtWord(excerpt, 160);
  if (excerpt.length < 150 && opening.length > excerpt.length) {
    return trimAtWord(opening, 160);
  }
  return excerpt;
}

function main() {
  const taken = new Set();
  const errors = [];
  const items = [];
  const services = knownServices();
  const existing = existingSlugs();

  for (const [category, group] of Object.entries(TOPIC_PLAN_2025)) {
    for (const raw of group.titles) {
      const [title, override] = raw.split("||").map((s) => s.trim());
      let slug = slugify(title);
      const base = slug;
      let n = 2;
      while (taken.has(slug)) slug = `${base}-${n++}`;
      if (slug !== base) console.log(`  slug ${base} -> ${slug}`);
      taken.add(slug);
      items.push({ slug, title, category, serviceSlug: override || group.serviceSlug });
    }
  }

  if (items.length !== DAYS) {
    errors.push(`Plan has ${items.length} entries, calendar needs ${DAYS}`);
  }

  for (const item of items) {
    if (item.serviceSlug && !services.has(item.serviceSlug)) {
      errors.push(`${item.slug}: unknown service "${item.serviceSlug}"`);
    }
    if (existing.has(item.slug)) {
      errors.push(`${item.slug}: slug already used by a published post`);
    }
  }

  const bodies = {};
  if (existsSync(BODIES)) {
    for (const file of readdirSync(BODIES)) {
      if (!file.endsWith(".json")) continue;
      const parsed = JSON.parse(readFileSync(join(BODIES, file), "utf8"));
      for (const [slug, content] of Object.entries(parsed)) {
        if (bodies[slug]) {
          errors.push(`Duplicate body for slug "${slug}" in ${file}`);
          continue;
        }
        bodies[slug] = content;
      }
    }
  }

  if (errors.length) {
    console.error("Plan validation failed:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  const entries = items.map((item, i) => ({
    slug: item.slug,
    title: item.title,
    excerpt: normaliseExcerpt(
      bodies[item.slug]?.excerpt ?? "",
      bodies[item.slug]?.body ?? ""
    ),
    date: isoDate(i),
    displayDate: displayDate(i),
    author: "Nessco Tech Services",
    category: item.category,
    readTime: "5 min read",
    body: bodies[item.slug]?.body ?? "",
    serviceSlug: item.serviceSlug,
    status: "draft",
    origin: "2025-backfill",
  }));

  const banner = `/**
 * GENERATED FILE - do not edit by hand.
 *
 * Source: scripts/data/blog-topics-2025.mjs
 * Build:  node scripts/build-blog-2025.mjs
 *
 * ${entries.length} entries, one per day from ${entries[0].date} to ${
    entries[entries.length - 1].date
  }.
 */
"use strict";

module.exports = `;

  writeFileSync(
    join(ROOT, "tmp/2025.js"),
    banner + JSON.stringify(entries, null, 2) + ";\n"
  );

  const csv = [
    "date,category,slug,title,serviceSlug",
    ...entries.map((e) =>
      [e.date, e.category, e.slug, e.title, e.serviceSlug]
        .map((v) => `"${String(v).replace(/"/g, '""')}"`)
        .join(",")
    ),
  ].join("\n");
  writeFileSync(join(ROOT, "tmp/blog-topics-2025.csv"), csv + "\n");

  const pad = (s, n) => String(s).padEnd(n);
  const counts = {};
  for (const item of items) {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
  }

  console.log(`Wrote ${entries.length} entries to tmp/2025.js`);
  console.log(`${entries[0].date} .. ${entries[entries.length - 1].date}`);
  console.log("");
  console.log(pad("Category", 24) + "Count");
  for (const [category, n] of Object.entries(counts)) {
    console.log(pad(category, 24) + n);
  }
  const filled = entries.filter((e) => e.body.trim()).length;
  console.log("");
  console.log(`Bodies written: ${filled} of ${entries.length}`);
}

main();