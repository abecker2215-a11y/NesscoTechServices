import { describe, expect, it } from "vitest";
import { getArticle, getAllArticles, getArticlesByCategory, searchArticles, getRelatedArticles, getRecentArticles, groupArticlesByDate, type BlogArticle } from "./blog";

const articles: BlogArticle[] = [
  { slug: "a", title: "Alpha", excerpt: "excerpt alpha", date: "Oct 2026", author: "Nessco", category: "Security", readTime: "5 min", body: "body alpha" },
  { slug: "b", title: "Beta Security", excerpt: "beta security excerpt", date: "Sep 2026", author: "Nessco", category: "Security", readTime: "4 min", body: "body beta" },
  { slug: "c", title: "Cloud Guide", excerpt: "cloud stuff", date: "Oct 2026", author: "Nessco", category: "Cloud", readTime: "6 min", body: "body cloud" },
];

describe("getArticlesByCategory", () => {
  it("returns all articles when category is All or empty", () => {
    const all = getArticlesByCategory("All");
    const empty = getArticlesByCategory("");
    expect(all).toHaveLength(empty.length);
    expect(all.length).toBeGreaterThan(0);
  });

  it("filters by category", () => {
    const security = getArticlesByCategory("Security");
    expect(security.length).toBeGreaterThan(0);
    expect(security.every((a) => a.category === "Security")).toBe(true);
  });

  it("returns empty array for unknown category", () => {
    expect(getArticlesByCategory("Nonexistent")).toEqual([]);
  });
});

describe("searchArticles", () => {
  it("returns all articles for empty query", () => {
    expect(searchArticles(articles, "")).toHaveLength(3);
    expect(searchArticles(articles, "   ")).toHaveLength(3);
  });

  it("matches title case-insensitively", () => {
    expect(searchArticles(articles, "ALPHA")).toHaveLength(1);
    expect(searchArticles(articles, "alpha")[0]?.slug).toBe("a");
  });

  it("matches excerpt case-insensitively", () => {
    expect(searchArticles(articles, "cloud stuff")[0]?.slug).toBe("c");
  });

  it("matches body", () => {
    expect(searchArticles(articles, "body beta")[0]?.slug).toBe("b");
  });

  it("returns empty array for no matches", () => {
    expect(searchArticles(articles, "zzznomatch")).toEqual([]);
  });
});

describe("getRelatedArticles", () => {
  it("returns up to limit articles in same category excluding current", () => {
    const related = getRelatedArticles(articles[0], articles, 3);
    expect(related).toHaveLength(1);
    expect(related[0]?.slug).toBe("b");
    expect(related.some((a) => a.slug === "a")).toBe(false);
  });

  it("defaults limit to 3", () => {
    const related = getRelatedArticles(articles[0], articles);
    expect(related).toHaveLength(1);
  });

  it("returns empty when no other articles in category", () => {
    const cloud = articles.find((a) => a.slug === "c");
    expect(cloud).toBeDefined();
    const related = getRelatedArticles(cloud!, articles);
    expect(related).toEqual([]);
  });
});

describe("getRecentArticles", () => {
  it("returns most recent first, limited to 5", () => {
    const recent = getRecentArticles(articles, 5);
    expect(recent).toHaveLength(3);
    expect(recent[0]?.slug).toBe("a"); // Oct 2026 > Sep 2026
  });

  it("defaults limit to 5", () => {
    expect(getRecentArticles(articles)).toHaveLength(3);
  });
});

describe("groupArticlesByDate", () => {
  it("groups articles by date", () => {
    const groups = groupArticlesByDate(articles);
    expect(groups).toHaveLength(2);
    const octGroup = groups.find((g) => g.date === "Oct 2026");
    expect(octGroup?.articles).toHaveLength(2);
    const sepGroup = groups.find((g) => g.date === "Sep 2026");
    expect(sepGroup?.articles).toHaveLength(1);
  });

  it("sorts groups newest first", () => {
    const groups = groupArticlesByDate(articles);
    expect(groups[0].date).toBe("Oct 2026");
  });

  it("returns empty array for no articles", () => {
    expect(groupArticlesByDate([])).toEqual([]);
  });
});

describe("category coverage", () => {
  it("returns Backup articles", () => {
    const backup = getArticlesByCategory("Backup");
    expect(backup.length).toBeGreaterThan(0);
    expect(backup.every((a) => a.category === "Backup")).toBe(true);
  });

  it("returns Applications articles", () => {
    const apps = getArticlesByCategory("Applications");
    expect(apps.length).toBeGreaterThan(0);
    expect(apps.every((a) => a.category === "Applications")).toBe(true);
  });

  it("returns Cloud articles", () => {
    const cloud = getArticlesByCategory("Cloud");
    expect(cloud.length).toBeGreaterThan(0);
    expect(cloud.every((a) => a.category === "Cloud")).toBe(true);
  });

  it("returns Communications articles", () => {
    const comm = getArticlesByCategory("Communications");
    expect(comm.length).toBeGreaterThan(0);
    expect(comm.every((a) => a.category === "Communications")).toBe(true);
  });

  it("returns empty for Guides and Quick fixes (removed chips)", () => {
    expect(getArticlesByCategory("Guides")).toEqual([]);
    expect(getArticlesByCategory("Quick fixes")).toEqual([]);
  });
});

describe("new articles", () => {
  it("each slug is retrievable and unique", () => {
    const slugs = Array.from({ length: 20 }, (_, i) => `new-article-${String(i + 1).padStart(2, "0")}`);
    expect(slugs).toHaveLength(new Set(slugs).size); // unique
    for (const slug of slugs) {
      const article = getArticle(slug);
      expect(article).toBeDefined();
      expect(article?.slug).toBe(slug);
      expect(article?.body?.trim().length).toBeGreaterThan(0);
      expect(article?.body).not.toContain("TODO");
    }
  });

  it("getRelatedArticles excludes itself for new articles", () => {
    const article = getArticle("new-article-01");
    expect(article).toBeDefined();
    const related = getRelatedArticles(article!, getAllArticles());
    expect(related.every((a) => a.slug !== "new-article-01")).toBe(true);
    expect(related.every((a) => a.category === article!.category)).toBe(true);
  });
});
