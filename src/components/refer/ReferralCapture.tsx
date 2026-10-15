"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

/** Persist ?code= referral attribution in a long-lived cookie. */
export function ReferralCapture() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && /^[A-Z0-9-]{4,24}$/i.test(code)) {
      const expires = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toUTCString();
      document.cookie = `nessco_ref=${encodeURIComponent(code.toUpperCase())}; expires=${expires}; path=/; SameSite=Lax`;
      try {
        localStorage.setItem("nessco_ref", code.toUpperCase());
      } catch {
        // ignore
      }
    }
  }, [searchParams]);

  return null;
}

/** Read the stored referral code (cookie first, localStorage fallback). */
export function getStoredReferralCode(): string | null {
  if (typeof document === "undefined") return null;
  const fromCookie = document.cookie
    .split("; ")
    .find((row) => row.startsWith("nessco_ref="))
    ?.split("=")[1];
  if (fromCookie) return decodeURIComponent(fromCookie);
  try {
    return localStorage.getItem("nessco_ref");
  } catch {
    return null;
  }
}
