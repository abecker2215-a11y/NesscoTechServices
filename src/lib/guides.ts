import type { FAQItem } from "./types";
import miniGuidesData from "./guides-data/mini-guides.json";
import { toGuide, type MiniGuide } from "./mini-guides";

export interface GuideStep {
  heading: string;
  body: string;
}

export interface Guide {
  slug: string;
  title: string;
  excerpt: string;
  readMinutes: number;
  /** Freshness line shown on cards and detail pages. Defaults to October 2026. */
  updated?: string;
  serviceSlug: string;
  serviceLabel: string;
  helpCategory: string;
  helpCategoryLabel: string;
  /** Optional walkthrough video (YouTube/Loom embed URL). Renders when set. */
  videoUrl?: string;
  steps: GuideStep[];
  whenToCall: string[];
  faqs: FAQItem[];
}

export const coreGuides: Guide[] = [
  {
    slug: "fix-slow-wifi-tampa",
    title: "Slow Wi-Fi? Fix It Yourself in 15 Minutes (Tampa Businesses)",
    excerpt:
      "Dead zones, buffering, devices dropping off — try these 5 proven steps before you call anyone. Most Tampa slowdowns are placement or interference, not your plan.",
    readMinutes: 6,
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    helpCategory: "wifi",
    helpCategoryLabel: "Wi-Fi / Networking",
    steps: [
      {
        heading: "1. Restart in the right order",
        body: "Unplug your modem and router for 60 seconds. Plug the modem back in first, wait for its lights to go solid (2–3 minutes), then plug in the router. This clears stale connections and forces a fresh handshake with your provider — it genuinely fixes about a third of issues.",
      },
      {
        heading: "2. Move the router up and central",
        body: "Wi-Fi radiates down and out. A router on the floor in a corner loses half its signal to walls and furniture. Put it chest-high, centrally located, away from metal filing cabinets, mirrors, and microwaves. In Tampa block buildings, one interior wall can halve your speed.",
      },
      {
        heading: "3. Split the 2.4 GHz and 5 GHz networks",
        body: "Log into your router (usually 192.168.1.1) and give the two bands different names, like Office-5G and Office-2G. Join stationary devices near the router to 5G (faster) and distant smart devices and IoT gear to 2.4G (longer range). Auto-band-steering on cheap ISP combos misfires constantly.",
      },
      {
        heading: "4. Check for channel congestion",
        body: "In apartments and dense neighborhoods like downtown Tampa, every router shouts on the same channels. A free scanner app (e.g. WiFi Analyzer on Android) shows the least crowded channel — switch to 1, 6, or 11 on 2.4 GHz in your router settings.",
      },
      {
        heading: "5. Test wired vs. wireless",
        body: "Plug a laptop directly into the router with an Ethernet cable and run a speed test. Fast wired but slow wireless? Your internet plan is fine — the Wi-Fi itself is the problem (placement, age, or dead zones). Slow on both? Call your ISP with the wired number in hand.",
      },
    ],
    whenToCall: [
      "Wired speeds are fine but rooms still have dead zones (you likely need mesh or an access point).",
      "Your router is 5+ years old and struggles with 20+ devices.",
      "You need Ethernet run through walls or ceiling-mounted access points.",
    ],
    faqs: [
      {
        q: "Will upgrading my internet plan fix slow Wi-Fi?",
        a: "Usually not. If wired speeds already match your plan, a faster plan changes nothing over Wi-Fi. Fix coverage and interference first — it's cheaper and actually works.",
      },
      {
        q: "Is a mesh system worth it?",
        a: "For offices over ~1,800 sq ft or spaces with thick walls, yes. Two or three mesh nodes beat one powerful router because they shorten the distance every device has to shout across.",
      },
      {
        q: "How much does professional Wi-Fi help cost?",
        a: "Remote diagnosis starts at $75; on-site optimization and mesh installs start at $125/hr plus hardware. We quote the hardware upfront — you approve everything.",
      },
    ],
  },
  {
    slug: "turn-on-mfa-microsoft-365",
    title: "Turn On MFA in Microsoft 365 Before Someone Else Turns It On For You",
    excerpt:
      "Multi-factor authentication blocks nearly all password-based break-ins and takes 10 minutes per user. Here's the setup order we use for Tampa small businesses.",
    readMinutes: 5,
    serviceSlug: "cloud-solutions/microsoft-365",
    serviceLabel: "Microsoft 365",
    helpCategory: "m365",
    helpCategoryLabel: "Microsoft 365",
    steps: [
      {
        heading: "1. Require the Microsoft Authenticator app (not SMS)",
        body: "In the Microsoft 365 admin center, go to Users → Active users → Multi-factor authentication, and enable it for each user. Have everyone install Microsoft Authenticator and approve a sign-in from the app instead of typing SMS codes — app approvals resist SIM-swap attacks that SMS doesn't.",
      },
      {
        heading: "2. Enforce it with a Conditional Access policy",
        body: "Per-user MFA can be skipped by legacy apps. Create a Conditional Access policy (Entra admin center → Protection → Conditional Access) that requires MFA for all users and all cloud apps. Exclude one emergency 'break-glass' admin account and store its credentials offline.",
      },
      {
        heading: "3. Disable legacy authentication",
        body: "Old email apps send passwords in ways MFA can't protect. In the same Conditional Access area, block legacy authentication protocols. If an ancient scanner or app breaks, that's the moment to replace it — not to leave the hole open.",
      },
      {
        heading: "4. Register backup methods",
        body: "Each user should register two methods (e.g. app + phone). When someone loses their phone on vacation, the second method is the difference between a 2-minute fix and a locked-out Monday.",
      },
    ],
    whenToCall: [
      "You have 5+ users and don't want to click through this one by one.",
      "You need Conditional Access, compliance documentation, or a break-glass strategy.",
      "Something already looks compromised (unknown sign-ins, forwarding rules you didn't create).",
    ],
    faqs: [
      {
        q: "Will MFA annoy my team?",
        a: "For the first day, slightly. After that, sign-ins on trusted devices remember them for weeks. The 30 seconds it occasionally costs beats explaining a breach to clients.",
      },
      {
        q: "What if someone loses their phone?",
        a: "An admin revokes the old device's sessions and re-registers the new one — about 5 minutes. This is why the break-glass admin account and backup methods matter.",
      },
      {
        q: "Can you set this up for our whole company?",
        a: "Yes — MFA rollout, Conditional Access, and license cleanup are core Microsoft 365 work. Remote setup starts at $75/hr, and most small teams are done in 1–2 hours.",
      },
    ],
  },
  {
    slug: "backup-checklist-small-business",
    title: "The 10-Minute Backup Check Every Small Business Should Run Monthly",
    excerpt:
      "Backups only matter the day you need them. This monthly checklist verifies yours actually work — before ransomware or a dead drive does it for you.",
    readMinutes: 4,
    serviceSlug: "backup-disaster-recovery",
    serviceLabel: "Data Backup",
    helpCategory: "other",
    helpCategoryLabel: "Backup & Recovery",
    steps: [
      {
        heading: "1. Confirm the last successful backup date",
        body: "Open your backup software and check: did last night's backup actually complete? A backup that 'usually runs' but silently failed three weeks ago is the most common disaster we see. No green checkmark within 24 hours = investigate today.",
      },
      {
        heading: "2. Verify the 3-2-1 rule",
        body: "You need 3 copies of important data, on 2 different types of media, with 1 copy off-site. An external drive plugged into the same computer fails this test — ransomware encrypts attached drives too. One copy must live somewhere a local disaster can't reach (cloud or rotated off-site drive).",
      },
      {
        heading: "3. Restore one file",
        body: "Pick a random file from last week and restore it. If you can't restore a single file in 5 minutes, you don't have backups — you have a backup-shaped hope. Test restores catch corrupt backup sets, expired credentials, and full destinations.",
      },
      {
        heading: "4. Check what's NOT backed up",
        body: "New employee's laptop? Files in someone's personal OneDrive? The shared folder added last month? Backups cover what they were configured to cover — new data silently falls outside. Review the included folders list monthly.",
      },
    ],
    whenToCall: [
      "Your 'backup' is a USB drive plugged into the same PC.",
      "A restore test fails, or you can't find where backups even live.",
      "You need ransomware-proof versioning, retention policies, or compliance documentation.",
    ],
    faqs: [
      {
        q: "Is cloud backup safe?",
        a: "With reputable encrypted providers (SOC 2 compliant), yes — far safer than a single local drive. Encryption means the provider can't read your files, and versioning means ransomware can't permanently destroy them.",
      },
      {
        q: "How often should backups run?",
        a: "Daily for active business data, with versioning so you can go back in time. Databases and email may need more frequent snapshots — we size the schedule to how much work you can afford to redo.",
      },
      {
        q: "What does backup setup cost?",
        a: "Remote setup starts at $75/hr; most small setups take 1–2 hours plus the storage subscription (often a few dollars per month). Verification and documentation are included.",
      },
    ],
  },
  {
    slug: "speed-up-slow-windows-pc",
    title: "Slow Computer? 6 Fixes That Actually Speed Up Windows 10 & 11",
    excerpt:
      "Spinning wheels, 5-minute startups, fans screaming — most slow PCs are bloated software and full drives, not dead hardware. Here's what to try first.",
    readMinutes: 6,
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    helpCategory: "computer",
    helpCategoryLabel: "Computer",
    steps: [
      {
        heading: "1. Check what's hogging startup",
        body: "Press Ctrl + Shift + Esc to open Task Manager, click the Startup apps tab, and disable anything with High startup impact that you don't use daily (Spotify, Adobe updaters, game launchers). Restart and time the difference — this alone fixes about half of 'slow boot' complaints.",
      },
      {
        heading: "2. Free up disk space (aim for 20% free)",
        body: "Go to Settings → System → Storage → Cleanup recommendations and remove temp files, old Windows updates, and unused apps. A drive over 90% full slows everything down because Windows has no room for swap and updates. Empty the Recycle Bin and move big videos to an external drive or OneDrive.",
      },
      {
        heading: "3. Uninstall the junk you never asked for",
        body: "In Settings → Apps → Installed apps, sort by size and remove toolbars, duplicate antivirus trials, preinstalled games, and 'PC optimizers' that are actually adware. One real antivirus is enough — two actively fight each other and halve your speed.",
      },
      {
        heading: "4. Check Task Manager for runaway processes",
        body: "In Task Manager → Processes, sort by CPU and Memory. A browser with 40 tabs, a stuck OneDrive sync, or an antivirus scan can pin a healthy machine at 100%. Close the offender, update Chrome/Edge, and check if OneDrive is stuck syncing the same file repeatedly.",
      },
      {
        heading: "5. Run updates and a health check",
        body: "Install all pending Windows updates (Settings → Windows Update) and update your storage and graphics drivers. Then open Command Prompt as admin and run 'sfc /scannow' to repair corrupt system files. If the drive health or SMART status shows warnings, stop and back up immediately.",
      },
    ],
    whenToCall: [
      "The PC still crawls after cleanup (likely a failing hard drive — an SSD upgrade usually makes it feel new).",
      "You see blue screens, clicking/grinding noises, or 'no boot device' errors.",
      "You need files recovered from a PC that won't start.",
    ],
    faqs: [
      {
        q: "Will more RAM fix my slow computer?",
        a: "Sometimes. If Task Manager shows memory constantly above 85%, an upgrade helps. If the disk is at 100% on an old spinning hard drive, an SSD upgrade helps far more — it's the single best speed upgrade for PCs over 4 years old.",
      },
      {
        q: "Are PC cleaner apps worth it?",
        a: "No. Most are adware or charge for what Windows Storage Sense already does free. Stick to the built-in cleanup tools and one reputable antivirus.",
      },
      {
        q: "How much does a tune-up or SSD upgrade cost?",
        a: "Remote tune-ups start at $75; in-shop SSD upgrades with data transfer typically run $125/hr plus the drive ($60–$120). Most machines are back in 1–2 business days.",
      },
    ],
  },
  {
    slug: "remove-virus-malware-windows",
    title: "Think You Have a Virus? Remove Malware Safely in 30 Minutes",
    excerpt:
      "Pop-ups, fake Microsoft warnings, browser hijacks — don't click anything. Isolate it, scan it, and clean it in this exact order.",
    readMinutes: 5,
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    helpCategory: "security",
    helpCategoryLabel: "Security",
    steps: [
      {
        heading: "1. Disconnect and don't pay anyone",
        body: "Unplug Ethernet or turn on airplane mode to cut the malware's connection. If you see a 'Call Microsoft at …' lock screen, it is fake — Microsoft never locks your browser with a phone number. Do not call it, do not pay gift cards, do not grant remote access to the pop-up's 'technician.'",
      },
      {
        heading: "2. Boot into Safe Mode and run a real scan",
        body: "Restart while holding Shift → Troubleshoot → Startup Settings → Safe Mode with Networking. Run a full scan with Windows Security (Virus & threat protection → Scan options → Full scan), then a second-opinion scan with the free Malwarebytes. Remove what they find and restart normally.",
      },
      {
        heading: "3. Remove rogue browser extensions and apps",
        body: "In Chrome/Edge, go to Extensions and remove anything you didn't install. Then check Settings → Apps for programs installed around the date the problems started (sort by install date). Search the web for unfamiliar names before removing — some are legitimate drivers.",
      },
      {
        heading: "4. Change passwords from a clean device",
        body: "On your phone or another clean computer, change your email password first, then banking, then Microsoft/Apple accounts. Turn on multi-factor authentication everywhere. Assume anything you typed on the infected PC was seen — that inbox-first order stops the attacker from resetting everything else.",
      },
    ],
    whenToCall: [
      "Ransomware encrypted your files (screens demanding Bitcoin) — power off and call immediately; every minute matters.",
      "Banking or email passwords were used on the infected PC and you see logins you didn't make.",
      "Pop-ups return after two clean scans, or Windows won't boot at all.",
    ],
    faqs: [
      {
        q: "Should I pay the ransomware?",
        a: "Almost never — payment funds criminals and only about half of payers get working keys. Power the machine off to stop the spread, then call us. If offline backups exist, recovery is usually straightforward.",
      },
      {
        q: "Is Windows Defender enough?",
        a: "For careful users, yes, plus common sense. For businesses handling client data, add managed endpoint protection with centralized alerts so one infected laptop doesn't sit silently for weeks.",
      },
      {
        q: "What does virus cleanup cost?",
        a: "Remote cleanup starts at $75; heavily infected or ransomware cases needing on-site work start at $125/hr. We'll tell you upfront if a wipe-and-rebuild is cheaper than hours of scrubbing.",
      },
    ],
  },
  {
    slug: "spot-stop-phishing-emails",
    title: "Spot a Phishing Email in 60 Seconds (With Real Examples)",
    excerpt:
      "99% of breaches start with one click. Teach your team this 5-point check and cut your risk more than any firewall upgrade.",
    readMinutes: 5,
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    helpCategory: "security",
    helpCategoryLabel: "Security",
    steps: [
      {
        heading: "1. Inspect the sender — not just the name",
        body: "Hover over (don't click) the sender name to reveal the real address. 'Microsoft Security <support-m365-verify.ru>' is not Microsoft. Watch for lookalike domains: micros0ft, rnicrosoft, or a Gmail address pretending to be your boss or vendor.",
      },
      {
        heading: "2. Hover every link before you click",
        body: "Hover over buttons and links to preview the real URL in the corner. A 'View Invoice' button pointing to a random file-share or URL shortener is a red flag. When in doubt, open your browser and go to the site directly instead of clicking through.",
      },
      {
        heading: "3. Treat urgency + secrecy as the tell",
        body: "'Wire $4,800 before 2pm, don't tell anyone' — every business email compromise uses the same recipe: authority (your CEO), urgency (today), and secrecy (keep this between us). Real executives don't ban you from verifying a payment by phone.",
      },
      {
        heading: "4. Verify through a different channel",
        body: "Got an unexpected invoice, password reset, or gift-card request? Call the person at a known number or start a new email thread — never reply to the suspicious one. For vendors, confirm new bank details by phone using the number on their website, not in the email.",
      },
      {
        heading: "5. Report it, then delete it",
        body: "In Outlook, use Report → Phishing so IT and Microsoft see it. Don't forward it around the office ('is this real?') — one curious click is all it takes. If you already clicked or entered credentials, change that password from a clean device and turn on MFA now.",
      },
    ],
    whenToCall: [
      "Someone clicked and entered credentials, or a wire was sent — call immediately, we contain first and investigate second.",
      "You want phishing simulation + training so staff learn on fakes instead of real attacks.",
      "Suspicious login alerts, new inbox forwarding rules, or mail flow rules you didn't create.",
    ],
    faqs: [
      {
        q: "We have spam filters — isn't that enough?",
        a: "Filters catch most bulk spam but the targeted one-to-one CEO-fraud emails sail through because they contain no malware links — just words. Training plus MFA covers what filters miss.",
      },
      {
        q: "What should we do in the first 10 minutes after a click?",
        a: "Disconnect the device, change the password from a clean device, revoke active sessions, and check for forwarding rules. Then call us — we handle containment, mailbox review, and documentation.",
      },
      {
        q: "Do you offer security training for small teams?",
        a: "Yes — simulated phishing, 20-minute staff training, and MFA rollout bundled for small businesses. Remote work starts at $75/hr, and most teams are covered in a single session.",
      },
    ],
  },
  {
    slug: "fix-outlook-not-syncing",
    title: "Outlook Not Syncing? Fix Send, Receive & Mobile Sync Fast",
    excerpt:
      "Emails stuck in Outbox, phone missing new mail, 'disconnected' warnings — walk this checklist before rebuilding anything.",
    readMinutes: 5,
    serviceSlug: "communications/business-email",
    serviceLabel: "Email Problems",
    helpCategory: "email",
    helpCategoryLabel: "Email",
    steps: [
      {
        heading: "1. Check the connection status first",
        body: "In Outlook on Windows, look at the bottom status bar: 'Connected to Microsoft Exchange' is good; 'Disconnected,' 'Trying to connect,' or 'Need password' tells you where to focus. Click Send/Receive → Work Offline twice to toggle it back online, then Send/Receive All Folders.",
      },
      {
        heading: "2. Clear the Outbox and oversized attachments",
        body: "A single 30MB attachment on slow Wi-Fi blocks everything behind it. Open the Outbox, delete or draft the stuck message, and re-send large files as OneDrive/SharePoint links instead. Then check Drafts and Outbox on your phone too — a stuck mobile send loops the same failure.",
      },
      {
        heading: "3. Re-enter the password in the right place",
        body: "After a password change, Outlook, your iPhone, and Android each hold the old one separately. Update it in Outlook (File → Account Settings), then on each phone (Settings → Mail → Accounts). One stale device hammering the old password can temporarily lock the account for all of them.",
      },
      {
        heading: "4. Repair the account instead of deleting it",
        body: "In Outlook: File → Account Settings → Repair. This rebuilds the connection without losing mail. If search or folders still won't update, create a new Outlook profile (Control Panel → Mail → Show Profiles) rather than reinstalling Office — it's faster and preserves your data file.",
      },
    ],
    whenToCall: [
      "Mail flows on webmail (outlook.office.com) but no desktop or phone will connect — likely an Autodiscover, DNS, or Conditional Access issue.",
      "You see repeated bounces mentioning SPF, DKIM, or DMARC — your domain's mail authentication needs fixing.",
      "You're migrating providers or adding users and don't want downtime or lost folders.",
    ],
    faqs: [
      {
        q: "Why does webmail work but Outlook doesn't?",
        a: "Webmail bypasses your local Outlook data file and network path. The usual culprits are a corrupt OST file, an expired cached password, or a network/VPN blocking Outlook's connection. Repairing the profile fixes most cases.",
      },
      {
        q: "Why do my emails go to spam?",
        a: "Missing or wrong SPF, DKIM, and DMARC records are the #1 cause. We publish and verify all three, then monitor with DMARC reports so legitimate mail lands in inboxes.",
      },
      {
        q: "Can you migrate us without losing email?",
        a: "Yes — we migrate mail, calendars, and contacts from Google, GoDaddy, and old Exchange with a cutover plan that avoids downtime. Most small mailboxes migrate remotely at $75/hr.",
      },
    ],
  },
  {
    slug: "migrate-google-to-microsoft-365",
    title: "Switching From Google to Microsoft 365? A No-Downtime Plan",
    excerpt:
      "Licenses, mail flow, Drive files, calendars — the order that avoids lost email and Monday-morning chaos for teams of 5–50.",
    readMinutes: 7,
    serviceSlug: "cloud-solutions/microsoft-365",
    serviceLabel: "Microsoft 365",
    helpCategory: "m365",
    helpCategoryLabel: "Microsoft 365",
    steps: [
      {
        heading: "1. Pick the right licenses before touching mail",
        body: "Map each person to Business Basic, Standard, or Premium based on whether they need desktop Office apps and advanced security. Buying everyone Premium wastes hundreds per year; buying Basic for people who live in Excel costs more in frustration. List shared mailboxes and ex-employees first — those often don't need paid licenses at all.",
      },
      {
        heading: "2. Verify the domain and stage the mailboxes",
        body: "Add your domain to Microsoft 365 and verify with a TXT record (no mail impact yet). Create all users, assign licenses, and run a pre-migration sync so mailboxes exist before cutover. Export a Google Takeout backup of Drive and mail for at least owners and finance before anything moves.",
      },
      {
        heading: "3. Move files before the mail cutover weekend",
        body: "Migrate shared Drive folders to SharePoint/Teams and personal files to OneDrive during the week using the SharePoint Migration Tool. Fix sharing permissions as you go — 'anyone with the link' Drive folders should become proper Teams memberships, not public links.",
      },
      {
        heading: "4. Cut over MX records on Friday evening",
        body: "Lower your DNS TTL to 300 seconds a day ahead, then switch MX records to Microsoft after hours. Migrate the final delta of mail, verify send/receive, and update SPF/DKIM/DMARC. Keep Google active (not deleted) for 30 days as a safety net while stragglers and forwards drain out.",
      },
      {
        heading: "5. Lock it down on Monday",
        body: "Enforce MFA, set up Conditional Access, turn off legacy auth, and review external sharing defaults. Walk every user through Teams, OneDrive sync, and Outlook mobile setup — the migration fails if Monday feels broken, even when the data is perfect.",
      },
    ],
    whenToCall: [
      "You have 5+ mailboxes, shared drives, or compliance needs — a botched cutover loses mail silently.",
      "SPF/DKIM/DMARC, archiving, or retention policies need to survive the move.",
      "You want someone on call through the cutover weekend, not a support ticket queue.",
    ],
    faqs: [
      {
        q: "Will we lose email during the switch?",
        a: "Not with a staged migration. Both systems run in parallel, the final delta syncs at cutover, and Google stays active for 30 days. Downtime is typically zero — users just restart Outlook on Monday.",
      },
      {
        q: "What happens to our Google Drive files?",
        a: "They map to SharePoint (shared) and OneDrive (personal). Permissions need remapping since Google and Microsoft sharing models differ — that's the step most DIY migrations get wrong.",
      },
      {
        q: "What does a guided migration cost?",
        a: "Remote migrations start at $75/hr; most teams of 5–25 land in the 3–6 hour range plus licenses. Weekend cutover coverage and Monday hypercare are included in our fixed quotes.",
      },
    ],
  },
  {
    slug: "fix-wireless-printer-not-printing",
    title: "Wireless Printer Won't Print? Reconnect It in 10 Minutes",
    excerpt:
      "Offline errors, print jobs stuck in queue, phone can't find the printer — 90% fixed without drivers or a new printer.",
    readMinutes: 4,
    serviceSlug: "it-support",
    serviceLabel: "Remote Support",
    helpCategory: "printer",
    helpCategoryLabel: "Printer",
    steps: [
      {
        heading: "1. Confirm the printer is on YOUR Wi-Fi network",
        body: "Print a network config page (usually Settings → Reports → Network Summary) and check the SSID. Printers silently hop to a neighbor's open network, a 5GHz band your PC isn't on, or a guest network after a power outage. If the IP starts with 169.254, it has no real connection at all.",
      },
      {
        heading: "2. Restart in this order: printer, router, PC",
        body: "Power the printer fully off for 30 seconds (not just sleep), then restart your router, then your PC. When everything is back, run one test page from the printer itself first — if the printer can't print its own test page, no Wi-Fi trick will help; check ink, paper, and jams.",
      },
      {
        heading: "3. Clear the stuck print queue",
        body: "On Windows: Settings → Bluetooth & devices → Printers → Open print queue → cancel all documents. Then restart the Print Spooler service (services.msc → Print Spooler → Restart). One corrupted job from three days ago blocks every job behind it.",
      },
      {
        heading: "4. Re-add the printer by IP address",
        body: "Instead of auto-discovery, add it manually: Settings → Printers → Add device → Manually add → Add by TCP/IP address, and enter the IPv4 address from the config page. This survives router reboots that break the friendly-name discovery that fails constantly.",
      },
    ],
    whenToCall: [
      "The printer won't join Wi-Fi at all, or drops off every few days (likely band-steering or a dying wireless card).",
      "You need it shared for an office — static IP, scan-to-folder, and driver deployment across PCs.",
      "Error codes point to fuser, drum, or hardware failure rather than connectivity.",
    ],
    faqs: [
      {
        q: "Should the printer use 2.4GHz or 5GHz?",
        a: "2.4GHz for most printers — longer range and fewer dropouts through walls. Reserve 5GHz for laptops and streaming. Give the bands separate names so the printer can't hop between them.",
      },
      {
        q: "Why does my printer show 'Offline' when it's on?",
        a: "Usually a stale IP after a router reboot. Re-adding by IP address (step 4) fixes it permanently. If it recurs weekly, assign the printer a static/DHCP-reserved address in the router.",
      },
      {
        q: "Can you set this up remotely?",
        a: "Yes — printer Wi-Fi setup, driver installs, and scan-to-email are classic remote jobs at $75. If it needs hands on hardware, we'll say so in the first 10 minutes.",
      },
    ],
  },
  {
    slug: "lock-down-office-wifi-router",
    title: "Lock Down Your Office Router in 20 Minutes (Stop the Drive-By Hack)",
    excerpt:
      "Default passwords, ancient firmware, and wide-open guest access — the 5 router settings that keep intruders off your network.",
    readMinutes: 5,
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    helpCategory: "wifi",
    helpCategoryLabel: "Wi-Fi / Networking",
    steps: [
      {
        heading: "1. Change the admin password (not the Wi-Fi password — the other one)",
        body: "Log into your router (usually 192.168.1.1 or 192.168.0.1) with the default admin/admin or admin/password printed on the label — the same defaults everyone on the internet knows. Change it to something unique first. Anyone on your Wi-Fi with the default admin login owns the whole network.",
      },
      {
        heading: "2. Update the firmware",
        body: "In the router's Administration or Advanced tab, run Check for Updates. Unpatched routers are how whole neighborhoods end up in botnets — manufacturers quietly fix serious holes every few months. Turn on auto-update if your model offers it.",
      },
      {
        heading: "3. Use WPA3 (or WPA2-AES) with a real passphrase",
        body: "Set wireless security to WPA3-Personal, or WPA2-AES if WPA3 isn't offered — never WEP or 'Open'. Use a 4+ random-word passphrase instead of a pet's name. Then split the 2.4GHz and 5GHz bands with different names so smart devices and IoT gear stop hopping between them.",
      },
      {
        heading: "4. Set up a guest network for visitors and smart devices",
        body: "Enable the guest network with its own password and turn on 'isolate clients' if offered. Guests and unmanaged IoT devices get internet without touching your computers, servers, or printers. In shared office buildings, this one setting prevents most lateral movement.",
      },
      {
        heading: "5. Turn off WPS and remote management",
        body: "Disable WPS (the push-button pairing with a known brute-force flaw) and turn off remote/WAN management unless you specifically use it. Both are doors you didn't know were open.",
      },
    ],
    whenToCall: [
      "You can't log into the router at all (ISP-locked combo units often need a call to unlock).",
      "You want router-level content filtering, VPN, or a separate guest/work network configured properly.",
      "Something already looks compromised — unknown devices, redirected searches, changed DNS.",
    ],
    faqs: [
      {
        q: "Is the free router from my ISP good enough?",
        a: "It works, but ISP combos usually have weak range, outdated firmware, and locked-down settings. A $120–$180 standalone router with mesh support beats them on coverage and security — we can recommend one for your floorplan.",
      },
      {
        q: "How often should I update router firmware?",
        a: "Check quarterly, or enable auto-update and forget it. After any major vulnerability makes the news, check immediately.",
      },
      {
        q: "Can you secure our whole office network remotely?",
        a: "Yes — router hardening, guest networks, and content filtering are standard $75 remote jobs. Mesh installs and Ethernet runs need an on-site visit from $125/hr.",
      },
    ],
  },
  {
    slug: "password-manager-first-hour",
    title: "Set Up a Password Manager in Your First Hour (Never Reuse Again)",
    excerpt:
      "One master password to remember, unique 20-character passwords everywhere else. The exact first-hour setup that kills 90% of account-takeover risk.",
    readMinutes: 5,
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    helpCategory: "security",
    helpCategoryLabel: "Security",
    steps: [
      {
        heading: "1. Pick one and install it everywhere",
        body: "Choose a reputable manager (Bitwarden's free tier is excellent; 1Password is the polished paid pick) and install the app on your phone plus the browser extension on every computer. A manager that only lives on one device gets abandoned in a week.",
      },
      {
        heading: "2. Create one strong master password and write down the recovery kit",
        body: "Use 5+ random words you'll actually remember. Then print or write the emergency recovery kit and store it somewhere a fire or break-in won't reach — a safe deposit box or a sealed envelope with a trusted person. Lose this and even the company can't recover your vault.",
      },
      {
        heading: "3. Import and upgrade your top 5 accounts first",
        body: "Import from your browser, then change email, banking, Microsoft/Apple, cloud storage, and social logins to generated 20-character passwords first — in that order. Email is the master key to everything else, so it goes first, always.",
      },
      {
        heading: "4. Turn on the manager's breach alerts",
        body: "Enable breach monitoring and run the password-health report. It will flag every reused and breached password you own. Work through the criticals over the next week — 10 minutes a night and you're done.",
      },
      {
        heading: "5. Add a second person for emergencies",
        body: "Set up emergency access for a spouse or business partner. If you're ever locked out or incapacitated, they can get in after a waiting period you choose. Skipping this step is how families lose photo archives and businesses lose domains.",
      },
    ],
    whenToCall: [
      "You need it rolled out across a team with shared logins and offboarding controls.",
      "An account is already compromised — we contain it, reset the chain, and lock down recovery paths.",
      "You want passkeys and hardware-key (YubiKey) setup layered on top for the business.",
    ],
    faqs: [
      {
        q: "Isn't putting all passwords in one place risky?",
        a: "It's the opposite of risky: the vault is encrypted with your master password, which the company never sees. Reusing one password everywhere means a single breach hands over everything — that's the real single point of failure.",
      },
      {
        q: "What about the passwords saved in my browser?",
        a: "Move them over, then turn browser saving off and clear what's stored. Browsers store passwords with far weaker protection and no breach alerts.",
      },
      {
        q: "Can you set this up for our whole office?",
        a: "Yes — team vaults, shared collections, and offboarding procedures are standard Microsoft 365-adjacent work at $75/hr remote. Most small teams are done in 1–2 hours.",
      },
    ],
  },
  {
    slug: "windows-10-still-running-upgrade",
    title: "Still on Windows 10? Your Upgrade Options (Support Is Over)",
    excerpt:
      "Windows 10 support ended October 2025 — no more security patches. Check if your PC can run Windows 11, and what to do if it can't.",
    readMinutes: 6,
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    helpCategory: "computer",
    helpCategoryLabel: "Computer",
    steps: [
      {
        heading: "1. Check if your PC qualifies for Windows 11",
        body: "Download Microsoft's PC Health Check app and run it. The usual blocker is TPM 2.0 or an older CPU — most PCs built after 2018 pass. If it fails, note exactly which requirement failed before deciding anything.",
      },
      {
        heading: "2. Back up everything before touching the upgrade",
        body: "Verify OneDrive or your backup actually contains your Desktop, Documents, and photos — then restore one file as a test. Upgrades rarely eat data, but 'rarely' is not a backup strategy. See our 10-minute backup checklist first.",
      },
      {
        heading: "3. Upgrade in place if you qualify",
        body: "On a qualifying PC: Settings → Windows Update and take the Windows 11 upgrade. Plug into power, use Ethernet if possible, and give it an hour undisturbed. Don't force-shutdown mid-upgrade — that's how you manufacture a real problem.",
      },
      {
        heading: "4. If it doesn't qualify: your three real options",
        body: "Option A: keep Windows 10 disconnected from anything sensitive (not recommended for banking or business). Option B: a clean Linux install for basic browsing (free, fast on old hardware). Option C: replace the PC — machines that old usually need an SSD and battery anyway, so do the math honestly.",
      },
      {
        heading: "5. Harden the fresh system on day one",
        body: "Fresh Windows 11 or not: enable BitLocker/device encryption, turn on Defender's tamper protection, set up a password manager, and confirm backups run automatically. A new OS with old habits is just a shinier target.",
      },
    ],
    whenToCall: [
      "The upgrade fails, loops, or leaves you with a black screen and a deadline.",
      "You have business software that must be verified compatible before moving.",
      "You need data migrated to a new PC with zero downtime — we do evening and weekend cutovers.",
    ],
    faqs: [
      {
        q: "Can I just keep using Windows 10?",
        a: "You can, but every month without patches makes it a softer target — especially for banking, email, and business use. If you must stay, isolate it: no banking, updated browser, good backups.",
      },
      {
        q: "Will my programs survive the upgrade?",
        a: "Nearly all Windows 10 apps run on 11. The exceptions are ancient proprietary tools and some printer/scanner drivers — check those two before upgrading a work machine.",
      },
      {
        q: "What does an assisted upgrade cost?",
        a: "Remote upgrade assistance starts at $75; new-PC setup with full data migration is typically 1–2 hours on-site from $125/hr. We verify backups first, always.",
      },
    ],
  },
  {
    slug: "new-computer-setup-checklist",
    title: "New Computer? The 30-Minute Setup Checklist (Do It Right Once)",
    excerpt:
      "Updates, bloatware removal, backup from day one, password manager, printer — the exact order that prevents 90% of 'new PC' headaches.",
    readMinutes: 5,
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    helpCategory: "computer",
    helpCategoryLabel: "Computer",
    steps: [
      {
        heading: "1. Update everything before you personalize anything",
        body: "Connect to Wi-Fi, run all Windows/macOS updates to completion (reboot as asked), then update the browser and store apps. Setting everything up on an unpatched system means redoing half of it later.",
      },
      {
        heading: "2. Remove the bloatware and trials",
        body: "Uninstall antivirus trials, preinstalled games, duplicate photo apps, and 'free' utilities. Keep one real antivirus (Defender counts) and the manufacturer's driver utility. Less software means fewer pop-ups, faster boot, and fewer vulnerabilities.",
      },
      {
        heading: "3. Set up backup before you create a single file",
        body: "Turn on OneDrive/iCloud folder backup or your backup tool now — while there's nothing to lose. Backups configured on day one actually run; backups configured 'later' famously don't.",
      },
      {
        heading: "4. Password manager, MFA, and encryption",
        body: "Install your password manager, enable MFA on email and banking, and turn on BitLocker/FileVault encryption. A stolen unencrypted laptop hands over everything; an encrypted one hands over hardware.",
      },
      {
        heading: "5. Migrate data, then connect printer and peripherals",
        body: "Copy files from the old machine or external drive, verify the important folders open, then add the printer (by IP for reliability), scanner, and monitors. Test-print one page before you need it for real.",
      },
    ],
    whenToCall: [
      "Data lives on a dead or dying old PC — we recover and migrate it first.",
      "It's a business machine needing 365, VPN, shared drives, and policies.",
      "You bought 3+ machines (office refresh) — we image and deploy them identically.",
    ],
    faqs: [
      {
        q: "Should I transfer everything from the old PC?",
        a: "Transfer data, not programs. Fresh-install apps on the new machine — migrating installed programs drags over the exact bloat and rot you're escaping.",
      },
      {
        q: "How long does a proper setup take?",
        a: "30–60 minutes of focused work for a single PC, plus update time. Business machines with 365 and policies run 1–2 hours.",
      },
      {
        q: "Can you do the whole thing for me?",
        a: "Yes — new-PC setup with data migration is classic $75 remote or $125/hr on-site work. Drop off or we come to you anywhere in Tampa Bay.",
      },
    ],
  },
  {
    slug: "passkeys-stop-reusing-passwords",
    title: "Passkeys Explained: Stop Typing Passwords (and Stop Getting Phished)",
    excerpt:
      "Your face or fingerprint instead of a password — phishing-proof by design. Where passkeys work now and how to turn them on for Google, Microsoft, and Apple.",
    readMinutes: 4,
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    helpCategory: "security",
    helpCategoryLabel: "Security",
    steps: [
      {
        heading: "1. Understand the one big idea",
        body: "A passkey is a cryptographic key pair: the private half never leaves your device, and there's nothing to steal in a breach or phish. A fake login page can't trick it because it only answers the real site. It's MFA-level security with less effort than a password.",
      },
      {
        heading: "2. Turn on passkeys for Google, Microsoft, and Apple first",
        body: "In each account's security settings, look for 'Passkeys' or 'Passwordless sign-in' and create one on your phone. These three cover email, cloud storage, and device backup — the accounts attackers want most.",
      },
      {
        heading: "3. Sync them so a lost phone isn't a disaster",
        body: "Let them sync through iCloud Keychain, Google Password Manager, or your password manager — and keep a second signed-in device. A passkey locked to one lost phone is a lockout waiting to happen.",
      },
      {
        heading: "4. Keep passwords (and your manager) for everything else",
        body: "Most sites don't support passkeys yet. Keep the password manager for the long tail, and treat passkeys as the VIP lane for your 5–10 most important accounts.",
      },
    ],
    whenToCall: [
      "You're rolling out passwordless sign-in across a team with recovery procedures.",
      "You're locked out after losing the only device with your passkeys.",
      "You want hardware security keys (YubiKey) for admin and banking accounts.",
    ],
    faqs: [
      {
        q: "Are passkeys really safer than a strong password plus MFA?",
        a: "Yes for phishing resistance — there's no code to intercept and no password to steal. App-based MFA is still excellent; passkeys just remove the human-error part.",
      },
      {
        q: "What happens if I lose my phone?",
        a: "If passkeys sync to your cloud account, sign into a new device and they're there. If one was device-bound and unsynced, use the account's recovery options — another reason to keep backup MFA methods registered.",
      },
      {
        q: "Should our business switch to passkeys?",
        a: "Start with admins and finance staff on Microsoft/Google passkeys plus Conditional Access. Full passwordless rollouts need planning around shared PCs and recovery — that's exactly the project work we do.",
      },
    ],
  },
];

