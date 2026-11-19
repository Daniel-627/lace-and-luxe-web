import type { MetadataRoute } from "next";
import { getProducts } from "../lib/api";
import { SITE } from "../lib/site";

// Built on request, so a sleeping API at deploy time can never leave the sitemap empty.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const categories = [...new Set(products.map((p) => p.category?.slug).filter((s): s is string => !!s))];
  return [
    { url: `${SITE}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE}/categories`, changeFrequency: "weekly", priority: 0.6 },
    ...categories.map((c) => ({ url: `${SITE}/shop?category=${encodeURIComponent(c)}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    ...products.map((p) => ({ url: `${SITE}/products/${p.slug}`, changeFrequency: "weekly" as const, priority: 0.7 })),
    { url: `${SITE}/size-guide`, changeFrequency: "monthly", priority: 0.4 },
  ];
}
