import { describe, expect, it } from "vitest";
import { helpCategories, getCategoryQuestions, getCategoryLabel, isEmergencyRequest } from "./help-workflow";

describe("helpCategories", () => {
  it("contains expected categories", () => {
    const ids = helpCategories.map((c) => c.id);
    expect(ids).toContain("computer");
    expect(ids).toContain("wifi");
    expect(ids).toContain("email");
    expect(ids).toContain("m365");
    expect(ids).toContain("security");
    expect(ids).toContain("printer");
    expect(ids).toContain("hardware");
    expect(ids).toContain("business");
    expect(ids).toContain("other");
  });

  it("each category has required fields", () => {
    for (const cat of helpCategories) {
      expect(cat.id).toBeDefined();
      expect(cat.label).toBeDefined();
      expect(cat.icon).toBeDefined();
      expect(Array.isArray(cat.questions)).toBe(true);
      expect(cat.questions.length).toBeGreaterThan(0);
    }
  });
});

describe("getCategoryQuestions", () => {
  it("returns questions for a valid category", () => {
    const questions = getCategoryQuestions("wifi");
    expect(questions.length).toBeGreaterThan(0);
    expect(questions[0].id).toBe("issueType");
  });

  it("returns empty array for unknown category", () => {
    expect(getCategoryQuestions("not-a-category")).toEqual([]);
  });
});

describe("getCategoryLabel", () => {
  it("returns label for valid category", () => {
    expect(getCategoryLabel("wifi")).toBe("Wi-Fi / Networking");
    expect(getCategoryLabel("security")).toBe("Security");
  });

  it("returns category id for unknown category", () => {
    expect(getCategoryLabel("not-a-category")).toBe("not-a-category");
  });
});

describe("isEmergencyRequest", () => {
  it("returns false for non-security categories", () => {
    expect(isEmergencyRequest("wifi", { urgency: "active" })).toBe(false);
    expect(isEmergencyRequest("computer", { issueType: "ransomware" })).toBe(false);
  });

  it("returns false for security with non-active urgency and non-ransomware issue", () => {
    expect(isEmergencyRequest("security", { urgency: "soon" })).toBe(false);
    expect(isEmergencyRequest("security", { urgency: "planning", issueType: "hardening" })).toBe(false);
  });

  it("returns true for security with active urgency", () => {
    expect(isEmergencyRequest("security", { urgency: "active" })).toBe(true);
  });

  it("returns true for security with ransomware issue type", () => {
    expect(isEmergencyRequest("security", { urgency: "soon", issueType: "ransomware" })).toBe(true);
    expect(isEmergencyRequest("security", { urgency: "planning", issueType: "breach" })).toBe(true);
  });

  it("returns false when category is undefined", () => {
    expect(isEmergencyRequest(undefined, { urgency: "active" })).toBe(false);
  });
});
