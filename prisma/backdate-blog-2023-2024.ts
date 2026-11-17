/**
 * One-off: align createdAt/updatedAt with publishedAt for backfilled posts.
 *
 *   npx tsx --env-file=.env prisma/backdate-blog-2023-2024.ts
 *
 * Prisma's @updatedAt resets updatedAt on the next save, so this is a
 * presentation fix for the admin list. The sitemap derives lastmod from
 * updatedAt > createdAt, so backdating keeps both signals historical.
 */
import { prisma } from "../src/lib/prisma";

async function main() {
  const before = await prisma.post.count();
  const changed = await prisma.$executeRawUnsafe(`
    UPDATE "Post" p
    SET "createdAt" = p."publishedAt",
        "updatedAt" = p."publishedAt"
    WHERE p."publishedAt" IS NOT NULL
      AND p."createdAt" > p."publishedAt"
  `);
  const sample = await prisma.post.findMany({
    select: { slug: true, createdAt: true, updatedAt: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });

  console.log(`Posts: ${before}`);
  console.log(`Rows backdated: ${changed}`);
  for (const s of sample) {
    console.log(
      `${s.publishedAt?.toISOString().slice(0, 10)}  created ${s.createdAt
        .toISOString()
        .slice(0, 10)}  updated ${s.updatedAt.toISOString().slice(0, 10)}  ${
        s.slug
      }`
    );
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());