/**
 * Full library: hand-written core guides plus data-file mini-guides.
 * JSON entries are type-checked against MiniGuide at build time, so a bad
 * entry fails the build instead of shipping a broken page.
 */
export const guides: Guide[] = [
  ...coreGuides,
  ...(miniGuidesData as MiniGuide[]).map(toGuide),
];

export function getGuide(slug: string): Guide | undefined {
  return guides.find((g) => g.slug === slug);
}
/** Beginner (≤4 min) vs Intermediate — shared by cards and detail pages. */
export function guideLevel(guide: Pick<Guide, "readMinutes">): "Beginner" | "Intermediate" {
  return guide.readMinutes <= 4 ? "Beginner" : "Intermediate";
}

/** Display freshness, defaulting to the last site-wide review pass. */
export function guideUpdated(guide: Pick<Guide, "updated">): string {
  return guide.updated ?? "October 2026";
}

/** Curated high-intent guides for the "Most popular" strip. Slugs must exist. */
export const POPULAR_GUIDE_SLUGS = [
  "fix-slow-wifi-tampa",
  "speed-up-slow-windows-pc",
  "remove-virus-malware-windows",
  "spot-stop-phishing-emails",
  "fix-outlook-not-syncing",
  "turn-on-mfa-microsoft-365",
  "backup-checklist-small-business",
  "check-password-breach",
];

export function getPopularGuides(): Guide[] {
  return POPULAR_GUIDE_SLUGS.map((s) => getGuide(s)).filter((g): g is Guide => !!g);
}
export function getGuidesForService(serviceSlug: string): Guide[] {
  return guides.filter((g) => g.serviceSlug === serviceSlug);
}
