import { Metadata } from "next";
import Link from "next/link";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { FAQItem } from "@/lib/types";

const faqs: FAQItem[] = [
  {
    q: "What should I look for in a Tampa Bay MSP?",
    a: "Look for a clear per-user price with a stated device allowance, a local presence with on-site capability, a documented security and backup process, and a response time in writing. Avoid providers who hide pricing or pressure you into a long contract before a trial.",
  },
  {
    q: "How do I know if an MSP is qualified?",
    a: "Ask how long the team has done this, who does the work, and whether they can show up on-site. A provider with 25 years of hands-on experience and local staff is different from a remote-only reseller. Confirm they serve your city.",
  },
  {
    q: "What questions should I ask before signing?",
    a: "Who will I talk to when something breaks. What is included versus billed extra. How devices are counted. What happens if I outgrow the plan. Can I see a sample monthly report. How do you handle a ransomware incident.",
  },
  {
    q: "What are the red flags?",
    a: "No published pricing. No local presence. No written response time. Reluctance to name technicians. Pressure to sign a long contract before a trial. A free audit that ends in a scare tactic.",
  },
];

export const metadata: Metadata = {
  title: pageTitle("How to Choose an MSP in Tampa Bay (Checklist)"),
  description: metaDescription(
    "How to choose a managed IT provider in Tampa Bay: the questions to ask, credentials to verify, and red flags to watch for before you sign."
  ),
  alternates: { canonical: "https://nesscotech.com/how-to-choose-an-msp-tampa" },
  openGraph: {
    title: pageTitle("How to Choose an MSP in Tampa Bay"),
    description: metaDescription(
      "How to choose a managed IT provider in Tampa Bay: the questions to ask, credentials to verify, and red flags to watch for."
    ),
    url: "https://nesscotech.com/how-to-choose-an-msp-tampa",
    type: "article",
  },
};

export default function HowToChooseMspPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "How to Choose an MSP in Tampa Bay", path: "/how-to-choose-an-msp-tampa" },
      ])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-16 lg:py-24" aria-labelledby="choose-heading">
        <div className="container max-w-3xl">
          <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">Home</Link>
            <span aria-hidden="true"> / </span>
            <span>How to Choose an MSP in Tampa Bay</span>
          </nav>

          <h1 id="choose-heading" className="text-4xl font-bold tracking-tight text-foreground mb-6">
            How to Choose an MSP in Tampa Bay
          </h1>
          <p className="text-lg text-muted-foreground mb-10">
            A managed service provider (MSP) runs your IT so you do not have to. Picking the wrong one is expensive to fix, so the goal is to separate a real provider from a reseller before you sign. This is the checklist we would use if we were hiring one.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Start with how they price</h2>
          <p className="text-muted-foreground mb-8">
            A clear provider quotes per user, per month, with a stated device allowance. You should be able to see the number before a sales call. Vague contact us for pricing with no published range is a warning sign, because it usually means the price is built to fit whatever you can pay. Ask for the per-user rate, the device cap, and what happens when you exceed it.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Verify experience and local presence</h2>
          <p className="text-muted-foreground mb-8">
            Ask how long the team has done this and who actually does the work. A provider with 25 years of hands-on experience and a local Tampa Bay presence can show up on-site when hardware fails. A remote-only shop with no local staff cannot. Confirm they serve your city and will come on-site for cabling, hardware, and installs.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Check the security and backup story</h2>
          <p className="text-muted-foreground mb-8">
            Ask what security is included: endpoint detection, email filtering, patching, and backup verification. Ask how backups are tested and how fast they can restore. A provider who cannot explain their backup restore process in plain terms is not ready to protect your data. Compliance work such as HIPAA or PCI should be documented, not improvised.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Ask about response time and escalation</h2>
          <p className="text-muted-foreground mb-8">
            Get the response time in writing. A provider who says within 2 hours during business hours and puts it in the agreement is different from one who says as fast as possible. Ask how after-hours emergencies are handled and who is on call.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Watch for these red flags</h2>
          <p className="text-muted-foreground mb-8">
            No published pricing. No local presence. No written response time. Reluctance to name the technicians. Pressure to sign a long contract before a trial. A free audit that ends in a scare tactic. Any of these should end the conversation.
          </p>

          <h2 className="text-2xl font-bold text-foreground mb-4">Questions worth asking directly</h2>
          <p className="text-muted-foreground mb-10">
            Who will I talk to when something breaks. What is included versus billed extra. How devices are counted. What happens if I outgrow the plan. Can I see a sample monthly report. How do you handle a ransomware incident.
          </p>

          <div className="mb-12 rounded-xl border border-border bg-muted/30 p-6">
            <h2 className="text-xl font-bold text-foreground mb-4">Frequently asked questions</h2>
            <FAQAccordion items={faqs} />
          </div>

          <div className="rounded-xl border border-border bg-background p-6 text-center">
            <p className="text-muted-foreground mb-4">
              Request a quote that shows the per-user price, the device allowance, and the response time in writing. Compare at least two providers on the same checklist before you decide.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
              <Button href="/contact">Request a quote</Button>
              <Button variant="outline" href="/managed-it-services-tampa">Managed IT services</Button>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Related: <Link href="/managed-it-services-tampa" className="text-primary hover:underline">Managed IT services in Tampa</Link> · <Link href="/it-support-tampa" className="text-primary hover:underline">IT support in Tampa</Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}