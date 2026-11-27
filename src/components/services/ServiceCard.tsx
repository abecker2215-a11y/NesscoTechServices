import Link from "next/link";
import Image from "next/image";
import { ServiceDef } from "@/lib/types";
import { Card, CardContent } from "@/components/ui";
import { ArrowRight } from "lucide-react";

interface ServiceCardProps {
  service: ServiceDef;
  variant?: "grid" | "list";
}

const imageMap: Record<string, string> = {
  "managed-it-services": "/services-images/managed-it-services.webp",
  "it-security": "/services-images/it-security.webp",
  "cloud-solutions": "/services-images/cloud-solutions.webp",
  "network-server": "/services-images/network-server.webp",
  "it-support": "/services-images/it-support.webp",
  "backup-disaster-recovery": "/services-images/backup-disaster-recovery.webp",
  applications: "/services-images/applications.webp",
  communications: "/services-images/communications.webp",
};

export function ServiceCard({ service, variant = "grid" }: ServiceCardProps) {
  const imageSrc = imageMap[service.slug];
  const rateParts: string[] = [];
  if (service.remoteAvailable) rateParts.push(`Remote from $${service.pricing.remote}/hr`);
  if (service.onsiteAvailable) rateParts.push(`On-site from $${service.pricing.onsite}/hr`);
  const rateLabel = rateParts.join(" · ");

  if (variant === "list") {
    return (
      <Link
        href={`/services/${service.slug}`}
        className="flex gap-4 p-4 rounded-lg bg-background border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors"
      >
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={service.title}
            width={60}
            height={60}
            className="flex-shrink-0 rounded-lg object-cover"
          />
        ) : (
          <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
            <ArrowRight className="h-6 w-6" aria-hidden="true" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground">{service.title}</h3>
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{service.shortDescription}</p>
          <p className="mt-2 text-xs font-medium text-muted-foreground">{rateLabel}</p>
          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-primary">
            <span>View {service.title}</span>
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Card variant="outlined" hover padding="md" className="h-full group relative overflow-hidden">
      {imageSrc ? (
        <div className="absolute inset-0">
          <Image
            src={imageSrc}
            alt={service.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
      ) : (
        <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4">
          <ArrowRight className="h-7 w-7" aria-hidden="true" />
        </div>
      )}
      <CardContent className="flex-1 flex flex-col pt-6 pb-8 px-6">
        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">{service.title}</h3>
        <p className="text-sm text-muted-foreground flex-1 mb-6">{service.shortDescription}</p>
        <p className="text-xs font-medium text-muted-foreground mb-6">{rateLabel}</p>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span>View {service.title}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}
