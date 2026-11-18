import { describe, expect, it, beforeEach, afterEach } from "vitest";
import {
  buildSystemPrompt,
  classifyIntent,
  contextualSalesCta,
  findRelevantEntry,
  getDefaultLinks,
  isAzureConfigured,
} from "./chat-server";
import { isValidIp, getClientIp } from "./rate-limit";
import type { NextRequest } from "next/server";
import { chatEntries } from "./chat-knowledge";

describe("classifyIntent", () => {
  it("classifies support requests as support", () => {
    expect(classifyIntent("My email isn't working")).toBe("support");
    expect(classifyIntent("Fix my Outlook please")).toBe("support");
    expect(classifyIntent("Virus alert on my PC")).toBe("support");
    expect(classifyIntent("Wi-Fi is slow in the office")).toBe("support");
    expect(classifyIntent("My computer won't start")).toBe("support");
    expect(classifyIntent("Printer is offline")).toBe("support");
  });

  it("classifies sales inquiries as sales", () => {
    expect(classifyIntent("How much does managed IT cost?")).toBe("sales");
    expect(classifyIntent("We need someone to manage our company's IT")).toBe("sales");
    expect(classifyIntent("Do you provide cybersecurity?")).toBe("sales");
    expect(classifyIntent("Microsoft 365 migration help")).toBe("sales");
    expect(classifyIntent("Migrate to Office 365")).toBe("sales");
  });

  it("classifies definitional questions as general", () => {
    expect(classifyIntent("What is Microsoft 365?")).toBe("general");
    expect(classifyIntent("What is ransomware?")).toBe("general");
    expect(classifyIntent("What does MFA mean?")).toBe("general");
  });

  it("gives support precedence over sales when both detected", () => {
    expect(classifyIntent("My email is down and I want managed IT")).toBe("support");
    expect(classifyIntent("Fix my computer and tell me about managed services")).toBe("support");
  });

  it("uses conversation context for sales intent", () => {
    // A definitional question alone is general
    expect(classifyIntent("What is cybersecurity?")).toBe("general");
    // But with prior buying context, it can lean sales — classifier checks current message first
    expect(classifyIntent("What is cybersecurity?", ["We're looking for managed IT services"])).toBe("general");
  });

  it("defaults to general for unrecognized queries", () => {
    expect(classifyIntent("Hello")).toBe("general");
    expect(classifyIntent("Thanks")).toBe("general");
  });
});

describe("findRelevantEntry", () => {
  it("matches Wi-Fi queries with word boundaries", () => {
    const entry = findRelevantEntry("My Wi-Fi is slow");
    expect(entry).not.toBeNull();
    expect(entry!.id).toBe("wifi");
  });

  it("does not false-positive on substring matches", () => {
    // "computer" inside "computermanager" should not match the "computer" keyword
    const entry = findRelevantEntry("My computermanager is fine");
    expect(entry).toBeNull();
  });

  it("matches email queries", () => {
    const entry = findRelevantEntry("Email not syncing");
    expect(entry).not.toBeNull();
    expect(entry!.id).toBe("email");
  });

  it("returns null for unrecognized queries", () => {
    const entry = findRelevantEntry("blah blah xyzzy nothing relevant");
    expect(entry).toBeNull();
  });
});

describe("contextualSalesCta", () => {
  it("returns managed IT pricing CTA for managed IT inquiries", () => {
    const cta = contextualSalesCta("sales", "How much does managed IT cost?");
    expect(cta?.label).toBe("Request managed IT pricing");
    expect(cta?.href).toBe("/pricing");
  });

  it("returns cybersecurity CTA for security inquiries", () => {
    const cta = contextualSalesCta("sales", "Do you provide cybersecurity?");
    expect(cta?.label).toBe("Discuss cybersecurity");
    expect(cta?.href).toBe("/services/it-security");
  });

  it("returns M365 migration CTA for migration inquiries", () => {
    const cta = contextualSalesCta("sales", "Microsoft 365 migration help");
    expect(cta?.label).toBe("Discuss Microsoft 365 migration");
    expect(cta?.href).toBe("/services/cloud-solutions/microsoft-365");
  });

  it("returns book consultation for unspecified sales inquiries", () => {
    const cta = contextualSalesCta("sales", "I need IT help for my business");
    expect(cta?.label).toBe("Book a consultation");
  });

  it("returns null for non-sales intents", () => {
    expect(contextualSalesCta("support", "My email is down")).toBeNull();
    expect(contextualSalesCta("general", "What is ransomware?")).toBeNull();
  });
});

