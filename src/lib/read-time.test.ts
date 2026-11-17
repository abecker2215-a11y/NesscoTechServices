import { describe, expect, it } from "vitest";
import { countWords, readTimeLabel, readingMinutes } from "./read-time";

describe("countWords", () => {
  it("counts plain prose", () => {
    expect(countWords("one two three four")).toBe(4);
  });

  it("ignores fenced code blocks", () => {
    const body = "## Title\n\nSome prose here.\n\n```\nconst x = 1;\n```\n";
    expect(countWords(body)).toBe(countWords("Title Some prose here."));
  });

  it("counts link text but not the target", () => {
    expect(countWords("[read this](https://example.com/a/very/long/path)")).toBe(2);
  });

  it("counts image alt text", () => {
    expect(countWords("![a diagram of the network](img.png)")).toBe(5);
  });

  it("counts heading text without the hashes", () => {
    expect(countWords("## The failure mode")).toBe(3);
  });

  it("returns zero for empty input", () => {
    expect(countWords("")).toBe(0);
    expect(countWords("   \n\n  ")).toBe(0);
  });
});

describe("readingMinutes", () => {
  it("never returns less than one minute", () => {
    expect(readingMinutes("")).toBe(1);
    expect(readingMinutes("short")).toBe(1);
  });

  it("rounds up to the next minute", () => {
    expect(readingMinutes("word ".repeat(200))).toBe(1);
    expect(readingMinutes("word ".repeat(201))).toBe(2);
    expect(readingMinutes("word ".repeat(400))).toBe(2);
    expect(readingMinutes("word ".repeat(401))).toBe(3);
  });

  it("treats a typical post of about 350 words as two minutes", () => {
    expect(readingMinutes("word ".repeat(350))).toBe(2);
  });
});

describe("readTimeLabel", () => {
  it("formats the label", () => {
    expect(readTimeLabel("word ".repeat(350))).toBe("2 min read");
  });

  it("always includes a unit", () => {
    expect(readTimeLabel("")).toBe("1 min read");
  });
});