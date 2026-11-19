import Link from "next/link";
import { getCategories } from "../../lib/categories";
import { sanityImg } from "../../lib/sanity";
import SmartImage from "../../components/SmartImage";

export const metadata = { title: "All categories", description: "Browse every Lace & Luxe category.", alternates: { canonical: "/categories" } };

export default async function Categories() {
  const cats = await getCategories();
  return (
    <div className="space-y-8">
      <div className="text-center">
        <p className="text-xs uppercase tracking-[0.3em] text-champagne">Browse</p>
        <h1 className="mt-2 font-serif text-4xl md:text-5xl">All categories</h1>
      </div>

      {cats.length === 0 ? (
        <p className="text-center text-claret/70">Categories will appear here soon. <Link href="/shop" className="underline">Browse everything</Link></p>
      ) : (
        <>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 lg:grid-cols-4">
            {cats.map((c) => (
              <li key={c.slug}>
                <Link href={`/shop?category=${encodeURIComponent(c.slug)}`} className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-rose/15">
                  <SmartImage src={sanityImg(c.image ?? undefined, 600)} alt="" className="transition duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-claret/80 via-claret/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 text-ivory">
                    <p className="font-serif text-2xl leading-tight">{c.name}</p>
                    <p className="text-xs uppercase tracking-[0.15em] text-champagne">{c.count} {c.count === 1 ? "item" : "items"}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <p className="text-center"><Link href="/shop" className="rounded-full border border-claret px-7 py-3 text-sm uppercase tracking-[0.15em]">Shop everything</Link></p>
        </>
      )}
    </div>
  );
}
