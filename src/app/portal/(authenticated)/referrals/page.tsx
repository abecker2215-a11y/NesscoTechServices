import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ReferralsClient } from "@/components/portal/ReferralsClient";
import { serialize } from "@/lib/serialize";
import crypto from "crypto";

function siteUrl(): string {
  return process.env.NEXTAUTH_URL?.replace(/\/$/, "") || "https://nesscotech.com";
}

export default async function ReferralsPage() {
  const session = await auth();
  if (!session?.user?.clientId || !session.user.email) {
    redirect("/portal/login");
  }

  const email = session.user.email;

  // Every portal user gets a permanent personal code (deterministic lookup,
  // created on first visit).
  let personal = await prisma.referral.findFirst({
    where: { referrerEmail: email, friendEmail: null },
    orderBy: { createdAt: "asc" },
  });
  if (!personal) {
    personal = await prisma.referral.create({
      data: {
        code: `REF-${crypto.randomBytes(3).toString("hex").toUpperCase()}`,
        referrerName: session.user.name ?? "Client",
        referrerEmail: email,
        status: "SENT",
      },
    });
  }

  const referrals = await prisma.referral.findMany({
    where: { referrerEmail: email, friendEmail: { not: null } },
    orderBy: { createdAt: "desc" },
  });

  const earned = await prisma.billing.aggregate({
    where: { clientId: session.user.clientId, type: "CREDIT", status: "PAID" },
    _sum: { amount: true },
  });

  const base = siteUrl();

  return (
    <ReferralsClient
      initialData={{
        user: {
          name: session.user.name ?? null,
          email: session.user.email,
          clientSlug: session.user.clientSlug,
        },
        shareLink: `${base}/refer?code=${personal.code}`,
        shareCode: personal.code,
        referrals: serialize(
          referrals.map((r) => ({
            ...r,
            createdAt: r.createdAt.toISOString(),
            updatedAt: r.updatedAt.toISOString(),
            convertedAt: r.convertedAt?.toISOString() ?? null,
            creditIssuedAt: r.creditIssuedAt?.toISOString() ?? null,
          }))
        ),
        earnedCredits: Number(earned._sum.amount ?? 0),
      }}
    />
  );
}
