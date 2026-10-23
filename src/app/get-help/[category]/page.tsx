import { Metadata } from "next";
import { redirect } from "next/navigation";
import { helpCategories } from "@/lib/help-workflow";

interface Props {
  params: Promise<{ category: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params;
  const cat = helpCategories.find((c) => c.id === category);
  if (!cat) return { title: "Get Help" };
  return {
    title: `Get Help with ${cat.label} | Nessco Tech Services`,
    description: cat.description,
    alternates: { canonical: `/get-help/${category}` },
    openGraph: {
      title: `Get Help with ${cat.label} | Nessco Tech Services`,
      description: cat.description,
      url: `https://nesscotech.com/get-help/${category}`,
    },
  };
}

export async function generateStaticParams() {
  return helpCategories.map((cat) => ({ category: cat.id }));
}

export default async function CategoryPage({ params }: Props) {
  const { category } = await params;
  const cat = helpCategories.find((c) => c.id === category);
  if (!cat) redirect("/get-help");
  redirect(`/get-help/step-1?category=${category}`);
}