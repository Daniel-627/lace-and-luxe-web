import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import CartProvider from "../components/CartProvider";

export const metadata: Metadata = { title: "Lace and Luxe Delicates", description: "Lingerie and undergarments" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-white text-slate-800">
        <CartProvider>
          <header className="flex items-center justify-between bg-brand px-6 py-4 text-white">
            <Link href="/" className="text-xl font-bold">Lace and Luxe</Link>
            <Link href="/cart" className="rounded bg-accent px-3 py-1">Cart</Link>
          </header>
          <main className="mx-auto max-w-6xl p-6">{children}</main>
          <footer className="mt-12 bg-slate-100 p-6 text-sm text-slate-500">© Lace and Luxe Delicates</footer>
        </CartProvider>
      </body>
    </html>
  );
}
