/**
 * One-off: rewrite the 2025 plan titles that collide with existing posts.
 *
 *   node scripts/rewrite-2025-titles.mjs
 *
 * Titles are replaced verbatim in scripts/data/blog-topics-2025.mjs. Each
 * replacement is a different angle on the same subject, not a reworded
 * duplicate: the slug changes and the search intent changes with it.
 */
import { readFileSync, writeFileSync } from "node:fs";

const PLAN = "scripts/data/blog-topics-2025.mjs";

const REWRITES = {
  "Licence reconciliation before renewal":
    "Microsoft 365: five settings to review before renewal",

  "Cellular failover for home offices":
    "Home office connectivity: when cellular is the right backup",
  "Hybrid meeting room standards":
    "Conference room setup for hybrid meetings",
  "Meeting equity for remote participants":
    "Making hybrid meetings work for remote staff",
  "Hot-desking: device strategy":
    "Shared desks: the laptop strategy that makes hot-desking work",
  "Hybrid work technology budget":
    "What hybrid work actually costs: a budget model",
  "Remote work metrics that matter":
    "Measuring remote work without surveillance",
  "Home office stipend: what it should cover":
    "Home office allowance: what to include and what to exclude",
  "Contractor access lifecycle":
    "Contractor access: from start date to last day",
  "Temporary access for vendors":
    "Vendor access: time-bound rather than standing",
  "Remote desktop licensing for small business":
    "Remote desktop licensing: CALs explained",
  "Multi-factor authentication for remote staff":
    "Remote sign-in: methods that resist phishing",
  "Passwordless sign-in for remote teams":
    "Replacing passwords with passkeys for remote staff",
  "Single sign-on across SaaS tools":
    "Single sign-on: governing application access after rollout",
  "Remote support without screen-sharing risk":
    "Remote support: helping without seeing everything",
  "Returning laptops when staff leave":
    "Getting company laptops back from remote leavers",
  "Hybrid workforce security awareness":
    "Security awareness for a team that is rarely in the office",
  "Desk booking and hot-desking IT":
    "Desk booking: making the data match reality",
  "Remote monitoring of company devices":
    "Monitoring company laptops without spying on people",
  "Bandwidth planning for video calls":
    "How much bandwidth a video call actually needs",
  "Quality of service for remote voice":
    "Making remote calls sound clear on a busy connection",

  "Monitor selection for office work":
    "Choosing monitors for a desk-based team",
  "Webcam selection for meeting rooms":
    "Cameras for meeting rooms: what matters",
  "Headset standards for call teams":
    "Headsets for a phone-heavy team",
  "Keyboard and mouse standardisation":
    "Standardising keyboards and mice across the fleet",
  "Printer fleet consolidation":
    "Reducing the printer fleet",
  "Printer security settings":
    "Hardening a network printer",

  "Building an IT budget from zero":
    "A first IT budget: categories, run rate, contingency",
  "Cost of slow laptops: the productivity math":
    "What a slow laptop costs in lost hours",
  "Cost of shadow IT":
    "The hidden cost of tools bought outside IT",
  "Cost of technical debt":
    "Technical debt: the interest you pay monthly",
  "Price escalation clauses in IT contracts":
    "Reading the price escalation clause",
  "Auto-renewal clauses to watch":
    "Auto-renewal: the clause that renews itself",

  "Confidential data and public AI tools":
    "What not to paste into a public AI tool",

  "IT for boutique law firms: small practice priorities":
    "IT priorities for a five-partner law firm",
  "IT for accounting firms: busy season load":
    "Accounting firms: IT that survives busy season",
  "IT for tax preparers: data security":
    "Tax preparers: protecting client identity data",
  "IT for mortgage brokers: document handling":
    "Mortgage brokers: moving documents securely",
  "IT for plumbing contractors: service call data":
    "Plumbing contractors: capturing the job on site",
  "IT for pool service: route and chemical logs":
    "Pool service: routes and chemical records",
  "IT for pest control: field reporting":
    "Pest control: field reports that hold up",

  "Extended detection and response for small business":
    "XDR: what it adds for a small team",
  "Security operations without a security team":
    "Running security with no security staff",
  "Passkeys for business accounts":
    "Passkeys: replacing passwords at work",
  "Identity threat detection and response":
    "Detecting identity attacks before they spread",

  "Network architecture review for a small office":
    "Is your network still right for the business?",
  "Network segmentation without VLANs":
    "Isolating devices without managed switches",
  "Guest network design principles":
    "Guest Wi-Fi that does not expose the office",
  "Network access control for printers and devices":
    "Keeping printers and cameras off the staff network",
  "Switch configuration backup and restore":
    "Saving and restoring switch configurations",
  "Switch firmware update windows":
    "Planning switch firmware upgrades",
  "Firewall rule naming conventions":
    "Naming firewall rules so they can be reviewed",
  "Firewall policy review cadence":
    "How often to review firewall rules",
  "Network address translation explained":
    "NAT: what it does and why it matters",
  "Multiple WAN connections: design patterns":
    "Two internet circuits: design patterns",
  "ISP failover testing procedure":
    "Testing ISP failover before you need it",
  "Fixed wireless as a backup circuit":
    "When fixed wireless is the right backup",
  "Network latency and jitter baselines":
    "Why calls stutter: latency, jitter, and loss",
  "Packet loss diagnosis":
    "Finding the source of packet loss",
  "Wi-Fi heat mapping tools":
    "Reading a wireless survey",
  "Outdoor wireless for yards and docks":
    "Covering a yard with wireless",
  "Structured cabling testing equipment":
    "Testing structured cabling",

  "Cloud migration waves: grouping workloads":
    "Cloud migration: how to group workloads into waves",
  "Cloud identity architecture":
    "Designing identity for a cloud estate",
  "Cloud network design: hub and spoke":
    "Cloud networking: hub, spoke, and policy",
  "Cloud firewall and perimeter":
    "Cloud firewalling: where the perimeter went",
  "Cloud disaster recovery runbook":
    "Writing a cloud disaster recovery runbook",
  "Cloud cost anomaly detection":
    "Catching cloud cost spikes in hours, not months",
  "Cloud storage tiering":
    "Cloud storage: matching the tier to the data",
  "Cloud file sharing governance":
    "Governing file sharing in the cloud",
  "Cloud tenant provisioning checklist":
    "Provisioning a cloud tenant: a checklist",
  "Cloud vendor selection criteria":
    "Choosing a cloud provider: the criteria that matter",
  "Cloud exit strategy":
    "Planning to leave your cloud provider",
  "Cloud skills gap assessment":
    "Assessing cloud skills before the migration",
  "Cloud logging and retention":
    "Cloud logs: what to collect and for how long",
  "Cloud key management":
    "Managing encryption keys in the cloud",
  "Cloud secrets storage":
    "Where to keep cloud credentials",
  "Cloud governance policy basics":
    "Ten cloud governance rules that fit on one page",
  "Cloud cost allocation by department":
    "Allocating cloud cost to departments",
  "Cloud network peering explained":
    "Cloud peering: private paths between networks",

  "Backup scope: what to include and what to skip":
    "Deciding what to back up and what to leave",
  "Backup window design":
    "Sizing the backup window",
  "Forever-incremental backups":
    "Forever-incremental: one full, then only changes",
  "Backup verification automation":
    "Automating backup verification",
  "Backup failure alerting":
    "Alerting on backup failures",
  "Backup restore test scenarios":
    "Seven restore tests worth running",
  "Backup service level agreements":
    "Writing a backup service level agreement",
  "Backup documentation template":
    "A one-page backup runbook",
  "Backup licensing models":
    "How backup software is priced",
  "Backup vendor comparison criteria":
    "Comparing backup vendors on recovery, not features",
  "Backup for cloud object storage":
    "Protecting cloud object storage from deletion",
  "Backup for cloud databases":
    "Backing up managed cloud databases",
  "Backup immutability configuration":
    "Setting backup immutability",
  "Backup air gap implementation":
    "Building an air gap for backups",
  "Backup replication topology":
    "Choosing a backup replication topology",

  "Service desk hours: setting expectations":
    "Publishing service desk hours",
  "Priority matrix for support tickets":
    "Setting ticket priority from impact and urgency",
  "Ticket documentation standards":
    "Writing tickets the next technician can use",
  "Shift handover practice":
    "A shift handover that actually transfers context",
  "Maintenance windows: scheduling and notice":
    "Running a maintenance window",
  "Monitoring threshold design":
    "Setting monitoring thresholds from failure modes",
  "Alert noise reduction":
    "Tuning alerts until people trust them",
  "Monthly service review meetings":
    "Running a monthly service review",
  "Quarterly business review for IT":
    "The quarterly IT business review",
  "IT onboarding for new clients":
    "The first thirty days with a new IT client",
  "IT offboarding at contract end":
    "Exiting an IT contract cleanly",
  "Documentation handover when staff leave":
    "Capturing knowledge before someone resigns",
  "Problem management for recurring incidents":
    "Fixing the cause of repeat incidents",
  "Known error database":
    "Recording known errors so they stop recurring",
  "Change freeze planning":
    "Agreeing a change freeze calendar",
  "Continuous improvement for IT operations":
    "One improvement a month for IT operations",

  "Data inventory: building the map":
    "Where your data actually lives",
  "Data ownership assignment":
    "Assigning an owner to each dataset",
  "Sensitive data discovery tools":
    "Finding sensitive data you did not know about",
  "Data destruction certificates":
    "Proving data was destroyed",
  "Data residency for regulated industries":
    "Data residency rules for regulated sectors",
  "Data sharing with accountants":
    "Sharing financial data with your accountant",
  "Data sharing with contractors":
    "Sharing data with contractors: what, why, how, how long",
  "Client data return on exit":
    "Getting client data back when a vendor leaves",
  "Personal data in logs":
    "Personal data hiding in log files",
  "Personal data in backups":
    "Personal data in backup copies",
  "Personal data in test environments":
    "Test data that is really production data",
  "Data loss prevention for print":
    "Print as a data loss channel",
  "Cookie consent and tracking":
    "Cookie consent that matches what the site does",

  "Phone system requirements gathering":
    "Specifying a phone system before you buy",
  "VoIP quality of service design":
    "Making VoIP calls sound clear",
  "SIP trunk provider selection":
    "Choosing a SIP trunk provider",
  "Number porting failure recovery":
    "When a number port fails",
  "Business continuity for telephony":
    "Phones during an internet outage",
  "Multi-site phone system design":
    "Dialling and routing across several offices",
  "Remote call routing for distributed teams":
    "Routing calls to a team that is never in one place",
  "Interactive voice response script design":
    "Writing a phone menu people can use",
  "After-hours call handling options":
    "What happens to calls after five o'clock",
  "Business text message compliance":
    "Texting customers within the rules",

  "Application portfolio rationalisation":
    "Deciding which applications to keep",
  "SaaS sprawl discovery":
    "Finding the software nobody is tracking",
  "SaaS renewal calendar":
    "A renewal calendar that prevents auto-renewal surprises",
  "SaaS contract exit terms":
    "Reading a SaaS exit clause before you sign",
  "Single sign-on rollout":
    "Rolling out single sign-on in stages",
  "Application access reviews":
    "Reviewing who can reach each application",
  "Offboarding application access":
    "Removing SaaS access when someone leaves",
  "Software evaluation scorecard":
    "Scoring software before the demo",
  "Software rollout communication plan":
    "Communicating a software rollout",
  "Software adoption measurement":
    "Measuring whether anyone uses the software",
  "Integration between accounting and CRM":
    "Connecting accounting and CRM without conflicts",
  "Document scanning and OCR":
    "Scanning paper into searchable documents",
  "PDF workflow standardisation":
    "PDF conventions that make documents findable",
  "E-signature legal requirements":
    "When an e-signature holds up",
  "Browser standardisation":
    "Standardising the browser across the fleet",
  "Extension allowlisting":
    "Controlling browser extensions",
  "Low-code tool governance":
    "Governing the tools staff build themselves",

  "IT strategy for a fifty-person firm":
    "IT strategy for a fifty-person company",
  "IT strategy for multi-site businesses":
    "IT strategy across several locations",
  "Technology roadmap facilitation":
    "Running a technology roadmap workshop",
  "Roadmap prioritisation methods":
    "Choosing what to do first on the roadmap",
  "Scenario planning for IT":
    "Planning for the scenarios that would hurt most",
  "Technology obsolescence tracking":
    "Knowing what is about to go out of support",
  "IT operating model design":
    "Deciding how IT is organised to deliver",
  "IT organisation design":
    "Structuring a small IT function",
  "Succession planning for IT":
    "What happens when the IT lead leaves",
  "Knowledge retention when key staff leave":
    "Keeping knowledge when someone resigns",
  "IT metrics that matter to leadership":
    "Six IT metrics a leadership team will read",
  "IT benchmarking sources":
    "Where IT benchmarks come from, and their limits",
  "Board reporting for technology":
    "Reporting technology to a board",
  "Technology risk disclosure":
    "Disclosing technology risk honestly",
  "Annual technology planning workshop":
    "The annual technology planning session",
  "IT strategy refresh cadence":
    "How often to refresh the IT strategy",
  "IT strategy communication to staff":
    "Explaining the IT strategy to staff",
};

let source = readFileSync(PLAN, "utf8");
let applied = 0;
const missing = [];

for (const [from, to] of Object.entries(REWRITES)) {
  const needle = `"${from}"`;
  if (!source.includes(needle)) {
    missing.push(from);
    continue;
  }
  source = source.split(needle).join(`"${to}"`);
  applied++;
}

writeFileSync(PLAN, source);
console.log(`Rewrote ${applied} titles.`);
if (missing.length) {
  console.error(`Titles not found (${missing.length}):`);
  for (const m of missing) console.error(`  - ${m}`);
  process.exitCode = 1;
}