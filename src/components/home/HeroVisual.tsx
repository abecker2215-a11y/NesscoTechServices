import { Wifi, ShieldCheck, HardDrive, CheckCircle2, Activity, Cloud } from "lucide-react";

const tickets = [
  { icon: Wifi, label: "Wi-Fi dropping in the office", status: "Fixed" },
  { icon: Cloud, label: "Microsoft 365 email setup", status: "Done" },
  { icon: HardDrive, label: "Backup restore for laptop", status: "Done" },
];

const floatingChips = [
  { icon: ShieldCheck, label: "Protected", className: "top-6 right-2 sm:-right-6 animate-float" },
  { icon: Activity, label: "Network stable", className: "bottom-16 left-2 sm:-left-8 animate-float-delayed" },
  { icon: HardDrive, label: "Backup synced", className: "bottom-2 right-8 sm:-bottom-2 sm:right-16 animate-float" },
];

export function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-md lg:max-w-lg" aria-hidden="true">
      <div className="hero-glow absolute -inset-8" />

      <div className="relative rounded-2xl border border-border bg-background/90 shadow-lg overflow-hidden">
        <div className="hero-grid-bg absolute inset-0" />
        <div className="relative p-5 sm:p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-destructive/70" />
              <span className="h-3 w-3 rounded-full bg-warning/70" />
              <span className="h-3 w-3 rounded-full bg-success/70" />
            </div>
            <span className="text-xs font-medium text-muted-foreground">nessco support queue</span>
          </div>

          <div className="space-y-3">
            {tickets.map((ticket) => (
              <div
                key={ticket.label}
                className="flex items-center gap-3 rounded-lg border border-border bg-background px-4 py-3 shadow-sm"
              >
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <ticket.icon className="h-4 w-4" />
                </div>
                <span className="min-w-0 flex-1 truncate text-sm text-foreground">{ticket.label}</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                  <CheckCircle2 className="h-3 w-3" />
                  {ticket.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-border bg-muted/50 px-4 py-3">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>All systems operational</span>
              <span className="font-medium text-success">● Online</span>
            </div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
              <div className="h-full w-4/5 rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>

      {floatingChips.map((chip) => (
        <div
          key={chip.label}
          className={`absolute ${chip.className} inline-flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-xs font-medium text-foreground shadow-md`}
        >
          <span className="text-primary">
            <chip.icon className="h-4 w-4" />
          </span>
          {chip.label}
        </div>
      ))}
    </div>
  );
}
