import { ServiceDef } from "./types";
import { commercialServices } from "./commercial-services";

export const services: ServiceDef[] = commercialServices;

export function getService(slug: string): ServiceDef | undefined {
  return services.find((s) => s.slug === slug);
}

const groupToCategory: Record<string, string> = {
  "managed-it-services": "business",
  "it-security": "security",
  "cloud-solutions": "m365",
  "network-server": "wifi",
  "it-support": "computer",
  "backup-disaster-recovery": "other",
  applications: "other",
  communications: "email",
};

export function getServiceHelpCategory(slug: string): string {
  const top = slug.split("/")[0];
  return groupToCategory[top] ?? "other";
}

export function getRelatedServices(slug: string): ServiceDef[] {
  const service = getService(slug);
  if (!service) return [];
  return service.relatedServices.map((s) => getService(s)).filter(Boolean) as ServiceDef[];
}
