import { prisma } from "../src/lib/prisma";

async function main() {
  const total = await prisma.post.count();
  const published = await prisma.post.count({
    where: { status: "PUBLISHED" },
  });
  console.log(`Posts: ${total} (${published} published)`);

  const counts = await prisma.category.findMany({
    select: { name: true, _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });
  for (const c of counts) {
    console.log(`${c.name.padEnd(24)}${c._count.posts}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());