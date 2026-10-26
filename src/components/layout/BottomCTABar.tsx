"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Phone, ArrowRight, Zap, Download } from "lucide-react";

export function BottomCTABar() {
  const [visible, setVisible] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Detect iOS
    const userAgent = typeof window !== "undefined" ? window.navigator.userAgent : "";
    setIsIOS(/iPad|iPhone|iPod/.test(userAgent));

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const handleScroll = () => setVisible(window.scrollY > 100);

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else if (isIOS) {
      // iOS - show add to home screen instructions
      alert("Tap the Share button, then 'Add to Home Screen'");
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 w-full bg-[#0a1530]/95 border-t border-[#123378] px-4 py-3 backdrop-blur-md transition-all duration-300">
      <div className="max-w-[1800px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 px-2 sm:px-0">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#123378] text-white">
            <Zap className="h-4 w-4" aria-hidden="true" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-white">Need IT help now?</p>
            <p className="text-xs text-cyan-300">Remote $75/hr · On-site $125/hr</p>
          </div>
        </div>
        {deferredPrompt || isIOS ? (
          <button
            onClick={handleInstall}
            className="flex items-center gap-2 rounded-lg bg-[#123378] px-4 py-2 text-sm font-medium text-white border border-[#1e3a8a] hover:bg-[#1e3a8a] transition-colors"
            aria-label="Install Nessco Tech App"
          >
            <Download className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Install App</span>
          </button>
        ) : (
          <div className="flex items-center gap-2 sm:flex-nowrap">
            <a
              href="tel:8135550199"
              className="flex items-center gap-2 rounded-lg bg-[#123378] px-4 py-2 text-sm font-medium text-white border border-[#1e3a8a] hover:bg-[#1e3a8a] transition-colors"
              aria-label="Call emergency"
            >
              <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Emergency</span>
            </a>
            <Link
              href="/get-help"
              className="flex items-center gap-2 rounded-lg border border-[#1e3a8a] bg-[#0a1530]/80 px-4 py-2 text-sm font-medium text-white hover:bg-[#1e3a8a] transition-colors"
            >
              Get Help <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
