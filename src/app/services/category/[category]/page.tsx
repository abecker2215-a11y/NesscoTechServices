import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Briefcase,
  Shield,
  Cloud,
  Cable,
  Headset,
  HardDrive,
  LayoutDashboard,
  Mail,
} from "lucide-react";
import { services, getService, getServiceHelpCategory } from "@/lib/services";
import { ServiceCard } from "@/components/services/ServiceCard";
import { ServiceFAQ } from "@/components/services/ServiceFAQ";
import { CategoryPillarContent } from "@/components/services/CategoryPillarContent";
import { BookingEmbed } from "@/components/booking/BookingEmbed";
import { Button, Badge } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, faqPageSchema, serviceListSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "managed-it-services": Briefcase,
  "it-security": Shield,
  "cloud-solutions": Cloud,
  "network-server": Cable,
  "it-support": Headset,
  "backup-disaster-recovery": HardDrive,
  applications: LayoutDashboard,
  communications: Mail,
};

const categoryIds = Object.keys(categoryIcons);

function getCategoryChildren(id: string) {
  return services.filter((s) => s.slug.startsWith(`${id}/`));
}

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
  return categoryIds.map((category) => ({ category }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const parent = getService(category);
  if (!parent) return { title: "Category Not Found" };

  const url = `https://nesscotech.com/services/category/${category}`;
  return {
    title: pageTitle(`${parent.title} in Tampa Bay`),
    description: metaDescription(`${parent.shortDescription} Overview of all ${parent.title.toLowerCase()} services for Tampa Bay businesses.`),
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle(`${parent.title} in Tampa Bay`),
      description: metaDescription(`${parent.shortDescription} Overview of all ${parent.title.toLowerCase()} services for Tampa Bay businesses.`),
      url,
      type: "website",
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const parent = getService(category);
  if (!parent) notFound();

  const Icon = categoryIcons[category] ?? LayoutDashboard;
  const items = getCategoryChildren(category);
  const siblings = categoryIds
    .filter((id) => id !== category)
    .map((id) => getService(id))
    .filter((s): s is NonNullable<typeof s> => Boolean(s));
  const helpCategory = getServiceHelpCategory(category);

  return (
    <>
      <JsonLd data={breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: parent.title, path: `/services/category/${category}` },
      ])} />
      {items.length > 0 && <JsonLd data={serviceListSchema(items)} />}
      <JsonLd data={faqPageSchema(parent.faqs)} />

      <nav aria-label="Breadcrumb" className="border-b border-border">
        <div className="container py-4">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <li>
              <Link href="/" className="hover:text-foreground">Home</Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li>
              <Link href="/services" className="hover:text-foreground">Services</Link>
            </li>
            <li aria-hidden="true"><ChevronRight className="h-4 w-4" /></li>
            <li className="font-medium text-foreground" aria-current="page">{parent.title}</li>
          </ol>
        </div>
      </nav>

      <section className="py-16 lg:py-24" aria-labelledby="category-title">
        <div className="container">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10 text-primary">
                <Icon className="h-8 w-8" aria-hidden="true" />
              </div>
              <Badge variant="primary">Service Category</Badge>
            </div>
            <h1 id="category-title" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-4">
              {parent.title} Services
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{parent.problem}</p>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              {parent.remoteAvailable && (
                <Badge variant="outline" className="gap-1.5">Remote: Starting at ${parent.pricing.remote}/hr</Badge>
              )}
              {parent.onsiteAvailable && (
                <Badge variant="outline" className="gap-1.5">On-Site: Starting at ${parent.pricing.onsite}/hr</Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button size="lg" href={`/get-help?category=${helpCategory}`}>
                Get Help with {parent.title}
              </Button>
              <Button size="lg" variant="outline" href="/services">
                View All Services
              </Button>
            </div>
          </div>
        </div>
      </section>

      {items.length > 0 && (
        <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="category-services-heading">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="category-services-heading" className="text-3xl font-bold text-foreground mb-4">
                {parent.title} Services
              </h2>
              <p className="text-muted-foreground">
                Explore the specific services in this area — each with its own details, pricing, and FAQs.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map((service) => (
                <ServiceCard key={service.slug} service={service} variant="grid" />
              ))}
            </div>
          </div>
        </section>
      )}

      {items.length > 0 && <CategoryPillarContent parent={parent} items={items} />}

      <ServiceFAQ faqs={parent.faqs} title={`Frequently Asked Questions About ${parent.title}`} />

      <section className="py-16 lg:py-24 bg-muted/30" aria-labelledby="other-categories-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 id="other-categories-heading" className="text-3xl font-bold text-foreground mb-4">
              Explore Other Service Areas
            </h2>
            <p className="text-muted-foreground">
              We cover every layer of business IT. Browse another category to see what else we handle.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {siblings.map((sib) => {
              const SibIcon = categoryIcons[sib.slug] ?? LayoutDashboard;
              return (
                <Link
                  key={sib.slug}
                  href={`/services/category/${sib.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex-shrink-0 p-3 rounded-lg bg-primary/10 text-primary">
                    <SibIcon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-foreground">{sib.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{sib.shortDescription}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary" aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24 bg-muted/30" aria-label="Schedule a call">
        <div className="container">
          <BookingEmbed
            title={`Book a 15-minute ${parent.title} intro call`}
            description="Pick a time that works — no back-and-forth emails. For urgent issues, call instead."
          />
        </div>
      </section>

      <section className="py-16 lg:py-24" aria-labelledby="category-cta-heading">
        <div className="container">
          <div className="max-w-2xl mx-auto text-center">
            <h2 id="category-cta-heading" className="text-3xl font-bold text-foreground mb-4">
              Ready to Get Started with {parent.title}?
            </h2>
            <p className="text-muted-foreground mb-8">
              Start a service request in under 2 minutes. We&apos;ll contact you within 2 business hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button size="lg" href={`/get-help?category=${helpCategory}`}>
                Get Help Now
              </Button>
              <Button size="lg" variant="outline" href="/contact">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
