import { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { locations } from "@/lib/locations";
import { businessStats } from "@/lib/testimonials";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema, organizationSchema } from "@/lib/schemas";
import { pageTitle, metaDescription } from "@/lib/meta";
import {
  Monitor,
  Shield,
  Truck,
  Users,
  Target,
  Zap,
  BadgeCheck,
  MapPin,
} from "lucide-react";

export const metadata: Metadata = {
  title: pageTitle("About Us"),
  description: metaDescription(
    "Nessco Tech Services provides secure, managed, reliable IT support for Tampa Bay businesses — managed IT, cybersecurity, cloud, network, and backup services.",
  ),
  alternates: { canonical: "/about" },
  openGraph: {
    title: pageTitle("About Us"),
    description: metaDescription(
      "Nessco Tech Services provides secure, managed, reliable IT support for Tampa Bay businesses — managed IT, cybersecurity, cloud, network, and backup services.",
    ),
    url: "https://nesscotech.com/about",
  },
};

const services = [
  {
    image: "/images/Em4E7v_p2ssUBEL.jpg",
    title: "Managed IT Services (MSP)",
    description:
      "Proactive management of business technology, including 24/7 monitoring, maintenance, patch management, helpdesk support, IT administration, vendor management, and strategic technology planning.",
  },
  {
    image: "/images/F9fcFk-VN187X.jpg",
    title: "Cybersecurity and IT Security",
    description:
      "Business security assessments, endpoint protection, email security, firewall management, vulnerability assessments, malware prevention, ransomware protection, security monitoring, and compliance-related technical controls.",
  },
  {
    image: "/images/WNglxIqd4PZBoI4.jpg",
    title: "Cloud Computing and Migration",
    description:
      "Microsoft 365, Google Workspace, Microsoft Azure, Amazon AWS, cloud migrations, business email, hosted applications, cloud storage, virtualization, and remote-work infrastructure.",
  },
  {
    image: "/images/Qxgg4ztr8ib8qb2ct.jpg",
    title: "Network and Server Infrastructure",
    description:
      "Business network design, installation, configuration, structured cabling, CAT6 and fiber, enterprise wireless networks, Wi-Fi optimization, routers, switches, firewalls, Windows and Linux servers, virtualization, and infrastructure upgrades.",
  },
  {
    image: "/images/9aP-sP2Ip5kUQopWsls.jpg",
    title: "IT Support and Helpdesk",
    description:
      "Remote and on-site troubleshooting, workstation support, computer repair, hardware installation, software configuration, printer support, email troubleshooting, operating system support, and employee technical assistance.",
  },
  {
    image: "/images/cAZK4rsONbncHw.jpg",
    title: "Backup and Disaster Recovery",
    description:
      "Automated backups, encrypted off-site storage, data recovery, business continuity planning, disaster recovery strategies, high availability, and recovery testing.",
  },
  {
    image: "/images/XpIX5nrxT7yNAcd.jpg",
    title: "Business Applications and Software",
    description:
      "Business application hosting, software migrations, Microsoft 365 administration, QuickBooks and ERP hosting, remote desktop solutions, application integration, and workflow optimization.",
  },
  {
    image: "/images/PB06kpNBwjQ7rjF.jpg",
    title: "Business Communications",
    description:
      "VoIP phone systems, cloud PBX, business email, Microsoft Teams, video conferencing, messaging, collaboration platforms, and unified communications.",
  },
];

const values = [
  {
    icon: Target,
    title: "Experience over salesmanship",
    description:
      "Customers receive knowledgeable technical assistance and practical recommendations rather than pressure to purchase unnecessary products or services.",
  },
  {
    icon: Zap,
    title: "Prevention over reaction",
    description:
      "Monitoring, maintenance, security, and backup strategies help identify problems before they become expensive business interruptions.",
  },
  {
    icon: Shield,
    title: "Security as a foundation",
    description:
      "Cybersecurity is part of everyday IT management, not something businesses consider only after an attack.",
  },
  {
    icon: Users,
    title: "Plain-English communication",
    description:
      "Business owners should not need to understand complicated technical terminology to make good technology decisions.",
  },
  {
    icon: Monitor,
    title: "Personalized support",
    description:
      "Every business has different infrastructure, budgets, security requirements, and operational needs. Solutions reflect those differences.",
  },
  {
    icon: Truck,
    title: "Accountability and transparency",
    description:
      "Customers understand what is being done, why it is necessary, and what it costs before work begins.",
  },
];

