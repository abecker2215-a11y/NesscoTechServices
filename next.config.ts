import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000,
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "www.nesscotech.com" }], destination: "https://nesscotech.com/:path*", permanent: true },
      { source: "/services/computer-repair", destination: "/services/it-support/pc-mac", permanent: true },
      { source: "/services/wifi-networking", destination: "/services/network-server/wireless", permanent: true },
      { source: "/services/network-installation", destination: "/services/network-server/infrastructure", permanent: true },
      { source: "/services/microsoft-365", destination: "/services/cloud-solutions/microsoft-365", permanent: true },
      { source: "/services/email", destination: "/services/communications/business-email", permanent: true },
      { source: "/services/cybersecurity", destination: "/services/it-security", permanent: true },
      { source: "/services/data-backup", destination: "/services/backup-disaster-recovery", permanent: true },
      { source: "/services/business-it", destination: "/services/managed-it-services", permanent: true },
      { source: "/services/remote-support", destination: "/services/it-support", permanent: true },
      { source: "/services/voip-phone-systems", destination: "/services/communications/phone-systems", permanent: true },
      { source: "/services/it-consulting", destination: "/services/managed-it-services/consulting", permanent: true },
      { source: "/services/compliance-support", destination: "/services/it-security/audit-compliance", permanent: true },
      { source: "/services/copilot-deployment", destination: "/services/cloud-solutions/microsoft-365", permanent: true },
      { source: "/services/google-workspace", destination: "/services/cloud-solutions/google-workspace", permanent: true },
      { source: "/guides/lock-down-home-wifi-router", destination: "/guides/lock-down-office-wifi-router", permanent: true },
      { source: "/guides/smart-home-disconnects", destination: "/guides/iot-device-disconnects", permanent: true },
      { source: "/guides/wifi-kids-homework-priority", destination: "/guides/wifi-business-traffic-priority", permanent: true },
      { source: "/guides/snowbird-setup", destination: "/guides/multi-site-business-setup", permanent: true },
      { source: "/guides/kid-safe-tablet-setup", destination: "/guides/employee-device-restrictions", permanent: true },
      { source: "/wheresmyvape/:path*", destination: "http://wheresmyvape-nginx/wheresmyvape/:path*", permanent: true },
      { source: "/blog/signs-you-need-managed-it", destination: "/services/managed-it-services", permanent: true },
      { source: "/blog/mfa-small-business", destination: "/guides/turn-on-mfa-microsoft-365", permanent: true },
      { source: "/blog/backup-mistakes", destination: "/guides/backup-checklist-small-business", permanent: true },
      { source: "/blog/hurricane-it-prep", destination: "/guides/outage-continuity-small-business", permanent: true },
      { source: "/blog/microsoft-copilot-guide", destination: "/services/cloud-solutions/microsoft-365", permanent: true },
      { source: "/blog/phishing-red-flags", destination: "/guides/spot-stop-phishing-emails", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;