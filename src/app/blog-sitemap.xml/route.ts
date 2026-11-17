import { prisma } from "@/lib/prisma";

// Runtime sitemap for blog content. Blog posts live in Postgres and are served
// dynamically, so they are not in the build-time prerender manifest that
// next-sitemap crawls. This endpoint lists them and is referenced from
// robots.txt alongside the static sitemap index.
export const dynamic = "force-dynamic";

const BASE = "https://nesscotech.com";

function escapeXml(value: string): string {
  return value.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c] ?? c
  );
}

export async function GET() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: {
      slug: true,
      createdAt: true,
      updatedAt: true,
      publishedAt: true,
    },
    orderBy: { publishedAt: "desc" },
  });

  const urls = posts.map((post) => {
    // lastmod reflects a real edit after creation; otherwise the publication
    // date. This keeps the sitemap consistent with the dateModified that the
    // post page reports in its structured data.
    const modified =
      post.updatedAt > post.createdAt
        ? post.updatedAt
        : (post.publishedAt ?? post.updatedAt);
    const lastmod = modified.toISOString().slice(0, 10);
    return `  <url><loc>${escapeXml(
      `${BASE}/blog/${post.slug}`
    )}</loc><lastmod>${lastmod}</lastmod></url>`;
  });

  // Category landing pages are indexable archives, so they belong here too.
  const [categories, counts] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, slug: true, updatedAt: true },
    }),
    prisma.post.groupBy({
      by: ["categoryId"],
      where: { status: "PUBLISHED" },
      _count: { _all: true },
    }),
  ]);
  const countByCategory = new Map<string, number>();
  for (const row of counts) {
    if (row.categoryId) countByCategory.set(row.categoryId, row._count._all);
  }
  for (const category of categories) {
    if ((countByCategory.get(category.id) ?? 0) === 0) continue;
    urls.push(
      `  <url><loc>${escapeXml(
        `${BASE}/blog/category/${category.slug}`
      )}</loc><lastmod>${category.updatedAt
        .toISOString()
        .slice(0, 10)}</lastmod></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    "\n"
  )}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}