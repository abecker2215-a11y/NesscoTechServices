"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Sparkles, TrendingUp, Shield, Cloud, Database, Wifi, Headset, type LucideIcon } from "lucide-react";

interface Recommendation {
  service: string;
  reason: string;
  confidence: number;
  icon: LucideIcon;
  href: string;
}

const allServices = [
  { name: "Network Security", href: "/services/network-security", icon: Shield, category: "security" },
  { name: "Cloud Migration", href: "/services/cloud-migration", icon: Cloud, category: "cloud" },
  { name: "Backup Solutions", href: "/services/backup-solutions", icon: Database, category: "backup" },
  { name: "WiFi Setup", href: "/services/wifi-setup", icon: Wifi, category: "network" },
  { name: "24/7 Monitoring", href: "/services/24-7-monitoring", icon: TrendingUp, category: "monitoring" },
  { name: "Help Desk", href: "/services/help-desk", icon: Headset, category: "support" },
];

function getCategoryFromPath(path: string): string {
  if (path.includes("security")) return "security";
  if (path.includes("cloud")) return "cloud";
  if (path.includes("backup")) return "backup";
  if (path.includes("wifi") || path.includes("network")) return "network";
  if (path.includes("monitoring")) return "monitoring";
  if (path.includes("help") || path.includes("support")) return "support";
  return "general";
}

function generateRecommendations(category: string): Recommendation[] {
  const baseReasons: Record<string, string> = {
    security: "Security-focused businesses often need",
    cloud: "Cloud users typically also require",
    backup: "Data protection pairs well with",
    network: "Network setups benefit from",
    monitoring: "Proactive monitoring works best with",
    support: "Support teams rely on",
    general: "Popular combinations include",
  };

  const relatedCategories: Record<string, string[]> = {
    security: ["backup", "monitoring", "cloud"],
    cloud: ["security", "backup", "monitoring"],
    backup: ["security", "monitoring", "network"],
    network: ["security", "monitoring", "support"],
    monitoring: ["security", "backup", "support"],
    support: ["network", "monitoring", "cloud"],
    general: ["security", "backup", "monitoring"],
  };

  const related = relatedCategories[category] || relatedCategories.general;
  const reason = baseReasons[category] || baseReasons.general;

  const recs: Recommendation[] = [];
  const usedServices = new Set<string>();

  related.forEach((cat, index) => {
    const service = allServices.find((s) => s.category === cat && !usedServices.has(s.name));
    if (service) {
      usedServices.add(service.name);
      recs.push({
        service: service.name,
        reason: `${reason} ${service.name.toLowerCase()}`,
        confidence: Math.max(85 - index * 10, 65),
        icon: service.icon,
        href: service.href,
      });
    }
  });

  return recs.slice(0, 3);
}

export function AIRecommendations() {
  const pathname = usePathname();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      const currentCategory = getCategoryFromPath(pathname);
      setRecommendations(generateRecommendations(currentCategory));
      setIsAnalyzing(false);
    }, 800);

    return () => clearTimeout(timer);
  }, [pathname]);

  if (recommendations.length === 0 && !isAnalyzing) {
    return null;
  }

  return (
    <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 rounded-xl p-4">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="h-4 w-4 text-primary animate-pulse" aria-hidden="true" />
        <h4 className="text-sm font-semibold text-foreground">AI-Powered Suggestions</h4>
      </div>

      {isAnalyzing ? (
        <div className="space-y-2">
          <div className="h-3 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-3 bg-muted rounded animate-pulse w-1/2" />
          <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
        </div>
      ) : (
        <div className="space-y-2">
          {recommendations.map((rec) => (
            <a
              key={rec.href}
              href={rec.href}
              className="flex items-start gap-2 p-2 rounded-lg hover:bg-accent/50 transition-colors group"
            >
              <div className="flex-shrink-0 mt-0.5">
                <rec.icon className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                  {rec.service}
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">{rec.reason}</p>
              </div>
              <div className="flex-shrink-0">
                <span className="text-xs font-medium text-primary">{rec.confidence}% match</span>
              </div>
            </a>
          ))}
        </div>
      )}

      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-xs text-muted-foreground">
          Based on your browsing patterns
        </p>
      </div>
    </div>
  );
}
