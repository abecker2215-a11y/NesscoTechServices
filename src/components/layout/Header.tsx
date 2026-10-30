"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
import { FuseSearch } from "@/components/search/FuseSearch";
import {
  Menu,
  X,
  Monitor,
  ChevronDown,
  ArrowRight,
  Check,
  Wifi,
  Mail,
  Send,
  ShieldCheck,
  Database,
  Briefcase,
  Cable,
  Download,
  Headset,
  Building2,
  Lock,
  HardDrive,
  Activity,
  BarChart2,
  Users,
  Cpu,
  CheckCircle2,
  Shield,
  SearchCheck,
  ClipboardCheck,
  Layers,
  Globe,
  FolderSync,
  Cloud,
  Layout,
  RotateCw,
  AlertTriangle,
  FileSearch,
  ShieldOff,
  Calculator,
  ArrowRightLeft,
  Key,
  Phone,
  MessageSquare,
  MessageCircle,
  Video,
  Server,
} from "lucide-react";
import { navItems, siteConfig } from "@/lib/config";
import type { NavChild, NavItem } from "@/lib/types";
import { ThemeToggle } from "./ThemeToggle";
import { OpenStatus } from "./OpenStatus";
import { AIRecommendations } from "@/components/recommendations/AIRecommendations";
import { TechnicianAvailability } from "@/components/status/TechnicianAvailability";

type IconComponent = React.ComponentType<React.SVGProps<SVGSVGElement>>;

const categoryPageMap: Record<string, string> = {
  managed: "managed-it-services",
  security: "it-security",
  cloud: "cloud-solutions",
  network: "network-server",
  support: "it-support",
  backup: "backup-disaster-recovery",
  apps: "applications",
  comm: "communications",
};

const iconMap: Record<string, IconComponent> = {
  computer: Monitor,
  wifi: Wifi,
  mail: Mail,
  send: Send,
  shield: Shield,
  database: Database,
  briefcase: Briefcase,
  cable: Cable,
  download: Download,
  headset: Headset,
  lock: Lock,
  building: Building2,
  harddrive: HardDrive,
  activity: Activity,
  barchart: BarChart2,
  users: Users,
  cpu: Cpu,
  checkcircle: CheckCircle2,
  shieldcheck: ShieldCheck,
  "shield-check": ShieldCheck,
  searchcheck: SearchCheck,
  clipboardcheck: ClipboardCheck,
  layers: Layers,
  globe: Globe,
  foldersync: FolderSync,
  cloud: Cloud,
  layout: Layout,
  rotatecw: RotateCw,
  alerttriangle: AlertTriangle,
  filesearch: FileSearch,
  shieldoff: ShieldOff,
  calculator: Calculator,
  arrowrightleft: ArrowRightLeft,
  key: Key,
  phone: Phone,
  messagesquare: MessageSquare,
  messagecircle: MessageCircle,
  video: Video,
  server: Server,
  monitor: Monitor,
};

const OPEN_DELAY = 80;
const CLOSE_DELAY = 160;

