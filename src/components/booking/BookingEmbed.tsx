"use client";

import { useMemo } from "react";
import { CalendarCheck, Phone, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

interface BookingEmbedProps {
  title?: string;
  description?: string;
}

/** Reject only clearly-unset or example URLs so a dead iframe never ships. */
function isBookingConfigured(url: string | undefined): url is string {
  if (!url) return false;
  try {
    const u = new URL(url);
    if (u.hostname === "example.com" || u.pathname.includes("example")) return false;
    return u.protocol === "https:";
  } catch {
    return false;
  }
}

/**
 * Inline scheduling embed. Works with any Calendly/Cal.com link set as
 * `NEXT_PUBLIC_BOOKING_URL` (see `src/lib/config.ts`). Falls back to
 * call/SMS CTAs when unset or still the placeholder.
 */
export function BookingEmbed({
  title = "Book a 15-minute intro call",
  description = "Pick a time that suits you — no back-and-forth emails. For urgent issues, call instead.",
}: BookingEmbedProps) {
  const embedSrc = useMemo(() => {
    if (!isBookingConfigured(siteConfig.bookingUrl)) return null;
    try {
      const url = new URL(siteConfig.bookingUrl);
      url.searchParams.set("embed_domain", typeof window !== "undefined" ? window.location.hostname : siteConfig.domain);
      url.searchParams.set("embed_type", "Inline");
      url.searchParams.set("hide_gdpr_banner", "1");
      return url.toString();
    } catch {
      return null;
    }
  }, []);

  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;
  const smsHref = `sms:${siteConfig.phone.replace(/\D/g, "")}`;
  const showSetupHint =
    typeof window !== "undefined" &&
    (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") &&
    !embedSrc;

  return (
    <section className="rounded-2xl border border-border bg-background p-6 lg:p-8" aria-labelledby="booking-heading">
      <div className="mx-auto max-w-2xl text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <CalendarCheck className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 id="booking-heading" className="text-2xl font-bold text-foreground">
          {title}
        </h2>
        <p className="mt-2 text-muted-foreground">{description}</p>
      </div>

      {embedSrc ? (
        <div className="mt-6 overflow-hidden rounded-xl border border-border">
          <iframe
            src={embedSrc}
            title="Schedule a call"
            className="h-[640px] w-full"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="mx-auto mt-6 flex max-w-xl flex-col gap-3 sm:flex-row">
          <Button
            size="lg"
            className="flex-1"
            href={telHref}
            onClick={() => trackEvent("call_click", { from: "booking-embed" })}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {siteConfig.phone}
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="flex-1"
            href={smsHref}
            onClick={() => trackEvent("sms_click", { from: "booking-embed" })}
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Text us
          </Button>
          <Button size="lg" variant="outline" className="flex-1" href="/get-help">
            Start a service request
          </Button>
        </div>
      )}

      {showSetupHint && (
        <p className="mt-4 rounded-lg border border-dashed border-border bg-muted/50 p-3 text-center text-xs text-muted-foreground">
          Dev only: set <code className="font-mono">NEXT_PUBLIC_BOOKING_URL</code> to your Cal.com/Calendly link to
          preview the inline scheduler here.
        </p>
      )}

      <p className="mt-4 text-center text-xs text-muted-foreground">
        Urgent? Skip booking — call <a href={telHref} className="font-medium text-primary hover:underline">{siteConfig.phone}</a> (Mon–Fri 8am–6pm).
      </p>
    </section>
  );
}
