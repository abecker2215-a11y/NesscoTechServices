"use client";

import { useState } from "react";
import { Share2, ExternalLink, Link as LinkIcon, Check } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/lib/utils";

interface ShareButtonsProps {
  url?: string;
  title?: string;
  description?: string;
  className?: string;
}

export function ShareButtons({
  url,
  title,
  description: _description,
  className,
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = url || (typeof window !== "undefined" ? window.location.href : "");
  const shareTitle = title || document.title;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const shareLinks = [
    {
      name: "Facebook",
      icon: ExternalLink,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-600 hover:text-white",
    },
    {
      name: "Twitter",
      icon: ExternalLink,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`,
      color: "hover:bg-sky-500 hover:text-white",
    },
    {
      name: "LinkedIn",
      icon: ExternalLink,
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      color: "hover:bg-blue-700 hover:text-white",
    },
  ];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <span className="text-sm text-muted-foreground">Share:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            "p-2 rounded-lg border border-border bg-background transition-colors",
            link.color
          )}
          aria-label={`Share on ${link.name}`}
        >
          <link.icon className="h-4 w-4" aria-hidden="true" />
        </a>
      ))}
      <button
        onClick={handleCopy}
        className={cn(
          "p-2 rounded-lg border border-border bg-background transition-colors",
          copied ? "bg-success text-success-foreground" : "hover:bg-muted"
        )}
        aria-label="Copy link"
      >
        {copied ? (
          <Check className="h-4 w-4" aria-hidden="true" />
        ) : (
          <LinkIcon className="h-4 w-4" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}

export function ShareButton({ className }: { className?: string }) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
      } catch (err) {
        console.error("Share failed:", err);
      }
    }
  };

  if (typeof navigator === "undefined" || !navigator.share) {
    return null;
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      size="sm"
      className={className}
    >
      <Share2 className="h-4 w-4 mr-2" aria-hidden="true" />
      Share
    </Button>
  );
}
