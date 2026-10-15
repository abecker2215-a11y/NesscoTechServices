"use client";

import { useState } from "react";
import { Gift, Send, Link2, Check, MessageSquare, Mail } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/config";

const SHARE_TEXT = `Fix your Wi-Fi/computer without the IT-speak — Tampa Bay local, remote from $75. Take $25 off your first fix with my link:`;

export function ReferralPanel() {
  const [form, setForm] = useState({ yourName: "", yourEmail: "", friendName: "", friendEmail: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [code, setCode] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const shareUrl = typeof window !== "undefined" ? `${window.location.origin}/refer` : `https://${siteConfig.domain}/refer`;

  const set = (k: keyof typeof form, v: string) => {
    setForm((f) => ({ ...f, [k]: v }));
    if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; });
  };

  const share = async (channel: "sms" | "email" | "copy") => {
    trackEvent("referral_share", { channel });
    const text = `${SHARE_TEXT} ${shareUrl}`;
    if (channel === "sms") window.location.href = `sms:?&body=${encodeURIComponent(text)}`;
    else if (channel === "email") window.location.href = `mailto:?subject=${encodeURIComponent("$25 off Tampa Bay IT help")}&body=${encodeURIComponent(text)}`;
    else {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch { /* clipboard unavailable */ }
    }
  };

  const submit = async () => {
    const errs: Record<string, string> = {};
    if (!form.yourName.trim()) errs.yourName = "Required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.yourEmail.trim())) errs.yourEmail = "Invalid email";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.friendEmail.trim())) errs.friendEmail = "Invalid email";
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setStatus("sending");
    try {
      const res = await fetch("/api/refer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => null);
      if (res.ok && data?.ok) {
        setStatus("sent");
        setCode(data.code ?? null);
        trackEvent("referral_submit", { invited: String(data?.invited ?? false) });
      } else {
        setStatus("error");
        setErrors({ friendEmail: data?.error ?? "Couldn't send. Try the share buttons above instead." });
      }
    } catch {
      setStatus("error");
      setErrors({ friendEmail: "Couldn't send. Try the share buttons above instead." });
    }
  };

  if (status === "sent") {
    return (
      <div className="rounded-2xl border border-success/30 bg-success/5 p-6 text-center lg:p-8" role="status">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
          <Gift className="h-6 w-6" aria-hidden="true" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Referral sent!</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          Your friend gets <strong className="text-foreground">$25 off</strong> their first fix. When they book,
          you get <strong className="text-foreground">$25 credit</strong> — no caps, no expiry games.
        </p>
        {code && (
          <p className="mt-3 text-sm text-muted-foreground">
            Tracking code: <strong className="font-mono text-foreground">{code}</strong>
          </p>
        )}
      </div>
    );
  }

  const input =
    "w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="rounded-2xl border border-border bg-background p-6 lg:p-8">
        <h2 className="mb-1 text-xl font-bold text-foreground">Send it directly</h2>
        <p className="mb-5 text-sm text-muted-foreground">We&apos;ll email your friend the $25 invite and log your credit.</p>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ref-your-name" className="mb-1 block text-sm font-medium text-foreground">Your name</label>
              <input id="ref-your-name" value={form.yourName} onChange={(e) => set("yourName", e.target.value)} placeholder="Jane D." autoComplete="name" className={input} />
              {errors.yourName && <p className="mt-1 text-xs text-destructive">{errors.yourName}</p>}
            </div>
            <div>
              <label htmlFor="ref-your-email" className="mb-1 block text-sm font-medium text-foreground">Your email</label>
              <input id="ref-your-email" type="email" value={form.yourEmail} onChange={(e) => set("yourEmail", e.target.value)} placeholder="you@example.com" autoComplete="email" className={input} />
              {errors.yourEmail && <p className="mt-1 text-xs text-destructive">{errors.yourEmail}</p>}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="ref-friend-name" className="mb-1 block text-sm font-medium text-foreground">Friend&apos;s name <span className="font-normal text-muted-foreground">(optional)</span></label>
              <input id="ref-friend-name" value={form.friendName} onChange={(e) => set("friendName", e.target.value)} placeholder="Alex R." autoComplete="off" className={input} />
            </div>
            <div>
              <label htmlFor="ref-friend-email" className="mb-1 block text-sm font-medium text-foreground">Friend&apos;s email</label>
              <input id="ref-friend-email" type="email" value={form.friendEmail} onChange={(e) => set("friendEmail", e.target.value)} placeholder="friend@example.com" autoComplete="off" className={input} />
              {errors.friendEmail && <p className="mt-1 text-xs text-destructive">{errors.friendEmail}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={submit}
            disabled={status === "sending"}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors"
          >
            <Send className="h-4 w-4" aria-hidden="true" />
            {status === "sending" ? "Sending…" : "Send $25 to my friend"}
          </button>
          <p className="text-xs text-muted-foreground">No spam, ever. One invite email, and we log your $25 credit.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-border bg-muted/30 p-6 lg:p-8">
        <h2 className="mb-1 text-xl font-bold text-foreground">Or share it yourself</h2>
        <p className="mb-5 text-sm text-muted-foreground">Text, email, or drop it in the group chat — same $25 both ways.</p>
        <div className="space-y-3">
          <button type="button" onClick={() => share("sms")} className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-all hover:border-primary/50 hover:-translate-y-0.5">
            <MessageSquare className="h-5 w-5 text-primary" aria-hidden="true" />
            <span><span className="block font-medium text-foreground">Text the invite</span><span className="block text-xs text-muted-foreground">Opens your messaging app with the message ready</span></span>
          </button>
          <button type="button" onClick={() => share("email")} className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-all hover:border-primary/50 hover:-translate-y-0.5">
            <Mail className="h-5 w-5 text-primary" aria-hidden="true" />
            <span><span className="block font-medium text-foreground">Email the invite</span><span className="block text-xs text-muted-foreground">Opens your mail app with subject + link</span></span>
          </button>
          <button type="button" onClick={() => share("copy")} className="flex w-full items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 text-left transition-all hover:border-primary/50 hover:-translate-y-0.5">
            {copied ? <Check className="h-5 w-5 text-success" aria-hidden="true" /> : <Link2 className="h-5 w-5 text-primary" aria-hidden="true" />}
            <span><span className="block font-medium text-foreground">{copied ? "Copied!" : "Copy invite link"}</span><span className="block text-xs text-muted-foreground">Paste anywhere — Nextdoor, HOA group, group chat</span></span>
          </button>
        </div>
        <div className="mt-5 rounded-lg bg-background p-4 text-sm text-muted-foreground">
          <p className="font-medium text-foreground">Fine print (short on purpose):</p>
          <ul className="mt-1 space-y-1" role="list">
            <li>• $25 off friend&apos;s first paid fix, $25 credit for you when they book.</li>
            <li>• No limits. Credits never expire. Can&apos;t be combined with other offers.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
