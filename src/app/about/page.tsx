import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { locations } from "@/lib/locations";
import { businessStats } from "@/lib/testimonials";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Monitor, Shield, Truck, Users, Target, Zap, BadgeCheck, MapPin } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Nessco Tech Services - local IT support for Tampa Bay businesses. Our mission, values, and approach to honest IT help.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Us",
    description: "Learn about Nessco Tech Services - local IT support for Tampa Bay businesses. Our mission, values, and approach to honest IT help.",
    url: "https://nesscotech.com/about",
  },
};

const values = [
  {
    icon: Target,
    title: "Honest Communication",
    description: "We explain problems in plain English. No jargon, no upsells. You approve the work before we start.",
  },
  {
    icon: Shield,
    title: "Security First",
    description: "Every service includes basic security hygiene. Encrypted connections, data-handling best practices, and proactive protection.",
  },
  {
    icon: Truck,
    title: "Local & Responsive",
    description: "Based in Tampa Bay. We understand local infrastructure and can be on-site when remote isn't enough.",
  },
  {
    icon: Users,
    title: "Small Business Focus",
    description: "We specialize in businesses with 5–100 employees. Microsoft 365, networking, security, backups, and strategy.",
  },
  {
    icon: Zap,
    title: "Fast Turnaround",
    description: "During business hours, we typically respond within 2 hours. Emergency after-hours support for managed clients.",
  },
  {
    icon: Monitor,
    title: "Transparent Pricing",
    description: "Hourly rates published online. Monthly plans with fixed pricing. No hidden fees or surprise charges.",
  },
];

const team = [
  {
    initials: "NT",
    name: "Owner / Lead Technician",
    role: "15+ years IT experience",
    certs: ["CompTIA A+", "Network+", "Security+", "Microsoft 365 Certified"],
    bio: "Founded Nessco Tech Services to bring honest, competent IT support to Tampa Bay businesses. Specializes in network infrastructure, cloud migrations, and cybersecurity for small businesses.",
    photoUrl: undefined as string | undefined,
    specialties: ["Network Design", "Cloud Migration", "Cybersecurity", "Microsoft 365"],
    quote: "Technology should work for you, not against you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }])} />
      <section className="py-20 lg:py-32" aria-labelledby="about-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 id="about-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              About Nessco Tech Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Local IT help without the IT-speak. We fix technology problems for businesses across the Tampa Bay area.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground text-lg mb-4">
                To provide honest, competent IT support that empowers people to use technology confidently — 
                without the jargon, upsells, or frustration that plagues the industry.
              </p>
              <p className="text-muted-foreground mb-6">
                We believe technology should work for you, not against you. When it breaks, you deserve a clear explanation, 
                a fair price, and a lasting fix.
              </p>
              <p className="text-muted-foreground">
                Founded in 2024, Nessco Tech Services serves the Tampa Bay area including Tampa, St. Petersburg, 
                Clearwater, Brandon, Riverview, and Lakeland.
              </p>
            </div>
            <div className="relative overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/15 via-background to-background p-8">
              <div className="hero-grid-bg absolute inset-0" aria-hidden="true" />
              <div className="relative">
                <p className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  Tampa Bay Area, FL — on-site & remote
                </p>
                <dl className="mt-6 grid grid-cols-2 gap-6">
                  {businessStats.map((stat) => (
                    <div key={stat.label}>
                      <dt className="order-2 mt-1 block text-xs text-muted-foreground">{stat.label}</dt>
                      <dd className="order-1 text-xl font-bold tracking-tight text-foreground">{stat.value}</dd>
                    </div>
                  ))}
                </dl>
                {/* TODO: Swap this panel for a real team / van / office photo when available. */}
              </div>
            </div>
          </div>

          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <article key={index} className="p-6 rounded-lg border border-border bg-background">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 text-center">{value.title}</h3>
                  <p className="text-sm text-muted-foreground text-center">{value.description}</p>
                </article>
              ))}
            </div>
          </div>

          <section className="py-16 bg-muted/30" aria-labelledby="team-heading">
            <div className="container">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 id="team-heading" className="text-3xl font-bold text-foreground mb-4">
                  Meet the Team
                </h2>
                <p className="text-muted-foreground">
                  Small team, deep expertise. We&apos;re hands-on with every client.
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                {team.map((member, index) => (
                  <article key={index} className="p-8 rounded-xl border border-border bg-background text-center lift-hover">
                    {member.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={member.photoUrl}
                        alt={member.name}
                        className="mx-auto mb-4 h-28 w-28 rounded-full object-cover shadow-md"
                        loading="lazy"
                      />
                    ) : (
                      <div
                        className="mx-auto mb-4 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-primary to-sky-600 text-3xl font-bold text-primary-foreground shadow-md"
                        role="img"
                        aria-label="Team member photo coming soon"
                      >
                        {member.initials}
                      </div>
                    )}
                    <h3 className="text-xl font-semibold text-foreground mb-1">{member.name}</h3>
                    <p className="text-primary text-sm font-medium mb-3">{member.role}</p>
                    
                    {member.specialties && (
                      <div className="mb-4">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Specialties</p>
                        <ul className="flex flex-wrap justify-center gap-1.5" role="list" aria-label="Specialties">
                          {member.specialties.map((specialty) => (
                            <li
                              key={specialty}
                              className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
                            >
                              {specialty}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <ul className="mb-4 flex flex-wrap justify-center gap-1.5" role="list" aria-label="Certifications">
                      {member.certs.map((cert) => (
                        <li
                          key={cert}
                          className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                        >
                          <BadgeCheck className="h-3 w-3 text-success" aria-hidden="true" />
                          {cert}
                        </li>
                      ))}
                    </ul>
                    <p className="text-muted-foreground mb-4">{member.bio}</p>
                    
                    {member.quote && (
                      <blockquote className="mb-4 p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                        <p className="text-sm italic text-foreground">&ldquo;{member.quote}&rdquo;</p>
                      </blockquote>
                    )}
                    
                    <p className="text-sm">
                      <Link href="/contact" className="font-medium text-primary hover:underline">
                        Work with us →
                      </Link>
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="py-16 lg:py-24" aria-labelledby="service-area-heading">
            <div className="container">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 id="service-area-heading" className="text-3xl font-bold text-foreground mb-4">
                  Service Area
                </h2>
                <p className="text-muted-foreground">
                  We serve the greater Tampa Bay area. Remote support available anywhere.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                {siteConfig.serviceArea.map((city, index) => {
                  const loc = locations.find((l) => l.name === city);
                  const cls = "px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium hover:bg-primary/20 transition-colors";
                  return loc ? (
                    <Link key={index} href={`/${loc.slug}`} className={cls}>
                      {city}
                    </Link>
                  ) : (
                    <span key={index} className={cls}>
                      {city}
                    </span>
                  );
                })}
              </div>
            </div>
          </section>
        </div>
      </section>
    </>
  );
}