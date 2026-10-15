export function serialize<T>(data: T): T {
  return JSON.parse(JSON.stringify(data));
}

type DateLike = Date | string;
type NullableDateLike = DateLike | null | undefined;

function iso(value: DateLike): string {
  return value instanceof Date ? value.toISOString() : value;
}

function isoOrNull(value: NullableDateLike): string | null {
  if (value === null || value === undefined) return null;
  return value instanceof Date ? value.toISOString() : value;
}

export interface SerializedTicket {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  category: string;
  source: string;
  clientId: string;
  createdById: string;
  assigneeId: string | null;
  slaDueAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  createdAt: string;
  updatedAt: string;
  assignee?: { name: string | null; email: string } | null;
}

export interface SerializedAsset {
  id: string;
  name: string;
  type: string;
  manufacturer: string | null;
  model: string | null;
  serialNumber: string | null;
  os: string | null;
  osVersion: string | null;
  ipAddress: string | null;
  macAddress: string | null;
  location: string | null;
  purchaseDate: string | null;
  warrantyExpires: string | null;
  status: string;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedBilling {
  id: string;
  type: string;
  amount: string;
  currency: string;
  status: string;
  description: string;
  invoiceUrl: string | null;
  dueDate: string | null;
  paidAt: string | null;
  periodStart: string;
  periodEnd: string;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedUsage {
  id: string;
  metric: string;
  value: string;
  unit: string;
  periodStart: string;
  periodEnd: string;
  recordedAt: string;
}

export interface SerializedMaintenanceWindow {
  id: string;
  title: string;
  description: string | null;
  type: string;
  status: string;
  scheduledStart: string;
  scheduledEnd: string;
  actualStart: string | null;
  actualEnd: string | null;
  createdById: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SerializedServiceRequest {
  id: string;
  type: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  requestedFor: string | null;
  assignedToId: string | null;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TicketInput {
  createdAt: DateLike;
  updatedAt: DateLike;
  slaDueAt?: NullableDateLike;
  resolvedAt?: NullableDateLike;
  closedAt?: NullableDateLike;
}

interface AssetInput {
  createdAt: DateLike;
  updatedAt: DateLike;
  purchaseDate?: NullableDateLike;
  warrantyExpires?: NullableDateLike;
}

interface BillingInput {
  createdAt: DateLike;
  updatedAt: DateLike;
  periodStart: DateLike;
  periodEnd: DateLike;
  dueDate?: NullableDateLike;
  paidAt?: NullableDateLike;
  amount: { toString(): string } | string | number;
}

interface UsageInput {
  periodStart: DateLike;
  periodEnd: DateLike;
  recordedAt: DateLike;
  value: { toString(): string } | string | number;
}

interface MaintenanceWindowInput {
  createdAt: DateLike;
  updatedAt: DateLike;
  scheduledStart: DateLike;
  scheduledEnd: DateLike;
  actualStart?: NullableDateLike;
  actualEnd?: NullableDateLike;
}

interface ServiceRequestInput {
  createdAt: DateLike;
  updatedAt: DateLike;
  completedAt?: NullableDateLike;
  requestedFor?: NullableDateLike;
}

export function serializeTickets<T extends TicketInput>(tickets: T[]): SerializedTicket[] {
  return tickets.map((t) => ({
    ...(t as unknown as Record<string, unknown>),
    createdAt: iso(t.createdAt),
    updatedAt: iso(t.updatedAt),
    resolvedAt: isoOrNull(t.resolvedAt),
    closedAt: isoOrNull(t.closedAt),
    slaDueAt: isoOrNull(t.slaDueAt),
  })) as unknown as SerializedTicket[];
}

export function serializeAssets<T extends AssetInput>(assets: T[]): SerializedAsset[] {
  return assets.map((a) => ({
    ...(a as unknown as Record<string, unknown>),
    createdAt: iso(a.createdAt),
    updatedAt: iso(a.updatedAt),
    purchaseDate: isoOrNull(a.purchaseDate),
    warrantyExpires: isoOrNull(a.warrantyExpires),
  })) as unknown as SerializedAsset[];
}

export function serializeBillings<T extends BillingInput>(billings: T[]): SerializedBilling[] {
  return billings.map((b) => ({
    ...(b as unknown as Record<string, unknown>),
    createdAt: iso(b.createdAt),
    updatedAt: iso(b.updatedAt),
    periodStart: iso(b.periodStart),
    periodEnd: iso(b.periodEnd),
    dueDate: isoOrNull(b.dueDate),
    paidAt: isoOrNull(b.paidAt),
    amount: b.amount.toString(),
  })) as unknown as SerializedBilling[];
}

export function serializeUsage<T extends UsageInput>(usage: T[]): SerializedUsage[] {
  return usage.map((u) => ({
    ...(u as unknown as Record<string, unknown>),
    periodStart: iso(u.periodStart),
    periodEnd: iso(u.periodEnd),
    recordedAt: iso(u.recordedAt),
    value: u.value.toString(),
  })) as unknown as SerializedUsage[];
}

export function serializeMaintenanceWindows<T extends MaintenanceWindowInput>(
  windows: T[]
): SerializedMaintenanceWindow[] {
  return windows.map((w) => ({
    ...(w as unknown as Record<string, unknown>),
    createdAt: iso(w.createdAt),
    updatedAt: iso(w.updatedAt),
    scheduledStart: iso(w.scheduledStart),
    scheduledEnd: iso(w.scheduledEnd),
    actualStart: isoOrNull(w.actualStart),
    actualEnd: isoOrNull(w.actualEnd),
  })) as unknown as SerializedMaintenanceWindow[];
}

export function serializeServiceRequests<T extends ServiceRequestInput>(
  requests: T[]
): SerializedServiceRequest[] {
  return requests.map((r) => ({
    ...(r as unknown as Record<string, unknown>),
    createdAt: iso(r.createdAt),
    updatedAt: iso(r.updatedAt),
    completedAt: isoOrNull(r.completedAt),
    requestedFor: isoOrNull(r.requestedFor),
  })) as unknown as SerializedServiceRequest[];
}
