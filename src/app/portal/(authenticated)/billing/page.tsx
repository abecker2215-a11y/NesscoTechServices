import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { BillingClient } from "@/components/portal/BillingClient";
import { serializeBillings } from "@/lib/serialize";
import { BillingStatus, type Prisma } from "@prisma/client";
import { daysAgo } from "@/lib/dates";

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const session = await auth();
  
  if (!session?.user?.clientId) {
    redirect("/portal/login");
  }

  const params = await searchParams;
  const statusParam = params.status as string | undefined;
  const page = parseInt(params.page as string) || 1;
  const limit = 20;

  // Validate status against enum
  const validStatuses = Object.values(BillingStatus);
  const status = statusParam && validStatuses.includes(statusParam as BillingStatus) ? statusParam as BillingStatus : undefined;

  const where: Prisma.BillingWhereInput = { clientId: session.user.clientId };
  if (status) where.status = status;

  const [billings, total, statusCounts, usageSummary] = await Promise.all([
    prisma.billing.findMany({
      where,
      orderBy: { periodEnd: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.billing.count({ where }),
    prisma.billing.groupBy({
      by: ["status"],
      where: { clientId: session.user.clientId },
      _count: true,
      _sum: { amount: true },
    }),
    prisma.usage.groupBy({
      by: ["metric"],
      where: {
        clientId: session.user.clientId,
        periodStart: { gte: daysAgo(30) },
      },
      _sum: { value: true },
    }),
  ]);

  return (
    <BillingClient
      initialData={{
        billings: serializeBillings(billings),
        total,
        page,
        limit,
        status: statusParam,
        statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s.status]: { count: s._count, amount: s._sum.amount?.toString() ?? "0" } }), {}),
        usageSummary: usageSummary.reduce((acc, u) => ({ ...acc, [u.metric]: u._sum.value?.toString() ?? "0" }), {}),
        user: {
          name: session.user.name ?? null,
          email: session.user.email,
          clientSlug: session.user.clientSlug,
        },
      }}
    />
  );
}