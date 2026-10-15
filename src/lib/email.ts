import { siteConfig } from "./config";
import * as nodemailer from "nodemailer";

export interface EmailAttachment {
  filename: string;
  /** Base64-encoded file content (no data: prefix). */
  content: string;
  contentType?: string;
}

interface EmailMessage {
  to?: string | string[];
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  attachments?: EmailAttachment[];
}

/** SMTP URL format: smtp://[username:password@]host:port */
const SMTP_URL = process.env.SMTP_URL;
const RESEND_API_KEY = process.env.RESEND_API_KEY;
const FROM = process.env.EMAIL_FROM ?? "Nessco Website <onboarding@resend.dev>";
const TO = process.env.NOTIFY_TO ?? siteConfig.email;

// Pre-create transporter if SMTP is configured
let smtpTransporter: nodemailer.Transporter | null = null;
if (SMTP_URL) {
  try {
    // Parse SMTP URL: smtp://[username:password@]host:port
    // Remove "smtp://" prefix
    let url = SMTP_URL;
    if (url.startsWith("smtp://")) {
      url = url.substring(7);
    }

    // Declare variables
    let authUser = "";
    let authPass = "";
    let host = "";
    let port = 587;
    let hostPort = "";

    // Count @ signs to determine format
    const atCount = (url.match(/[@]/g) || []).length;

    if (atCount >= 2) {
      // Format: smtp://user@host:pass@host:port (our case: smtp://no-reply:Nessco2215!654!@mail.nesscotech.com:587)
      // The last @ separates host:port from auth user:pass
      const lastAtIdx = url.lastIndexOf("@");
      if (lastAtIdx !== -1) {
        const authPart = url.substring(0, lastAtIdx); // no-reply:Nessco2215!654!
        const hostPart = url.substring(lastAtIdx + 1); // mail.nesscotech.com:587

        // Parse authPart: extract user and pass
        const colonIdx = authPart.indexOf(":");
        if (colonIdx !== -1) {
          authUser = authPart.substring(0, colonIdx); // no-reply
          authPass = authPart.substring(colonIdx + 1); // Nessco2215!654!
        } else {
          authUser = authPart;
        }

        // Parse hostPart: host:port
        const colonIdx2 = hostPart.lastIndexOf(":");
        if (colonIdx2 !== -1) {
          host = hostPart.substring(0, colonIdx2); // mail.nesscotech.com
          const portStr = hostPart.substring(colonIdx2 + 1);
          port = parseInt(portStr, 10) || 587;
        } else {
          host = hostPart;
        }

        console.log("[email] SMTP parsed - host:", host, "port:", port);
        console.log("[email] SMTP parsed - user:", authUser, "passLen:", authPass.length);

        smtpTransporter = nodemailer.createTransport({
          host,
          port,
          secure: port === 465,
          auth: {
            user: authUser,
            pass: authPass,
          },
          tls: {
            rejectUnauthorized: false,
          },
        });
        console.log("[email] SMTP transporter configured for", SMTP_URL);
      }
    } else if (atCount === 1) {
      // Format: smtp://user:pass@host:port (standard)
      const atIdx = url.indexOf("@");
      const auth = url.substring(0, atIdx);
      url = url.substring(atIdx + 1);

      const colonIdx = auth.indexOf(":");
      if (colonIdx !== -1) {
        authUser = auth.substring(0, colonIdx);
        authPass = auth.substring(colonIdx + 1);
      } else {
        authUser = auth;
      }
      hostPort = url;
    } else {
      // No @ sign - might be smtp://host:port without auth
      authUser = "";
      authPass = "";
      hostPort = url;
    }

    // Parse host:port (fallback if not set above)
    if (!host && hostPort) {
      if (hostPort.includes(":")) {
        const colonIdx = hostPort.lastIndexOf(":");
        host = hostPort.substring(0, colonIdx);
        const portStr = hostPort.substring(colonIdx + 1);
        port = parseInt(portStr, 10) || 587;
      } else {
        host = hostPort;
        port = 587;
      }
    }

    if (smtpTransporter) {
      console.log("[email] SMTP transporter configured for", SMTP_URL);
    }
  } catch (err) {
    console.error("[email] failed to configure SMTP transporter:", err);
    smtpTransporter = null;
  }
}

export async function sendEmail({ to, subject, text, html, replyTo, attachments }: EmailMessage): Promise<boolean> {
  // Try SMTP first if configured and transporter is ready
  if (smtpTransporter) {
    try {
      const recipients = to ?? [TO];
      const mailOptions: nodemailer.SendMailOptions = {
        from: FROM,
        to: recipients,
        subject,
        text,
        ...(html ? { html } : {}),
        ...(replyTo ? { replyTo } : {}),
        ...(attachments?.length
          ? {
              attachments: attachments.map((a) => ({
                filename: a.filename,
                content: a.content,
                contentType: a.contentType,
              })),
            }
          : {}),
      };

      console.log("[email] Sending via SMTP to:", recipients);
      await smtpTransporter.sendMail(mailOptions);
      return true;
    } catch (err) {
      console.error("[email] SMTP send error:", err);
      // Fall through to Resend if SMTP fails
    }
  }

  // Fall back to Resend API
  if (!RESEND_API_KEY) {
    console.warn(`[email] Neither SMTP nor RESEND_API_KEY set — email not sent for "${subject}"`);
    return false;
  }

  try {
    const recipients = to ?? [TO];
    console.log("[email] Sending via Resend to:", recipients, "from:", FROM);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: to ?? [TO],
        subject,
        text,
        ...(html ? { html } : {}),
        ...(replyTo ? { reply_to: replyTo } : {}),
        ...(attachments?.length
          ? {
              attachments: attachments.map((a) => ({
                filename: a.filename,
                content: a.content,
                content_type: a.contentType,
              })),
            }
          : {}),
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] send failed (${res.status}): ${body}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[email] send error:", error);
    return false;
  }
}

/** Business notification (defaults to NOTIFY_TO). Kept for backwards compatibility. */
export async function sendNotification(message: Omit<EmailMessage, "to"> & { to?: EmailMessage["to"] }): Promise<boolean> {
  return sendEmail(message);
}

/** Convert a data: URL (e.g. from the photo upload) into a Resend/ SMTP attachment. */
export function dataUrlToAttachment(dataUrl: string, fallbackName: string): EmailAttachment | null {
  const match = dataUrl.match(/^data:(image\/[a-z+]+);base64,(.+)$/);
  if (!match) return null;
  const [, contentType, content] = match;
  const ext = contentType.includes("png") ? "png" : contentType.includes("webp") ? "webp" : "jpg";
  const safeName = fallbackName.replace(/[^\w.\-() ]/g, "").slice(0, 80) || `photo.${ext}`;
  const filename = /\.(jpe?g|png|webp)$/i.test(safeName) ? safeName : `${safeName}.${ext}`;
  return { filename, content, contentType };
}