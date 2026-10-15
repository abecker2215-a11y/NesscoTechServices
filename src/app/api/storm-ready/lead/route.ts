import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";
import { siteConfig } from "@/lib/config";
import { checkRateLimit, getClientIp, rateLimits } from "@/lib/rate-limit";
import { stormVerdict, fixFor, questionById } from "@/lib/storm-report";
import { buildStormReportPdf } from "@/lib/storm-pdf";

const answerSchema = z.object({ score: z.number().min(0).max(20), label: z.string().max(200) });

const leadSchema = z.object({
  email: z.string().email(),
  name: z.string().max(100).optional(),
  score: z.number().min(0).max(100),
  answers: z.record(z.string(), answerSchema),
});

function siteUrl(): string {
  return process.env.NEXTAUTH_URL?.replace(/\/$/, "") || `https://${siteConfig.domain}`;
}

/** Capture a storm-quiz lead, email the PDF report instantly, queue the drip. */
export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const limit = checkRateLimit(`storm-lead:${ip}`, rateLimits.form.limit, rateLimits.form.windowMs);
  if (!limit.ok) {
    return NextResponse.json(
      { success: false, message: "Too many requests. Please try again later." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } }
    );
  }

  try {
    const body = await request.json();
    const { email, name, score, answers } = leadSchema.parse(body);
    const v = stormVerdict(score);
    const base = siteUrl();

    const existing = await prisma.stormLead.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    const lead = existing
      ? await prisma.stormLead.update({
          where: { id: existing.id },
          data: { name: name || undefined, score, answers, unsubscribedAt: null },
        })
      : await prisma.stormLead.create({
          data: {
            email,
            name: name || null,
            score,
            answers,
            reportToken: crypto.randomBytes(16).toString("hex"),
          },
        });

    const reportUrl = `${base}/storm-ready/report/${lead.reportToken}`;
    const unsubscribeUrl = `${base}/storm-ready/unsubscribe?token=${lead.reportToken}`;

    const gapLines = Object.entries(answers)
      .map(([qid, a]) => {
        const q = questionById(qid);
        if (!q) return null;
        const mark = a.score >= 20 ? "[OK]" : a.score > 0 ? "[PARTIAL]" : "[GAP]";
        return `${mark} ${q.q}\n    Your answer: ${a.label}\n    Fix: ${fixFor(qid, a.score)}`;
      })
      .filter(Boolean)
      .join("\n\n");

    let pdfBase64: string | null = null;
    try {
      const pdf = await buildStormReportPdf({ name, email, score, answers });
      pdfBase64 = Buffer.from(pdf).toString("base64");
    } catch (error) {
      console.error("Storm PDF build failed:", error);
    }

    const emailed = await sendEmail({
      to: email,
      replyTo: siteConfig.email,
      subject: `Your ${score}/100 storm-readiness report — ${siteConfig.name}`,
      text: [
        `Hi${name?.trim() ? ` ${name.trim().split(" ")[0]}` : ""},`,
        "",
        `Your score: ${score}/100 — ${v.title}`,
        v.body,
        "",
        "Your gaps, question by question:",
        "",
        gapLines,
        "",
        "Printable version (same content, shareable):",
        reportUrl,
        "",
        "What to do next:",
        `1. 10-minute backup checklist: ${base}/guides/backup-checklist-small-business`,
        `2. Want it handled? ${base}/get-help — 2-minute request, reply within 2 business hours.`,
        `3. Call: ${siteConfig.phone} (Mon–Fri 8am–6pm ET).`,
        "",
        `— ${siteConfig.name}`,
        `Unsubscribe: ${unsubscribeUrl}`,
      ].join("\n"),
      attachments: pdfBase64
        ? [{ filename: "storm-readiness-report.pdf", content: pdfBase64, contentType: "application/pdf" }]
        : undefined,
    });

    await sendEmail({
      subject: `New storm lead: ${email} scored ${score}/100`,
      replyTo: email,
      text: `Storm quiz lead.\n\nName: ${name || "(none)"}\nEmail: ${email}\nScore: ${score}/100 (${v.title})\nReport emailed: ${emailed ? "yes" : "NO — email not configured or failed"}\nReport: ${reportUrl}`,
    });

    return NextResponse.json({ success: true, reportUrl, emailed });
  } catch (error) {
    console.error("Storm lead error:", error);
    return NextResponse.json({ success: false, message: "Invalid request data" }, { status: 400 });
  }
}
