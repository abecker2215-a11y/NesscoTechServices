"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";
import { useClientSnapshot } from "@/lib/use-is-mounted";

interface PWAInstallPromptProps {
  className?: string;
  children?: React.ReactNode;
}

let deferredPrompt: BeforeInstallPromptEvent | null = null;

export function PWAInstallPrompt({ className, children: _children }: PWAInstallPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const installedStandalone = useClientSnapshot(
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false
  );
  const [installedManually, setInstalledManually] = useState(false);
  const isInstalled = installedStandalone || installedManually;

  useEffect(() => {
    if (installedStandalone) return;

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e as BeforeInstallPromptEvent;
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setInstalledManually(true);
      setShowPrompt(false);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, [installedStandalone]);

  const handleInstall = useCallback(async () => {
    if (!deferredPrompt) return;
    
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === "accepted") {
      setShowPrompt(false);
      setInstalledManually(true);
    }
    
    deferredPrompt = null;
  }, []);

  if (isInstalled || !showPrompt) {
    return null;
  }

  return (
    <div 
      className={cn(
        "fixed bottom-4 left-4 right-4 md:bottom-6 md:left-auto md:right-6 md:w-80 z-50 animate-slide-up",
        className
      )}
      role="dialog"
      aria-label="Install app"
    >
      <div className="bg-background border border-border rounded-xl shadow-xl p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
            <Download className="h-5 w-5" aria-hidden="true" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">
              Install Nessco Tech App
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Get quick access to IT help, ticket tracking, and support from your home screen.
            </p>
          </div>
          <button
            onClick={() => setShowPrompt(false)}
            className="text-muted-foreground hover:text-foreground p-1"
            aria-label="Dismiss"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={() => setShowPrompt(false)}
          >
            Not Now
          </Button>
          <Button 
            className="flex-1" 
            onClick={handleInstall}
          >
            Install
          </Button>
        </div>
      </div>
    </div>
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAOfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const updateOnlineStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);
    return () => {
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  if (isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 animate-slide-down bg-warning text-warning-foreground px-4 py-2 text-center text-sm font-medium" role="alert">
      You&apos;re offline. Some features may be limited.
    </div>
  );
}

export function PWARegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js")
        .then((registration) => {
          console.log("[PWA] Service Worker registered:", registration.scope);
          
          // Check for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
                  // New version available
                  if (confirm("A new version is available. Reload to update?")) {
                    window.location.reload();
                  }
                }
              });
            }
          });
        })
        .catch((error) => {
          console.error("[PWA] Service Worker registration failed:", error);
        });
    }
  }, []);

  return null;
}

export function PWAManager() {
  return (
    <>
      <PWARegistration />
      <PWAInstallPrompt />
      <PWAOfflineIndicator />
    </>
  );
}