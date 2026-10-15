import { HelpQuestion, HelpRequestCategory } from "@/lib/types";

export const helpCategories: HelpRequestCategory[] = [
  {
    id: "computer",
    label: "Computer",
    icon: "computer",
    description: "Fix slow, broken, or crashed workstations and servers",
    questions: [
      { id: "symptoms", label: "What's happening?", type: "textarea", required: true, placeholder: "e.g., Won't start, blue screen, running slow, strange noises" },
      { id: "whenStarted", label: "When did it start?", type: "text", required: true, placeholder: "e.g., This morning, after an update, last week" },
      { id: "deviceCount", label: "How many computers are affected?", type: "select", required: true, options: [{ value: "1", label: "Just one" }, { value: "2-5", label: "2–5" }, { value: "6+", label: "6 or more" }] },
      { id: "internetAccess", label: "Can you still access the internet?", type: "radio", required: true, options: [{ value: "yes", label: "Yes" }, { value: "no", label: "No" }, { value: "intermittent", label: "Intermittent" }] },
    ],
  },
  {
    id: "wifi",
    label: "Wi-Fi / Networking",
    icon: "wifi",
    description: "Slow internet, dead zones, network infrastructure",
    questions: [
      { id: "issueType", label: "What type of issue?", type: "select", required: true, options: [{ value: "slow", label: "Slow speeds" }, { value: "deadzones", label: "Dead zones / poor coverage" }, { value: "wontconnect", label: "Devices won't connect" }, { value: "newsetup", label: "New router / mesh setup" }, { value: "other", label: "Other" }] },
      { id: "deviceCount", label: "How many devices are affected?", type: "select", required: true, options: [{ value: "1", label: "One device" }, { value: "few", label: "A few devices" }, { value: "all", label: "All devices" }] },
      { id: "routerAge", label: "How old is your router?", type: "select", required: false, options: [{ value: "under1", label: "Under 1 year" }, { value: "1-3", label: "1–3 years" }, { value: "3-5", label: "3–5 years" }, { value: "5plus", label: "5+ years" }, { value: "unknown", label: "Not sure" }] },
      { id: "isp", label: "Who is your internet provider?", type: "text", required: false, placeholder: "e.g., Spectrum, Frontier, Xfinity" },
    ],
  },
  {
    id: "email",
    label: "Email",
    icon: "mail",
    description: "Fix sending, receiving, sync, and security",
    questions: [
      { id: "issueType", label: "What's the problem?", type: "select", required: true, options: [{ value: "cantsend", label: "Can't send emails" }, { value: "cantreceive", label: "Can't receive emails" }, { value: "sync", label: "Sync issues across devices" }, { value: "spam", label: "Too much spam / phishing" }, { value: "setup", label: "New account setup" }, { value: "other", label: "Other" }] },
      { id: "provider", label: "Email provider", type: "select", required: true, options: [{ value: "m365", label: "Microsoft 365 / Outlook" }, { value: "google", label: "Google Workspace / Gmail" }, { value: "godaddy", label: "GoDaddy" }, { value: "other", label: "Other" }] },
      { id: "deviceCount", label: "How many devices need email access?", type: "select", required: false, options: [{ value: "1", label: "One" }, { value: "2-5", label: "2–5" }, { value: "6+", label: "6 or more" }] },
    ],
  },
  {
    id: "m365",
    label: "Microsoft 365",
    icon: "mail",
    description: "Setup, migration, and management",
    questions: [
      { id: "issueType", label: "What do you need help with?", type: "select", required: true, options: [{ value: "licenses", label: "License management / renewal" }, { value: "migration", label: "Migration from another provider" }, { value: "teams", label: "Teams / SharePoint / OneDrive issues" }, { value: "security", label: "Security policies (MFA, conditional access)" }, { value: "setup", label: "Initial setup / configuration" }, { value: "other", label: "Other" }] },
      { id: "userCount", label: "How many users/licenses?", type: "select", required: true, options: [{ value: "1-5", label: "1–5" }, { value: "6-25", label: "6–25" }, { value: "26-50", label: "26–50" }, { value: "50+", label: "50+" }] },
      { id: "currentProvider", label: "Current email/provider (if migrating)?", type: "text", required: false, placeholder: "e.g., Google Workspace, GoDaddy, Rackspace" },
    ],
  },
  {
    id: "security",
    label: "Security",
    icon: "shield",
    description: "Virus removal, audits, HIPAA/PCI compliance",
    questions: [
      { id: "issueType", label: "What's the concern?", type: "select", required: true, options: [{ value: "virus", label: "Virus / malware suspected" }, { value: "ransomware", label: "Ransomware / encrypted files" }, { value: "phishing", label: "Phishing / suspicious emails" }, { value: "breach", label: "Possible data breach" }, { value: "hardening", label: "Want better protection" }, { value: "other", label: "Other" }] },
      { id: "urgency", label: "How urgent?", type: "radio", required: true, options: [{ value: "active", label: "Active incident — need help now" }, { value: "soon", label: "Within 24 hours" }, { value: "planning", label: "Planning / prevention" }] },
      { id: "deviceCount", label: "How many devices potentially affected?", type: "select", required: false, options: [{ value: "1", label: "One" }, { value: "2-10", label: "2–10" }, { value: "10+", label: "10+" }] },
    ],
  },
  {
    id: "printer",
    label: "Printer",
    icon: "database",
    description: "Setup, troubleshooting, drivers, network printing",
    questions: [
      { id: "issueType", label: "What's the problem?", type: "select", required: true, options: [{ value: "wontprint", label: "Won't print at all" }, { value: "wireless", label: "Wireless setup / connection" }, { value: "quality", label: "Poor print quality" }, { value: "drivers", label: "Driver / software issues" }, { value: "network", label: "Network printer not found" }, { value: "other", label: "Other" }] },
      { id: "printerModel", label: "Printer make/model", type: "text", required: false, placeholder: "e.g., HP LaserJet Pro 4001" },
      { id: "connectionType", label: "How is it connected?", type: "radio", required: true, options: [{ value: "usb", label: "USB" }, { value: "wifi", label: "Wi-Fi" }, { value: "ethernet", label: "Ethernet" }, { value: "unsure", label: "Not sure" }] },
    ],
  },
  {
    id: "hardware",
    label: "Hardware / On-Site",
    icon: "hardware",
    description: "Repairs, upgrades, cabling, on-site installations",
    questions: [
      { id: "deviceType", label: "What needs attention?", type: "select", required: true, options: [{ value: "desktop", label: "Desktop computer" }, { value: "laptop", label: "Laptop" }, { value: "server", label: "Server / NAS" }, { value: "network", label: "Router / switch / cabling" }, { value: "monitor", label: "Monitor / peripherals" }, { value: "other", label: "Other hardware" }] },
      { id: "symptoms", label: "What's happening?", type: "textarea", required: true, placeholder: "e.g., Won't power on, broken screen, dead drive, need cables run to new office" },
      { id: "whenStarted", label: "When did it start?", type: "text", required: true, placeholder: "e.g., This morning, after a power outage, planned project" },
      { id: "onsiteNeeded", label: "Does this need an on-site visit?", type: "radio", required: true, options: [{ value: "yes", label: "Yes — must be on-site" }, { value: "no", label: "Not sure — you tell us" }, { value: "remote", label: "Could be done remotely first" }] },
    ],
  },
  {
    id: "business",
    label: "Business IT",
    icon: "briefcase",
    description: "Managed IT, vCIO, strategy, compliance",
    questions: [
      { id: "needType", label: "What type of support?", type: "select", required: true, options: [{ value: "managed", label: "Ongoing managed IT services" }, { value: "project", label: "One-time project (migration, setup, etc.)" }, { value: "helpdesk", label: "Help desk for employees" }, { value: "compliance", label: "Compliance / security audit" }, { value: "strategy", label: "IT strategy / budgeting" }, { value: "other", label: "Other" }] },
      { id: "employeeCount", label: "Number of employees", type: "select", required: true, options: [{ value: "1-5", label: "1–5" }, { value: "6-25", label: "6–25" }, { value: "26-50", label: "26–50" }, { value: "51-100", label: "51–100" }, { value: "100+", label: "100+" }] },
      { id: "currentIt", label: "Current IT situation", type: "radio", required: false, options: [{ value: "none", label: "No dedicated IT" }, { value: "internal", label: "Internal IT person/team" }, { value: "msp", label: "Another MSP" }, { value: "breakfix", label: "Break/fix as needed" }] },
    ],
  },
  {
    id: "other",
    label: "Something Else",
    icon: "help-circle",
    description: "Describe your issue in your own words",
    questions: [
      { id: "description", label: "Describe what you need help with", type: "textarea", required: true, placeholder: "Please describe the issue or service you need..." },
      { id: "urgency", label: "How urgent?", type: "radio", required: true, options: [{ value: "urgent", label: "Urgent — business impact" }, { value: "normal", label: "Normal — within a few days" }, { value: "flexible", label: "Flexible timing" }] },
    ],
  },
];

