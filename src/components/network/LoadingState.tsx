"use client";

import { Loader2, Cpu, Network, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  className?: string;
  progress?: number;
}

export function LoadingState({ className, progress = 0 }: LoadingStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center h-full bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900", className)}>
      <div className="text-center space-y-6">
        {/* Loading Animation */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <Loader2 className="relative h-16 w-16 text-primary animate-spin" aria-hidden="true" />
        </div>

        {/* Loading Text */}
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Initializing Network Visualization</h3>
          <p className="text-sm text-slate-400">Loading 3D environment and device models...</p>
        </div>

        {/* Progress Bar */}
        {progress > 0 && (
          <div className="w-64 space-y-2">
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary to-sky-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-400">{Math.round(progress)}% complete</p>
          </div>
        )}

        {/* Feature Icons */}
        <div className="flex items-center justify-center gap-8 pt-4">
          <div className="flex flex-col items-center gap-2">
            <Cpu className="h-8 w-8 text-slate-500" aria-hidden="true" />
            <span className="text-xs text-slate-500">Devices</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Network className="h-8 w-8 text-slate-500" aria-hidden="true" />
            <span className="text-xs text-slate-500">Connections</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <Shield className="h-8 w-8 text-slate-500" aria-hidden="true" />
            <span className="text-xs text-slate-500">Security</span>
          </div>
        </div>
      </div>
    </div>
  );
}
