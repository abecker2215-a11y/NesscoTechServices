import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";

const prisma = new PrismaClient();

function words(body: unknown): number {
  if (typeof body !== "string") return 0;
  return body.trim().split(/\s+/).filter(Boolean).length;
}

async function main() {
  const file = process.argv[2];
  if (!file) {
    console.error("usage: tsx prisma/check-patch-presence.ts <patch.json>");
    process.exit(1);
  }
  const data = JSON.parse(readFileSync(file, "utf8")) as Record<string, string | { before?: string }>;
  let present = 0;
  let absent = 0;
  for (const [slug, value] of Object.entries(data)) {
    const insert = typeof value === "string" ? value : (value.before ?? "");
    const probe = insert.trim().slice(0, 70);
    const post = await prisma.post.findUnique({ where: { slug }, select: { body: true } });
    if (!post || typeof post.body !== "string") {
      console.log(`  NO POST  ${slug}`);
      absent++;
      continue;
    }
    if (post.body.includes(probe)) {
      present++;
    } else {
      absent++;
      console.log(`  ABSENT   ${slug}  (${words(post.body)}w)`);
    }
  }
  console.log(`\npresent ${present}  absent ${absent}`);
  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});