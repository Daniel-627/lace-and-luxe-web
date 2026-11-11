import { API, kes } from "../../../lib/api";
import type { Order } from "../../../lib/types";

export const dynamic = "force-dynamic";

export default async function OrderPage({ params }: { params: { id: string } }) {
  const res = await fetch(`${API}/api/orders/${params.id}`, { cache: "no-store" });
  if (!res.ok) return <p>Order not found.</p>;
  const o: Order = await res.json();
  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold">Order #{o.id}</h1>
      <p>Status: <b>{o.status}</b> · {kes(o.total)} {o.mpesaReceipt && `· M-Pesa ${o.mpesaReceipt}`}</p>
      {o.status === "PENDING" && <p className="text-sm text-slate-500">Waiting for payment confirmation. Refresh in a moment.</p>}
    </div>
  );
}
