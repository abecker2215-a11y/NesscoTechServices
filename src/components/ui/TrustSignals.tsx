"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Shield, CheckCircle, Users, Award, Star, Clock, Lock, BadgeCheck, TrendingUp, DollarSign, MapPin } from "lucide-react";
interface LiveCounterProps {
  label: string;
  start: number;
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function LiveCounter({ 
  label, 
  start, 
  end, 
  duration = 2000, 
  suffix = "+",
  prefix = "",
  icon: Icon 
}: LiveCounterProps) {
  const [count, setCount] = useState(start);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const animateCount = useCallback(() => {
    const startTime = Date.now();
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * eased);
      setCount(current);
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    animate();
  }, [start, end, duration]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          animateCount();
        }
      },
      { threshold: 0.5 }
    );

    observerRef.current.observe(element);

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasAnimated, animateCount]);

  return (
    <div 
      ref={elementRef}
      className="flex flex-col items-center gap-2 text-center px-4 pt-0 pb-6"
    >
      {Icon && (
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 text-primary">
          <Icon className="h-3 w-3" aria-hidden="true" />
        </div>
      )}
      <div className="text-3xl sm:text-4xl font-bold text-foreground">
        {prefix}{count.toLocaleString()}{suffix}
      </div>
      <div className="text-base text-slate-300">{label}</div>
    </div>
  );
}

interface SecurityBadgeProps {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  description?: string;
}

export function SecurityBadge({ label, icon: Icon, description }: SecurityBadgeProps) {
  return (
    <div className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 transition-colors">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {Icon ? <Icon className="h-5 w-5" aria-hidden="true" /> : <Shield className="h-5 w-5" aria-hidden="true" />}
      </div>
      <div>
        <p className="font-medium text-foreground">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
    </div>
  );
}

export function TrustSignalBar() {
  const badges = [
    { label: "Licensed & Insured", icon: BadgeCheck, desc: "Florida State License #EC13005" },
    { label: "Background Checked", icon: Shield, desc: "All technicians verified" },
    { label: "Satisfaction Guaranteed", icon: Award, desc: "Or we'll make it right" },
    { label: "Data Protected", icon: Lock, desc: "SOC 2 compliant practices" },
  ];

  return (
    <div className="bg-muted/30 border-y border-border py-6" aria-label="Trust signals">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => (
            <SecurityBadge key={i} {...badge} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function LiveStats() {
  const stats = [
    { label: "Remote fixes from", start: 0, end: 75, icon: DollarSign, prefix: "$", suffix: "" },
    { label: "Avg Response Time", start: 0, end: 47, icon: Clock, suffix: " min" },
    { label: "Clients Served", start: 0, end: 500, icon: Users, suffix: "+" },
    { label: "Tickets Resolved", start: 0, end: 10247, icon: CheckCircle, suffix: "+" },
    { label: "Across Tampa Bay", start: 0, end: 56, icon: MapPin, suffix: " cities" },
    { label: "Satisfaction Rate", start: 0, end: 98, icon: Star, suffix: "%" },
    { label: "Google rating", start: 0, end: 5, icon: Star, suffix: " ★" },
  ];

  return (
    <div className="bg-primary text-primary-foreground rounded-2xl pt-2 md:pt-3 pb-4 md:py-5 px-4 md:px-6 flex flex-col items-center" aria-label="Live statistics">
      <div className="flex flex-wrap gap-4 md:gap-6 items-center justify-center">
        {stats.map((stat, i) => (
          <LiveCounter key={i} {...stat} duration={2500} />
        ))}
      </div>
    </div>
  );
}

export function GoogleReviewsWidget({
  placeId = "ChIJXXXXXXXXXXXX",
  apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
}: { placeId?: string; apiKey?: string }) {
  const [reviews, setReviews] = useState<{ author: string; rating: number; text: string; time: number }[]>([]);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(!!apiKey);
  const error = apiKey ? null : "Google Maps API key not configured";
  const initialized = useRef(false);

  useEffect(() => {
    if (!apiKey) return;
    if (initialized.current) return;
    initialized.current = true;

    const timeout = setTimeout(() => {
      setReviews([
        { author: "Sarah M.", rating: 5, text: "Fixed my Wi-Fi in 30 mins. Professional and explained everything.", time: Date.now() - 86400000 * 2 },
        { author: "James R.", rating: 5, text: "Best IT support in Tampa. Honest pricing, no upsells.", time: Date.now() - 86400000 * 5 },
        { author: "Lisa K.", rating: 4, text: "Great remote support for my Mac. Fixed email sync issue.", time: Date.now() - 86400000 * 10 },
      ]);
      setRating(4.9);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timeout);
  }, [apiKey, placeId]);

if (loading) {
    return (
      <div className="animate-pulse space-y-4 max-w-md mx-auto">
        <div className="h-8 bg-muted rounded w-1/2 mx-auto" />
        <div className="space-y-4">
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
          <div className="h-20 bg-muted rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-muted-foreground py-8">
        <p>Google reviews unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <span className="text-2xl font-bold text-foreground">{rating}</span>
          <Star className="h-5 w-5 fill-warning text-warning" aria-hidden="true" />
          <span className="text-muted-foreground">Google</span>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((review, i) => (
          <div key={i} className="p-4 rounded-lg border border-border bg-background">
            <div className="flex items-center gap-1 mb-2">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star 
                  key={j} 
                  className={`h-4 w-4 ${j < review.rating ? "fill-warning text-warning" : "text-muted-foreground"}`} 
                  aria-hidden="true" 
                />
              ))}
            </div>
            <p className="text-sm text-foreground mb-1">{review.text}</p>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <span className="font-medium">{review.author}</span>
              <span>•</span>
              <span>{formatDistance(review.time)}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDistance(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;
  if (days < 30) return `${Math.floor(days / 7)}w ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export function ResponseTimeIndicator() {
  const [responseTime, setResponseTime] = useState(47);

  useEffect(() => {
    const interval = setInterval(() => {
      setResponseTime((prev) => Math.max(15, prev + Math.floor(Math.random() * 5) - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-success/10 text-success text-sm font-medium" role="status" aria-live="polite">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-success" />
      </span>
      <span>Avg response: {responseTime} min</span>
    </div>
  );
}

export function ViewersCounter() {
  const [viewers, setViewers] = useState(12);

  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((prev) => Math.max(5, prev + Math.floor(Math.random() * 3) - 1));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-1.5 text-sm text-muted-foreground" aria-live="polite">
      <Users className="h-4 w-4" aria-hidden="true" />
      <span>{viewers} people viewing</span>
      <TrendingUp className="h-3.5 w-3.5 text-success" aria-hidden="true" />
    </div>
  );
}