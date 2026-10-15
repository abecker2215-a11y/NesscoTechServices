"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  Activity,
  AlertTriangle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface TicketsData {
  tickets: Array<{
    id: string;
    title: string;
    status: string;
    priority: string;
    category: string;
    updatedAt: string;
    createdAt: string;
    assignee?: { name: string | null; email: string } | null;
  }>;
  total: number;
  page: number;
  limit: number;
  status: string | undefined;
  statusCounts: Record<string, number>;
  user: {
    name: string | null;
    email: string;
    clientSlug: string;
  };
}

const statusOptions = [
  { value: "all", label: "All" },
  { value: "OPEN", label: "Open" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "WAITING_CLIENT", label: "Waiting on You" },
  { value: "WAITING_VENDOR", label: "Waiting on Vendor" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
] as const;

const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
  OPEN: { label: "Open", class: "bg-blue-100 text-blue-800", icon: Clock },
  IN_PROGRESS: { label: "In Progress", class: "bg-yellow-100 text-yellow-800", icon: Activity },
  WAITING_CLIENT: { label: "Waiting on You", class: "bg-orange-100 text-orange-800", icon: AlertTriangle },
  WAITING_VENDOR: { label: "Waiting on Vendor", class: "bg-purple-100 text-purple-800", icon: Clock },
  RESOLVED: { label: "Resolved", class: "bg-green-100 text-green-800", icon: CheckCircle },
  CLOSED: { label: "Closed", class: "bg-gray-100 text-gray-800", icon: CheckCircle },
};

const priorityConfig: Record<string, { label: string; class: string }> = {
  LOW: { label: "Low", class: "bg-gray-100 text-gray-800" },
  MEDIUM: { label: "Medium", class: "bg-blue-100 text-blue-800" },
  HIGH: { label: "High", class: "bg-orange-100 text-orange-800" },
  URGENT: { label: "Urgent", class: "bg-red-100 text-red-800" },
  EMERGENCY: { label: "Emergency", class: "bg-red-200 text-red-900 animate-pulse" },
};

export function TicketsClient({ initialData }: { initialData: TicketsData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");

  const { tickets, total, page, limit, status, statusCounts } = initialData;
  const totalPages = Math.ceil(total / limit);

  const handleStatusChange = (newStatus: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newStatus === "all") {
      params.delete("status");
    } else {
      params.set("status", newStatus);
    }
    params.delete("page");
    router.push(`/portal/tickets?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/portal/tickets?${params.toString()}`);
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

  const getPriorityBadge = (priority: string) => {
    const config = priorityConfig[priority] || { label: priority, class: "bg-gray-100 text-gray-800" };
    return <span className={cn("inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium", config.class)}>{config.label}</span>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
          <p className="text-gray-500 mt-1">Track and manage all your support requests</p>
        </div>
        <Link href="/portal/tickets/new" className="btn-primary">
          <Plus className="h-4 w-4" />
          New Ticket
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => {
            const count = statusCounts[opt.value] || 0;
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
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Search */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="search"
              placeholder="Search tickets by title, ID, or category…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="Search tickets"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assignee</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-500">
                    {searchQuery ? "No tickets match your search" : "No tickets yet. Create your first ticket to get started."}
                    {!searchQuery && (
                      <Link href="/portal/tickets/new" className="ml-2 text-primary hover:underline font-medium">
                        Create ticket
                      </Link>
                    )}
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4">
                      <Link href={`/portal/tickets/${ticket.id}`} className="font-medium text-gray-900 hover:text-primary">
                        #{ticket.id.slice(-6)} {ticket.title}
                      </Link>
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500 capitalize">{ticket.category.toLowerCase().replace("_", " ")}</td>
                    <td className="px-4 py-4">{getStatusBadge(ticket.status)}</td>
                    <td className="px-4 py-4">{getPriorityBadge(ticket.priority)}</td>
                    <td className="px-4 py-4 text-sm text-gray-500">
                      {ticket.assignee?.name ?? "Unassigned"}
                    </td>
                    <td className="px-4 py-4 text-sm text-gray-500">{formatDistanceToNow(new Date(ticket.updatedAt), { addSuffix: true })}</td>
                    <td className="px-4 py-4 text-right pr-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/portal/tickets/${ticket.id}`}
                          className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          aria-label="View ticket details"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Link>
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
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} tickets
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