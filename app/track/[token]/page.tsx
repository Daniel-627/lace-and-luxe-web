import { API, kes } from "../../../lib/api";
import AutoRefresh from "../../../components/AutoRefresh";

export const dynamic = "force-dynamic";

interface Tracked {
  reference: string; status: "PENDING" | "PAID" | "FAILED"; total: number; mpesaReceipt: string | null;
  delivery: { county: string; area: string }; phoneHint: string;
  items: { name: string; price: number; qty: number }[];
}
const LABEL = { PENDING: "Waiting for payment", PAID: "Payment received", FAILED: "Payment failed" } as const;

export default async function Track({ params }: { params: { token: string } }) {
  const res = await fetch(`${API}/api/orders/track/${params.token}`, { cache: "no-store" });
  if (!res.ok) return <p>We couldn&apos;t find that order.</p>;
  const o: Tracked = await res.json();
  return (
    <div className="max-w-xl space-y-4">
      <AutoRefresh active={o.status === "PENDING"} />
      <h1 className="font-serif text-3xl">Order {o.reference}</h1>
      <p className="text-lg">{LABEL[o.status]}{o.mpesaReceipt && ` · M-Pesa ${o.mpesaReceipt}`}</p>
      {o.status === "PENDING" && <p className="text-sm text-claret/70">Enter your M-Pesa PIN on your phone. This page updates by itself.</p>}
      <div className="rounded-sm border border-champagne/40 bg-white/50 p-4">
        {o.items.map((i, k) => (
          <div key={k} className="flex justify-between py-1"><span>{i.name} × {i.qty}</span><span>{kes(i.price * i.qty)}</span></div>
        ))}
        <div className="mt-2 flex justify-between border-t border-champagne/40 pt-2 font-semibold"><span>Total</span><span>{kes(o.total)}</span></div>
      </div>
      <p className="text-sm text-claret/70">Delivering to {o.delivery.area}, {o.delivery.county} · Contact {o.phoneHint}</p>
      <p className="text-sm text-claret/70">Keep this page&apos;s link. It is how you follow your order.</p>
    </div>
  );
}
