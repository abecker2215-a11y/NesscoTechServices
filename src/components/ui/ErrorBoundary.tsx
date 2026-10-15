"use client";

import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui";
import { RefreshCw, AlertTriangle, Home } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    this.props.onError?.(error, errorInfo);
    
    // Log to console in development
    if (process.env.NODE_ENV === "development") {
      console.error("ErrorBoundary caught:", error, errorInfo);
    }
    
    // In production, send to error tracking service
    const gtagWindow = window as unknown as { gtag?: (...args: unknown[]) => void };
    if (typeof window !== "undefined" && gtagWindow.gtag) {
      gtagWindow.gtag("event", "exception", {
        description: error.message,
        fatal: true,
      });
    }
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-md mx-auto">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <AlertTriangle className="h-8 w-8" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              We&apos;re sorry, but an unexpected error occurred. Our team has been notified.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left bg-muted p-4 rounded-lg text-sm">
                <summary className="font-medium cursor-pointer mb-2">Error details</summary>
                <pre className="whitespace-pre-wrap text-muted-foreground">
                  {this.state.error.message}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button onClick={this.handleRetry} className="w-full sm:w-auto">
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Try Again
              </Button>
              <Button variant="outline" href="/" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" aria-hidden="true" />
                Go Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export class PageErrorBoundary extends Component<
  { children: ReactNode; title?: string },
  ErrorBoundaryState
> {
  constructor(props: { children: ReactNode; title?: string }) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error(`PageErrorBoundary (${this.props.title}):`, error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <section className="py-16 lg:py-24" aria-labelledby="error-heading">
          <div className="container">
            <div className="text-center max-w-md mx-auto">
              <h2 id="error-heading" className="text-2xl font-bold text-foreground mb-4">
                {this.props.title ?? "Section Unavailable"}
              </h2>
              <p className="text-muted-foreground mb-6">
                This section couldn&apos;t load. Please try refreshing the page.
              </p>
              <Button onClick={this.handleRetry}>
                <RefreshCw className="h-4 w-4 mr-2" aria-hidden="true" />
                Retry
              </Button>
            </div>
          </div>
        </section>
      );
    }

    return this.props.children;
  }
}