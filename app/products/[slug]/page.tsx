import type { Metadata } from "next";
import { cache } from "react";
import { notFound } from "next/navigation";
import { SITE, SITE_NAME } from "../../../lib/site";
import { API } from "../../../lib/api";
import type { Product } from "../../../lib/types";
import { apiAuth, getProfile } from "../../../lib/session";
import ProductView from "../../../components/ProductView";
import ReviewsSection from "../../../components/ReviewsSection";
import ProductCard from "../../../components/ProductCard";
import Stars from "../../../components/Stars";

export const dynamic = "force-dynamic";

// One fetch per request, shared by the page and its metadata.
const load = cache(async (slug: string): Promise<Product | null> => {
  const res = await fetch(`${API}/api/products/${slug}`, { cache: "no-store" });
  return res.ok ? ((await res.json()) as Product) : null;
});

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const p = await load(params.slug);
  if (!p) return { title: "Product not found", robots: { index: false } };
  const description = p.description.replace(/\s+/g, " ").trim().slice(0, 160) || `${p.name} from ${SITE_NAME}. Delivered discreetly.`;
  return {
    title: p.name, description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { type: "website", title: p.name, description, url: `/products/${p.slug}`, ...(p.image && { images: [{ url: p.image }] }) },
    twitter: { card: p.image ? "summary_large_image" : "summary", title: p.name, description, ...(p.image && { images: [p.image] }) },
  };
}

/** Structured data so search results can show price, stock and stars. */
function productJsonLd(p: Product) {
  const prices = p.variants.map((v) => v.price);
  return {
    "@context": "https://schema.org", "@type": "Product", name: p.name,
    description: p.description.replace(/\s+/g, " ").trim().slice(0, 500) || undefined,
    image: p.image ? [p.image] : undefined, category: p.category?.name,
    brand: { "@type": "Brand", name: SITE_NAME },
    offers: {
      "@type": "AggregateOffer", priceCurrency: "KES", lowPrice: Math.min(...prices), highPrice: Math.max(...prices), offerCount: p.variants.length,
      availability: p.variants.some((v) => v.stock > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock", url: `${SITE}/products/${p.slug}`,
    },
    ...(p.rating && p.rating.count > 0 && { aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating.avg, reviewCount: p.rating.count } }),
  };
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const p = await load(params.slug);
  if (!p) notFound();
  const profile = await getProfile();
  const eligibility = profile ? (await apiAuth<{ eligible: boolean; reason?: string }>(`/api/me/reviewable/${p.id}`)).data : null;

  return (
    <div className="space-y-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(p)).replace(/</g, "\\u003c") }} />
      <div>
        {p.rating && p.rating.count > 0 && <p className="mb-3 text-sm"><Stars value={p.rating.avg} /> <a href="#reviews" className="text-claret/70 underline">{p.rating.avg} ({p.rating.count} {p.rating.count === 1 ? "review" : "reviews"})</a></p>}
        <ProductView product={p} />
      </div>
      <div id="reviews"><ReviewsSection slug={p.slug} productId={p.id} signedIn={!!profile} eligibility={eligibility} /></div>
      {p.related && p.related.length > 0 && (
        <section className="space-y-6">
          <h2 className="font-serif text-4xl">You may also like</h2>
          <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{p.related.map((r) => <ProductCard key={r.id} p={r} />)}</div>
        </section>
      )}
    </div>
  );
}
