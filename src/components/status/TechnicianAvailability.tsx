"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Users, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function TechnicianAvailability() {
  const [availability, setAvailability] = useState({
    available: true,
    technicians: 3,
    waitTime: 15,
    lastUpdated: new Date(),
  });

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setAvailability((prev) => ({
        ...prev,
        technicians: Math.max(1, prev.technicians + (Math.random() > 0.5 ? 1 : -1)),
        waitTime: Math.max(5, Math.floor(Math.random() * 30) + 5),
        lastUpdated: new Date(),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    if (availability.available && availability.waitTime <= 15) return "text-success";
    if (availability.available && availability.waitTime <= 30) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="bg-gradient-to-br from-success/10 via-success/5 to-background border border-success/20 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-success" aria-hidden="true" />
          <h4 className="text-sm font-semibold text-foreground">Live Availability</h4>
        </div>
        <div className={cn("flex items-center gap-1 text-xs font-medium", getStatusColor())}>
          {availability.waitTime <= 15 ? (
            <CheckCircle className="h-3 w-3" aria-hidden="true" />
          ) : availability.waitTime <= 30 ? (
            <Clock className="h-3 w-3" aria-hidden="true" />
          ) : (
            <AlertCircle className="h-3 w-3" aria-hidden="true" />
          )}
          <span>{availability.available ? "Available" : "Busy"}</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Technicians online</span>
          <span className="text-sm font-semibold text-foreground">{availability.technicians}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Current wait time</span>
          <span className={cn("text-sm font-semibold", getStatusColor())}>
            {availability.waitTime} min
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">Updated</span>
          <span className="text-xs text-muted-foreground">
            {availability.lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border">
        <Link
          href="/get-help"
          className="block w-full text-center px-3 py-2 bg-success text-success-foreground rounded-lg text-sm font-medium hover:bg-success/90 transition-colors"
        >
          Get Help Now
        </Link>
      </div>
    </div>
  );
}
