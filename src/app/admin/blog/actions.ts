"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { purgePublishedPosts } from "@/lib/blog-db";

const postSchema = z.object({
  id: z.string().optional(),
  title: z.string().trim().min(1, "Title is required"),
  slug: z.string().trim().min(1, "Slug is required"),
  excerpt: z.string().trim().min(1, "Excerpt is required"),
  body: z.string().trim().min(1, "Body is required"),
  categoryId: z.string().trim().optional(),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED"]),
  publishedAt: z.string().trim().optional(),
  serviceSlug: z.string().trim().optional(),
  authorName: z.string().trim().optional(),
});

export async function savePost(formData: FormData): Promise<void> {
  const parsed = postSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid post");
  }

  const data = parsed.data;
  const slug = slugify(data.slug || data.title);

  let publishedAt: Date | null = null;
  if (data.publishedAt) {
    const parsedDate = new Date(data.publishedAt);
    if (!Number.isNaN(parsedDate.getTime())) publishedAt = parsedDate;
  }
  if (!publishedAt && data.status === "PUBLISHED") publishedAt = new Date();

  const values = {
    title: data.title,
    slug,
    excerpt: data.excerpt,
    body: data.body,
    categoryId: data.categoryId || null,
    status: data.status,
    publishedAt,
    serviceSlug: data.serviceSlug || null,
    authorName: data.authorName || "Nessco Tech Services",
  };

  if (data.id) {
    await prisma.post.update({ where: { id: data.id }, data: values });
  } else {
    await prisma.post.create({ data: values });
  }

  purgePublishedPosts();
  updateTag("posts");
  redirect("/admin/blog");
}

export async function deletePost(formData: FormData): Promise<void> {
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  await prisma.post.delete({ where: { id } });
  purgePublishedPosts();
  updateTag("posts");
  redirect("/admin/blog");
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}