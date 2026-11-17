/**
 * Build the 2023-2024 blog backfill staging files.
 *
 *   node scripts/build-blog-2023-2024.mjs
 *
 * Inputs
 *   scripts/data/blog-topics-2023-2024.mjs  authored topic plan
 *   src/lib/blog.ts                         legacy articles, used for slug dedupe
 *
 * Outputs
 *   tmp/2023-2024.js                        CommonJS array, one entry per day
 *   tmp/blog-topics-2023-2024.csv           review sheet
 *
 * Bodies and excerpts are left empty on purpose. They are filled in batches
 * by a separate pass; this script owns dates, slugs, and taxonomy validation.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { TOPIC_PLAN } from "./data/blog-topics-2023-2024.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const START = Date.UTC(2023, 0, 1);
const DAYS = 731; // 2023 (365) + 2024 (366, leap year)
const DAY_MS = 86_400_000;

const TARGETS = {
  "Business IT": 33,
  Security: 42,
  Network: 38,
  Cloud: 32,
  Backup: 30,
  "Data Protection": 24,
  Communications: 28,
  Applications: 26,
  "IT Strategy": 27,
  Industries: 65,
  "Compliance & Audit": 87,
  "Microsoft 365": 90,
  "Remote & Hybrid Work": 55,
  "Hardware & Devices": 55,
  "Cost & Budgeting": 55,
  "AI & Automation": 44,
};

function slugify(input) {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function existingSlugs() {
  const source = readFileSync(join(ROOT, "src/lib/blog.ts"), "utf8");
  return new Set(
    [...source.matchAll(/^\s+slug:\s*"([^"]+)"/gm)].map((m) => m[1])
  );
}

/** Deterministic PRNG so re-runs produce the same calendar. */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(items, seed = 20230101) {
  const rand = mulberry32(seed);
  for (let i = items.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [items[i], items[j]] = [items[j], items[i]];
  }
  return items;
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

function main() {
  const taken = existingSlugs();
  const errors = [];
  const items = [];
  const renamed = [];

  for (const [category, group] of Object.entries(TOPIC_PLAN)) {
    const expected = TARGETS[category];
    if (expected === undefined) {
      errors.push(`No target count for category "${category}"`);
      continue;
    }
    if (group.titles.length !== expected) {
      errors.push(
        `${category}: ${group.titles.length} titles, expected ${expected}`
      );
    }

    for (const raw of group.titles) {
      const [title, override] = raw.split("||").map((s) => s.trim());
      let slug = slugify(title);
      const base = slug;
      let n = 2;
      while (taken.has(slug)) {
        slug = `${base}-${n++}`;
      }
      if (slug !== base) renamed.push({ title, slug, base });
      taken.add(slug);
      items.push({
        slug,
        title,
        category,
        serviceSlug: override || group.serviceSlug,
      });
    }
  }

  if (items.length !== DAYS) {
    errors.push(`Plan has ${items.length} entries, calendar needs ${DAYS}`);
  }

  const knownServices = new Set(
    [
      ...readFileSync(join(ROOT, "src/lib/config.ts"), "utf8").matchAll(
        /href:\s*"\/services\/([^"]+)"/g
      ),
    ].map((m) => m[1])
  );
  for (const item of items) {
    if (item.serviceSlug && !knownServices.has(item.serviceSlug)) {
      errors.push(`${item.slug}: unknown service "${item.serviceSlug}"`);
    }
  }

  const counts = {};
  for (const item of items) counts[item.category] = (counts[item.category] ?? 0) + 1;

  if (errors.length) {
    console.error("Plan validation failed:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
  }

  shuffle(items);

  // Batches live in tmp/bodies/<file>.json as { "<slug>": { excerpt, body } }.
  // Anything missing keeps an empty excerpt and body.
  const bodies = {};
  const bodiesDir = join(ROOT, "tmp/bodies");
  if (existsSync(bodiesDir)) {
    for (const file of readdirSync(bodiesDir)) {
      if (!file.endsWith(".json")) continue;
      const parsed = JSON.parse(readFileSync(join(bodiesDir, file), "utf8"));
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
    console.error("Body merge failed:");
    for (const e of errors) console.error(`  - ${e}`);
    process.exit(1);
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
  const head = (space > 0 ? text.slice(0, space) : text.slice(0, max - 1))
    .replace(/[\s,;:.\-]+$/, "");
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
 * Excerpts are authored. This keeps them inside the 150-160 range the site
 * expects: long ones are trimmed at a sentence or word boundary, short ones
 * are extended with the opening prose of the article, which is already written.
 */
function normaliseExcerpt(excerpt, body) {
  if (excerpt.length > 160) return trimAtWord(excerpt, 160);
  if (excerpt.length < 150) {
    let candidate = "";
    for (const paragraph of body.split("\n\n")) {
      if (paragraph.trim().startsWith("#")) continue;
      const next = plainParagraph(paragraph);
      if (!next) continue;
      if (candidate.length >= 175) break;
      candidate = candidate ? `${candidate} ${next}` : next;
    }
    if (candidate.length > excerpt.length) return trimAtWord(candidate, 160);
  }
  return excerpt;
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
    origin: "2023-2024-backfill",
  }));

  const banner = `/**
 * GENERATED FILE - do not edit by hand.
 *
 * Source: scripts/data/blog-topics-2023-2024.mjs
 * Build:  node scripts/build-blog-2023-2024.mjs
 *
 * ${entries.length} entries, one per day from ${entries[0].date} to ${
    entries[entries.length - 1].date
  }.
 * excerpt and body are empty: fill them in batches, then re-run the build.
 */
"use strict";

module.exports = `;

  writeFileSync(
    join(ROOT, "tmp/2023-2024.js"),
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
  writeFileSync(join(ROOT, "tmp/blog-topics-2023-2024.csv"), csv + "\n");

  const pad = (s, n) => String(s).padEnd(n);
  const uniqueDates = new Set(entries.map((e) => e.date)).size;
  const uniqueSlugs = new Set(entries.map((e) => e.slug)).size;
  if (uniqueDates !== entries.length || uniqueSlugs !== entries.length) {
    console.error(
      `Uniqueness check failed: ${uniqueDates} dates, ${uniqueSlugs} slugs, ${entries.length} entries`
    );
    process.exit(1);
  }

  console.log(`Wrote ${entries.length} entries to tmp/2023-2024.js`);
  console.log(`${entries[0].date} .. ${entries[entries.length - 1].date}`);
  console.log("");
  console.log(pad("Category", 24) + pad("Planned", 9) + "Actual");
  for (const [category, n] of Object.entries(counts)) {
    console.log(pad(category, 24) + pad(TARGETS[category], 9) + n);
  }
  console.log("");
  console.log(`Slugs renamed to avoid collisions: ${renamed.length}`);
  for (const r of renamed) console.log(`  ${r.base} -> ${r.slug}  (${r.title})`);
  const filled = entries.filter((e) => e.body.trim()).length;
  console.log("");
  console.log(`Bodies written: ${filled} of ${entries.length}`);
  const offRange = entries.filter(
    (e) => e.body.trim() && (e.excerpt.length < 150 || e.excerpt.length > 160)
  );
  if (offRange.length) {
    console.log(
      `Excerpts outside 150-160 chars: ${offRange.length} (metaDescription pads and clamps at render)`
    );
  }
  const lastFilled = entries.reduce(
    (latest, e) => (e.body.trim() && e.date > latest ? e.date : latest),
    ""
  );
  if (lastFilled) {
    const gaps = entries.filter((e) => e.date <= lastFilled && !e.body.trim());
    if (gaps.length) {
      console.log(`\nGaps before ${lastFilled} (${gaps.length}):`);
      for (const g of gaps) console.log(`  ${g.date}  ${g.slug}`);
    }
  }
}

main();