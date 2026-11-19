"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ShopCategory } from "../lib/categories";

const link = (c: ShopCategory) => `/shop?category=${encodeURIComponent(c.slug)}`;

/** Large screens: Shop all, the first few categories, then a "More" dropdown for the rest. */
export default function DesktopNav({ categories, slots }: { categories: ShopCategory[]; slots: number }) {
  const main = categories.slice(0, slots);
  const rest = categories.slice(slots);
  const [open, setOpen] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const away = (e: MouseEvent) => { if (box.current && !box.current.contains(e.target as Node)) setOpen(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", away);
    document.addEventListener("keydown", esc);
    return () => { document.removeEventListener("mousedown", away); document.removeEventListener("keydown", esc); };
  }, [open]);

  return (
    <nav aria-label="Shop" className="hidden items-center gap-6 whitespace-nowrap text-sm lg:flex">
      <Link href="/shop" className="transition hover:text-champagne">Shop all</Link>
      {main.map((c) => <Link key={c.slug} href={link(c)} className="transition hover:text-champagne">{c.name}</Link>)}
      {rest.length > 0 && (
        <div ref={box} className="relative">
          <button type="button" onClick={() => setOpen((o) => !o)} aria-expanded={open} aria-haspopup="true" className="flex items-center gap-1 transition hover:text-champagne">
            More <span aria-hidden className={`text-[10px] transition-transform ${open ? "rotate-180" : ""}`}>▼</span>
          </button>
          {open && (
            <div className="absolute right-0 top-full z-40 mt-3 w-64 rounded-2xl border border-champagne/40 bg-ivory p-2 shadow-xl">
              <ul className="max-h-[60vh] overflow-y-auto">
                {rest.map((c) => (
                  <li key={c.slug}>
                    <Link href={link(c)} onClick={() => setOpen(false)} className="flex items-center justify-between rounded-lg px-4 py-2.5 transition hover:bg-rose/20">
                      <span>{c.name}</span><span className="text-xs text-claret/50">{c.count}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/categories" onClick={() => setOpen(false)} className="mt-1 block border-t border-champagne/40 px-4 py-2.5 underline">All categories</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
