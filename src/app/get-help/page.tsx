import { redirect } from "next/navigation";

interface Props {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

/**
 * Entry redirect that preserves deep links, e.g.
 * /get-help?category=wifi&type=onsite&hours=2 → /get-help/step-1?...
 */
export default async function GetHelpEntryPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (Array.isArray(value)) {
      value.forEach((v) => query.append(key, v));
    } else if (value !== undefined) {
      query.append(key, value);
    }
  }
  const qs = query.toString();
  redirect(`/get-help/step-1${qs ? `?${qs}` : ""}`);
}
