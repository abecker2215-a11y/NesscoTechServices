import Link from "next/link";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { prisma } from "@/lib/prisma";
import { savePost } from "../actions";

export const dynamic = "force-dynamic";

const inputCls =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function toLocalInput(date: Date | null | undefined): string {
  return date ? format(date, "yyyy-MM-dd'T'HH:mm") : "";
}

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const isNew = id === "new";

  const post = isNew
    ? null
    : await prisma.post.findUnique({ where: { id } });
  if (!isNew && !post) notFound();

  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">
          {isNew ? "New post" : "Edit post"}
        </h1>
        <Link
          href="/admin/blog"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
      </div>

      <form
        action={savePost}
        className="space-y-4 rounded-xl border border-border bg-background p-6"
      >
        {post && <input type="hidden" name="id" value={post.id} />}

        <Field label="Title">
          <input name="title" defaultValue={post?.title ?? ""} required className={inputCls} />
        </Field>

        <Field label="Slug (leave blank to generate from title)">
          <input name="slug" defaultValue={post?.slug ?? ""} className={inputCls} />
        </Field>

        <Field label="Excerpt">
          <textarea
            name="excerpt"
            defaultValue={post?.excerpt ?? ""}
            required
            rows={2}
            className={inputCls}
          />
        </Field>

        <Field label="Body (markdown)">
          <textarea
            name="body"
            defaultValue={post?.body ?? ""}
            required
            rows={16}
            className={`${inputCls} font-mono text-sm`}
          />
        </Field>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Category">
            <select
              name="categoryId"
              defaultValue={post?.categoryId ?? ""}
              className={inputCls}
            >
              <option value="">Uncategorized</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Status">
            <select
              name="status"
              defaultValue={post?.status ?? "DRAFT"}
              className={inputCls}
            >
              <option value="DRAFT">Draft</option>
              <option value="PUBLISHED">Published</option>
            </select>
          </Field>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Publish date (optional)">
            <input
              name="publishedAt"
              type="datetime-local"
              defaultValue={toLocalInput(post?.publishedAt ?? null)}
              className={inputCls}
            />
          </Field>

          <Field label="Related service slug (optional)">
            <input
              name="serviceSlug"
              defaultValue={post?.serviceSlug ?? ""}
              className={inputCls}
            />
          </Field>
        </div>

        <Field label="Author">
          <input
            name="authorName"
            defaultValue={post?.authorName ?? "Nessco Tech Services"}
            className={inputCls}
          />
        </Field>

        <div className="flex justify-end gap-3 pt-2">
          <Link
            href="/admin/blog"
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
}