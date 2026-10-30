"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { X, AlertTriangle, CheckCircle, ArrowRight, Shield, Gift, Clock, Zap } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { useFocusTrap, useFocusRestore } from "@/lib/a11y";
import { useIsMounted } from "@/lib/use-is-mounted";

interface ExitIntentPopupProps {
  enabled?: boolean;
  delay?: number;
  cookieName?: string;
  cookieDays?: number;
  variant?: "audit" | "discount" | "guide";
}

const variants = {
  audit: {
    icon: Shield,
    title: "Before you go…",
    subtitle: "Free 15-min IT Health Check — zero risk, pure value",
    description: "We'll scan your setup and give you 3 concrete fixes to prevent downtime. No pitch. No obligation. Just a second opinion from a local MSP.",
    socialProof: "Trusted by 100+ Tampa Bay businesses",
    benefits: [
      { icon: CheckCircle, text: "Security gaps (MFA, backups, patching)" },
      { icon: AlertTriangle, text: "Single points of failure (backups, power, internet)" },
      { icon: CheckCircle, text: "Quick wins for speed & reliability" },
    ],
    ctaText: "Claim my free audit",
    ctaHref: "/get-help?source=exit_intent",
  },
  discount: {
    icon: Gift,
    title: "Special offer just for you",
    subtitle: "Get 10% off your first month of managed IT",
    description: "Limited time offer for new clients. 24/7 monitoring, proactive maintenance, and unlimited helpdesk support.",
    socialProof: "Join 50+ businesses already saving time & money",
    benefits: [
      { icon: CheckCircle, text: "24/7 monitoring & alerting" },
      { icon: Zap, text: "Proactive patching & maintenance" },
      { icon: Clock, text: "Unlimited helpdesk support" },
    ],
    ctaText: "Get 10% off first month",
    ctaHref: "/pricing?offer=exit_intent_10",
  },
  guide: {
    icon: Gift,
    title: "Free IT Security Guide",
    subtitle: "10 Things Most Businesses Get Wrong About Cybersecurity",
    description: "Download our free guide and learn the security mistakes that could cost you your business reputation.",
    socialProof: "500+ Tampa Bay businesses have downloaded this guide",
    benefits: [
      { icon: CheckCircle, text: "Common security vulnerabilities" },
      { icon: AlertTriangle, text: "Ransomware prevention checklist" },
      { icon: CheckCircle, text: "Employee training tips" },
    ],
    ctaText: "Download free guide",
    ctaHref: "/guides?source=exit_intent",
  },
};

export function ExitIntentPopup({
  enabled = true,
  delay = 1000,
  cookieName = "nessco_exit_dismissed",
  cookieDays = 7,
  variant = "audit",
}: ExitIntentPopupProps) {
  const [show, setShow] = useState(false);
  const mounted = useIsMounted();

  const dialogRef = useFocusTrap<HTMLDivElement>(show);
  const { saveFocus, restoreFocus } = useFocusRestore();

  const getCookie = useCallback((name: string): string | null => {
    if (typeof document === "undefined") return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(";").shift() ?? null;
    return null;
  }, []);

  const setCookie = useCallback((name: string, value: string, days: number) => {
    if (typeof document === "undefined") return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/; SameSite=Lax`;
  }, []);

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const mouseYRef = useRef(0);

  const handleDismiss = useCallback(
    (method: "close_button" | "no_thanks" = "no_thanks") => {
      setShow(false);
      setCookie(cookieName, "true", cookieDays);
      trackEvent("exit_intent_dismissed", { method, variant });
      setTimeout(restoreFocus, 200);
    },
    [cookieName, cookieDays, setCookie, restoreFocus, variant]
  );

  const handleConvert = useCallback(() => {
    setShow(false);
    setCookie(cookieName, "true", cookieDays * 30);
    trackEvent("exit_intent_converted", { variant });
    setTimeout(restoreFocus, 200);
  }, [cookieName, cookieDays, setCookie, restoreFocus, variant]);

  useEffect(() => {
    if (!mounted || !enabled) return;

    const dismissed = getCookie(cookieName);
    if (dismissed) return;

    const handleMouseMove = (e: MouseEvent) => {
      mouseYRef.current = e.clientY;
    };

    const handleMouseLeave = () => {
      if (mouseYRef.current <= 0) {
        timerRef.current = setTimeout(() => {
          setShow(true);
          trackEvent("exit_intent_triggered", { variant });
        }, delay);
      }
    };

    const handleMouseEnter = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [mounted, enabled, delay, cookieName, getCookie, variant]);

  useEffect(() => {
    if (show) {
      saveFocus();
    }
  }, [show, saveFocus]);

  if (!mounted || !show) return null;

  const currentVariant = variants[variant];
  const Icon = currentVariant.icon;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in print-hidden"
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-popup-title"
    >
      <div
        ref={dialogRef}
        className="relative w-full max-w-md rounded-2xl border border-border bg-background shadow-2xl overflow-hidden animate-fade-in-up"
      >
        <button
          onClick={() => handleDismiss("close_button")}
          className="absolute top-3 right-3 z-10 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          aria-label="Dismiss offer"
        >
          <X className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Icon className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 id="exit-popup-title" className="text-lg font-semibold text-foreground">
                {currentVariant.title}
              </h2>
              <p className="text-sm text-muted-foreground">
                {currentVariant.subtitle}
              </p>
            </div>
          </div>

          <p className="mb-6 text-sm text-muted-foreground">
            {currentVariant.description}
          </p>

          <p className="mb-4 text-xs text-primary font-medium">{currentVariant.socialProof}</p>

          <ul className="mb-6 space-y-3 text-sm" role="list">
            {currentVariant.benefits.map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <item.icon className="h-5 w-5 shrink-0 mt-0.5 text-success" aria-hidden="true" />
                <span className="text-foreground">{item.text}</span>
              </li>
            ))}
          </ul>

          <div className="space-y-3">
            <Link
              href={currentVariant.ctaHref}
              onClick={handleConvert}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              {currentVariant.ctaText}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <button
              onClick={() => handleDismiss("no_thanks")}
              className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              No thanks, maybe later
            </button>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            We&apos;ll reply within 2 business hours.
          </p>
        </div>
      </div>
    </div>
  );
}