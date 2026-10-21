import type { Metadata } from "next";
import Link from "next/link";
import { Reveal } from "@/components/ui";
import { JsonLd } from "@/components/layout/JsonLd";
import { ArrowRight, Clock, Tag } from "lucide-react";

export const metadata: Metadata = {
  title: "IT Resources & Blog",
  description: "IT tips, security alerts, and technology guides for Tampa Bay businesses. Plain-English advice from your local IT team.",
  alternates: { canonical: "/blog" },
};

const posts = [
  {
    slug: "signs-you-need-managed-it",
    href: "/services/managed-it-services",
    linkLabel: "See managed IT services",
    title: "7 Signs Your Business Needs Managed IT (And What to Do About It)",
    excerpt: "Frequent downtime, security worries, and IT costs that spiral — here's when to stop DIY-ing and start delegating.",
    category: "Business IT",
    readTime: "5 min read",
    date: "Oct 2026",
  },
  {
    slug: "mfa-small-business",
    href: "/guides/turn-on-mfa-microsoft-365",
    linkLabel: "Turn on MFA in 10 minutes",
    title: "MFA: The 10-Minute Security Upgrade That Stops 99% of Attacks",
    excerpt: "Most breaches start with a stolen password. Here's how to lock down your Microsoft 365 or Google Workspace in minutes.",
    category: "Security",
    readTime: "4 min read",
    date: "Sep 2026",
  },
  {
    slug: "backup-mistakes",
    href: "/guides/backup-checklist-small-business",
    linkLabel: "Monthly backup check guide",
    title: "5 Backup Mistakes That Give Tampa Businesses a False Sense of Security",
    excerpt: "You have backups — but would they actually work when you need them? Here's how to test without the panic.",
    category: "Data Protection",
    readTime: "6 min read",
    date: "Sep 2026",
  },
  {
    slug: "hurricane-it-prep",
    href: "/guides/outage-continuity-small-business",
    linkLabel: "Storm continuity guide",
    title: "Hurricane Season IT Prep: A 15-Minute Checklist for Tampa Bay Businesses",
    excerpt: "Storm season is here. Make sure your data, devices, and team are ready for whatever comes.",
    category: "Disaster Prep",
    readTime: "4 min read",
    date: "Aug 2026",
  },
  {
    slug: "microsoft-copilot-guide",
    href: "/services/cloud-solutions/microsoft-365",
    linkLabel: "Microsoft 365 services",
    title: "Microsoft Copilot for Small Business: What It Is, What It Costs, and Whether You Need It",
    excerpt: "Copilot is everywhere — but is it worth $30/user/mo for your team? An honest breakdown.",
    category: "Microsoft 365",
    readTime: "7 min read",
    date: "Aug 2026",
  },
  {
    slug: "phishing-red-flags",
    href: "/guides/spot-stop-phishing-emails",
    linkLabel: "Phishing spotting guide",
    title: "Phishing Emails: 10 Red Flags Your Team Should Know",
    excerpt: "The best phishing training is the one people actually read. Share this with your team.",
    category: "Security",
    readTime: "5 min read",
    date: "Jul 2026",
  },
];

const categories = ["All", "Business IT", "Security", "Data Protection", "Disaster Prep", "Microsoft 365"];

export default function BlogPage() {
  return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "Nessco Tech Services Blog",
        description: "IT tips and security alerts for Tampa Bay businesses",
      }} />

      <section className="py-16 lg:py-24">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground tracking-tight mb-6">
              IT Resources & Blog
            </h1>
            <p className="text-lg text-muted-foreground">
              Plain-English IT advice from your local Tampa Bay team. No jargon, no fluff.
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="flex flex-wrap gap-2 justify-center mb-12" role="list" aria-label="Categories">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  role="listitem"
                  className="rounded-full border border-border px-4 py-2 text-sm font-medium text-muted-foreground hover:border-primary/50 hover:text-foreground transition-colors"
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Reveal key={post.slug}>
                  <article className="group rounded-xl border border-border bg-background p-6 lift-hover h-full flex flex-col">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                      <span className="font-medium text-primary">{post.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{post.date}</span>
                    </div>
                      <h2 className="text-lg font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        <Link href={post.href}>
                          {post.title}
                        </Link>
                      </h2>
                      <p className="text-sm text-muted-foreground flex-1">{post.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          {post.readTime}
                        </span>
                        <Link
                          href={post.href}
                          className="flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          {post.linkLabel}
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </Link>
                      </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
