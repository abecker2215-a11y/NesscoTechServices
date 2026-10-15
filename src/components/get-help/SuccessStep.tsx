"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { CheckCircle, CalendarCheck, Phone, MessageSquare, Copy, Check } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { CalEmbed } from "@/components/booking/CalEmbed";

interface SuccessStepProps {
  referenceNumber?: string;
}

export function SuccessStep({ referenceNumber }: SuccessStepProps) {
  const ref = referenceNumber || "REQ-PENDING";
  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;
  const smsHref = `sms:${siteConfig.phone.replace(/\D/g, "")}?body=${encodeURIComponent(`Hi Nessco, my request ${ref} — `)}`;
  const [copied, setCopied] = useState(false);

  const copyRef = async () => {
    try {
      await navigator.clipboard.writeText(ref);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable — selection fallback still shows the ref
    }
  };

  const handleBookingConfirmed = (data: { uid: string; startTime: string; endTime: string }) => {
    trackEvent("booking_click", { from: "get-help-success", cal_uid: data.uid });
  };

  return (
    <div className="text-center py-12 max-w-md mx-auto">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/10 text-success">
        <CheckCircle className="h-8 w-8" aria-hidden="true" />
      </div>
      <h2 className="text-2xl font-bold text-foreground mb-2">Request Submitted</h2>
      <p className="text-muted-foreground mb-6">
        Thank you for reaching out. Your request has been received and we&apos;ll be in touch soon.
      </p>
      {referenceNumber && (
        <p className="mb-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
          Your reference number: <strong className="text-foreground font-mono">{ref}</strong>
          <button
            type="button"
            onClick={copyRef}
            className="inline-flex items-center gap-1 rounded-md border border-border px-2 py-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Copy reference number"
          >
            {copied ? <Check className="h-3 w-3 text-success" aria-hidden="true" /> : <Copy className="h-3 w-3" aria-hidden="true" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </p>
      )}
      <div className="rounded-lg bg-accent p-4 border border-accent-foreground/20 text-left mb-6">
        <h3 className="font-medium text-accent-foreground mb-2">What happens next:</h3>
        <ul className="space-y-2 text-sm text-accent-foreground" role="list">
          <li>&bull; We&apos;ll review your request within 2 hours during business hours</li>
          <li>&bull; You&apos;ll receive a confirmation email at the address provided</li>
          <li>&bull; We&apos;ll contact you to discuss the issue and schedule service</li>
          <li>&bull; No charges until we agree on the scope of work</li>
        </ul>
      </div>

      <div className="rounded-xl border border-primary/25 bg-primary/5 p-5 text-left mb-6">
        <h3 className="flex items-center gap-2 font-semibold text-foreground">
          <CalendarCheck className="h-5 w-5 text-primary" aria-hidden="true" />
          Want a guaranteed time?
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Skip the back-and-forth — book a 15-minute intro call now, or reach us directly.
        </p>
        {siteConfig.bookingUrl && (
          <div className="mt-4">
            <CalEmbed
              onBookingConfirmed={handleBookingConfirmed}
              height={500}
              layout="month_view"
            />
          </div>
        )}
        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            className="flex-1"
            href={telHref}
            onClick={() => trackEvent("call_click", { from: "get-help-success" })}
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            {siteConfig.phone}
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            href={smsHref}
            onClick={() => trackEvent("sms_click", { from: "get-help-success" })}
          >
            <MessageSquare className="h-4 w-4" aria-hidden="true" />
            Text us
          </Button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button href="/">Return Home</Button>
        <Button variant="outline" href="/contact">Other Questions</Button>
      </div>

      {siteConfig.googleReviewUrl && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Fixed and happy down the road?{" "}
          <a
            href={siteConfig.googleReviewUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary hover:underline"
          >
            Leave us a Google review →
          </a>
        </p>
      )}
    </div>
  );
}
