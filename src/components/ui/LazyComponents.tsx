"use client";

import React, { lazy } from "react";
import { PageErrorBoundary } from "./ErrorBoundary";
import { CardSkeleton } from "./LazyWrapper";

const ChatWidget = lazy(() => import("@/components/chat/ChatWidget").then((m) => ({ default: m.ChatWidget })));
const EmergencyTriageWidget = lazy(() => import("@/components/emergency/EmergencyTriageWidget").then((m) => ({ default: m.EmergencyTriageWidget })));
const DashboardClient = lazy(() => import("@/components/portal/DashboardClient").then((m) => ({ default: m.DashboardClient })));
const TicketsClient = lazy(() => import("@/components/portal/TicketsClient").then((m) => ({ default: m.TicketsClient })));
const TicketDetailClient = lazy(() => import("@/components/portal/TicketDetailClient").then((m) => ({ default: m.TicketDetailClient })));
const NewTicketClient = lazy(() => import("@/components/portal/NewTicketClient").then((m) => ({ default: m.NewTicketClient })));
const AssetsClient = lazy(() => import("@/components/portal/AssetsClient").then((m) => ({ default: m.AssetsClient })));
const BillingClient = lazy(() => import("@/components/portal/BillingClient").then((m) => ({ default: m.BillingClient })));
const HeroVisual = lazy(() => import("@/components/home/HeroVisual").then((m) => ({ default: m.HeroVisual })));
const HeroQuiz = lazy(() => import("@/components/home/HeroQuiz").then((m) => ({ default: m.HeroQuiz })));
const Testimonials = lazy(() => import("@/components/home/SocialProof").then((m) => ({ default: m.Testimonials })));
const FAQAccordion = lazy(() => import("@/components/ui/FAQAccordion").then((m) => ({ default: m.FAQAccordion })));
const ExitIntentPopup = lazy(() => import("@/components/ui/ExitIntentPopup").then((m) => ({ default: m.ExitIntentPopup })));
const StickyDesktopCTA = lazy(() => import("@/components/layout/StickyDesktopCTA").then((m) => ({ default: m.StickyDesktopCTA })));
const SiteSearch = lazy(() => import("@/components/search/SiteSearch").then((m) => ({ default: m.SiteSearch })));
const CalEmbed = lazy(() => import("@/components/booking/CalEmbed").then((m) => ({ default: m.CalEmbed })));
const CalPopupButton = lazy(() => import("@/components/booking/CalEmbed").then((m) => ({ default: m.CalPopupButton })));
const PhotoUpload = lazy(() => import("@/components/get-help/PhotoUpload").then((m) => ({ default: m.PhotoUpload })));
const ContactForm = lazy(() => import("@/components/get-help/ContactForm").then((m) => ({ default: m.ContactForm })));
const TimeSlotPicker = lazy(() => import("@/components/get-help/TimeSlotPicker").then((m) => ({ default: m.TimeSlotPicker })));

export function LazyChatWidget() {
  return (
    <PageErrorBoundary title="Chat Assistant">
      <div className="fixed bottom-4 right-4 z-40 md:bottom-6 md:right-6">
        <SuspenseWrapper><ChatWidget /></SuspenseWrapper>
      </div>
    </PageErrorBoundary>
  );
}

export function LazyEmergencyTriageWidget(props: { inline?: boolean }) {
  return (
    <PageErrorBoundary title="Emergency Triage">
      <SuspenseWrapper><EmergencyTriageWidget {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyDashboardClient(props: React.ComponentProps<typeof DashboardClient>) {
  return (
    <PageErrorBoundary title="Dashboard">
      <SuspenseWrapper fallback={<CardSkeleton />}><DashboardClient {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyTicketsClient(props: React.ComponentProps<typeof TicketsClient>) {
  return (
    <PageErrorBoundary title="Tickets">
      <SuspenseWrapper fallback={<CardSkeleton />}><TicketsClient {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyTicketDetailClient(props: React.ComponentProps<typeof TicketDetailClient>) {
  return (
    <PageErrorBoundary title="Ticket Details">
      <SuspenseWrapper fallback={<CardSkeleton />}><TicketDetailClient {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyNewTicketClient(props: React.ComponentProps<typeof NewTicketClient>) {
  return (
    <PageErrorBoundary title="New Ticket">
      <SuspenseWrapper fallback={<CardSkeleton />}><NewTicketClient {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyAssetsClient(props: React.ComponentProps<typeof AssetsClient>) {
  return (
    <PageErrorBoundary title="Assets">
      <SuspenseWrapper fallback={<CardSkeleton />}><AssetsClient {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyBillingClient(props: React.ComponentProps<typeof BillingClient>) {
  return (
    <PageErrorBoundary title="Billing">
      <SuspenseWrapper fallback={<CardSkeleton />}><BillingClient {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyHeroVisual() {
  return (
    <PageErrorBoundary title="Hero Visual">
      <SuspenseWrapper><HeroVisual /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyHeroQuiz() {
  return (
    <PageErrorBoundary title="Hero Quiz">
      <SuspenseWrapper><HeroQuiz /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyTestimonials() {
  return (
    <PageErrorBoundary title="Testimonials">
      <SuspenseWrapper><Testimonials /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyFAQAccordion(props: React.ComponentProps<typeof FAQAccordion>) {
  return (
    <PageErrorBoundary title="FAQ">
      <SuspenseWrapper><FAQAccordion {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyExitIntentPopup() {
  return (
    <PageErrorBoundary title="Popup">
      <SuspenseWrapper><ExitIntentPopup /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyStickyDesktopCTA() {
  return (
    <PageErrorBoundary title="CTA">
      <SuspenseWrapper><StickyDesktopCTA /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazySiteSearch() {
  return (
    <PageErrorBoundary title="Search">
      <SuspenseWrapper><SiteSearch /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyCalEmbed(props: React.ComponentProps<typeof CalEmbed>) {
  return (
    <PageErrorBoundary title="Booking">
      <SuspenseWrapper><CalEmbed {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyCalPopupButton(props: React.ComponentProps<typeof CalPopupButton>) {
  return (
    <PageErrorBoundary title="Booking">
      <SuspenseWrapper><CalPopupButton {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyPhotoUpload(props: React.ComponentProps<typeof PhotoUpload>) {
  return (
    <PageErrorBoundary title="Photo Upload">
      <SuspenseWrapper><PhotoUpload {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyContactForm(props: React.ComponentProps<typeof ContactForm>) {
  return (
    <PageErrorBoundary title="Contact Form">
      <SuspenseWrapper><ContactForm {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

export function LazyTimeSlotPicker(props: React.ComponentProps<typeof TimeSlotPicker>) {
  return (
    <PageErrorBoundary title="Time Picker">
      <SuspenseWrapper><TimeSlotPicker {...props} /></SuspenseWrapper>
    </PageErrorBoundary>
  );
}

// Move SuspenseWrapper to top - no import issues now
function SuspenseWrapper({ children, fallback }: { children: React.ReactNode; fallback?: React.ReactNode }) {
  return (
    <React.Suspense fallback={fallback}>
      {children}
    </React.Suspense>
  );
}