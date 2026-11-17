"use client";
import { useWishlist } from "./WishlistProvider";

export default function WishlistButton({ productId, className = "" }: { productId: number; className?: string }) {
  const { has, toggle } = useWishlist();
  const on = has(productId);
  return (
    <button type="button" aria-pressed={on} aria-label={on ? "Remove from wishlist" : "Save to wishlist"}
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(productId); }}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-lg text-claret backdrop-blur transition hover:scale-110 ${className}`}>
      {on ? "♥" : "♡"}
    </button>
  );
}
