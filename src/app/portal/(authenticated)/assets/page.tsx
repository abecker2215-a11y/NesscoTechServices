import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { AssetsClient } from "@/components/portal/AssetsClient";
import { serializeAssets } from "@/lib/serialize";
import { AssetType, AssetStatus, type Prisma } from "@prisma/client";

export default async function AssetsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; status?: string; page?: string }>;
}) {
  const session = await auth();
  
  if (!session?.user?.clientId) {
    redirect("/portal/login");
  }

  const params = await searchParams;
  const typeParam = params.type as string | undefined;
  const statusParam = params.status as string | undefined;
  const page = parseInt(params.page as string) || 1;
  const limit = 20;

  // Validate type against enum
  const validTypes = Object.values(AssetType);
  const type = typeParam && validTypes.includes(typeParam as AssetType) ? typeParam as AssetType : undefined;

  // Validate status against enum
  const validStatuses = Object.values(AssetStatus);
  const status = statusParam && validStatuses.includes(statusParam as AssetStatus) ? statusParam as AssetStatus : undefined;

  const where: Prisma.AssetWhereInput = { clientId: session.user.clientId };
  if (type) where.type = type;
  if (status) where.status = status;

  const [assets, total, typeCounts, statusCounts] = await Promise.all([
    prisma.asset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count({ where }),
    prisma.asset.groupBy({
      by: ["type"],
      where: { clientId: session.user.clientId },
      _count: true,
    }),
    prisma.asset.groupBy({
      by: ["status"],
      where: { clientId: session.user.clientId },
      _count: true,
    }),
  ]);

  return (
    <AssetsClient
      initialData={{
        assets: serializeAssets(assets),
        total,
        page,
        limit,
        type: typeParam,
        status: statusParam,
        typeCounts: typeCounts.reduce((acc, t) => ({ ...acc, [t.type]: t._count }), {}),
        statusCounts: statusCounts.reduce((acc, s) => ({ ...acc, [s.status]: s._count }), {}),
        user: {
          name: session.user.name ?? null,
          email: session.user.email,
          clientSlug: session.user.clientSlug,
        },
      }}
    />
  );
}