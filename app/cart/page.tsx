"use client";
import { useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../components/CartProvider";
import { post, kes } from "../../lib/api";
import WhatsAppButton from "../../components/WhatsAppButton";

interface Created { reference: string; trackingToken: string }
const empty = { name: "", phone: "", phone2: "", email: "", dName: "", dPhone: "", county: "", area: "", details: "" };

export default function CartPage() {
  const { items, remove, clear, total } = useCart();
  const [f, setF] = useState(empty);
  const [other, setOther] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const router = useRouter();

  const set = (k: keyof typeof empty) => (e: ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  const input = "w-full rounded-sm border border-champagne/60 bg-white/70 p-2";

  async function payMpesa() {
    setMsg("");
    if (!token && f.phone.replace(/\D/g, "") !== f.phone2.replace(/\D/g, "")) return setMsg("The two phone numbers don't match.");
    setBusy(true);
    try {
      let t = token;
      if (!t) {
        const order = await post<Created>("/api/orders", {
          contact: { name: f.name, phone: f.phone },
          email: f.email,
          delivery: { name: other ? f.dName : f.name, phone: other ? f.dPhone : f.phone, county: f.county, area: f.area, details: f.details },
          items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })),
        });
        t = order.trackingToken; setToken(t); clear();
      }
      await post("/api/pay/mpesa", { token: t });
      router.push(`/track/${t}`);
    } catch (e) { setMsg(e instanceof Error ? e.message : "Something went wrong"); }
    finally { setBusy(false); }
  }

  if (!items.length && !token) return <p>Your cart is empty.</p>;
  return (
    <div className="max-w-xl space-y-4">
      <h1 className="font-serif text-3xl">Checkout</h1>
      {items.map((i) => (
        <div key={i.variantId} className="flex justify-between border-b border-champagne/40 py-2">
          <span>{i.name} <span className="text-claret/60">({i.size}, {i.colour})</span> × {i.qty}</span>
          <span>{kes(i.price * i.qty)} <button onClick={() => remove(i.variantId)} className="ml-2 underline">remove</button></span>
        </div>
      ))}
      {items.length > 0 && <p className="text-lg font-semibold">Total: {kes(total)}</p>}
      {!token && (
        <>
          <input className={input} placeholder="Your name" value={f.name} onChange={set("name")} />
          <input className={input} placeholder="Phone (07xx…)" inputMode="tel" value={f.phone} onChange={set("phone")} />
          <input className={input} placeholder="Confirm phone" inputMode="tel" value={f.phone2} onChange={set("phone2")} />
          <input className={input} placeholder="Email (optional)" value={f.email} onChange={set("email")} />
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={other} onChange={(e) => setOther(e.target.checked)} /> Deliver to someone else</label>
          {other && (<>
            <input className={input} placeholder="Recipient name" value={f.dName} onChange={set("dName")} />
            <input className={input} placeholder="Recipient phone" inputMode="tel" value={f.dPhone} onChange={set("dPhone")} />
          </>)}
          <input className={input} placeholder="County" value={f.county} onChange={set("county")} />
          <input className={input} placeholder="Area / town" value={f.area} onChange={set("area")} />
          <input className={input} placeholder="Delivery details (building, landmark)" value={f.details} onChange={set("details")} />
        </>
      )}
      <button disabled={busy} onClick={payMpesa} className="w-full rounded-sm bg-claret py-3 text-ivory disabled:opacity-50">
        {token ? "Send the M-Pesa prompt again" : "Pay with M-Pesa"}
      </button>
      {!token && <WhatsAppButton source="cart" getItems={() => items.map((i) => ({ variantId: i.variantId, qty: i.qty }))} label="Order on WhatsApp instead" />}
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
