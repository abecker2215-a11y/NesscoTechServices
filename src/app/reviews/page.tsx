import { Metadata } from "next";
import { ReviewsWall } from "@/components/reviews/ReviewsWall";
import { Button } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { breadcrumbSchema } from "@/lib/schemas";
import { Star } from "lucide-react";
import { pageTitle, metaDescription } from "@/lib/meta";

export const metadata: Metadata = {
  title: pageTitle("Reviews — Tampa Bay Folks Who Got Fixed"),
  description:
    metaDescription("Verified Google reviews and recent jobs from Nessco Tech Services across Tampa Bay. Real problems, exact quotes, no surprises."),
  alternates: { canonical: "/reviews" },
  openGraph: {
    title: pageTitle("Reviews — Tampa Bay Folks Who Got Fixed"),
    description: metaDescription("Verified Google reviews and recent jobs from Nessco Tech Services across Tampa Bay."),
    url: "https://nesscotech.com/reviews",
  },
};

export default function ReviewsPage() {
  return (
    <>
      <JsonLd data={breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Reviews", path: "/reviews" }])} />
      <section className="py-16 lg:py-24" aria-labelledby="reviews-heading">
        <div className="container">
          <div className="mx-auto mb-10 max-w-2xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Star className="h-6 w-6" aria-hidden="true" />
            </div>
            <h1 id="reviews-heading" className="mb-4 text-4xl font-bold tracking-tight text-foreground lg:text-5xl">
              Tampa Bay folks who got fixed
            </h1>
            <h2 className="text-xl font-semibold text-foreground mb-6">Customer Reviews</h2>
            <p className="text-lg text-muted-foreground">
              Real jobs, real local businesses across Tampa Bay. These are actual customer experiences
              with our IT support, cybersecurity, and managed services. Ask us for references — we&apos;re happy to connect you.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Reading reviews is a good first step. The best way to judge an IT partner is to see how
              they handle your actual systems. Start with a free consultation or a quick fix and see
              the difference for yourself.
            </p>
          </div>

          <ReviewsWall />

          <div className="mt-12 text-center">
            <p className="mb-4 text-muted-foreground">Ready to be our next five stars?</p>
            <Button size="lg" href="/get-help">
              Start a service request
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
