"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface Network3DProps {
  className?: string;
}

export function Network3D({ className }: Network3DProps) {
  const [optimized, setOptimized] = useState(false);

  return (
    <div className={cn("relative w-full h-64 bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg overflow-hidden", className)}>
      {/* SVG-based network visualization */}
      <svg
        className="w-full h-full"
        viewBox="0 0 400 200"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Connections */}
        <g stroke={optimized ? "#10b981" : "#6b7280"} strokeWidth="2" fill="none">
          <line x1="200" y1="100" x2="280" y2="60" />
          <line x1="200" y1="100" x2="280" y2="140" />
          <line x1="200" y1="100" x2="120" y2="60" />
          <line x1="200" y1="100" x2="120" y2="140" />
          <line x1="280" y1="60" x2="340" y2="40" />
          <line x1="280" y1="60" x2="340" y2="80" />
          <line x1="280" y1="140" x2="340" y2="120" />
          <line x1="280" y1="140" x2="340" y2="160" />
          <line x1="120" y1="60" x2="60" y2="40" />
          <line x1="120" y1="60" x2="60" y2="80" />
          <line x1="120" y1="140" x2="60" y2="120" />
          <line x1="120" y1="140" x2="60" y2="160" />
        </g>

        {/* Server (Center) */}
        <g>
          <rect x="185" y="85" width="30" height="30" rx="4" fill={optimized ? "#10b981" : "#ef4444"} />
          <circle cx="200" cy="75" r="3" fill={optimized ? "#10b981" : "#f59e0b"} className="animate-pulse" />
        </g>

        {/* Routers */}
        <g>
          <circle cx="280" cy="60" r="8" fill={optimized ? "#10b981" : "#f59e0b"} />
          <circle cx="280" cy="140" r="8" fill={optimized ? "#10b981" : "#f59e0b"} />
          <circle cx="120" cy="60" r="8" fill={optimized ? "#10b981" : "#f59e0b"} />
          <circle cx="120" cy="140" r="8" fill={optimized ? "#10b981" : "#f59e0b"} />
        </g>

        {/* Computers */}
        <g>
          <rect x="335" y="35" width="10" height="10" rx="2" fill={optimized ? "#10b981" : "#6b7280"} />
          <rect x="335" y="75" width="10" height="10" rx="2" fill={optimized ? "#10b981" : "#6b7280"} />
          <rect x="335" y="115" width="10" height="10" rx="2" fill={optimized ? "#10b981" : "#6b7280"} />
          <rect x="335" y="155" width="10" height="10" rx="2" fill={optimized ? "#10b981" : "#6b7280"} />
          <rect x="55" y="35" width="10" height="10" rx="2" fill={optimized ? "#10b981" : "#6b7280"} />
          <rect x="55" y="75" width="10" height="10" rx="2" fill={optimized ? "#10b981" : "#6b7280"} />
          <rect x="55" y="115" width="10" height="10" rx="2" fill={optimized ? "#10b981" : "#6b7280"} />
          <rect x="55" y="155" width="10" height="10" rx="2" fill={optimized ? "#10b981" : "#6b7280"} />
        </g>

        {/* Labels */}
        <text x="200" y="60" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">
          {optimized ? "Optimized" : "Current"}
        </text>
      </svg>

      <div className="absolute bottom-4 left-4 right-4">
        <button
          onClick={() => setOptimized(!optimized)}
          className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          {optimized ? "View Current State" : "View Optimized State"}
        </button>
      </div>

      <div className="absolute top-4 left-4">
        <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <p className="text-xs text-white">
            {optimized ? "✓ Optimized Network" : "⚠ Current Network"}
          </p>
        </div>
      </div>

      <div className="absolute top-4 right-4">
        <div className="bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-lg">
          <p className="text-xs text-white">Interactive Network Visualization</p>
        </div>
      </div>
    </div>
  );
}
