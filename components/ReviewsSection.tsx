import Link from "next/link";
import { API } from "../lib/api";
import Stars from "./Stars";
import ReviewForm from "./ReviewForm";

interface Data {
  summary: { count: number; avg: number; distribution: number[] };
  reviews: { id: number; rating: number; title: string; body: string; reply: string | null; createdAt: string; name: string | null }[];
}
const day = new Intl.DateTimeFormat("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "medium" });

export default async function ReviewsSection({ slug, productId, signedIn, eligibility }: { slug: string; productId: number; signedIn: boolean; eligibility: { eligible: boolean; reason?: string } | null }) {
  let d: Data = { summary: { count: 0, avg: 0, distribution: [0, 0, 0, 0, 0] }, reviews: [] };
  try { const r = await fetch(`${API}/api/products/${slug}/reviews`, { cache: "no-store" }); if (r.ok) d = await r.json(); } catch { /* show none */ }
  const max = Math.max(1, ...d.summary.distribution);

  return (
    <section className="space-y-6">
      <h2 className="font-serif text-4xl">Reviews</h2>
      {d.summary.count > 0 ? (
        <div className="grid gap-8 md:grid-cols-[auto_1fr]">
          <div>
            <p className="font-serif text-6xl">{d.summary.avg}</p>
            <Stars value={d.summary.avg} className="text-xl" />
            <p className="text-sm text-claret/60">{d.summary.count} {d.summary.count === 1 ? "review" : "reviews"}</p>
            <div className="mt-3 space-y-1 text-xs">
              {[5, 4, 3, 2, 1].map((n) => (
                <div key={n} className="flex items-center gap-2"><span className="w-3">{n}</span><div className="h-2 w-32 rounded-full bg-claret/10"><div className="h-2 rounded-full bg-champagne" style={{ width: `${(d.summary.distribution[n - 1] / max) * 100}%` }} /></div><span className="text-claret/60">{d.summary.distribution[n - 1]}</span></div>
              ))}
            </div>
          </div>
          <ul className="space-y-5">
            {d.reviews.map((r) => (
              <li key={r.id} className="space-y-1 border-b border-champagne/30 pb-5">
                <div className="flex flex-wrap items-center gap-2"><Stars value={r.rating} />{r.title && <span className="font-medium">{r.title}</span>}</div>
                <p className="text-sm text-claret/80">{r.body}</p>
                <p className="text-xs text-claret/60">{r.name ?? "Verified buyer"} · {day.format(new Date(r.createdAt))}</p>
                {r.reply && <p className="mt-2 rounded-lg bg-rose/15 p-3 text-sm"><b>Lace &amp; Luxe:</b> {r.reply}</p>}
              </li>
            ))}
          </ul>
        </div>
      ) : <p className="text-sm text-claret/70">No reviews yet.</p>}

      {eligibility?.eligible ? <ReviewForm productId={productId} /> : signedIn ? (eligibility?.reason && <p className="text-sm text-claret/70">{eligibility.reason}</p>) : (
        <p className="text-sm text-claret/70">Received this product? <Link href="/account/login" className="underline">Sign in</Link> to write a review.</p>
      )}
    </section>
  );
}
