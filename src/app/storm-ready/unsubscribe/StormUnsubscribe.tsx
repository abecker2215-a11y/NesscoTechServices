"use client";

import { use, useState } from "react";

export function StormUnsubscribe({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = use(searchParams);
  const [status, setStatus] = useState<"idle" | "working" | "done" | "error">("idle");

  const unsubscribe = async () => {
    if (!token) {
      setStatus("error");
      return;
    }
    setStatus("working");
    try {
      const res = await fetch("/api/storm-ready/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "done") {
    return <p className="text-muted-foreground" role="status">Done — no more storm follow-ups. Your report link still works.</p>;
  }

  return (
    <div>
      <p className="text-muted-foreground mb-6">One click stops the follow-up emails. Your report link keeps working.</p>
      <button
        type="button"
        onClick={unsubscribe}
        disabled={status === "working" || !token}
        className="min-h-[48px] rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
      >
        {status === "working" ? "Working…" : "Unsubscribe me"}
      </button>
      {status === "error" && (
        <p className="mt-3 text-sm text-destructive" role="alert">Something went wrong — reply to any email instead.</p>
      )}
    </div>
  );
}
