import Link from "next/link";
import { notFound } from "next/navigation";
import { API } from "../../../lib/api";
import type { Product } from "../../../lib/types";
import VariantPicker from "../../../components/VariantPicker";
import SmartImage from "../../../components/SmartImage";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${API}/api/products/${params.slug}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const p: Product = await res.json();
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="aspect-[3/4] animate-fade-up overflow-hidden rounded-3xl bg-rose/15"><SmartImage src={p.image} alt={p.name} /></div>
      <div className="animate-fade-up space-y-5 md:pt-10" style={{ animationDelay: ".15s" }}>
        <Link href="/shop" className="text-sm text-claret/70 hover:underline">← Back to shop</Link>
        {p.category && <p className="text-xs uppercase tracking-[0.25em] text-champagne">{p.category.name}</p>}
        <h1 className="font-serif text-5xl leading-tight">{p.name}</h1>
        <p className="text-claret/80">{p.description || "Description coming soon."}</p>
        <VariantPicker product={p} />
        <ul className="space-y-1 border-t border-champagne/40 pt-4 text-sm text-claret/70">
          <li>Pay with M-Pesa at checkout</li>
          <li>Plain, discreet packaging</li>
        </ul>
      </div>
    </div>
  );
}