function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setIsScrolled(y > 10);
      setScrolledPastHero(y > 250);
    };
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);
    handleScroll();
    handleResize();
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const showHeaderBg = isScrolled;

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ease-out",
        showHeaderBg ? "bg-[var(--navy-900)] border-b border-[var(--navy-700)]" : "bg-transparent"
      )}
    >
      {/* Logo + desktop nav: hidden on mobile until scrolled past hero */}
      <nav className="w-full px-4 lg:px-6 xl:px-8 max-w-[1800px] mx-auto" aria-label="Main navigation">
        <div
          className={cn(
            "flex h-16 items-center justify-between gap-4 transition-transform duration-300 ease-out",
            isMobile && !scrolledPastHero
              ? "-translate-y-[-100%] opacity-0 pointer-events-none"
              : "translate-y-0 opacity-100 pointer-events-auto"
          )}
        >
          <div className="flex items-center gap-4 flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold tracking-tight text-navy-50 hover:opacity-80 transition-opacity"
              aria-label={`${siteConfig.name} - Home`}
            >
              <Monitor className="h-6 w-6 text-cyan-400" aria-hidden="true" />
              <span>
                <span className="tracking-tighter text-white">NESSCO</span>{" "}
                <span className="text-cyan-400 text-[12px] tracking-[2px] font-medium">TECH SERVICES</span>
              </span>
            </Link>
            <div className="hidden lg:flex items-center">
              <OpenStatus />
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-4 flex-1 min-w-0">
            <div className="relative flex-shrink-0">
              <FuseSearch placeholder="Search..." className="w-40 lg:w-48 xl:w-56" />
            </div>
            <div className="hidden lg:flex lg:items-center lg:gap-3 flex-1 min-w-0">
              {navItems.map((item) => {
                if (item.hideOnMobile) return null;
                if (item.children) {
                  return <DropdownMenu key={item.href} item={item} />;
                }
                if (item.label === "Contact") {
                  return (
                    <React.Fragment key={item.href}>
                      <NavLink key={`${item.href}-nav`} item={item} />
                      <Link
                        href="/portal"
                        className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-white hover:text-cyan-300 hover:bg-navy-800/50 transition-colors whitespace-nowrap flex-shrink-0"
                      >
                        <Lock className="h-4 w-4" aria-hidden="true" />
                        <span>Portal</span>
                      </Link>
                      <Button size="sm" className="whitespace-nowrap hero-secondary-outline">
                        Get Help
                      </Button>
                    </React.Fragment>
                  );
                }
                return <NavLink key={item.href} item={item} />;
              })}
            </div>
          </div>

          <div className="hidden lg:flex lg:items-center lg:gap-2 flex-shrink-0">
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Mobile hamburger: always visible and clickable, not affected by the nav wrapper transform */}
      <button
        className={cn(
          "xl:hidden fixed top-4 right-4 z-50 p-2 rounded-md text-white",
          !scrolledPastHero ? "bg-black/20 backdrop-blur-sm" : "bg-navy-800/80 backdrop-blur",
          "hover:text-cyan-300 hover:bg-white/10 transition-colors"
        )}
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open menu"
        aria-expanded={isMobileOpen}
      >
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>

      {isMobileOpen && <MobileNav onClose={() => setIsMobileOpen(false)} />}
    </header>
  );
}

function NavLink({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const isActive = isPathActive(pathname, item.href);

  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "relative text-sm font-medium transition-colors",
        isActive ? "text-white" : "text-white hover:text-cyan-300"
      )}
    >
      {item.label}
      <span
        className={cn(
          "absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full transition-all duration-200",
          isActive ? "w-4 opacity-100 bg-cyan-400" : "w-0 opacity-0"
        )}
        aria-hidden="true"
      />
    </Link>
  );
}

