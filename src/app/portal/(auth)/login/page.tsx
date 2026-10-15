import { Metadata } from "next";
import { auth } from "@/lib/auth/config";
import { redirect } from "next/navigation";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Sign In | Nessco Client Portal",
  description: "Sign in to manage your IT services",
  robots: "noindex, nofollow",
};

export default async function LoginPage() {
  const session = await auth();
  
  if (session?.user) {
    redirect("/portal");
  }

  return (
    <div className="min-h-screen">
      <LoginForm />
    </div>
  );
}