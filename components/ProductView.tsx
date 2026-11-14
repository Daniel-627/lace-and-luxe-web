"use client";
import { useState } from "react";
import Link from "next/link";
import type { Product } from "../lib/types";
import { colourList } from "../lib/product";
import ProductGallery from "./ProductGallery";
import VariantPicker from "./VariantPicker";

export default function ProductView({ product: p }: { product: Product }) {
  const [colour, setColour] = useState(colourList(p.variants)[0]?.name ?? "");
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div className="animate-fade-up">
        <ProductGallery media={p.media ?? []} fallback={p.image} colour={colour} name={p.name} />
      </div>
      <div className="animate-fade-up space-y-5 md:pt-10" style={{ animationDelay: ".15s" }}>
        <Link href="/shop" className="text-sm text-claret/70 hover:underline">← Back to shop</Link>
        {p.category && <p className="text-xs uppercase tracking-[0.25em] text-champagne">{p.category.name}</p>}
        <h1 className="font-serif text-5xl leading-tight">{p.name}</h1>
        <p className="text-claret/80">{p.description || "Description coming soon."}</p>
        <VariantPicker product={p} colour={colour} onColourChange={setColour} />
        <ul className="space-y-1 border-t border-champagne/40 pt-4 text-sm text-claret/70">
          <li>Pay with M-Pesa at checkout</li>
          <li>Plain, discreet packaging</li>
        </ul>
      </div>
    </div>
  );
}
