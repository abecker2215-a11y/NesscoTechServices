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
    select: { slug: true, updatedAt: true, publishedAt: true },
    orderBy: { publishedAt: "desc" },
  });

  const urls = posts.map((post) => {
    const lastmod = (post.updatedAt ?? post.publishedAt ?? new Date())
      .toISOString()
      .slice(0, 10);
    return `  <url><loc>${escapeXml(
      `${BASE}/blog/${post.slug}`
    )}</loc><lastmod>${lastmod}</lastmod></url>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join(
    "\n"
  )}\n</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}