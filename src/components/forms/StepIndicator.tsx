import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export interface StepIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  steps: string[];
  current: number;
  completed?: number[];
}

export function StepIndicator({ steps, current, completed = [], className, ...props }: StepIndicatorProps) {
  return (
    <nav
      className={cn("w-full", className)}
      aria-label="Progress"
      {...props}
    >
      <ol className="flex items-center" role="list">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = completed.includes(stepNumber);
          const isCurrent = stepNumber === current;

          return (
            <li key={step} className="relative flex items-center flex-1">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "relative flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium transition-all",
                    isCompleted
                      ? "bg-success text-success-foreground"
                      : isCurrent
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                  aria-current={isCurrent ? "step" : undefined}
                >
                  {isCompleted ? (
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" aria-hidden="true">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    stepNumber
                  )}
                </div>
                <span
                  className={cn(
                    "text-sm font-medium truncate",
                    isCurrent || isCompleted ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "absolute left-1/2 top-4 h-0.5 flex-1 transition-colors",
                    isCompleted ? "bg-success" : "bg-border"
                  )}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
      <div className="sr-only" aria-live="polite">
        Step {current} of {steps.length}: {steps[current - 1]}
      </div>
    </nav>
  );
}