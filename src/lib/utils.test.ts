import { describe, expect, it } from "vitest";
import { cn, formatPhone } from "./utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("handles undefined and null inputs", () => {
    expect(cn("a", undefined, null, false, "b")).toBe("a b");
  });

  it("resolves tailwind conflicts with last-wins", () => {
    expect(cn("p-4", "p-2")).toBe("p-2");
    expect(cn("bg-red-500", "bg-blue-500")).toBe("bg-blue-500");
  });
});

describe("formatPhone", () => {
  it("formats 10-digit number", () => {
    expect(formatPhone("5551234567")).toBe("(555) 123-4567");
  });

  it("formats 11-digit number with leading 1", () => {
    expect(formatPhone("15551234567")).toBe("+1 (555) 123-4567");
  });

  it("strips non-digit characters", () => {
    expect(formatPhone("+1 (555) 123-4567")).toBe("+1 (555) 123-4567");
    expect(formatPhone("555.123.4567")).toBe("(555) 123-4567");
  });

  it("returns unrecognizable input unchanged", () => {
    expect(formatPhone("abc")).toBe("abc");
    expect(formatPhone("12345")).toBe("12345");
  });
});
