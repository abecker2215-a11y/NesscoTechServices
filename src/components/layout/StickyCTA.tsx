"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Phone, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export function StickyCTA() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-16 left-0 right-0 z-30 hidden md:block transition-all duration-300 print:hidden",
        visible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"
      )}
      aria-hidden={!visible}
    >
      <div className="border-b border-border bg-background/95 backdrop-blur-sm shadow-sm">
        <div className="container flex items-center justify-between py-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Need IT help?</span> We reply within 2 business hours.
          </p>
          <div className="flex items-center gap-3">
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              onClick={() => trackEvent("sticky_cta_call")}
              className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              {siteConfig.phone}
            </a>
            <Link
              href="/get-help"
              onClick={() => trackEvent("sticky_cta_click")}
              className="flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Get Help
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
