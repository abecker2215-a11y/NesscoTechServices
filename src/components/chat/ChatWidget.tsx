"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { MessageCircle, X, Send, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { chatChips } from "@/lib/chat-knowledge";
import { trackEvent } from "@/lib/analytics";
import { siteConfig } from "@/lib/config";
import { isBusinessOpen, nextOpeningLabel } from "@/lib/hours";
import { cn } from "@/lib/utils";
import { useFocusTrap, useFocusRestore } from "@/lib/a11y";
import { useClientSnapshot } from "@/lib/use-is-mounted";

interface Msg {
  id: string;
  from: "bot" | "user";
  text: string;
  links?: { label: string; href: string }[];
  streaming?: boolean;
  error?: boolean;
  ticketNudge?: boolean;
  ticketRef?: string;
}

const TICKET_INTENT_RE =
  /call me|contact me|have (someone|anybody|a tech)|send (someone|a tech)|technician|real person|human|file (a )?ticket|book|schedule|appointment|come out|someone (call|reach|contact)|call ?back|ring me/i;

const GREETING: Msg = {
  id: "greeting",
  from: "bot",
  text: "Hi, I'm Nessco's AI assistant. Describe your tech problem in plain words — I'll point you to the right fix, guide, or service.",
};

const FALLBACK_SUGGESTIONS = [
  { label: "Wi-Fi is slow", query: "Wi-Fi is slow" },
  { label: "Email not syncing", query: "Email not syncing" },
  { label: "Virus alert", query: "Virus alert" },
  { label: "How much does it cost?", query: "How much does it cost?" },
  { label: "Book a call", query: "Book a call" },
  { label: "Microsoft 365 help", query: "Microsoft 365 help" },
];

