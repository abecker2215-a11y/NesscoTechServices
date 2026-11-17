/**
 * Create the six categories added for the 2023-2024 blog backfill.
 *
 *   npx tsx prisma/add-blog-categories.ts
 *
 * Idempotent: upserts by slug, so re-running is safe. Run this before
 * assigning any backfilled post to a new category, because the admin editor
 * only offers categories that already exist in the database.
 */
import { prisma } from "../src/lib/prisma";

const NEW_CATEGORIES = [
  {
    slug: "compliance-audit",
    name: "Compliance & Audit",
    description:
      "Obligations and audit work for small business: HIPAA, PCI DSS, SOC 2, CMMC, NIST, GLBA, state breach laws.",
  },
  {
    slug: "microsoft-365",
    name: "Microsoft 365",
    description:
      "Configuration and operation of Microsoft 365: identity, email, Teams, SharePoint, Intune, licensing.",
  },
  {
    slug: "remote-hybrid-work",
    name: "Remote & Hybrid Work",
    description:
      "Access, devices, and policy for staff working outside the office, including contractors and distributed teams.",
  },
  {
    slug: "hardware-devices",
    name: "Hardware & Devices",
    description:
      "Buying, configuring, maintaining, and retiring the physical equipment a business depends on.",
  },
  {
    slug: "cost-budgeting",
    name: "Cost & Budgeting",
    description:
      "IT spend, business cases, contract terms, and the numbers behind technology decisions.",
  },
  {
    slug: "ai-automation",
    name: "AI & Automation",
    description:
      "Using AI and workflow automation in a small business: policy, risk, tooling, and evaluation.",
  },
];

async function main() {
  for (const category of NEW_CATEGORIES) {
    const saved = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, description: category.description },
      create: category,
    });
    console.log(`${saved.slug} -> ${saved.name}`);
  }
  const total = await prisma.category.count();
  console.log(`\nCategories in database: ${total}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());