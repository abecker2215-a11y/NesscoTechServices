"use client";

import { HelpRequestCategory } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ProblemSelectorProps {
  onSelect: (category: string) => void;
  selected?: string;
  categories: HelpRequestCategory[];
  icons: Record<string, React.ComponentType<{ className?: string }>>;
}

export function ProblemSelector({ onSelect, selected, categories, icons }: ProblemSelectorProps) {
  return (
    <fieldset className="w-full" aria-label="Problem category">
      <legend className="sr-only">What do you need help with?</legend>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3" role="radiogroup" aria-label="Select problem category">
        {categories.map((category) => {
          const Icon = icons[category.icon] || icons["help-circle"];
          const isSelected = selected === category.id;

          return (
            <label
              key={category.id}
              className={cn(
                "relative cursor-pointer",
                "peer"
              )}
            >
              <input
                type="radio"
                name="category"
                value={category.id}
                checked={isSelected}
                onChange={() => onSelect(category.id)}
                className="sr-only"
                aria-label={category.label}
              />
              <div
                className={cn(
                  "relative p-4 rounded-lg border-2 text-center transition-all",
                  isSelected
                    ? "border-primary bg-primary/5 text-foreground"
                    : "border-border hover:border-primary/50 hover:bg-muted/50 text-muted-foreground"
                )}
              >
                <div className="flex justify-center mb-2">
                  <Icon className={cn("h-8 w-8", isSelected ? "text-primary" : "text-muted-foreground")} aria-hidden="true" />
                </div>
                <span className="text-sm font-medium block">{category.label}</span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}