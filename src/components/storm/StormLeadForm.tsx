"use client";

import { useState } from "react";
import { Mail, CheckCircle2, FileDown } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

/**
 * Lead capture on the storm-quiz result: email → full PDF report by email
 * + printable web report + 3-touch follow-up drip (unsubscribe anytime).
 */
export function StormLeadForm({
  score,
  answers,
  labels,
}: {
  score: number;
  answers: Record<string, number>;
  labels: Record<string, string>;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [reportUrl, setReportUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Please enter a valid email.");
      return;
    }
    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/storm-ready/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          score,
          answers: Object.fromEntries(
            Object.entries(answers).map(([qid, s]) => [qid, { score: s, label: labels[qid] ?? "" }])
          ),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || "Couldn't send the report.");
      setReportUrl(data.reportUrl as string);
      setStatus("sent");
      trackEvent("storm_report_requested", { score });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't send the report. Try again.");
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-success/30 bg-success/5 p-5" role="status">
        <p className="flex items-center gap-2 font-semibold text-foreground">
          <CheckCircle2 className="h-5 w-5 text-success" aria-hidden="true" />
          Report on its way to {email.trim()}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          PDF attached + printable version below. Two short follow-ups over the next week, unsubscribe anytime.
        </p>
        {reportUrl && (
          <a
            href={reportUrl}
            className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <FileDown className="h-4 w-4" aria-hidden="true" />
            Open my printable report
          </a>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-primary/30 bg-primary/5 p-5">
      <p className="flex items-center gap-2 font-semibold text-foreground">
        <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
        Email me the full report (PDF + fix list)
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Your score, every gap explained, and what to fix first. Plus the 10-minute backup checklist.
      </p>
      <div className="mt-3 grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <label htmlFor="storm-lead-name" className="sr-only">First name (optional)</label>
        <input
          id="storm-lead-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="First name (optional)"
          autoComplete="given-name"
          className="min-h-[48px] rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <label htmlFor="storm-lead-email" className="sr-only">Email</label>
        <input
          id="storm-lead-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          className="min-h-[48px] rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          type="button"
          onClick={submit}
          disabled={status === "sending"}
          className="min-h-[48px] rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {status === "sending" ? "Sending…" : "Send report"}
        </button>
      </div>
      {error && (
        <p className="mt-2 text-sm text-destructive" role="alert">{error}</p>
      )}
      <p className="mt-2 text-xs text-muted-foreground">No spam, ever. Report + 2 follow-ups, unsubscribe anytime.</p>
    </div>
  );
}
