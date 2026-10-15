import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({ token: z.string().min(8).max(64) });

export async function POST(request: NextRequest) {
  try {
    const { token } = schema.parse(await request.json());
    await prisma.stormLead.updateMany({
      where: { reportToken: token, unsubscribedAt: null },
      data: { unsubscribedAt: new Date() },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 400 });
  }
}
