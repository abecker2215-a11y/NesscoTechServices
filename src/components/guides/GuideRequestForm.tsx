"use client";

import { useState } from "react";
import Link from "next/link";
import { Lightbulb, Send, CheckCircle2 } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function GuideRequestForm() {
  const [topic, setTopic] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  const submit = async () => {
    if (topic.trim().length < 4) {
      setStatus("error");
      setError("Tell us a little more about the topic.");
      return;
    }
    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setError("That email looks off.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/guide-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topic.trim(), email: email.trim() }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setStatus("sent");
        trackEvent("guide_request", { topic: topic.trim().slice(0, 120) });
      } else {
        setStatus("error");
        setError(data?.error ?? "Couldn't send. Try again in a bit.");
      }
    } catch {
      setStatus("error");
      setError("Couldn't send. Try again in a bit.");
    }
  };

  if (status === "sent") {
    return (
      <div className="mx-auto max-w-xl rounded-xl border border-success/30 bg-success/5 p-6 text-center" role="status">
        <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-success" aria-hidden="true" />
        <p className="font-semibold text-foreground">Request logged — thank you!</p>
        <p className="mt-1 text-sm text-muted-foreground">
          We write the most-requested topics first. Need it fixed before then?{" "}
          <Link href="/get-help" className="font-medium text-primary hover:underline">Get help now</Link>.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-border bg-background p-6 lg:p-8">
      <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
        <Lightbulb className="h-5 w-5 text-primary" aria-hidden="true" />
        What should we write next?
      </h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Vote for the next guide. Most-requested topics get written first — leave your email and we&apos;ll send it to you.
      </p>
      <label htmlFor="guide-request-topic" className="mb-1 mt-4 block text-sm font-medium text-foreground">
        The topic you need
      </label>
      <input
        id="guide-request-topic"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="e.g. set up a printer on a Chromebook"
        autoComplete="off"
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <label htmlFor="guide-request-email" className="mb-1 mt-3 block text-sm font-medium text-foreground">
        Email <span className="font-normal text-muted-foreground">(optional — we&apos;ll send you the guide)</span>
      </label>
      <input
        id="guide-request-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        autoComplete="email"
        className="w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      {status === "error" && (
        <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>
      )}
      <button
        type="button"
        onClick={submit}
        disabled={status === "sending"}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
      >
        <Send className="h-4 w-4" aria-hidden="true" />
        {status === "sending" ? "Sending…" : "Request this guide"}
      </button>
    </div>
  );
}
