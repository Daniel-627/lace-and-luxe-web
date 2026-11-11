"use client";
import { useState } from "react";
import { useCart } from "./CartProvider";
import type { Product } from "../lib/types";

export default function AddToCart({ product, compact = false }: { product: Product; compact?: boolean }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const click = () => { add(product); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  const style = compact
    ? "w-full rounded-full bg-ivory/90 py-2.5 text-sm text-claret backdrop-blur transition hover:bg-claret hover:text-ivory"
    : "mt-3 w-full rounded-full bg-claret py-3 text-sm tracking-wide text-ivory transition hover:bg-claret/90";
  return <button onClick={click} className={style}>{added ? "Added ✓" : "Add to cart"}</button>;
}
