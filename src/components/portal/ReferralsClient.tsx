"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Gift,
  Copy,
  Check,
  MessageSquare,
  Mail,
  TicketCheck,
  DollarSign,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Referral {
  id: string;
  code: string;
  referrerName: string;
  referrerEmail: string;
  friendName: string | null;
  friendEmail: string | null;
  status: string;
  createdAt: string;
  convertedAt: string | null;
  creditIssuedAt: string | null;
}

interface ReferralsData {
  user: { name: string | null; email: string; clientSlug: string };
  shareLink: string;
  shareCode: string;
  referrals: Referral[];
  earnedCredits: number;
}

const statusConfig: Record<string, { label: string; class: string }> = {
  SENT: { label: "Invite sent", class: "bg-blue-100 text-blue-800" },
  BOOKED: { label: "Friend booked — credit ready", class: "bg-green-100 text-green-800" },
  CONVERTED: { label: "Converted — credit ready", class: "bg-green-100 text-green-800" },
  CREDITED: { label: "$25 credited", class: "bg-purple-100 text-purple-800" },
};

export function ReferralsClient({ initialData }: { initialData: ReferralsData }) {
  const { shareLink, shareCode, referrals, earnedCredits } = initialData;
  const [copied, setCopied] = useState(false);
  const [issuing, setIssuing] = useState<string | null>(null);
  const [issued, setIssued] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<string | null>(null);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard unavailable
    }
  };

  const issueCredit = async (id: string) => {
    setIssuing(id);
    setError(null);
    try {
      const res = await fetch("/api/portal/referrals/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || "Couldn't issue credit");
      setIssued((s) => ({ ...s, [id]: true }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't issue credit");
    } finally {
      setIssuing(null);
    }
  };

  const pending = referrals.filter((r) => r.status === "BOOKED" || r.status === "CONVERTED").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Referrals — give $25, get $25</h1>
        <p className="text-muted-foreground mt-1">Share your link. When a friend books, issue your $25 credit in one click.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-background rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <DollarSign className="h-4 w-4" /> Credits earned
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">${earnedCredits.toFixed(2)}</p>
        </div>
        <div className="bg-background rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <TicketCheck className="h-4 w-4" /> Friends referred
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{referrals.length}</p>
        </div>
        <div className="bg-background rounded-lg border border-border p-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" /> Credits ready
          </div>
          <p className="mt-1 text-2xl font-bold text-foreground">{pending}</p>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border p-5">
        <h2 className="font-semibold text-foreground flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" /> Your personal referral link
        </h2>
        <div className="mt-3 flex flex-col sm:flex-row gap-2">
          <code className="flex-1 min-w-0 truncate rounded-lg bg-muted border border-border px-3 py-2.5 font-mono text-sm">
            {shareLink}
          </code>
          <button
            type="button"
            onClick={() => copy(shareLink)}
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors min-h-[44px]"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <a
            href={`sms:?&body=${encodeURIComponent(`Fix your tech without the IT-speak — Tampa Bay local. Take $25 off your first fix: ${shareLink}`)}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 transition-colors"
          >
            <MessageSquare className="h-4 w-4" /> Text it
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent("$25 off Tampa Bay IT help")}&body=${encodeURIComponent(`Take $25 off your first fix: ${shareLink}`)}`}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 transition-colors"
          >
            <Mail className="h-4 w-4" /> Email it
          </a>
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted border border-border px-3 py-2 text-sm text-muted-foreground">
            Code: <strong className="font-mono text-foreground">{shareCode}</strong>
          </span>
        </div>
      </div>

      <div className="bg-background rounded-lg border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-semibold text-foreground">Your referrals</h2>
        </div>
        {referrals.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            No referrals yet. <span className="text-primary font-medium">Share your link above</span> — credits land here automatically when friends book.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {referrals.map((r) => {
              const cfg = statusConfig[r.status] ?? { label: r.status, class: "bg-muted text-gray-800" };
              const ready = (r.status === "BOOKED" || r.status === "CONVERTED") && !issued[r.id];
              const done = r.status === "CREDITED" || issued[r.id];
              return (
                <li key={r.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {r.friendName || r.friendEmail || "Friend"}
                    </p>
                    <p className="text-sm text-muted-foreground truncate">
                      {r.friendEmail} · <span className="font-mono">{r.code}</span> ·{" "}
                      {new Date(r.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={cn("inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium", cfg.class)}>
                    {done ? "$25 credited" : cfg.label}
                  </span>
                  {ready && (
                    <button
                      type="button"
                      onClick={() => issueCredit(r.id)}
                      disabled={issuing === r.id}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 min-h-[44px]"
                    >
                      <DollarSign className="h-4 w-4" />
                      {issuing === r.id ? "Issuing…" : "Issue $25 credit"}
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        )}
        {error && (
          <p className="px-5 py-3 text-sm text-red-600 flex items-center gap-1.5" role="alert">
            <AlertTriangle className="h-4 w-4" /> {error}
          </p>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        Credits apply to your next invoice automatically. Questions?{" "}
        <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.
      </p>
    </div>
  );
}

