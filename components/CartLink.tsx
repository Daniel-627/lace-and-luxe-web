"use client";
import Link from "next/link";
import { useCart } from "./CartProvider";

export default function CartLink() {
  const { items } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);
  return (
    <Link href="/cart" aria-label={`Cart, ${count} items`} className="relative rounded-full border border-claret/30 px-5 py-1.5 text-sm transition hover:bg-claret hover:text-ivory">
      Cart
      {count > 0 && (
        <span key={count} className="absolute -right-2 -top-2 flex h-5 min-w-5 animate-pop items-center justify-center rounded-full bg-champagne px-1 text-xs font-semibold text-claret">
          {count}
        </span>
      )}
    </Link>
  );
}
