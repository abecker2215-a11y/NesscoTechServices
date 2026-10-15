import Image from "next/image";
import Link from "next/link";
import { Building2 } from "lucide-react";
import { clientLogos, industriesServed } from "@/lib/clients";
import { cn } from "@/lib/utils";

interface ClientLogosProps {
  className?: string;
  /** Heading text. Defaults to "Trusted by Tampa Bay businesses". */
  title?: string;
}

/**
 * Trust strip. Shows real client logos when configured in `src/lib/clients.ts`;
 * otherwise falls back to an honest "Industries we support" line. Never renders
 * invented client marks.
 */
export function ClientLogos({ className, title }: ClientLogosProps) {
  const hasLogos = clientLogos.length > 0;

  return (
    <section
      className={cn("border-y border-border bg-muted/20 py-8", className)}
      aria-label={hasLogos ? "Clients we work with" : "Industries we support"}
    >
      <div className="container">
        <p className="mb-6 flex items-center justify-center gap-2 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          <Building2 className="h-4 w-4" aria-hidden="true" />
          {title ?? (hasLogos ? "Trusted by Tampa Bay businesses" : "Industries we support")}
        </p>

        {hasLogos ? (
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6" role="list">
            {clientLogos.map((logo) => (
              <li key={logo.name}>
                {logo.logoSrc ? (
                  logo.href ? (
                    <a href={logo.href} className="block opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0">
                      <Image
                        src={logo.logoSrc}
                        alt={logo.name}
                        width={140}
                        height={40}
                        className="h-8 w-auto"
                      />
                    </a>
                  ) : (
                    <Image
                      src={logo.logoSrc}
                      alt={logo.name}
                      width={140}
                      height={40}
                      className="h-8 w-auto opacity-60 grayscale transition hover:opacity-100 hover:grayscale-0"
                    />
                  )
                ) : (
                  <span className="text-sm font-semibold text-muted-foreground">{logo.name}</span>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-wrap items-center justify-center gap-2" role="list">
            {industriesServed.map((industry) => (
              <li
                key={industry}
                className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground"
              >
                {industry}
              </li>
            ))}
          </ul>
        )}

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Don&apos;t see your industry? We work with plenty of others —{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            just ask
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
