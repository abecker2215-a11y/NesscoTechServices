"use client";

import dynamic from "next/dynamic";

const TrustSignalBar = dynamic(() => import("@/components/ui/TrustSignals").then((mod) => mod.TrustSignalBar), { ssr: false });
const LiveStats = dynamic(() => import("@/components/ui/TrustSignals").then((mod) => mod.LiveStats), { ssr: false });
const ResponseTimeIndicator = dynamic(() => import("@/components/ui/TrustSignals").then((mod) => mod.ResponseTimeIndicator), { ssr: false });
const ViewersCounter = dynamic(() => import("@/components/ui/TrustSignals").then((mod) => mod.ViewersCounter), { ssr: false });

export function TrustSignalBarClient() {
  return <TrustSignalBar />;
}

export function LiveStatsClient() {
  return <LiveStats />;
}

export function ResponseTimeIndicatorClient() {
  return <ResponseTimeIndicator />;
}

export function ViewersCounterClient() {
  return <ViewersCounter />;
}