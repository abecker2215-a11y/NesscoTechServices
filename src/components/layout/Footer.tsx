import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { locations } from "@/lib/locations";
import { Monitor, MapPin, Mail, Clock } from "lucide-react";
import { CopyrightYear } from "./CopyrightYear";

export function Footer() {

  return (
    <footer className="bg-muted/50 border-t border-border" role="contentinfo">
      <div className="container py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold text-xl text-foreground" aria-label={`${siteConfig.name} - Home`}>
              <Monitor className="h-6 w-6 text-primary" aria-hidden="true" />
              <span>{siteConfig.name}</span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground max-w-xs">
              Local IT help without the IT-speak. Computer, Wi-Fi, Microsoft 365, networking, security and small-business IT support.
            </p>
            <h3 className="mt-6 font-semibold text-foreground text-sm">Service Areas</h3>
            <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1" role="list">
              {locations.map((loc) => (
                <li key={loc.slug}>
                  <Link href={`/${loc.slug}`} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Quick links">
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-3" role="list">
              <li><Link href="/services" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Services</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Pricing</Link></li>
              <li><Link href="/quote" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Get a Quote</Link></li>
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link href="/glossary" className="text-sm text-muted-foreground hover:text-foreground transition-colors">IT Glossary</Link></li>
              <li><Link href="/guides" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Fix-It Guides</Link></li>
              <li><Link href="/fixes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Quick Fixes</Link></li>
              <li><Link href="/compare" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Break-Fix vs Managed</Link></li>
              <li><Link href="/switch" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Switch MSPs (Free Migration)</Link></li>
              <li><Link href="/roi" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Downtime ROI Calculator</Link></li>
              <li><Link href="/storm-ready" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Storm-Ready Check</Link></li>
              <li><Link href="/offers" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Seasonal Offers</Link></li>
              <li><Link href="/reviews" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Reviews</Link></li>
              <li><Link href="/refer" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Refer a Friend ($25)</Link></li>
            </ul>
          </nav>

          <nav aria-label="Services">
            <h3 className="font-semibold text-foreground">Services</h3>
            <ul className="mt-4 space-y-2" role="list">
              <li><Link href="/services/computer-repair" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Computer Repair</Link></li>
              <li><Link href="/services/wifi-networking" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Wi-Fi & Networking</Link></li>
              <li><Link href="/services/microsoft-365" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Microsoft 365</Link></li>
              <li><Link href="/services/cybersecurity" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Security Cleanup</Link></li>
              <li><Link href="/services/data-backup" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Data Backup</Link></li>
              <li><Link href="/services/business-it" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Business IT</Link></li>
              <li><Link href="/services/remote-support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Remote Support</Link></li>
              <li><Link href="/services/network-installation" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Network Installation</Link></li>
              <li><Link href="/services/email" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Email Problems</Link></li>
              <li><Link href="/services/voip-phone-systems" className="text-sm text-muted-foreground hover:text-foreground transition-colors">VoIP & Phone Systems</Link></li>
              <li><Link href="/services/it-consulting" className="text-sm text-muted-foreground hover:text-foreground transition-colors">IT Consulting & vCIO</Link></li>
              <li><Link href="/services/compliance-support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Compliance Support</Link></li>
              <li><Link href="/services/copilot-deployment" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Microsoft Copilot</Link></li>
              <li><Link href="/services/google-workspace" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Google Workspace</Link></li>
            </ul>
          </nav>

          <address className="not-italic" aria-label="Contact information">
            <h3 className="font-semibold text-foreground">Contact</h3>
            <ul className="mt-4 space-y-3" role="list">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{siteConfig.address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <a href="/contact" className="hover:text-foreground transition-colors">{siteConfig.email}</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Clock className="h-4 w-4 flex-shrink-0" aria-hidden="true" />
                <span>{siteConfig.hours}</span>
              </li>
            </ul>
          </address>
        </div>

        <div className="mt-10 border-t border-border pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © <CopyrightYear /> {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/status" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <span className="h-2 w-2 rounded-full bg-success" aria-hidden="true" />
              Status
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}