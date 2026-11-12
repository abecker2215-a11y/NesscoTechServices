import { PageContainer } from "@/components/layout";

export const metadata = {
  robots: { index: false, follow: false },
};

export default function GetHelpLayout({ children }: { children: React.ReactNode }) {
  return <PageContainer>{children}</PageContainer>;
}