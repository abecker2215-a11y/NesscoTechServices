/**
 * Re-slot existing posts into the six categories added for the backfill.
 *
 *   npx tsx --env-file=.env prisma/reslot-blog-categories.ts
 *
 * Explicit slug -> category mapping so the move is reviewable. Posts keep
 * their slug and URL; only the category chip changes. Idempotent.
 */
import { prisma } from "../src/lib/prisma";

const MOVES: Record<string, string> = {
  // Compliance & Audit
  "new-article-19": "compliance-audit",
  "new-article-20": "compliance-audit",
  "restaurant-pos-pci-multi-location": "compliance-audit",
  "soc-2-readiness-small-business": "compliance-audit",
  "cmmc-tampa-defense-contractors": "compliance-audit",
  "florida-data-breach-notification": "compliance-audit",
  "ftc-safeguards-rule": "compliance-audit",
  "nist-csf-small-business": "compliance-audit",
  "ccpa-cpra-small-business": "compliance-audit",
  "glba-safeguards": "compliance-audit",
  "gdpr-small-business": "compliance-audit",
  "iso-27001-small-business": "compliance-audit",
  "cis-controls-implementation-order": "compliance-audit",
  "ada-website-accessibility": "compliance-audit",
  "it-audit-preparation": "compliance-audit",
  "compliance-calendar": "compliance-audit",

  // Microsoft 365
  "microsoft-365-security-tampa": "microsoft-365",
  "microsoft-365-retention-deletion-policy": "microsoft-365",
  "conditional-access-small-business": "microsoft-365",
  "microsoft-365-license-audit": "microsoft-365",
  "sharepoint-migration-tampa-bay": "microsoft-365",
  "microsoft-purview-sensitivity-labels": "microsoft-365",
  "azure-ad-connect-hybrid-identity": "microsoft-365",
  "entra-id-p1-vs-p2": "microsoft-365",
  "identity-governance-access-reviews": "microsoft-365",
  "windows-365-cloud-pc": "microsoft-365",
  "microsoft-copilot-small-business": "microsoft-365",
  "intune-autopilot-zero-touch": "microsoft-365",
  "microsoft-defender-for-business": "microsoft-365",
  "sharepoint-communication-sites": "microsoft-365",
  "sharepoint-permissions-audit": "microsoft-365",
  "sharepoint-onedrive-teams-files": "microsoft-365",
  "microsoft-lists-vs-excel": "microsoft-365",
  "microsoft-365-migration-checklist": "microsoft-365",
  "google-workspace-to-microsoft-365": "microsoft-365",
  "loop-and-whiteboard": "microsoft-365",
  "mdm-vs-mam": "microsoft-365",
  "microsoft-teams-setup-tampa-bay": "microsoft-365",
  "viva-engage-internal-comms": "microsoft-365",
  "teams-town-hall-live-events": "microsoft-365",
  "teams-rooms-huddle-spaces": "microsoft-365",
  "power-apps-business": "microsoft-365",

  // Remote & Hybrid Work
  "vpn-setup-small-business": "remote-hybrid-work",
  "hybrid-work-it-policy": "remote-hybrid-work",
  "secure-remote-access-tampa-bay": "remote-hybrid-work",

  // Hardware & Devices
  "it-asset-inventory": "hardware-devices",
  "warranty-tracking-asset-lifecycle": "hardware-devices",
  "lease-vs-buy-office-technology": "hardware-devices",
  "hidden-cost-aging-hardware": "hardware-devices",

  // Cost & Budgeting
  "it-capital-vs-operating-expense": "cost-budgeting",
  "it-cost-per-employee": "cost-budgeting",
  "it-budget-forecasting": "cost-budgeting",
  "chargeback-showback-it": "cost-budgeting",
  "telecom-expense-management": "cost-budgeting",
  "telecom-copier-contract-review": "cost-budgeting",
  "cloud-cost-tagging": "cost-budgeting",
  "cloud-backup-cost-modelling": "cost-budgeting",
  "downtime-cost-calculation": "cost-budgeting",

  // AI & Automation
  "chatbots-small-business": "ai-automation",
};

async function main() {
  const categories = await prisma.category.findMany({
    select: { id: true, slug: true, name: true },
  });
  const bySlug = new Map(categories.map((c) => [c.slug, c.id]));

  const before = await prisma.category.findMany({
    select: { name: true, _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  let moved = 0;
  const missing: string[] = [];

  for (const [postSlug, categorySlug] of Object.entries(MOVES)) {
    const categoryId = bySlug.get(categorySlug);
    if (!categoryId) {
      missing.push(`${postSlug} -> unknown category ${categorySlug}`);
      continue;
    }
    const result = await prisma.post.updateMany({
      where: { slug: postSlug },
      data: { categoryId },
    });
    if (result.count === 0) missing.push(`unknown post ${postSlug}`);
    else moved += result.count;
  }

  const after = await prisma.category.findMany({
    select: { name: true, _count: { select: { posts: true } } },
    orderBy: { name: "asc" },
  });

  console.log("Category            Before  After");
  for (const row of after) {
    const prev = before.find((b) => b.name === row.name)?._count.posts ?? 0;
    console.log(
      `${row.name.padEnd(20)}${String(prev).padStart(6)}${String(
        row._count.posts
      ).padStart(7)}`
    );
  }

  if (missing.length) {
    console.error("\nUnresolved slugs:");
    for (const m of missing) console.error(`  - ${m}`);
    process.exit(1);
  }

  console.log(`\nMoved ${moved} posts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());