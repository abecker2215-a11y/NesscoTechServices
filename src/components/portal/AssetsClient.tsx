"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Server,
  HardDrive,
  Wifi,
  Printer,
  Smartphone,
  Tablet,
  Database,
  Search,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  ExternalLink,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface AssetsData {
  assets: Array<{
    id: string;
    name: string;
    type: string;
    manufacturer?: string | null;
    model?: string | null;
    serialNumber?: string | null;
    os?: string | null;
    osVersion?: string | null;
    ipAddress?: string | null;
    macAddress?: string | null;
    location?: string | null;
    purchaseDate?: string | null;
    warrantyExpires?: string | null;
    status: string;
    createdAt: string;
  }>;
  total: number;
  page: number;
  limit: number;
  type: string | undefined;
  status: string | undefined;
  typeCounts: Record<string, number>;
  statusCounts: Record<string, number>;
  user: { name: string | null; email: string; clientSlug: string };
}

const assetTypes = [
  { value: "WORKSTATION", label: "Workstation", icon: HardDrive },
  { value: "LAPTOP", label: "Laptop", icon: HardDrive },
  { value: "SERVER", label: "Server", icon: Server },
  { value: "NETWORK_DEVICE", label: "Network Device", icon: Wifi },
  { value: "PRINTER", label: "Printer", icon: Printer },
  { value: "MOBILE", label: "Mobile", icon: Smartphone },
  { value: "TABLET", label: "Tablet", icon: Tablet },
  { value: "STORAGE", label: "Storage", icon: Database },
  { value: "OTHER", label: "Other", icon: Server },
] as const;

const statusOptions = [
  { value: "all", label: "All" },
  { value: "ACTIVE", label: "Active" },
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "STAGING", label: "Staging" },
  { value: "RETIRED", label: "Retired" },
  { value: "LOST", label: "Lost" },
] as const;

const statusConfig: Record<string, { label: string; class: string; icon: React.ComponentType<{ className?: string }> }> = {
  ACTIVE: { label: "Active", class: "bg-green-100 text-green-800", icon: CheckCircle },
  MAINTENANCE: { label: "Maintenance", class: "bg-yellow-100 text-yellow-800", icon: Clock },
  STAGING: { label: "Staging", class: "bg-blue-100 text-blue-800", icon: Clock },
  RETIRED: { label: "Retired", class: "bg-muted text-gray-800", icon: CheckCircle },
  LOST: { label: "Lost", class: "bg-red-100 text-red-800", icon: AlertTriangle },
};

const assetTypeIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  WORKSTATION: HardDrive,
  LAPTOP: HardDrive,
  SERVER: Server,
  NETWORK_DEVICE: Wifi,
  PRINTER: Printer,
  MOBILE: Smartphone,
  TABLET: Tablet,
  STORAGE: Database,
  OTHER: Server,
};

