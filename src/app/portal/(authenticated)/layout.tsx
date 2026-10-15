import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { PortalLayout } from "@/components/portal/PortalLayout";

export default async function AuthenticatedPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/portal/login");
  }

  return <PortalLayout session={session}>{children}</PortalLayout>;
}