function DropdownMenu({ item }: { item: NavItem }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    if (closeTimer.current) clearTimeout(closeTimer.current);
  };

  const open = () => {
    clearTimers();
    openTimer.current = setTimeout(() => setIsOpen(true), OPEN_DELAY);
  };

  const close = () => {
    clearTimers();
    closeTimer.current = setTimeout(() => setIsOpen(false), CLOSE_DELAY);
  };

  const closeNow = () => {
    clearTimers();
    setIsOpen(false);
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeNow();
    };
    const onPointerDown = (e: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) closeNow();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const isActive = isPathActive(pathname, item.href);
  const groups = (item.groups ?? []).map((group) => ({
    ...group,
    items: (item.children ?? []).filter((child) => child.group === group.id),
  }));
  const extras = (item.children ?? []).filter((child) => !child.group && !child.featured);
  const featured = (item.children ?? []).find((child) => child.featured);
  const columnBase = (index: number) => ({ animationDelay: `${Math.min(index * 80, 320)}ms` });
  const itemDelay = (columnIndex: number, index: number) => ({
    animationDelay: `${Math.min(columnIndex * 80 + index * 45, 400)}ms`,
  });

  return (
    <div
      ref={rootRef}
      className="relative"
      onMouseEnter={open}
      onMouseLeave={close}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) closeNow();
      }}
    >
      <button
        type="button"
        onClick={() => (isOpen ? closeNow() : setIsOpen(true))}
    className={cn(
          "relative flex items-center gap-1 rounded-md px-1 py-1 text-sm font-medium transition-colors",
          isActive || isOpen ? "text-white" : "text-white hover:text-cyan-300"
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <ChevronDown
          className={cn("h-4 w-4 transition-transform duration-200", isOpen && "rotate-180 text-cyan-400")}
          aria-hidden="true"
        />
        <span
          className={cn(
            "absolute -bottom-0.5 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-cyan-400 transition-all duration-200",
            isActive ? "w-4 opacity-100" : "w-0 opacity-0"
          )}
          aria-hidden="true"
        />
      </button>

      <div
        className={cn(
          "fixed left-0 right-0 top-10 z-40 pt-6",
          !isOpen && "pointer-events-none invisible"
        )}
        aria-hidden={!isOpen}
      >
        <div className="container">
          <div
            className={cn(
              "mega-panel-bg overflow-hidden rounded-2xl border border-border bg-background shadow-xl transition-all duration-150",
              isOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
            )}
          >
            <div
              className="h-0.5 w-full bg-gradient-to-r from-primary via-primary/50 to-transparent"
              aria-hidden="true"
            />

            <div
              key={isOpen ? "open" : "closed"}
              className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:p-8 max-h-[70vh] overflow-y-auto scrollbar-hide"
            >
              {groups.map((group, groupIndex) => {
                const GroupIcon = group.icon ? iconMap[group.icon] : undefined;
                const categorySlug = categoryPageMap[group.id];
                return (
                  <div key={group.id} className="animate-mega-item-in" style={columnBase(groupIndex)}>
                    <p className="mb-2 flex items-center gap-1.5 px-2.5 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                      {GroupIcon && <GroupIcon className="h-3.5 w-3.5 text-primary" aria-hidden="true" />}
                      {group.label}
                    </p>
                    <div className="space-y-0.5">
                      {categorySlug && (
                        <Link
                          key={`category-${group.id}`}
                          href={`/services/category/${categorySlug}`}
                          onClick={closeNow}
                          style={itemDelay(groupIndex, -1)}
                          className="animate-mega-item-in group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-accent/70 text-primary"
                        >
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <ArrowRight className="h-4 w-4" aria-hidden="true" />
                          </span>
                          <span className="min-w-0">
                            <span className="text-sm font-semibold text-primary">Category overview</span>
                          </span>
                        </Link>
                      )}
                      {group.items.map((child, index) => (
                        <MegaLink
                          key={child.href}
                          child={child}
                          active={isPathActive(pathname, child.href)}
                          onClick={closeNow}
                          style={itemDelay(groupIndex, index)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {extras.length > 0 && (
                <div
                  className="animate-mega-item-in"
                  style={columnBase(groups.length)}
                >
                  <p className="mb-2 px-2.5 text-[0.7rem] font-semibold uppercase tracking-wider text-muted-foreground">
                    More
                  </p>
                  <div className="space-y-0.5">
                    {extras.map((child, index) => (
                      <MegaLink
                        key={child.href}
                        child={child}
                        active={isPathActive(pathname, child.href)}
                        onClick={closeNow}
                        style={itemDelay(groups.length, index)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {featured && (
                <div className="animate-mega-item-in" style={columnBase(groups.length + extras.length)}>
                  <FeaturedCard
                    child={featured}
                    onClick={closeNow}
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border bg-muted/40 px-6 py-3.5 lg:px-8">
              <p className="text-xs text-muted-foreground">
                Not sure what you need? Tell us the problem — we&apos;ll point you in the right direction.
              </p>
              <div className="flex items-center gap-5 text-xs font-medium">
                <Link
                  href="/services"
                  onClick={closeNow}
                  className="flex items-center gap-1 text-primary transition-colors hover:text-primary/80"
                >
                  View all services
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MegaLink({
  child,
  active,
  onClick,
  style,
}: {
  child: NavChild;
  active: boolean;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  const Icon = child.icon ? iconMap[child.icon] : undefined;

  return (
    <Link
      href={child.href}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      style={style}
      className={cn(
        "animate-mega-item-in group flex items-start gap-3 rounded-xl p-2.5 transition-colors",
        active ? "bg-accent" : "hover:bg-accent/70"
      )}
    >
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors",
          active
            ? "bg-primary text-primary-foreground"
            : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground"
        )}
      >
        {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
      </span>
      <span className="min-w-0">
        <span className="flex items-center gap-1 text-sm font-semibold text-foreground">
          {child.label}
          <ArrowRight
            className="h-3.5 w-3.5 -translate-x-1 text-cyan-400 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100"
            aria-hidden="true"
          />
        </span>
        {child.description && (
          <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
            {child.description}
          </span>
        )}
      </span>
    </Link>
  );
}

function FeaturedCard({
  child,
  onClick,
  style,
}: {
  child: NavChild;
  onClick: () => void;
  style?: React.CSSProperties;
}) {
  const Icon = child.icon ? iconMap[child.icon] : Headset;

  return (
    <div
      style={style}
      className="animate-mega-item-in relative flex flex-col rounded-xl border border-navy-700/50 bg-gradient-to-b from-navy-900/50 via-navy-900/25 to-transparent p-5 md:col-span-2 lg:col-span-1"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-cyan-600 text-cyan-50 shadow-sm">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div>
          <span className="block text-[0.65rem] font-semibold uppercase tracking-wider text-cyan-400">
            Most requested
          </span>
          <div className="text-sm font-semibold text-foreground">{child.label}</div>
        </div>
      </div>

      {child.description && (
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{child.description}</p>
      )}

      {child.bullets && (
        <ul className="mt-3 space-y-1.5">
          {child.bullets.map((bullet) => (
            <li key={bullet} className="flex items-start gap-2 text-xs text-muted-foreground">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-foreground" aria-hidden="true" />
              {bullet}
            </li>
          ))}
        </ul>
      )}

      <Link
        href={child.href}
        onClick={onClick}
        className="mt-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-accent-foreground shadow-sm transition-all hover:bg-accent/90 hover:shadow-md"
      >
        {child.ctaLabel ?? `Explore ${child.label}`}
        <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}

function MobileNav({ onClose }: { onClose: () => void }) {
  const pathname = usePathname();

  return (
    <div className="fixed inset-0 z-50 xl:hidden" role="dialog" aria-modal="true" aria-label="Mobile menu">
      <div className="fixed inset-0 bg-black/90 animate-fade-in" onClick={onClose} aria-hidden="true" />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-navy-950 shadow-xl animate-slide-in-right border-l border-navy-700">
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between border-b border-navy-700 p-4">
            <span className="font-semibold text-lg text-white">
              <span className="tracking-tighter">NESSCO</span>
            </span>
          <div className="flex flex-1 items-center justify-end gap-1">
            <ThemeToggle />
            <button
              className="p-2 rounded-md text-white hover:text-cyan-300 hover:bg-navy-800/50 transition-colors"
              onClick={onClose}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-4">
            <div className="relative mb-4">
              <FuseSearch placeholder="Search..." className="w-full" />
            </div>
            <div className="space-y-2">
              {navItems.map((item) =>
                item.children ? (
                  <MobileDropdown key={item.href} item={item} onClose={onClose} />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isPathActive(pathname, item.href) ? "page" : undefined}
                    className={cn(
                      "block px-4 py-4 text-base font-medium rounded-lg transition-colors min-h-[48px]",
                      isPathActive(pathname, item.href)
                        ? "text-white bg-navy-800/50"
                        : "text-cyan-200 hover:text-white hover:bg-navy-800/50"
                    )}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
            <div className="border-t border-navy-700 pt-4 space-y-3">
              <Button className="w-full min-h-[48px]" size="lg" href="/get-help" onClick={onClose}>
                Get Help
              </Button>
            </div>
          </nav>
        </div>
      </div>
    </div>
  );
}

function MobileDropdown({ item, onClose }: { item: NavItem; onClose: () => void }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const groups = (item.groups ?? []).map((group) => ({
    ...group,
    items: (item.children ?? []).filter((child) => child.group === group.id),
  }));
  const extras = (item.children ?? []).filter((child) => !child.group);
  const isActive = isPathActive(pathname, item.href);

  const renderChild = (child: NavChild) => {
    const Icon = child.icon ? iconMap[child.icon] : undefined;
    const active = isPathActive(pathname, child.href);

    return (
      <Link
        key={child.href}
        href={child.href}
        aria-current={active ? "page" : undefined}
        onClick={onClose}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-3 py-3 text-sm transition-colors min-h-[44px]",
          active
            ? "bg-accent font-medium text-white"
            : "text-cyan-200 hover:text-white"
        )}
      >
        {Icon && <Icon className="h-4 w-4 shrink-0 text-cyan-400" aria-hidden="true" />}
        <span>{child.label}</span>
      </Link>
    );
  };

  return (
    <div>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex w-full items-center justify-between px-4 py-3 text-base font-medium rounded-lg transition-colors min-h-[48px]",
          isActive ? "text-white bg-accent" : "text-cyan-200 hover:text-white hover:bg-muted"
        )}
        aria-expanded={isOpen}
      >
        {item.label}
        <svg className={cn("h-4 w-4 transition-transform", isOpen && "rotate-180")} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
      {isOpen && (
        <div className="mt-1 ml-4 space-y-1 border-l-2 border-border pl-3 animate-fade-in">
          {groups.map((group) => (
            <div key={group.id}>
              <p className="px-2 pt-2 pb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-muted-foreground">
                {group.label}
              </p>
              {group.items.map(renderChild)}
            </div>
          ))}
          {extras.length > 0 && <div className="space-y-0.5">{extras.map(renderChild)}</div>}
        </div>
      )}
    </div>
  );
}
