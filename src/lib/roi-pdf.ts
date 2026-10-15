import { PDFDocument, StandardFonts, rgb, type PDFFont } from "pdf-lib";
import { computeRoi, money0, type RoiInputs } from "./roi";
import { siteConfig } from "./config";

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

/** One-page business case: downtime cost → plan math → recommendation. */
export async function buildRoiCasePdf(opts: {
  name?: string;
  email: string;
  inputs: RoiInputs;
}): Promise<Uint8Array> {
  const { name, email, inputs } = opts;
  const r = computeRoi(inputs);

  const doc = await PDFDocument.create();
  const helv = await doc.embedFont(StandardFonts.Helvetica);
  const bold = await doc.embedFont(StandardFonts.HelveticaBold);

  const W = 595;
  const M = 56;
  const maxW = W - M * 2;
  const ink = rgb(0.06, 0.09, 0.16);
  const muted = rgb(0.28, 0.33, 0.41);
  const primary = rgb(0.05, 0.65, 0.91);
  const good = rgb(0.13, 0.5, 0.24);

  const page = doc.addPage([W, 842]);
  let y = 800;

  const text = (t: string, o: { font?: PDFFont; size?: number; color?: ReturnType<typeof rgb>; gap?: number } = {}) => {
    const font = o.font ?? helv;
    const size = o.size ?? 11;
    for (const line of wrap(t, font, size, maxW)) {
      page.drawText(line, { x: M, y, size, font, color: o.color ?? ink });
      y -= size + 4;
    }
    y -= o.gap ?? 8;
  };

  text(siteConfig.name, { font: bold, size: 13, color: primary, gap: 2 });
  text("Downtime Business Case", { font: bold, size: 24, gap: 2 });
  text(
    `Prepared for ${name || email} · ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`,
    { size: 10, color: muted, gap: 14 }
  );

  text("Your inputs", { font: bold, size: 14, gap: 4 });
  text(
    `${inputs.employees} employees × $${inputs.hourlyCost}/hr × ${inputs.incidentsPerYear} incidents/yr × ${inputs.hoursEach}h each`,
    { size: 11, gap: 10 }
  );

  text("What downtime costs you", { font: bold, size: 14, gap: 4 });
  page.drawText(money0(r.downtimeYear), { x: M, y: y - 30, size: 44, font: bold, color: ink });
  page.drawText("/year in idle staff time", { x: M + bold.widthOfTextAtSize(money0(r.downtimeYear), 44) + 8, y: y - 30, size: 14, font: helv, color: muted });
  y -= 52;
  text(`Assumes ~${r.devices} devices (1.2 per employee). Repair bills not included — the real number is higher.`, { size: 10, color: muted, gap: 12 });

  text("What each plan does about it", { font: bold, size: 14, gap: 6 });
  for (const row of r.rows) {
    const marker = row.plan.id === r.best.plan.id ? "★ " : "· ";
    text(
      `${marker}${row.plan.name}: ${money0(row.annual)}/yr, avoids ~${money0(row.avoided)} → net ${row.net >= 0 ? "+" : ""}${money0(row.net)}`,
      { size: 11, color: row.plan.id === r.best.plan.id ? good : ink, gap: 5 }
    );
  }
  y -= 4;

  text("Recommendation", { font: bold, size: 14, gap: 4 });
  text(
    `${r.best.plan.name} at $${r.best.plan.price}/mo nets ${r.best.net >= 0 ? "+" : ""}${money0(r.best.net)}/yr against downtime alone — it pays for itself ${r.best.net > 0 ? Math.max(1, Math.round(r.downtimeYear / Math.max(1, r.best.annual) * 1)) + "x over" : "before counting"} repair bills, after-hours emergencies, and the workdays you get back.`,
    { size: 11, gap: 10 }
  );

  text("Next step", { font: bold, size: 14, gap: 4 });
  text(`Start a 2-minute request: https://${siteConfig.domain}/get-help?category=business — reply within 2 business hours, quote before anything starts. Or call ${siteConfig.phone} (Mon–Fri 8am–6pm ET).`, { size: 10, gap: 10 });
  text(`${siteConfig.name} · ${siteConfig.domain} · ${siteConfig.phone}`, { size: 9, color: muted });

  return doc.save();
}