const assetTypeColors: Record<string, string> = {
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

export function AssetsClient({ initialData }: { initialData: AssetsData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  const { assets, total, page, limit, type, status, typeCounts, statusCounts } = initialData;
  const totalPages = Math.ceil(total / limit);

  const handleFilterChange = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "all" || !value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    router.push(`/portal/assets?${params.toString()}`);
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/portal/assets?${params.toString()}`);
  };

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status] || { label: status, class: "bg-muted text-gray-800", icon: Clock };
    const Icon = config.icon;
    return (
      <span className={cn("inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium", config.class)}>
        <Icon className="h-3 w-3" />
        {config.label}
      </span>
    );
  };

  const filteredAssets = assets.filter((asset) => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        asset.name.toLowerCase().includes(query) ||
        asset.type.toLowerCase().includes(query) ||
        asset.manufacturer?.toLowerCase().includes(query) ||
        asset.model?.toLowerCase().includes(query) ||
        asset.serialNumber?.toLowerCase().includes(query) ||
        asset.ipAddress?.includes(query) ||
        asset.location?.toLowerCase().includes(query)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Assets</h1>
          <p className="text-muted-foreground mt-1">Track and manage all your IT assets</p>
        </div>
      </div>

      {/* Type Filter Tabs */}
      <div className="bg-background rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-2">
          {[
            { value: "all", label: "All", count: total },
            ...assetTypes.map((t) => ({ value: t.value, label: t.label, count: typeCounts[t.value] || 0 })),
          ].map((opt) => {
            const isActive = (type || "all") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleFilterChange("type", opt.value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-pressed={isActive}
              >
                {opt.label}
                <span className={cn("px-2 py-0.5 text-xs rounded-full", isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground")}>
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-background rounded-lg border border-border p-4">
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((opt) => {
            const count = statusCounts[opt.value] || 0;
            const isActive = (status || "all") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleFilterChange("status", opt.value)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                aria-pressed={isActive}
              >
                {opt.label}
                <span className={cn("px-2 py-0.5 text-xs rounded-full", isActive ? "bg-primary-foreground/20" : "bg-muted text-muted-foreground")}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-background rounded-lg border border-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="search"
            placeholder="Search assets by name, type, serial, IP, location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg text-foreground placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            aria-label="Search assets"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("table")}
            className={cn("p-2 rounded-lg transition-colors", viewMode === "table" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
            aria-label="Table view"
            aria-pressed={viewMode === "table"}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode("grid")}
            className={cn("p-2 rounded-lg transition-colors", viewMode === "grid" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button className="btn-secondary">
            <Download className="h-4 w-4" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Assets List */}
      <div className="bg-background rounded-lg border border-border overflow-hidden">
        {viewMode === "table" ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted border-b border-border">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Asset</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Manufacturer / Model</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Serial #</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">OS / Version</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">IP / Location</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Warranty</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredAssets.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-12 text-center text-muted-foreground">
                      {searchQuery ? "No assets match your search" : "No assets found"}
                    </td>
                  </tr>
                ) : (
                  filteredAssets.map((asset) => {
                    const Icon = assetTypeIcons[asset.type] || Server;
                    const color = assetTypeColors[asset.type] || "gray";
                    return (
                      <tr key={asset.id} className="hover:bg-muted">
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-3">
                            <div className={cn("h-10 w-10 rounded-lg flex items-center justify-center", `bg-${color}-100 text-${color}-600`)}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-medium text-foreground">{asset.name}</div>
                              <div className="text-xs text-muted-foreground">Added {formatDistanceToNow(new Date(asset.createdAt), { addSuffix: true })}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground capitalize">{asset.type.toLowerCase().replace("_", " ")}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {asset.manufacturer && asset.model ? (
                            <>
                              <span className="font-medium">{asset.manufacturer}</span>
                              <span className="text-muted-foreground mx-1">/</span>
                              <span>{asset.model}</span>
                            </>
                          ) : asset.manufacturer ? (
                            asset.manufacturer
                          ) : asset.model ? (
                            asset.model
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm font-mono text-muted-foreground">{asset.serialNumber ?? "—"}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {asset.os && asset.osVersion ? (
                            <>
                              <span className="font-medium">{asset.os}</span>
                              <span className="text-muted-foreground mx-1">/</span>
                              <span>{asset.osVersion}</span>
                            </>
                          ) : asset.os ? (
                            asset.os
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          <div>{asset.ipAddress ?? "—"}</div>
                          <div className="text-muted-foreground">{asset.location ?? "—"}</div>
                        </td>
                        <td className="px-4 py-4">{getStatusBadge(asset.status)}</td>
                        <td className="px-4 py-4 text-sm text-muted-foreground">
                          {asset.warrantyExpires ? (
                            <>
                              {format(new Date(asset.warrantyExpires), "MMM d, yyyy")}
                              {new Date(asset.warrantyExpires) < new Date() && (
                                <span className="ml-2 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Expired</span>
                              )}
                            </>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                        <td className="px-4 py-4 text-right pr-4">
                          <div className="flex items-center justify-end gap-2">
                            <button className="p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors" aria-label="View details">
                              <ExternalLink className="h-4 w-4" />
                            </button>
                            <button className="p-1.5 text-muted-foreground hover:text-muted-foreground hover:bg-muted rounded-lg transition-colors" aria-label="More options">
                              <MoreVertical className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAssets.map((asset) => {
                const Icon = assetTypeIcons[asset.type] || Server;
                const color = assetTypeColors[asset.type] || "gray";
                return (
                  <article key={asset.id} className="border border-border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all">
                    <div className="flex items-start gap-3">
                      <div className={cn("h-12 w-12 rounded-lg flex items-center justify-center shrink-0", `bg-${color}-100 text-${color}-600`)}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground truncate">{asset.name}</h3>
                        <p className="text-xs text-muted-foreground capitalize">{asset.type.toLowerCase().replace("_", " ")}</p>
                      </div>
                    </div>
                    <div className="mt-3 space-y-2 text-sm">
                      {asset.manufacturer && <p className="text-muted-foreground"><span className="font-medium">Mfr:</span> {asset.manufacturer}</p>}
                      {asset.model && <p className="text-muted-foreground"><span className="font-medium">Model:</span> {asset.model}</p>}
                      {asset.serialNumber && <p className="text-muted-foreground"><span className="font-medium">Serial:</span> <code className="font-mono">{asset.serialNumber}</code></p>}
                      {asset.os && <p className="text-muted-foreground"><span className="font-medium">OS:</span> {asset.os} {asset.osVersion ? ` ${asset.osVersion}` : ""}</p>}
                      {asset.ipAddress && <p className="text-muted-foreground"><span className="font-medium">IP:</span> {asset.ipAddress}</p>}
                      {asset.location && <p className="text-muted-foreground"><span className="font-medium">Location:</span> {asset.location}</p>}
                      <p className="text-muted-foreground"><span className="font-medium">Status:</span> {getStatusBadge(asset.status)}</p>
                      {asset.warrantyExpires && (
                        <p className={cn("text-muted-foreground", new Date(asset.warrantyExpires) < new Date() ? "text-red-600" : "")}>
                          <span className="font-medium">Warranty:</span> {format(new Date(asset.warrantyExpires), "MMM d, yyyy")}
                          {new Date(asset.warrantyExpires) < new Date() && <span className="ml-1 px-1.5 py-0.5 text-xs bg-red-100 text-red-800 rounded-full">Expired</span>}
                        </p>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-border flex items-center justify-end gap-2">
                      <button className="text-sm text-primary hover:underline">View Details</button>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-4 py-3 border-t border-border flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(page - 1) * limit + 1} to {Math.min(page * limit, total)} of {total} assets
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg text-muted-foreground hover:text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <span className="text-sm text-muted-foreground">Page {page} of {totalPages}</span>
              <button
                onClick={() => handlePageChange(page + 1)}
                disabled={page === totalPages}
                className="p-2 rounded-lg text-muted-foreground hover:text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