interface StreamingChunk {
  delta: string;
  done: boolean;
  links?: { label: string; href: string }[];
  source?: "ai" | "rule" | "fallback";
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [msgs, setMsgs] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const afterHours = useClientSnapshot(() => !isBusinessOpen(), () => false);
  const backLabel = useClientSnapshot(() => nextOpeningLabel(), () => "8am");
  const [streaming, setStreaming] = useState(false);
  const [ticketOpen, setTicketOpen] = useState(false);
  const [ticketName, setTicketName] = useState("");
  const [ticketEmail, setTicketEmail] = useState("");
  const [ticketPhone, setTicketPhone] = useState("");
  const [ticketSummary, setTicketSummary] = useState("");
  const [ticketSending, setTicketSending] = useState(false);
  const [ticketError, setTicketError] = useState<string | null>(null);
  const nudgeShownRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const streamTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const dialogRef = useFocusTrap<HTMLDivElement>(open);
  const { saveFocus, restoreFocus } = useFocusRestore();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [msgs, open, loading, streaming]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    if (open) {
      saveFocus();
    } else {
      restoreFocus();
    }
  }, [open, saveFocus, restoreFocus]);

  const toggle = useCallback(() => {
    const next = !open;
    setOpen(next);
    if (next && !opened) {
      setOpened(true);
      trackEvent("chat_open", { after_hours: String(afterHours) });
      if (afterHours) {
        setMsgs([
          {
            id: "after-hours",
            from: "bot",
            text: `We're closed right now — back ${backLabel} ET. Ask away anyway: I'll point you to the right fix, and anything you start tonight is first in queue at 8am. Active security emergency? Call ${siteConfig.phone}.`,
          },
        ]);
      }
    }
  }, [open, opened, afterHours, backLabel]);

  const stopStreaming = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    if (streamTimeoutRef.current) {
      clearTimeout(streamTimeoutRef.current);
      streamTimeoutRef.current = null;
    }
    setStreaming(false);
    setLoading(false);
  }, []);

  const ask = useCallback(async (raw: string) => {
    const text = raw.trim();
    if (!text || loading) return;
    trackEvent("chat_ask", { q: text.slice(0, 120) });
    stopStreaming();

    const userMsg: Msg = { id: crypto.randomUUID(), from: "user", text };
    setMsgs((m) => [...m, userMsg]);
    setInput("");

    const botMsgId = crypto.randomUUID();
    const botMsg: Msg = { id: botMsgId, from: "bot", text: "", streaming: true };
    setMsgs((m) => [...m, botMsg]);
    setLoading(true);
    setStreaming(true);

    abortRef.current = new AbortController();

    try {
      const res = await fetch("/api/chat/stream", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...msgs, userMsg].map((m) => ({
            role: m.from === "user" ? "user" : "assistant",
            content: m.text,
          })),
        }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("Stream failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullReply = "";
      let links: { label: string; href: string }[] | undefined;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));
        for (const line of lines) {
          const data: StreamingChunk = JSON.parse(line.slice(6));
          if (data.delta) {
            fullReply += data.delta;
            setMsgs((m) =>
              m.map((msg) =>
                msg.id === botMsgId ? { ...msg, text: fullReply } : msg
              )
            );
          }
          if (data.done) {
            links = data.links;
          }
        }
      }

      setMsgs((m) =>
        m.map((msg) =>
          msg.id === botMsgId
            ? { ...msg, text: fullReply, streaming: false, links }
            : msg
        )
      );

      // Offer in-chat ticket filing when the visitor signals intent, or after
      // a couple of exchanges so nobody has to hunt for the contact form.
      const priorAssistantReplies = msgs.filter(
        (m) => m.from === "bot" && m.text && !m.ticketNudge
      ).length;
      if (
        !nudgeShownRef.current &&
        (TICKET_INTENT_RE.test(text) || priorAssistantReplies >= 1)
      ) {
        nudgeShownRef.current = true;
        const nudge: Msg = {
          id: crypto.randomUUID(),
          from: "bot",
          text: "Want me to file that as a ticket? You'll get a reference number and a callback within 2 business hours — no forms to hunt down.",
          ticketNudge: true,
        };
        setMsgs((m) => [...m, nudge]);
        trackEvent("chat_ticket_nudge", { intent: String(TICKET_INTENT_RE.test(text)) });
      }
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMsgs((m) =>
        m.map((msg) =>
          msg.id === botMsgId
            ? {
                ...msg,
                text: `Having trouble connecting — but a human can help. Start a 2-minute request and we'll reply within 2 business hours, or call ${siteConfig.phone}.`,
                streaming: false,
                error: true,
                links: [
                  { label: "Start a service request", href: "/get-help" },
                  { label: "Browse Fix-It Guides", href: "/guides" },
                ],
              }
            : msg
        )
      );
    } finally {
      stopStreaming();
    }
  }, [msgs, loading, stopStreaming]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    ask(input);
  };

  const openTicketForm = useCallback(() => {
    const lastUser = [...msgs].reverse().find((m) => m.from === "user");
    setTicketSummary(lastUser?.text ?? "");
    setTicketError(null);
    setTicketOpen(true);
    trackEvent("chat_ticket_open");
  }, [msgs]);

  const submitTicket = useCallback(async () => {
    const name = ticketName.trim();
    const email = ticketEmail.trim();
    const phone = ticketPhone.replace(/\D/g, "");
    const summary = ticketSummary.trim();
    if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setTicketError("Please add your name and a valid email.");
      return;
    }
    if (!/^\+?1?\d{10}$/.test(phone)) {
      setTicketError("Please add a 10-digit phone number.");
      return;
    }
    if (summary.length < 10) {
      setTicketError("Please describe the problem (min 10 characters).");
      return;
    }
    setTicketSending(true);
    setTicketError(null);
    try {
      const transcript = [...msgs, ...(summary ? [{ id: "t", from: "user" as const, text: summary }] : [])]
        .filter((m) => m.text)
        .slice(-10)
        .map((m) => ({ role: m.from === "user" ? "user" as const : "assistant" as const, content: m.text.slice(0, 500) }));
      const res = await fetch("/api/chat/ticket", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, summary, transcript }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) throw new Error(data?.message || "Failed to file ticket");
      setTicketOpen(false);
      setTicketName("");
      setTicketEmail("");
      setTicketPhone("");
      setTicketSummary("");
      const done: Msg = {
        id: crypto.randomUUID(),
        from: "bot",
        text: `Ticket filed — reference ${data.reference}. We'll call ${phone} within 2 business hours (Mon–Fri 8am–6pm). No charges until we agree on scope.`,
        ticketRef: data.reference as string,
      };
      setMsgs((m) => [...m, done]);
      trackEvent("chat_ticket_filed", { reference: String(data.reference) });
    } catch (err) {
      setTicketError(err instanceof Error ? err.message : "Couldn't file the ticket. Try again or call us.");
    } finally {
      setTicketSending(false);
    }
  }, [ticketName, ticketEmail, ticketPhone, ticketSummary, msgs]);

  return (
    <div className="fixed bottom-20 right-4 z-40 lg:bottom-6 lg:right-6 print:hidden">
      {open && (
        <div
          ref={dialogRef}
          className="mb-3 flex h-[min(520px,65vh)] w-[min(380px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-xl animate-fade-in-up"
          role="dialog"
          aria-label="Ask Nessco AI chat"
        >
          <div className="flex items-center justify-between border-b border-border bg-muted/50 px-4 py-3">
            <div>
              <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
                Ask Nessco AI
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[11px] font-medium",
                    afterHours ? "bg-muted text-muted-foreground" : "bg-success/10 text-success"
                  )}
                >
                  {afterHours ? `Closed · back ${backLabel}` : "Open now · ~2hr reply"}
                </span>
              </p>
              <p className="text-xs text-muted-foreground">Instant answers · no jargon</p>
            </div>
            <button
              type="button"
              onClick={toggle}
              className="rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {msgs.map((m) => (
              <div key={m.id} className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}>
                <div
                  className={cn(
                    "max-w-[85%] rounded-xl px-3.5 py-2.5 text-sm transition-all duration-200",
                    m.from === "user" ? "bg-primary text-primary-foreground" : "border border-border bg-muted/50 text-foreground",
                    m.streaming && "animate-pulse"
                  )}
                >
                  <p>{m.text}</p>
                  {m.ticketNudge && (
                    <button
                      type="button"
                      onClick={openTicketForm}
                      className="mt-2 inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-[13px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                      File a ticket — get a reference #
                      <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    </button>
                  )}
                  {m.ticketRef && (
                    <p className="mt-2 rounded-lg bg-success/10 px-2.5 py-1.5 text-[13px] font-semibold text-success">
                      Reference: <span className="font-mono">{m.ticketRef}</span>
                    </p>
                  )}
                  {m.links && !m.streaming && (
                    <div className="mt-2 space-y-1.5 animate-fade-in">
                      {m.links.map((l) => (
                        <Link
                          key={l.href + l.label}
                          href={l.href}
                          className={cn(
                            "flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-colors",
                            m.from === "user"
                              ? "bg-primary-foreground/15 hover:bg-primary-foreground/25"
                              : "bg-primary/10 text-primary hover:bg-primary/20"
                          )}
                        >
                          {l.label}
                          <ArrowRight className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                        </Link>
                      ))}
                    </div>
                  )}
                  {m.error && !m.streaming && (
                    <div className="mt-3 p-3 rounded-lg border border-border bg-muted/50 animate-fade-in-up">
                      <p className="text-xs font-medium text-muted-foreground mb-2">Try asking:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {FALLBACK_SUGGESTIONS.map((s) => (
                          <button
                            key={s.query}
                            type="button"
                            onClick={() => ask(s.query)}
                            disabled={loading}
                            className="rounded-full border border-border bg-background px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-50 tap-feedback"
                          >
                            {s.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && !streaming && (
              <div className="flex justify-start">
                <div className="flex items-center gap-2 rounded-xl border border-border bg-muted/50 px-3.5 py-2.5 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                  Thinking…
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <div className="border-t border-border p-3">
            {ticketOpen ? (
              <div className="space-y-2" aria-label="File a ticket">
                <p className="text-xs font-semibold text-foreground">File a ticket — we&apos;ll call you back</p>
                <input
                  value={ticketName}
                  onChange={(e) => setTicketName(e.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    value={ticketEmail}
                    onChange={(e) => setTicketEmail(e.target.value)}
                    placeholder="Email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                  <input
                    value={ticketPhone}
                    onChange={(e) => setTicketPhone(e.target.value)}
                    placeholder="Phone"
                    type="tel"
                    autoComplete="tel"
                    inputMode="tel"
                    className="min-w-0 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </div>
                <textarea
                  value={ticketSummary}
                  onChange={(e) => setTicketSummary(e.target.value)}
                  placeholder="What's happening?"
                  rows={2}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                {ticketError && (
                  <p className="text-xs text-destructive" role="alert">{ticketError}</p>
                )}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setTicketOpen(false)}
                    className="flex-1 rounded-lg border border-border px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={submitTicket}
                    disabled={ticketSending}
                    className="flex-1 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                  >
                    {ticketSending ? "Filing…" : "File ticket"}
                  </button>
                </div>
              </div>
            ) : (
            <>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {chatChips.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => ask(c)}
                  disabled={loading}
                  className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors disabled:opacity-50"
                >
                  {c}
                </button>
              ))}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
              <label htmlFor="nessco-chat-input" className="sr-only">
                Ask about your IT problem
              </label>
              <input
                id="nessco-chat-input"
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="e.g. my Wi-Fi keeps dropping…"
                className="min-w-0 flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                autoComplete="off"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
                aria-label="Send message"
              >
                {streaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                ) : (
                  <Send className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </form>
            </>
            )}
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? "Close Ask Nessco chat" : "Open Ask Nessco AI chat"}
        className="ml-auto flex h-13 w-13 items-center justify-center rounded-full bg-primary p-3.5 text-primary-foreground shadow-lg transition-all hover:bg-primary/90 hover:-translate-y-0.5 hover:shadow-xl"
      >
        {open ? <X className="h-6 w-6" aria-hidden="true" /> : <MessageCircle className="h-6 w-6" aria-hidden="true" />}
      </button>
    </div>
  );
}