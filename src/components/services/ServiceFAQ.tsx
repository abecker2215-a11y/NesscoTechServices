import { FAQItem } from "@/lib/types";
import { FAQAccordion } from "@/components/ui";

interface ServiceFAQProps {
  faqs: FAQItem[];
  title?: string;
}

export function ServiceFAQ({ faqs, title }: ServiceFAQProps) {
  return (
    <section className="py-12" aria-labelledby="faq-heading">
      <div className="container">
        <h2 id="faq-heading" className="text-2xl font-bold text-foreground mb-8">
          {title ?? "Frequently Asked Questions"}
        </h2>
        <FAQAccordion items={faqs} className="max-w-3xl" />
      </div>
    </section>
  );
}