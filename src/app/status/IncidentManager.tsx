"use client";

import { useState } from "react";

/** Staff-only incident composer (rendered only for staff sessions). */
export function IncidentManager() {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  const submit = async () => {
    if (title.trim().length < 4 || text.trim().length < 4) return;
    setStatus("sending");
    try {
      const res = await fetch("/api/incidents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), text: text.trim() }),
      });
      if (!res.ok) throw new Error();
      setTitle("");
      setText("");
      setStatus("sent");
      setTimeout(() => window.location.reload(), 800);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="mt-8 rounded-xl border border-border bg-muted/30 p-5">
      <h2 className="font-semibold text-foreground mb-1">Log an incident (staff)</h2>
      <p className="text-xs text-muted-foreground mb-3">Visible publicly the moment you post it.</p>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="e.g. Portal logins slow"
        className="min-h-[48px] mb-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What's happening + what we're doing…"
        rows={2}
        className="min-h-[48px] w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
      <button
        type="button"
        onClick={submit}
        disabled={status === "sending"}
        className="mt-2 min-h-[44px] rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {status === "sending" ? "Posting…" : status === "sent" ? "Posted ✓" : "Post incident"}
      </button>
      {status === "error" && <p className="mt-2 text-sm text-destructive" role="alert">Couldn&apos;t post. Try again.</p>}
    </div>
  );
}
