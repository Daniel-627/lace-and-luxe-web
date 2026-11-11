"use client";
import { useCart } from "./CartProvider";
import type { Product } from "../lib/types";

export default function AddToCart({ product }: { product: Product }) {
  const { add } = useCart();
  return <button onClick={() => add(product)} className="mt-2 w-full rounded bg-brand py-2 text-white hover:opacity-90">Add to cart</button>;
}
