import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";
import { computeRoi, money0 } from "@/lib/roi";
import { buildRoiCasePdf } from "@/lib/roi-pdf";

const schema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
  employees: z.number().min(1).max(5000),
  hourlyCost: z.number().min(5).max(1000),
  incidentsPerYear: z.number().min(1).max(100),
  hoursEach: z.number().min(0.5).max(168),
});

/** Email the boss-ready business case: PDF + plan math + notify business. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`roi-case:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json({ success: false, message: "Too many requests. Try again later." }, { status: 429 });
  }

  try {
    const body = await request.json();
    const { email, name, ...inputs } = schema.parse(body);
    const r = computeRoi(inputs);
    const base = `https://${siteConfig.domain}`;

    let pdfBase64: string | null = null;
    try {
      const pdf = await buildRoiCasePdf({ name, email, inputs });
      pdfBase64 = Buffer.from(pdf).toString("base64");
    } catch (error) {
      console.error("ROI PDF build failed:", error);
    }

    const planLines = r.rows
      .map(
        (row) =>
          `${row.plan.id === r.best.plan.id ? "★ " : ""}${row.plan.name}: ${money0(row.annual)}/yr, avoids ~${money0(row.avoided)} → net ${row.net >= 0 ? "+" : ""}${money0(row.net)}`
      )
      .join("\n");

    const emailed = await sendEmail({
      to: email,
      replyTo: siteConfig.email,
      subject: `Your downtime business case: ${money0(r.downtimeYear)}/yr at stake`,
      text: [
        `Hi${name?.trim() ? ` ${name.trim().split(" ")[0]}` : ""},`,
        "",
        `Your numbers: ${inputs.employees} employees × $${inputs.hourlyCost}/hr × ${inputs.incidentsPerYear} incidents × ${inputs.hoursEach}h = ${money0(r.downtimeYear)}/year in idle staff time.`,
        "",
        "What each plan does about it:",
        planLines,
        "",
        `Recommendation: ${r.best.plan.name} ($${r.best.plan.price}/mo). Full breakdown is in the attached PDF — forward it to whoever signs off.`,
        "",
        `Start here: ${base}/get-help?category=business · or call ${siteConfig.phone}.`,
        "",
        `— ${siteConfig.name}`,
      ].join("\n"),
      attachments: pdfBase64
        ? [{ filename: "downtime-business-case.pdf", content: pdfBase64, contentType: "application/pdf" }]
        : undefined,
    });

    await sendEmail({
      subject: `New ROI business case: ${email} — ${money0(r.downtimeYear)}/yr`,
      replyTo: email,
      text: `ROI calculator lead.\n\nName: ${name || "(none)"}\nEmail: ${email}\nInputs: ${inputs.employees} emp × $${inputs.hourlyCost}/hr × ${inputs.incidentsPerYear}/yr × ${inputs.hoursEach}h\nDowntime: ${money0(r.downtimeYear)}/yr\nBest plan: ${r.best.plan.name}\nPDF emailed: ${emailed ? "yes" : "NO — email not configured or failed"}`,
    });

    return NextResponse.json({ success: true, emailed, downtimeYear: r.downtimeYear, bestPlan: r.best.plan.id });
  } catch (error) {
    console.error("ROI business case error:", error);
    return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
  }
}
