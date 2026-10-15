"use client";

import { useState, useRef } from "react";
import { FAQItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
  allowMultiple?: boolean;
}

export function FAQAccordion({ items, className, allowMultiple = true }: FAQAccordionProps) {
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const toggle = (index: number) => {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        if (!allowMultiple) next.clear();
        next.add(index);
      }
      return next;
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    const buttons = buttonsRef.current.filter(Boolean) as HTMLButtonElement[];
    const currentIndex = buttons.findIndex((_, i) => i === index);
    if (currentIndex === -1) return;

    let nextIndex = currentIndex;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        nextIndex = (currentIndex + 1) % buttons.length;
        break;
      case "ArrowUp":
        e.preventDefault();
        nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
        break;
      case "Home":
        e.preventDefault();
        nextIndex = 0;
        break;
      case "End":
        e.preventDefault();
        nextIndex = buttons.length - 1;
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        toggle(index);
        return;
      default:
        return;
    }
    buttons[nextIndex]?.focus();
  };

  return (
    <div className={cn("space-y-4", className)}>
      {items.map((faq, index) => {
        const isOpen = open.has(index);
        return (
          <div key={index} className="border border-border rounded-lg overflow-hidden">
            <button
              ref={(el) => { buttonsRef.current[index] = el; }}
              type="button"
              onClick={() => toggle(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${index}`}
              className="w-full px-6 py-4 flex items-center justify-between text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:bg-muted/50 transition-colors"
            >
              <span className="font-medium text-foreground pr-8">{faq.q}</span>
              <ChevronDown
                className={cn(
                  "h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform duration-200",
                  isOpen && "rotate-180"
                )}
                aria-hidden="true"
              />
            </button>
            <div
              id={`faq-answer-${index}`}
              role="region"
              aria-label={faq.q}
              className={cn(
                "grid transition-all duration-200 ease-in-out",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-4 text-muted-foreground animate-fade-in">{faq.a}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}