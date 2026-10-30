"use client";

import { useState } from "react";
import { Siren, Phone } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/config";
import { isBusinessOpen } from "@/lib/hours";

export function EmergencyForm() {
  const afterHours =
    typeof window !== "undefined" ? !isBusinessOpen() : true;
  const [form, setForm] = useState({ name: "", phone: "", email: "", description: "" });
  const [agreed, setAgreed] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ reference: string; statusUrl: string } | null>(null);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async () => {
    if (form.name.trim().length < 2) return setError("Please add your name.");
    if (!/^\+?1?\d{10}$/.test(form.phone.replace(/\D/g, ""))) return setError("Please add a 10-digit phone number.");
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      return setError("That email looks off (optional — clear it to skip).");
    if (form.description.trim().length < 10) return setError("Describe the emergency (min 10 characters).");
    if (!agreed) return setError("Please confirm the 1.5x after-hours rate.");
    setError(null);
    setStatus("sending");
    try {
      const res = await fetch("/api/emergency", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.replace(/\D/g, ""),
          email: form.email.trim() || undefined,
          description: form.description.trim(),
        }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || "Couldn't page the tech.");
      setResult({ reference: data.reference, statusUrl: data.statusUrl });
      setStatus("sent");
      trackEvent("emergency_submit", { reference: String(data.reference) });
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Couldn't page the tech. Call directly.");
    }
  };

  if (status === "sent" && result) {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6 lg:p-8 text-center" role="status">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <Siren className="h-7 w-7" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Tech paged — reference {result.reference}</h2>
        <p className="mx-auto mt-2 max-w-md text-muted-foreground">
          A technician will call <strong className="text-foreground">{form.phone}</strong> ASAP.
          Track it live below. If this is ransomware or a breach in progress, call now — don&apos;t wait.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={result.statusUrl}
            className="inline-flex min-h-[48px] items-center justify-center rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground hover:bg-primary/90 transition-colors w-full sm:w-auto"
          >
            Track live status
          </a>
          <a
            href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
            className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-lg border border-border bg-background px-6 py-3 font-semibold text-foreground hover:border-primary/50 transition-colors w-full sm:w-auto"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Call {siteConfig.phone}
          </a>
        </div>
      </div>
    );
  }

  const input =
    "min-h-[48px] w-full rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="rounded-2xl border border-destructive/30 bg-background p-6 lg:p-8">
      <div className="mb-5 flex items-start gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
          <Siren className="h-6 w-6" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-xl font-bold text-foreground">Page the on-call tech</h2>
          <p className="text-sm text-muted-foreground">
            For active outages, ransomware, or down-business emergencies{afterHours ? " — after hours now" : ""}.
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="emg-name" className="mb-1 block text-sm font-medium text-foreground">Your name</label>
          <input id="emg-name" value={form.name} onChange={(e) => set("name", e.target.value)} placeholder="Jane D." autoComplete="name" className={input} />
        </div>
        <div>
          <label htmlFor="emg-phone" className="mb-1 block text-sm font-medium text-foreground">Callback number</label>
          <input id="emg-phone" type="tel" value={form.phone} onChange={(e) => set("phone", e.target.value)} placeholder="(813) 555-0123" autoComplete="tel" inputMode="tel" className={input} />
        </div>
      </div>
      <div className="mt-3">
        <label htmlFor="emg-email" className="mb-1 block text-sm font-medium text-foreground">Email <span className="font-normal text-muted-foreground">(optional — for the receipt)</span></label>
        <input id="emg-email" type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" autoComplete="email" inputMode="email" className={input} />
      </div>
      <div className="mt-3">
        <label htmlFor="emg-desc" className="mb-1 block text-sm font-medium text-foreground">What&apos;s down?</label>
        <textarea id="emg-desc" value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="e.g. Ransomware on front-desk PC, server room smells like burning, whole office offline…" rows={3} className={input} />
      </div>

      <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
        <input
          id="emergency-terms"
          name="emergencyTerms"
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-1 h-5 w-5 shrink-0 accent-[var(--primary)]"
        />
        <span className="text-sm text-foreground">
          I understand after-hours emergencies bill at <strong>1.5x</strong> ($112.50/hr remote, $187.50/hr on-site)
          and a technician will call me back ASAP.
        </span>
      </label>

      {error && (
        <p className="mt-3 text-sm text-destructive" role="alert">{error}</p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={status === "sending"}
        className="mt-4 inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-lg bg-destructive px-6 py-3 font-semibold text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50"
      >
        <Siren className="h-5 w-5" aria-hidden="true" />
        {status === "sending" ? "Paging…" : "Page the tech now"}
      </button>
      <p className="mt-2 text-center text-xs text-muted-foreground">
        Ransomware or breach in progress? Skip the form — call {siteConfig.phone} immediately.
      </p>
    </div>
  );
}
