"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  FileText,
  Download,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  Search,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { daysAgo } from "@/lib/dates";

interface BillingData {
  billings: Array<{
    id: string;
    type: string;
    amount: string;
    currency: string;
    status: string;
    description: string;
    invoiceUrl?: string | null;
    dueDate?: string | null;
    paidAt?: string | null;
    periodStart: string;
    periodEnd: string;
    createdAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
  status: string | undefined;
  statusCounts: Record<string, { count: number; amount: string }>;
  usageSummary: Record<string, string>;
  user: { name: string | null; email: string; clientSlug: string };
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "PENDING", label: "Pending" },
  { value: "PAID", label: "Paid" },
  { value: "OVERDUE", label: "Overdue" },
  { value: "CANCELLED", label: "Cancelled" },
] as const;

const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
  PENDING: { label: "Pending", class: "bg-yellow-100 text-yellow-800", icon: Clock },
  PAID: { label: "Paid", class: "bg-green-100 text-green-800", icon: CheckCircle },
  OVERDUE: { label: "Overdue", class: "bg-red-100 text-red-800", icon: AlertTriangle },
  CANCELLED: { label: "Cancelled", class: "bg-gray-100 text-gray-800", icon: Clock },
};

const billingTypeLabels: Record<string, string> = {
  RECURRING: "Recurring",
  USAGE: "Usage",
  PROJECT: "Project",
  HARDWARE: "Hardware",
  LICENSE: "License",
  CREDIT: "Credit",
};

export function BillingClient({ initialData }: { initialData: BillingData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { billings, total, page, limit, status, statusCounts, usageSummary } = initialData;
  const totalPages = Math.ceil(total / limit);

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", newStatus);
    }
    params.delete("page");
    router.push(`/portal/billing?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/portal/billing?${params.toString()}`);
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || { label: status, class: "bg-gray-100 text-gray-800", icon: Clock };
    const Icon = config.icon;
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", config.class)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  // Summary calculations
  const pendingAmount = billings
    .filter((b) => b.status === "PENDING" || b.status === "OVERDUE")
    .reduce((sum, b) => sum + parseFloat(b.amount.toString()), 0);
  const paidThisMonth = billings
    .filter((b) => b.status === "PAID" && new Date(b.paidAt || b.createdAt) > daysAgo(30))
    .reduce((sum, b) => sum + parseFloat(b.amount.toString()), 0);
  const totalInvoices = billings.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="text-gray-500 mt-1">View invoices, track payments, and monitor usage</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Outstanding Balance"
          value={pendingAmount}
          prefix="$"
          icon={AlertTriangle}
          iconClass="text-amber-600 bg-amber-100"
          trend={{ value: paidThisMonth, label: "paid this month", prefix: "$" }}
          trendIcon={TrendingUp}
        />
        <SummaryCard
          title="Invoices This Period"
          value={totalInvoices}
          icon={FileText}
          iconClass="text-blue-600 bg-blue-100"
        />
        <SummaryCard
          title="Paid This Month"
          value={paidThisMonth}
          prefix="$"
          icon={CheckCircle}
          iconClass="text-green-600 bg-green-100"
        />
        <SummaryCard
          title="Avg Invoice"
          value={totalInvoices > 0 ? pendingAmount / totalInvoices : 0}
          prefix="$"
          icon={DollarSign}
          iconClass="text-purple-600 bg-purple-100"
        />
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => {
            const countData = statusCounts[opt.value] || { count: 0, amount: "0" };
            const isActive = (status || "all") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleStatusChange(opt.value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                aria-pressed={isActive}
              >
                {opt.label}
                <span className={cn("px-2 py-0.5 text-xs rounded-full", isActive ? "bg-primary-foreground/20" : "bg-gray-200 text-gray-600")}>
                  {countData.count} (${parseFloat(countData.amount).toLocaleString()})
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Usage Summary */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-green-600" />
          30-Day Usage Summary
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { key: "REMOTE_HOURS", label: "Remote Hours", unit: "hrs", icon: Clock },
            { key: "ONSITE_HOURS", label: "On-site Hours", unit: "hrs", icon: TrendingUp },
            { key: "TICKETS_CREATED", label: "Tickets Created", unit: "", icon: FileText },
            { key: "BACKUP_GB", label: "Backup Storage", unit: "GB", icon: DollarSign },
            { key: "ENDPOINTS_PROTECTED", label: "Endpoints", unit: "", icon: CheckCircle },
            { key: "M365_LICENSES", label: "M365 Licenses", unit: "", icon: CreditCard },
          ].map((item) => (
            <div key={item.key} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </div>
              <div className="mt-1 flex items-baseline gap-1">
                <span className="text-2xl font-bold text-gray-900">
                  {parseFloat(usageSummary[item.key] || "0").toLocaleString()}
                </span>
                <span className="text-gray-500">{item.unit}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search invoices by description, amount, date…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Search invoices"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Period</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {billings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-500">
                    {searchQuery ? "No invoices match your search" : "No invoices found"}
                  </td>
                </tr>
              ) : (
                billings.map((billing) => (
                  <tr key={billing.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <div className="font-mono text-sm text-gray-500">#{billing.id.slice(-8)}</div>
                      <div className="text-xs text-gray-400">{format(new Date(billing.createdAt), "MMM d, yyyy")}</div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-700 rounded-full capitalize">
                        {billingTypeLabels[billing.type] || billing.type.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {format(new Date(billing.periodStart), "MMM d")} – {format(new Date(billing.periodEnd), "MMM d, yyyy")}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-700 max-w-xs truncate">{billing.description}</td>
                    <td className="px-4 py-4 font-medium text-gray-900 tabular-nums">${parseFloat(billing.amount.toString()).toLocaleString()}</td>
                    <td className="px-4 py-4">{getStatusBadge(billing.status)}</td>
                    <td className="px-4 py-4 text-sm text-gray-700">
                      {billing.dueDate ? (
                        <>
                          {format(new Date(billing.dueDate), "MMM d, yyyy")}
                          {billing.status === "OVERDUE" && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Overdue</span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        {billing.invoiceUrl && (
                          <a
                            href={billing.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                            aria-label="View invoice PDF"
                          >
                            <FileText className="h-4 w-4" />
                          </a>
                        )}
                        <a
                          href={billing.invoiceUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="Download invoice"
                        >
                          <Download className="h-4 w-4" />
                        </a>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} invoices
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-gray-600">Page {page} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  prefix = "",
  icon: Icon,
  iconClass,
  trend,
  trendIcon: TrendIcon,
}: {
  title: string;
  value: number;
  prefix?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  trend?: { value: number; label: string; prefix?: string };
  trendIcon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="mt-1 text-3xl font-bold text-gray-900 tabular-nums">
            {prefix}{value.toLocaleString(undefined, { maximumFractionDigits: value % 1 === 0 ? 0 : 2 })}
          </p>
          {trend && TrendIcon && (
            <p className="mt-2 text-sm text-gray-500 flex items-center gap-1">
              <TrendIcon className="h-4 w-4 text-green-600" />
              <span className="font-medium text-green-600">{trend.prefix ?? ""}{trend.value.toLocaleString(undefined, { maximumFractionDigits: trend.value % 1 === 0 ? 0 : 2 })}</span>
              <span>{trend.label}</span>
            </p>
          )}
        </div>
        <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center shrink-0", iconClass)}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  );
}