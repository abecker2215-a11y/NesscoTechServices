/**
 * One-time import of the legacy static articles (src/lib/blog.ts) into the
 * database. Idempotent: upserts by slug, so it can be re-run safely.
 *
 *   npx tsx prisma/migrate-blog-from-ts.ts
 */
import { blogArticles } from "../src/lib/blog";
import { prisma } from "../src/lib/prisma";

const MONTHS = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "Oct 2026" -> 2026-10-01T00:00:00Z (preserves the month-only display). */
function parseDisplayDate(display: string): Date | null {
  const match = /^([A-Za-z]{3,9})\s+(\d{4})$/.exec(display.trim());
  if (!match) return null;
  const monthIndex = MONTHS.indexOf(match[1].slice(0, 3).toLowerCase());
  if (monthIndex < 0) return null;
  return new Date(Date.UTC(Number(match[2]), monthIndex, 1));
}

async function main() {
  const categoryCache = new Map<string, string>();
  let created = 0;
  let updated = 0;

  for (const article of blogArticles) {
    const categoryName = article.category?.trim() || "Uncategorized";
    const categorySlug = slugify(categoryName);

    let categoryId = categoryCache.get(categoryName);
    if (!categoryId) {
      const category = await prisma.category.upsert({
        where: { slug: categorySlug },
        update: { name: categoryName },
        create: { slug: categorySlug, name: categoryName },
      });
      categoryCache.set(categoryName, category.id);
      categoryId = category.id;
    }

    const fields = {
      title: article.title,
      excerpt: article.excerpt,
      body: article.body,
      categoryId,
      authorName: article.author || "Nessco Tech Services",
      readTime: article.readTime,
      image: article.image ?? null,
      serviceSlug: article.serviceSlug ?? null,
      status: "PUBLISHED" as const,
      publishedAt: parseDisplayDate(article.date),
    };

    const existing = await prisma.post.findUnique({
      where: { slug: article.slug },
      select: { id: true },
    });

    if (existing) {
      await prisma.post.update({ where: { slug: article.slug }, data: fields });
      updated += 1;
    } else {
      await prisma.post.create({
        data: { slug: article.slug, ...fields },
      });
      created += 1;
    }
  }

  console.log(
    `Blog migration complete. created=${created} updated=${updated} total=${blogArticles.length}`
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });