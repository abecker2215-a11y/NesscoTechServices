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
    title: "\"Virus Alert\" Pop-Up Tells You to Call a Number",
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
    slug: "new-office-wifi-dead-zones",
    title: "New Office, Big Dead Zones (Builder Router Can't Cope)",
    excerpt: "2,500+ sq ft, block walls, one weak ISP combo box. Why mesh beats repeaters and where the nodes actually go.",
    readMinutes: 4,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Back bedrooms or office drop constantly", "Builder/ISP router in a closet or garage", "20+ devices fighting one box"],
    steps: [
      { heading: "1. Map the dead zones", body: "Walk the office with a speed test at each room. One bad room = placement. Half the office = coverage — no settings tweak fixes physics." },
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
  {
    slug: "vpn-wont-connect",
    title: "VPN Won't Connect",
    excerpt: "VPN stuck connecting or drops repeatedly.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["VPN won't connect", "Connection drops frequently", "Authentication fails"],
    steps: [
      { heading: "1. Check basics", body: "Restart your device and check your internet connection first." },
      { heading: "2. Try different connection", body: "Switch to a different network or try mobile hotspot to isolate the issue." },
      { heading: "3. Update/reconnect", body: "Update VPN client, clear credentials, and reconnect. Contact IT if issues persist." }
    ],
    whenToCall: ["VPN fails for multiple users", "Authentication keeps failing", "Business critical access blocked"]
  },
  {
    slug: "wifi-slow-one-device",
    title: "Wi-Fi Slow on One Device Only",
    excerpt: "Only one device slow on the network.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Only one device slow", "Others working fine", "Speed drops in certain locations"],
    steps: [
      { heading: "1. Restart device", body: "Restart the slow device and reconnect to Wi-Fi." },
      { heading: "2. Forget and reconnect", body: "Forget the network and reconnect with password." },
      { heading: "3. Test", body: "Run speed test near router. If still slow, device may need update or repair." }
    ],
    whenToCall: ["Device won't reach reasonable speeds", "Hardware issue suspected", "Affects business work"]
  },
  {
    slug: "chromebook-wifi-issue",
    title: "Chromebook Won't Connect to Wi-Fi",
    excerpt: "Chromebook sees network but won't connect.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Network visible", "Won't connect", "Keeps asking for password"],
    steps: [
      { heading: "1. Restart", body: "Restart Chromebook and router." },
      { heading: "2. Forget network", body: "Forget network in Wi-Fi settings and reconnect." },
      { heading: "3. Check date/time", body: "Ensure correct date/time - wrong time can block connections." }
    ],
    whenToCall: ["Won't connect to any network", "ChromeOS needs repair", "Affects school/work"]
  },
  {
    slug: "android-wifi-issue",
    title: "Android Won't Connect to Wi-Fi",
    excerpt: "Android device won't connect or drops.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Won't connect", "Connects then drops", "Saves network but fails"],
    steps: [
      { heading: "1. Toggle Wi-Fi", body: "Turn Wi-Fi off/on, restart phone." },
      { heading: "2. Forget network", body: "Forget network and reconnect." },
      { heading: "3. Reset network settings", body: "If persists, reset network settings (note saved Wi-Fi passwords)." }
    ],
    whenToCall: ["Won't connect anywhere", "Hardware fault suspected", "Critical business use"]
  },
  {
    slug: "iphone-wifi-issue",
    title: "iPhone Won't Connect to Wi-Fi",
    excerpt: "iPhone has Wi-Fi connection issues.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Can't join network", "Drops frequently", "Asks for password repeatedly"],
    steps: [
      { heading: "1. Restart", body: "Restart iPhone and router." },
      { heading: "2. Forget network", body: "Settings > Wi-Fi > network > Forget This Network, reconnect." },
      { heading: "3. Reset network settings", body: "Settings > General > Transfer or Reset > Reset Network Settings if needed." }
    ],
    whenToCall: ["Won't connect to any Wi-Fi", "Hardware issue", "Business critical"]
  },
  {
    slug: "smart-tv-buffering",
    title: "Smart TV Keeps Buffering",
    excerpt: "Streaming buffers despite decent speeds.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Constant buffering", "Poor quality", "Works on other devices"],
    steps: [
      { heading: "1. Move closer", body: "Move TV closer to router or use Ethernet." },
      { heading: "2. Restart", body: "Restart TV, router, and app." },
      { heading: "3. Reduce interference", body: "Use 5GHz if close, or mesh Wi-Fi for better coverage." }
    ],
    whenToCall: ["All streaming apps buffer", "Wi-Fi dead zone", "Need wired solution"]
  },
  {
    slug: "touchpad-not-working",
    title: "Laptop Touchpad Not Working",
    excerpt: "Touchpad unresponsive or erratic.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Touchpad doesn't respond", "Cursor jumps", "Buttons don't work"],
    steps: [
      { heading: "1. Check toggle", body: "Check if touchpad disabled (Fn key or settings)." },
      { heading: "2. Restart", body: "Restart laptop." },
      { heading: "3. Update driver", body: "Update touchpad driver from manufacturer." }
    ],
    whenToCall: ["Physical damage", "Driver issues persist", "Hardware failure"]
  },
  {
    slug: "keys-not-typing",
    title: "Keyboard Keys Not Typing",
    excerpt: "Some keys don't respond.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Keys unresponsive", "Sticky keys", "Repeated characters"],
    steps: [
      { heading: "1. Clean keyboard", body: "Clean around keys, remove debris." },
      { heading: "2. Restart", body: "Restart computer." },
      { heading: "3. Test external keyboard", body: "Test with external keyboard to isolate hardware/software." }
    ],
    whenToCall: ["Multiple keys dead", "Liquid spill", "Hardware repair needed"]
  },
  {
    slug: "mouse-not-working",
    title: "Mouse Not Working",
    excerpt: "Mouse not detected or frozen.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["No cursor movement", "Buttons not working", "Intermittent"],
    steps: [
      { heading: "1. Check connection", body: "Try different USB port or replace batteries." },
      { heading: "2. Restart", body: "Restart computer." },
      { heading: "3. Update/reconnect", body: "Reconnect or update mouse driver." }
    ],
    whenToCall: ["No mouse detected at all", "Hardware failure", "Affects productivity"]
  },
  {
    slug: "usb-not-recognized",
    title: "USB Device Not Recognized",
    excerpt: "USB device not detected.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Device not detected", "Error message", "Works on other PCs"],
    steps: [
      { heading: "1. Try different port", body: "Try different USB port." },
      { heading: "2. Restart", body: "Restart computer with device connected." },
      { heading: "3. Update drivers", body: "Update USB drivers or try on another device." }
    ],
    whenToCall: ["Device damaged", "Port failure", "Critical data recovery"]
  },
  {
    slug: "external-drive-missing",
    title: "External Drive Not Showing Up",
    excerpt: "Drive not visible in Explorer.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Not in File Explorer", "Not detected", "Makes clicking noise"],
    steps: [
      { heading: "1. Try different port/cable", body: "Try different USB cable and port." },
      { heading: "2. Check Disk Management", body: "Check Disk Management - drive may need assignment." },
      { heading: "3. Test elsewhere", body: "Test on another computer." }
    ],
    whenToCall: ["Clicking noises", "Data critical", "Drive appears but unreadable"]
  },
  {
    slug: "sd-card-not-read",
    title: "SD Card Not Detected",
    excerpt: "Card reader won't read card.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Not detected", "Card reader error", "Works in camera"],
    steps: [
      { heading: "1. Clean card/reader", body: "Clean SD card contacts gently." },
      { heading: "2. Try different reader", body: "Try USB card reader." },
      { heading: "3. Test", body: "Test card in another device." }
    ],
    whenToCall: ["Card corrupted", "Data recovery needed", "Reader broken"]
  },
  {
    slug: "hdmi-no-signal",
    title: "HDMI No Signal",
    excerpt: "Monitor or TV shows no signal.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["No signal message", "Black screen", "Intermittent"],
    steps: [
      { heading: "1. Check cables", body: "Check HDMI cable and connections." },
      { heading: "2. Try different input/port", body: "Try different HDMI port or input." },
      { heading: "3. Detect display", body: "Use Win+Ctrl+Shift+B or detect display in settings." }
    ],
    whenToCall: ["Cable/port damaged", "Graphics issue", "Hardware failure"]
  },
  {
    slug: "laptop-screen-black",
    title: "Laptop Screen Black But On",
    excerpt: "Screen black with power on.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Black screen", "Lights on/fans running", "Backlight issue"],
    steps: [
      { heading: "1. Brightness", body: "Check brightness keys." },
      { heading: "2. External display", body: "Connect to external monitor to test." },
      { heading: "3. Hard reset", body: "Remove battery if possible and hard reset." }
    ],
    whenToCall: ["No display on external", "Backlight broken", "Motherboard issue"]
  },
  {
    slug: "battery-not-charging",
    title: "Laptop Battery Not Charging",
    excerpt: "Battery won't charge when plugged in.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Not charging", "Battery drains", "Plugged in not charging"],
    steps: [
      { heading: "1. Check charger", body: "Try different outlet/charger." },
      { heading: "2. Remove battery", body: "If removable, reseat battery." },
      { heading: "3. Update drivers", body: "Update battery/ACPI drivers." }
    ],
    whenToCall: ["Battery swollen", "Charger damaged", "Battery needs replacement"]
  },
  {
    slug: "laptop-overheat-shutdown",
    title: "Laptop Overheating and Shutting Down",
    excerpt: "Overheats and powers off.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Hot to touch", "Shuts down", "Loud fans"],
    steps: [
      { heading: "1. Clean vents", body: "Clean air vents." },
      { heading: "2. Use hard surface", body: "Use on hard flat surface, not bed." },
      { heading: "3. Cooling pad", body: "Use cooling pad or have internal cleaning." }
    ],
    whenToCall: ["Overheats constantly", "Thermal paste needed", "Hardware damage"]
  },
  {
    slug: "fans-loud",
    title: "Laptop Fans Running Loud",
    excerpt: "Fans constantly at high speed.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Loud fans", "Hot", "High CPU usage"],
    steps: [
      { heading: "1. Clean vents", body: "Clean vents and fans." },
      { heading: "2. Check CPU usage", body: "Close resource-heavy apps." },
      { heading: "3. Update", body: "Update BIOS/drivers or adjust power plan." }
    ],
    whenToCall: ["Fans failing", "Overheating", "Needs cleaning/repair"]
  },
  {
    slug: "disk-full",
    title: "Disk Space Full Warnings",
    excerpt: "Low disk space slowing PC.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Low disk space warnings", "Slow performance", "Can't save files"],
    steps: [
      { heading: "1. Clean up", body: "Run Disk Cleanup/Storage Sense." },
      { heading: "2. Uninstall apps", body: "Remove unused programs." },
      { heading: "3. Move files", body: "Move files to cloud/external drive or upgrade storage." }
    ],
    whenToCall: ["Can't free space", "Drive failing", "Need larger drive"]
  },
  {
    slug: "windows-update-stuck",
    title: "Windows Update Stuck",
    excerpt: "Update hangs or fails.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Stuck at percentage", "Takes hours", "Fails repeatedly"],
    steps: [
      { heading: "1. Wait", body: "Wait 2-3 hours on slow connection." },
      { heading: "2. Restart", body: "If stuck >4 hours, restart carefully." },
      { heading: "3. Run troubleshooter", body: "Use Windows Update Troubleshooter." }
    ],
    whenToCall: ["Update fails repeatedly", "System corrupted", "Business critical"]
  },
  {
    slug: "app-crashing",
    title: "App Keeps Crashing",
    excerpt: "Program crashes repeatedly.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["App closes unexpectedly", "Error messages", "Won't start"],
    steps: [
      { heading: "1. Restart", body: "Restart app and computer." },
      { heading: "2. Update", body: "Update app and system." },
      { heading: "3. Reinstall", body: "Reinstall app if persists." }
    ],
    whenToCall: ["Critical app crashes", "Data loss risk", "Corruption suspected"]
  },
  {
    slug: "explorer-not-responding",
    title: "File Explorer Not Responding",
    excerpt: "Explorer freezes.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Freezes", "Not responding", "Crashes"],
    steps: [
      { heading: "1. Restart Explorer", body: "Restart via Task Manager." },
      { heading: "2. Clear history", body: "Clear Quick Access history." },
      { heading: "3. Restart PC", body: "Restart computer." }
    ],
    whenToCall: ["System-wide issues", "Corruption", "Needs repair"]
  },
  {
    slug: "taskbar-missing",
    title: "Taskbar Missing in Windows",
    excerpt: "Taskbar disappeared.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Taskbar gone", "Can't access Start", "Hidden or crashed"],
    steps: [
      { heading: "1. Restart Explorer", body: "Restart Windows Explorer in Task Manager." },
      { heading: "2. Check settings", body: "Check taskbar settings/autohide." },
      { heading: "3. Restart PC", body: "Restart computer." }
    ],
    whenToCall: ["Persists after restart", "System issue", "Profile corruption"]
  },
  {
    slug: "icons-missing",
    title: "Desktop Icons Missing",
    excerpt: "Icons vanished.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Icons disappeared", "Desktop empty", "Hidden"],
    steps: [
      { heading: "1. Show icons", body: "Right-click desktop > View > Show desktop icons." },
      { heading: "2. Restart Explorer", body: "Restart Windows Explorer." },
      { heading: "3. Restart PC", body: "Restart computer." }
    ],
    whenToCall: ["Profile corruption", "System issue", "Data recovery needed"]
  },
  {
    slug: "right-click-slow",
    title: "Right Click Menu Very Slow",
    excerpt: "Context menu lags.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Slow context menu", "Freezes", "Hangs"],
    steps: [
      { heading: "1. Clean context menu", body: "Remove unnecessary shell extensions." },
      { heading: "2. Update drivers", body: "Update graphics drivers." },
      { heading: "3. Restart", body: "Restart computer." }
    ],
    whenToCall: ["System slow overall", "Malware suspected", "Needs optimization"]
  },
  {
    slug: "onedrive-not-syncing",
    title: "OneDrive Not Syncing",
    excerpt: "Files won't sync.",
    readMinutes: 3,
    helpCategory: "m365",
    serviceSlug: "cloud-solutions/microsoft-365",
    serviceLabel: "Microsoft 365",
    symptoms: ["Files not syncing", "Sync errors", "Blue cloud icon"],
    steps: [
      { heading: "1. Check space", body: "Check OneDrive storage space." },
      { heading: "2. Restart OneDrive", body: "Quit and restart OneDrive." },
      { heading: "3. Re-sign in", body: "Sign out and back in if needed." }
    ],
    whenToCall: ["Sync fails for all files", "Account issues", "Business critical files"]
  },
  {
    slug: "sharepoint-access-denied",
    title: "SharePoint Access Denied",
    excerpt: "Can't access SharePoint files.",
    readMinutes: 3,
    helpCategory: "m365",
    serviceSlug: "cloud-solutions/microsoft-365",
    serviceLabel: "Microsoft 365",
    symptoms: ["Access denied", "Permission error", "Can't open site"],
    steps: [
      { heading: "1. Check login", body: "Ensure logged into correct account." },
      { heading: "2. Request access", body: "Request access from site owner." },
      { heading: "3. Clear cache", body: "Clear browser cache/cookies." }
    ],
    whenToCall: ["All users affected", "Permission issues", "Admin help needed"]
  },
  {
    slug: "teams-mic-broken",
    title: "Teams Mic Not Working",
    excerpt: "Others can't hear you.",
    readMinutes: 3,
    helpCategory: "m365",
    serviceSlug: "cloud-solutions/microsoft-365",
    serviceLabel: "Microsoft 365",
    symptoms: ["Mic not detected", "Others can't hear", "Muted"],
    steps: [
      { heading: "1. Check settings", body: "Check mic in Teams settings and system settings." },
      { heading: "2. Test mic", body: "Test mic in other apps." },
      { heading: "3. Update/reconnect", body: "Update drivers or reconnect mic." }
    ],
    whenToCall: ["Mic hardware issue", "All apps broken", "Meeting critical"]
  },
  {
    slug: "teams-camera-broken",
    title: "Teams Camera Not Working",
    excerpt: "Camera black in Teams.",
    readMinutes: 3,
    helpCategory: "m365",
    serviceSlug: "cloud-solutions/microsoft-365",
    serviceLabel: "Microsoft 365",
    symptoms: ["Black screen", "Camera not detected", "Permission denied"],
    steps: [
      { heading: "1. Check permissions", body: "Check camera permissions for Teams." },
      { heading: "2. Test elsewhere", body: "Test camera in another app." },
      { heading: "3. Restart", body: "Restart Teams and computer." }
    ],
    whenToCall: ["Camera broken", "Driver issues", "Business meetings"]
  },
  {
    slug: "outlook-cal-sync",
    title: "Outlook Calendar Not Syncing",
    excerpt: "Calendar events missing.",
    readMinutes: 3,
    helpCategory: "email",
    serviceSlug: "communications/business-email",
    serviceLabel: "Email Problems",
    symptoms: ["Events missing", "Not updating", "Sync errors"],
    steps: [
      { heading: "1. Check webmail", body: "Check calendar on webmail." },
      { heading: "2. Restart Outlook", body: "Restart Outlook." },
      { heading: "3. Repair profile", body: "Repair Outlook profile if needed." }
    ],
    whenToCall: ["Multiple calendars broken", "Sync fails completely", "Business critical"]
  },
  {
    slug: "email-send-fail",
    title: "Email Won't Send or Receive",
    excerpt: "Mail stuck.",
    readMinutes: 3,
    helpCategory: "email",
    serviceSlug: "communications/business-email",
    serviceLabel: "Email Problems",
    symptoms: ["Can't send", "Can't receive", "Stuck in outbox"],
    steps: [
      { heading: "1. Check connection", body: "Check internet connection." },
      { heading: "2. Check webmail", body: "Test via webmail." },
      { heading: "3. Clear outbox", body: "Remove stuck messages from outbox." }
    ],
    whenToCall: ["Server issues", "All mail down", "Business critical"]
  },
  {
    slug: "gmail-quota-full",
    title: "Gmail Storage Full",
    excerpt: "Can't send/receive email.",
    readMinutes: 3,
    helpCategory: "email",
    serviceSlug: "communications/business-email",
    serviceLabel: "Email Problems",
    symptoms: ["Storage full", "Can't send", "Can't receive"],
    steps: [
      { heading: "1. Check storage", body: "Check Google storage usage." },
      { heading: "2. Free space", body: "Delete large emails/files or empty trash." },
      { heading: "3. Upgrade", body: "Upgrade storage if needed." }
    ],
    whenToCall: ["Critical emails blocked", "Need to recover space fast", "Business account"]
  },
  {
    slug: "spam-too-aggressive",
    title: "Emails Going to Spam",
    excerpt: "Legit mail in spam.",
    readMinutes: 3,
    helpCategory: "email",
    serviceSlug: "communications/business-email",
    serviceLabel: "Email Problems",
    symptoms: ["Legit emails to spam", "Missing emails", "Recipients report spam"],
    steps: [
      { heading: "1. Check filters", body: "Check spam filters/rules." },
      { heading: "2. Whitelist", body: "Whitelist sender addresses." },
      { heading: "3. Check reputation", body: "Check domain/email reputation." }
    ],
    whenToCall: ["Business emails going to spam", "Domain issues", "Need deliverability fix"]
  },
  {
    slug: "scanner-not-working",
    title: "Scanner Not Working",
    excerpt: "Scanner not detected.",
    readMinutes: 3,
    helpCategory: "printer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Not detected", "Scan fails", "App can't find scanner"],
    steps: [
      { heading: "1. Check connection", body: "Check USB/network connection." },
      { heading: "2. Update drivers", body: "Update scanner drivers." },
      { heading: "3. Restart", body: "Restart scanner and computer." }
    ],
    whenToCall: ["Hardware failure", "Network scanner issues", "Business critical"]
  },
  {
    slug: "fax-not-working",
    title: "Fax Not Working",
    excerpt: "Fax won't send/receive.",
    readMinutes: 3,
    helpCategory: "printer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Fax fails", "No dial tone", "Error messages"],
    steps: [
      { heading: "1. Check phone line", body: "Check phone line connection." },
      { heading: "2. Test line", body: "Test with phone." },
      { heading: "3. Configure settings", body: "Check fax settings." }
    ],
    whenToCall: ["Line issues", "Hardware failure", "Need alternative solution"]
  },
  {
    slug: "antivirus-blocks-site",
    title: "Antivirus Blocking Website",
    excerpt: "Safe site blocked.",
    readMinutes: 3,
    helpCategory: "security",
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    symptoms: ["Site blocked", "Warning message", "Can't access"],
    steps: [
      { heading: "1. Check URL", body: "Verify it's a safe site." },
      { heading: "2. Whitelist", body: "Whitelist site in antivirus temporarily." },
      { heading: "3. Test", body: "Test in different browser." }
    ],
    whenToCall: ["False positive persistent", "Business site blocked", "Security concern"]
  },
  {
    slug: "firewall-blocks-app",
    title: "Firewall Blocking App",
    excerpt: "App can't connect.",
    readMinutes: 3,
    helpCategory: "security",
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    symptoms: ["App can't connect", "Blocked by firewall", "Connection errors"],
    steps: [
      { heading: "1. Check firewall", body: "Check Windows Firewall settings." },
      { heading: "2. Allow app", body: "Allow app through firewall." },
      { heading: "3. Test", body: "Test connection." }
    ],
    whenToCall: ["Business app blocked", "Needs proper rule", "Security policy"]
  },
  {
    slug: "ransomware-suspect",
    title: "Ransomware Suspected",
    excerpt: "Files encrypted oddly.",
    readMinutes: 3,
    helpCategory: "security",
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    symptoms: ["Files encrypted", "Ransom note", "Strange extensions"],
    steps: [
      { heading: "1. Isolate", body: "Disconnect from network immediately." },
      { heading: "2. Don't pay", body: "Do not pay ransom." },
      { heading: "3. Call professional", body: "Call IT/security professional immediately." }
    ],
    whenToCall: ["Ransomware suspected", "Immediate action needed", "Data breach possible"]
  },
  {
    slug: "account-hacked-email",
    title: "Email Account Hacked",
    excerpt: "Unauthorized access.",
    readMinutes: 3,
    helpCategory: "security",
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    symptoms: ["Unknown emails sent", "Password changed", "Suspicious activity"],
    steps: [
      { heading: "1. Change password", body: "Change password immediately from secure device." },
      { heading: "2. Enable MFA", body: "Enable multi-factor authentication." },
      { heading: "3. Check forwarding", body: "Check email forwarding rules." }
    ],
    whenToCall: ["Account compromised", "Business email", "Financial impact"]
  },
  {
    slug: "reset-email-missing",
    title: "Password Reset Not Arriving",
    excerpt: "Reset email missing.",
    readMinutes: 3,
    helpCategory: "security",
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    symptoms: ["No reset email", "In spam", "Wrong email"],
    steps: [
      { heading: "1. Check spam", body: "Check spam/junk folder." },
      { heading: "2. Check email", body: "Verify correct email address." },
      { heading: "3. Try alternate method", body: "Try SMS or alternate recovery method." }
    ],
    whenToCall: ["Email account blocked", "Can't access critical account", "Business account"]
  },
  {
    slug: "suspicious-login",
    title: "Suspicious Login Alert",
    excerpt: "Unknown login detected.",
    readMinutes: 3,
    helpCategory: "security",
    serviceSlug: "it-security",
    serviceLabel: "Virus & Security Cleanup",
    symptoms: ["Login alert", "Unknown location", "Unknown device"],
    steps: [
      { heading: "1. Review", body: "Review login details." },
      { heading: "2. Secure", body: "Change password and enable MFA if not enabled." },
      { heading: "3. Sign out all sessions", body: "Sign out of all sessions." }
    ],
    whenToCall: ["Confirmed unauthorized", "Business account", "Sensitive data"]
  },
  {
    slug: "vpn-drops",
    title: "VPN Keeps Disconnecting",
    excerpt: "VPN drops often.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Frequent drops", "Reconnects", "Unstable"],
    steps: [
      { heading: "1. Check network", body: "Check Wi-Fi/Ethernet stability." },
      { heading: "2. Update VPN", body: "Update VPN client." },
      { heading: "3. Try different protocol", body: "Try different VPN protocol/server." }
    ],
    whenToCall: ["Affects remote work", "Multiple users", "Critical access"]
  },
  {
    slug: "rdp-wont-connect",
    title: "Remote Desktop Won't Connect",
    excerpt: "RDP fails.",
    readMinutes: 3,
    helpCategory: "wifi",
    serviceSlug: "network-server/wireless",
    serviceLabel: "Wi-Fi & Networking",
    symptoms: ["Connection fails", "Can't reach host", "Authentication error"],
    steps: [
      { heading: "1. Check network", body: "Check network connectivity to remote host." },
      { heading: "2. Check RDP", body: "Verify RDP enabled on remote machine." },
      { heading: "3. Check firewall", body: "Check firewall rules." }
    ],
    whenToCall: ["Server unreachable", "Network issue", "Business critical"]
  },
  {
    slug: "quickbooks-crash",
    title: "QuickBooks Won't Open",
    excerpt: "QuickBooks crashes.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Won't start", "Crashes on launch", "Error messages"],
    steps: [
      { heading: "1. Restart", body: "Restart computer." },
      { heading: "2. Run as admin", body: "Run as administrator." },
      { heading: "3. Repair install", body: "Repair QuickBooks installation." }
    ],
    whenToCall: ["Data file issues", "Company file corruption", "Business critical"]
  },
  {
    slug: "pos-offline",
    title: "POS System Offline",
    excerpt: "POS not connecting.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Offline", "Can't process payments", "Network error"],
    steps: [
      { heading: "1. Check network", body: "Check internet/network connection." },
      { heading: "2. Restart POS", body: "Restart POS terminal and router." },
      { heading: "3. Check merchant services", body: "Check with payment processor status." }
    ],
    whenToCall: ["Can't take payments", "Revenue impact", "Immediate help needed"]
  },
  {
    slug: "card-reader-broken",
    title: "Card Reader Not Working",
    excerpt: "Payment terminal fails.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Not detected", "Can't swipe/tap", "Error reading card"],
    steps: [
      { heading: "1. Check connection", body: "Check USB/Bluetooth connection." },
      { heading: "2. Restart", body: "Restart reader and POS." },
      { heading: "3. Test different card", body: "Test with different card." }
    ],
    whenToCall: ["Hardware failure", "Can't process payments", "Business critical"]
  },
  {
    slug: "server-unreachable",
    title: "Server Not Reachable",
    excerpt: "Can't reach server.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Can't connect", "Timeout errors", "All users affected"],
    steps: [
      { heading: "1. Check network", body: "Check network connectivity." },
      { heading: "2. Ping server", body: "Ping server IP address." },
      { heading: "3. Check server status", body: "Check if server powered on." }
    ],
    whenToCall: ["Server down", "Business critical", "Immediate attention"]
  },
  {
    slug: "network-drive-drop",
    title: "Network Drive Disconnecting",
    excerpt: "Drive keeps disconnecting.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Drive disconnects", "Reappears", "Access denied"],
    steps: [
      { heading: "1. Check network", body: "Check Wi-Fi/Ethernet stability." },
      { heading: "2. Remap drive", body: "Disconnect and remap network drive." },
      { heading: "3. Check server", body: "Check file server status." }
    ],
    whenToCall: ["Affects all users", "Server issues", "Business critical"]
  },
  {
    slug: "timeclock-sync",
    title: "Time Clock Not Syncing",
    excerpt: "Time clock not syncing.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Not syncing", "Wrong time", "Data not uploading"],
    steps: [
      { heading: "1. Check network", body: "Check network connection." },
      { heading: "2. Restart", body: "Restart time clock." },
      { heading: "3. Check software", body: "Check time clock software sync settings." }
    ],
    whenToCall: ["Payroll affected", "Sync failures", "Business critical"]
  },
  {
    slug: "backup-failed",
    title: "Backup Failed",
    excerpt: "Backup job failed.",
    readMinutes: 3,
    helpCategory: "computer",
    serviceSlug: "it-support/pc-mac",
    serviceLabel: "Computer Repair",
    symptoms: ["Backup failed", "Error message", "No recent backup"],
    steps: [
      { heading: "1. Check storage", body: "Check backup destination space." },
      { heading: "2. Check logs", body: "Review backup logs for errors." },
      { heading: "3. Retry", body: "Retry backup or run manually." }
    ],
    whenToCall: ["No backup in days", "Critical data", "Backup system broken"]
  }
];

export function getFix(slug: string): QuickFix | undefined {
  return fixes.find((f) => f.slug === slug);
}

export function getFixesForService(serviceSlug: string): QuickFix[] {
  return fixes.filter((f) => f.serviceSlug === serviceSlug);
}
