import { describe, expect, it, vi } from "vitest";
import { daysAgo } from "./dates";

describe("daysAgo", () => {
  it("returns a date in the past", () => {
    const before = Date.now();
    const result = daysAgo(1);
    const after = Date.now();
    expect(result.getTime()).toBeGreaterThanOrEqual(before - 24 * 60 * 60 * 1000 - 1000);
    expect(result.getTime()).toBeLessThanOrEqual(after);
  });

  it("returns correct offset for 0 days", () => {
    const before = Date.now();
    const result = daysAgo(0);
    const after = Date.now();
    expect(result.getTime()).toBeGreaterThanOrEqual(before);
    expect(result.getTime()).toBeLessThanOrEqual(after);
  });

  it("returns a Date object", () => {
    expect(daysAgo(5)).toBeInstanceOf(Date);
  });

  it("uses mocked date deterministically", () => {
    const fixed = new Date("2026-01-15T12:00:00Z").getTime();
    vi.setSystemTime(fixed);
    try {
      const result = daysAgo(1);
      expect(result.getTime()).toBe(fixed - 24 * 60 * 60 * 1000);
    } finally {
      vi.useRealTimers();
    }
  });
});