const expertise = [
  "Microsoft Windows environments and administration",
  "Microsoft 365 and Exchange technologies",
  "Active Directory and identity management",
  "Windows and Linux server administration",
  "Business networking and infrastructure",
  "Email systems and enterprise communications",
  "Cloud computing and infrastructure migrations",
  "AWS and Azure environments",
  "Virtualization and server consolidation",
  "Cybersecurity and endpoint protection",
  "Backup and disaster recovery",
  "IT consulting and infrastructure modernization",
];

const customers = [
  "Small businesses and professional offices",
  "Law firms and accounting firms",
  "Construction and roofing companies",
  "Medical and healthcare-related offices",
  "Real estate and property management companies",
  "Retail stores and restaurants",
  "Manufacturing and distribution businesses",
  "Companies with remote or hybrid employees",
  "Organizations needing better cybersecurity and network infrastructure",
  "Businesses preparing for growth, expansion, or technology modernization",
];

const team = [
  {
    initials: "NT",
    name: "Owner / Lead Technician",
    role: "25+ years IT experience",
    certs: ["CompTIA A+", "Network+", "Security+", "Microsoft 365 Certified"],
    bio:
      "Built on approximately 25 years of hands-on IT experience across the evolution of business computing, from traditional desktop and server environments to modern cloud infrastructure. Specializes in network infrastructure, cloud migrations, and cybersecurity for small businesses.",
    photoUrl: undefined as string | undefined,
    specialties: ["Network Design", "Cloud Migration", "Cybersecurity", "Microsoft 365"],
    quote: "Technology should work for you, not against you.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "About Us", path: "/about" }])} />
      <JsonLd data={organizationSchema()} />
      <section className="py-20 lg:py-32" aria-labelledby="about-heading">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 id="about-heading" className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              About Nessco Tech Services
            </h1>
            <p className="text-lg text-muted-foreground">
              Nessco Tech Services is a Tampa Bay–area information technology services provider specializing in
              managed IT services, business technology support, network infrastructure, cybersecurity, cloud
              solutions, and technology consulting for small and medium-sized businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Approach</h2>
              <p className="text-muted-foreground text-lg mb-4">
                Built on approximately 25 years of hands-on IT experience, Nessco Tech Services helps businesses
                simplify technology, protect critical systems, minimize downtime, improve productivity, and maintain
                reliable IT environments without the expense and complexity of managing a full internal IT department.
              </p>
              <p className="text-muted-foreground mb-6">
                The company&apos;s approach combines experienced technical support, proactive system management, practical
                cybersecurity, and personalized customer service. Rather than simply responding when something breaks,
                Nessco focuses on preventing problems, identifying vulnerabilities, maintaining systems, and helping
                businesses make smarter technology decisions.
              </p>
              <p className="text-muted-foreground">
                Serving businesses throughout the Tampa Bay region, Nessco Tech Services aims to be more than an IT
                repair company. It is a technology partner businesses can depend on for day-to-day support, long-term
                infrastructure planning, security, and continued growth.
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
              </div>
            </div>
          </div>

          <section className="mb-16" aria-labelledby="description-heading">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 id="description-heading" className="text-3xl font-bold text-foreground mb-4">
                About the Company
              </h2>
              <p className="text-muted-foreground text-lg">
                Nessco Tech Services is a Tampa Bay–area information technology services provider specializing in
                managed IT services, business technology support, network infrastructure, cybersecurity, cloud
                solutions, and technology consulting for small and medium-sized businesses. Built on approximately
                25 years of hands-on IT experience, Nessco helps businesses simplify technology, protect critical
                systems, minimize downtime, improve productivity, and maintain reliable IT environments without the
                expense and complexity of managing a full internal IT department.
              </p>
            </div>
          </section>

          <section className="mb-16" aria-labelledby="services-heading">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="services-heading" className="text-3xl font-bold text-foreground mb-4">
                Core Services and Capabilities
              </h2>
              <p className="text-muted-foreground">
                Nessco Tech Services offers a comprehensive range of technology services designed to support
                businesses throughout their entire IT lifecycle.
              </p>
            </div>
            <div className="flex flex-col gap-6 max-w-6xl mx-auto">
              {services.map((service) => (
                <article
                  key={service.title}
                  className="flex flex-row gap-4 items-center rounded-xl border border-border bg-background p-6 hover:border-primary/50 transition-colors"
                >
                  <div className="shrink-0 h-64 w-64 aspect-square rounded-xl overflow-hidden border border-border bg-muted">
                      <img
                      src={service.image}
                      alt={service.title}
                      width={256}
                      height={256}
                      loading="lazy"
                      className="h-64 w-64 object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground mb-2">{service.title}</h3>
                    <p className="text-base text-muted-foreground leading-relaxed">{service.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-20 bg-muted/30 py-20" aria-labelledby="customers-heading">
            <div className="container">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <h2 id="customers-heading" className="text-3xl font-bold text-foreground mb-4">
                  Who Nessco Serves
                </h2>
                <p className="text-muted-foreground">
                  Nessco is positioned to serve a wide range of customers, with a particular focus on small and
                  medium-sized businesses that need professional IT expertise without maintaining an expensive
                  in-house IT department.
                </p>
              </div>
              <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto" role="list">
                {customers.map((customer) => (
                  <li key={customer} className="flex items-center gap-3 text-base text-muted-foreground">
                    <span className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      •
                    </span>
                    {customer}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="pt-20 mb-16" aria-labelledby="values-heading">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <h2 id="values-heading" className="text-3xl font-bold text-foreground mb-4">
                What Makes Nessco Different
              </h2>
              <p className="text-muted-foreground">
                Nessco&apos;s business philosophy is built around several important principles.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {values.map((value, index) => (
                <article key={index} className="p-6 rounded-lg border border-border bg-background">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <value.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2 text-center">{value.title}</h3>
                  <p className="text-sm text-muted-foreground text-center leading-relaxed">{value.description}</p>
                </article>
              ))}
            </div>
          </section>

          <section className="mb-16" aria-labelledby="expertise-heading">
            <div className="container">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 id="expertise-heading" className="text-3xl font-bold text-foreground mb-6">
                    Technology Expertise
                  </h2>
                  <p className="text-muted-foreground text-lg mb-6">
                    A significant part of Nessco&apos;s value proposition is its breadth of IT experience. The business
                    draws on approximately 25 years of hands-on experience across the evolution of business computing,
                    from traditional desktop and server environments to modern cloud infrastructure.
                  </p>
                  <p className="text-muted-foreground mb-6">
                    The company&apos;s objective is to combine traditional IT knowledge with modern cloud, automation, and
                    cybersecurity technologies.
                  </p>
                </div>
                <div className="space-y-3">
                  {expertise.map((item, index) => (
                    <div key={index} className="flex items-start gap-3 text-base text-muted-foreground">
                      <span className="flex shrink-0 items-center justify-center w-5 h-5 rounded-full bg-primary/10 text-primary text-[10px] font-bold mt-0.5">
                        +
                      </span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
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
                  Nessco Tech Services is based in the Tampa Bay region of Florida. Remote technical support can also
                  be provided to customers outside the immediate Tampa Bay area.
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
                        width={128}
                        height={128}
                        className="mx-auto mb-4 h-32 w-32 rounded-full object-cover shadow-md"
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
        </div>
      </section>
    </>
  );
}
