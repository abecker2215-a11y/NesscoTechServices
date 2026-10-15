import { guides } from "./guides";

export interface ChatLink {
  label: string;
  href: string;
}

export interface ChatEntry {
  id: string;
  keywords: string[];
  title: string;
  answer: string;
  links: ChatLink[];
}

/**
 * Local knowledge base for the Ask Nessco widget. Rule-based on purpose:
 * zero API keys, works offline, answers are always on-brand and always
 * end in a deep link (service, guide, or prefilled get-help).
 */
export const chatEntries: ChatEntry[] = [
  {
    id: "wifi",
    keywords: ["wifi", "wi-fi", "wireless", "internet", "slow", "buffering", "dead zone", "deadzone", "router", "mesh", "signal", "drops", "dropping", "speed"],
    title: "Slow Wi-Fi / dead zones",
    answer:
      "Most Tampa slowdowns are placement or interference, not your plan. Try: restart modem→router in order, move the router chest-high and central, and test wired vs wireless. If wired is fast but rooms still drop, you likely need mesh.",
    links: [
      { label: "Read the 15-min Wi-Fi fix guide", href: "/guides/fix-slow-wifi-tampa" },
      { label: "Wi-Fi & Networking service", href: "/services/network-server/wireless" },
      { label: "Start a Wi-Fi request", href: "/get-help?category=wifi" },
    ],
  },
  {
    id: "computer",
    keywords: ["computer", "pc", "laptop", "server", "workstation", "slow", "crash", "crashed", "blue screen", "bluescreen", "won't start", "wont start", "boot", "freeze", "frozen", "overheat", "noisy", "virus"],
    title: "Workstations & Servers",
    answer:
      "Software issues (slow, crashes, errors) can usually be fixed remotely from $75 while you watch. Hardware (won't power on, broken screen, dead drive, RAID failure) needs on-site from $125. Tell us the symptoms and we'll route it right.",
    links: [
      { label: "Workstation & Server Repair", href: "/services/it-support/pc-mac" },
      { label: "Start a server/workstation request", href: "/get-help?category=computer" },
    ],
  },
  {
    id: "email",
    keywords: ["email", "outlook", "sync", "syncing", "spam", "phishing", "inbox", "send", "receive", "gmail", "mail"],
    title: "Email problems",
    answer:
      "Can't send, can't receive, or stuck syncing? Check webmail first — if mail works there, it's the app setup, fixable remotely in under an hour. Mail going to spam usually means SPF/DKIM/DMARC records need fixing.",
    links: [
      { label: "Email Problems service", href: "/services/communications/business-email" },
      { label: "Start an email request", href: "/get-help?category=email" },
    ],
  },
{
    id: "m365",
    keywords: ["microsoft", "365", "m365", "office", "teams", "sharepoint", "onedrive", "migrate", "migration", "license", "mfa", "authenticator", "godaddy", "google workspace", "exchange", "azure ad", "intune", "intune", "defender", "defender for business"],
    title: "Microsoft 365 & Azure",
    answer:
      "We do 365 setup, migrations (Google, GoDaddy, on-prem Exchange), license cleanup, MFA/CA lockdowns, Intune enrollment, and Defender for Business. Most small teams are migrated over a weekend with zero Monday downtime. Start with MFA - it blocks nearly all password break-ins.",
    links: [
      { label: "Turn on MFA guide (10 min)", href: "/guides/turn-on-mfa-microsoft-365" },
      { label: "Microsoft 365 service", href: "/services/cloud-solutions/microsoft-365" },
      { label: "Start a 365 request", href: "/get-help?category=m365" },
    ],
  },
  {
    id: "security",
    keywords: ["virus", "malware", "ransomware", "hacked", "hack", "scam", "popup", "pop-up", "suspicious", "breach", "phish", "antivirus", "security"],
    title: "Virus & security",
    answer:
      "If you see ransom notes, encrypted files, or unknown sign-ins — stop and call now, don't keep using the machine. For pop-up scams: don't call the number on screen. Remote cleanup starts at $75.",
    links: [
      { label: "Security Cleanup service", href: "/services/it-security" },
      { label: "Start a security request", href: "/get-help?category=security" },
    ],
  },
  {
    id: "backup",
    keywords: ["backup", "back up", "restore", "lost files", "deleted", "recovery", "3-2-1", "cloud backup", "external drive", "dr", "disaster recovery", "rto", "rpo"],
    title: "Backups & Disaster Recovery",
    answer:
      "Run the 10-minute check: confirm last night's backup actually completed, verify 3-2-1 (3 copies, 2 media, 1 off-site), and restore one random file. If any step fails, your backups are hope, not protection. We set up immutable, encrypted, tested backups with RTO/RPO targets.",
    links: [
      { label: "Backup checklist for SMBs", href: "/guides/backup-checklist-small-business" },
      { label: "Data Backup & DR service", href: "/services/backup-disaster-recovery" },
      { label: "Start a backup/DR request", href: "/get-help?category=other" },
    ],
  },
{
    id: "business",
    keywords: ["business", "office", "managed", "monthly", "plan", "plans", "help desk", "helpdesk", "employees", "company", "msp", "contract", "vcio", "compliance", "msp", "managed services", "it support", "it management", "it strategy"],
    title: "Business IT & Managed Services",
    answer:
      "We run IT for companies with 5-100 staff: 24/7 monitoring, patching, help desk, EDR, cloud backups, M365 admin, vCIO strategy, and compliance (HIPAA, PCI, SOC 2, CMMC). Plans: Essentials $149/mo, Managed $349/mo, Complete $599/mo. Month-to-month, 30-day cancellation, 10% non-profit discount.",
    links: [
      { label: "Compare plans with calculator", href: "/pricing" },
      { label: "Business IT service", href: "/services/managed-it-services" },
      { label: "Start a business request", href: "/get-help?category=business" },
    ],
  },
  {
    id: "remote",
    keywords: ["remote", "remote support", "screen share", "teamviewer", "anydesk", "watch", "secure remote"],
    title: "Remote support",
    answer:
      "Secure encrypted sessions you control and watch — most software issues fixed same-day from $75/hr. No fix, no fee if remote can't resolve it.",
    links: [
      { label: "Remote Support service", href: "/services/it-support" },
      { label: "Request remote help", href: "/get-help?category=computer&type=remote" },
    ],
  },
  {
    id: "printer",
    keywords: ["printer", "print", "printing", "scanner", "scan", "paper jam", "offline printer", "hp", "canon", "brother"],
    title: "Printer problems",
    answer:
      "Printer showing offline? Restart printer→router→computer in that order, then remove and re-add it in Settings. Network printers that vanish after updates usually need a driver reinstall — 30 minutes remotely.",
    links: [
      { label: "Start a printer request", href: "/get-help?category=printer" },
      { label: "Remote help ($75/hr)", href: "/services/it-support" },
    ],
  },
  {
    id: "hardware",
    keywords: ["hardware", "screen", "cracked", "broken", "cable", "cabling", "ethernet", "rack", "server", "nas", "install", "on-site", "onsite", "come out", "visit"],
    title: "Hardware / on-site",
    answer:
      "Broken screens, dead machines, cable runs, rack and access-point installs — that's on-site work from $125/hr across Tampa Bay. Tell us the device and symptoms and we'll quote the visit upfront.",
    links: [
      { label: "Network Installation service", href: "/services/network-server/infrastructure" },
      { label: "Schedule on-site", href: "/get-help?category=hardware" },
    ],
  },
  {
    id: "pricing",
    keywords: ["price", "pricing", "cost", "how much", "charge", "rate", "rates", "$", "expensive", "quote", "estimate"],
    title: "Pricing",
    answer:
      "Remote $75/hr, on-site $125/hr — you approve every estimate before work starts. Business plans: Essentials $149, Managed $349, Complete $599/mo. Use the instant estimator, no email required.",
    links: [
      { label: "Instant price estimate", href: "/pricing" },
      { label: "Start a request", href: "/get-help" },
    ],
  },
  {
    id: "booking",
    keywords: ["book", "schedule", "appointment", "call", "talk", "callback", "meet", "time", "when"],
    title: "Book / talk to us",
    answer:
      "Fastest path: start a 2-minute service request and we reply within 2 business hours (Mon–Fri 8am–6pm). Prefer to talk? Book a 15-min intro on the contact page.",
    links: [
      { label: "Start a service request", href: "/get-help" },
      { label: "Contact + booking", href: "/contact" },
    ],
  },
  {
    id: "hours",
    keywords: ["hours", "open", "weekend", "sunday", "saturday", "night", "after hours", "emergency", "urgent", "holiday"],
    title: "Hours & emergencies",
    answer:
      "We're open Mon–Fri 8am–6pm ET with ~2hr response. Active security incidents (ransomware, breach) get a call-now fast lane in the get-help flow. Managed clients get after-hours emergency support.",
    links: [
      { label: "Start an urgent request", href: "/get-help?category=security" },
      { label: "Contact us", href: "/contact" },
    ],
  },
  {
    id: "area",
    keywords: ["where", "area", "serve", "tampa", "st pete", "saint petersburg", "clearwater", "brandon", "riverview", "lakeland", "wesley chapel", "plant city", "lutz", "valrico", "largo", "dunedin", "sarasota", "bradenton", "winter haven", "new port richey", "palm harbor", "tarpon", "zephyrhills", "apollo beach", "ruskin", "seffner", "safety harbor", "seminole", "trinity", "temple terrace", "pinellas park", "sun city", "spring hill", "brooksville", "dade city", "bartow", "land o", "gulfport", "venice", "villages", "carrollwood", "oldsmar", "parrish", "palmetto", "davenport", "haines", "north port", "holiday", "hudson", "ocala", "port charlotte", "punta gorda", "location", "come to", "near me"],
    title: "Service area",
    answer:
      "On-site across 56 Tampa Bay cities — from Wesley Chapel to Sarasota, detailed on each city page — plus remote support anywhere with internet. Tell me your city and I'll point you to local scheduling notes.",
    links: [
      { label: "IT Support in Tampa", href: "/it-support-tampa" },
      { label: "All services", href: "/services" },
    ],
  },
  {
    id: "diy",
    keywords: ["diy", "myself", "guide", "how to", "tutorial", "fix it myself", "try first", "glossary", "what is", "what does", "mean"],
    title: "DIY guides",
    answer:
      "Try it yourself first — our Fix-It Guides tell you honestly when you don't need us, and exactly when to call. Start with Wi-Fi, MFA, or the backup checklist.",
    links: [
      ...guides.slice(0, 3).map((g) => ({ label: g.title.split(/[—:(]/)[0].trim(), href: `/guides/${g.slug}` })),
      { label: "All guides", href: "/guides" },
    ],
  },
];

export interface ChatAnswer {
  entry: ChatEntry | null;
  greeting: boolean;
}

export const chatChips = [
  "Wi-Fi is slow",
  "Email not syncing",
  "Virus alert",
  "How much does it cost?",
  "Book a call",
];
