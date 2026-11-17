import { describe, expect, it } from "vitest";
import {
  searchArticles,
  getRelatedArticles,
  getRecentArticles,
  groupArticlesByDate,
  type BlogArticle,
} from "./blog";

const articles: BlogArticle[] = [
  { slug: "a", title: "Alpha", excerpt: "excerpt alpha", date: "Oct 2026", author: "Nessco", category: "Security", readTime: "5 min", body: "body alpha" },
  { slug: "b", title: "Beta Security", excerpt: "beta security excerpt", date: "Sep 2026", author: "Nessco", category: "Security", readTime: "4 min", body: "body beta" },
  { slug: "c", title: "Cloud Guide", excerpt: "cloud stuff", date: "Oct 2026", author: "Nessco", category: "Cloud", readTime: "6 min", body: "body cloud" },
];

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
