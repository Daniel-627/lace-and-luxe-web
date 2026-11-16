import { API, kes } from "../../../lib/api";
import AutoRefresh from "../../../components/AutoRefresh";
import PayPanel from "../../../components/PayPanel";
import { edgeHeaders } from "../../../lib/session";
import type { PayAccount } from "../../../lib/checkout";

export const dynamic = "force-dynamic";

interface Tracked {
  reference: string; status: "PENDING" | "PAID" | "FAILED" | "EXPIRED"; fulfilment: string; payTiming: string;
  total: number; subtotal: number; deliveryFee: number; deliveryServiceName: string; discountCode: string | null; discountAmount: number;
  mpesaReceipt: string | null; payNote: string | null; claimedCode: string | null; expiresAt: string | null;
  delivery: { county: string; area: string }; phoneHint: string;
  items: { name: string; size: string; colour: string; price: number; qty: number }[];
  pay: { stk: boolean; accounts: PayAccount[] } | null;
}
const FULFIL: Record<string, string> = { NEW: "Order received", PACKED: "Packed", OUT_FOR_DELIVERY: "On its way to you", DELIVERED: "Delivered", CANCELLED: "Cancelled" };

export default async function Track({ params }: { params: { token: string } }) {
  const res = await fetch(`${API}/api/orders/track/${params.token}`, { cache: "no-store", headers: edgeHeaders() });
  if (!res.ok) return <p>We couldn&apos;t find that order.</p>;
  const o: Tracked = await res.json();
  const pod = o.payTiming === "ON_DELIVERY";
  const headline =
    o.status === "PAID" ? `Payment received${o.mpesaReceipt ? ` · M-Pesa ${o.mpesaReceipt}` : ""}`
    : o.status === "EXPIRED" ? "This order wasn't paid in time and has been cancelled. Please place a new order."
    : o.status === "FAILED" ? "Payment failed"
    : pod ? "Pay on delivery" : "Waiting for payment";

  return (
    <div className="max-w-xl space-y-5">
      <AutoRefresh active={o.status === "PENDING" && !pod} />
      <h1 className="font-serif text-3xl">Order {o.reference}</h1>
      <p className="text-lg">{headline}</p>
      {o.status !== "EXPIRED" && <p className="text-sm">Delivery: <b>{FULFIL[o.fulfilment] ?? o.fulfilment}</b></p>}
      {pod && o.status === "PENDING" && <p className="rounded-2xl bg-rose/15 p-4 text-sm">Please have {kes(o.total)} ready. You pay when your order arrives.</p>}

      {o.pay && <PayPanel token={params.token} reference={o.reference} total={o.total} stk={o.pay.stk} accounts={o.pay.accounts} claimed={o.claimedCode} payNote={o.payNote} expiresAt={o.expiresAt} />}

      <div className="rounded-sm border border-champagne/40 bg-white/50 p-4 text-sm">
        {o.items.map((i, k) => (
          <div key={k} className="flex justify-between py-1"><span>{i.name} <span className="text-claret/60">({i.size}, {i.colour})</span> × {i.qty}</span><span>{kes(i.price * i.qty)}</span></div>
        ))}
        {o.subtotal > 0 && <div className="mt-2 flex justify-between border-t border-champagne/40 pt-2 text-claret/70"><span>Items</span><span>{kes(o.subtotal)}</span></div>}
        {o.discountAmount > 0 && <div className="flex justify-between text-claret/70"><span>Discount {o.discountCode}</span><span>− {kes(o.discountAmount)}</span></div>}
        {o.subtotal > 0 && <div className="flex justify-between text-claret/70"><span>Delivery{o.deliveryServiceName ? ` (${o.deliveryServiceName})` : ""}</span><span>{o.deliveryFee ? kes(o.deliveryFee) : "Free"}</span></div>}
        <div className="mt-2 flex justify-between border-t border-champagne/40 pt-2 text-base font-semibold"><span>Total</span><span>{kes(o.total)}</span></div>
      </div>
      <p className="text-sm text-claret/70">Delivering to {o.delivery.area}, {o.delivery.county} · Contact {o.phoneHint}</p>
      <p className="text-sm text-claret/70">Keep this page&apos;s link. It is how you follow your order.</p>
    </div>
  );
}
