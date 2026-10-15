"use client";

import { useState, useMemo, useRef } from "react";
import Fuse from "fuse.js";
import Link from "next/link";
import { Search, X, FileText, Calendar, Tag, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { services } from "@/lib/services";

interface SearchResult {
  type: "service" | "guide" | "page";
  title: string;
  description: string;
  url: string;
  category?: string;
}

interface FuseSearchProps {
  className?: string;
  placeholder?: string;
}

export function FuseSearch({ className, placeholder = "Search services, guides, pages..." }: FuseSearchProps) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  // Build search index
  const searchIndex = useMemo(() => {
    const allResults: SearchResult[] = [
      // Services
      ...services.map((service) => ({
        type: "service" as const,
        title: service.title,
        description: service.shortDescription,
        url: `/services/${service.slug}`,
        category: service.slug.split("/")[0],
      })),
      // Pages
      { type: "page" as const, title: "About Us", description: "Learn about Nessco Tech Services", url: "/about" },
      { type: "page" as const, title: "Contact", description: "Get in touch with us", url: "/contact" },
      { type: "page" as const, title: "Pricing", description: "View our pricing plans", url: "/pricing" },
      { type: "page" as const, title: "Case Studies", description: "See our success stories", url: "/case-studies" },
      { type: "page" as const, title: "Guides", description: "Browse our IT guides", url: "/guides" },
      { type: "page" as const, title: "ROI Calculator", description: "Calculate your downtime costs", url: "/roi" },
      // Industries
      { type: "page" as const, title: "Healthcare IT", description: "HIPAA-compliant IT for medical practices", url: "/industries/healthcare" },
      { type: "page" as const, title: "Legal IT", description: "Secure IT for law firms", url: "/industries/legal" },
      { type: "page" as const, title: "Retail IT", description: "POS and payment security", url: "/industries/retail" },
      { type: "page" as const, title: "Construction IT", description: "Field service and job site IT", url: "/industries/construction" },
    ];

    return new Fuse(allResults, {
      keys: ["title", "description", "category"],
      threshold: 0.4,
      includeScore: true,
    });
  }, []);

  // Perform search
  const results = useMemo(() => {
    if (!query.trim()) return [];
    const fuseResults = searchIndex.search(query);
    return fuseResults.map((result) => result.item);
  }, [query, searchIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % results.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + results.length) % results.length);
        break;
      case "Enter":
        e.preventDefault();
        if (results[selectedIndex]) {
          window.location.href = results[selectedIndex].url;
        }
        break;
      case "Escape":
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleClear = () => {
    setQuery("");
    setSelectedIndex(0);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  const getTypeIcon = (type: SearchResult["type"]) => {
    switch (type) {
      case "service":
        return <Tag className="h-4 w-4 text-primary" aria-hidden="true" />;
      case "guide":
        return <FileText className="h-4 w-4 text-primary" aria-hidden="true" />;
      case "page":
        return <Calendar className="h-4 w-4 text-primary" aria-hidden="true" />;
    }
  };

  const getTypeLabel = (type: SearchResult["type"]) => {
    switch (type) {
      case "service":
        return "Service";
      case "guide":
        return "Guide";
      case "page":
        return "Page";
    }
  };

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" aria-hidden="true" />
        <input
          ref={inputRef}
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            // Delay closing to allow click on results
            setTimeout(() => setIsOpen(false), 200);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 h-10 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          aria-label="Search"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-autocomplete="list"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        )}
      </div>

      {isOpen && query && (
        <div
          ref={resultsRef}
          id="search-results"
          className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg max-h-96 overflow-y-auto z-50"
          role="listbox"
        >
          {results.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              No results found for &quot;{query}&quot;
            </div>
          ) : (
            <ul className="py-2">
              {results.map((result, index) => (
                <li key={`${result.type}-${result.url}`}>
                  <Link
                    href={result.url}
                    className={cn(
                      "flex items-start gap-3 px-4 py-3 hover:bg-muted transition-colors",
                      index === selectedIndex && "bg-muted"
                    )}
                    role="option"
                    aria-selected={index === selectedIndex}
                    onClick={() => setIsOpen(false)}
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      {getTypeIcon(result.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">{result.title}</span>
                        <span className="text-xs text-muted-foreground">
                          {getTypeLabel(result.type)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-1">{result.description}</p>
                      {result.category && (
                        <span className="text-xs text-primary mt-1 inline-block">
                          {result.category}
                        </span>
                      )}
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-1" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
