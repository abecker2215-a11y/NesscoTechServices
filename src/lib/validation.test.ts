import { describe, expect, it } from "vitest";
import { contactSchema, helpRequestSchema, helpRequestContactSchema } from "./validation";

describe("contactSchema", () => {
  it("accepts valid contact data", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      subject: "sales",
      message: "This is a test message with enough length",
    });
    expect(result.success).toBe(true);
  });

  it("rejects name shorter than 2 chars", () => {
    const result = contactSchema.safeParse({
      name: "J",
      email: "jane@example.com",
      phone: "+15551234567",
      subject: "sales",
      message: "This is a test message with enough length",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues).toHaveLength(1);
      expect(result.error.issues[0].path).toContain("name");
    }
  });

  it("rejects invalid email", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "not-an-email",
      phone: "+15551234567",
      subject: "sales",
      message: "This is a test message with enough length",
    });
    expect(result.success).toBe(false);
  });

  it("rejects phone with wrong digit count", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "555",
      subject: "sales",
      message: "This is a test message with enough length",
    });
    expect(result.success).toBe(false);
  });

  it("rejects message shorter than 10 chars", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      subject: "sales",
      message: "short",
    });
    expect(result.success).toBe(false);
  });

  it("accepts honeypot as empty or absent", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      subject: "sales",
      message: "This is a test message with enough length",
      honeypot: "",
    });
    expect(result.success).toBe(true);
  });

  it("rejects non-empty honeypot (spam)", () => {
    const result = contactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      subject: "sales",
      message: "This is a test message with enough length",
      honeypot: "spam",
    });
    expect(result.success).toBe(false);
  });
});

describe("helpRequestContactSchema", () => {
  it("accepts valid contact data", () => {
    const result = helpRequestContactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      preferredContact: "email",
      preference: "remote",
      description: "This is a test description with enough length",
    });
    expect(result.success).toBe(true);
  });

  it("requires preferredContact and preference", () => {
    const result = helpRequestContactSchema.safeParse({
      name: "Jane Doe",
      email: "jane@example.com",
      phone: "+15551234567",
      description: "This is a test description with enough length",
    });
    expect(result.success).toBe(false);
  });
});

describe("helpRequestSchema", () => {
  it("accepts valid help request", () => {
    const result = helpRequestSchema.safeParse({
      category: "wifi",
      answers: { issueType: "slow", deviceCount: "few" },
      contact: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+15551234567",
        preferredContact: "email",
        preference: "remote",
        description: "Wi-Fi is slow in the back office",
      },
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid category", () => {
    const result = helpRequestSchema.safeParse({
      category: "not-a-category",
      answers: {},
      contact: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+15551234567",
        preferredContact: "email",
        preference: "remote",
        description: "This is a test description with enough length",
      },
    });
    expect(result.success).toBe(false);
  });

  it("limits photos to 3", () => {
    const result = helpRequestSchema.safeParse({
      category: "computer",
      answers: { symptoms: "won't start", whenStarted: "today", deviceCount: "1", internetAccess: "yes" },
      photos: ["a.jpg", "b.jpg", "c.jpg", "d.jpg"],
      photoNames: ["a.jpg", "b.jpg", "c.jpg", "d.jpg"],
      contact: {
        name: "Jane Doe",
        email: "jane@example.com",
        phone: "+15551234567",
        preferredContact: "email",
        preference: "remote",
        description: "This is a test description with enough length",
      },
    });
    expect(result.success).toBe(false);
  });
});
