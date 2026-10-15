import { prisma } from "@/lib/prisma";

/**
 * Attribute a booking to a referral code. Called from the help-request and
 * contact routes: a matching SENT referral becomes BOOKED, which unlocks the
 * referrer's one-click $25 credit in the portal.
 */
export async function attributeReferralBooking(code: string | undefined, bookerEmail: string): Promise<void> {
  if (!code) return;
  const normalized = code.trim().toUpperCase();
  if (!/^[A-Z0-9-]{4,24}$/.test(normalized)) return;
  try {
    await prisma.referral.updateMany({
      where: { code: normalized, status: "SENT" },
      data: { status: "BOOKED", friendEmail: bookerEmail },
    });
  } catch (error) {
    console.error("Referral attribution failed:", error);
  }
}
