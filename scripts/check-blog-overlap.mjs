/**
 * Overlap check between the staged 2023-2024 backfill and the existing blog.
 *
 *   node scripts/check-blog-overlap.mjs
 *
 * Flags title pairs whose word overlap is high enough to suggest the same
 * search intent. Slug collisions are already handled by the build script;
 * this catches the semantic duplicates a slug check cannot see.
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const staged = require(join(ROOT, "tmp/2023-2024.js"));

const STOP = new Set([
  "a", "an", "and", "are", "as", "at", "be", "but", "by", "for", "from",
  "how", "in", "is", "it", "its", "of", "on", "or", "that", "the", "their",
  "they", "this", "to", "was", "what", "when", "where", "which", "who",
  "why", "will", "with", "your", "you", "small", "business", "tampa",
]);

function tokens(text) {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((w) => w && !STOP.has(w) && w.length > 2)
  );
}

function jaccard(a, b) {
  let shared = 0;
  for (const t of a) if (b.has(t)) shared++;
  return shared / (a.size + b.size - shared);
}

const source = readFileSync(join(ROOT, "src/lib/blog.ts"), "utf8");
const existing = [...source.matchAll(/^\s+title:\s*\n?\s*"([^"]+)"/gm)].map(
  (m) => m[1]
);

const stagedTokens = staged.map((p) => ({
  title: p.title,
  slug: p.slug,
  date: p.date,
  tokens: tokens(p.title),
}));
const existingTokens = existing.map((title) => ({ title, tokens: tokens(title) }));

const findings = [];
for (const post of stagedTokens) {
  for (const old of existingTokens) {
    const score = jaccard(post.tokens, old.tokens);
    if (score >= 0.5) {
      findings.push({ score, staged: post.title, existing: old.title, date: post.date });
    }
  }
}

for (let i = 0; i < stagedTokens.length; i++) {
  for (let j = i + 1; j < stagedTokens.length; j++) {
    const score = jaccard(stagedTokens[i].tokens, stagedTokens[j].tokens);
    if (score >= 0.6) {
      findings.push({
        score,
        staged: stagedTokens[i].title,
        existing: stagedTokens[j].title,
        date: `${stagedTokens[i].date} / ${stagedTokens[j].date}`,
      });
    }
  }
}

findings.sort((a, b) => b.score - a.score);

console.log(`Existing titles checked: ${existing.length}`);
console.log(`Staged titles checked:   ${staged.length}`);
console.log(`Pairs above threshold:   ${findings.length}`);
console.log("");
for (const f of findings.slice(0, 40)) {
  console.log(`${f.score.toFixed(2)}  ${f.staged}`);
  console.log(`      ~ ${f.existing}   [${f.date}]`);
}
if (findings.length > 40) console.log(`... ${findings.length - 40} more`);