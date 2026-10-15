"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular" | "card";
  width?: string | number;
  height?: string | number;
  lines?: number;
}

export function Skeleton({ 
  className, 
  variant = "text", 
  width, 
  height, 
  lines = 1,
  ...props 
}: SkeletonProps) {
  if (variant === "circular") {
    return (
      <div 
        className={cn("animate-pulse rounded-full bg-muted", className)}
        style={{ width, height, borderRadius: "50%" }}
        {...props}
      />
    );
  }

  if (variant === "rectangular") {
    return (
      <div 
        className={cn("animate-pulse rounded-lg bg-muted", className)}
        style={{ width, height }}
        {...props}
      />
    );
  }

  if (variant === "card") {
    return (
      <div className={cn("animate-pulse space-y-4", className)} {...props}>
        <div className="aspect-video bg-muted rounded-t-lg" />
        <div className="p-4 space-y-3">
          <div className="h-6 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-4 bg-muted rounded w-1/3" />
        </div>
      </div>
    );
  }

  // Text variant - multiple lines
  return (
    <div className={cn("animate-pulse space-y-2", className)} {...props}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="h-4 bg-muted rounded" 
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function PageSkeleton({ sections = 3 }: { sections?: number }) {
  return (
    <div className="animate-pulse space-y-12 py-12 lg:py-24">
      <div className="container">
        <div className="max-w-2xl mx-auto text-center">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-4" />
          <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: sections }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function SectionSkeleton({ 
  hasHeader = true, 
  cardCount = 3, 
  cardVariant = "card" 
}: { hasHeader?: boolean; cardCount?: number; cardVariant?: "card" | "text" }) {
  return (
    <div className="animate-pulse space-y-8 py-12 lg:py-24">
      <div className="container">
        {hasHeader && (
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="h-8 bg-muted rounded w-3/4 mx-auto mb-4" />
            <div className="h-4 bg-muted rounded w-1/2 mx-auto" />
          </div>
        )}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: cardCount }).map((_, i) => (
            <Skeleton key={i} variant={cardVariant} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function FormSkeleton({ fields = 4 }: { fields?: number }) {
  return (
    <form className="animate-pulse space-y-6 max-w-2xl mx-auto">
      {Array.from({ length: fields }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="h-4 bg-muted rounded w-1/4" />
          <div className="h-10 bg-muted rounded" />
        </div>
      ))}
      <div className="mt-6 flex justify-end">
        <div className="h-10 bg-muted rounded w-32" />
      </div>
    </form>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <div className="h-4 bg-muted rounded w-3/4" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row} className="border-b border-border/50">
              {Array.from({ length: cols }).map((_, col) => (
                <td key={col} className="px-4 py-3">
                  <div className="h-10 bg-muted rounded" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ListSkeleton({ items = 5, hasAvatar = true, hasMeta = true }: { items?: number; hasAvatar?: boolean; hasMeta?: boolean }) {
  return (
    <div className="animate-pulse space-y-4">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-border bg-background">
          {hasAvatar && (
            <div className="h-12 w-12 bg-muted rounded-full" />
          )}
          <div className="flex-1 min-w-0 space-y-1">
            <div className="h-4 bg-muted rounded w-1/3" />
            {hasMeta && <div className="h-3 bg-muted rounded w-1/4" />}
          </div>
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <section className="animate-pulse py-16 lg:py-24 overflow-hidden">
      <div className="container">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="max-w-xl space-y-6">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-10 bg-muted rounded w-48" />
            <div className="h-10 bg-muted rounded w-48" />
          </div>
          <div className="aspect-video bg-muted rounded-2xl" />
        </div>
      </div>
    </section>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="p-4 rounded-lg border border-border bg-background">
            <div className="h-4 bg-muted rounded w-1/2 mb-2" />
            <div className="h-8 bg-muted rounded w-1/3" />
          </div>
        ))}
      </div>
      <div className="border-t border-border pt-6 space-y-4">
        <div className="h-4 bg-muted rounded w-1/4 mb-4" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="p-4 rounded-lg border border-border bg-background">
              <div className="flex items-center justify-between gap-4">
                <div className="h-4 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}