"use client";

import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

/**
 * Entry redirect that preserves deep links, e.g.
 * /get-help?category=wifi&type=onsite&hours=2 → /get-help/step-1?...
 */
function Forwarder() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const query = params.toString();
    router.replace(`/get-help/step-1${query ? `?${query}` : ""}`);
  }, [router, params]);

  return (
    <section className="py-16 lg:py-24" aria-label="Loading">
      <div className="container">
        <div className="mx-auto max-w-2xl animate-pulse space-y-4">
          <div className="mx-auto h-8 w-3/4 rounded bg-muted" />
          <div className="mx-auto h-4 w-1/2 rounded bg-muted" />
        </div>
      </div>
    </section>
  );
}

export default function GetHelpEntryPage() {
  return (
    <Suspense fallback={null}>
      <Forwarder />
    </Suspense>
  );
}
