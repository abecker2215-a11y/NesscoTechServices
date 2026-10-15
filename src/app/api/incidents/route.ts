import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth/config";
import { prisma } from "@/lib/prisma";

const STAFF = ["ADMIN", "SUPER_ADMIN", "TECHNICIAN"];

export async function GET() {
  const incidents = await prisma.incident.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  return NextResponse.json(incidents);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session?.user || !role || !STAFF.includes(role)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { title, text } = z
      .object({ title: z.string().min(4).max(200), text: z.string().min(4).max(2000) })
      .parse(await request.json());
    const incident = await prisma.incident.create({
      data: {
        title,
        status: "INVESTIGATING",
        updates: [{ at: new Date().toISOString(), text }],
      },
    });
    return NextResponse.json({ success: true, id: incident.id }, { status: 201 });
  } catch {
    return NextResponse.json({ message: "Invalid request" }, { status: 400 });
  }
}
