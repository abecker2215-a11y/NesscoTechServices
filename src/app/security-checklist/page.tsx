import { Metadata } from "next";
import { SecurityChecklist } from "@/components/security-checklist/SecurityChecklist";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";

export const metadata: Metadata = {
  title: pageTitle("Free Small Business IT Security Checklist"),
  description: metaDescription("Download the free small business IT security checklist — 9 critical controls covering MFA, email security, backups, endpoint protection, and staff training."),
  alternates: { canonical: "https://nesscotech.com/security-checklist" },
  openGraph: {
    title: pageTitle("Free Small Business IT Security Checklist"),
    description: metaDescription("A free 9-point IT security checklist for small businesses. See the controls you need, then get the full downloadable version."),
    url: "https://nesscotech.com/security-checklist",
    type: "website",
  },
};

export default function SecurityChecklistPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "IT Security Checklist", path: "/security-checklist" },
      ])} />
      <SecurityChecklist />
    </>
  );
}