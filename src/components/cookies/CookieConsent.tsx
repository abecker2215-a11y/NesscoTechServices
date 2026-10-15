"use client";

import { useState } from "react";
import { X, Cookie, Check } from "lucide-react";
import { Button } from "@/components/ui";
import { useClientSnapshot } from "@/lib/use-is-mounted";

export function CookieConsent() {
  const hasConsent = useClientSnapshot(
    () => Boolean(localStorage.getItem("cookie-consent")),
    () => true
  );
  const [dismissed, setDismissed] = useState(false);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setDismissed(true);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setDismissed(true);
  };

  if (hasConsent || dismissed) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-background p-4 shadow-lg print:hidden">
      <div className="container">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <Cookie className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" aria-hidden="true" />
            <div className="text-sm">
              <p className="font-medium text-foreground mb-1">
                We use cookies to improve your experience
              </p>
              <p className="text-muted-foreground">
                By continuing, you agree to our use of cookies for analytics and personalization.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDecline}
              className="min-h-[40px]"
            >
              Decline
            </Button>
            <Button
              size="sm"
              onClick={handleAccept}
              className="min-h-[40px]"
            >
              <Check className="h-4 w-4 mr-2" aria-hidden="true" />
              Accept
            </Button>
            <button
              onClick={() => setDismissed(true)}
              className="p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
