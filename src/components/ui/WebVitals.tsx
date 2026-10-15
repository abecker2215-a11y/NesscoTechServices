"use client";

import { useEffect } from "react";
import { initWebVitals } from "@/lib/web-vitals";

export function WebVitals() {
  useEffect(() => {
    initWebVitals({
      debug: process.env.NODE_ENV === "development",
      sampleRate: 1,
    });
  }, []);

  return null;
}