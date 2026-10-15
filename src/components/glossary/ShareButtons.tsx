"use client";

import { ExternalLink } from "lucide-react";

interface ShareButtonsProps {
  term: string;
  definition: string;
  url: string;
}

export function ShareButtons({ term, definition, url }: ShareButtonsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: `${term} — IT Glossary`,
        text: definition,
        url,
      });
    } else {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
      >
        <ExternalLink className="h-4 w-4" aria-hidden="true" />
        Share
      </button>
      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-border bg-background hover:bg-muted transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
        Copy Link
      </button>
    </div>
  );
}