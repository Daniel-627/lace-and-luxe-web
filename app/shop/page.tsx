import Link from "next/link";
import { kes } from "../../lib/api";
import { searchProducts } from "../../lib/catalog";
import ProductCard from "../../components/ProductCard";
import Reveal from "../../components/Reveal";

export const metadata = { title: "Shop | Lace & Luxe" };
export const dynamic = "force-dynamic";

const KEYS = ["q", "category", "size", "colour", "min", "max", "inStock", "sort"] as const;
const SORTS: [string, string][] = [["new", "Newest"], ["price_asc", "Price: low to high"], ["price_desc", "Price: high to low"], ["rating", "Top rated"], ["name", "Name A to Z"]];
const box = "rounded-sm border border-champagne/60 bg-white/70 p-2.5 text-sm";

export default async function Shop({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const qs = new URLSearchParams();
  for (const k of [...KEYS, "page"]) { const v = searchParams[k]; if (v) qs.set(k, v); }
  const data = await searchProducts(qs);
  const f = data.facets;
  const pages = Math.max(1, Math.ceil(data.total / data.pageSize));
  const without = (...ks: string[]) => { const p = new URLSearchParams(qs); ks.forEach((k) => p.delete(k)); p.delete("page"); return `/shop?${p}`; };
  const pageLink = (n: number) => { const p = new URLSearchParams(qs); p.set("page", String(n)); return `/shop?${p}`; };
  const catName = f.categories.find((c) => c.slug === searchParams.category)?.name;

  const chips: [string, string][] = [];
  if (searchParams.q) chips.push([`“${searchParams.q}”`, without("q")]);
  if (catName) chips.push([catName, without("category")]);
  if (searchParams.size) chips.push([`Size ${searchParams.size}`, without("size")]);
  if (searchParams.colour) chips.push([searchParams.colour, without("colour")]);
  if (searchParams.min || searchParams.max) chips.push([`${searchParams.min ? kes(Number(searchParams.min)) : "Any"} to ${searchParams.max ? kes(Number(searchParams.max)) : "any"}`, without("min", "max")]);
  if (searchParams.inStock) chips.push(["In stock", without("inStock")]);

  return (
    <section className="space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-5xl">{searchParams.q ? `Results for “${searchParams.q}”` : catName ?? "Shop all"}</h1>
        <p className="mt-2 text-sm text-claret/60">{data.total} {data.total === 1 ? "product" : "products"}</p>
      </div>

      <form method="get" action="/shop" className="grid gap-3 rounded-2xl border border-champagne/40 bg-white/50 p-4 sm:grid-cols-2 lg:grid-cols-4">
        <input name="q" type="search" defaultValue={searchParams.q ?? ""} placeholder="Search" aria-label="Search" className={box} />
        <select name="category" defaultValue={searchParams.category ?? ""} aria-label="Category" className={box}>
          <option value="">All categories</option>{f.categories.map((c) => <option key={c.slug} value={c.slug}>{c.name} ({c.count})</option>)}
        </select>
        <select name="size" defaultValue={searchParams.size ?? ""} aria-label="Size" className={box}>
          <option value="">Any size</option>{f.sizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select name="colour" defaultValue={searchParams.colour ?? ""} aria-label="Colour" className={box}>
          <option value="">Any colour</option>{f.colours.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
        </select>
        <input name="min" type="number" min={0} inputMode="numeric" defaultValue={searchParams.min ?? ""} placeholder={f.priceMin ? `From KES ${f.priceMin}` : "Min price"} aria-label="Minimum price" className={box} />
        <input name="max" type="number" min={0} inputMode="numeric" defaultValue={searchParams.max ?? ""} placeholder={f.priceMax ? `Up to KES ${f.priceMax}` : "Max price"} aria-label="Maximum price" className={box} />
        <select name="sort" defaultValue={searchParams.sort ?? "new"} aria-label="Sort" className={box}>{SORTS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
        <div className="flex items-center justify-between gap-3">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" name="inStock" value="1" defaultChecked={!!searchParams.inStock} /> In stock only</label>
          <button className="rounded-full bg-claret px-5 py-2 text-sm text-ivory">Apply</button>
        </div>
      </form>

      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {chips.map(([label, href]) => <Link key={label} href={href} className="rounded-full border border-claret/30 px-3 py-1 hover:border-claret">{label} ✕</Link>)}
          <Link href="/shop" className="underline">Clear all</Link>
        </div>
      )}

      {data.products.length === 0 ? (
        <div className="py-10 text-center"><p className="text-claret/70">Nothing matches that. Try fewer filters or a different word.</p><Link href="/shop" className="mt-3 inline-block underline">See everything</Link></div>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">
          {data.products.map((p, i) => <Reveal key={p.id} delay={(i % 4) * 80}><ProductCard p={p} /></Reveal>)}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-6 text-sm">
          {data.page > 1 ? <Link href={pageLink(data.page - 1)} className="underline">← Previous</Link> : <span />}
          <span className="text-claret/60">Page {data.page} of {pages}</span>
          {data.page < pages ? <Link href={pageLink(data.page + 1)} className="underline">Next →</Link> : <span />}
        </div>
      )}
    </section>
  );
}
