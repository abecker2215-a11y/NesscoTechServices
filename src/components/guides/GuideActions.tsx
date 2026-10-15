"use client";

import { useState } from "react";
import Link from "next/link";
import { ThumbsUp, ThumbsDown, Link2, Check, Printer, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui";
import { trackEvent } from "@/lib/analytics";
import { cn } from "@/lib/utils";

interface GuideActionsProps {
  slug: string;
  title: string;
  helpCategory: string;
}

export function GuideActions({ slug, title, helpCategory }: GuideActionsProps) {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);
  const [copied, setCopied] = useState(false);

  const feedback = (v: "yes" | "no") => {
    setVote(v);
    trackEvent("guide_feedback", { slug, helpful: v });
  };

  const copyLink = async () => {
    const url = `${window.location.origin}/guides/${slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
    trackEvent("guide_copy_link", { slug });
  };

  const print = () => {
    trackEvent("guide_print", { slug });
    window.print();
  };

  return (
    <div className="mt-10 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium text-foreground">Was this guide helpful?</span>
        <button
          type="button"
          onClick={() => feedback("yes")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
            vote === "yes"
              ? "border-success bg-success/10 text-foreground"
              : "border-border text-muted-foreground hover:border-success/50 hover:text-foreground"
          )}
        >
          <ThumbsUp className="h-4 w-4" aria-hidden="true" />
          Yes
        </button>
        <button
          type="button"
          onClick={() => feedback("no")}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors",
            vote === "no"
              ? "border-primary bg-primary/10 text-foreground"
              : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
          )}
        >
          <ThumbsDown className="h-4 w-4" aria-hidden="true" />
          Not quite
        </button>
        <span className="mx-1 hidden h-4 w-px bg-border sm:block" aria-hidden="true" />
        <button
          type="button"
          onClick={copyLink}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Link2 className="h-4 w-4" aria-hidden="true" />}
          {copied ? "Copied" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={print}
          className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <Printer className="h-4 w-4" aria-hidden="true" />
          Print checklist
        </button>
      </div>

      {vote === "no" && (
        <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
          <p className="font-semibold text-foreground">No worries — we pick up where the guide leaves off.</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Mention <span className="font-mono font-medium">“{title.split(/[—:(]/)[0].trim()}”</span> and get $25 off
            your first remote fix.
          </p>
          <Button className="mt-4" href={`/get-help?category=${helpCategory}`}>
            Get help with this
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      )}
      {vote === "yes" && (
        <p className="text-sm text-muted-foreground">
          Glad it helped — if it comes back, you know where to find us.{" "}
          <Link href="/guides" className="font-medium text-primary hover:underline">
            Browse all guides
          </Link>
          .
        </p>
      )}
    </div>
  );
}
