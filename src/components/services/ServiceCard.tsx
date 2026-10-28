import Link from "next/link";
import { ServiceDef } from "@/lib/types";
import { Card, CardContent } from "@/components/ui";
import { ArrowRight, Monitor, Wifi, Mail, Shield, Database, Briefcase, Cable,
  Activity, BarChart, Users, Cpu, CheckCircle, ShieldCheck, SearchCheck,
  ClipboardCheck, Layers, Globe, Server, Cloud, FolderSync, Send, Lock,
  Layout, Download, AlertTriangle, RotateCw, FileSearch, ShieldOff,
  Calculator, ArrowRightLeft, Key, Phone, MessageCircle, Video, MessageSquare,
  Headset, HardDrive } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  computer: Monitor,
  wifi: Wifi,
  mail: Mail,
  shield: Shield,
  database: Database,
  briefcase: Briefcase,
  monitor: Monitor,
  cable: Cable,
  harddrive: HardDrive,
  headset: Headset,
  activity: Activity,
  barchart: BarChart,
  users: Users,
  cpu: Cpu,
  checkcircle: CheckCircle,
  shieldcheck: ShieldCheck,
  searchcheck: SearchCheck,
  clipboardcheck: ClipboardCheck,
  layers: Layers,
  globe: Globe,
  server: Server,
  cloud: Cloud,
  foldersync: FolderSync,
  send: Send,
  lock: Lock,
  layout: Layout,
  download: Download,
  alerttriangle: AlertTriangle,
  rotatecw: RotateCw,
  filesearch: FileSearch,
  shieldoff: ShieldOff,
  calculator: Calculator,
  arrowrightleft: ArrowRightLeft,
  key: Key,
  phone: Phone,
  messagecircle: MessageCircle,
  video: Video,
  messagesquare: MessageSquare,
};

interface ServiceCardProps {
  service: ServiceDef;
  variant?: "grid" | "list";
}

export function ServiceCard({ service, variant = "grid" }: ServiceCardProps) {
  const Icon = iconMap[service.icon] || Monitor;

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
        <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
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
    <Card variant="outlined" hover padding="md" className="h-full flex flex-col">
      <CardContent className="flex-1 flex flex-col">
        <div className="p-3 rounded-lg bg-primary/10 text-primary mb-4">
          <Icon className="h-7 w-7" aria-hidden="true" />
        </div>
        <h3 className="font-semibold text-foreground mb-2">{service.title}</h3>
        <p className="text-sm text-muted-foreground flex-1 mb-4">{service.shortDescription}</p>
        <p className="text-xs font-medium text-muted-foreground mb-3">{rateLabel}</p>
        <div className="flex items-center gap-2 text-sm font-medium text-primary">
          <span>View {service.title}</span>
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </div>
      </CardContent>
    </Card>
  );
}