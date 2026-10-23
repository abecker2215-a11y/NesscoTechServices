"use client";

import { useState } from "react";
import { Camera, Layers, X, Menu, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileControlsProps {
  onCameraAngle: (angle: "top" | "front" | "isometric" | "reset") => void;
  onToggleGroup: (group: string) => void;
  visibleGroups: Set<string>;
  onClose?: () => void;
  className?: string;
}

export function MobileControls({
  onCameraAngle,
  onToggleGroup,
  visibleGroups,
  onClose,
  className,
}: MobileControlsProps) {
  const [activePanel, setActivePanel] = useState<"camera" | "groups" | null>(null);

  const togglePanel = (panel: "camera" | "groups") => {
    setActivePanel(activePanel === panel ? null : panel);
  };

  return (
    <div className={cn("fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-lg border-t border-slate-700 z-50", className)} role="dialog" aria-modal="true" aria-label="Network visualization controls">
      {/* Main Controls Bar */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => togglePanel("camera")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activePanel === "camera" ? "bg-primary text-primary-foreground" : "bg-slate-800 text-white"
          )}
          aria-expanded={activePanel === "camera"}
          aria-controls="camera-panel"
        >
          <Camera className="h-4 w-4" aria-hidden="true" />
          Camera
          {activePanel === "camera" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        <button
          onClick={() => togglePanel("groups")}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            activePanel === "groups" ? "bg-primary text-primary-foreground" : "bg-slate-800 text-white"
          )}
          aria-expanded={activePanel === "groups"}
          aria-controls="groups-panel"
        >
          <Layers className="h-4 w-4" aria-hidden="true" />
          Groups
          {activePanel === "groups" ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            aria-label="Close controls"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Camera Panel */}
      {activePanel === "camera" && (
        <div
          id="camera-panel"
          className="px-4 py-3 border-t border-slate-700 bg-slate-800/50"
          role="region"
          aria-label="Camera controls"
        >
          <div className="grid grid-cols-2 gap-2">
            {["top", "front", "isometric", "reset"].map((angle) => (
              <button
                key={angle}
                onClick={() => onCameraAngle(angle as any)}
                className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-lg text-sm font-medium capitalize transition-colors"
              >
                {angle}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Groups Panel */}
      {activePanel === "groups" && (
        <div
          id="groups-panel"
          className="px-4 py-3 border-t border-slate-700 bg-slate-800/50"
          role="region"
          aria-label="Group filters"
        >
          <div className="grid grid-cols-2 gap-2">
            {["All", "IT", "Finance", "HR"].map((group) => (
              <button
                key={group}
                onClick={() => onToggleGroup(group)}
                className={cn(
                  "px-4 py-3 rounded-lg text-sm font-medium capitalize transition-colors",
                  visibleGroups.has(group)
                    ? "bg-primary text-primary-foreground"
                    : "bg-slate-700 text-white hover:bg-slate-600"
                )}
              >
                {group}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
