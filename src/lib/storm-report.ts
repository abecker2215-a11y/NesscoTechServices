/**
 * Storm-readiness scoring — single source of truth shared by the quiz,
 * the PDF report, the report email, and the printable report page.
 */

export interface StormOption {
  label: string;
  score: number;
}

export interface StormQuestion {
  id: string;
  q: string;
  options: StormOption[];
  /** Fix recommendation per answer tier: low (0), mid (partial), full (20). */
  fixes: { low: string; mid: string; full: string };
}

export const stormQuestions: StormQuestion[] = [
  {
    id: "auto",
    q: "Do your important files back up automatically?",
    options: [
      { label: "Yes, daily and automatic", score: 20 },
      { label: "Sometimes — I copy things manually", score: 8 },
      { label: "No / not sure", score: 0 },
    ],
    fixes: {
      low: "Set up automated daily backups (cloud or NAS). Usually one remote hour.",
      mid: "Replace manual copies with a scheduled job + monthly restore test.",
      full: "Keep the monthly restore test on the calendar — you're covered.",
    },
  },
  {
    id: "offsite",
    q: "Is at least one copy off-site or in the cloud?",
    options: [
      { label: "Yes — cloud or rotated off-site drive", score: 20 },
      { label: "External drive plugged into the same PC", score: 5 },
      { label: "No / not sure", score: 0 },
    ],
    fixes: {
      low: "Add an off-site copy — cloud backup or a rotated drive stored elsewhere.",
      mid: "A drive plugged into the same PC dies with the PC. Move one copy off-site.",
      full: "Off-site copy confirmed — the 3-2-1 rule is satisfied.",
    },
  },
  {
    id: "restore",
    q: "Have you successfully restored a file in the last 3 months?",
    options: [
      { label: "Yes, tested and it worked", score: 20 },
      { label: "Never tried", score: 0 },
      { label: "Tried and it failed", score: 0 },
    ],
    fixes: {
      low: "Run a test restore this week — untested backups are guesses, not backups.",
      mid: "Run a test restore this week — untested backups are guesses, not backups.",
      full: "Tested restores — keep the quarterly cadence.",
    },
  },
  {
    id: "power",
    q: "Is key gear (PC, router, NAS) on a surge protector or UPS?",
    options: [
      { label: "Yes, UPS on the important stuff", score: 20 },
      { label: "Power strips only", score: 8 },
      { label: "Straight into the wall", score: 0 },
    ],
    fixes: {
      low: "Put the PC, router, and NAS on a UPS ($80–150 at any office store) — Tampa surges kill straight-to-wall gear.",
      mid: "Power strips don't stop surges. Upgrade the important gear to a UPS.",
      full: "UPS coverage confirmed — surge season handled.",
    },
  },
  {
    id: "plan",
    q: "If everything died Monday morning, do you know exactly who to call?",
    options: [
      { label: "Yes — that's us, saved in my phone", score: 20 },
      { label: "Sort of — I'd Google around", score: 8 },
      { label: "No plan", score: 0 },
    ],
    fixes: {
      low: "Save our number in your phone now — Monday-morning panics go badly without a plan.",
      mid: "Googling during an outage wastes the golden hour. Save our number in your phone.",
      full: "Response plan confirmed — you're first in queue when it counts.",
    },
  },
];

export type StormVerdict = "ready" | "gaps" | "exposed";

export function stormVerdict(score: number): {
  key: StormVerdict;
  title: string;
  body: string;
} {
  if (score >= 80)
    return {
      key: "ready",
      title: "Storm-ready.",
      body: "Your setup would survive a surge, a dead drive, or a week without power. Keep the monthly restore test on the calendar.",
    };
  if (score >= 40)
    return {
      key: "gaps",
      title: "Gaps to close.",
      body: "One bad weekend could still cost you files or a workday. The fixes below are mostly 1–2 remote hours.",
    };
  return {
    key: "exposed",
    title: "Exposed.",
    body: "A single surge or ransomware hit could take everything. Good news: a proper backup setup is usually one visit.",
  };
}

export interface StormAnswer {
  score: number;
  label: string;
}

export function fixFor(questionId: string, score: number): string {
  const q = stormQuestions.find((x) => x.id === questionId);
  if (!q) return "";
  if (score >= 20) return q.fixes.full;
  if (score > 0) return q.fixes.mid;
  return q.fixes.low;
}

export function questionById(id: string): StormQuestion | undefined {
  return stormQuestions.find((x) => x.id === id);
}
