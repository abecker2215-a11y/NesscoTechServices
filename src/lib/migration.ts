/**
 * Competitor-displacement migration playbooks. Pick the incumbent's PSA (or
 * "none/other") and the checklist + export steps adapt. Add new incumbents
 * here — no code changes.
 */

export type Incumbent = "connectwise" | "autotask" | "halopsa" | "other";

export const incumbents: { id: Incumbent; label: string; hint: string }[] = [
  { id: "connectwise", label: "ConnectWise", hint: "Manage / Automate shop" },
  { id: "autotask", label: "Autotask / Datto", hint: "Datto RMM + Autotask PSA" },
  { id: "halopsa", label: "HaloPSA", hint: "HaloPSA + HaloRMM" },
  { id: "other", label: "No PSA / break-fix guy", hint: "Spreadsheets, email, memory" },
];

export interface MigrationStep {
  id: string;
  title: string;
  body: string;
  owner: "us" | "you";
}

export interface MigrationPhase {
  id: string;
  title: string;
  when: string;
  steps: MigrationStep[];
}

const exportSteps: Record<Incumbent, MigrationStep[]> = {
  connectwise: [
    { id: "cw-tickets", title: "Export open tickets + history", body: "Manage → Service Desk → export open boards + 90-day history CSV. We import priorities, SLAs, and assignees.", owner: "us" },
    { id: "cw-agents", title: "Inventory Automate agents", body: "List every agent (searches → all machines). Our installer replaces them one department at a time — no big-bang uninstall.", owner: "us" },
    { id: "cw-agreements", title: "Pull agreements + billing", body: "Finance → Agreements export. We mirror recurring billing so invoicing never skips a month.", owner: "us" },
  ],
  autotask: [
    { id: "at-tickets", title: "Export queues + tickets", body: "Autotask ticket export incl. priorities and SLAs. We rebuild queues 1:1 so nothing falls through.", owner: "us" },
    { id: "at-rmm", title: "Inventory Datto RMM agents", body: "Full device list with last check-in. Staged swap — new agent first, old removed after.", owner: "us" },
    { id: "at-contracts", title: "Pull contracts + recurring services", body: "Contract export with billing rules. We mirror them before cutover.", owner: "us" },
  ],
  halopsa: [
    { id: "halo-tickets", title: "Export tickets + custom fields", body: "HaloPSA has clean CSV exports per ticket type. Custom fields mapped, not dropped.", owner: "us" },
    { id: "halo-rmm", title: "Inventory HaloRMM agents", body: "Device list + policies. Side-by-side run, then cutover.", owner: "us" },
    { id: "halo-billing", title: "Pull recurring invoices", body: "Recurring invoice templates exported. Billing continuity guaranteed.", owner: "us" },
  ],
  other: [
    { id: "other-list", title: "List everything they touch", body: "Send us whatever exists — passwords doc, vendor list, even forwarded emails. We turn chaos into inventory in one audit call.", owner: "you" },
    { id: "other-access", title: "Gather admin logins", body: "Microsoft 365 global admin, firewall, ISP account. We verify each one before cutover day.", owner: "you" },
    { id: "other-notify", title: "30-day notice to the old guy", body: "We draft the professional breakup email. Most contracts need 30 days — we run parallel during it.", owner: "us" },
  ],
};

export function migrationPhases(incumbent: Incumbent): MigrationPhase[] {
  return [
    {
      id: "audit",
      title: "Week 1 — Audit (free)",
      when: "Before you cancel anything",
      steps: [
        { id: "audit-call", title: "45-min discovery call", body: "Users, devices, pain points, contract end date. You talk, we map.", owner: "us" },
        { id: "audit-report", title: "Written findings + fixed quote", body: "What we'd change, what it costs, what stays. Fixed monthly price — no hourly meter running.", owner: "us" },
        ...exportSteps[incumbent],
      ],
    },
    {
      id: "parallel",
      title: "Weeks 2–3 — Parallel run",
      when: "Old MSP still on, we shadow",
      steps: [
        { id: "par-agents", title: "Our monitoring goes on first", body: "Agents + patching + backups deploy alongside the old stack. Zero disruption.", owner: "us" },
        { id: "par-m365", title: "Microsoft 365 delegated access", body: "Granular admin roles — we never need (or want) your global admin password.", owner: "us" },
        { id: "par-docs", title: "Runbook built from the audit", body: "Passwords, vendors, network map, escalation contacts — documented, shared with you.", owner: "us" },
      ],
    },
    {
      id: "cutover",
      title: "Week 4 — Cutover day",
      when: "One scheduled window, usually Friday 5pm",
      steps: [
        { id: "cut-firewall", title: "Firewall + DNS handoff", body: "Rules exported, reviewed, re-applied. Rollback snapshot taken first.", owner: "us" },
        { id: "cut-agents", title: "Old agents off, ours authoritative", body: "Staged removal with verification per device. Nobody reboots Monday to surprises.", owner: "us" },
        { id: "cut-notify", title: "Staff announcement", body: "One-page 'who to call now' memo + helpdesk intro. We draft it, you send it.", owner: "you" },
      ],
    },
    {
      id: "hypercare",
      title: "Weeks 5–8 — Hypercare",
      when: "White-glove settling in",
      steps: [
        { id: "hyp-standup", title: "Weekly 15-min standups", body: "First month: short check-ins until the ticket queue tells us we're boring.", owner: "us" },
        { id: "hyp-qbr", title: "Day-30 business review", body: "Tickets, response times, what's fixed for good. The report your old MSP never sent.", owner: "us" },
        { id: "hyp-guarantee", title: "90-day fit guarantee", body: "Not happier in 90 days? We hand everything back documented — and help you leave.", owner: "us" },
      ],
    },
  ];
}
