import { PrismaClient } from "@prisma/client";
import { writeFileSync } from "node:fs";

const prisma = new PrismaClient();
const APPLY = process.argv.includes("--apply");

const START = Date.UTC(2026, 0, 1);
const END = Date.UTC(2026, 10, 17);

function dayKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

async function main() {
  const posts = await prisma.post.findMany({
    where: { publishedAt: { gte: new Date(Date.UTC(2026, 0, 1)) } },
    select: { id: true, slug: true, publishedAt: true, createdAt: true },
    orderBy: [{ publishedAt: "asc" }, { createdAt: "asc" }, { slug: "asc" }],
  });

  console.log(`posts dated 2026 or later: ${posts.length}`);
  if (posts.length === 0) {
    console.log("nothing to do");
    await prisma.$disconnect();
    return;
  }

  const totalDays = Math.floor((END - START) / 86400000) + 1;
  console.log(`target window: ${dayKey(new Date(START))} .. ${dayKey(new Date(END))} (${totalDays} days)`);

  // Back up current dates so this is reversible.
  const backup = posts.map((p) => ({
    id: p.id,
    slug: p.slug,
    publishedAt: p.publishedAt.toISOString(),
  }));
  writeFileSync("tmp/redates-2026-backup.json", JSON.stringify(backup, null, 2));
  console.log(`backup written: tmp/redates-2026-backup.json (${backup.length} rows)`);

  // Spread evenly: item i -> day floor(i * totalDays / n)
  const plan = posts.map((p, i) => {
    const dayIndex = Math.floor((i * totalDays) / posts.length);
    const date = new Date(START + dayIndex * 86400000);
    date.setUTCHours(12, 0, 0, 0);
    return { id: p.id, slug: p.slug, from: p.publishedAt, to: date };
  });

  // Report distribution
  const dist = new Map<string, number>();
  for (const p of plan) {
    const k = dayKey(p.to);
    dist.set(k, (dist.get(k) ?? 0) + 1);
  }
  const counts = [...dist.values()];
  const two = counts.filter((n) => n === 2).length;
  const one = counts.filter((n) => n === 1).length;
  const over = counts.filter((n) => n > 2).length;

  console.log("");
  console.log("=== NEW DISTRIBUTION ===");
  console.log(`distinct days used: ${dist.size}`);
  console.log(`days with 1 post: ${one}`);
  console.log(`days with 2 posts: ${two}`);
  console.log(`days with >2 posts: ${over}`);
  console.log(`first: ${dayKey(plan[0].to)}  last: ${dayKey(plan[plan.length - 1].to)}`);

  if (!APPLY) {
    console.log("");
    console.log("=== SAMPLE (first 5, last 5) ===");
    for (const p of plan.slice(0, 5)) {
      console.log(`  ${dayKey(p.from)} -> ${dayKey(p.to)}  ${p.slug}`);
    }
    console.log("  ...");
    for (const p of plan.slice(-5)) {
      console.log(`  ${dayKey(p.from)} -> ${dayKey(p.to)}  ${p.slug}`);
    }
    console.log("");
    console.log("dry run only. re-run with --apply to write.");
    await prisma.$disconnect();
    return;
  }

  let updated = 0;
  await prisma.$transaction(
    plan.map((p) =>
      prisma.post.update({ where: { id: p.id }, data: { publishedAt: p.to } }),
    ),
  );
  updated = plan.length;

  console.log("");
  console.log(`updated ${updated} posts`);

  // Verify
  const after = await prisma.post.findMany({
    where: { publishedAt: { gte: new Date(Date.UTC(2026, 0, 1)) } },
    select: { publishedAt: true },
  });
  const afterDays = new Map<string, number>();
  for (const p of after) {
    const k = dayKey(p.publishedAt);
    afterDays.set(k, (afterDays.get(k) ?? 0) + 1);
  }
  console.log(`verify: ${after.length} posts across ${afterDays.size} days`);
  console.log(`verify: max posts on one day = ${Math.max(...afterDays.values())}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});