import { Metadata } from "next";
import { Button, FAQAccordion } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import { Monitor, Wifi, Smartphone, Shield } from "lucide-react";

export const metadata: Metadata = {
  title: pageTitle("Remote IT Support for Business"),
  description: metaDescription("Secure remote IT support starting at $75/hr. Software troubleshooting, configuration, Microsoft 365 help, and quick fixes — available anywhere in the U.S."),
  alternates: { canonical: "https://nesscotech.com/remote-it-support/" },
  openGraph: {
    title: pageTitle("Remote IT Support for Business"),
    description: metaDescription("Secure remote IT support starting at $75/hr. Software troubleshooting, configuration, Microsoft 365 help, and quick fixes — available anywhere in the U.S."),
    url: "https://nesscotech.com/remote-it-support/",
    type: "website",
    images: [{ url: "https://nesscotech.com/og-image.png", width: 1200, height: 630, alt: "Nessco Tech Services — Remote IT Support" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Remote IT Support for Business",
    description: "Secure remote IT support starting at $75/hr. Software troubleshooting, configuration, Microsoft 365 help, and quick fixes.",
    images: ["https://nesscotech.com/og-image.png"],
  },
};

const services = [
  { title: "Software Troubleshooting", body: "Email issues, browser problems, application errors, OS bugs", icon: Monitor },
  { title: "Microsoft 365 Configuration", body: "Email setup, Teams, SharePoint, OneDrive, security policies", icon: Shield },
  { title: "Device Setup & Configuration", body: "New computer setup, user profiles, printer config, VPN", icon: Smartphone },
  { title: "System Tune-Ups", body: "Performance optimization, startup cleanup, driver updates", icon: Wifi },
];

const faqs = [
  { q: "How does remote support work?", a: "We initiate a secure remote desktop session. You watch everything we do on your screen. No software installation required on your end — just click a link." },
  { q: "What can be fixed remotely?", a: "Most software issues: email, browser, Office apps, printer setup, VPN, Windows/macOS configuration, Microsoft 365 admin, security settings, and general troubleshooting." },
  { q: "What requires on-site support?", a: "Hardware repair/replacement, network cabling, Wi-Fi hardware installation, server rack work, physical device setup, and anything requiring hands-on access." },
  { q: "How quickly can you start a remote session?", a: "During business hours (Mon–Fri, 8am–6pm ET), we typically start within 2 hours. Emergency coverage available for managed clients." },
  { q: "Is remote support secure?", a: "Yes. We use encrypted connections with multi-factor authentication. You must approve the connection and can disconnect at any time. All sessions are logged." },
  { q: "Do you support both Windows and Mac?", a: "Yes. We support Windows 10/11, macOS, and Linux workstations." },
];

export default function RemoteITSupportPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Remote IT Support", path: "/remote-it-support/" }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <section className="py-20 lg:py-32" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              Available anywhere in the U.S.
            </p>
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Remote IT Support When You Need It
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Secure remote desktop sessions starting at $75/hr. No travel fees, no waiting for someone to show up. We connect, diagnose, and fix — while you watch.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/get-help" className="min-h-[48px]">Request Remote Help</Button>
              <Button size="lg" variant="outline" href="/contact" className="min-h-[48px]">Get a Quote</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {services.map((svc) => (
              <div key={svc.title} className="p-6 rounded-xl border border-border bg-background">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <svc.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{svc.title}</h3>
                <p className="text-sm text-muted-foreground">{svc.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="benefits-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="benefits-heading" className="text-3xl font-bold text-foreground mb-4">Why Choose Remote Support?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { title: "No Travel Time", body: "We connect in minutes, not hours. You pay only for the time we're actively working." },
              { title: "Lower Cost", body: "$75/hr remote vs $125/hr on-site. Same expertise, no trip charge." },
              { title: "Same-Day Availability", body: "Most remote sessions start within 2 business hours. Emergencies prioritized." },
              { title: "Watch & Learn", body: "You see everything on your screen. Full transparency, no mystery work." },
              { title: "Works Anywhere", body: "Your team can be in one office or fifty. We support distributed workforces seamlessly." },
              { title: "Secure by Default", body: "Encrypted connections, MFA, session logging, and you control the connection." },
            ].map((item) => (
              <div key={item.title} className="p-6 rounded-xl border border-border bg-background">
                <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="faq-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 id="faq-heading" className="text-3xl font-bold text-foreground mb-4">Remote Support FAQs</h2>
          </div>
          <FAQAccordion items={faqs} className="max-w-3xl mx-auto" />
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">Need Help Right Now?</h2>
            <p className="text-muted-foreground mb-8">Start a service request in under 2 minutes. We&apos;ll contact you within 2 hours during business hours.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" href="/get-help" className="min-h-[48px]">Get Remote Help Now</Button>
              <Button size="lg" variant="outline" href="/contact" className="min-h-[48px]">Contact Us</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}