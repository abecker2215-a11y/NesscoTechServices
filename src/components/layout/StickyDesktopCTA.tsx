"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Phone, ArrowRight, X, Zap } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/config";
import { useIsMounted } from "@/lib/use-is-mounted";

interface StickyDesktopCTAProps {
  triggerOffset?: number;
  cookieName?: string;
  cookieDays?: number;
  hideOnPaths?: string[];
}

const DEFAULT_HIDE_PATHS = ["/get-help", "/contact", "/pricing"];

export function StickyDesktopCTA({
  triggerOffset = 200,
  cookieName = "nessco_sticky_cta_dismissed",
  cookieDays = 30,
  hideOnPaths = DEFAULT_HIDE_PATHS,
}: StickyDesktopCTAProps) {
  const [visible, setVisible] = useState(false);
  const mounted = useIsMounted();
  const [dismissed, setDismissed] = useState(
    () =>
      typeof document !== "undefined" &&
      document.cookie
        .split("; ")
        .some((row) => row.startsWith(`${cookieName}=`))
  );

  const handleScroll = useCallback(() => {
    if (dismissed) return;
    const shouldShow = window.scrollY > triggerOffset;
    setVisible(shouldShow);
  }, [dismissed, triggerOffset]);

  useEffect(() => {
    if (!mounted) return;
    const raf = requestAnimationFrame(handleScroll);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mounted, handleScroll]);

  const isHiddenPath = hideOnPaths.some((path) =>
    typeof window !== "undefined" && window.location.pathname.startsWith(path)
  );

  const handleDismiss = () => {
    setDismissed(true);
    setVisible(false);
    if (typeof document !== "undefined") {
      const expires = new Date(Date.now() + cookieDays * 864e5).toUTCString();
      document.cookie = `${cookieName}=true; expires=${expires}; path=/; SameSite=Lax`;
    }
    trackEvent("sticky_cta_dismissed");
  };

  const handleClick = (action: "call" | "quote") => {
    trackEvent("sticky_cta_click", { action });
    if (action === "call") {
      window.location.href = `tel:${siteConfig.phone.replace(/\D/g, "")}`;
    }
  };

  if (!mounted || isHiddenPath || dismissed || !visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 animate-slide-up print:hidden"
      role="banner"
      aria-label="Quick contact"
    >
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-background/95 backdrop-blur-sm px-4 py-2.5 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-foreground">Need IT help now?</p>
              <p className="text-xs text-muted-foreground">
                Remote $75/hr · On-site $125/hr · No fix, no fee
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleClick("call")}
              className="hidden sm:flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
              aria-label={`Call ${siteConfig.phone}`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              <span>{siteConfig.phone}</span>
            </button>
            <Link
              href="/get-help"
              onClick={() => trackEvent("sticky_cta_click", { action: "quote" })}
              className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              Get a quote
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <button
              onClick={handleDismiss}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Dismiss"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}