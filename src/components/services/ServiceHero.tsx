import { ServiceDef } from "@/lib/types";
import { Badge } from "@/components/ui";
import {
  Monitor, Wifi, Mail, Shield, Database, Briefcase, Cable, Check,
  Activity, BarChart, Users, Cpu, CheckCircle, ShieldCheck, SearchCheck,
  ClipboardCheck, Layers, Globe, Server, Cloud, FolderSync, Send, Lock,
  Layout, Download, AlertTriangle, RotateCw, FileSearch, ShieldOff,
  Calculator, ArrowRightLeft, Key, Phone, MessageCircle, Video, MessageSquare,
  Headset, HardDrive,
} from "lucide-react";

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

interface ServiceHeroProps {
  service: ServiceDef;
}

export function ServiceHero({ service }: ServiceHeroProps) {
  const Icon = iconMap[service.icon] || Monitor;

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden" aria-labelledby="service-title">
      <div className="container">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10 text-primary">
              <Icon className="h-8 w-8" aria-hidden="true" />
            </div>
            <div>
              <Badge variant="primary">IT Service</Badge>
            </div>
          </div>
          <h1 id="service-title" className="text-3xl lg:text-4xl font-bold text-foreground tracking-tight mb-4">
            {service.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-8">{service.problem}</p>
          <div className="flex flex-wrap items-center gap-4">
            {service.remoteAvailable && (
              <Badge variant="outline" className="gap-1.5">
                <Check className="h-3 w-3" aria-hidden="true" />
                Remote: Starting at ${service.pricing.remote}
              </Badge>
            )}
            {service.onsiteAvailable && (
              <Badge variant="outline" className="gap-1.5">
                <Check className="h-3 w-3" aria-hidden="true" />
                On-Site: Starting at ${service.pricing.onsite}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}