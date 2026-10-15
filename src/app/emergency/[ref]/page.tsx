import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Siren, CheckCircle2, Clock, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/lib/config";

interface Props {
  params: Promise<{ ref: string }>;
}

export const metadata: Metadata = {
  title: "Emergency Status",
  robots: "noindex, nofollow",
};

const STAGES = ["Paged", "Tech assigned", "In progress", "Resolved"] as const;

function stageIndex(status: string): number {
  switch (status) {
    case "OPEN":
      return 0;
    case "IN_PROGRESS":
    case "WAITING_CLIENT":
    case "WAITING_VENDOR":
      return 2;
    case "RESOLVED":
    case "CLOSED":
      return 3;
    default:
      return 1;
  }
}

export default async function EmergencyStatusPage({ params }: Props) {
  const { ref } = await params;
  const ticket = await prisma.ticket.findUnique({
    where: { externalId: ref.toUpperCase() },
    select: {
      title: true,
      status: true,
      priority: true,
      createdAt: true,
      updatedAt: true,
      resolvedAt: true,
      assignee: { select: { name: true } },
    },
  });
  if (!ticket) notFound();

  const stage = stageIndex(ticket.status);
  const done = stage >= 3;

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Emergency", path: "/emergency" }, { name: ref.toUpperCase(), path: `/emergency/${ref}` }])} />
      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="emg-status-heading">
        <div className="container">
          <div className="mx-auto max-w-2xl">
            <div className="text-center mb-8">
              <div className={cn("mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full", done ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>
                {done ? <CheckCircle2 className="h-7 w-7" aria-hidden="true" /> : <Siren className="h-7 w-7 animate-pulse" aria-hidden="true" />}
              </div>
              <p className="font-mono text-sm text-muted-foreground">{ref.toUpperCase()}</p>
              <h1 id="emg-status-heading" className="fluid-3xl font-bold text-foreground mt-2">
                {done ? "Resolved" : "Tech paged — we're on it"}
              </h1>
              <p className="text-muted-foreground mt-2 flex items-center justify-center gap-1.5 text-sm">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Filed {new Date(ticket.createdAt).toLocaleString()} · updated {new Date(ticket.updatedAt).toLocaleString()}
                {ticket.assignee?.name ? ` · ${ticket.assignee.name} on it` : ""}
              </p>
            </div>

            <ol className="space-y-0" role="list" aria-label="Emergency progress">
              {STAGES.map((s, i) => {
                const reached = i <= stage;
                return (
                  <li key={s} className="relative flex gap-4 pb-8 last:pb-0">
                    {i < STAGES.length - 1 && (
                      <span className={cn("absolute left-[15px] top-8 h-full w-0.5", i < stage ? "bg-success" : "bg-border")} aria-hidden="true" />
                    )}
                    <span className={cn(
                      "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                      reached ? "border-success bg-success/10 text-success" : "border-border bg-background text-muted-foreground"
                    )}>
                      {reached ? <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> : <span className="h-2 w-2 rounded-full bg-current" />}
                    </span>
                    <div className="pt-1">
                      <p className={cn("font-semibold", reached ? "text-foreground" : "text-muted-foreground")}>{s}</p>
                      {i === 0 && <p className="text-sm text-muted-foreground">Page received, on-call tech notified.</p>}
                      {i === 1 && <p className="text-sm text-muted-foreground">A named technician picks it up (usually minutes).</p>}
                      {i === 2 && <p className="text-sm text-muted-foreground">Diagnosis + fix in progress. We call you with updates.</p>}
                      {i === 3 && <p className="text-sm text-muted-foreground">Confirmed fixed. Invoice follows with the 1.5x after-hours line itemized.</p>}
                    </div>
                  </li>
                );
              })}
            </ol>

            {!done && (
              <div className="mt-8 text-center">
                <Button size="lg" href={`tel:${siteConfig.phone.replace(/\D/g, "")}`} className="w-full sm:w-auto">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                  Call {siteConfig.phone}
                </Button>
                <p className="mt-3 text-xs text-muted-foreground">
                  This page auto-updates on refresh. Bookmark it: <Link href={`/emergency/${ref}`} className="underline">live link</Link>
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
