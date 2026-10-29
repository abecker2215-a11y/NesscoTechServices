"use client";

import { useState } from "react";
import Link from "next/link";
import {
  TicketCheck,
  Server,
  CreditCard,
  Calendar,
  HelpCircle,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  ExternalLink,
  Plus,
  Activity,
  Users,
  HardDrive,
  Wifi,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface DashboardData {
  user: {
    name: string | null;
    email: string;
    clientSlug: string;
  };
  tickets: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    updatedAt: string;
    assignee?: { name: string | null; email: string } | null;
  }>;
  ticketStats: Record<string, number>;
  assets: Array<{
    id: string;
    name: string;
    type: string;
    status: string;
    os?: string | null;
  }>;
  billings: Array<{
    id: string;
    type: string;
    amount: { toString: () => string };
    status: string;
    periodEnd: string;
    invoiceUrl?: string | null;
  }>;
  usage: Array<{
    metric: string;
    value: { toString: () => string };
    unit: string;
    periodStart: string;
    periodEnd: string;
  }>;
  maintenanceWindows: Array<{
    id: string;
    title: string;
    type: string;
    status: string;
    scheduledStart: string;
    scheduledEnd: string;
  }>;
  serviceRequests: Array<{
    id: string;
    type: string;
    title: string;
    status: string;
    createdAt: string;
  }>;
  health?: {
    score: number;
    grade: string;
    factors: { label: string; impact: number; ok: boolean }[];
    openUrgent: number;
  };
}

const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
  OPEN: { label: "Open", class: "bg-blue-100 text-blue-800", icon: Clock },
  IN_PROGRESS: { label: "In Progress", class: "bg-yellow-100 text-yellow-800", icon: Activity },
  WAITING_CLIENT: { label: "Waiting on You", class: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  WAITING_VENDOR: { label: "Waiting on Vendor", class: "bg-purple-100 text-purple-800", icon: Clock },
  RESOLVED: { label: "Resolved", class: "bg-green-100 text-green-800", icon: CheckCircle },
  CLOSED: { label: "Closed", class: "bg-muted text-gray-800", icon: CheckCircle },
  PENDING: { label: "Pending", class: "bg-yellow-100 text-yellow-800", icon: Clock },
  PAID: { label: "Paid", class: "bg-green-100 text-green-800", icon: CheckCircle },
  OVERDUE: { label: "Overdue", class: "bg-red-100 text-red-800", icon: AlertTriangle },
  SCHEDULED: { label: "Scheduled", class: "bg-blue-100 text-blue-800", icon: Calendar },
  COMPLETED: { label: "Completed", class: "bg-green-100 text-green-800", icon: CheckCircle },
  ACTIVE: { label: "Active", class: "bg-green-100 text-green-800", icon: CheckCircle },
};

const priorityConfig: Record<string, { label: string; class: string }> = {
  LOW: { label: "Low", class: "bg-muted text-gray-800" },
  MEDIUM: { label: "Medium", class: "bg-blue-100 text-blue-800" },
  HIGH: { label: "High", class: "bg-orange-100 text-orange-800" },
  URGENT: { label: "Urgent", class: "bg-red-100 text-red-800" },
  EMERGENCY: { label: "Emergency", class: "bg-red-200 text-red-900 animate-pulse" },
};

const assetTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WORKSTATION: HardDrive,
  LAPTOP: HardDrive,
  SERVER: Server,
  NETWORK_DEVICE: Wifi,
  PRINTER: HardDrive,
  MOBILE: Users,
  TABLET: Users,
  STORAGE: HardDrive,
  OTHER: Activity,
};

