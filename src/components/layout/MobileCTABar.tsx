"use client";

import { Button } from "@/components/ui";
import { siteConfig } from "@/lib/config";
import { Phone } from "lucide-react";

export function MobileCTABar() {
  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur px-4 pt-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex gap-3 shadow-lg lg:hidden"
      role="region"
      aria-label="Quick contact"
    >
      <Button variant="outline" href={`tel:${siteConfig.phone.replace(/\D/g, "")}`} className="flex-1">
        <Phone className="h-4 w-4" aria-hidden="true" />
        Call Now
      </Button>
      <Button href="/get-help" className="flex-1">
        Get Help
      </Button>
    </div>
  );
}
