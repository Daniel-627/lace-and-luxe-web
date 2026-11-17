import { notFound } from "next/navigation";
import { API } from "../../../lib/api";
import type { Product } from "../../../lib/types";
import { apiAuth, getProfile } from "../../../lib/session";
import ProductView from "../../../components/ProductView";
import ReviewsSection from "../../../components/ReviewsSection";
import ProductCard from "../../../components/ProductCard";
import Stars from "../../../components/Stars";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${API}/api/products/${params.slug}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const p: Product = await res.json();
  const profile = await getProfile();
  const eligibility = profile ? (await apiAuth<{ eligible: boolean; reason?: string }>(`/api/me/reviewable/${p.id}`)).data : null;

  return (
    <div className="space-y-20">
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
