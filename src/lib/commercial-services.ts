import { ServiceDef, FAQItem } from "./types";
import { navItems } from "./config";

interface GroupMeta {
  who: string;
  remote: number;
  onsite: number;
  faqs: FAQItem[];
}

const groupMeta: Record<string, GroupMeta> = {
  managed: {
    who: "Businesses with 5-500 employees that need proactive, fully managed IT.",
    remote: 95,
    onsite: 145,
    faqs: [
      { q: "What is included in managed IT?", a: "Monitoring, patching, helpdesk, vendor management, and strategic planning under a predictable monthly agreement." },
      { q: "Is there a long-term contract?", a: "Most agreements are month-to-month or annual. We earn your business every month." },
      { q: "How fast do you respond?", a: "Managed clients get priority response with defined SLAs, including after-hours emergency coverage." },
    ],
  },
  security: {
    who: "Organizations that handle sensitive data and must meet security or compliance requirements.",
    remote: 95,
    onsite: 145,
    faqs: [
      { q: "Do you help with HIPAA, PCI, or SOC 2?", a: "Yes. We map controls to your framework and provide the evidence auditors expect." },
      { q: "Can you secure remote workers?", a: "Yes. We protect endpoints, email, and identities regardless of where your team works." },
      { q: "What happens if we are breached?", a: "We follow an incident response plan to contain, eradicate, and recover, then document lessons learned." },
    ],
  },
  cloud: {
    who: "Businesses modernizing infrastructure or moving workloads to Microsoft 365, Azure, or AWS.",
    remote: 95,
    onsite: 145,
    faqs: [
      { q: "Will there be downtime during migration?", a: "We plan migrations to minimize disruption, typically moving cutovers outside business hours." },
      { q: "Do you support hybrid environments?", a: "Yes. We manage on-prem, cloud, and hybrid setups side by side." },
      { q: "Can you reduce our cloud bill?", a: "Absolutely. We right-size resources and eliminate waste as part of ongoing management." },
    ],
  },
  network: {
    who: "Businesses that need reliable, scalable network, server, and data center infrastructure.",
    remote: 95,
    onsite: 150,
    faqs: [
      { q: "Do you design and install cabling?", a: "Yes. We handle structured cabling (CAT6/CAT6a/fiber), design, and installation." },
      { q: "Can you manage our existing servers?", a: "Yes. We support Windows, Linux, and virtualized server fleets." },
      { q: "Do you provide ongoing monitoring?", a: "Yes. Infrastructure is monitored 24/7 with alerting and response." },
    ],
  },
  support: {
    who: "Teams that need responsive, multi-tiered IT support they can rely on.",
    remote: 75,
    onsite: 125,
    faqs: [
      { q: "What are your support hours?", a: "Standard business hours with after-hours options; managed clients get emergency coverage." },
      { q: "How do we submit a request?", a: "By phone, email, or portal. Every ticket is tracked to resolution." },
      { q: "Do you support both PC and Mac?", a: "Yes. We support Windows, macOS, and Linux workstations." },
    ],
  },
  backup: {
    who: "Businesses that cannot afford to lose data or endure prolonged downtime.",
    remote: 95,
    onsite: 145,
    faqs: [
      { q: "How often are backups tested?", a: "Backups are verified automatically and restored in periodic recovery drills." },
      { q: "Where are backups stored?", a: "Encrypted on-site and off-site, with cloud options for geographic separation." },
      { q: "What is your recovery time?", a: "Recovery time objectives are defined with you and validated through testing." },
    ],
  },
  apps: {
    who: "Businesses running line-of-business apps that must stay fast, secure, and available.",
    remote: 95,
    onsite: 145,
    faqs: [
      { q: "Can you host our existing software?", a: "Yes. We host legacy and resource-intensive apps in secure cloud or virtual environments." },
      { q: "Will remote users still have access?", a: "Yes. We provide secure access from any device, anywhere." },
      { q: "Do you migrate data during upgrades?", a: "Yes. Migrations are planned and validated to protect your data." },
    ],
  },
  comm: {
    who: "Businesses that want unified, reliable voice, video, and collaboration tools.",
    remote: 85,
    onsite: 135,
    faqs: [
      { q: "Can we keep our current numbers?", a: "Yes. We port existing numbers and configure call flows during cutover." },
      { q: "Do you support hybrid meetings?", a: "Yes. We design and support room systems and conferencing platforms." },
      { q: "Is there a per-user cost?", a: "Yes. Communications platforms are priced per user; we'll provide a clear quote." },
    ],
  },
};

