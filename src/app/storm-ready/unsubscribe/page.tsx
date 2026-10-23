import { Metadata } from "next";
import { StormUnsubscribe } from "./StormUnsubscribe";

export const metadata: Metadata = {
  title: "Unsubscribe — Storm Report Follow-ups",
  alternates: { canonical: "/storm-ready/unsubscribe" },
  robots: "noindex, nofollow",
};

export default function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  return (
    <section className="py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Storm report follow-ups</h1>
          <StormUnsubscribe searchParams={searchParams} />
        </div>
      </div>
    </section>
  );
}
