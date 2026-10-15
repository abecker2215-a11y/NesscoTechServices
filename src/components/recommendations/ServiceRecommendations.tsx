"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ServiceCard } from "@/components/services";
import { services } from "@/lib/services";
import { Sparkles, ArrowRight } from "lucide-react";

interface ServiceRecommendationsProps {
  answers?: Record<string, string>;
  maxCount?: number;
  className?: string;
}

export function ServiceRecommendations({
  answers = {},
  maxCount = 3,
  className = "",
}: ServiceRecommendationsProps) {
  const recommendedServices = useMemo(() => {
    // If no answers, return popular services
    if (Object.keys(answers).length === 0) {
      return services.slice(0, maxCount);
    }

    // Score each service based on answers
    const scored = services.map((service) => {
      let score = 0;

      // Category matching
      if (answers.category) {
        const categoryMap: Record<string, string[]> = {
          business: ["managed-it-services", "it-support", "network-server"],
          wifi: ["network-server", "it-support"],
          computer: ["it-support", "managed-it-services"],
          email: ["cloud-solutions", "communications"],
          security: ["it-security", "backup-disaster-recovery"],
          other: ["managed-it-services", "it-support"],
        };

        const category = answers.category;
        const matchingSlugs = categoryMap[category] || [];
        if (matchingSlugs.some((slug) => service.slug.startsWith(slug))) {
          score += 5;
        }
      }

      // Priority matching
      if (answers.priority) {
        const priorityMap: Record<string, string[]> = {
          urgent: ["backup-disaster-recovery", "it-security", "it-support"],
          "cost-reduction": ["managed-it-services", "cloud-solutions"],
          growth: ["cloud-solutions", "managed-it-services", "applications"],
          compliance: ["it-security", "backup-disaster-recovery"],
        };

        const matchingSlugs = priorityMap[answers.priority] || [];
        if (matchingSlugs.some((slug) => service.slug.startsWith(slug))) {
          score += 3;
        }
      }

      // Budget matching
      if (answers.budget) {
        if (answers.budget === "hourly" && service.pricing.remote <= 100) {
          score += 2;
        }
        if (answers.budget === "monthly" && service.slug.startsWith("managed-it-services")) {
          score += 2;
        }
      }

      // Featured services get a boost
      if (service.featured) {
        score += 1;
      }

      return { service, score };
    });

    // Sort by score and return top N
    return scored
      .sort((a, b) => b.score - a.score)
      .slice(0, maxCount)
      .map((item) => item.service);
  }, [answers, maxCount]);

  if (recommendedServices.length === 0) {
    return null;
  }

  return (
    <section className={`py-12 lg:py-16 ${className}`} aria-labelledby="recommendations-heading">
      <div className="container">
        <div className="flex items-center gap-2 mb-6">
          <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 id="recommendations-heading" className="text-2xl font-bold text-foreground">
            Recommended for You
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendedServices.map((service) => (
            <ServiceCard key={service.slug} service={service} variant="grid" />
          ))}
        </div>
        <div className="mt-6 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
          >
            View all services
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
