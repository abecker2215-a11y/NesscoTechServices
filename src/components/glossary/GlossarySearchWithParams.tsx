"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { GlossarySearch } from "./GlossarySearch";
import type { GlossaryTerm, GlossaryCategory } from "@/lib/glossary";

function GlossarySearchInner({ terms }: { terms: GlossaryTerm[] }) {
  const searchParams = useSearchParams();
  const categoryParam = searchParams.get("category");
  
  return <GlossarySearch terms={terms} initialCategory={(categoryParam as GlossaryCategory) || undefined} />;
}

export function GlossarySearchWithParams({ terms }: { terms: GlossaryTerm[] }) {
  return (
    <Suspense fallback={<GlossarySearch terms={terms} />}>
      <GlossarySearchInner terms={terms} />
    </Suspense>
  );
}

