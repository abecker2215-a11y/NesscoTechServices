"use client";

import { useEffect, useState } from "react";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui";
import { testimonials, type Testimonial } from "@/lib/testimonials";
import { siteConfig } from "@/lib/config";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase();
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={i < rating ? "h-4 w-4 fill-warning text-warning" : "h-4 w-4 text-border"} aria-hidden="true" />
      ))}
    </div>
  );
}

export function ReviewsWall() {
  const [items, setItems] = useState<Testimonial[]>(testimonials);
  const [live, setLive] = useState(false);
  const [rating, setRating] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (cancelled || !data) return;
        if (data.source === "google" && data.reviews?.length) {
          setItems(data.reviews);
          setLive(true);
          setRating(data.rating ?? null);
          setTotal(data.total ?? null);
        } else if (data.reviews?.length) {
          setItems(data.reviews);
        }
      })
      .catch(() => { /* curated fallback stays */ });
    return () => { cancelled = true; };
  }, []);

  return (
    <div>
      <div className="mx-auto mb-10 flex max-w-xl items-center justify-center gap-3 rounded-2xl border border-border bg-background p-5">
        <BadgeCheck className="h-8 w-8 shrink-0 text-success" aria-hidden="true" />
        <div className="text-left">
          {live && rating ? (
            <>
              <p className="text-2xl font-bold text-foreground">{rating.toFixed(1)} / 5</p>
              <p className="text-sm text-muted-foreground">from {total ?? "our"} live Google reviews</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-bold text-foreground">5.0 / 5</p>
              <p className="text-sm text-muted-foreground">from recent Tampa Bay jobs</p>
            </>
          )}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <figure key={`${t.name}-${t.service}`} className="flex flex-col rounded-xl border border-border bg-background p-6 lift-hover">
            <Stars rating={t.rating} />
            <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
              &ldquo;{t.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-border pt-4">
              {t.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={t.photoUrl} alt={t.name} className="h-10 w-10 rounded-full object-cover" loading="lazy" />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-600 text-sm font-bold text-primary-foreground" aria-hidden="true">
                  {initials(t.name)}
                </span>
              )}
              <div>
                <div className="text-sm font-semibold text-foreground">{t.name}</div>
                <div className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3 w-3" aria-hidden="true" />
                    {t.location}
                  </span>
                  <span aria-hidden="true">•</span>
                  <span className="font-medium text-primary">{t.service}</span>
                </div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>

      {siteConfig.googleReviewUrl && (
        <div className="mx-auto mt-10 max-w-2xl rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-6 text-center">
          <h2 className="text-lg font-bold text-foreground">Used us before?</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Reviews are how Tampa Bay finds honest IT help. Thirty seconds, huge help.
          </p>
          <div className="mt-4 flex flex-col justify-center gap-3 sm:flex-row">
            <Button href={siteConfig.googleReviewUrl}>Leave a Google review</Button>
            <Button variant="outline" href="/refer">Refer a friend, get $25</Button>
          </div>
        </div>
      )}
    </div>
  );
}
