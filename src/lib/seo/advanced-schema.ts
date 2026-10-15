export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Nessco Tech Services",
  url: "https://nesscotech.com",
  logo: "https://nesscotech.com/icon-192.png",
  description: "Managed IT services, cybersecurity, cloud solutions, network & server support, and backup/disaster recovery for Tampa Bay businesses.",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tampa Bay Area",
    addressRegion: "FL",
    addressCountry: "US",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+1-813-900-2387",
    contactType: "sales",
    email: "info@nesscotech.com",
    areaServed: [
      "Tampa",
      "St. Petersburg",
      "Clearwater",
      "Brandon",
      "Riverview",
      "Lakeland",
    ],
    availableLanguage: ["English"],
  },
  sameAs: [
    "https://www.facebook.com/nesscotech",
    "https://www.linkedin.com/company/nesscotech",
    "https://twitter.com/nesscotech",
  ],
};

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Nessco Tech Services",
  image: "https://nesscotech.com/icon-192.png",
  priceRange: "$$",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tampa Bay Area",
    addressRegion: "FL",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 27.9506,
    longitude: -82.4572,
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "18:00",
    },
  ],
  telephone: "+1-813-900-2387",
  email: "info@nesscotech.com",
};

export const serviceSchema = (serviceName: string, description: string) => ({
  "@context": "https://schema.org",
  "@type": "Service",
  name: serviceName,
  description: description,
  provider: {
    "@type": "Organization",
    name: "Nessco Tech Services",
    url: "https://nesscotech.com",
  },
  areaServed: {
    "@type": "GeoCircle",
    geoMidpoint: {
      "@type": "GeoCoordinates",
      latitude: 27.9506,
      longitude: -82.4572,
    },
    geoRadius: "100000",
  },
});

export const articleSchema = (title: string, description: string, url: string, publishedDate: string) => ({
  "@context": "https://schema.org",
  "@type": "Article",
  headline: title,
  description: description,
  url: url,
  datePublished: publishedDate,
  dateModified: publishedDate,
  author: {
    "@type": "Organization",
    name: "Nessco Tech Services",
    url: "https://nesscotech.com",
  },
  publisher: {
    "@type": "Organization",
    name: "Nessco Tech Services",
    url: "https://nesscotech.com",
    logo: {
      "@type": "ImageObject",
      url: "https://nesscotech.com/icon-192.png",
    },
  },
});

export const FAQSchema = (faqs: Array<{ q: string; a: string }>) => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((faq) => ({
    "@type": "Question",
    name: faq.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.a,
    },
  })),
});

export const breadcrumbSchema = (items: Array<{ name: string; path: string }>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: `https://nesscotech.com${item.path}`,
  })),
});

export const productSchema = (name: string, description: string, price: string) => ({
  "@context": "https://schema.org",
  "@type": "Product",
  name: name,
  description: description,
  offers: {
    "@type": "Offer",
    price: price,
    priceCurrency: "USD",
    availability: "https://schema.org/InStock",
    seller: {
      "@type": "Organization",
      name: "Nessco Tech Services",
    },
  },
});
