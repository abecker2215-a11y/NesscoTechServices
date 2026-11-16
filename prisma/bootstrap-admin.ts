/**
 * Bootstrap an internal admin account so /admin is reachable.
 * Idempotent: creates the user if missing, or promotes an existing one.
 *
 *   npx tsx prisma/bootstrap-admin.ts
 *
 * Optional env: ADMIN_EMAIL, ADMIN_PASSWORD (min 8 chars). If ADMIN_PASSWORD
 * is unset, a strong random password is generated and printed once.
 */
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || "admin@nesscotech.com";
  const provided = process.env.ADMIN_PASSWORD;
  const password =
    provided && provided.length >= 8 ? provided : randomBytes(12).toString("base64url");

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "SUPER_ADMIN" },
    });
    console.log(`Admin promoted: ${email} (role=SUPER_ADMIN)`);
    console.log("Password unchanged (set ADMIN_PASSWORD and re-run to reset).");
  } else {
    await prisma.user.create({
      data: {
        email,
        name: "Nessco Admin",
        role: "SUPER_ADMIN",
        passwordHash,
        emailVerified: new Date(),
      },
    });
    console.log(`Admin created: ${email} (role=SUPER_ADMIN)`);
    if (!provided) console.log(`Generated password: ${password}`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });