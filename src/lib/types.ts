export interface ServiceDef {
  slug: string;
  title: string;
  shortDescription: string;
  icon: string;
  heroImage?: string;
  problem: string;
  whatWeDo: string[];
  whoItsFor: string;
  pricing: {
    remote: number;
    onsite: number;
  };
  remoteAvailable: boolean;
  onsiteAvailable: boolean;
  faqs: FAQItem[];
  relatedServices: string[];
  featured?: boolean;
}

export interface FAQItem {
  q: string;
  a: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  period: "hour" | "month" | "visit";
  features: string[];
  ctaText: string;
  ctaHref: string;
  popular?: boolean;
  type: "remote" | "onsite" | "business";
}

export interface HelpRequestCategory {
  id: string;
  label: string;
  icon: string;
  description?: string;
  questions: HelpQuestion[];
}

export interface HelpQuestion {
  id: string;
  label: string;
  type: "text" | "textarea" | "select" | "radio";
  required: boolean;
  options?: { value: string; label: string }[];
  placeholder?: string;
}

export interface HelpRequestData {
  category: string;
  answers: Record<string, string>;
  photos?: string[];
  photoNames?: string[];
  contact: {
    name: string;
    email: string;
    phone: string;
    preferredContact: "call" | "email" | "text";
    preference: "remote" | "onsite" | "either";
    description: string;
    preferredTime?: string;
  };
}

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: "general" | "sales" | "support" | "other";
  message: string;
  honeypot?: string;
}

export interface NavChild {
  label: string;
  href: string;
  icon?: string;
  description?: string;
  group?: string;
  featured?: boolean;
  ctaLabel?: string;
  bullets?: string[];
}

export interface NavGroup {
  id: string;
  label: string;
  icon?: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
  groups?: NavGroup[];
  hideOnMobile?: boolean;
}

export interface SiteConfig {
  name: string;
  description: string;
  phone: string;
  email: string;
  address: string;
  addressCity?: string;
  addressZip?: string;
  hours: string;
  serviceArea: string[];
  domain: string;
  bookingUrl?: string;
  googleReviewUrl?: string;
}