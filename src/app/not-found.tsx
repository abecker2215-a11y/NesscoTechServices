import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui";
import { FuseSearch } from "@/components/search/FuseSearch";
import { siteConfig } from "@/lib/config";
import { Phone, Search, Home, FileText, HelpCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Page Not Found",
  description: "The page you're looking for doesn&apos;t exist. Search our services and guides, or contact us for help.",
};

const helpfulLinks = [
  { href: "/services", label: "Browse Services", icon: FileText },
  { href: "/guides", label: "View Guides", icon: HelpCircle },
  { href: "/get-help", label: "Get Help", icon: Search },
  { href: "/", label: "Back to Home", icon: Home },
];

export default function NotFound() {
  const telHref = `tel:${siteConfig.phone.replace(/\D/g, "")}`;

  return (
    <section className="py-24 lg:py-32 min-h-screen flex items-center" aria-labelledby="notfound-heading">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full" aria-hidden="true" />
            <p className="relative text-8xl font-bold text-primary animate-fade-in">404</p>
          </div>
          
          <h1 id="notfound-heading" className="mb-4 text-4xl lg:text-5xl font-bold text-foreground animate-fade-in-up">
            That page went missing
          </h1>
          <p className="mb-8 text-lg text-muted-foreground animate-fade-in-up-delayed">
            It may have moved or never existed. But don&apos;t worry — we can help you find what you need.
          </p>

          <div className="mb-8 animate-fade-in-up">
            <FuseSearch placeholder="Search for services, guides, or pages..." className="max-w-lg mx-auto" />
          </div>

          <div className="mb-8 grid grid-cols-2 gap-4 animate-fade-in-up">
            {helpfulLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-3 p-4 rounded-lg border border-border bg-background hover:border-primary/50 hover:bg-muted/50 transition-colors"
              >
                <link.icon className="h-5 w-5 text-primary" aria-hidden="true" />
                <span className="font-medium text-foreground">{link.label}</span>
              </Link>
            ))}
          </div>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in-up">
            <Button size="lg" href="/get-help">
              Start a service request
            </Button>
            <Button size="lg" variant="outline" href={telHref}>
              <Phone className="h-4 w-4 mr-2" aria-hidden="true" />
              {siteConfig.phone}
            </Button>
          </div>

          <p className="mt-12 text-sm text-muted-foreground">
            Still can&apos;t find what you need?{" "}
            <Link href="/contact" className="font-medium text-primary hover:underline">
              Contact us directly →
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

