import { Metadata } from "next";
import { NetworkVisualizationClient } from "./NetworkVisualizationClient";

export const metadata: Metadata = {
  title: "Interactive Network Visualization | Nessco Tech Services",
  robots: { index: false, follow: false },
  description: "See how we monitor and protect your network 24/7 with our interactive 3D network visualization demo. Experience proactive IT monitoring.",
  alternates: { canonical: "/network-visualization" },
  openGraph: {
    title: "Interactive Network Visualization | Nessco Tech Services",
    description: "See how we monitor and protect your network 24/7 with our interactive 3D network visualization demo.",
    url: "https://nesscotech.com/network-visualization",
  },
};

export default function NetworkVisualizationPage() {
  return <NetworkVisualizationClient />;
}
