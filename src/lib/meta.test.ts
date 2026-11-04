import { describe, expect, it } from "vitest";
import { pageTitle, metaDescription } from "./meta";

describe("pageTitle", () => {
  it("appends site suffix when base title is 40 chars or fewer", () => {
    expect(pageTitle("Home")).toBe("Home | Nessco Tech Services");
    expect(pageTitle("About Us")).toBe("About Us | Nessco Tech Services");
  });

  it("drops site suffix when base title exceeds 40 chars", () => {
    const long = "Managed IT Services for Tampa Bay Businesses";
    expect(long.length).toBeGreaterThan(40);
    expect(pageTitle(long)).toBe(long);
  });

  it("keeps suffix exactly at 40 chars", () => {
    const exactly40 = "1234567890123456789012345678901234567890";
    expect(exactly40.length).toBe(40);
    expect(pageTitle(exactly40)).toBe(`${exactly40} | Nessco Tech Services`);
  });
});

describe("metaDescription", () => {
  it("returns text unchanged when within max length", () => {
    expect(metaDescription("Short description")).toBe("Short description");
  });

  it("clamps to max length on word boundary", () => {
    const result = metaDescription("This is a longer description that exceeds the limit", 20);
    expect(result.length).toBeLessThanOrEqual(20);
    expect(result.endsWith("…")).toBe(true);
  });

  it("uses default max of 155", () => {
    const longText = "x".repeat(200);
    expect(metaDescription(longText).length).toBeLessThanOrEqual(155);
  });

  it("handles empty string", () => {
    expect(metaDescription("")).toBe("");
  });
});
