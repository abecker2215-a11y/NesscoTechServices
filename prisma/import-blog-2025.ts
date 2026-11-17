/**
 * Import the 2025 blog backfill into the blog tables.
 *
 *   npx tsx --env-file=.env prisma/import-blog-2025.ts
 *
 * Idempotent: upserts by slug. Refuses to import if any entry has an
 * unknown category, an unknown service page, an empty excerpt or body, or a
 * malformed date.
 */
import { createRequire } from "node:module";
import { readFileSync } from "node:fs";
import { prisma } from "../src/lib/prisma";

const require = createRequire(import.meta.url);

type Staged = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  body: string;
  serviceSlug: string;
  status: string;
};

function knownServices(): Set<string> {
  return new Set(
    [
      ...readFileSync("src/lib/config.ts", "utf8").matchAll(
        /href:\s*"\/services\/([^"]+)"/g
      ),
    ].map((m) => m[1])
  );
}

async function main() {
  const articles = require("../tmp/2025.js") as Staged[];
  const services = knownServices();

  const categories = await prisma.category.findMany();
  const byName = new Map(categories.map((c) => [c.name, c.id]));

  const problems: string[] = [];
  const seen = new Set<string>();
  let skipped = 0;

  for (const a of articles) {
    if (seen.has(a.slug)) problems.push(`${a.slug}: duplicate slug`);
    seen.add(a.slug);
    if (!a.body.trim() || !a.excerpt.trim()) {
      skipped++;
      continue;
    }
    if (!byName.has(a.category)) {
      problems.push(`${a.slug}: unknown category "${a.category}"`);
    }
    if (a.serviceSlug && !services.has(a.serviceSlug)) {
      problems.push(`${a.slug}: unknown service "${a.serviceSlug}"`);
    }
    if (!a.excerpt.trim()) problems.push(`${a.slug}: empty excerpt`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(a.date)) {
      problems.push(`${a.slug}: bad date "${a.date}"`);
    }
  }

  if (problems.length) {
    console.error(`Refusing to import (${problems.length} problems):`);
    for (const p of problems) console.error(`  - ${p}`);
    process.exit(1);
  }

  let imported = 0;
  for (const a of articles) {
    if (!a.body.trim()) continue;
    const data = {
      title: a.title,
      excerpt: a.excerpt,
      body: a.body,
      category: { connect: { id: byName.get(a.category)! } },
      publishedAt: new Date(`${a.date}T12:00:00.000Z`),
      status: "PUBLISHED" as const,
      readTime: null,
      serviceSlug: a.serviceSlug || null,
      authorName: a.author,
    };
    await prisma.post.upsert({
      where: { slug: a.slug },
      update: data,
      create: { slug: a.slug, ...data },
    });
    imported++;
  }

  const counts = await prisma.category.findMany({
    select: { name: true, _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  console.log(`\nImported ${imported} posts (${skipped} still empty).`);
  for (const c of counts) console.log(`  ${c.name.padEnd(24)}${c._count.posts}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());