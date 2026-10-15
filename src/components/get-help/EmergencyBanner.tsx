"use client";

import { Phone, Siren } from "lucide-react";
import { Button } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

interface EmergencyBannerProps {
  compact?: boolean;
}

/**
 * Urgency fast lane: shown when answers indicate an active security incident
 * (ransomware, suspected breach, "need help now"). Email can wait — a live
 * attacker can't. The form stays available below for those who prefer it.
 */
export function EmergencyBanner({ compact = false }: EmergencyBannerProps) {
  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;

  return (
    <div
      className="rounded-xl border-2 border-destructive/60 bg-destructive/5 p-5"
      role="alert"
      aria-label="Urgent issue — call now for fastest response"
    >
      <div className="flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/15 text-destructive">
          <Siren className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-foreground">
            This sounds urgent — don&apos;t wait for email
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {compact
              ? "You flagged this as an active incident. Calling now gets a human fastest — your answers below are saved."
              : "Active incidents get priority over the normal queue. Call now and we'll start triage on the phone — or continue below and we'll treat it as urgent."}
          </p>
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <Button
              variant="destructive"
              href={telHref}
              onClick={() => trackEvent("call_click", { from: "emergency-banner" })}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              Call {siteConfig.phone} now
            </Button>
            <p className="self-center text-xs text-muted-foreground">
              {siteConfig.hours} · After hours? Call anyway — the voicemail flags us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
