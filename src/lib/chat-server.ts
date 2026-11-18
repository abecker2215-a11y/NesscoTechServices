import { chatEntries } from "./chat-knowledge";
import { siteConfig } from "./config";

export type ChatIntent = "support" | "sales" | "general";

export interface SalesCta {
  label: string;
  href: string;
}

function escapeRegExp(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function wordMatches(query: string, keyword: string): boolean {
  const re = new RegExp(`\\b${escapeRegExp(keyword)}\\b`, "i");
  return re.test(query);
}

export function buildSystemPrompt(): string {
  const knowledgeBase = chatEntries
    .map((e) => `- ${e.title}: ${e.answer}`)
    .join("\n");

  return `You are Nessco Tech Services' AI assistant for nesscotech.com. You help Tampa Bay residents and businesses with IT problems.

RULES:
- Be concise, friendly, and jargon-free
- Always end with a clear next step (link to service, guide, or get-help form)
- For emergencies (ransomware, breach, data loss), tell them to call ${siteConfig.phone} immediately
- Don't make up pricing — only use the rates below
- If you can't help, direct them to /get-help or ${siteConfig.phone}
- Keep responses under 100 words when possible
- If the visitor wants a human, a callback, or to book service, tell them they can file a ticket right here in this chat and get a reference number
- Never invent reviews, testimonials, certifications, partnerships, customer counts, response times, guarantees, or geographic coverage
- Do not classify leads or promise outcomes — that is handled separately

PRICING:
- Remote support: $75/hour
- On-site support: $125/hour
- Business plans: Essentials $149/mo, Managed $349/mo, Complete $599/mo
- Hours: Mon-Fri 8am-6pm ET

KNOWLEDGE BASE:
${knowledgeBase}

AVAILABLE LINKS:
- Get Help: /get-help
- Services: /services
- Pricing: /pricing
- Guides: /guides
- Contact: /contact
- Computer Repair: /services/it-support/pc-mac
- Wi-Fi & Networking: /services/network-server/wireless
- Microsoft 365: /services/cloud-solutions/microsoft-365
- Security: /services/it-security
- Data Backup: /services/backup-disaster-recovery
- Business IT: /services/managed-it-services
- Remote Support: /services/it-support`;
}

export function findRelevantEntry(query: string) {
  const q = query.toLowerCase();
  let best: (typeof chatEntries)[0] | null = null;
  let bestScore = 0;
  for (const entry of chatEntries) {
    let score = 0;
    for (const kw of entry.keywords) {
      if (wordMatches(q, kw)) score += kw.length > 4 ? 2 : 1;
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }
  return bestScore > 0 ? best : null;
}

export function getDefaultLinks() {
  return [
    { label: "Start a service request", href: "/get-help" },
    { label: "Browse services", href: "/services" },
  ];
}

const DEFINITIONAL_RE = /\b(what is|what does|define|meaning of|explain|what are|how does)\b/i;

const BUYING_SIGNALS = [
  "cost", "price", "how much", "do you provide", "do you offer",
  "need someone", "looking for", "book", "request", "quote",
  "pricing", "estimate",
];

const SUPPORT_KEYWORDS = [
  "email is down", "email not", "email isn't", "outlook", "fix my", "help me fix",
  "computer is", "pc is", "laptop is", "wifi is slow", "wifi not",
  "virus", "malware", "ransomware on", "encrypted", "hacked",
  "printer not", "printer won't", "won't start", "won't boot",
  "blue screen", "crash", "frozen", "overheating", "down", "not working",
  "broken", "error", "slow", "offline", "syncing", "password reset",
  "locked out", "internet down", "network down",
];

const SALES_KEYWORDS = [
  "managed it", "manage our it", "manage my it", "manage company it",
  "it management", "managed services",
  "how much does managed it cost", "cost of managed it",
  "pricing for managed", "managed it pricing",
  "m365 migration", "microsoft 365 migration", "migrate to m365",
  "migrate to office 365", "office 365 migration",
  "cybersecurity", "do you provide cybersecurity", "do you provide managed it",
  "what services do you offer", "what services", "services do you offer",
  "book a consultation", "request pricing", "request a quote", "get a quote",
  "need someone to manage", "someone to manage our it",
  "looking for managed it", "looking for it support company",
];

const MANAGED_IT_RE = /\b(managed it|it management|managed services|look.?ing for managed)\b/i;
const CYBERSECURITY_STRONG_RE = /\b(cybersecurity|it security|managed security)\b/i;
const CYBERSECURITY_GENERAL_RE = /\bsecurity\b/i;
const M365_MIGRATION_RE = /\b(m365|microsoft 365|office 365).{0,40}(migration|migrate|moving|switch)\b/i;

export function classifyIntent(query: string, context?: string[]): ChatIntent {
  const q = query.toLowerCase();
  const allText = [...(context ?? []), q].join(" ").toLowerCase();

  const isDefinitional = DEFINITIONAL_RE.test(q);

  // Support takes precedence over sales.
  const hasSupport = SUPPORT_KEYWORDS.some((kw) => wordMatches(allText, kw));
  if (hasSupport) return "support";

  // Definitional/informational questions are general unless they carry explicit buying intent.
  if (isDefinitional) {
    const hasBuyingIntent = BUYING_SIGNALS.some((s) => wordMatches(q, s));
    if (!hasBuyingIntent) return "general";
  }

  // Strong sales signals always classify as sales.
  const hasStrongSales = SALES_KEYWORDS.some((kw) => wordMatches(allText, kw));
  if (hasStrongSales) return "sales";

  // "Cybersecurity" / "IT security" / "managed security" without buying context
  // is treated as a soft sales signal only when accompanied by buying language.
  if (CYBERSECURITY_STRONG_RE.test(allText)) {
    const hasBuyingContext = BUYING_SIGNALS.some((s) => wordMatches(allText, s));
    if (hasBuyingContext) return "sales";
  }

  // Bare "security" without buying context is informational (general).
  if (CYBERSECURITY_GENERAL_RE.test(allText)) {
    const hasBuyingContext = BUYING_SIGNALS.some((s) => wordMatches(allText, s));
    if (!hasBuyingContext) return "general";
  }

  return "general";
}

export function getSalesCtas(intent: ChatIntent): SalesCta[] {
  if (intent !== "sales") return [];

  const bookingHref = siteConfig.bookingUrl ?? "/contact";

  return [
    { label: "Request managed IT pricing", href: "/pricing" },
    { label: "Discuss cybersecurity", href: "/services/it-security" },
    { label: "Discuss Microsoft 365 migration", href: "/services/cloud-solutions/microsoft-365" },
    { label: "Book a consultation", href: bookingHref },
    { label: "Request a callback", href: "/contact" },
  ];
}

export function contextualSalesCta(intent: ChatIntent, query: string): SalesCta | null {
  if (intent !== "sales") return null;
  const q = query.toLowerCase();

  if (MANAGED_IT_RE.test(q)) {
    return { label: "Request managed IT pricing", href: "/pricing" };
  }
  if (CYBERSECURITY_STRONG_RE.test(q)) {
    return { label: "Discuss cybersecurity", href: "/services/it-security" };
  }
  if (M365_MIGRATION_RE.test(q)) {
    return { label: "Discuss Microsoft 365 migration", href: "/services/cloud-solutions/microsoft-365" };
  }
  return { label: "Book a consultation", href: siteConfig.bookingUrl ?? "/contact" };
}

/**
 * Validate that the Azure OpenAI endpoint is configured and looks like a
 * real URL before attempting a request. Prevents malformed or empty env
 * values from reaching the fetch call.
 */
export function isAzureConfigured(): boolean {
  const key = process.env.AZURE_OPENAI_API_KEY;
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  if (!key || !endpoint) return false;
  try {
    const url = new URL(endpoint);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
}
