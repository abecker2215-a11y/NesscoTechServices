import { NextResponse, NextRequest } from "next/server";
import { testimonials } from "@/lib/testimonials";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";

interface GoogleReview {
  author_name: string;
  rating: number;
  text: string;
  relative_time_description?: string;
}

/**
 * Live Google reviews when configured (GOOGLE_MAPS_API_KEY + GOOGLE_PLACE_ID),
 * otherwise a fallback flag so the UI renders curated local testimonials.
 *
 * TODO: Create a server API key at https://console.cloud.google.com
 * (Places API → Place Details), add your Place ID, and set both env vars.
 * Until then the homepage shows the curated fallback quotes.
 */
export async function GET(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`reviews:${ip}`, rateLimits.api.limit, rateLimits.api.windowMs);
  if (!limit.ok) {
    return NextResponse.json(
      { source: "fallback" as const, reviews: testimonials.slice(0, 3) },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  const apiKey = process.env.GOOGLE_MAPS_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ source: "fallback" as const, reviews: null });
  }

  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${encodeURIComponent(placeId)}` +
      `&fields=name,rating,user_ratings_total,reviews` +
      `&key=${encodeURIComponent(apiKey)}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) throw new Error(`Places API ${res.status}`);
    const payload = await res.json();
    if (payload.status !== "OK") throw new Error(`Places API: ${payload.status}`);

    const reviews = ((payload.result?.reviews ?? []) as GoogleReview[]).slice(0, 3).map((r) => ({
      name: r.author_name,
      location: payload.result?.name ?? "Google review",
      service: "Verified Google review",
      quote: r.text,
      rating: r.rating,
      source: "google" as const,
    }));

    return NextResponse.json({
      source: "google" as const,
      rating: payload.result?.rating ?? null,
      total: payload.result?.user_ratings_total ?? null,
      reviews: reviews.length > 0 ? reviews : null,
    });
  } catch (error) {
    console.error("Google reviews fetch failed, using fallback:", error);
    return NextResponse.json({
      source: "fallback" as const,
      reviews: testimonials.slice(0, 3),
    });
  }
}
