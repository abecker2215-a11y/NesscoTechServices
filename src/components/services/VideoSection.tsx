"use client";

import { useState } from "react";
import { Play, X, Clock, BadgeCheck, Video } from "lucide-react";
import { JsonLd } from "@/components/layout/JsonLd";
import { trackEvent } from "@/lib/analytics";
import {
  getVideosForService,
  videoEmbedUrl,
  videoObjectSchema,
  type ServiceVideo,
} from "@/lib/videos";

/**
 * "Watch us fix it" section for service pages. Renders nothing until clips
 * are published in src/lib/videos.ts — plus a capture CTA so visitors can
 * request a video for their exact problem (feeds the content backlog).
 */
export function VideoSection({ serviceSlug, serviceTitle, pageUrl }: { serviceSlug: string; serviceTitle: string; pageUrl: string }) {
  const videos = getVideosForService(serviceSlug);
  const [active, setActive] = useState<ServiceVideo | null>(null);
  const [email, setEmail] = useState("");
  const [requested, setRequested] = useState(false);

  const requestVideo = async () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return;
    trackEvent("video_request", { service: serviceSlug });
    try {
      await fetch("/api/video-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), serviceSlug }),
      });
    } catch {
      // Non-blocking: still confirm locally.
    }
    setRequested(true);
  };

  return (
    <section className="py-12 sm:py-16 lg:py-24 bg-muted/30" aria-labelledby="video-proof-heading">
      {videos.map((v) => (
        <JsonLd key={v.id} data={videoObjectSchema(v, pageUrl)} />
      ))}
      <div className="container">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            <Video className="h-3.5 w-3.5" aria-hidden="true" />
            Video proof
          </p>
          <h2 id="video-proof-heading" className="fluid-3xl font-bold text-foreground mb-4">
            Watch us fix it
          </h2>
          <p className="fluid-base text-muted-foreground">
            Real {serviceTitle.toLowerCase()} jobs, 60–90 seconds each. Symptom, fix, outcome, price — no jargon.
          </p>
        </div>

        {videos.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
            {videos.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActive(v)}
                className="group text-left rounded-xl border border-border bg-background overflow-hidden lift-hover"
                aria-label={`Play video: ${v.title}`}
              >
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  {v.poster ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={v.poster} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
                  ) : null}
                  <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform group-hover:scale-110">
                    <Play className="h-6 w-6 ml-0.5" aria-hidden="true" />
                  </span>
                  <span className="absolute bottom-2 right-2 inline-flex items-center gap-1 rounded-md bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {v.duration}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-foreground leading-snug">{v.title}</p>
                  <p className="mt-1 inline-flex items-center gap-1 text-sm font-medium text-success">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                    {v.outcome}
                  </p>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="max-w-xl mx-auto rounded-xl border border-border bg-background p-6 text-center">
            <p className="font-semibold text-foreground">First {serviceTitle.toLowerCase()} clip is in the edit bay.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Drop your email and we&apos;ll send it the day it drops — plus tell us the exact problem you want filmed.
            </p>
            {requested ? (
              <p className="mt-4 rounded-lg bg-success/10 px-4 py-3 text-sm font-medium text-success" role="status">
                You&apos;re on the list. We film the most-requested fixes first.
              </p>
            ) : (
              <div className="mt-4 flex flex-col sm:flex-row gap-2">
                <label htmlFor="video-request-email" className="sr-only">Email for video drop alert</label>
                <input
                  id="video-request-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  autoComplete="email"
                  inputMode="email"
                  className="min-h-[48px] flex-1 rounded-lg border border-border bg-background px-3 py-2 text-base text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="button"
                  onClick={requestVideo}
                  className="min-h-[48px] rounded-lg bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
                >
                  Notify me
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70"
          role="dialog"
          aria-modal="true"
          aria-label={active.title}
          onClick={() => setActive(null)}
        >
          <div
            className="w-full max-w-3xl overflow-hidden rounded-2xl bg-black shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3">
              <p className="truncate text-sm font-medium text-white">{active.title}</p>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="rounded-md p-2 text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                aria-label="Close video"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              {active.provider === "mp4" ? (
                <video src={active.src} controls autoPlay className="h-full w-full" poster={active.poster} />
              ) : (
                <iframe
                  src={`${videoEmbedUrl(active)}?autoplay=1`}
                  title={active.title}
                  className="h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              )}
            </div>
            <p className="px-4 py-3 text-sm text-white/70">{active.transcript}</p>
          </div>
        </div>
      )}
    </section>
  );
}
