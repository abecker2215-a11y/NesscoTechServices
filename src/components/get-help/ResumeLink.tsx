"use client";

import { useState } from "react";
import { MailCheck, Send } from "lucide-react";

export function ResumeLink({ step }: { step: number }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const send = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setStatus("error");
      setMessage("Enter a valid email address.");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/resume-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), step }),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setStatus("sent");
        setMessage(
          data.emailed
            ? "Link sent — open it on this device to pick up where you left off."
            : "Saved. Email delivery isn't configured yet — your progress is still saved on this device."
        );
      } else {
        setStatus("error");
        setMessage(data?.error ?? "Couldn't send right now. Your progress is still saved on this device.");
      }
    } catch {
      setStatus("error");
      setMessage("Couldn't send right now. Your progress is still saved on this device.");
    }
  };

  if (status === "sent") {
    return (
      <p className="flex items-start gap-2 rounded-lg border border-success/30 bg-success/5 p-3 text-sm text-foreground" role="status">
        <MailCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
        {message}
      </p>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-muted/40 p-3">
      <p className="text-sm font-medium text-foreground">Need to finish later?</p>
      <p className="mb-2 text-xs text-muted-foreground">We&apos;ll email a resume link. Same device + browser picks up your answers.</p>
      <div className="flex gap-2">
        <label htmlFor="resume-email" className="sr-only">
          Email for resume link
        </label>
        <input
          id="resume-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className="min-w-0 flex-1 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={send}
          disabled={status === "sending"}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
        >
          <Send className="h-4 w-4" aria-hidden="true" />
          {status === "sending" ? "Sending…" : "Send link"}
        </button>
      </div>
      {status === "error" && (
        <p className="mt-2 text-xs text-destructive" role="alert">
          {message}
        </p>
      )}
    </div>
  );
}
