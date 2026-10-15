import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create a demo client
  const client = await prisma.client.upsert({
    where: { slug: "demo-corp" },
    update: {},
    create: {
      name: "Demo Corporation",
      slug: "demo-corp",
      domain: "demo-corp.com",
      primaryContact: "John Smith",
      primaryEmail: "john@demo-corp.com",
      primaryPhone: "555-0100",
      address: "123 Business Ave",
      city: "Tampa",
      state: "FL",
      zipCode: "33602",
      planId: "managed",
      status: "ACTIVE",
      portalEnabled: true,
    },
  });

  console.log(`✅ Client created: ${client.name} (${client.slug})`);

  // Create client admin user
  const passwordHash = await bcrypt.hash("DemoPortal123!", 12);
  
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@demo-corp.com" },
    update: {},
    create: {
      email: "admin@demo-corp.com",
      name: "John Smith",
      passwordHash,
      role: "CLIENT_ADMIN",
      clientId: client.id,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Admin user created: ${adminUser.email}`);

  // Create regular client user
  const clientUser = await prisma.user.upsert({
    where: { email: "user@demo-corp.com" },
    update: {},
    create: {
      email: "user@demo-corp.com",
      name: "Jane Doe",
      passwordHash,
      role: "CLIENT",
      clientId: client.id,
      emailVerified: new Date(),
    },
  });

  console.log(`✅ Client user created: ${clientUser.email}`);

  // Create sample tickets
  const tickets = [
    {
      title: "Wi-Fi dropping in conference room",
      description: "Users report intermittent Wi-Fi connectivity in the main conference room. Issue started yesterday afternoon.",
      status: "IN_PROGRESS" as const,
      priority: "HIGH" as const,
      category: "NETWORK" as const,
    },
    {
      title: "New employee setup - Sarah Johnson",
      description: "Need laptop, email, and access configured for new marketing hire starting Monday.",
      status: "OPEN" as const,
      priority: "MEDIUM" as const,
      category: "ONBOARDING" as const,
    },
    {
      title: "Outlook not syncing on mobile",
      description: "Email sync stopped working on iPhone after iOS update. Can receive but not send.",
      status: "WAITING_CLIENT" as const,
      priority: "MEDIUM" as const,
      category: "EMAIL" as const,
    },
    {
      title: "Server backup failed - 3 days",
      description: "Nightly backup has failed for 3 consecutive nights. Need immediate investigation.",
      status: "RESOLVED" as const,
      priority: "URGENT" as const,
      category: "BACKUP" as const,
    },
  ];

  for (const t of tickets) {
    await prisma.ticket.create({
      data: {
        ...t,
        source: "PORTAL",
        clientId: client.id,
        createdById: adminUser.id,
        assigneeId: adminUser.id,
        slaDueAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      },
    });
  }

  console.log(`✅ Created ${tickets.length} sample tickets`);

  // Create sample assets
  const assets = [
    {
      name: "DESKTOP-JOHN",
      type: "WORKSTATION" as const,
      manufacturer: "Dell",
      model: "OptiPlex 7090",
      serialNumber: "DL7090-001",
      os: "Windows 11 Pro",
      osVersion: "22H2",
      ipAddress: "192.168.1.50",
      location: "Office - Desk 1",
      status: "ACTIVE" as const,
    },
    {
      name: "LAPTOP-JANE",
      type: "LAPTOP" as const,
      manufacturer: "Lenovo",
      model: "ThinkPad X1 Carbon Gen 11",
      serialNumber: "TPX1C-002",
      os: "Windows 11 Pro",
      osVersion: "23H2",
      ipAddress: "192.168.1.51",
      location: "Remote",
      status: "ACTIVE" as const,
    },
    {
      name: "FILE-SERVER-01",
      type: "SERVER" as const,
      manufacturer: "HPE",
      model: "ProLiant DL380 Gen10",
      serialNumber: "HPE-DL380-001",
      os: "Windows Server 2022",
      osVersion: "21H2",
      ipAddress: "192.168.1.10",
      location: "Server Room - Rack A",
      status: "ACTIVE" as const,
    },
    {
      name: "CONF-ROOM-AP",
      type: "NETWORK_DEVICE" as const,
      manufacturer: "Ubiquiti",
      model: "U6-LR",
      serialNumber: "UBNT-U6LR-001",
      ipAddress: "192.168.1.20",
      location: "Conference Room Ceiling",
      status: "MAINTENANCE" as const,
    },
  ];

  for (const a of assets) {
    await prisma.asset.create({
      data: {
        ...a,
        clientId: client.id,
      },
    });
  }

  console.log(`✅ Created ${assets.length} sample assets`);

  // Create sample billings
  const billings = [
    {
      type: "RECURRING" as const,
      amount: 349.00,
      currency: "USD",
      status: "PAID" as const,
      description: "Managed IT Services - March 2024",
      periodStart: new Date("2024-03-01"),
      periodEnd: new Date("2024-03-31"),
      paidAt: new Date("2024-03-05"),
    },
    {
      type: "RECURRING" as const,
      amount: 349.00,
      currency: "USD",
      status: "PAID" as const,
      description: "Managed IT Services - April 2024",
      periodStart: new Date("2024-04-01"),
      periodEnd: new Date("2024-04-30"),
      paidAt: new Date("2024-04-03"),
    },
    {
      type: "RECURRING" as const,
      amount: 349.00,
      currency: "USD",
      status: "PENDING" as const,
      description: "Managed IT Services - May 2024",
      periodStart: new Date("2024-05-01"),
      periodEnd: new Date("2024-05-31"),
      dueDate: new Date("2024-05-15"),
    },
    {
      type: "USAGE" as const,
      amount: 187.50,
      currency: "USD",
      status: "PAID" as const,
      description: "Overage: 2.5 hours remote support",
      periodStart: new Date("2024-04-01"),
      periodEnd: new Date("2024-04-30"),
      paidAt: new Date("2024-05-10"),
    },
  ];

  for (const b of billings) {
    await prisma.billing.create({
      data: {
        ...b,
        clientId: client.id,
      },
    });
  }

  console.log(`✅ Created ${billings.length} sample billings`);

  // Create sample usage
  const usage = [
    { metric: "REMOTE_HOURS" as const, value: 12.5, unit: "hours", periodStart: new Date("2024-04-01"), periodEnd: new Date("2024-04-30") },
    { metric: "ONSITE_HOURS" as const, value: 4.0, unit: "hours", periodStart: new Date("2024-04-01"), periodEnd: new Date("2024-04-30") },
    { metric: "TICKETS_CREATED" as const, value: 8, unit: "count", periodStart: new Date("2024-04-01"), periodEnd: new Date("2024-04-30") },
    { metric: "BACKUP_GB" as const, value: 2450, unit: "GB", periodStart: new Date("2024-04-01"), periodEnd: new Date("2024-04-30") },
    { metric: "ENDPOINTS_PROTECTED" as const, value: 47, unit: "count", periodStart: new Date("2024-04-01"), periodEnd: new Date("2024-04-30") },
    { metric: "M365_LICENSES" as const, value: 32, unit: "count", periodStart: new Date("2024-04-01"), periodEnd: new Date("2024-04-30") },
  ];

  for (const u of usage) {
    await prisma.usage.create({
      data: {
        ...u,
        clientId: client.id,
      },
    });
  }

  console.log(`✅ Created ${usage.length} sample usage records`);

  // Demo referral (BOOKED → "Issue $25 credit" button visible in portal demo)
  await prisma.referral.upsert({
    where: { code: "REF-DEMO01" },
    update: { status: "BOOKED" },
    create: {
      code: "REF-DEMO01",
      referrerName: "John Smith",
      referrerEmail: "admin@demo-corp.com",
      friendName: "Alex Rivera",
      friendEmail: "alex.rivera@example.com",
      status: "BOOKED",
    },
  });

  console.log("✅ Created demo referral REF-DEMO01 (BOOKED)");

  console.log("🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });