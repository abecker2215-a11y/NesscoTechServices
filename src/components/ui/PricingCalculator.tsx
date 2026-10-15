"use client";

import { useState, useMemo } from "react";
import { Button, Input } from "@/components/ui";
import { Monitor, Wifi, Shield, Check, Truck, CloudLightning } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceItem {
  id: string;
  name: string;
  description: string;
  category: "remote" | "onsite" | "managed" | "project";
  basePrice: number;
  unit: "hour" | "month" | "project";
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
}

const SERVICES: ServiceItem[] = [
  {
    id: "remote-support",
    name: "Remote IT Support",
    description: "Secure remote desktop sessions for software issues, email, browser problems",
    category: "remote",
    basePrice: 75,
    unit: "hour",
    icon: Monitor,
    features: ["No travel time", "Same-day availability", "Watch everything we do", "Works anywhere with internet"],
  },
  {
    id: "onsite-support",
    name: "On-Site IT Support",
    description: "We come to your business or office for hardware, networking, and device setup",
    category: "onsite",
    basePrice: 125,
    unit: "hour",
    icon: Truck,
    features: ["Hardware repair & replacement", "Network cabling & Wi-Fi installation", "Device setup & data migration", "Server & rack work"],
  },
  {
    id: "managed-essentials",
    name: "Managed IT - Essentials",
    description: "Basic monitoring, patching, and help desk for small teams",
    category: "managed",
    basePrice: 99,
    unit: "month",
    icon: Shield,
    features: ["24/7 monitoring", "Automated patching", "Basic help desk", "Monthly reporting"],
  },
  {
    id: "managed-complete",
    name: "Managed IT - Complete",
    description: "Full IT management: monitoring, security, backups, strategy, vCIO",
    category: "managed",
    basePrice: 299,
    unit: "month",
    icon: Shield,
    features: ["Everything in Essentials", "Advanced security", "Automated backups", "vCIO guidance", "Compliance support"],
  },
  {
    id: "network-install",
    name: "Network Installation",
    description: "Structured cabling, Wi-Fi design, firewall setup, VLAN configuration",
    category: "project",
    basePrice: 1500,
    unit: "project",
    icon: Wifi,
    features: ["Site survey & design", "CAT6/CAT6a/Fiber cabling", "Enterprise Wi-Fi", "Firewall & VLAN config"],
  },
  {
    id: "m365-migration",
    name: "Microsoft 365 Migration",
    description: "Email migration, Teams setup, SharePoint, Intune, security policies",
    category: "project",
    basePrice: 2500,
    unit: "project",
    icon: CloudLightning,
    features: ["Email migration", "Teams & SharePoint setup", "MFA & security policies", "User training"],
  },
];

