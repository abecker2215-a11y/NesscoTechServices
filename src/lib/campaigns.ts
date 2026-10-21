export interface Campaign {
  slug: string;
  season: string;
  title: string;
  excerpt: string;
  pitch: string;
  checklist: { heading: string; body: string }[];
  /** Optional related guide slug for deeper reading. */
  guideSlug?: string;
  guideLabel?: string;
  helpCategory: string;
  cta: string;
  /**
   * Annual live window (month/day, 1-indexed month). The campaign is "live"
   * when today falls in [start, end]. Omitted = evergreen.
   */
  liveFrom?: { month: number; day: number };
  liveUntil?: { month: number; day: number };
}

/**
 * Seasonal campaign template data. One template (`/offers/[slug]`), one new
 * traffic spike per season. Add next year's dates here — no code changes.
 */
export const campaigns: Campaign[] = [
  {
    slug: "cybersecurity-awareness",
    season: "October",
    title: "Cybersecurity Awareness Month",
    excerpt: "October is Cybersecurity Awareness Month - the perfect time to harden your business against threats.",
    pitch:
      "Ransomware, phishing, and credential theft spike every Q4. Most breaches start with a single click. A focused assessment now prevents 6-figure incidents later.",
    checklist: [
      { heading: "Phishing simulation + training", body: "We run a safe simulated campaign and deliver targeted 5-min training for clickers." },
      { heading: "MFA everywhere", body: "Enforce MFA on email, VPN, and critical SaaS - the #1 defense against credential theft." },
      { heading: "Dark web scan", body: "We scan for compromised credentials on the dark web and rotate anything exposed." },
{ heading: "Incident response drill", body: "Tabletop exercise so your team knows exactly what to do when (not if) an incident occurs." },
      ],
    guideSlug: "spot-stop-phishing-emails",
    guideLabel: "Phishing spotting guide",
    helpCategory: "security",
    cta: "Book a security assessment",
    liveFrom: { month: 10, day: 1 },
    liveUntil: { month: 10, day: 31 },
  },
  {
    slug: "year-end-tech-audit",
    season: "November",
    title: "Year-End IT Health Check",
    excerpt: "Before budget season, know exactly where your IT stands - gaps, risks, and opportunities.",
    pitch:
      "Year-end is the perfect time for a comprehensive IT audit. We review security posture, backup integrity, license utilization, and infrastructure health. You get a prioritized roadmap for next year.",
    checklist: [
      { heading: "Security posture review", body: "MFA coverage, EDR status, patch compliance, dark web scan for leaked credentials." },
      { heading: "Backup integrity test", body: "We run a live restore test - the only way to know your backups actually work." },
      { heading: "License audit", body: "Find unused M365 licenses, redundant SaaS subscriptions, and shadow IT." },
{ heading: "Infrastructure health check", body: "Server health, backup integrity, network performance, warranty status." },
      ],
    guideSlug: "backup-checklist-small-business",
    guideLabel: "Monthly backup check guide",
    helpCategory: "security",
    cta: "Schedule your IT audit",
    liveFrom: { month: 11, day: 1 },
    liveUntil: { month: 12, day: 31 },
  },
  {
    slug: "q1-planning",
    season: "January",
    title: "Q1 IT Strategy & Budget Planning",
    excerpt: "Start the year with a clear IT roadmap and budget - no surprises.",
    pitch:
      "January is the ideal time to align IT with business goals. We help you build a realistic budget, plan migrations/upgrades, and set measurable IT objectives for the year.",
    checklist: [
      { heading: "Budget optimization", body: "Identify waste (unused licenses, redundant tools), right-size contracts." },
      { heading: "Project roadmap", body: "Prioritize initiatives - M365 migration, security upgrades, infrastructure refresh." },
      { heading: "Compliance check", body: "HIPAA, PCI, SOC 2 - where you stand and what's needed for your industry." },
      { heading: "Staffing & vendor review", body: "Internal IT vs. MSP balance, vendor contract renewals, SLA review." },
    ],
    guideSlug: "m365-license-cleanup",
    guideLabel: "M365 license audit guide",
    helpCategory: "business",
    cta: "Start Q1 planning",
    liveFrom: { month: 1, day: 1 },
    liveUntil: { month: 3, day: 31 },
  },
];

export function getCampaign(slug: string): Campaign | undefined {
  return campaigns.find((c) => c.slug === slug);
}

function dayOfYear(month: number, day: number): number {
  const days = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let n = day;
  for (let m = 1; m < month; m++) n += days[m - 1];
  return n;
}

/** Is this campaign live right now (annual window)? No window = evergreen. */
export function isCampaignLive(c: Campaign, at = new Date()): boolean {
  if (!c.liveFrom || !c.liveUntil) return true;
  const today = dayOfYear(at.getMonth() + 1, at.getDate());
  const from = dayOfYear(c.liveFrom.month, c.liveFrom.day);
  const until = dayOfYear(c.liveUntil.month, c.liveUntil.day);
  return from <= until ? today >= from && today <= until : today >= from || today <= until;
}

/** Live campaigns first, then upcoming by days-until-start. */
export function getCampaignsNow(at = new Date()): { campaign: Campaign; live: boolean; daysLeft?: number; startsInDays?: number }[] {
  const today = dayOfYear(at.getMonth() + 1, at.getDate());
  return campaigns
    .map((campaign) => {
      const live = isCampaignLive(campaign, at);
      if (live && campaign.liveUntil) {
        const until = dayOfYear(campaign.liveUntil.month, campaign.liveUntil.day);
        const daysLeft = until >= today ? until - today : 365 - today + until;
        return { campaign, live, daysLeft };
      }
      if (!live && campaign.liveFrom) {
        const from = dayOfYear(campaign.liveFrom.month, campaign.liveFrom.day);
        const startsInDays = from >= today ? from - today : 365 - today + from;
        return { campaign, live, startsInDays };
      }
      return { campaign, live };
    })
    .sort((a, b) => Number(b.live) - Number(a.live) || (a.startsInDays ?? 999) - (b.startsInDays ?? 999));
}
