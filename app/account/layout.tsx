import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { FEATURES } from "../../lib/features";

// Private or per-person pages: keep them out of search results.
export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function Layout({ children }: { children: ReactNode }) {
  if (!FEATURES.accounts) notFound(); // switched off for now; see lib/features.ts
  return <>{children}</>;
}
