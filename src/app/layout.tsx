import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { PageContainer } from "@/components/layout";
import { StructuredData } from "@/components/layout/StructuredData";
import { siteConfig } from "@/lib/config";
import { WebVitals } from "@/components/ui/WebVitals";
import { PWAManager } from "@/components/ui/PWAManager";
import { ConsentBanner } from "@/components/ui/ConsentBanner";
import { ConsentInit } from "@/components/ui/ConsentInit";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "sans-serif"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true,
  fallback: ["system-ui", "monospace"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://nesscotech.com"),
  title: {
    default: "Nessco Tech Services | Managed IT, Cybersecurity & Cloud for Tampa Bay Business",
    template: "%s | Nessco Tech Services",
  },
  description: "Managed IT services, cybersecurity, cloud solutions, network & server support, and backup/disaster recovery for Tampa Bay businesses. Proactive monitoring, 24/7 support, and IT strategy.",
  authors: [{ name: "Nessco Tech Services" }],
  creator: "Nessco Tech Services",
  publisher: "Nessco Tech Services",
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nesscotech.com/",
    siteName: "Nessco Tech Services",
    title: "Nessco Tech Services | Managed IT, Cybersecurity & Cloud for Tampa Bay Business",
    description: "Managed IT, cybersecurity, cloud, network and backup services for Tampa Bay businesses. Proactive monitoring, 24/7 support, and IT strategy.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nessco Tech Services | Managed IT, Cybersecurity & Cloud",
    description: "Managed IT, cybersecurity, cloud, network and backup services for Tampa Bay businesses.",
  },
  
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b1020" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        
        
        
{/* Google Analytics 4 — set NEXT_PUBLIC_GA_ID to enable */}
        {gaId && (
          <>
            <Script
              id="ga4-init"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  
                  // Consent Mode v2 defaults (grant by default for analytics)
                  gtag('consent', 'default', {
                    'ad_storage': 'granted',
                    'analytics_storage': 'granted',
                    'ad_user_data': 'granted',
                    'ad_personalization': 'granted'
                  });
                  
                  gtag('config', '${gaId}');
                `,
              }}
            />
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId.toLowerCase()}`}
              strategy="afterInteractive"
            />
          </>
        )}
        
        {/* Privacy-friendly, cookie-free analytics (see Privacy Policy).
            NEXT_PUBLIC_PLAUSIBLE_DOMAIN overrides the default site domain,
            e.g. for staging. Self-hosted Plausible: point src at your instance. */}
        <Script
          src="https://plausible.io/js/script.js"
          data-domain={process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN || siteConfig.domain}
          strategy="afterInteractive"
        />
        <noscript>
          <style>{`.reveal{opacity:1;transform:none}`}</style>
        </noscript>
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var t=localStorage.getItem("nessco-theme");if(t==="light"){document.documentElement.dataset.theme="light"}else{document.documentElement.dataset.theme="dark"}}catch(e){}`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js').catch(()=>{})}`,
          }}
        />
      </head>
<body className="min-h-full flex flex-col">
      <WebVitals />
        <PWAManager />
        <StructuredData />
        <PageContainer>{children}</PageContainer>
        {/* <ConsentBanner /> */}
        <ConsentInit />
      </body>
    </html>
  );
}