interface Detail {
  problem: string;
  whatWeDo: string[];
}

const details: Record<string, Detail> = {
  "managed-it-services": {
    problem: "Your business depends on IT that just works, but you don't have a full-time IT department to keep it that way.",
    whatWeDo: [
      "24/7 monitoring of servers, network, and endpoints",
      "Proactive patching and preventive maintenance",
      "Responsive helpdesk for your whole team",
      "Vendor and license management",
      "Quarterly technology strategy reviews",
    ],
  },
  "managed-it-services/24-7-monitoring": {
    problem: "You can't afford downtime that no one sees coming until it's already cost you.",
    whatWeDo: [
      "Around-the-clock monitoring of critical systems",
      "Automated alerting with human triage",
      "Rapid incident response and escalation",
      "Performance and capacity trending",
      "Root-cause analysis and reporting",
    ],
  },
  "managed-it-services/vcio": {
    problem: "You need strategic technology leadership but can't justify a full-time CIO salary.",
    whatWeDo: [
      "IT roadmap aligned to business goals",
      "Budgeting and technology planning",
      "Vendor and contract oversight",
      "Risk and compliance guidance",
      "Board-ready technology reporting",
    ],
  },
  "managed-it-services/consulting": {
    problem: "Major technology decisions are being made without expert guidance.",
    whatWeDo: [
      "Technology assessments and recommendations",
      "Cloud and infrastructure strategy",
      "Security and compliance planning",
      "Project management and vendor selection",
      "Cost optimization analysis",
    ],
  },
  "managed-it-services/outsourced": {
    problem: "Your internal team is buried in day-to-day IT operations instead of strategic work.",
    whatWeDo: [
      "Fully or partially outsourced IT operations",
      "Helpdesk and infrastructure management",
      "Process documentation and standardization",
      "Scalable support as you grow",
      "Single point of accountability",
    ],
  },
  "managed-it-services/complete": {
    problem: "You want one partner to own every layer of IT so nothing slips through the cracks.",
    whatWeDo: [
      "End-to-end helpdesk to infrastructure coverage",
      "Security, backup, and compliance included",
      "Onboarding and offboarding automation",
      "Asset and lifecycle management",
      "Executive reporting and planning",
    ],
  },
  "it-security": {
    problem: "Cyber threats are evolving faster than your defenses can keep up.",
    whatWeDo: [
      "Layered security across endpoint, email, and network",
      "Security awareness training for staff",
      "Continuous monitoring and threat detection",
      "Compliance alignment and reporting",
      "Incident response planning",
    ],
  },
  "it-security/endpoint-security": {
    problem: "One infected laptop can compromise your entire network and data.",
    whatWeDo: [
      "EDR/XDR deployment on every endpoint",
      "24/7 managed detection and response",
      "Automated threat containment",
      "Device hardening and policy enforcement",
      "Security event reporting",
    ],
  },
  "it-security/email-security": {
    problem: "Most breaches start with a single phishing email that slips past basic filters.",
    whatWeDo: [
      "Advanced phishing and spoofing protection",
      "Link and attachment sandboxing",
      "DMARC, DKIM, and SPF configuration",
      "Encryption and data-loss prevention",
      "User awareness and simulation testing",
    ],
  },
  "it-security/vulnerability-assessment": {
    problem: "You don't know what security gaps exist until an attacker finds them first.",
    whatWeDo: [
      "Automated vulnerability scanning",
      "Prioritized remediation guidance",
      "Patch and configuration validation",
      "External attack-surface review",
      "Trend and progress reporting",
    ],
  },
  "it-security/audit-compliance": {
    problem: "Regulations like HIPAA and PCI require proof that your security is actually working.",
    whatWeDo: [
      "Security control assessments",
      "Compliance gap analysis",
      "Policy and procedure development",
      "Audit evidence preparation",
      "Remediation planning and tracking",
    ],
  },
  "it-security/cybersecurity-suite": {
    problem: "Piecemeal security tools leave gaps that attackers are happy to exploit.",
    whatWeDo: [
      "Integrated firewall and network defense",
      "SIEM logging and correlation",
      "Identity and access protection",
      "Security awareness training",
      "Unified reporting and governance",
    ],
  },
  "cloud-solutions": {
    problem: "Your workloads are ready for the cloud, but the migration feels risky and complex.",
    whatWeDo: [
      "Cloud readiness assessment",
      "Migration planning and execution",
      "Microsoft 365, Azure, and AWS management",
      "Cost optimization and governance",
      "Ongoing cloud operations and support",
    ],
  },
  "cloud-solutions/microsoft-365": {
    problem: "Microsoft 365 is deployed, but it isn't fully secure, adopted, or optimized.",
    whatWeDo: [
      "Tenant setup, migration, and licensing",
      "Security and compliance configuration",
      "Teams, SharePoint, and OneDrive rollout",
      "User training and adoption support",
      "Ongoing administration and reporting",
    ],
  },
  "cloud-solutions/google-workspace": {
    problem: "You're moving to Google Workspace and need the migration done correctly.",
    whatWeDo: [
      "Mail and data migration from any platform",
      "User, group, and OU provisioning",
      "Security and sharing policy setup",
      "Drive and Meet deployment",
      "Ongoing administration and support",
    ],
  },
  "cloud-solutions/managed-cloud": {
    problem: "Your Azure or AWS bill keeps growing with no oversight or optimization.",
    whatWeDo: [
      "Provisioning and architecture management",
      "Cost monitoring and right-sizing",
      "Backup, DR, and security in the cloud",
      "Identity and access management",
      "24/7 monitoring and support",
    ],
  },
  "cloud-solutions/infrastructure-migration": {
    problem: "Legacy on-premises systems are holding your business back.",
    whatWeDo: [
      "Assessment of current infrastructure",
      "Target architecture design",
      "Data and application migration",
      "Cutover planning and execution",
      "Post-migration optimization",
    ],
  },
  "cloud-solutions/file-sync": {
    problem: "Files are scattered across drives and impossible to share securely.",
    whatWeDo: [
      "Centralized, secure file storage",
      "Automatic sync across devices",
      "External sharing with controls",
      "Versioning and retention policies",
      "Access permissions and auditing",
    ],
  },
  "cloud-solutions/business-email": {
    problem: "Unreliable email costs you customers, deals, and credibility.",
    whatWeDo: [
      "Professional hosted email setup",
      "Spam, virus, and phishing filtering",
      "Email encryption and archiving",
      "Migration from legacy providers",
      "Ongoing deliverability management",
    ],
  },
  "cloud-solutions/virtual-desktops": {
    problem: "Your team needs secure access to their work from anywhere, on any device.",
    whatWeDo: [
      "Virtual desktop (VDI) design and deployment",
      "Remote work enablement",
      "Centralized management and updates",
      "Secure access and MFA",
      "Scalable capacity on demand",
    ],
  },
  "cloud-solutions/private-cloud": {
    problem: "Compliance or control requirements rule out standard public cloud.",
    whatWeDo: [
      "Dedicated private cloud infrastructure",
      "Isolation and data residency controls",
      "Compliance-aligned architecture",
      "High availability and disaster recovery",
      "Full management and monitoring",
    ],
  },
  "network-server": {
    problem: "Your network and servers weren't built to scale with your business.",
    whatWeDo: [
      "Network and server design",
      "Implementation and configuration",
      "Ongoing administration and patching",
      "Performance monitoring and tuning",
      "Capacity and lifecycle planning",
    ],
  },
  "network-server/infrastructure": {
    problem: "Slow, unreliable cabling and switching bottleneck your entire business.",
    whatWeDo: [
      "Structured cabling (CAT6/CAT6a/fiber)",
      "Switch and routing configuration",
      "Network design and documentation",
      "VLAN and segmentation setup",
      "Performance testing and certification",
    ],
  },
  "network-server/wireless": {
    problem: "Wi-Fi drops exactly where your team and customers need it most.",
    whatWeDo: [
      "Site surveys and RF planning",
      "Enterprise access point deployment",
      "High-density and warehouse coverage",
      "Guest and secure network separation",
      "Roaming and performance optimization",
    ],
  },
  "network-server/server-admin": {
    problem: "Unpatched, aging servers put your data and uptime at risk.",
    whatWeDo: [
      "Windows and Linux server management",
      "Patch and update management",
      "Performance tuning and monitoring",
      "Backup integration and validation",
      "Server lifecycle planning",
    ],
  },
  "network-server/virtualization": {
    problem: "You're paying for physical hardware you don't actually need.",
    whatWeDo: [
      "VMware and Hyper-V deployment",
      "Server consolidation projects",
      "Container and orchestration setup",
      "High-availability clustering",
      "Backup and replication configuration",
    ],
  },
  "network-server/internet-fiber": {
    problem: "Your internet connection can't keep up with how your business operates.",
    whatWeDo: [
      "Business-class internet procurement",
      "Fiber and circuit coordination",
      "Redundant and failover connectivity",
      "Firewall and edge configuration",
      "Ongoing performance monitoring",
    ],
  },
  "network-server/datacenter": {
    problem: "Your server room is disorganized, hot, and unmonitored.",
    whatWeDo: [
      "Rack layout and cable management",
      "Power and cooling planning",
      "Environmental monitoring",
      "Colocation evaluation and migration",
      "Physical security controls",
    ],
  },
  "network-server/storage": {
    problem: "You're running out of storage and unsure how to scale it safely.",
    whatWeDo: [
      "SAN and NAS design and deployment",
      "High-availability storage architecture",
      "Capacity planning and tiering",
      "Data migration and optimization",
      "Backup and replication integration",
    ],
  },
  "it-support": {
    problem: "When something breaks, your team loses hours waiting for help that never comes fast enough.",
    whatWeDo: [
      "Multi-tiered helpdesk support",
      "Ticketing and SLA tracking",
      "Remote and on-site resolution",
      "Escalation to engineering when needed",
      "Knowledge base and self-service",
    ],
  },
  "it-support/helpdesk": {
    problem: "Support requests fall through the cracks with no accountability or SLA.",
    whatWeDo: [
      "Tier 1-3 helpdesk coverage",
      "Ticket tracking and SLA management",
      "Phone, email, and portal intake",
      "Escalation paths and follow-through",
      "Reporting and trend analysis",
    ],
  },
  "it-support/pc-mac": {
    problem: "Workstations are slow, unpatched, and inconsistently configured.",
    whatWeDo: [
      "Windows and Mac support",
      "Imaging and standardized setup",
      "Patch and antivirus management",
      "Hardware troubleshooting and repair",
      "Device lifecycle and replacement planning",
    ],
  },
  "it-support/server-network": {
    problem: "Critical infrastructure issues need expert eyes, fast.",
    whatWeDo: [
      "Server and network troubleshooting",
      "Performance and connectivity diagnostics",
      "Emergency incident response",
      "Configuration and change management",
      "Preventive maintenance",
    ],
  },
  "it-support/datacenter-setup": {
    problem: "You're building or relocating a server room and need it done right the first time.",
    whatWeDo: [
      "Physical infrastructure planning",
      "Rack, power, and cooling build-out",
      "Structured cabling and labeling",
      "Equipment installation and commissioning",
      "Documentation and handover",
    ],
  },
  "backup-disaster-recovery": {
    problem: "A single failure could erase years of business data in minutes.",
    whatWeDo: [
      "Automated on-site and off-site backups",
      "Disaster recovery planning and testing",
      "High-availability architectures",
      "Emergency data recovery",
      "Business continuity strategy",
    ],
  },
  "backup-disaster-recovery/backup": {
    problem: "Your backups have never been tested, so you don't actually know if they work.",
    whatWeDo: [
      "Automated scheduled backups",
      "Encrypted on-site and off-site copies",
      "Regular restore verification",
      "Retention and versioning policies",
      "Monitoring and alerting",
    ],
  },
  "backup-disaster-recovery/dr-planning": {
    problem: "If disaster struck today, no one would know the exact steps to recover.",
    whatWeDo: [
      "RTO and RPO definition",
      "Documented recovery runbooks",
      "Roles and communication planning",
      "Tested recovery procedures",
      "Ongoing plan maintenance",
    ],
  },
  "backup-disaster-recovery/high-availability": {
    problem: "One failed component shouldn't be able to take your whole business offline.",
    whatWeDo: [
      "Redundant architecture design",
      "Failover and clustering setup",
      "Load balancing configuration",
      "Elimination of single points of failure",
      "Availability monitoring and testing",
    ],
  },
  "backup-disaster-recovery/data-recovery": {
    problem: "You've already lost data and you need it back now.",
    whatWeDo: [
      "Emergency data recovery",
      "Failed drive and RAID restoration",
      "Cloud and backup file retrieval",
      "Forensic-level recovery where needed",
      "Prevention planning after recovery",
    ],
  },
  "backup-disaster-recovery/offsite-dr": {
    problem: "On-site backups won't survive a fire, flood, or theft.",
    whatWeDo: [
      "Geographically separated recovery sites",
      "Cloud failover and replication",
      "Secure off-site backup storage",
      "Recovery testing from off-site copies",
      "Business continuity validation",
    ],
  },
  applications: {
    problem: "Business-critical applications are slow, unsupported, or hard to access.",
    whatWeDo: [
      "Application deployment and integration",
      "Hosting and virtualization",
      "Version migrations and upgrades",
      "Secure remote access",
      "Ongoing management and support",
    ],
  },
  "applications/m365-management": {
    problem: "Microsoft 365 admin tasks and security policies are slipping through the cracks.",
    whatWeDo: [
      "Tenant administration and governance",
      "Security and compliance policies",
      "User lifecycle and licensing",
      "Teams and SharePoint management",
      "Reporting and optimization",
    ],
  },
  "applications/quickbooks-hosting": {
    problem: "QuickBooks or ERP performance lags and remote access is clunky and insecure.",
    whatWeDo: [
      "Hosted QuickBooks, Sage, and ERP",
      "Secure multi-user access",
      "Data backup and protection",
      "Performance tuning",
      "Licensing and version management",
    ],
  },
  "applications/hosting": {
    problem: "Legacy or resource-heavy applications need a modern, reliable home.",
    whatWeDo: [
      "Application hosting in cloud or virtual environments",
      "Resource scaling and optimization",
      "Availability and monitoring",
      "Security and isolation",
      "Backup and recovery integration",
    ],
  },
  "applications/migrations": {
    problem: "A required application upgrade threatens to disrupt your operations.",
    whatWeDo: [
      "Migration planning and testing",
      "Data conversion and validation",
      "Platform and version upgrades",
      "Cutover and rollback planning",
      "Post-migration support",
    ],
  },
  "applications/remote-access": {
    problem: "Remote staff need secure access without exposing your network to risk.",
    whatWeDo: [
      "VPN and RDS deployment",
      "Zero-trust network access",
      "Multi-factor authentication",
      "Access policy and auditing",
      "Performance and reliability tuning",
    ],
  },
  communications: {
    problem: "Your voice, video, and messaging tools don't work together, so your team does extra work.",
    whatWeDo: [
      "Unified communications design",
      "VoIP and cloud phone systems",
      "Business email and security",
      "Team messaging and collaboration",
      "Meeting and video conferencing",
    ],
  },
  "communications/phone-systems": {
    problem: "Your phone system is expensive, inflexible, and drops calls when you need it most.",
    whatWeDo: [
      "Cloud PBX and UCaaS deployment",
      "SIP trunking and number porting",
      "Auto-attendant and call routing",
      "Call center and analytics features",
      "Ongoing management and support",
    ],
  },
  "communications/business-email": {
    problem: "Email outages and spam cost you time, deals, and trust.",
    whatWeDo: [
      "Hosted Exchange and Microsoft 365 email",
      "Anti-spam, anti-phishing, and antivirus",
      "Encryption and compliance archiving",
      "Migration from legacy providers",
      "Deliverability management",
    ],
  },
  "communications/messaging": {
    problem: "Team chat is scattered across platforms nobody actually manages.",
    whatWeDo: [
      "Microsoft Teams and Slack management",
      "Channel and workspace governance",
      "Integration with business apps",
      "Security and retention policies",
      "User training and adoption",
    ],
  },
  "communications/meetings": {
    problem: "Hybrid meetings are plagued by audio and video problems that waste everyone's time.",
    whatWeDo: [
      "Room system design and installation",
      "Zoom, Teams, and webinar setup",
      "Hybrid meeting enablement",
      "Audio and video troubleshooting",
      "Ongoing support and tuning",
    ],
  },
};

