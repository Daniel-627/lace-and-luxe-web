"use client";
import { useEffect } from "react";
import Link from "next/link";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);
  return (
    <section className="mx-auto max-w-lg space-y-5 py-16 text-center">
      <h1 className="font-serif text-5xl">Something went wrong</h1>
      <p className="text-claret/70">We could not load this page. It is usually temporary. Please try again.</p>
      <div className="flex justify-center gap-4">
        <button onClick={reset} className="rounded-full bg-claret px-7 py-3 text-sm uppercase tracking-[0.15em] text-ivory">Try again</button>
        <Link href="/shop" className="rounded-full border border-claret px-7 py-3 text-sm uppercase tracking-[0.15em]">Back to shop</Link>
      </div>
    </section>
  );
}
