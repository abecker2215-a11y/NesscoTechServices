import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Client Portal | Nessco Tech Services",
  description: "Manage your IT services, tickets, assets, and billing",
  robots: "noindex, nofollow",
};

export const dynamic = "force-dynamic";

export default function PortalRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