describe("buildSystemPrompt", () => {
  it("returns a non-empty prompt with key sections", () => {
    const prompt = buildSystemPrompt();
    expect(prompt.length).toBeGreaterThan(100);
    expect(prompt).toContain("Nessco Tech Services");
    expect(prompt).toContain("KNOWLEDGE BASE");
    expect(prompt).toContain("PRICING");
    expect(prompt).toContain("AVAILABLE LINKS");
    expect(prompt).not.toContain(process.env.AZURE_OPENAI_API_KEY);
  });

  it("includes all chat entry titles", () => {
    const prompt = buildSystemPrompt();
    for (const entry of chatEntries) {
      expect(prompt).toContain(entry.title);
    }
  });
});

describe("getDefaultLinks", () => {
  it("returns get-help and services links", () => {
    const links = getDefaultLinks();
    expect(links).toHaveLength(2);
    expect(links[0].label).toBe("Start a service request");
    expect(links[0].href).toBe("/get-help");
    expect(links[1].label).toBe("Browse services");
    expect(links[1].href).toBe("/services");
  });
});

describe("isAzureConfigured", () => {
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it("returns true when key and valid HTTPS endpoint are set", () => {
    process.env.AZURE_OPENAI_API_KEY = "test-key";
    process.env.AZURE_OPENAI_ENDPOINT = "https://example.openai.azure.com/";
    expect(isAzureConfigured()).toBe(true);
  });

  it("returns false when key is missing", () => {
    process.env.AZURE_OPENAI_API_KEY = "";
    process.env.AZURE_OPENAI_ENDPOINT = "https://example.openai.azure.com/";
    expect(isAzureConfigured()).toBe(false);
  });

  it("returns false when endpoint is missing", () => {
    process.env.AZURE_OPENAI_API_KEY = "test-key";
    process.env.AZURE_OPENAI_ENDPOINT = "";
    expect(isAzureConfigured()).toBe(false);
  });

  it("returns false when both are unset", () => {
    process.env.AZURE_OPENAI_API_KEY = "";
    process.env.AZURE_OPENAI_ENDPOINT = "";
    expect(isAzureConfigured()).toBe(false);
  });
});

describe("classifyIntent refinements", () => {
  it("treats bare 'security' question without buying context as general", () => {
    expect(classifyIntent("What is security?")).toBe("general");
    expect(classifyIntent("Tell me about security")).toBe("general");
  });

  it("treats 'cybersecurity' informational question as general", () => {
    expect(classifyIntent("What is cybersecurity?")).toBe("general");
  });

  it("treats cybersecurity with buying signals as sales", () => {
    expect(classifyIntent("Do you provide cybersecurity?")).toBe("sales");
    expect(classifyIntent("How much does cybersecurity cost?")).toBe("sales");
  });

  it("uses word-boundary matching for BUYING_SIGNALS (no substring false positives)", () => {
    // "cost" should not match inside "costco"
    expect(classifyIntent("We shop at costco")).toBe("general");
    // "price" should not match inside "priceless"
    expect(classifyIntent("That is priceless")).toBe("general");
  });

  it("detects managed IT buying intent with word boundaries", () => {
    expect(classifyIntent("How much does managed IT cost?")).toBe("sales");
    expect(classifyIntent("We need managed IT services")).toBe("sales");
  });
});

describe("rate-limit IP extraction", () => {
  type MockHeaders = Record<string, string>;

  function mockRequest(headers: MockHeaders): NextRequest {
    return new Request("https://nesscotech.com/api/chat/stream", {
      method: "POST",
      headers,
    }) as unknown as NextRequest;
  }

  it("prefers CF-Connecting-IP when present and valid", () => {
    const req = mockRequest({
      "cf-connecting-ip": "203.0.113.5",
      "x-forwarded-for": "1.2.3.4",
    });
    expect(getClientIp(req)).toBe("203.0.113.5");
  });

  it("falls back to X-Real-IP when CF-Connecting-IP is absent", () => {
    const req = mockRequest({
      "x-real-ip": "198.51.100.23",
    });
    expect(getClientIp(req)).toBe("198.51.100.23");
  });

  it("rejects spoofed X-Forwarded-For with invalid IP", () => {
    const req = mockRequest({
      "x-forwarded-for": "not-an-ip",
    });
    expect(getClientIp(req)).toBe("unknown");
  });

  it("validates IPv4 octet ranges", () => {
    expect(isValidIp("256.1.1.1")).toBe(false);
    expect(isValidIp("1.2.3.256")).toBe(false);
    expect(isValidIp("203.0.113.5")).toBe(true);
    expect(isValidIp("10.0.0.1")).toBe(true);
  });

  it("accepts IPv6 addresses", () => {
    expect(isValidIp("2001:db8::1")).toBe(true);
    expect(isValidIp("::1")).toBe(true);
  });

  it("rejects empty and unknown values", () => {
    expect(isValidIp("")).toBe(false);
    expect(isValidIp("unknown")).toBe(false);
    expect(isValidIp("   ")).toBe(false);
  });
});

