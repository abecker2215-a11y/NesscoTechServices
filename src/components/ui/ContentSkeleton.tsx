import { cn } from "@/lib/utils";

interface ContentSkeletonProps {
  className?: string;
  lines?: number;
}

export function ContentSkeleton({ className, lines = 3 }: ContentSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "h-4 bg-muted rounded animate-pulse",
            i === lines - 1 ? "w-3/4" : "w-full"
          )}
          aria-hidden="true"
        />
      ))}
    </div>
  );
}

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("p-6 rounded-lg border border-border bg-background", className)}>
      <div className="h-4 w-1/2 bg-muted rounded animate-pulse mb-4" aria-hidden="true" />
      <div className="h-3 w-full bg-muted rounded animate-pulse mb-2" aria-hidden="true" />
      <div className="h-3 w-3/4 bg-muted rounded animate-pulse mb-4" aria-hidden="true" />
      <div className="h-8 w-1/3 bg-muted rounded animate-pulse" aria-hidden="true" />
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 4 }: { rows?: number; columns?: number }) {
  return (
    <div className="w-full">
      <div className="border-b border-border pb-4 mb-4">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <div
              key={i}
              className="h-4 w-24 bg-muted rounded animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex gap-4 py-3 border-b border-border last:border-0">
          {Array.from({ length: columns }).map((_, j) => (
            <div
              key={j}
              className="h-3 flex-1 bg-muted rounded animate-pulse"
              aria-hidden="true"
            />
          ))}
        </div>
      ))}
    </div>
  );
}

export function HeroSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      <div className="h-12 w-3/4 bg-muted rounded animate-pulse" aria-hidden="true" />
      <div className="h-6 w-full bg-muted rounded animate-pulse" aria-hidden="true" />
      <div className="h-6 w-2/3 bg-muted rounded animate-pulse" aria-hidden="true" />
      <div className="flex gap-4 mt-8">
        <div className="h-12 w-32 bg-muted rounded animate-pulse" aria-hidden="true" />
        <div className="h-12 w-32 bg-muted rounded animate-pulse" aria-hidden="true" />
      </div>
    </div>
  );
}