export function DashboardClient({ initialData }: { initialData: DashboardData }) {
  const [activeTab, setActiveTab] = useState<"overview" | "tickets" | "assets">("overview");

  const { user, tickets, ticketStats, assets, billings, usage, maintenanceWindows, serviceRequests, health } = initialData;

  const _totalTickets = tickets.length;
  const openTickets = (ticketStats.OPEN || 0) + (ticketStats.IN_PROGRESS || 0) + (ticketStats.WAITING_CLIENT || 0);
  const resolvedThisMonth = ticketStats.RESOLVED || 0;
  const activeAssets = assets.filter(a => a.status === "ACTIVE").length;

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || { label: status, class: "bg-muted text-gray-800", icon: Activity };
    const Icon = config.icon;
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", config.class)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const getPriorityBadge = (priority: string) => {
    const config = priorityConfig[priority] || { label: priority, class: "bg-muted text-gray-800" };
    return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", config.class)}>{config.label}</span>;
  };

  const recentUsage = usage.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Welcome back, {user.name?.split(" ")[0] ?? "there"}</h1>
          <p className="text-muted-foreground mt-1">Here&apos;s what&apos;s happening with your IT services</p>
        </div>
        <div className="flex gap-2">
          <Link href="/portal/tickets/new" className="btn-primary">
            <Plus className="h-4 w-4" />
            New Ticket
          </Link>
          <Link href="/portal/insights" className="btn-secondary">
            <TrendingUp className="h-4 w-4" />
            Insights
          </Link>
        </div>
      </div>

      {/* Health score */}
      {health && (
        <Link
          href="/portal/insights"
          className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 rounded-xl border border-border bg-background p-4 hover:border-primary/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-lg">
              {health.grade}
            </span>
            <div>
              <p className="font-semibold text-foreground">IT Health: {health.score}/100</p>
              <p className="text-sm text-muted-foreground">
                {health.openUrgent > 0
                  ? `${health.openUrgent} urgent ticket${health.openUrgent === 1 ? "" : "s"} need attention`
                  : "All quiet — see what makes up the score"}
              </p>
            </div>
          </div>
          <span className="sm:ml-auto inline-flex items-center gap-1 text-sm font-medium text-primary">
            View insights <TrendingUp className="h-4 w-4" />
          </span>
        </Link>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Open Tickets"
          value={openTickets}
          icon={TicketCheck}
          iconClass="text-blue-600 bg-blue-100"
          trend={{ value: resolvedThisMonth, label: "resolved this month" }}
          trendIcon={TrendingUp}
          href="/portal/tickets"
        />
        <StatCard
          title="Active Assets"
          value={activeAssets}
          icon={Server}
          iconClass="text-green-600 bg-green-100"
          trend={{ value: assets.length, label: "total tracked" }}
          href="/portal/assets"
        />
        <StatCard
          title="Pending Invoices"
          value={billings.filter(b => b.status === "PENDING" || b.status === "OVERDUE").length}
          icon={CreditCard}
          iconClass="text-amber-600 bg-amber-100"
          trend={{ value: billings.reduce((sum, b) => sum + parseFloat(b.amount.toString()), 0), label: "total outstanding", prefix: "$" }}
          href="/portal/billing"
        />
        <StatCard
          title="Upcoming Maintenance"
          value={maintenanceWindows.length}
          icon={Calendar}
          iconClass="text-purple-600 bg-purple-100"
          trend={{ value: maintenanceWindows.filter(m => m.status === "SCHEDULED").length, label: "scheduled" }}
        />
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-border">
        <nav className="flex gap-1 px-1" aria-label="Dashboard sections">
          {([
            { id: "overview", label: "Overview", icon: Activity },
            { id: "tickets", label: "Recent Tickets", icon: TicketCheck },
            { id: "assets", label: "Assets", icon: Server },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-t-lg transition-colors",
                activeTab === tab.id
                  ? "bg-background border-b-2 border-primary text-primary"
                  : "text-muted-foreground hover:text-muted-foreground hover:bg-muted"
              )}
              role="tab"
              aria-selected={activeTab === tab.id}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          {/* Recent Tickets */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Tickets</h2>
              <Link href="/portal/tickets" className="text-sm text-primary hover:underline flex items-center gap-1">
                View all <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted border-b border-border">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Ticket</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Assignee</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                        No tickets yet. <Link href="/portal/tickets/new" className="text-primary hover:underline">Create one</Link>
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-muted">
                        <td className="px-4 py-3">
                          <Link href={`/portal/tickets/${ticket.id}`} className="font-medium text-foreground hover:text-primary">
                            #{ticket.id.slice(-6)} {ticket.title}
                          </Link>
                          <p className="text-xs text-muted-foreground mt-0.5 capitalize">{ticket.category.toLowerCase().replace("_", " ")}</p>
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>
                        <td className="px-4 py-3">{getPriorityBadge(ticket.priority)}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">
                          {ticket.assignee?.name ?? "Unassigned"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Upcoming Maintenance & Service Requests */}
          <div className="grid gap-6 lg:grid-cols-2">
            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-purple-600" />
                Upcoming Maintenance
              </h2>
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                {maintenanceWindows.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">No maintenance scheduled</div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {maintenanceWindows.map((mw) => (
                      <div key={mw.id} className="p-4 hover:bg-muted">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-foreground">{mw.title}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{mw.type.toLowerCase().replace("_", " ")}</p>
                          </div>
                          {getStatusBadge(mw.status)}
                        </div>
                        <div className="mt-2 text-sm text-muted-foreground">
                          {format(new Date(mw.scheduledStart), "MMM d, yyyy h:mm a")} –{" "}
                          {format(new Date(mw.scheduledEnd), "h:mm a")}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                Recent Service Requests
              </h2>
              <div className="bg-background rounded-lg border border-border overflow-hidden">
                {serviceRequests.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No service requests yet. <Link href="/portal/tickets/new" className="text-primary hover:underline ml-1">Submit one</Link>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    {serviceRequests.map((sr) => (
                      <div key={sr.id} className="p-4 hover:bg-muted">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="font-medium text-foreground">{sr.title}</h3>
                            <p className="text-sm text-muted-foreground capitalize">{sr.type.toLowerCase().replace("_", " ")}</p>
                          </div>
                          {getStatusBadge(sr.status)}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">
                          Requested {formatDistanceToNow(new Date(sr.createdAt), { addSuffix: true })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          {/* Usage Summary */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              30-Day Usage Summary
            </h2>
            <div className="bg-background rounded-lg border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-muted border-b border-border">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Metric</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Current Period</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Unit</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {recentUsage.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No usage data available</td>
                      </tr>
                    ) : (
                      recentUsage.map((u) => (
                        <tr key={`${u.metric}-${u.periodStart}`} className="hover:bg-muted">
                          <td className="px-4 py-3 font-medium text-foreground capitalize">{u.metric.toLowerCase().replace("_", " ")}</td>
                          <td className="px-4 py-3 text-foreground font-mono text-lg">{parseFloat(u.value.toString()).toLocaleString()}</td>
                          <td className="px-4 py-3 text-muted-foreground">{u.unit}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>
      )}

      {activeTab === "tickets" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">All Tickets</h2>
            <Link href="/portal/tickets/new" className="btn-primary">
              <Plus className="h-4 w-4" />
              New Ticket
            </Link>
          </div>
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-muted">
                    <td className="px-4 py-3 font-mono text-sm text-muted-foreground">#{ticket.id.slice(-6)}</td>
                    <td className="px-4 py-3">
                      <Link href={`/portal/tickets/${ticket.id}`} className="font-medium text-foreground hover:text-primary">
                        {ticket.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{ticket.category.toLowerCase().replace("_", " ")}</td>
                    <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>
                    <td className="px-4 py-3">{getPriorityBadge(ticket.priority)}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "assets" && (
        <div className="animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-foreground">Managed Assets</h2>
          </div>
          <div className="bg-background rounded-lg border border-border overflow-hidden">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">OS</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {assets.map((asset) => {
                  const Icon = assetTypeIcons[asset.type] || Activity;
                  return (
                    <tr key={asset.id} className="hover:bg-muted">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", `bg-${getAssetColor(asset.type)}-100 text-${getAssetColor(asset.type)}-600`)}>
                            <Icon className="h-5 w-5" />
                          </div>
                          <span className="font-medium text-foreground">{asset.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground capitalize">{asset.type.toLowerCase().replace("_", " ")}</td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">{asset.os ?? "—"}</td>
                      <td className="px-4 py-3">{getStatusBadge(asset.status)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  iconClass,
  trend,
  trendIcon: TrendIcon,
  href = "#",
}: {
  title: string;
  value: number;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  trend?: { value: number; label: string; prefix?: string };
  trendIcon?: React.ComponentType<{ className?: string }>;
  href?: string;
}) {
  return (
    <Link href={href} className="block bg-background rounded-lg border border-border p-6 hover:border-primary/50 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-1 text-3xl font-bold text-foreground">{value.toLocaleString()}</p>
          {trend && TrendIcon && (
            <p className="mt-2 text-sm text-muted-foreground flex items-center gap-1">
              <TrendIcon className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">{trend.prefix ?? ""}{trend.value.toLocaleString()}</span>
              <span>{trend.label}</span>
            </p>
          )}
        </div>
        <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center shrink-0", iconClass)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Link>
  );
}

function getAssetColor(type: string): string {
  const colors: Record<string, string> = {
    WORKSTATION: "blue",
    LAPTOP: "indigo",
    SERVER: "purple",
    NETWORK_DEVICE: "cyan",
    PRINTER: "orange",
    MOBILE: "pink",
    TABLET: "rose",
    STORAGE: "emerald",
    OTHER: "gray",
  };
  return colors[type] || "gray";
}
