"use client";

import { useState } from "react";
import { Check, Download, Shield, Mail, CalendarCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { Input } from "@/components/ui";
import { FormField } from "@/components/forms";
import { Alert } from "@/components/ui";

const checklistItems = [
  { item: "Multi-Factor Authentication (MFA) enabled on all accounts", category: "Identity" },
  { item: "Email security policies configured (anti-phishing, spoofing, DMARC/DKIM/SPF)", category: "Email" },
  { item: "Endpoint protection (EDR) deployed and monitoring active", category: "Endpoints" },
  { item: "Regular backup verification and restore testing in place", category: "Data Protection" },
  { item: "Security awareness training for all staff", category: "People" },
  { item: "Least-privilege access controls implemented", category: "Access" },
  { item: "Vendor and third-party access reviewed", category: "Access" },
  { item: "Incident response plan documented and tested", category: "Response" },
  { item: "Patch management routine established", category: "Operations" },
];

const EmailCapturer = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    try {
      const response = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) });
      if (response.ok) setStatus("success");
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return (
      <div className="rounded-lg border border-border bg-background p-8 text-center">
        <Shield className="mx-auto mb-4 h-12 w-12 text-success" aria-hidden="true" />
        <h2 className="text-xl font-semibold text-foreground mb-2">Checklist Sent!</h2>
        <p className="text-muted-foreground">Check your email for the IT Security Checklist.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {status === "error" && <Alert variant="destructive" title="Subscription Failed">Something went wrong. Please try again.</Alert>}
      <FormField label="Work Email" required>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required autoComplete="email" />
      </FormField>
      <Button className="w-full" loading={status === "submitting"}>
        <Download className="h-4 w-4" aria-hidden="true" />
        Send Me the Checklist
      </Button>
      <p className="text-xs text-muted-foreground text-center">
        We&apos;ll never spam you. Unsubscribe anytime. By subscribing you agree to our privacy policy.
      </p>
    </form>
  );
};

export default function SecurityChecklistPage() {
  return (
    <section className="py-20 lg:py-32" aria-labelledby="checklist-heading">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-6">
              <Shield className="h-4 w-4" aria-hidden="true" />
              Free Lead Magnet
            </p>
            <h1 id="checklist-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              Small Business IT Security Checklist
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              A 10-point checklist covering the most critical security controls every small business should implement. Download it and get started on securing your environment today.
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-background p-8 lg:p-10">
            <h2 className="text-2xl font-semibold text-foreground mb-8">The Checklist</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
              {checklistItems.map((item) => (
                <div key={item.item} className="flex items-start gap-3 rounded-lg border border-border bg-background p-4 text-sm">
                  <Check className="h-5 w-5 text-success flex-shrink-0 mt-0.5" aria-hidden="true" />
                  <div>
                    <p className="text-foreground">{item.item}</p>
                    <span className="text-xs text-muted-foreground">Category: {item.category}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-border pt-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Get the Full Checklist</h2>
              <p className="text-muted-foreground mb-6">Enter your email to get the downloadable checklist and our weekly security tips.</p>
              <EmailCapturer />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-xl border border-border bg-background">
              <Shield className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="font-semibold text-foreground mb-2">Actionable</h3>
              <p className="text-sm text-muted-foreground">No fluff. Just the controls you actually need to implement.</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-background">
              <Mail className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="font-semibold text-foreground mb-2">Weekly Tips</h3>
              <p className="text-sm text-muted-foreground">Get security tips delivered weekly — no spam, just value.</p>
            </div>
            <div className="text-center p-6 rounded-xl border border-border bg-background">
              <CalendarCheck className="mx-auto mb-3 h-8 w-8 text-primary" aria-hidden="true" />
              <h3 className="font-semibold text-foreground mb-2">Free Consultation</h3>
              <p className="text-sm text-muted-foreground">We&apos;ll review your setup and suggest next steps after you get the checklist.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
