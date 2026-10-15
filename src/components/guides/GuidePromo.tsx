"use client";

import { useState } from "react";
import { MailPlus, Send, CheckCircle2, Flame } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { guideLevel, getPopularGuides } from "@/lib/guides";
import Link from "next/link";

export function PopularStrip() {
  const popular = getPopularGuides();
  if (popular.length === 0) return null;
  return (
    <div className="mx-auto mb-12 max-w-5xl">
      <p className="mb-4 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-primary">
        <Flame className="h-4 w-4" aria-hidden="true" />
        Most popular this season
      </p>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {popular.slice(0, 8).map((g) => (
          <Link
            key={g.slug}
            href={`/guides/${g.slug}`}
            className="block rounded-lg border border-border bg-background p-4 lift-hover hover:border-primary/50 transition-colors"
          >
            <span className="block text-sm font-semibold text-foreground line-clamp-2">{g.title.split(/[—:(]/)[0].trim()}</span>
            <span className="mt-1 block text-xs text-muted-foreground">
              {g.readMinutes} min · {guideLevel(g)}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function GuideSubscribe() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setError("Enter a valid email address.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setStatus("sent");
        trackEvent("newsletter_subscribe", {});
      } else {
        setStatus("error");
        setError(data?.error ?? "Couldn't subscribe. Try again in a bit.");
      }
    } catch {
      setStatus("error");
      setError("Couldn't subscribe. Try again in a bit.");
    }
  };

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-success/30 bg-success/5 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" aria-hidden="true" />
        <p className="font-semibold text-foreground">You&apos;re on the list!</p>
        <p className="mt-1 text-sm text-muted-foreground">One short email per new guide. Unsubscribe anytime.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-muted/30 p-6 text-center">
      <MailPlus className="mx-auto mb-2 h-8 w-8 text-primary" aria-hidden="true" />
      <h2 className="text-lg font-bold text-foreground">Get new guides by email</h2>
      <p className="mt-1 text-sm text-muted-foreground">One short email per new guide — usually 1–2 a month. No spam, ever.</p>
      <div className="mt-4 flex gap-2">
        <label htmlFor="guide-subscribe-email" className="sr-only">Email for new guides</label>
        <input
          id="guide-subscribe-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={submit}
          disabled={status === "sending"}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {status === "sending" ? "Joining…" : "Notify me"}
        </button>
      </div>
      {status === "error" && <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>}
      <p className="mt-3 text-xs text-muted-foreground">Join for new guides only — no promotions, unsubscribe anytime.</p>
    </div>
  );
}
