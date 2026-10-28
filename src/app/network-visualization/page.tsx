import { Metadata } from "next";
import { NetworkVisualizationClient } from "./NetworkVisualizationClient";

export const metadata: Metadata = {
    title: "Network Visualization Tool",
  robots: { index: false, follow: false },
  description: "See how we monitor and protect your network 24/7 with our interactive 3D network visualization demo. Experience proactive IT monitoring.",
  alternates: { canonical: "/network-visualization" },
  openGraph: {
  title: "Network Visualization Tool",
    description: "See how we monitor and protect your network 24/7 with our interactive 3D network visualization demo.",
    url: "https://nesscotech.com/network-visualization",
  },
};

export default function NetworkVisualizationPage() {
  return (
    <>
      <section className="py-16 lg:py-24" aria-labelledby="network-heading">
        <div className="container">
          <div className="mx-auto max-w-3xl">
            <h1 id="network-heading" className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
              Interactive Network Visualization
            </h1>
            <h2 className="text-xl font-semibold text-foreground mb-6">Network Monitoring Demo</h2>
            <p className="text-lg text-muted-foreground mb-10">
              See how Nessco Tech Services monitors and protects your network 24/7 with our interactive
              network visualization demo. Explore device topology, connection health, and proactive IT monitoring
              in real time — experience the visibility we provide to every managed IT client.
            </p>
            <p className="text-lg text-muted-foreground mb-10">
              Our network monitoring covers servers, workstations, switches, firewalls, and cloud infrastructure
              across Tampa Bay businesses. We track uptime, bandwidth, latency, and security events so issues are
              caught before they impact your operations.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="font-semibold text-foreground mb-2">24/7 Monitoring</h3>
                <p className="text-sm text-muted-foreground">Every device, every connection, around the clock.</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="font-semibold text-foreground mb-2">Proactive Alerts</h3>
                <p className="text-sm text-muted-foreground">Issues flagged before they become outages.</p>
              </div>
              <div className="p-6 rounded-xl border border-border bg-background">
                <h3 className="font-semibold text-foreground mb-2">Tampa Bay IT Support</h3>
                <p className="text-sm text-muted-foreground">Local experts who know your infrastructure.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <NetworkVisualizationClient />
    </>
  );
}
