import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const prisma = new PrismaClient();

function words(body: string): number {
  return body.trim().split(/\s+/).filter(Boolean).length;
}

async function main() {
  const file = process.argv[2];
  const apply = process.argv.includes("--apply");
  if (!file) {
    console.error("usage: tsx prisma/apply-body-expansion.ts <patch.json> [--apply]");
    process.exit(1);
  }

  const data = JSON.parse(readFileSync(file, "utf8")) as Record<
    string,
    string | { append?: string; before?: string }
  >;
  const entries = Object.entries(data);
  console.log(`entries: ${entries.length}`);

  let missing = 0;
  let skipped = 0;
  let updated = 0;

  for (const [slug, value] of entries) {
    const post = await prisma.post.findUnique({
      where: { slug },
      select: { id: true, body: true },
    });
    if (!post) {
      console.log(`  MISSING  ${slug}`);
      missing++;
      continue;
    }
    const before = typeof post.body === "string" ? words(post.body) : 0;
    let next: string;
    if (typeof value === "string") {
      next = value;
    } else {
      const existing = typeof post.body === "string" ? post.body.trimEnd() : "";
      if (value.before && existing.includes(value.before.trim())) {
        console.log(`  ${String(before).padStart(4)} -> ${String(before).padStart(4)}  SKIP (already applied)  ${slug}`);
        skipped++;
        continue;
      }
      if (value.before) {
        const marker = "## The honest summary";
        const idx = existing.indexOf(marker);
        if (idx === -1) {
          next = `${existing}\n\n${value.before.trim()}`;
        } else {
          next = `${existing.slice(0, idx).trimEnd()}\n\n${value.before.trim()}\n\n${existing.slice(idx)}`;
        }
      } else {
        next = `${existing}\n\n${(value.append ?? "").trim()}`;
      }
    }
    const after = words(next);
    if (apply) {
      await prisma.post.update({
        where: { id: post.id },
        data: { body: next, updatedAt: new Date() },
      });
    }
    console.log(`  ${String(before).padStart(4)} -> ${String(after).padStart(4)}  ${slug}`);
    updated++;
  }

  console.log("");
  console.log(`${apply ? "updated" : "would update"}: ${updated}`);
  if (skipped) console.log(`skipped (already applied): ${skipped}`);
  if (missing) console.log(`missing slugs: ${missing}`);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});