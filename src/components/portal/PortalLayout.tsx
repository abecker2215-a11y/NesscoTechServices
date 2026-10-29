"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";
import {
  LayoutDashboard,
  TicketCheck,
  Server,
  CreditCard,
  Gift,
  TrendingUp,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Shield,
  HelpCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { PushToggle } from "./PushToggle";

const navigation = [
  { name: "Dashboard", href: "/portal", icon: LayoutDashboard },
  { name: "Tickets", href: "/portal/tickets", icon: TicketCheck },
  { name: "Assets", href: "/portal/assets", icon: Server },
  { name: "Billing", href: "/portal/billing", icon: CreditCard },
  { name: "Insights", href: "/portal/insights", icon: TrendingUp },
  { name: "Referrals", href: "/portal/referrals", icon: Gift },
];

export function PortalLayout({
  children,
  session,
}: {
  children: React.ReactNode;
  session?: Session | null;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border transform transition-transform duration-200 lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Portal navigation"
      >
<div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
          <Link href="/portal" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-semibold text-gray-900">Nessco Portal</span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1" aria-label="Main navigation">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-gray-200 p-4">
          <div className="border-t border-gray-200 pt-4">
            <p className="text-xs text-gray-500 mb-2">Need help?</p>
            <a
              href="/contact"
              className="flex items-center gap-2 text-sm text-primary hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              <HelpCircle className="h-4 w-4" />
              Contact Support
            </a>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
<div className="flex items-center gap-4">
              <h1 className="text-lg font-semibold text-foreground hidden sm:block">
                {navigation.find((n) => pathname === n.href || pathname.startsWith(n.href + "/"))?.name ?? "Portal"}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Push notifications for this device */}
              <PushToggle />

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-expanded={userMenuOpen}
                  aria-haspopup="true"
                  aria-label="User menu"
                >
                  <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-medium text-sm">
                    {userInitials}
                  </div>
                  <span className="hidden sm:block text-sm font-medium text-gray-700">{session?.user?.name ?? "User"}</span>
                  <ChevronDown className="h-4 w-4 text-gray-500 hidden sm:block" />
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} aria-hidden="true" />
                    <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-background py-1 shadow-lg ring-1 ring-border focus:outline-none animate-fade-in">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500 truncate">{session?.user?.email}</p>
                        <p className="text-xs text-gray-400 mt-1 capitalize">{session?.user?.clientSlug ?? "No client"}</p>
                      </div>
                      <hr className="my-1 border-gray-100" />
                      <button
                        onClick={() => signOut({ callbackUrl: "/" })}
                        className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 sm:p-6 lg:p-8" id="main-content" tabIndex={-1}>
          {children}
        </main>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.15s ease-out; }
      `}</style>
    </div>
  );
}