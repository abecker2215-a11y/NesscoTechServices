import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Users, Shield, Monitor } from "lucide-react";
import ConsultationForm from "./ConsultationForm";

export const metadata: Metadata = {
  title: pageTitle("Free IT Consultation"),
  description: metaDescription("Book a free IT consultation for your business. We'll assess your current setup, identify gaps, and recommend the right managed IT services — no pressure, just honest guidance."),
  alternates: { canonical: "https://nesscotech.com/free-consultation/" },
  openGraph: {
    title: pageTitle("Free IT Consultation"),
    description: metaDescription("Book a free IT consultation for your business. We'll assess your current setup, identify gaps, and recommend the right managed IT services."),
    url: "https://nesscotech.com/free-consultation/",
    type: "website",
    images: [{ url: "https://nesscotech.com/og-image.png", width: 1200, height: 630, alt: "Nessco Tech Services — Free IT Consultation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Free IT Consultation",
    description: "Book a free IT consultation for your business. We'll assess your current setup, identify gaps, and recommend the right managed IT services.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

export default function FreeConsultationPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Free Consultation", path: "/free-consultation/" }])} />

      <section className="py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              No Obligation — Honest Guidance
            </p>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Free IT Consultation for Your Business
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Book a 30-minute consultation. We&apos;ll assess your current IT setup, identify gaps, and recommend the right approach — whether that&apos;s managed IT, security improvements, or just better processes.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="#consultation-form" className="min-h-[48px]">Start Free Consultation</Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="what-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="what-heading" className="text-3xl font-bold text-foreground mb-4">What Happens in a Consultation</h2>
            <p className="text-muted-foreground text-lg">30 minutes. No sales pressure. Just honest assessment.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Users, title: "Understand Your Business", body: "We learn about your team, workflows, pain points, and growth plans." },
              { icon: Shield, title: "Assess Current IT", body: "We review your current setup, security posture, and technology stack." },
              { icon: Monitor, title: "Recommend Next Steps", body: "We give you a clear, prioritized action plan — with or without us." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border bg-background">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="consultation-form" className="py-16 lg:py-24" aria-labelledby="form-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto">
            <div className="rounded-2xl border border-border bg-background p-8">
              <h2 className="text-2xl font-semibold text-foreground mb-8 text-center">Request Your Free Consultation</h2>
              <ConsultationForm />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">Consultation FAQs</h2>
          </div>
          <FAQAccordion items={[
            { q: "Is the consultation really free?", a: "Yes. 30 minutes, no obligation, no hidden fees. We believe honest guidance builds trust — and sometimes the best recommendation is to keep what you have." },
            { q: "What if we&apos;re not ready for managed IT?", a: "That&apos;s fine. We&apos;ll tell you honestly what makes sense for your situation. Some businesses just need better processes or a one-time project — not ongoing management." },
            { q: "Who will I talk to?", a: "Our owner/lead technician with 25+ years of IT experience. No junior sales reps or discovery-call scripts." },
            { q: "What should I prepare?", a: "Just know your employee count, current IT setup, and biggest pain points. No technical docs required." },
            { q: "How do we schedule?", a: "After you submit the form, we&apos;ll email you within 2 business hours with available times. Pick what works and we&apos;ll send a calendar invite." },
          ]} className="max-w-3xl mx-auto" />
        </div>
      </section>
    </>
  );
}