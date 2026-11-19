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
import WishlistProvider from "../components/WishlistProvider";
import WishlistLink from "../components/WishlistLink";
import DesktopNav from "../components/DesktopNav";
import { getCategories, MENU_SLOTS, MOBILE_STRIP } from "../lib/categories";
import { getAnnouncement } from "../lib/sanity";
import { cookies } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE, SITE_NAME } from "../lib/site";

const DESCRIPTION = "Lingerie, sleepwear and everyday essentials. Delivered discreetly.";
export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: `${SITE_NAME} | Lingerie, sleepwear and everyday essentials`, template: `%s | ${SITE_NAME}` },
  description: DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { type: "website", siteName: SITE_NAME, locale: "en_KE", title: SITE_NAME, description: DESCRIPTION },
  twitter: { card: "summary_large_image", title: SITE_NAME, description: DESCRIPTION },
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const [announcement, categories] = await Promise.all([getAnnouncement(), getCategories()]);
  const signedIn = !!cookies().get("ll_session");
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-ivory font-sans text-claret antialiased">
        <CartProvider>
          <WishlistProvider signedIn={signedIn}>
          {announcement && <div className="bg-claret py-2 text-center text-xs uppercase tracking-[0.2em] text-champagne">{announcement}</div>}
          <header className="sticky top-0 z-30 border-b border-champagne/30 bg-ivory/85 backdrop-blur">
            <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
              <Link href="/" className="flex items-center gap-3">
                <img src="/brand/monogram-claret.svg" alt="" className="h-9 w-auto" />
                <span className="font-serif text-2xl tracking-wide">Lace &amp; Luxe</span>
              </Link>
              <DesktopNav categories={categories} slots={MENU_SLOTS} />
              <form action="/shop" method="get" className="hidden xl:block">
                <input name="q" type="search" placeholder="Search" aria-label="Search products" className="w-36 rounded-full border border-champagne/60 bg-white/60 px-4 py-1.5 text-sm outline-none focus:border-claret" />
              </form>
              <div className="flex items-center gap-4"><Link href={signedIn ? "/account" : "/account/login"} className="text-sm transition hover:text-champagne">{signedIn ? "Account" : "Sign in"}</Link><WishlistLink /><CartLink /></div>
            </div>
            <nav aria-label="Shop" className="flex gap-5 overflow-x-auto px-4 pb-3 text-sm sm:px-6 lg:hidden">
              <Link href="/shop" className="whitespace-nowrap">Shop all</Link>
              {categories.slice(0, MOBILE_STRIP).map((c) => <Link key={c.slug} href={`/shop?category=${encodeURIComponent(c.slug)}`} className="whitespace-nowrap">{c.name}</Link>)}
              <Link href="/categories" className="whitespace-nowrap font-medium underline">All categories</Link>
            </nav>
            <form action="/shop" method="get" className="px-4 pb-3 sm:px-6 xl:hidden">
              <input name="q" type="search" placeholder="Search products" aria-label="Search products" className="w-full rounded-full border border-champagne/60 bg-white/60 px-4 py-2 text-sm outline-none focus:border-claret" />
            </form>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">{children}</main>
          <footer className="mt-16 bg-claret text-ivory">
            <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 md:grid-cols-3">
              <div>
                <img src="/brand/badge-champagne.svg" alt="" className="h-24 w-auto" />
                <p className="mt-3 max-w-xs text-sm text-ivory/70">Lingerie, sleepwear and everyday essentials. Delivered discreetly.</p>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-champagne">Shop</p>
                <ul className="space-y-2 text-sm text-ivory/80">
                  <li><Link href="/shop" className="hover:text-champagne">Shop all</Link></li>
                  {categories.slice(0, 8).map((c) => <li key={c.slug}><Link href={`/shop?category=${encodeURIComponent(c.slug)}`} className="hover:text-champagne">{c.name}</Link></li>)}
                  <li><Link href="/categories" className="underline hover:text-champagne">All categories</Link></li>
                </ul>
              </div>
              <div>
                <p className="mb-3 text-xs uppercase tracking-[0.25em] text-champagne">Help</p>
                <ul className="space-y-2 text-sm text-ivory/80"><li><Link href="/size-guide" className="hover:text-champagne">Size guide</Link></li><li><Link href="/wishlist" className="hover:text-champagne">Wishlist</Link></li><li><Link href="/cart" className="hover:text-champagne">Cart</Link></li></ul>
              </div>
            </div>
            <p className="border-t border-ivory/10 py-4 text-center text-xs text-ivory/50">© Lace &amp; Luxe Delicates</p>
          </footer>
          </WishlistProvider>
        </CartProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
