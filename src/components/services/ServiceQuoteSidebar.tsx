"use client";

import { Phone, ShieldCheck, Clock, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";
import { Button } from "@/components/ui";
import { getServiceHelpCategory } from "@/lib/services";
import { siteConfig } from "@/lib/config";
import type { ServiceDef } from "@/lib/types";

interface Props {
  service: ServiceDef;
}

export function ServiceQuoteSidebar({ service }: Props) {
  const category = getServiceHelpCategory(service.slug);
  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;

  const typicalRange = service.remoteAvailable
    ? `$${service.pricing.remote}–$${service.pricing.remote * 2}`
    : `$${service.pricing.onsite}–$${service.pricing.onsite * 2}`;

  return (
    <aside
      className="lg:sticky lg:top-24 self-start space-y-4"
      aria-label={`Get a quote for ${service.title}`}
    >
      <div className="rounded-xl border border-border bg-background p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Typical fix
        </p>
        <p className="mt-1 text-3xl font-bold tracking-tight text-foreground">
          {typicalRange}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Most {service.title.toLowerCase()} jobs land here. Exact quote before we start.
        </p>

        <dl className="mt-4 space-y-2 text-sm">
          {service.remoteAvailable && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">Remote</dt>
              <dd className="font-semibold text-foreground">${service.pricing.remote}/hr</dd>
            </div>
          )}
          {service.onsiteAvailable && (
            <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2">
              <dt className="text-muted-foreground">On-site</dt>
              <dd className="font-semibold text-foreground">${service.pricing.onsite}/hr</dd>
            </div>
          )}
        </dl>

        <div className="mt-5 space-y-2.5">
          <Button size="lg" className="w-full" href={`/get-help?category=${category}`}>
            Get Help with {service.title}
          </Button>
          <Button size="lg" variant="outline" className="w-full" href="/pricing">
            Compare all pricing
          </Button>
          <a
            href={telHref}
            onClick={() => trackEvent("call_click", { from: "service-sidebar" })}
            className="flex items-center justify-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <Phone className="h-4 w-4" aria-hidden="true" />
            Prefer to talk? {siteConfig.phone}
          </a>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-muted/30 p-5">
        <ul className="space-y-3 text-sm text-muted-foreground" role="list">
          <li className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>Replies within 2 hrs, Mon–Fri 8am–6pm. Same-day remote in most cases.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
            <span>No fix, no fee on remote work. You approve everything upfront.</span>
          </li>
          <li className="flex items-start gap-2.5">
            <CalendarCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            <span>
              Need it scheduled?{" "}
              <Link href="/contact" className="font-medium text-primary hover:underline">
                Pick a time that suits you
              </Link>
              .
            </span>
          </li>
        </ul>
      </div>
    </aside>
  );
}
