"use client";

import { CheckCircle, AlertTriangle, XCircle, Server, Monitor, Router, Shield, Info, RotateCw, MousePointer2, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContextPanelProps {
  optimized: boolean;
  threatMode: boolean;
  devicesOnline: number;
  totalDevices: number;
  threatsDetected: number;
  lastCheck: string;
  className?: string;
}

export function ContextPanel({
  optimized,
  threatMode,
  devicesOnline,
  totalDevices,
  threatsDetected,
  lastCheck,
  className,
}: ContextPanelProps) {
  return (
    <div className={cn("space-y-6", className)}>
      {/* Network Status Card */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full blur-2xl" />
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2 relative z-10">
          <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4" />
            <path d="M12 8h.01" />
          </svg>
          Network Status
        </h3>
        <div className="space-y-3 relative z-10">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">State</span>
            <span className={cn("text-xs font-medium", optimized ? "text-green-400" : "text-amber-400")}>
              {optimized ? "Optimized" : "Current"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Monitoring</span>
            <span className="text-xs font-medium text-white flex items-center gap-1">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Active
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Devices Online</span>
            <span className="text-xs font-medium text-white">{devicesOnline}/{totalDevices}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Threats Detected</span>
            <span className={cn("text-xs font-medium", threatsDetected > 0 ? "text-red-400" : "text-green-400")}>
              {threatsDetected}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400">Last Check</span>
            <span className="text-xs font-medium text-white">{lastCheck}</span>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Legend</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg shadow-green-500/50" aria-hidden="true" />
            <span className="text-xs text-slate-300">Optimized / Secure</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-500/50" aria-hidden="true" />
            <span className="text-xs text-slate-300">Normal</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-amber-500 shadow-lg shadow-amber-500/50" aria-hidden="true" />
            <span className="text-xs text-slate-300">Warning</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-500 shadow-lg shadow-red-500/50" aria-hidden="true" />
            <span className="text-xs text-slate-300">Threat / Offline</span>
          </div>
        </div>
      </div>

      {/* Device Types */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Device Types</h3>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Server className="h-4 w-4 text-blue-400" aria-hidden="true" />
            <span className="text-xs text-slate-300">Server</span>
          </div>
          <div className="flex items-center gap-3">
            <Monitor className="h-4 w-4 text-slate-400" aria-hidden="true" />
            <span className="text-xs text-slate-300">Computer</span>
          </div>
          <div className="flex items-center gap-3">
            <Router className="h-4 w-4 text-amber-400" aria-hidden="true" />
            <span className="text-xs text-slate-300">Router</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-red-400" aria-hidden="true" />
            <span className="text-xs text-slate-300">Firewall</span>
          </div>
        </div>
      </div>

      {/* How to Explore */}
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5">
        <h3 className="text-sm font-semibold text-white mb-4">How to Explore</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MousePointer2 className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-slate-300">Drag to rotate the network view</p>
          </div>
          <div className="flex items-start gap-3">
            <ArrowUp className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-slate-300">Scroll to zoom in and out</p>
          </div>
          <div className="flex items-start gap-3">
            <MousePointer2 className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-slate-300">Click devices to see details</p>
          </div>
          <div className="flex items-start gap-3">
            <RotateCw className="h-4 w-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
            <p className="text-xs text-slate-300">Use camera presets for different views</p>
          </div>
        </div>
      </div>
    </div>
  );
}
