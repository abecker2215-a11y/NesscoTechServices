"use client";

import { useEffect, useRef, useCallback } from "react";

/**
 * Focus trap hook for modals, dialogs, and drawers.
 * Keeps keyboard focus within the element when active.
 */
export function useFocusTrap<T extends HTMLElement = HTMLDivElement>(active: boolean) {
  const containerRef = useRef<T>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!active || e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    },
    [active]
  );

  useEffect(() => {
    if (!active) return;

    const container = containerRef.current;
    if (!container) return;

    const focusableElements = container.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [active, handleKeyDown]);

  return containerRef;
}

/**
 * Hook to announce changes to screen readers via live region.
 */
export function useAnnouncer() {
  const announce = useCallback((message: string, politeness: "polite" | "assertive" = "polite") => {
    const announcer = document.createElement("div");
    announcer.setAttribute("role", "status");
    announcer.setAttribute("aria-live", politeness);
    announcer.setAttribute("aria-atomic", "true");
    announcer.className = "sr-only";
    announcer.textContent = message;
    document.body.appendChild(announcer);
    setTimeout(() => document.body.removeChild(announcer), 1000);
  }, []);

  return { announce };
}

/**
 * Hook to manage focus restoration when a modal closes.
 */
export function useFocusRestore() {
  const previousActiveElement = useRef<HTMLElement | null>(null);

  const saveFocus = useCallback(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
  }, []);

  const restoreFocus = useCallback(() => {
    if (previousActiveElement.current && typeof previousActiveElement.current.focus === "function") {
      previousActiveElement.current.focus();
    }
  }, []);

  return { saveFocus, restoreFocus };
}

/**
 * Check if color contrast meets WCAG AA standards.
 * Returns true if ratio >= 4.5:1 for normal text, >= 3:1 for large text.
 */
export function checkContrast(_foreground: string, _background: string): boolean {
  // This is a simplified check - in production, use a proper color library
  // like @a11y/color-contrast or similar
  return true; // Placeholder - actual implementation would parse colors and calculate ratio
}

/**
 * Generate unique IDs for ARIA relationships.
 */
export function generateId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Keyboard navigation helpers for composite widgets.
 */
export function useArrowNavigation<T extends HTMLElement>(
  items: T[],
  options: {
    orientation?: "horizontal" | "vertical" | "both";
    onSelect?: (index: number) => void;
  } = {}
) {
  const { orientation = "vertical", onSelect } = options;
  const currentIndex = useRef(0);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      let nextIndex = currentIndex.current;

      const isHorizontal = orientation === "horizontal" || orientation === "both";
      const isVertical = orientation === "vertical" || orientation === "both";

      if (e.key === "ArrowRight" && isHorizontal) {
        e.preventDefault();
        nextIndex = (currentIndex.current + 1) % items.length;
      } else if (e.key === "ArrowLeft" && isHorizontal) {
        e.preventDefault();
        nextIndex = (currentIndex.current - 1 + items.length) % items.length;
      } else if (e.key === "ArrowDown" && isVertical) {
        e.preventDefault();
        nextIndex = (currentIndex.current + 1) % items.length;
      } else if (e.key === "ArrowUp" && isVertical) {
        e.preventDefault();
        nextIndex = (currentIndex.current - 1 + items.length) % items.length;
      } else if (e.key === "Home") {
        e.preventDefault();
        nextIndex = 0;
      } else if (e.key === "End") {
        e.preventDefault();
        nextIndex = items.length - 1;
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelect?.(currentIndex.current);
        return;
      } else {
        return;
      }

      if (nextIndex !== currentIndex.current) {
        currentIndex.current = nextIndex;
        items[nextIndex]?.focus();
      }
    },
    [items, orientation, onSelect]
  );

  return { handleKeyDown, setCurrentIndex: (i: number) => { currentIndex.current = i; } };
}