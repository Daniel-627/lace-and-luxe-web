"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useWishlist } from "../../components/WishlistProvider";
import ProductCard from "../../components/ProductCard";
import { getProductsByIds } from "../actions";
import type { Product } from "../../lib/types";

export default function WishlistPage() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<Product[] | null>(null);
  const key = ids.join(",");

  useEffect(() => {
    let live = true;
    if (!ids.length) { setProducts([]); return; }
    void getProductsByIds(ids).then((p) => { if (live) setProducts(p); });
    return () => { live = false; };
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const shown = (products ?? []).filter((p) => ids.includes(p.id));
  return (
    <section className="space-y-8">
      <div className="text-center">
        <h1 className="font-serif text-5xl">Your wishlist</h1>
        <p className="mt-2 text-sm text-claret/60">Saved on this device. Sign in and it follows you everywhere.</p>
      </div>
      {products === null ? <p className="text-center text-claret/70">Loading…</p> : shown.length === 0 ? (
        <p className="text-center text-claret/70">Nothing saved yet. Tap the ♡ on anything you love. <Link href="/shop" className="underline">Browse the shop</Link></p>
      ) : (
        <div className="grid grid-cols-2 gap-x-5 gap-y-10 md:grid-cols-4">{shown.map((p) => <ProductCard key={p.id} p={p} />)}</div>
      )}
    </section>
  );
}
