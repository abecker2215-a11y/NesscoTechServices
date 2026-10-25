export interface BlogArticle {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  body: string;
  image?: string;
  serviceSlug?: string;
}

export const blogArticles: BlogArticle[] = [
  {
    slug: "7-signs-your-business-needs-managed-it",
    title: "7 Signs Your Tampa Business Needs Managed IT",
    excerpt:
      "Frequent downtime, spiraling IT costs, and security worries — here's when to stop DIY-ing your technology and delegate to a local MSP.",
    date: "Oct 2026",
    author: "Nessco Tech Services",
    category: "Business IT",
    readTime: "6 min read",
    body: `
IT is not your core business — but when it breaks, everything stops. For most Tampa Bay small businesses, the breaking point arrives gradually: one too many malware warnings, one extended outage, one invoice from a random technician that doubles your monthly IT spend.

Here are seven signs it is time to move from break-fix to managed IT.

1. Your team spends more time fixing computers than running the business
2. You do not know when backups last ran — or if they would actually restore
3. Microsoft 365 security incidents keep showing up in your inbox
4. Onboarding a new hire takes a full day of setup and troubleshooting
5. You are paying for every emergency call at full price with no strategy
6. Your hardware refresh cycle is reactive instead of planned
7. You do not have an incident response plan for ransomware or outages

Managed IT replaces that unpredictability with flat monthly pricing, proactive monitoring, security management, and a technology partner who understands your business.

If more than one sign above sounds familiar, book a 15-minute intro call.
`,
    serviceSlug: "managed-it-services",
  },
  {
    slug: "mfa-small-business-security",
    title: "MFA: The 10-Minute Security Upgrade That Stops 99% of Attacks",
    excerpt:
      "Most breaches start with a stolen password. Here's how to lock down your Microsoft 365 or Google Workspace in minutes without disrupting your team.",
    date: "Sep 2026",
    author: "Nessco Tech Services",
    category: "Security",
    readTime: "4 min read",
    body: `
Multi-factor authentication (MFA) blocks nearly all password-based break-ins because even if an attacker steals credentials, they still cannot log in without a second factor.

For Tampa small businesses, the biggest risk is usually a Microsoft 365 or Google Workspace account compromise — often through phishing or password reuse on unrelated sites.

Setting up MFA is fast:

1. Enable security defaults in Microsoft 365 or enforce 2-step verification in Google Workspace
2. Use an authenticator app (Microsoft Authenticator, Google Authenticator) rather than SMS — SIM swapping defeats text-message codes
3. Enroll every user, starting with administrators and finance staff
4. Register backup methods so a lost phone does not lock out your entire company
5. Add Conditional Access policies if you have Microsoft 365 Business Premium

Passkeys go a step further by removing passwords entirely for supported accounts. They are phishing-resistant because there is no code to intercept and no password to steal.

If you have not enabled MFA on every business email account today, start now. It is the single most effective security control you can deploy in under an hour.
`,
    serviceSlug: "it-security/endpoint-security",
  },
  {
    slug: "backup-checklist-small-business",
    title: "5 Backup Mistakes That Give Tampa Businesses a False Sense of Security",
    excerpt:
      "You have backups — but would they actually work when you need them? Here's how to test without the panic.",
    date: "Sep 2026",
    author: "Nessco Tech Services",
    category: "Data Protection",
    readTime: "5 min read",
    body: `
Most Tampa small businesses believe their data is backed up. The reality is that many backups are configured once and never verified — which means they fail at exactly the moment you need them.

Five common backup mistakes:

1. No test restores. Running a backup job is not the same as recovering data. A monthly test restore is the only proof your backups work.
2. Single copy on one device. A local USB drive or on-site server backup disappears in a fire, flood, or ransomware attack that also destroys the source data.
3. No offline or immutable copy. Ransomware encrypts connected backup drives too. You need at least one offline or air-gapped copy.
4. Backups without monitoring. A failed backup job sends no alert when nobody checks the dashboard. You discover the failure only after data loss.
5. Microsoft 365 data is not backed up. Microsoft does not back up your email, OneDrive, or SharePoint for recovery beyond short windows. You need a dedicated M365 backup.

A 3-2-1 strategy is a good starting point: three copies of data, on two different media types, with one copy off-site or in the cloud.

If you have not tested a restore in the last 30 days, your backup plan has a gap.
`,
    serviceSlug: "backup-disaster-recovery/backup",
  },
];

export function getArticle(slug: string): BlogArticle | undefined {
  return blogArticles.find((a) => a.slug === slug);
}

export function getAllArticles(): BlogArticle[] {
  return [...blogArticles];
}
