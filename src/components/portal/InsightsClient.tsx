"use client";

import Link from "next/link";
import {
  Activity,
  Lightbulb,
  ArrowRight,
  Gauge,
  AlertTriangle,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface InsightsData {
  user: { name: string | null; email: string; clientSlug: string };
  windowDays: number;
  byCategory: { category: string; _count: number }[];
  byStatus: { status: string; _count: number }[];
  recent: {
    id: string;
    title: string;
    category: string;
    priority: string;
    status: string;
    createdAt: string;
    resolvedAt: string | null;
  }[];
  avgResolutionHours: number | null;
  resolvedCount: number;
  proposals: { title: string; why: string; cta: string }[];
  health: {
    score: number;
    grade: string;
    factors: { label: string; impact: number; ok: boolean }[];
  };
  churnAlerts: { id: string; reason: string; detail: string | null; createdAt: string }[];
}

const gradeClass: Record<string, string> = {
  A: "bg-green-100 text-green-800",
  B: "bg-blue-100 text-blue-800",
  C: "bg-yellow-100 text-yellow-800",
  D: "bg-red-100 text-red-800",
};

export function InsightsClient({ initialData }: { initialData: InsightsData }) {
  const { windowDays, byCategory, avgResolutionHours, resolvedCount, proposals, health } = initialData;
  const total = byCategory.reduce((s, c) => s + c._count, 0);
  const max = Math.max(1, ...byCategory.map((c) => c._count));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Insights — where your IT money goes</h1>
        <p className="text-gray-500 mt-1">Last {windowDays} days · {total} tickets · patterns turned into proposals.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Gauge className="h-4 w-4" /> Health score
          </div>
          <div className="mt-1 flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">{health.score}</span>
            <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", gradeClass[health.grade] ?? gradeClass.C)}>
              {health.grade}
            </span>
          </div>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="h-4 w-4" /> Avg resolution
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">
            {avgResolutionHours === null ? "—" : `${avgResolutionHours < 1 ? "<1" : Math.round(avgResolutionHours)}h`}
          </p>
          <p className="text-xs text-gray-500">{resolvedCount} resolved in window</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Lightbulb className="h-4 w-4" /> Proposals
          </div>
          <p className="mt-1 text-2xl font-bold text-gray-900">{proposals.length}</p>
          <p className="text-xs text-gray-500">from repeat patterns</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Tickets by category</h2>
        {byCategory.length === 0 ? (
          <p className="text-sm text-gray-500">No tickets in this window. Quiet is good.</p>
        ) : (
          <div className="space-y-3">
            {[...byCategory].sort((a, b) => b._count - a._count).map((c) => (
              <div key={c.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700 capitalize">{c.category.toLowerCase().replace("_", " ")}</span>
                  <span className="text-gray-500">{c._count}</span>
                </div>
                <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                  <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${(c._count / max) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-primary" /> Recommended projects
        </h2>
        <p className="text-sm text-gray-500 mb-4">Repeat patterns are infrastructure problems wearing incident costumes.</p>
        {proposals.length === 0 ? (
          <p className="text-sm text-gray-500 flex items-center gap-2">
            <CheckCircle className="h-4 w-4 text-green-600" /> No repeat patterns right now. Nothing to sell you — enjoy it.
          </p>
        ) : (
          <div className="space-y-3">
            {proposals.map((p) => (
              <div key={p.title} className="rounded-lg border border-primary/25 bg-primary/5 p-4">
                <p className="font-semibold text-gray-900">{p.title}</p>
                <p className="mt-1 text-sm text-gray-600">{p.why}</p>
                <Link
                  href={p.cta}
                  className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
                >
                  Start this project <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-5">
        <h2 className="font-semibold text-gray-900 mb-4">Why your score is {health.score}</h2>
        <ul className="space-y-2">
          {health.factors.map((f) => (
            <li key={f.label} className="flex items-start gap-2 text-sm">
              {f.ok ? (
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
              )}
              <span className="text-gray-700">{f.label}</span>
              {!f.ok && <span className="ml-auto text-xs font-medium text-gray-500">−{f.impact}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
