import { siteConfig } from "@/lib/config";
import { localBusinessSchema, organizationSchema } from "@/lib/schemas";

const sitelinksSearchBoxSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  url: `https://${siteConfig.domain}`,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `https://${siteConfig.domain}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

export function StructuredData() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(sitelinksSearchBoxSchema) }}
      />
    </>
  );
}
