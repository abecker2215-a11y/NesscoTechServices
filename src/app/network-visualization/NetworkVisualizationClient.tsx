"use client";

import { useState, useEffect } from "react";
import { Network3DInteractive } from "@/components/network/Network3DInteractive";
import { ContextPanel } from "@/components/network/ContextPanel";
import { TourGuide } from "@/components/network/TourGuide";
import { MobileControls } from "@/components/network/MobileControls";
import { Button } from "@/components/ui";
import { ArrowRight, Shield, Activity, Zap, Lock, Play, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function NetworkVisualizationClient() {
  const [tourActive, setTourActive] = useState(true);
  const [tourStep, setTourStep] = useState(0);
  const [showMobileControls, setShowMobileControls] = useState(false);
  const [networkState, setNetworkState] = useState({
    optimized: false,
    threatMode: false,
    devicesOnline: 13,
    threatsDetected: 0,
  });
  const [lastCheck, setLastCheck] = useState("Just now");
  const [visibleGroups, setVisibleGroups] = useState<Set<string>>(new Set(["All"]));

  useEffect(() => {
    // Update last check time
    const timer = setInterval(() => {
      const now = new Date();
      setLastCheck(now.toLocaleTimeString());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleTourComplete = () => {
    setTourActive(false);
    setTourStep(0);
  };

  const handleTourStepChange = (step: number) => {
    setTourStep(step);
  };

  const handleTourAction = (action: string) => {
    if (action === "threatMitigated") {
      // Tour step 3 action
      setTimeout(() => {
        setTourStep(4);
      }, 1000);
    }
  };

  const handleStateChange = (state: any) => {
    setNetworkState(state);
  };

  const handleCameraAngle = (angle: "top" | "front" | "isometric" | "reset") => {
    // Will be handled by Network3DInteractive
    console.log("Camera angle:", angle);
  };

  const handleToggleGroup = (group: string) => {
    setVisibleGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) {
        next.delete(group);
        if (next.size === 0) next.add("All");
      } else {
        next.delete("All");
        next.add(group);
      }
      return next;
    });
  };

  const toggleMobileControls = () => {
    setShowMobileControls(!showMobileControls);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-slate-900/50 to-slate-900" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 to-blue-500/5 rounded-full blur-3xl" />
      </div>

      {/* Hero Section */}
      <section className="h-[80vh] flex flex-col lg:flex-row relative z-10">
        {/* Left: 3D Canvas (65%) */}
        <div className="lg:w-[65%] h-full relative">
          <Network3DInteractive
            className="h-full"
            tourMode={tourActive}
            tourStep={tourStep}
            onTourAction={handleTourAction}
            onStateChange={handleStateChange}
            onCameraAngle={handleCameraAngle}
            onToggleGroup={handleToggleGroup}
          />
          {!tourActive && (
            <button
              onClick={() => setTourActive(true)}
              className="absolute top-4 right-4 bg-primary/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Tour
            </button>
          )}
        </div>

        {/* Right: Interactive Sidebar (35%) */}
        <div className="lg:w-[35%] h-full bg-slate-800/30 backdrop-blur-sm border-l border-slate-700 p-6 overflow-y-auto">
          <div className="max-w-md mx-auto space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                See Your Network Like We Do
              </h1>
              <p className="text-slate-300 text-sm">
                Experience proactive IT monitoring that detects threats, optimizes performance, and keeps your business running.
              </p>
            </div>

            {/* Tour Guide */}
            {tourActive && (
              <TourGuide
                onComplete={handleTourComplete}
                onStepChange={handleTourStepChange}
              />
            )}

            {/* Context Panel */}
            {!tourActive && (
              <ContextPanel
                optimized={networkState.optimized}
                threatMode={networkState.threatMode}
                devicesOnline={networkState.devicesOnline}
                totalDevices={13}
                threatsDetected={networkState.threatsDetected}
                lastCheck={lastCheck}
              />
            )}

            {/* Value Proposition */}
            {!tourActive && (
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700 p-5">
                <h3 className="text-sm font-semibold text-white mb-4">Why This Matters</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Shield className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>We see problems before you do</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Activity className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>24/7 automated monitoring</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Zap className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Instant threat detection</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm text-slate-300">
                    <Lock className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span>Proactive maintenance</span>
                  </li>
                </ul>
              </div>
            )}

            {/* CTAs */}
            <div className="space-y-3">
              <Button size="lg" href="/get-help" className="w-full gap-2">
                Schedule Free Assessment <ArrowRight className="h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" href="/services" className="w-full gap-2 border-slate-600 text-white hover:bg-slate-800">
                Explore Services <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            What This Visualization Shows
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gradient-to-br from-red-500/10 to-slate-800/50 rounded-lg p-6 border border-red-500/30 hover:border-red-500/50 transition-all">
              <div className="w-16 h-16 bg-red-500/20 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-red-500/10 animate-pulse" />
                <svg className="relative w-8 h-8 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="M9 12l2 2 4-4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Threat Detection</h3>
              <p className="text-slate-400 text-sm">
                Real-time monitoring that identifies and alerts you to security threats before they impact your business.
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-500/10 to-slate-800/50 rounded-lg p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all">
              <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/10 animate-pulse" />
                <svg className="relative w-8 h-8 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                  <path d="M2 12h4" />
                  <path d="M18 12h4" />
                  <path d="M12 2v4" />
                  <path d="M12 18v4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">24/7 Monitoring</h3>
              <p className="text-slate-400 text-sm">
                Continuous surveillance of all devices, connections, and network performance around the clock.
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-slate-800/50 rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all">
              <div className="w-16 h-16 bg-yellow-500/20 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-yellow-500/10 animate-pulse" />
                <svg className="relative w-8 h-8 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Proactive Response</h3>
              <p className="text-slate-400 text-sm">
                We detect and resolve issues before they become problems, minimizing downtime and disruption.
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-slate-800/50 rounded-lg p-6 border border-green-500/30 hover:border-green-500/50 transition-all">
              <div className="w-16 h-16 bg-green-500/20 rounded-xl flex items-center justify-center mb-4 relative overflow-hidden">
                <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
                <svg className="relative w-8 h-8 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Device Security</h3>
              <p className="text-slate-400 text-sm">
                Every device in your network is monitored, updated, and secured to protect your data and operations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Questions About Network Monitoring
          </h2>
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-500/10 to-slate-800/50 rounded-lg p-6 border border-blue-500/30 hover:border-blue-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What does 24/7 monitoring actually mean?</h3>
                  <p className="text-slate-400 text-sm">
                    Our systems continuously check your network health, device status, and security posture every few minutes. We detect issues instantly and can respond before they impact your operations.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-red-500/10 to-slate-800/50 rounded-lg p-6 border border-red-500/30 hover:border-red-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="M9 12l2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">How do you detect threats?</h3>
                  <p className="text-slate-400 text-sm">
                    We use automated security monitoring that analyzes network traffic, device behavior, and connection patterns. Suspicious activity triggers immediate alerts and can be automatically mitigated.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500/10 to-slate-800/50 rounded-lg p-6 border border-green-500/30 hover:border-green-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Will this slow down my network?</h3>
                  <p className="text-slate-400 text-sm">
                    No. Our monitoring uses minimal bandwidth and resources. In fact, by optimizing your network and identifying bottlenecks, we often improve performance.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-yellow-500/10 to-slate-800/50 rounded-lg p-6 border border-yellow-500/30 hover:border-yellow-500/50 transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-yellow-500/20 rounded-lg flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                    <path d="M22 4L12 14.01l-3-3" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">What happens if a threat is detected?</h3>
                  <p className="text-slate-400 text-sm">
                    You receive an immediate alert, and our team can take action to isolate the threat, protect your data, and restore normal operations. We can also automatically block known threats.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto bg-gradient-to-r from-primary/20 to-primary/10 rounded-2xl p-8 md:p-12 border border-primary/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your IT Management?
          </h2>
          <p className="text-slate-300 mb-8">
            Get a free network assessment and see how proactive monitoring can protect your business.
          </p>
          <Button size="lg" href="/get-help" className="gap-2">
            Schedule Free Assessment <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </section>

      {/* Mobile Controls Toggle Button */}
      <button
        onClick={toggleMobileControls}
        className="lg:hidden fixed bottom-4 right-4 z-50 bg-primary text-white p-4 rounded-full shadow-lg"
        aria-label="Toggle controls"
      >
        {showMobileControls ? <X className="h-6 w-6" /> : <Play className="h-6 w-6" />}
      </button>

      {/* Mobile Controls */}
      {showMobileControls && (
        <MobileControls
          onCameraAngle={handleCameraAngle}
          onToggleGroup={handleToggleGroup}
          visibleGroups={visibleGroups}
          onClose={() => setShowMobileControls(false)}
        />
      )}
    </div>
  );
}
