import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminBlogListPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      status: true,
      updatedAt: true,
      publishedAt: true,
      category: { select: { name: true } },
    },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          Blog posts ({posts.length})
        </h1>
        <Link
          href="/admin/blog/new"
          className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          New post
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Title</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t border-border">
                <td className="px-4 py-3">
                  <Link
                    href={`/admin/blog/${post.id}`}
                    className="font-medium text-foreground hover:text-primary"
                  >
                    {post.title}
                  </Link>
                  <div className="text-xs text-muted-foreground">
                    /blog/{post.slug}
                  </div>
                </td>
                <td className="px-4 py-3">{post.category?.name ?? "—"}</td>
                <td className="px-4 py-3">{post.status}</td>
                <td className="px-4 py-3">
                  {post.publishedAt?.toISOString().slice(0, 10) ?? "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <form action={deletePost} className="inline">
                    <input type="hidden" name="id" value={post.id} />
                    <button
                      type="submit"
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {posts.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No posts yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}