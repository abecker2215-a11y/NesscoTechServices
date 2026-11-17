import { PrismaClient } from "@prisma/client";
import { mkdirSync, writeFileSync } from "node:fs";

const prisma = new PrismaClient();

async function main() {
  const dir = "backups";
  mkdirSync(dir, { recursive: true });
  const stamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
  const posts = await prisma.post.findMany({ orderBy: { id: "asc" } });
  const file = `${dir}/posts-${stamp}.json`;
  const payload = {
    takenAt: new Date().toISOString(),
    model: "Post",
    count: posts.length,
    posts,
  };
  writeFileSync(file, JSON.stringify(payload), "utf8");
  const counts = await prisma.$queryRawUnsafe<Array<{ total: string }>>(
    'SELECT COUNT(*)::text AS total FROM "Post"',
  );
  console.log(`posts exported: ${posts.length} (db count ${counts[0]?.total})`);
  console.log(`snapshot: ${file}`);
  console.log(`bytes: ${JSON.stringify(payload).length}`);
  await prisma.$disconnect();
}

main();