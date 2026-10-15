export interface QuickFix {
  slug: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  helpCategory: string;
  serviceSlug: string;
  serviceLabel: string;
  /** Optional walkthrough video (YouTube/Loom embed URL). Renders when set. */
  videoUrl?: string;
  symptoms: string[];
  steps: { heading: string; body: string }[];
  whenToCall: string[];
}

/**
 * Programmatic fix library: one template (`/fixes/[slug]`), many high-intent
 * pages. Each entry targets the exact phrase people type when something
 * breaks, then hands off to the matching guide, service, or prefilled
 * get-help request.
 */
export const fixes: QuickFix[] = [
  {
    slug: "printer-shows-offline",
    title: "Printer Shows Offline (But It's Turned On)",
    excerpt: "Windows says offline, the printer looks fine. 4 steps that fix it 9 times out of 10 — restart order, re-add, driver.",
    readMinutes: 3,
    helpCategory: "printer",
    serviceSlug: "it-support",
    serviceLabel: "Remote Support",
    symptoms: ["Printer status says Offline in Windows Settings", "Worked yesterday, broke after an update", "Other devices print fine"],
    steps: [
      { heading: "1. Restart in order: printer, router, computer", body: "Power everything fully off (not sleep). Printer first, then router, then the computer. This clears the stale network registration that causes most phantom-offline states." },
      { heading: "2. Remove and re-add the printer", body: "Settings → Bluetooth & devices → Printers, remove it, then Add device. Re-adding forces a fresh driver handshake instead of fighting the old one." },
      { heading: "3. Uncheck 'Use Printer Offline'", body: "Open the print queue, click Printer in the menu, and make sure Use Printer Offline is unchecked. Updates flip this on silently." },
      { heading: "4. Reinstall the driver from the maker", body: "If it still fails, download the full driver package from HP, Canon, or Brother — not the Windows auto-driver. Takes 10 minutes and fixes the stubborn cases." },
    ],
    whenToCall: [
      "The printer vanishes from every device on the network.",
      "You need it shared reliably across an office (print server setup).",
      "It's a hardware fault — grinding, jams on every page, error lights.",
    ],
  },
  {
    slug: "router-red-light-no-internet",
    title: "Router Has a Red Light / No Internet",
    excerpt: "Red globe, no Wi-Fi, everything down. How to tell in 2 minutes whether it's your gear or your provider's outage.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Red/orange light on modem or router", "All devices offline at once", "Started after a storm or outage"],
    steps: [
      { heading: "1. Check for an outage first", body: "Phone hotspot + your provider's status page. If nearby businesses are down too, it's their problem — save yourself an hour and report it with your account number ready." },
      { heading: "2. Power-cycle modem, then router", body: "Unplug both for 60 seconds. Modem back on first, wait for solid lights (2–3 min), then router. Order matters — the router needs the modem ready to handshake." },
      { heading: "3. Bypass the router", body: "Plug a laptop straight into the modem with Ethernet. Internet works? Your plan and modem are fine — the router is the fault. Still dead? It's the line or modem — call the ISP with that test result." },
    ],
    whenToCall: [
      "The modem never gets solid lights after 10 minutes.",
      "This happens monthly — you may need a modem/router replacement or wiring check.",
      "Storm damage: burnt smell, dead ports, gear that won't power on.",
    ],
  },
  {
    slug: "outlook-stuck-syncing",
    title: "Outlook Stuck Syncing / Won't Update Mail",
    excerpt: "Phone has new mail, Outlook doesn't. OST rebuild, profile repair, and the send/receive settings that actually matter.",
    readMinutes: 4,
    helpCategory: "email",
    serviceSlug: "communications/business-email",
    serviceLabel: "Email Problems",
    symptoms: ["Phone shows mail Outlook doesn't", "Folders say 'Syncing…' forever", "Send/receive errors or password prompts"],
    steps: [
      { heading: "1. Confirm it's Outlook, not the account", body: "Log into webmail (outlook.office.com). Mail current there? The mailbox is healthy — it's the desktop app. Missing there too? It's the account, skip to step 3." },
      { heading: "2. Repair the data file and profile", body: "Close Outlook, open Control Panel → Mail →Repair the profile, or delete and re-add the account to rebuild the OST cache. Corrupt caches cause most stuck-sync cases." },
      { heading: "3. Check storage and connection", body: "A full mailbox or OneDrive-quota issue silently halts sync. Also confirm you're on Online Mode vs Cached with a reasonable slider (1 year, not All)." },
    ],
    whenToCall: [
      "Multiple staff hit at once — likely a tenant, DNS, or license issue.",
      "Mail flow to customers is affected (delivery failures, spam-foldering).",
      "You need migration, archival, or compliance setup around it.",
    ],
  },
  {
    slug: "computer-slow-to-start",
    title: "Computer Takes Forever to Start",
    excerpt: "10-minute boots and spinning fans. Startup programs, disk type, and the 3 upgrades that actually matter.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Boot takes 5+ minutes", "Loud fan, hot base", "Everything lags for 10 min after login"],
    steps: [
      { heading: "1. Trim startup programs", body: "Task Manager → Startup apps. Disable updaters, chat apps, and anything with High startup impact you don't need instantly. This alone halves most slow boots." },
      { heading: "2. Check disk and thermals", body: "Still on a spinning hard drive? An SSD upgrade is the single biggest speedup per dollar. Vacuum vents and confirm fans spin — heat throttles everything." },
      { heading: "3. Scan and update once", body: "One full Defender scan plus Windows updates, then reboot. If it found threats or updates fail repeatedly, that's a deeper issue." },
    ],
    whenToCall: [
      "Clicking/grinding noises or SMART warnings — back up immediately, drive is dying.",
      "Blue screens during boot or Windows won't load at all.",
      "It's a work machine and downtime costs money — we tune it remotely same-day.",
    ],
  },
  {
    slug: "blue-screen-windows",
    title: "Windows Blue Screen (BSOD)",
    excerpt: "Stop codes without the panic. What to photograph, the 2 safe reboots, and when the drive is telling you goodbye.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Blue screen with :( and a stop code", "Restarts in a loop", "Started after an update or new hardware"],
    steps: [
      { heading: "1. Photograph the stop code", body: "Before it reboots, snap the QR/stop code (e.g. MEMORY_MANAGEMENT). That one line tells a tech whether it's RAM, drivers, or disk — and saves a paid diagnostic hour." },
      { heading: "2. Undo the last change", body: "New RAM, dock, or update right before it started? Remove it / roll back the update from Safe Mode. Most BSODs trace to the most recent change." },
      { heading: "3. Test memory and disk", body: "Windows Memory Diagnostic + chkdsk. Errors here mean hardware — stop using it for anything important until it's backed up." },
    ],
    whenToCall: [
      "Looping crashes or Windows won't reach the desktop.",
      "You smell burning, hear clicking, or see drive errors.",
      "Business machine with no backup — we prioritize data first.",
    ],
  },
  {
    slug: "emails-going-to-spam",
    title: "Our Emails Keep Going to Spam",
    excerpt: "Customers missing quotes and invoices. SPF, DKIM, DMARC in plain English — the 3 DNS records that fix deliverability.",
    readMinutes: 4,
    helpCategory: "email",
    serviceSlug: "communications/business-email",
    serviceLabel: "Email Problems",
    symptoms: ["Gmail/Outlook flag your mail as spam", "Clients say quotes never arrived", "Recently changed website host or email provider"],
    steps: [
      { heading: "1. Look up your domain", body: "Free tools (MXToolbox) show whether SPF, DKIM, and DMARC exist for your domain. Missing all three is the #1 cause we see." },
      { heading: "2. Publish the three records", body: "Add SPF (who may send), DKIM (signed proof), and a DMARC policy (what to do with fakes) in your DNS. Your host or 365 admin panel holds these." },
      { heading: "3. Warm up and watch", body: "New domains and sudden bulk sends get flagged. Send normally for 2–4 weeks and monitor DMARC reports before any newsletter blast." },
    ],
    whenToCall: [
      "Revenue mail (quotes, invoices) is bouncing or spam-foldered.",
      "You send from a CRM, website forms, or multiple tools.",
      "You need DMARC enforcement without breaking legit senders.",
    ],
  },
  {
    slug: "fake-virus-popup-scam",
    title: "“Virus Alert” Pop-Up Tells You to Call a Number",
    excerpt: "It's a scam — don't call the number. How to escape the full-screen trap safely in 60 seconds.",
    readMinutes: 2,
    helpCategory: "security",
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    symptoms: ["Full-screen warning with a phone number", "Loud beeping or voice warning", "Browser locked, can't close the tab"],
    steps: [
      { heading: "1. Don't call, don't click", body: "Microsoft, Apple, and your antivirus will never show a phone number in a browser warning. The number connects to scammers who'll ask for remote access and payment." },
      { heading: "2. Kill the browser", body: "Task Manager (Ctrl+Shift+Esc) → end the browser task. On Mac: Force Quit. Reopen without restoring tabs — the page reloads otherwise." },
      { heading: "3. Clear and scan", body: "Clear recent browsing data, then run one full Defender scan. If you already called or installed anything they asked, treat it as a real incident." },
    ],
    whenToCall: [
      "You called the number, paid, or let them connect remotely.",
      "Pop-ups persist after cleanup or new toolbars appeared.",
      "It's a work machine — assume breach and get a pro review.",
    ],
  },
  {
    slug: "new-home-wifi-dead-zones",
    title: "New Home, Big Dead Zones (Builder Router Can't Cope)",
    excerpt: "2,500+ sq ft, block walls, one weak ISP combo box. Why mesh beats repeaters and where the nodes actually go.",
    readMinutes: 4,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Back bedrooms or office drop constantly", "Builder/ISP router in a closet or garage", "20+ devices fighting one box"],
    steps: [
      { heading: "1. Map the dead zones", body: "Walk the house with a speed test at each room. One bad room = placement. Half the house = coverage — no settings tweak fixes physics." },
      { heading: "2. Move the main unit central and high", body: "Garage and closet installs kill signal through concrete. Central hallway, chest-high, is worth 2 bars before spending a dollar." },
      { heading: "3. Add mesh, not a repeater", body: "Two to three mesh nodes halve the distance every device shouts across. Wire what you can (TV, office) — wired devices stop competing for airtime." },
    ],
    whenToCall: [
      "You want Ethernet run to the office/TV spots during the fix.",
      "Ceiling-mount access points for 3,000+ sq ft or outdoor coverage.",
      "IoT and access-control gear (cameras, locks) keeps falling off the network.",
    ],
  },
  {
    slug: "microsoft-teams-cant-sign-in",
    title: "Microsoft Teams / 365 Keeps Asking You to Sign In",
    excerpt: "Endless login loops and password prompts. Credential Manager, MFA app vs SMS, and the token reset that ends it.",
    readMinutes: 3,
    helpCategory: "m365",
    serviceSlug: "cloud-solutions/microsoft-365",
    serviceLabel: "Microsoft 365",
    symptoms: ["Teams loops back to sign-in", "Outlook asks for password daily", "Started after a password change"],
    steps: [
      { heading: "1. Clear stale credentials", body: "Windows Credential Manager → remove old Office/Teams entries, then sign in fresh. A changed password plus a cached token is the classic loop." },
      { heading: "2. Use the Authenticator app, not SMS", body: "Approve sign-ins from Microsoft Authenticator instead of typing SMS codes — faster, and immune to SIM-swap attacks that SMS isn't." },
      { heading: "3. Reset the Teams cache", body: "Fully quit Teams, clear %appdata%\\Microsoft\\Teams, and relaunch. Corrupt caches survive reinstalls if you skip this." },
    ],
    whenToCall: [
      "The whole team loops at once — likely Conditional Access or license expiry.",
      "You need MFA rolled out properly across 5+ users.",
      "Sign-ins from places you've never been — possible compromise.",
    ],
  },
];

export function getFix(slug: string): QuickFix | undefined {
  return fixes.find((f) => f.slug === slug);
}

export function getFixesForService(serviceSlug: string): QuickFix[] {
  return fixes.filter((f) => f.serviceSlug === serviceSlug);
}
