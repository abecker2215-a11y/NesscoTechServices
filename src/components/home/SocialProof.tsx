"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, MapPin, BadgeCheck } from "lucide-react";
import { Reveal } from "@/components/ui";
import { testimonials, businessStats, type Testimonial } from "@/lib/testimonials";
import { siteConfig } from "@/lib/config";

function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function Avatar({ t }: { t: Testimonial }) {
  if (t.photoUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={t.photoUrl} alt={`${t.name}`} width={40} height={40} className="h-10 w-10 rounded-full object-cover" loading="lazy" />;
  }
  return (
    <span
      className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-600 text-sm font-bold text-primary-foreground"
      aria-hidden="true"
    >
      {initials(t.name)}
    </span>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" role="img" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={
            i < rating ? "h-4 w-4 fill-warning text-warning" : "h-4 w-4 text-border"
          }
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function HeroTestimonial() {
  const t = testimonials[0];
  return (
    <div className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-background/80 p-4 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-600 text-sm font-bold text-primary-foreground" aria-hidden="true">
        {t.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
      </div>
      <div className="min-w-0">
        <Stars rating={t.rating} />
        <p className="mt-1 text-sm text-muted-foreground truncate">
          &ldquo;{t.quote}&rdquo;
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          <span className="font-medium text-foreground">{t.name}</span> &middot; {t.location} &middot; {t.service}
        </p>
      </div>
    </div>
  );
}

interface ReviewsResponse {
  source: "google" | "fallback";
  rating?: number | null;
  total?: number | null;
  reviews: Testimonial[] | null;
}

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(testimonials);
  const [source, setSource] = useState<"google" | "fallback">("fallback");
  const [rating, setRating] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/reviews")
      .then((res) => (res.ok ? res.json() : null))
      .then((data: ReviewsResponse | null) => {
        if (cancelled || !data) return;
        if (data.source === "google" && data.reviews?.length) {
          setItems(data.reviews.slice(0, 3));
          setSource("google");
          setRating(data.rating ?? null);
          setTotal(data.total ?? null);
        }
      })
      .catch(() => {
        // Curated fallback stays in place — no layout shift, no error UI.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-16 lg:py-24" aria-labelledby="testimonials-heading">
      <div className="container">
        <Reveal>
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
              <BadgeCheck className="h-3.5 w-3.5 text-success" aria-hidden="true" />
              {source === "google" && rating
                ? `${rating.toFixed(1)}\u2605 from ${total ?? "our"} Google reviews`
                : "Real jobs, real neighbors"}
            </p>
            <h2
              id="testimonials-heading"
              className="mb-4 text-3xl font-bold text-foreground"
            >
              Tampa Bay folks who got fixed
            </h2>
            <p className="text-muted-foreground">
              A few recent jobs. Ask us for references — we&apos;re happy to connect you.
            </p>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            {items.map((t) => (
              <figure
                key={`${t.name}-${t.service}`}
                className="flex flex-col rounded-lg border border-border bg-background p-6 lift-hover"
              >
                <Stars rating={t.rating} />
                <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <figcaption className="mt-6 border-t border-border pt-4">
                  <div className="flex items-center gap-3">
                    <Avatar t={t} />
                    <div>
                      <div className="text-sm font-semibold text-foreground">{t.name}</div>
                      {t.date && <div className="text-xs text-muted-foreground">{t.date}</div>}
                    </div>
                  </div>
                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3 w-3" aria-hidden="true" />
                      {t.location}
                    </span>
                    <span aria-hidden="true">&middot;</span>
                    <span className="font-medium text-primary">{t.service}</span>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
          {siteConfig.googleReviewUrl && (
            <p className="mt-8 text-center text-sm text-muted-foreground">
              <Link
                href="/reviews"
                className="font-medium text-primary hover:underline"
              >
                Read all reviews \u2192
              </Link>
              {" \u00b7 "}
              Used us before?{" "}
              <a
                href={siteConfig.googleReviewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary hover:underline"
              >
                Leave us a Google review \u2192
              </a>
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}

export { businessStats };