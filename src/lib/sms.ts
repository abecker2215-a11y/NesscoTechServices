/**
 * SMS via Twilio REST (no SDK needed). Graceful no-op when TWILIO_*
 * is unset — callers must always have an email/voice fallback.
 *
 * Env: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_FROM_NUMBER,
 *      EMERGENCY_SMS_TO (on-call tech mobile, E.164).
 */

function toE164(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (/^\+?1?\d{10}$/.test(raw) || /^\d{10,11}$/.test(digits)) {
    const d = digits.length === 11 && digits.startsWith("1") ? digits.slice(1) : digits;
    if (d.length !== 10) return null;
    return `+1${d}`;
  }
  return raw.startsWith("+") ? raw : null;
}

export async function sendSms(to: string, body: string): Promise<boolean> {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;

  if (!sid || !token || !from) {
    console.warn(`[sms] TWILIO_* not set — SMS not sent to ${to}: ${body.slice(0, 80)}`);
    return false;
  }

  const dest = toE164(to);
  if (!dest) {
    console.error(`[sms] invalid destination: ${to}`);
    return false;
  }

  try {
    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ To: dest, From: from, Body: body.slice(0, 1500) }),
      }
    );
    if (!res.ok) {
      console.error(`[sms] Twilio error (${res.status}): ${await res.text()}`);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[sms] send error:", error);
    return false;
  }
}

export function smsConfigured(): boolean {
  return !!(
    process.env.TWILIO_ACCOUNT_SID &&
    process.env.TWILIO_AUTH_TOKEN &&
    process.env.TWILIO_FROM_NUMBER
  );
}
