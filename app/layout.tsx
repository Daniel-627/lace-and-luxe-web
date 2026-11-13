import "./globals.css";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/jost/600.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import CartProvider from "../components/CartProvider";
import CartLink from "../components/CartLink";
import { getAnnouncement } from "../lib/sanity";

export const metadata: Metadata = { title: "Lace & Luxe", description: "Lingerie, sleepwear and everyday essentials." };

const NAV: [string, string][] = [
  ["Shop all", "/shop"], ["Bras", "/shop?category=bras"], ["Panties", "/shop?category=panties"],
  ["Lingerie sets", "/shop?category=lingerie-sets"], ["Sleepwear", "/shop?category=sleepwear"], ["For him", "/shop?category=mens-underwear"],
];

export default async function RootLayout({ children }: { children: ReactNode }) {
  const announcement = await getAnnouncement();
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-ivory font-sans text-claret antialiased">
        <CartProvider>
          {announcement && <div className="bg-claret py-2 text-center text-xs uppercase tracking-[0.2em] text-champagne">{announcement}</div>}
          <header className="sticky top-0 z-30 border-b border-champagne/30 bg-ivory/85 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
              <Link href="/" className="flex items-center gap-3">
                <img src="/brand/monogram-claret.svg" alt="" className="h-9 w-auto" />
                <span className="font-serif text-2xl tracking-wide">Lace &amp; Luxe</span>
              </Link>
              <nav className="hidden items-center gap-7 text-sm md:flex">
                {NAV.map(([label, href]) => <Link key={label} href={href} className="transition hover:text-champagne">{label}</Link>)}
              </nav>
              <CartLink />
            </div>
            <nav className="flex gap-5 overflow-x-auto px-6 pb-3 text-sm md:hidden">
              {NAV.map(([label, href]) => <Link key={label} href={href} className="whitespace-nowrap">{label}</Link>)}
            </nav>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8">{children}</main>
          <footer className="mt-16 bg-claret text-ivory">
            <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-3">
              <div>
                <img src="/brand/badge-champagne.svg" alt="" className="h-24 w-auto" />
                <p className="mt-3 max-w-xs text-sm text-ivory/70">Lingerie, sleepwear and everyday essentials. Delivered discreetly.</p>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-champagne">Shop</p>
                <ul className="space-y-2 text-sm text-ivory/80">
                  {NAV.map(([label, href]) => <li key={label}><Link href={href} className="hover:text-champagne">{label}</Link></li>)}
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-champagne">Help</p>
                <ul className="space-y-2 text-sm text-ivory/80"><li><Link href="/cart" className="hover:text-champagne">Cart</Link></li></ul>
              </div>
            </div>
            <p className="border-t border-ivory/10 py-4 text-center text-xs text-ivory/50">© Lace &amp; Luxe Delicates</p>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
