import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { CheckCircle, Shield, AlertTriangle, FileText, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Free IT Health Check | Tampa Bay MSP",
  description: "Get a free IT health check for your Tampa Bay business. Identify security risks, backup gaps, and IT issues before they become expensive problems.",
  alternates: { canonical: "https://nesscotech.com/it-health-check" },
  openGraph: {
    title: "Free IT Health Check | Nessco Tech Services",
    description: "Get a free IT health check for your Tampa Bay business. Identify security risks, backup gaps, and IT issues before they become expensive problems.",
    url: "https://nesscotech.com/it-health-check",
    type: "website",
  },
};

const benefits = [
  {
    icon: Shield,
    title: "Security Assessment",
    description: "Identify vulnerabilities, malware risks, and security gaps in your network.",
  },
  {
    icon: AlertTriangle,
    title: "Backup & Recovery Review",
    description: "Verify your backup strategy and recovery capabilities in case of data loss.",
  },
  {
    icon: FileText,
    title: "IT Infrastructure Audit",
    description: "Review hardware, software, licensing, and overall IT health.",
  },
  {
    icon: CheckCircle,
    title: "Actionable Report",
    description: "Receive a detailed report with prioritized recommendations and no obligation.",
  },
];

const steps = [
  {
    number: "1",
    title: "Schedule",
    description: "Book your free consultation in minutes.",
  },
  {
    number: "2",
    title: "Assess",
    description: "We remotely scan and review your systems.",
  },
  {
    number: "3",
    title: "Report",
    description: "Get your custom IT Health Check report with recommendations.",
  },
];

export default function ITHealthCheckPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Free IT Health Check", path: "/it-health-check" },
      ])} />
      
      <section className="py-20 lg:py-32 bg-gradient-to-b from-primary/5 to-background" aria-labelledby="hero-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h1 id="hero-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Free IT Health Check for Tampa Bay Businesses
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover hidden security risks, backup gaps, and IT inefficiencies before they cost you time and money.
            </p>
            <Button size="lg" href="/get-help">
              Get Your Free IT Health Check
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">
              No obligation • Takes 30 minutes • Delivered as a detailed report
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="benefits-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="benefits-heading" className="text-3xl font-bold text-foreground mb-4">
              What You'll Get
            </h2>
            <p className="text-muted-foreground">
              A comprehensive review of your IT environment with actionable insights
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="p-6 rounded-lg border border-border bg-background text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <benefit.icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="steps-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="steps-heading" className="text-3xl font-bold text-foreground mb-4">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground text-xl font-bold">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Know Your IT Health?
            </h2>
            <p className="text-muted-foreground mb-8">
              Get your free IT Health Check report. Identify risks before they become costly problems.
            </p>
            <Button size="lg" href="/get-help">
              Schedule Your Free Assessment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
