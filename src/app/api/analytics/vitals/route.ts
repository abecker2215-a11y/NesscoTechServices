import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const metric = {
      name: body.name,
      value: body.value,
      rating: body.rating,
      delta: body.delta,
      id: body.id,
      timestamp: body.timestamp,
      url: body.url,
      userAgent: body.userAgent,
      navigationType: body.navigationType,
    };

    console.log("[Web Vitals]", metric.name, metric.value, metric.rating);

    // In production, send to your analytics service (Plausible, GA, custom, etc.)
    // await fetch("https://your-analytics.com/collect", {
    //   method: "POST",
    //   body: JSON.stringify(metric),
    //   headers: { "Content-Type": "application/json" },
    // });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Web Vitals] Error:", error);
    return NextResponse.json({ success: false }, { status: 400 });
  }
}

export async function GET() {
  return NextResponse.json({ message: "Web Vitals endpoint" });
}