const servicesNav = navItems.find((item) => item.href === "/services");

const parentFaqs: Record<string, FAQItem[]> = {
  "managed-it-services": [
    { q: "What is included in a managed IT plan?", a: "24/7 monitoring, patching, helpdesk, vendor management, security, backup oversight, and quarterly strategy reviews — all under one predictable monthly agreement." },
    { q: "How is pricing structured?", a: "Plans are priced per user or per device per month based on the services you need. We'll scope it and give you a flat monthly number with no surprise invoices." },
    { q: "Do we lose control of our IT?", a: "No. You keep ownership of all systems and data. We document everything and work as an extension of your team." },
    { q: "Is there a minimum contract term?", a: "Most agreements are month-to-month or annual. We'd rather earn your business every month than lock you in." },
  ],
  "it-security": [
    { q: "What does your security service actually cover?", a: "Endpoint (EDR/XDR), email protection, identity/MFA, network defense, vulnerability management, security awareness training, and compliance reporting." },
    { q: "Do you help with HIPAA, PCI, or SOC 2?", a: "Yes. We map controls to your framework, close gaps, and produce the evidence auditors ask for." },
    { q: "What happens if we get breached?", a: "We follow an incident response plan to contain, eradicate, and recover, then document what happened and harden against repeats." },
    { q: "Can you secure a remote workforce?", a: "Yes. We protect endpoints, email, and identities no matter where your team works." },
  ],
  "cloud-solutions": [
    { q: "Will migration cause downtime?", a: "We plan cutovers outside business hours and validate beforehand, so day-to-day work is minimally disrupted." },
    { q: "Which platforms do you support?", a: "Microsoft 365, Azure, AWS, Google Workspace, and private/hybrid cloud environments." },
    { q: "Can you reduce our cloud costs?", a: "Usually yes. We right-size resources, remove waste, and apply governance to keep spend predictable." },
    { q: "Do you manage hybrid setups?", a: "Absolutely. We manage on-prem, cloud, and hybrid side by side." },
  ],
  "network-server": [
    { q: "Do you design and install cabling?", a: "Yes. We handle structured cabling (CAT6/CAT6a/fiber), switching, and full network design and documentation." },
    { q: "Can you manage our existing servers?", a: "Yes. We support Windows, Linux, physical, and virtualized server fleets." },
    { q: "Do you monitor infrastructure 24/7?", a: "Yes. Servers, switches, and links are monitored around the clock with alerting and response." },
    { q: "Can you modernize slow networks?", a: "Yes. We assess bottlenecks, redesign as needed, and deliver measurable performance gains." },
  ],
  "it-support": [
    { q: "What are your support hours?", a: "Standard business hours, with after-hours and emergency options. Managed clients get priority response." },
    { q: "How do we submit a ticket?", a: "By phone, email, or portal. Every request is tracked to resolution with SLA monitoring." },
    { q: "Do you support both PC and Mac?", a: "Yes. Windows, macOS, and Linux workstations are all supported." },
    { q: "Is support remote or on-site?", a: "Both. Most issues are resolved remotely; on-site visits are available when hardware or hands-on work is needed." },
  ],
  "backup-disaster-recovery": [
    { q: "How often are backups tested?", a: "Backups are verified automatically and restored in scheduled recovery drills so we know they work." },
    { q: "Where is our data stored?", a: "Encrypted on-site and off-site, with cloud options for geographic separation from your office." },
    { q: "How fast can you recover after an outage?", a: "We define recovery time and recovery point objectives with you and validate them through testing." },
    { q: "Can you recover data we've already lost?", a: "In many cases yes — from failed drives, RAID arrays, or backups. We assess first and tell you honestly what's recoverable." },
  ],
  applications: [
    { q: "Can you host our existing software?", a: "Yes. We host legacy and resource-intensive applications in secure cloud or virtual environments." },
    { q: "Will remote users keep access?", a: "Yes. We provide secure access from any device, anywhere, with MFA." },
    { q: "Do you migrate data during upgrades?", a: "Yes. Migrations are planned, tested, and validated to protect your data." },
    { q: "Can you integrate our apps together?", a: "Yes. We connect line-of-business apps and automate data flow where it saves time." },
  ],
  communications: [
    { q: "Can we keep our current phone numbers?", a: "Yes. We port existing numbers and configure call flows during cutover." },
    { q: "Do you support hybrid meetings?", a: "Yes. We design and support room systems, webinars, and conferencing platforms." },
    { q: "How is communications priced?", a: "Most platforms are priced per user per month. We'll scope your needs and provide a clear quote." },
    { q: "Do you manage messaging and email too?", a: "Yes. Teams, Slack, hosted email, and collaboration tools are all part of unified communications." },
  ],
};

