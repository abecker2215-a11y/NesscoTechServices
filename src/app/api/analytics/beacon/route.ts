import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, ...props } = body;

    // In production, you'd send this to your analytics provider
    // For now, we just log it (it will appear in server logs)
    console.log(`[analytics-beacon] ${event}`, props);

    // Could forward to Plausible, GA4, etc. here
    // await fetch('https://plausible.io/api/event', { ... })

    return new NextResponse(null, { status: 204 });
  } catch {
    // Beacon must not fail - silently accept
    return new NextResponse(null, { status: 204 });
  }
}