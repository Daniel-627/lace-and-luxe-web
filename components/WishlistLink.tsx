"use client";
import Link from "next/link";
import { useWishlist } from "./WishlistProvider";

export default function WishlistLink() {
  const { ids } = useWishlist();
  return (
    <Link href="/wishlist" aria-label={`Wishlist, ${ids.length} saved`} className="relative text-lg leading-none transition hover:text-champagne">
      ♡{ids.length > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-claret px-1 text-[10px] text-ivory">{ids.length}</span>}
    </Link>
  );
}
