"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

interface CalEmbedProps {
  /** Override the default booking URL */
  bookingUrl?: string;
  /** Cal.com username/handle (if using cal.com) */
  calUsername?: string;
  /** Event type slug (if using cal.com) */
  eventSlug?: string;
  /** Embed height */
  height?: number;
  /** Hide event type details */
  hideEventTypeDetails?: boolean;
  /** Layout: "month_view" | "column_view" | "week_view" */
  layout?: "month_view" | "column_view" | "week_view";
  /** Theme: "light" | "dark" | "auto" */
  theme?: "light" | "dark" | "auto";
  /** Called when booking is confirmed */
  onBookingConfirmed?: (data: { uid: string; startTime: string; endTime: string }) => void;
  /** Called when embed loads */
  onLoad?: () => void;
}

/**
 * Cal.com inline embed component.
 * Supports both Cal.com (cal.com/username/event) and Calendly (calendly.com/username/event).
 * Falls back to a styled link button if no valid embed URL is configured.
 */
export function CalEmbed({
  bookingUrl,
  calUsername,
  eventSlug = "intro",
  height = 650,
  hideEventTypeDetails = true,
  layout = "month_view",
  theme = "auto",
  onBookingConfirmed,
  onLoad,
}: CalEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const { embedUrl, isCalendly } = useMemo(() => {
    const url = bookingUrl || siteConfig.bookingUrl;
    const none = { embedUrl: null, isCalendly: false };

    if (!url) return none;

    try {
      const parsed = new URL(url);

      if (parsed.hostname.includes("cal.com")) {
        const pathParts = parsed.pathname.split("/").filter(Boolean);
        const username = calUsername || pathParts[0];
        const slug = eventSlug || pathParts[1] || "intro";
        return {
          embedUrl: `https://cal.com/${username}/${slug}?embed=true&hideEventTypeDetails=${hideEventTypeDetails}&layout=${layout}&theme=${theme}`,
          isCalendly: false,
        };
      }

      if (parsed.hostname.includes("calendly.com")) {
        const pathParts = parsed.pathname.split("/").filter(Boolean);
        const username = pathParts[0];
        const slug = pathParts[1] || "intro";
        return {
          embedUrl: `https://calendly.com/${username}/${slug}?embed=true&hide_event_type_details=${hideEventTypeDetails}&layout=${layout}&theme=${theme}`,
          isCalendly: true,
        };
      }

      return none;
    } catch {
      return none;
    }
  }, [bookingUrl, calUsername, eventSlug, hideEventTypeDetails, layout, theme]);

  useEffect(() => {
    if (!iframeRef.current || !isCalendly) return;

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://calendly.com" && event.origin !== "https://cal.com") return;

      try {
        const data = JSON.parse(event.data);
        if (data.event === "calendly.event_scheduled" && onBookingConfirmed) {
          onBookingConfirmed({
            uid: data.payload?.event_type?.uuid || "",
            startTime: data.payload?.start_time || "",
            endTime: data.payload?.end_time || "",
          });
        }
        if (data.event === "calendly.profile_loaded" && onLoad) {
          onLoad();
        }
      } catch {
        // Ignore parse errors
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [isCalendly, onBookingConfirmed, onLoad]);

  // No valid embed URL — render fallback button
  if (!embedUrl) {
    const url = bookingUrl || siteConfig.bookingUrl;
    return (
      <div className="w-full">
        <a
          href={url || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "inline-flex items-center justify-center gap-2 w-full px-6 py-4 rounded-xl border-2 border-dashed border-primary/30 bg-primary/5 text-primary font-semibold text-lg hover:bg-primary/10 transition-colors",
            !url && "opacity-50 cursor-not-allowed"
          )}
          aria-label={url ? "Book a call on external scheduler" : "Booking not configured"}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>{url ? "Book a Call →" : "Connect Cal.com/Calendly to enable inline booking"}</span>
        </a>
      </div>
    );
  }

  return (
    <div className="w-full rounded-xl border border-gray-200 overflow-hidden bg-white">
      <iframe
        ref={iframeRef}
        src={embedUrl}
        width="100%"
        height={height}
        frameBorder="0"
        title="Book a call with Nessco Tech Services"
        className="block"
        onLoad={() => {
          setIsLoaded(true);
          if (onLoad) onLoad();
        }}
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="animate-pulse space-y-3 text-center">
            <div className="h-12 w-12 bg-primary/10 rounded-full mx-auto flex items-center justify-center">
              <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-sm text-muted-foreground">Loading scheduler…</p>
          </div>
        </div>
      )}
    </div>
  );
}