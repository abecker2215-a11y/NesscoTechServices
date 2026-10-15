"use client";

import Link from "next/link";
import { Stethoscope, ArrowRight } from "lucide-react";

const symptoms = [
  { label: "Wi-Fi slow or dead zones", href: "/guides/fix-slow-wifi-tampa", note: "6 min · Beginner" },
  { label: "Computer slow or crashing", href: "/guides/speed-up-slow-windows-pc", note: "7 min · Intermediate" },
  { label: "Virus warning or scam pop-up", href: "/guides/remove-virus-malware-windows", note: "6 min · Intermediate" },
  { label: "Suspicious email or text", href: "/guides/spot-stop-phishing-emails", note: "5 min · Intermediate" },
  { label: "Email won't sync", href: "/fixes/outlook-stuck-syncing", note: "3 min quick fix" },
  { label: "Printer won't print", href: "/fixes/printer-shows-offline", note: "3 min quick fix" },
  { label: "Was my password breached?", href: "/guides/check-password-breach", note: "3 min · Beginner" },
  { label: "Selling an old phone?", href: "/guides/wipe-old-phone-before-selling", note: "4 min · Beginner" },
];

/** Zero-typing router: tap the symptom, land on the right guide or quick fix. */
export function GuideFinder() {
  return (
    <div className="mx-auto mb-12 max-w-3xl rounded-2xl border border-border bg-muted/30 p-6 lg:p-8">
      <h2 className="flex items-center justify-center gap-2 text-center text-lg font-bold text-foreground">
        <Stethoscope className="h-5 w-5 text-primary" aria-hidden="true" />
        Which guide do I need?
      </h2>
      <p className="mt-1 text-center text-sm text-muted-foreground">Tap what&apos;s happening — we&apos;ll route you.</p>
      <div className="mt-4 grid gap-2 sm:grid-cols-2">
        {symptoms.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-4 py-3 transition-all hover:border-primary/50 hover:-translate-y-0.5"
          >
            <span>
              <span className="block text-sm font-medium text-foreground">{s.label}</span>
              <span className="block text-xs text-muted-foreground">{s.note}</span>
            </span>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </div>
  );
}
