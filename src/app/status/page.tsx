import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { CheckCircle2, AlertTriangle, XCircle, MinusCircle, Rss } from "lucide-react";
import { cn } from "@/lib/utils";
import { IncidentManager } from "./IncidentManager";
import { auth } from "@/lib/auth/config";

export const metadata: Metadata = {
  title: "System Status — Nessco Tech Services",
  description: "Live status of the Nessco website, client portal, email delivery, and integrations.",
};

export const revalidate = 60;

interface Check {
  name: string;
  detail: string;
  ok: boolean | null;
}

async function runChecks(): Promise<Check[]> {
  const checks: Check[] = [];

  // Database
  try {
    const t0 = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    checks.push({ name: "Database", detail: `Responding in ${Date.now() - t0}ms`, ok: true });
  } catch {
    checks.push({ name: "Database", detail: "Unreachable — portal features degraded", ok: false });
  }

  // Email delivery
  checks.push(
    process.env.RESEND_API_KEY
      ? { name: "Email delivery", detail: "Resend configured", ok: true }
      : { name: "Email delivery", detail: "Not configured — forms queue without confirmations", ok: null }
  );

  // SMS paging
  checks.push(
    process.env.TWILIO_ACCOUNT_SID && process.env.EMERGENCY_SMS_TO
      ? { name: "Emergency SMS paging", detail: "Twilio + on-call number configured", ok: true }
      : { name: "Emergency SMS paging", detail: "Not configured — pages fall back to email + call", ok: null }
  );

  // PSA sync
  const outboxPending = await prisma.psaOutbox
    .count({ where: { status: { in: ["PENDING", "FAILED"] } } })
    .catch(() => -1);
  checks.push(
    !process.env.PSA_OUTBOUND_URL
      ? { name: "PSA outbound sync", detail: "Not configured — portal events queue locally", ok: null }
      : outboxPending > 10
        ? { name: "PSA outbound sync", detail: `${outboxPending} events backlogged`, ok: false }
        : { name: "PSA outbound sync", detail: outboxPending === 0 ? "Queue clear" : `${outboxPending} queued`, ok: true }
  );

  // Scheduled jobs heartbeat (storm drip is the canary).
  const lastDrip = await prisma.dripSend
    .findFirst({ orderBy: { sentAt: "desc" }, select: { sentAt: true } })
    .catch(() => null);
  const lastLead = await prisma.stormLead
    .findFirst({ orderBy: { createdAt: "desc" }, select: { createdAt: true } })
    .catch(() => null);
  const lastActivity = Math.max(
    lastDrip?.sentAt.getTime() ?? 0,
    lastLead?.createdAt.getTime() ?? 0
  );
  checks.push(
    lastActivity === 0
      ? { name: "Scheduled jobs", detail: "No runs recorded yet", ok: null }
      : {
          name: "Scheduled jobs",
          detail: `Last activity ${new Date(lastActivity).toLocaleString()}`,
          ok: Date.now() - lastActivity < 1000 * 60 * 60 * 24 * 3,
        }
  );

  return checks;
}

const statusTone: Record<string, string> = {
  INVESTIGATING: "bg-red-100 text-red-800",
  IDENTIFIED: "bg-amber-100 text-amber-800",
  MONITORING: "bg-blue-100 text-blue-800",
  RESOLVED: "bg-green-100 text-green-800",
};

export default async function StatusPage() {
  const [checks, incidents, session] = await Promise.all([
    runChecks(),
    prisma.incident.findMany({ orderBy: { createdAt: "desc" }, take: 10 }).catch(() => []),
    auth().catch(() => null),
  ]);

  const allOk = checks.every((c) => c.ok !== false) && !incidents.some((i) => i.status !== "RESOLVED");
  const isStaff =
    session?.user &&
    ["ADMIN", "SUPER_ADMIN", "TECHNICIAN"].includes((session.user as { role?: string }).role ?? "");

  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Status", path: "/status" }])} />
      <section className="py-12 sm:py-16 lg:py-24" aria-labelledby="status-heading">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-10">
              <h1 id="status-heading" className="fluid-4xl font-bold text-foreground mb-4">
                System status
              </h1>
              <p
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
                  allOk ? "bg-success/10 text-success" : "bg-warning/10 text-warning"
                )}
                role="status"
              >
                {allOk ? (
                  <><CheckCircle2 className="h-4 w-4" /> All systems operational</>
                ) : (
                  <><AlertTriangle className="h-4 w-4" /> Partial disruption — see below</>
                )}
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-background divide-y divide-border">
              {checks.map((c) => (
                <div key={c.name} className="flex items-start gap-3 p-4">
                  {c.ok === true ? (
                    <CheckCircle2 className="h-5 w-5 text-success shrink-0 mt-0.5" aria-hidden="true" />
                  ) : c.ok === false ? (
                    <XCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
                  ) : (
                    <MinusCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" aria-hidden="true" />
                  )}
                  <div>
                    <p className="font-semibold text-foreground">{c.name}</p>
                    <p className="text-sm text-muted-foreground">{c.detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <h2 className="mt-10 mb-4 text-xl font-bold text-foreground flex items-center gap-2">
              <Rss className="h-5 w-5 text-primary" /> Incident history
            </h2>
            {incidents.length === 0 ? (
              <p className="rounded-xl border border-border bg-background p-5 text-sm text-muted-foreground">
                No incidents recorded. Quiet is the goal — this page exists so you never have to guess.
              </p>
            ) : (
              <div className="space-y-3">
                {incidents.map((i) => (
                  <article key={i.id} className="rounded-xl border border-border bg-background p-5">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-semibold text-foreground">{i.title}</h3>
                      <span className={cn("rounded-full px-2.5 py-1 text-xs font-bold", statusTone[i.status] ?? statusTone.INVESTIGATING)}>
                        {i.status.replace("_", " ")}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {new Date(i.createdAt).toLocaleString()}
                      {i.resolvedAt ? ` · resolved ${new Date(i.resolvedAt).toLocaleString()}` : ""}
                    </p>
                    {Array.isArray(i.updates) && (i.updates as { at: string; text: string }[]).length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {(i.updates as { at: string; text: string }[]).map((u, n) => (
                          <li key={n} className="text-sm text-muted-foreground">
                            <span className="text-xs">{new Date(u.at).toLocaleString()} — </span>{u.text}
                          </li>
                        ))}
                      </ul>
                    )}
                  </article>
                ))}
              </div>
            )}

            {isStaff && <IncidentManager />}
          </div>
        </div>
      </section>
    </>
  );
}