export function getCategoryQuestions(categoryId: string): HelpQuestion[] {
  const category = helpCategories.find((c) => c.id === categoryId);
  return category?.questions || [];
}

export function getCategoryLabel(categoryId: string): string {
  const category = helpCategories.find((c) => c.id === categoryId);
  return category?.label || categoryId;
}

/**
 * Active-incident detection for the urgency fast lane. Ransomware, suspected
 * breaches, or an explicit "need help now" in Security skip the normal
 * 2-hour queue promise and get a call-now interstitial instead.
 */
const EMERGENCY_ISSUE_TYPES = ["ransomware", "breach"];

export function isEmergencyRequest(categoryId: string | undefined, answers: Record<string, string>): boolean {
  if (categoryId !== "security") return false;
  return answers.urgency === "active" || EMERGENCY_ISSUE_TYPES.includes(answers.issueType);
}

export const STORAGE_KEY = "nessco-help-request";

export interface StoredHelpRequest {
  category?: string;
  answers: Record<string, string>;
  photos?: string[];
  photoNames?: string[];
  /** ISO timestamp of when step 1 was started (fill-time spam trap). */
  startedAt?: string;
  contact: {
    name: string;
    email: string;
    phone: string;
    preferredContact: "call" | "email" | "text";
    preference: "remote" | "onsite" | "either";
    description: string;
    preferredTime?: string;
    honeypot?: string;
  };
  currentStep: number;
}

