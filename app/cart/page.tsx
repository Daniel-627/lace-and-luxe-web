"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartProvider";
import { post, kes } from "../../lib/api";
import type { Order } from "../../lib/types";

export default function CartPage() {
  const { items, remove, clear, total } = useCart();
  const [form, setForm] = useState({ email: "", phone: "" });
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  async function pay(method: "mpesa" | "paystack") {
    setBusy(true); setMsg("");
    try {
      const order = await post<Order>("/api/orders", { ...form, items: items.map((i) => ({ productId: i.id, qty: i.qty })) });
      if (method === "mpesa") {
        const d = await post<{ message: string }>("/api/pay/mpesa", { orderId: order.id, phone: form.phone });
        setMsg(d.message); clear();
        setTimeout(() => router.push(`/orders/${order.id}`), 4000);
      } else {
        const d = await post<{ url: string }>("/api/pay/paystack", { orderId: order.id });
        clear(); window.location.href = d.url;
      }
    } catch (e) { setMsg(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setBusy(false); }
  }

  if (!items.length) return <p>{msg || "Your cart is empty."}</p>;
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="text-2xl font-bold">Cart</h1>
      {items.map((i) => (
        <div key={i.id} className="flex justify-between border-b py-2">
          <span>{i.name} × {i.qty}</span>
          <span>{kes(i.price * i.qty)} <button onClick={() => remove(i.id)} className="ml-2 text-accent">remove</button></span>
        </div>
      ))}
      <p className="text-lg font-semibold">Total: {kes(total)}</p>
      <input className="w-full rounded border p-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input className="w-full rounded border p-2" placeholder="M-Pesa phone (07xx…)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      <div className="flex gap-2">
        <button disabled={busy} onClick={() => pay("mpesa")} className="flex-1 rounded bg-green-600 py-2 text-white disabled:opacity-50">Pay with M-Pesa</button>
        <button disabled={busy} onClick={() => pay("paystack")} className="flex-1 rounded bg-brand py-2 text-white disabled:opacity-50">Card / Paystack</button>
      </div>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
