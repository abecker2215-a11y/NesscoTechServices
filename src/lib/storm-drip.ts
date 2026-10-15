import { stormVerdict } from "./storm-report";
import { siteConfig } from "./config";

/**
 * Storm-report follow-up drip. Step 0 (the report itself) sends inline at
 * capture; steps 1–3 go out via /api/cron/storm-drip (hit it daily from any
 * scheduler — Vercel Cron, cron-job.org, or a container cron — with
 * ?secret=$CRON_SECRET).
 */

export interface DripStep {
  step: number;
  /** Days after capture. */
  dayOffset: number;
  subject: (p: { name?: string; score: number }) => string;
  body: (p: { name?: string; score: number; reportUrl: string; unsubscribeUrl: string }) => string;
}

const firstName = (name?: string) => (name?.trim() ? ` ${name.trim().split(" ")[0]}` : "");

export const stormDripSteps: DripStep[] = [
  {
    step: 1,
    dayOffset: 2,
    subject: ({ score }) => `Your ${score}/100 storm score + the 10-minute fix`,
    body: ({ name, score, reportUrl }) =>
      [
        `Hi${firstName(name)},`,
        "",
        `Two days ago you scored ${score}/100 on the storm-readiness check. The single highest-leverage fix:`,
        "",
        "Run the 10-minute backup checklist — it covers the #1 killer (untested backups):",
        `https://${siteConfig.domain}/guides/backup-checklist-small-business`,
        "",
        `Your full report is still here: ${reportUrl}`,
        "",
        `Rather have us handle it? https://${siteConfig.domain}/get-help — 2 minutes, reply within 2 business hours.`,
        "",
        `— ${siteConfig.name} · ${siteConfig.phone}`,
      ].join("\n"),
  },
  {
    step: 2,
    dayOffset: 5,
    subject: () => "The outage that costs Tampa businesses a workday",
    body: ({ name, score, reportUrl }) => {
      const v = stormVerdict(score);
      const pitch =
        v.key === "exposed"
          ? "For most homes and small offices, a proper backup setup is one visit — and it's the difference between 'annoying weekend' and 'everything is gone.'"
          : v.key === "gaps"
            ? "Your remaining gaps are mostly 1–2 remote hours ($75/hr). We confirm the exact scope before any work — no charges until you approve."
            : "You're in great shape. The thing that protects it: a monthly restore test. Our Managed plan ($349/mo) runs it for you, plus monitoring and patching.";
      return [
        `Hi${firstName(name)},`,
        "",
        `Quick follow-up on your ${score}/100 storm score (${v.title})`,
        "",
        pitch,
        "",
        `Report refresher: ${reportUrl}`,
        `Start here when ready: https://${siteConfig.domain}/get-help`,
        "",
        `— ${siteConfig.name} · ${siteConfig.phone}`,
      ].join("\n");
    },
  },
  {
    step: 3,
    dayOffset: 9,
    subject: () => "Last nudge on storm season (then I'll stop)",
    body: ({ name }) =>
      [
        `Hi${firstName(name)},`,
        "",
        "Last email on this — hurricane season doesn't negotiate, and I'd rather you be covered than lucky.",
        "",
        "Two options, both take under 2 minutes:",
        `1. Fix-my-gaps request: https://${siteConfig.domain}/get-help?category=other`,
        `2. Call us: ${siteConfig.phone} (Mon–Fri 8am–6pm ET)`,
        "",
        "Either way, save our number in your phone. Monday-morning panics go badly without a plan.",
        "",
        `— ${siteConfig.name}`,
      ].join("\n"),
  },
];

export function dripFooter(unsubscribeUrl: string): string {
  return `\n\n—\nUnsubscribe anytime: ${unsubscribeUrl}`;
}
