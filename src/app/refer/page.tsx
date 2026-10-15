import { Metadata } from "next";
import { Suspense } from "react";
import { ReferralPanel } from "@/components/refer/ReferralPanel";
import { ReferralCapture } from "@/components/refer/ReferralCapture";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Gift, BadgeCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Refer a Friend — $25 for You, $25 for Them",
  description:
    "Know someone fighting their Wi-Fi or computer? Send them $25 off their first fix with Nessco Tech Services and get $25 credit when they book. No limits.",
};

async function ReferralWelcome({ code }: { code?: string }) {
  if (!code) return null;
  const referral = await prisma.referral.findUnique({
    where: { code: code.toUpperCase() },
    select: { referrerName: true, status: true },
  });
  if (!referral) return null;
  return (
    <div className="mx-auto mb-8 max-w-2xl rounded-xl border border-success/30 bg-success/5 p-4 text-center" role="status">
      <p className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
        <BadgeCheck className="h-5 w-5 text-success" aria-hidden="true" />
        You&apos;re here via {referral.referrerName} — $25 off your first fix is locked in.
      </p>
      <p className="mt-1 text-xs text-muted-foreground">
        Mention code <strong className="font-mono">{code.toUpperCase()}</strong> when you book.
      </p>
    </div>
  );
}

export default function ReferPage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  return (
    <>
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Refer a Friend", path: "/refer" }])} />
      <section className="py-16 lg:py-24" aria-labelledby="refer-heading">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Gift className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 id="refer-heading" className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Give $25, get $25
            </h1>
            <p className="text-lg text-muted-foreground">
              Your friend gets <strong className="text-foreground">$25 off</strong> their first fix.
              When they book, you get <strong className="text-foreground">$25 credit</strong>.
              Three steps, no apps, no points to track.
            </p>
          </div>

          <Suspense fallback={null}>
            <ReferralWelcomeLoader searchParams={searchParams} />
          </Suspense>

          <ol className="mx-auto mb-10 grid max-w-4xl gap-4 text-center sm:grid-cols-3" role="list">
            {["Send the invite below", "Friend books with the code", "You both get $25"].map((s, i) => (
              <li key={s} className="rounded-xl border border-border bg-background p-4">
                <span className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {i + 1}
                </span>
                <span className="text-sm font-medium text-foreground">{s}</span>
              </li>
            ))}
          </ol>

          <div className="mx-auto max-w-5xl">
            <ReferralPanel />
          </div>
        </div>
      </section>
    </>
  );
}

async function ReferralWelcomeLoader({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const { code } = await searchParams;
  return <ReferralWelcome code={code} />;
}
