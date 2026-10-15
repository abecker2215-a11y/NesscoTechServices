import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { stormQuestions, stormVerdict, fixFor, type StormAnswer } from "./storm-report";
import { siteConfig } from "./config";

/** Wrap text to fit a max width in points. */
function wrap(text: string, font: PDFFont, size: number, maxWidth: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = "";
  for (const w of words) {
    const test = line ? `${line} ${w}` : w;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = w;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

export async function buildStormReportPdf(opts: {
  name?: string;
  email: string;
  score: number;
  answers: Record<string, StormAnswer>;
}): Promise<Uint8Array> {
  const { name, email, score, answers } = opts;
  const v = stormVerdict(score);

  const doc = await PDFDocument.create();
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const W = 595; // A4 width (pt)
  const M = 56; // margin
  const maxW = W - M * 2;
  const ink = rgb(0.06, 0.09, 0.16);
  const muted = rgb(0.28, 0.33, 0.41);
  const primary = rgb(0.05, 0.65, 0.91);

  let page = doc.addPage([W, 842]);
  let y = 800;

  const need = (h: number) => {
    if (y - h < M) {
      page = doc.addPage([W, 842]);
      y = 800;
    }
  };

  const text = (t: string, o: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; gap?: number } = {}) => {
    const font = o.font ?? helv;
    const size = o.size ?? 11;
    for (const line of wrap(t, font, size, maxW)) {
      need(size + 4);
      page.drawText(line, { x: M, y, size, font, color: o.color ?? ink });
      y -= size + 4;
    }
    y -= o.gap ?? 8;
  };

  // Header
  text(siteConfig.name, { font: bold, size: 13, color: primary, gap: 2 });
  text("Storm-Readiness Report", { font: bold, size: 24, gap: 2 });
  text(`Prepared for ${name || email} · ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, { size: 10, color: muted, gap: 14 });

  // Score
  need(90);
  page.drawText(`${score}`, { x: M, y: y - 44, size: 56, font: bold, color: primary });
  page.drawText("/100", { x: M + bold.widthOfTextAtSize(`${score}`, 56) + 4, y: y - 44, size: 24, font: helv, color: muted });
  y -= 60;
  text(v.title, { font: bold, size: 16, gap: 2 });
  text(v.body, { size: 11, color: muted, gap: 14 });

  // Per-question gaps
  text("Your gaps, question by question", { font: bold, size: 14, gap: 6 });
  for (const q of stormQuestions) {
    const a = answers[q.id];
    const label = a?.label ?? "Not answered";
    const s = a?.score ?? 0;
    const mark = s >= 20 ? "OK " : s > 0 ? "PARTIAL " : "GAP ";
    text(`${mark}· ${q.q}`, { font: bold, size: 11, gap: 1 });
    text(`Your answer: ${label}`, { size: 10, color: muted, gap: 1 });
    text(`Fix: ${fixFor(q.id, s)}`, { size: 10, gap: 10 });
  }

  // CTA
  need(80);
  text("What to do next", { font: bold, size: 14, gap: 4 });
  text(`1. Run the 10-minute backup checklist: https://${siteConfig.domain}/guides/backup-checklist-small-business`, { size: 10, gap: 2 });
  text(`2. Want it handled? Start a 2-minute request: https://${siteConfig.domain}/get-help — we reply within 2 business hours.`, { size: 10, gap: 2 });
  text(`3. Prefer to talk? Call ${siteConfig.phone} (Mon–Fri 8am–6pm ET).`, { size: 10, gap: 10 });
  text(`${siteConfig.name} · ${siteConfig.domain} · ${siteConfig.phone}`, { size: 9, color: muted });

  return doc.save();
}
