"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics";

export function CallTracker() {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[href^="tel:"]');
      if (link) {
        const href = link.getAttribute("href") ?? "";
        trackEvent("call_click", { number: href.replace("tel:", "") });
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
