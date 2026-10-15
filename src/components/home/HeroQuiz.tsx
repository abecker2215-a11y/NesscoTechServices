"use client";

import { useRouter } from "next/navigation";
import { Monitor, Wifi, Mail, Shield, Briefcase, HelpCircle, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const options = [
  { id: "computer", label: "Workstations & Servers", icon: Monitor, hint: "Slow, crashed, won't start" },
  { id: "wifi", label: "Wi-Fi & Networking", icon: Wifi, hint: "Slow, dead zones, drops" },
  { id: "email", label: "Email & Microsoft 365", icon: Mail, hint: "Sync, send, receive, MFA" },
  { id: "security", label: "Security & Compliance", icon: Shield, hint: "Ransomware, phishing, audit" },
  { id: "business", label: "Managed IT & vCIO", icon: Briefcase, hint: "5-100 staff, 365 support" },
  { id: "other", label: "Other IT Needs", icon: HelpCircle, hint: "Describe in your words" },
];

export function HeroQuiz() {
  const router = useRouter();

  const pick = (category: string) => {
    trackEvent("hero_quiz_pick", { category });
    router.push(`/get-help?category=${category}`);
  };

  return (
    <div className="mt-8 rounded-xl border border-border bg-background/80 p-4 sm:p-5 shadow-sm">
      <p className="text-sm font-semibold text-foreground">
        What&apos;s going wrong?
        <span className="ml-2 font-normal text-muted-foreground">Tap one — we&apos;ll route you in seconds.</span>
      </p>
      <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2" role="list">
        {options.map((opt) => (
          <button
            key={opt.id}
            type="button"
            role="listitem"
            onClick={() => pick(opt.id)}
            className="group flex items-start gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 text-left transition-all hover:border-primary/50 hover:bg-muted/50 hover:-translate-y-0.5"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <opt.icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <span className="min-w-0">
              <span className="block text-sm font-medium text-foreground leading-tight">{opt.label}</span>
              <span className="block text-xs text-muted-foreground truncate">{opt.hint}</span>
            </span>
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => pick("other")}
        className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Not sure? Start here — takes under 2 minutes
        <ArrowRight className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
