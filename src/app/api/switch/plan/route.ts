import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";
import { incumbents, migrationPhases, type Incumbent } from "@/lib/migration";

const schema = z.object({
  email: z.string().email(),
  incumbent: z.enum(["connectwise", "autotask", "halopsa", "other"]),
  checkedSteps: z.array(z.string().max(60)).max(60).default([]),
});

/** Email the visitor their migration plan + notify the business. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`switch-plan:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json({ success: false, message: "Too many requests. Try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, incumbent, checkedSteps } = schema.parse(body);
    const inc = incumbents.find((i) => i.id === (incumbent as Incumbent));
    const phases = migrationPhases(incumbent as Incumbent);
    const checked = new Set(checkedSteps);
    const total = phases.reduce((n, p) => n + p.steps.length, 0);

    const planText = phases
      .map((p, pi) =>
        [
          `PHASE ${pi + 1}: ${p.title} (${p.when})`,
          ...p.steps.map(
            (s) => `${checked.has(s.id) ? "[x]" : "[ ]"} ${s.title} (${s.owner === "us" ? "we handle" : "you handle"})\n    ${s.body}`
          ),
        ].join("\n")
      )
      .join("\n\n");

    const emailed = await sendEmail({
      to: email,
      replyTo: siteConfig.email,
      subject: `Your MSP switch plan — ${inc?.label ?? incumbent} → Nessco`,
      text: [
        "Here's your migration plan. Checked items are the ones you marked done:",
        "",
        planText,
        "",
        `Readiness: ${checked.size}/${total}`,
        "",
        "Next step: a free 45-min discovery call. We turn this into a fixed monthly quote — no hourly meter running.",
        `${siteBase()}/get-help?category=business · or call ${siteConfig.phone}.`,
        "",
        `— ${siteConfig.name}`,
      ].join("\n"),
    });

    await sendEmail({
      subject: `New switch lead: ${email} leaving ${inc?.label ?? incumbent} (${checked.size}/${total} ready)`,
      replyTo: email,
      text: `MSP displacement lead.\n\nEmail: ${email}\nCurrent: ${inc?.label ?? incumbent}\nReadiness: ${checked.size}/${total} steps checked\nPlan emailed: ${emailed ? "yes" : "NO — email not configured or failed"}\n\nChecked: ${checkedSteps.join(", ") || "(none)"}`,
    });

    return NextResponse.json({ success: true, emailed });
  } catch (error) {
    console.error("Switch plan error:", error);
    return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
  }
}

function siteBase(): string {
  return `https://${siteConfig.domain}`;
}
