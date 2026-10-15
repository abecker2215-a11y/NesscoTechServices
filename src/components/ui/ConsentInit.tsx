"use client";

import { useEffect } from "react";
import { applyStoredConsent } from "@/lib/consent";

export function ConsentInit() {
  useEffect(() => {
    // Apply stored consent on mount
    applyStoredConsent();
  }, []);

  return null;
}