function build(): ServiceDef[] {
  const children = servicesNav?.children ?? [];
  return children.map((child) => {
    const slug = child.href.replace("/services/", "");
    const group = child.group ?? "managed";
    const meta = groupMeta[group] ?? groupMeta.managed;
    const detail = details[slug];
    const siblings = children
      .filter((c) => c.group === group && c.href !== child.href)
      .slice(0, 3)
      .map((c) => c.href.replace("/services/", ""));
    const scope = (detail?.whatWeDo ?? [child.description ?? child.label]).join("; ");
    const faqs: FAQItem[] = parentFaqs[slug] ?? [
      {
        q: `What does ${child.label} include?`,
        a: `${scope}.`,
      },
      {
        q: `How much does ${child.label} cost?`,
        a: `Pricing depends on scope. Most ${child.label.toLowerCase()} work starts at $${meta.remote}/hr remote or $${meta.onsite}/hr on-site, and we provide a fixed quote before any work begins.`,
      },
      {
        q: `How quickly can you start ${child.label.toLowerCase()}?`,
        a: `Most engagements begin within a few business days, with priority and emergency response available for managed clients.`,
      },
      {
        q: `Do you serve our area for ${child.label.toLowerCase()}?`,
        a: `Yes. We provide ${child.label.toLowerCase()} on-site across the Tampa Bay area and remotely anywhere in the U.S.`,
      },
    ];
    return {
      slug,
      title: child.label,
      shortDescription: child.description ?? child.label,
      icon: child.icon ?? "monitor",
      problem: detail?.problem ?? child.description ?? child.label,
      whatWeDo: detail?.whatWeDo ?? [child.description ?? child.label],
      whoItsFor: meta.who,
      pricing: { remote: meta.remote, onsite: meta.onsite },
      remoteAvailable: true,
      onsiteAvailable: true,
      faqs,
      relatedServices: siblings,
    };
  });
}

export const commercialServices: ServiceDef[] = build();
