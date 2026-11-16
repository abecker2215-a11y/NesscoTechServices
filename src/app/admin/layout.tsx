import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/portal/login");
  }

  const role = session.user.role;
  if (role !== "SUPER_ADMIN" && role !== "ADMIN") {
    redirect("/portal");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b border-border bg-background">
        <div className="container flex h-14 items-center justify-between">
          <nav className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-foreground">Admin</span>
            <Link href="/admin/blog" className="text-muted-foreground hover:text-foreground">
              Blog
            </Link>
            <Link href="/blog" className="text-muted-foreground hover:text-foreground">
              View site
            </Link>
          </nav>
          <span className="text-sm text-muted-foreground">{session.user.email}</span>
        </div>
      </header>
      <main className="container py-8">{children}</main>
    </div>
  );
}