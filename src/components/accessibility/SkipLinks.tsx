"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function SkipLinks() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab" && e.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleMouseMove = () => {
      if (isVisible) {
        setIsVisible(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isVisible]);

  const links = [
    { href: "#main-content", label: "Skip to main content" },
    { href: "#services", label: "Skip to services" },
    { href: "#contact", label: "Skip to contact" },
    { href: "#search", label: "Skip to search" },
  ];

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-[100] bg-primary text-primary-foreground p-2 flex justify-center gap-4 transition-transform",
        isVisible ? "translate-y-0" : "-translate-y-full"
      )}
      role="navigation"
      aria-label="Skip links"
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          className="text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-white"
          onClick={() => setIsVisible(false)}
        >
          {link.label}
        </a>
      ))}
      <button
        onClick={() => setIsVisible(false)}
        className="p-1 hover:bg-primary/80 rounded"
        aria-label="Close skip links"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}
