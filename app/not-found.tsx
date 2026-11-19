import Link from "next/link";

export const metadata = { title: "Page not found", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="mx-auto max-w-lg space-y-5 py-16 text-center">
      <h1 className="font-serif text-5xl">We could not find that page</h1>
      <p className="text-claret/70">It may have moved, or the product is no longer available.</p>
      <Link href="/shop" className="inline-block rounded-full bg-claret px-7 py-3 text-sm uppercase tracking-[0.15em] text-ivory">Browse the shop</Link>
    </section>
  );
}
