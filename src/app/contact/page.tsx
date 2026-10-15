import { Metadata } from "next";
import { Suspense } from "react";
import ContactFormClient from "./ContactFormClient";
import { BookingEmbed } from "@/components/booking/BookingEmbed";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema } from "@/lib/schemas";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Nessco Tech Services for IT support in Tampa Bay. Email: info@nesscotech.com. Mon-Fri 8am-6pm.",
};

function ContactFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="grid gap-6 sm:grid-cols-2">
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
        <div className="h-10 bg-muted rounded" />
      </div>
      <div className="h-32 bg-muted rounded" />
      <div className="h-10 bg-muted rounded w-1/4" />
    </div>
  );
}

const contactFaqs = [
  { q: "How fast do you respond?", a: "We reply to all inquiries within 2 business hours. Emergency after-hours support is available for managed IT clients." },
  { q: "Do you charge for estimates?", a: "No. Estimates for hourly work are free. You approve the scope before we start. Monthly plans include a free consultation." },
  { q: "What areas do you serve?", a: "We serve all of Tampa Bay including Tampa, St. Petersburg, Clearwater, Brandon, Riverview, Lakeland, and surrounding areas. Remote support is available anywhere." },
  { q: "Can I schedule an on-site visit?", a: "Yes. On-site visits are $125/hr and can be scheduled at your convenience, typically within 2-3 business days." },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Contact Us", path: "/contact" }])} />
      <JsonLd data={faqPageSchema(contactFaqs)} />
      <section className="py-16 lg:py-24" aria-labelledby="contact-heading">
      <div className="container">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 id="contact-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              Contact Us
            </h1>
            <p className="text-lg text-muted-foreground">
              Have a question? Need a quote? Fill out the form and we&apos;ll get back to you within 2 business hours.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start gap-4 p-6 rounded-lg border border-border bg-background">
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Business Hours</h3>
                  <p className="text-muted-foreground">Mon–Fri 8am–6pm</p>
                  <p className="text-sm text-muted-foreground mt-1">Emergency after-hours for managed clients</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-lg border border-border bg-background">
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Email Us</h3>
                  <a href="mailto:info@nesscotech.com" className="text-muted-foreground hover:text-foreground transition-colors">
                    info@nesscotech.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">Replies within 2 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-lg border border-border bg-background">
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Service Area</h3>
                  <p className="text-muted-foreground">Tampa Bay Area, FL</p>
                  <p className="text-sm text-muted-foreground mt-1">Remote support available anywhere</p>
                </div>
              </div>

              <div className="flex items-start gap-4 p-6 rounded-lg border border-border bg-background">
                <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">Business Hours</h3>
                  <p className="text-muted-foreground">Mon–Fri 8am–6pm</p>
                  <p className="text-sm text-muted-foreground mt-1">Emergency after-hours for managed clients</p>
                </div>
              </div>
            </div>

            <div>
              <Suspense fallback={<ContactFormSkeleton />}>
                <ContactFormClient />
              </Suspense>
            </div>
          </div>

          <div className="mt-16">
            <BookingEmbed />
          </div>
        </div>
      </div>
    </section>
    </>
  );
}