export function PricingCalculator() {
  const [selectedServices, setSelectedServices] = useState<ServiceItem[]>([]);
  const [quantity, setQuantity] = useState<Record<string, number>>({});
  const [hours, setHours] = useState<Record<string, number>>({});
  const [users, setUsers] = useState<number>(5);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const total = useMemo(() => {
    let total = 0;
    selectedServices.forEach((service) => {
      const qty = quantity[service.id] || 1;
      const hrs = hours[service.id] || 1;
      
      if (service.unit === "hour") {
        total += service.basePrice * hrs;
      } else if (service.unit === "month") {
        total += service.basePrice * users;
      } else {
        total += service.basePrice * qty;
      }
    });
    return total;
  }, [selectedServices, quantity, hours, users]);

  const monthlyRecurring = useMemo(() => {
    let total = 0;
    selectedServices.forEach((service) => {
      if (service.unit === "month") {
        total += service.basePrice * users;
      }
    });
    return total;
  }, [selectedServices, users]);

  const oneTime = useMemo(() => {
    return total - monthlyRecurring;
  }, [total, monthlyRecurring]);

  const toggleService = (service: ServiceItem) => {
    setSelectedServices((prev) => 
      prev.some((s) => s.id === service.id)
        ? prev.filter((s) => s.id !== service.id)
        : [...prev, service]
    );
  };

  const updateQuantity = (id: string, value: number) => {
    setQuantity((prev) => ({ ...prev, [id]: Math.max(1, value) }));
  };

  const updateHours = (id: string, value: number) => {
    setHours((prev) => ({ ...prev, [id]: Math.max(0.5, value) }));
  };

  return (
    <div className="space-y-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-4">Build Your IT Quote</h2>
          <p className="text-muted-foreground text-lg">
            Select services, adjust quantities, and see your estimate instantly. No commitment required.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((service) => {
            const isSelected = selectedServices.some((s) => s.id === service.id);
            const Icon = service.icon;
            return (
              <article
                key={service.id}
                className={cn(
                  "group p-4 rounded-xl border-2 transition-all duration-200",
                  isSelected
                    ? "border-primary bg-primary/5 shadow-lg"
                    : "border-border bg-background hover:border-primary/50 hover:shadow-md"
                )}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 p-2 rounded-lg bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{service.name}</h3>
                    <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">{service.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">
                        ${service.basePrice}/{service.unit}
                      </span>
                    </div>
                    <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                      {service.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <Check className="h-3 w-3 text-success" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <Button
                    variant={isSelected ? "primary" : "outline"}
                    className="flex-1"
                    onClick={() => toggleService(service)}
                  >
                    {isSelected ? "Added ✓" : "Add to Quote"}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {selectedServices.length > 0 && (
        <div className="border-t border-border pt-8">
          <h3 className="text-2xl font-bold text-foreground mb-6">Your Estimate</h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              {selectedServices.map((service) => {
                const hrs = hours[service.id] || 1;
                const qty = quantity[service.id] || 1;
                let lineTotal = 0;
                let label = "";
                
                if (service.unit === "hour") {
                  lineTotal = service.basePrice * hrs;
                  label = `${hrs} hour${hrs !== 1 ? "s" : ""}`;
                } else if (service.unit === "month") {
                  lineTotal = service.basePrice * users;
                  label = `${users} user${users !== 1 ? "s" : ""}/mo`;
                } else {
                  lineTotal = service.basePrice * qty;
                  label = `${qty} project${qty !== 1 ? "s" : ""}`;
                }

                return (
                  <div key={service.id} className="p-4 rounded-lg border border-border bg-background">
                    <div className="flex items-center justify-between gap-4 mb-3">
                      <div>
                        <p className="font-medium text-foreground">{service.name}</p>
                        <p className="text-sm text-muted-foreground">{label}</p>
                      </div>
                      <p className="text-xl font-bold text-foreground">${lineTotal.toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      {service.unit === "hour" && (
                        <>
                          <label className="text-sm text-muted-foreground">Hours:</label>
                          <Input
                            type="number"
                            min="0.5"
                            step="0.5"
                            value={hrs}
                            onChange={(e) => updateHours(service.id, parseFloat(e.target.value))}
                            className="w-20"
                          />
                        </>
                      )}
                      {service.unit === "month" && (
                        <>
                          <label className="text-sm text-muted-foreground">Users:</label>
                          <Input
                            type="number"
                            min="1"
                            value={users}
                            onChange={(e) => setUsers(parseInt(e.target.value))}
                            className="w-20"
                          />
                        </>
                      )}
                      {service.unit === "project" && (
                        <>
                          <label className="text-sm text-muted-foreground">Qty:</label>
                          <Input
                            type="number"
                            min="1"
                            value={qty}
                            onChange={(e) => updateQuantity(service.id, parseInt(e.target.value))}
                            className="w-20"
                          />
                        </>
                      )}
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => toggleService(service)}
                        className="text-destructive"
                      >
                        Remove
                      </Button>
                    </div>
                    <div className="mt-2 pt-2 border-t border-border flex justify-end">
                      <span className="font-semibold text-foreground">${lineTotal.toLocaleString()}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-muted/50 rounded-xl p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">One-time setup</span>
                  <span className="font-medium">${oneTime.toLocaleString()}</span>
                </div>
                {monthlyRecurring > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Monthly recurring</span>
                    <span className="font-medium">${monthlyRecurring.toLocaleString()}/mo</span>
                  </div>
                )}
                <div className="flex justify-between pt-2 border-t border-border">
                  <span className="text-lg font-bold text-foreground">Total (first month)</span>
                  <span className="text-xl font-bold text-primary">${(oneTime + monthlyRecurring).toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Monthly thereafter</span>
                  <span>${monthlyRecurring.toLocaleString()}/mo</span>
                </div>
              </div>
              
              <div className="mt-6 flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="flex-1" onClick={() => trackEvent("pricing_calculator_submit", { total: oneTime + monthlyRecurring, services: selectedServices.map(s => s.id) })}>
                  Request This Quote
                </Button>
                <Button variant="outline" size="lg" className="flex-1" onClick={() => setShowBreakdown(!showBreakdown)}>
                  {showBreakdown ? "Hide Details" : "Show Breakdown"}
                </Button>
              </div>
              
              <p className="mt-4 text-center text-sm text-muted-foreground">
                No commitment required. We&apos;ll review and confirm exact scope before any work begins.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {selectedServices.length === 0 && (
        <div className="text-center py-12 bg-muted/50 rounded-xl">
          <p className="text-muted-foreground mb-4">Add services above to see your estimate</p>
          <Button onClick={() => setShowBreakdown(true)}>See How It Works</Button>
        </div>
      )}
    </div>
  );
}

function trackEvent(name: string, params: Record<string, unknown>) {
  const gtagWindow = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof window !== "undefined" && gtagWindow.gtag) {
    gtagWindow.gtag("event", name, params);
  }
}