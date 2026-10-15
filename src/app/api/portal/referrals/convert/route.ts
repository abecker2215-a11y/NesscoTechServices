import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

const schema = z.object({ id: z.string().cuid() });

const CREDIT_CENTS = 2500;

/**
 * One-click $25 referral credit. The signed-in portal user must own the
 * referral (matched by email) and the friend must have booked (BOOKED or
 * CONVERTED). Issues a CREDIT billing on the user's client and marks the
 * referral CREDITED — idempotent.
 */
export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.email || !session.user.clientId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = schema.parse(await request.json());
    const referral = await prisma.referral.findUnique({ where: { id } });

    if (!referral || referral.referrerEmail.toLowerCase() !== session.user.email.toLowerCase()) {
      return NextResponse.json({ message: "Referral not found" }, { status: 404 });
    }
    if (referral.status === "CREDITED") {
      return NextResponse.json({ success: true, already: true });
    }
    if (referral.status !== "BOOKED" && referral.status !== "CONVERTED") {
      return NextResponse.json(
        { message: "Credit unlocks after your friend books." },
        { status: 400 }
      );
    }

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    await prisma.$transaction([
      prisma.billing.create({
        data: {
          type: "CREDIT",
          amount: CREDIT_CENTS / 100,
          currency: "USD",
          status: "PAID",
          description: `Referral credit — ${referral.friendName || referral.friendEmail || "friend"} (${referral.code})`,
          paidAt: now,
          periodStart,
          periodEnd,
          clientId: session.user.clientId,
        },
      }),
      prisma.referral.update({
        where: { id },
        data: { status: "CREDITED", convertedAt: referral.convertedAt ?? now, creditIssuedAt: now },
      }),
      prisma.activity.create({
        data: {
          type: "BILLING_PAID",
          title: `Referral credit issued: $25 (${referral.code})`,
          description: `Friend: ${referral.friendEmail ?? "unknown"}`,
          clientId: session.user.clientId,
        },
      }),
    ]);

    return NextResponse.json({ success: true, credit: 25 });
  } catch (error) {
    console.error("Referral credit error:", error);
    return NextResponse.json({ message: "Failed to issue credit" }, { status: 400 });
  }
}