const LEGACY_SESSION_KEY = "nessco-help-request";
// Drafts survive closed tabs for 7 days, then expire.
const DRAFT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

interface StoredEnvelope {
  savedAt: number;
  data: StoredHelpRequest;
}

function readFrom(store: Pick<Storage, "getItem">, key: string): StoredHelpRequest | null {
  try {
    const raw = store.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Envelope shape { savedAt, data }
    if (parsed && typeof parsed === "object" && "data" in parsed && "savedAt" in parsed) {
      const env = parsed as StoredEnvelope;
      if (Date.now() - env.savedAt > DRAFT_TTL_MS) return null;
      return env.data;
    }
    // Legacy shape (raw StoredHelpRequest, incl. old sessionStorage entries)
    return parsed as StoredHelpRequest;
  } catch {
    return null;
  }
}

export function getStoredData(): StoredHelpRequest | null {
  if (typeof window === "undefined") return null;
  // Prefer the durable localStorage draft, fall back to legacy session data
  // (and migrate it forward so old in-progress flows keep working).
  try {
    const durable = readFrom(localStorage, STORAGE_KEY);
    if (durable) return durable;
  } catch {
    // localStorage unavailable (private mode) — fall through to session.
  }
  try {
    const legacy = readFrom(sessionStorage, LEGACY_SESSION_KEY);
    if (legacy) {
      try {
        saveStoredData(legacy);
      } catch {
        // ignore migration failures
      }
      return legacy;
    }
  } catch {
    // ignore
  }
  return null;
}

export function saveStoredData(data: StoredHelpRequest): void {
  if (typeof window === "undefined") return;
  const envelope: StoredEnvelope = { savedAt: Date.now(), data };
  const raw = JSON.stringify(envelope);
  try {
    localStorage.setItem(STORAGE_KEY, raw);
  } catch {
    // Storage full (large photo dataURLs) — retry without photos so the
    // text answers are never lost.
    try {
      const slim: StoredEnvelope = {
        savedAt: Date.now(),
        data: { ...data, photos: [], photoNames: [] },
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(slim));
    } catch {
      // ignore — form still works in-memory
    }
  }
  // Keep a session mirror so the flow works even where localStorage is blocked.
  try {
    sessionStorage.setItem(LEGACY_SESSION_KEY, raw);
  } catch {
    // ignore
  }
}

export function clearStoredData(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  try {
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
  } catch {
    // ignore
  }
}