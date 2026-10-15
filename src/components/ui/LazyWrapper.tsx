"use client";

import { Suspense, lazy, createElement, LazyExoticComponent, ComponentType } from "react";
import { PageErrorBoundary } from "./ErrorBoundary";

interface LazyWrapperProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorTitle?: string;
}

export function LazyWrapper({ 
  children, 
  fallback = <ComponentSkeleton />, 
  errorTitle 
}: LazyWrapperProps) {
  return (
    <PageErrorBoundary title={errorTitle}>
      <Suspense fallback={fallback}>
        {children}
      </Suspense>
    </PageErrorBoundary>
  );
}

export function lazyWithBoundary<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>,
  options?: { fallback?: React.ReactNode; errorTitle?: string }
): LazyExoticComponent<ComponentType<P>> {
  const LazyComponent = lazy(importFn);

  function BoundaryWrapped(props: P) {
    return (
      <PageErrorBoundary title={options?.errorTitle}>
        <Suspense fallback={options?.fallback ?? <ComponentSkeleton />}>
          {createElement(LazyComponent, props)}
        </Suspense>
      </PageErrorBoundary>
    );
  }

  return BoundaryWrapped as unknown as LazyExoticComponent<ComponentType<P>>;
}

function ComponentSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="h-8 bg-muted rounded w-3/4" />
      <div className="h-4 bg-muted rounded w-1/2" />
      <div className="space-y-4">
        <div className="h-16 bg-muted rounded" />
        <div className="h-16 bg-muted rounded" />
        <div className="h-16 bg-muted rounded" />
      </div>
    </div>
  );
}

export function ImageSkeleton({ className = "" }: { className?: string }) {
  return (
    <div 
      className={`
        animate-pulse bg-gradient-to-r from-muted via-muted-foreground/20 to-muted 
        bg-[length:200%_100%] animation-shimmer ${className}
      `}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="aspect-video bg-muted rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="h-4 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

export function TextSkeleton({ lines = 3, className = "" }: { lines?: number; className?: string }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div 
          key={i} 
          className="animate-pulse h-4 bg-muted rounded" 
          style={{ width: i === lines - 1 ? "60%" : "100%" }}
        />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="animate-pulse space-y-3">
      <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {Array.from({ length: cols }).map((_, i) => (
          <div key={i} className="h-4 bg-muted rounded" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, row) => (
        <div key={row} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
          {Array.from({ length: cols }).map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded" />
          ))}
        </div>
      ))}
    </div>
  );
}