import { readFileSync } from "node:fs";
import { prisma } from "../src/lib/prisma";

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
  const total = await prisma.post.count();
  const published = await prisma.post.count({ where: { status: "PUBLISHED" } });
  const drafts = await prisma.post.count({ where: { status: "DRAFT" } });

  const backfill = await prisma.post.findMany({
    where: { publishedAt: { lt: new Date("2025-01-01") } },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      body: true,
      readTime: true,
      serviceSlug: true,
      publishedAt: true,
    },
  });

  const services = knownServices();
  const badService = backfill.filter(
    (p) => p.serviceSlug && !services.has(p.serviceSlug)
  );
  const noReadTime = backfill.filter((p) => p.readTime === null).length;
  const shortExcerpt = backfill.filter((p) => p.excerpt.length < 150).length;
  const emptyBody = backfill.filter((p) => !p.body.trim()).length;

  const dates = backfill.map((p) => p.publishedAt?.toISOString().slice(0, 10));
  const sorted = [...new Set(dates)].sort();

  console.log(`Posts total      ${total}`);
  console.log(`Published        ${published}`);
  console.log(`Drafts           ${drafts}`);
  console.log(`Backfill (<=2024) ${backfill.length}`);
  console.log(`Date range       ${sorted[0]} .. ${sorted[sorted.length - 1]}`);
  console.log(`Distinct dates   ${sorted.length}`);
  console.log(`readTime null    ${noReadTime} / ${backfill.length}`);
  console.log(`Unknown service  ${badService.length}`);
  for (const p of badService.slice(0, 5)) console.log(`  - ${p.slug}: ${p.serviceSlug}`);
  console.log(`Excerpt < 150    ${shortExcerpt}`);
  console.log(`Empty body       ${emptyBody}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());