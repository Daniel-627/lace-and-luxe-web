import Link from "next/link";
import type { Product } from "../lib/types";
import { colourList, hasStock, priceLabel } from "../lib/product";
import SmartImage from "./SmartImage";

export default function ProductCard({ p }: { p: Product }) {
  const colours = colourList(p.variants);
  return (
    <Link href={`/products/${p.slug}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-rose/15">
        <SmartImage src={p.image} alt={p.name} className="transition duration-700 group-hover:scale-105" />
        {!hasStock(p) && <span className="absolute left-3 top-3 rounded-full bg-claret px-3 py-1 text-xs text-ivory">Sold out</span>}
        <span className="absolute inset-x-3 bottom-3 rounded-full bg-ivory/90 py-2.5 text-center text-sm backdrop-blur md:translate-y-[140%] md:transition md:duration-300 md:group-hover:translate-y-0">
          Choose size
        </span>
      </div>
      <div className="mt-3">
        {p.category && <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">{p.category.name}</p>}
        <h3 className="font-serif text-xl leading-tight">{p.name}</h3>
        <div className="mt-1.5 flex items-center gap-1.5">
          {colours.map((c) => (
            <span key={c.name} title={c.name} style={{ background: c.hex ?? "#C99A9A" }} className="h-3.5 w-3.5 rounded-full ring-1 ring-claret/20" />
          ))}
        </div>
        <p className="mt-1 text-sm font-medium">{priceLabel(p)}</p>
      </div>
    </Link>
  );
}
