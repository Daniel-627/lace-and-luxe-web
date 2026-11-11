import Link from "next/link";
import { API } from "../../lib/api";
import type { Product } from "../../lib/types";
import ProductCard from "../../components/ProductCard";
import Reveal from "../../components/Reveal";

export const metadata = { title: "Shop | Lace & Luxe" };

export default async function Shop({ searchParams }: { searchParams: { category?: string } }) {
  const res = await fetch(`${API}/api/products`, { next: { revalidate: 60 } });
  const all: Product[] = res.ok ? await res.json() : [];
  const cats = Array.from(new Map(all.filter((p) => p.category).map((p) => [p.category!.slug, p.category!])).values());
  const active = searchParams.category;
  const products = active ? all.filter((p) => p.category?.slug === active) : all;
  const pill = (on: boolean) => `rounded-full border px-5 py-2 text-sm transition ${on ? "border-claret bg-claret text-ivory" : "border-claret/30 hover:border-claret"}`;

  return (
    <section>
      <div className="mb-8 text-center">
        <h1 className="font-serif text-5xl">{active ? cats.find((c) => c.slug === active)?.name ?? "Shop" : "Shop all"}</h1>
      </div>
      <div className="mb-10 flex flex-wrap justify-center gap-3">
        <Link href="/shop" className={pill(!active)}>All</Link>
        {cats.map((c) => <Link key={c.slug} href={`/shop?category=${c.slug}`} className={pill(active === c.slug)}>{c.name}</Link>)}
      </div>
      {products.length === 0 ? (
        <p className="text-center text-claret/70">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {products.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 80}><ProductCard p={p} /></Reveal>)}
        </div>
      )}
    </section>
  );
}
