"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, SkipForward, Play, Shield, CheckCircle, AlertTriangle, Cpu, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface TourStep {
  id: number;
  title: string;
  description: string;
  tooltip: string;
  action?: () => void;
  autoAdvance?: boolean;
}

const tourSteps: TourStep[] = [
  {
    id: 1,
    title: "The Problem",
    description: "This is what an unoptimized network looks like. Notice the warning states, slower data flow, and potential vulnerabilities.",
    tooltip: "Current Network: Warning indicators and slower throughput",
  },
  {
    id: 2,
    title: "The Solution",
    description: "After our optimization: green indicators, active monitoring, faster throughput, and secure connections.",
    tooltip: "Optimized Network: Green status and active data flow",
  },
  {
    id: 3,
    title: "Threat Detection",
    description: "We detect threats in real-time. When a threat appears, you'll see red particles flowing through the network.",
    tooltip: "Threat Simulation: Red particles indicate a security threat",
  },
  {
    id: 4,
    title: "Device Intelligence",
    description: "Every device is monitored, tracked, and maintained. Click any device to see its specifications and status.",
    tooltip: "Click a device to see detailed information",
  },
  {
    id: 5,
    title: "Take Action",
    description: "Ready for this level of monitoring? Schedule a free network assessment to see how we can protect your business.",
    tooltip: "Schedule your free network assessment today",
  },
];

interface TourGuideProps {
  onComplete: () => void;
  onStepChange: (step: number) => void;
  className?: string;
}

export function TourGuide({ onComplete, onStepChange, className }: TourGuideProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [autoAdvance, setAutoAdvance] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    onStepChange(currentStep + 1);
  }, [currentStep, onStepChange]);

  useEffect(() => {
    if (autoAdvance && !isPaused && currentStep < tourSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 15000); // 15 seconds per step
      return () => clearTimeout(timer);
    }
  }, [autoAdvance, isPaused, currentStep]);

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const toggleAutoAdvance = () => {
    setAutoAdvance(!autoAdvance);
    setIsPaused(false);
  };

  const step = tourSteps[currentStep];

  return (
    <div className={cn("bg-gradient-to-br from-primary/10 to-slate-800/50 backdrop-blur-sm rounded-xl border border-primary/30 p-5 relative overflow-hidden", className)}>
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
      {/* Header */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          Interactive Tour
        </h3>
        <button
          onClick={handleSkip}
          className="text-xs text-slate-400 hover:text-white transition-colors flex items-center gap-1"
          aria-label="Skip tour"
        >
          <SkipForward className="h-3 w-3" aria-hidden="true" />
          Skip
        </button>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 mb-4 relative z-10" role="tablist" aria-label="Tour steps">
        {tourSteps.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={cn(
              "h-2 rounded-full transition-all relative",
              index === currentStep
                ? "flex-1 bg-primary shadow-lg shadow-primary/50"
                : index < currentStep
                ? "flex-1 bg-green-500 shadow-lg shadow-green-500/50"
                : "flex-1 bg-slate-600"
            )}
            aria-label={`Go to step ${index + 1}: ${tourSteps[index].title}`}
            aria-selected={index === currentStep}
            role="tab"
          />
        ))}
      </div>

      {/* Step Content */}
      <div className="space-y-4">
        <div>
          <h4 className="text-lg font-semibold text-white mb-2">{step.title}</h4>
          <p className="text-sm text-slate-300 leading-relaxed">{step.description}</p>
        </div>

        {/* Tooltip */}
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-3">
          <p className="text-xs text-primary flex items-start gap-2">
            <InfoIcon className="h-4 w-4 shrink-0 mt-0.5" aria-hidden="true" />
            {step.tooltip}
          </p>
        </div>

        {/* Step Icons */}
        <div className="flex items-center gap-4 pt-2 relative z-10">
          {currentStep === 0 && (
            <svg className="h-6 w-6 text-amber-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          )}
          {currentStep === 1 && (
            <svg className="h-6 w-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
              <path d="M22 4L12 14.01l-3-3" />
            </svg>
          )}
          {currentStep === 2 && (
            <svg className="h-6 w-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          )}
          {currentStep === 3 && (
            <svg className="h-6 w-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <rect x="4" y="4" width="16" height="16" rx="2" ry="2" />
              <rect x="9" y="9" width="6" height="6" />
              <path d="M15 2v2" />
              <path d="M15 20v2" />
              <path d="M2 15h2" />
              <path d="M2 9h2" />
              <path d="M20 15h2" />
              <path d="M20 9h2" />
            </svg>
          )}
          {currentStep === 4 && (
            <svg className="h-6 w-6 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M5 12h14" />
              <path d="M12 5l7 7-7 7" />
            </svg>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-700">
        <button
          onClick={handlePrevious}
          disabled={currentStep === 0}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            currentStep === 0
              ? "text-slate-500 cursor-not-allowed"
              : "text-white hover:bg-slate-700"
          )}
          aria-label="Previous step"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          Previous
        </button>

        <button
          onClick={toggleAutoAdvance}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            autoAdvance
              ? "text-primary bg-primary/10"
              : "text-slate-400 hover:bg-slate-700"
          )}
          aria-label={autoAdvance ? "Pause auto-advance" : "Enable auto-advance"}
        >
          {autoAdvance ? "Auto: On" : "Auto: Off"}
        </button>

        <button
          onClick={handleNext}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
          aria-label={currentStep === tourSteps.length - 1 ? "Complete tour" : "Next step"}
        >
          {currentStep === tourSteps.length - 1 ? "Complete" : "Next"}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      {/* Step Counter */}
      <div className="text-center mt-4">
        <p className="text-xs text-slate-400">
          Step {currentStep + 1} of {tourSteps.length}
        </p>
      </div>
    </div>
  );
}

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
