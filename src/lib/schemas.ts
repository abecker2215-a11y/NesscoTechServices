import { FAQItem, ServiceDef } from "./types";
import { Location } from "./locations";
import { siteConfig } from "./config";

const siteUrl = `https://${siteConfig.domain}`;

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: siteConfig.name,
    alternateName: "Nessco",
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    sameAs: [
      "https://www.google.com/maps/place/Nessco+Tech+Services",
      "https://www.facebook.com/nesscotechservices",
      "https://www.linkedin.com/company/nessco-tech-services",
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: siteConfig.phone,
      contactType: "customer service",
      availableLanguage: ["English", "Spanish"],
      hoursAvailable: "Mo-Fr 08:00-18:00",
    },
    email: siteConfig.email,
    foundingDate: "2015",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Tampa",
        addressRegion: "FL",
        addressCountry: "US",
      },
    },
    knowsAbout: [
      "IT Support",
      "Computer Repair",
      "Network Installation",
      "Microsoft 365",
      "Cybersecurity",
      "Data Backup",
      "Business IT Consulting",
      "Network Cabling",
      "Surveillance Systems",
    ],
  };
}

export function localBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/#business`,
    name: siteConfig.name,
    alternateName: "Nessco",
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    description: "Professional managed IT, cybersecurity, and cloud services for Tampa Bay businesses. Microsoft 365, networking, security, data backup, and IT support for growing companies.",
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "$75-$150/hr",
    currenciesAccepted: "USD",
    paymentAccepted: "Cash, Credit Card, ACH, Check",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Tampa",
      addressRegion: "FL",
      addressCountry: "US",
      postalCode: "33602",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 27.9506,
      longitude: -82.4572,
    },
    areaServed: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 27.9506,
        longitude: -82.4572,
      },
      geoRadius: "50000",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "08:00",
        closes: "18:00",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: "Saturday",
        opens: "09:00",
        closes: "14:00",
      },
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "IT Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Remote IT Support",
            description: "Secure remote desktop support for software issues",
          },
          price: "75",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "On-Site IT Support",
            description: "On-site hardware repair, network installation, device setup",
          },
          price: "125",
          priceCurrency: "USD",
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Managed IT Services",
            description: "Proactive monitoring, security, backups, and strategy",
          },
          price: "199",
          priceCurrency: "USD",
          priceSpecification: {
            "@type": "UnitPriceSpecification",
            price: "199",
            priceCurrency: "USD",
            billingIncrement: "1",
            unitCode: "MON",
          },
        },
      ],
    },
    knowsAbout: [
      "IT Support",
      "Computer Repair",
      "Network Installation",
      "Microsoft 365",
      "Cybersecurity",
      "Data Backup",
      "Business IT Consulting",
      "Network Cabling",
      "Surveillance Systems",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
    review: [
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "Sarah M.",
        },
        datePublished: "2024-01-15",
        reviewBody: "Fixed my Wi-Fi in 30 mins. Professional and explained everything.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "James R.",
        },
        datePublished: "2024-01-10",
        reviewBody: "Best IT support in Tampa. Honest pricing, no upsells.",
        reviewRating: {
          "@type": "Rating",
          ratingValue: "5",
          bestRating: "5",
        },
      },
    ],
  };
}

export function faqPageSchema(questions: FAQItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((q) => ({
      "@type": "Question",
      name: q.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: q.a,
      },
    })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.path}`,
    })),
  };
}

export function serviceSchema(service: ServiceDef) {
  const rates = [service.pricing.remote, service.pricing.onsite].filter((p) => p > 0);
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${siteUrl}/services/${service.slug}#service`,
    name: `${service.title} | ${siteConfig.name}`,
    serviceType: service.title,
    description: service.shortDescription,
    url: `${siteUrl}/services/${service.slug}`,
    provider: {
      "@id": `${siteUrl}/#business`,
    },
    areaServed: {
      "@type": "City",
      name: "Tampa Bay",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "USD",
      price: Math.min(...rates),
      description: "Starting hourly rate. Flat quotes confirmed before work begins.",
    },
  };
}

export function serviceListSchema(list: ServiceDef[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: list.map((service, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: service.title,
      url: `${siteUrl}/services/${service.slug}`,
    })),
  };
}

export function cityBusinessSchema(location: Location) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${siteUrl}/${location.slug}#business`,
    name: `${siteConfig.name} — ${location.name}`,
    url: `${siteUrl}/${location.slug}`,
    description: `IT support in ${location.name}, ${location.county} County. Computers, Wi-Fi, Microsoft 365, security and small-business IT — remote from $75/hr, on-site from $125/hr.`,
    parentOrganization: {
      "@id": `${siteUrl}/#business`,
    },
    telephone: siteConfig.phone,
    email: siteConfig.email,
    priceRange: "$$",
    address: {
      "@type": "PostalAddress",
      addressLocality: location.name,
      addressRegion: "FL",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: location.geo.lat,
      longitude: location.geo.lon,
    },
    areaServed: [
      {
        "@type": "City",
        name: location.name,
      },
      {
        "@type": "AdministrativeArea",
        name: `${location.county} County, FL`,
      },
    ],
  };
}

export function definitionSchema({
  term,
  definition,
  category,
  url,
  relatedTerms = [],
}: {
  term: string;
  definition: string;
  category: string;
  url: string;
  relatedTerms?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "DefinedTerm",
    "@id": `${siteUrl}${url}#term`,
    name: term,
    description: definition,
    inDefinedTermSet: {
      "@type": "DefinedTermSet",
      name: "IT Glossary",
      url: `${siteUrl}/glossary`,
    },
    termCode: term.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    subjectOf: {
      "@type": "WebPage",
      url: `${siteUrl}${url}`,
    },
    ...(category && {
      category: category,
    }),
    ...(relatedTerms.length > 0 && {
      relatedLink: relatedTerms.map((t) => `${siteUrl}/glossary/${t.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`),
    }),
  };
}