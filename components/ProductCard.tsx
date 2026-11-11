import Link from "next/link";
import { kes } from "../lib/api";
import type { Product } from "../lib/types";
import SmartImage from "./SmartImage";
import AddToCart from "./AddToCart";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <div className="group">
      <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-rose/15">
        <Link href={`/products/${p.slug}`} aria-label={p.name}>
          <SmartImage src={p.image} alt={p.name} className="transition duration-700 group-hover:scale-105" />
        </Link>
        {p.stock <= 0 ? (
          <span className="absolute left-3 top-3 rounded-full bg-claret px-3 py-1 text-xs text-ivory">Sold out</span>
        ) : (
          <div className="absolute inset-x-3 bottom-3 md:translate-y-[140%] md:transition md:duration-300 md:group-hover:translate-y-0">
            <AddToCart product={p} compact />
          </div>
        )}
      </div>
      <Link href={`/products/${p.slug}`} className="mt-3 block">
        {p.category && <p className="text-[11px] uppercase tracking-[0.2em] text-champagne">{p.category.name}</p>}
        <h3 className="font-serif text-xl leading-tight">{p.name}</h3>
      </Link>
      <p className="mt-1 text-sm font-medium">{kes(p.price)}</p>
    </div>
  );
}
