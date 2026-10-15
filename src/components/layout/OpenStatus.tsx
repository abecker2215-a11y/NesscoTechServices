/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBusinessStatus } from "@/lib/hours";

/**
 * Hours-aware response-time pill. Renders the safe static promise on the
 * server, then corrects to open/closed state on the client (avoids
 * hydration mismatch since the server can't know the visitor's clock).
 */
export function OpenStatus({
  className,
  variant = "pill",
}: {
  className?: string;
  variant?: "pill" | "inline";
}) {
  const [status, setStatus] = useState<{ open: boolean; label: string }>({
    open: true,
    label: "Replies within 2 hrs",
  });

  useEffect(() => {
    setStatus(getBusinessStatus(new Date()));
  }, []);

  if (variant === "inline") {
    return (
      <span className={cn("inline-flex items-center gap-1.5", className)} role="status">
        <span
          className={cn(
            "h-2 w-2 rounded-full animate-pulse",
            status.open ? "bg-success" : "bg-warning"
          )}
          aria-hidden="true"
        />
        {status.label}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "hidden xl:inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground",
        className
      )}
      role="status"
    >
      <Circle
        className={cn(
          "h-2 w-2 animate-pulse",
          status.open ? "fill-success text-success" : "fill-warning text-warning"
        )}
        aria-hidden="true"
      />
      {status.label}
    </span>
  );
}
