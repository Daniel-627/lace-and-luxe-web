"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "./CartProvider";
import { kes } from "../lib/api";
import { COUNTIES } from "../lib/counties";
import type { Address, Profile } from "../lib/account";
import { payHow, type Quote } from "../lib/checkout";
import { getQuote, placeOrder, requestCode, startMpesa, verifyInline } from "../app/actions";
import WhatsAppButton from "./WhatsAppButton";
import { FEATURES } from "../lib/features";

const intl = (p: string) => { const d = p.replace(/\D/g, ""); return d.startsWith("254") ? d : "254" + d.replace(/^0/, ""); };
const local = (p: string) => (/^254\d{9}$/.test(p) ? `0${p.slice(3)}` : p);
const box = "w-full rounded-sm border border-champagne/60 bg-white/70 p-3";
const empty = { name: "", phone: "", phone2: "", email: "", dName: "", dPhone: "", county: "", area: "", details: "" };

const REMEMBER_KEY = "ll_checkout_details";

export default function CheckoutClient({ profile, addresses }: { profile: Profile | null; addresses: Address[] }) {
  const router = useRouter();
  const { items, remove, clear } = useCart();
  const [f, setF] = useState({ ...empty, name: profile?.name ?? "", phone: profile ? local(profile.phone) : "", phone2: profile ? local(profile.phone) : "" });
  const [other, setOther] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [code, setCode] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [timing, setTiming] = useState<"NOW" | "ON_DELIVERY">("NOW");
  const [method, setMethod] = useState<"STK" | "MANUAL">("STK");
  const [accountId, setAccountId] = useState<number | null>(null);
  const [verified, setVerified] = useState<string | null>(profile?.phone ?? null);
  const [vCode, setVCode] = useState("");
  const [vSent, setVSent] = useState(false);
  const [vMsg, setVMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const [remember, setRemember] = useState(true);

  // Switched-off features never show, whatever the server says is available.
  const stkOn = FEATURES.mpesaPrompt && !!quote?.pay.now.stk;
  const hasTill = (quote?.pay.now.accounts.length ?? 0) > 0;
  const nowOk = stkOn || hasTill;
  const podOk = FEATURES.payOnDelivery && !!quote?.pay.onDelivery.available;

  // No accounts: bring back the customer's details from this device, if they asked us to remember them.
  useEffect(() => {
    if (profile) return;
    try {
      const d = JSON.parse(localStorage.getItem(REMEMBER_KEY) ?? "null") as Partial<typeof empty> | null;
      if (d) setF((x) => ({ ...x, name: x.name || d.name || "", phone: x.phone || d.phone || "", phone2: x.phone2 || d.phone || "", email: x.email || d.email || "", county: x.county || d.county || "", area: x.area || d.area || "", details: x.details || d.details || "" }));
    } catch { /* private mode or bad data: just start empty */ }
  }, [profile]);

  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  // Prices, delivery options and what is allowed are all worked out on the server.
  useEffect(() => {
    if (!items.length) { setQuote(null); return; }
    const t = setTimeout(async () => {
      const r = await getQuote({ items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })), county: f.county || undefined, area: f.area || undefined, serviceId: serviceId ?? undefined, code: code || undefined });
      if (r.quote) setQuote(r.quote);
    }, 350);
    return () => clearTimeout(t);
  }, [items, f.county, f.area, serviceId, code]);

  useEffect(() => {
    if (!quote) return;
    const opts = quote.delivery.options;
    if (!opts.some((o) => o.serviceId === serviceId)) setServiceId(opts[0]?.serviceId ?? null);
    const n = quote.pay.now;
    if (timing === "ON_DELIVERY" && !podOk) setTiming(nowOk ? "NOW" : "ON_DELIVERY");
    if (timing === "NOW" && !nowOk && podOk) setTiming("ON_DELIVERY");
    if (method === "STK" && !stkOn && n.accounts.length) setMethod("MANUAL");
    if (method === "MANUAL" && stkOn && !n.accounts.length) setMethod("STK");
    if (n.accounts.length && !n.accounts.some((a) => a.id === accountId)) setAccountId(n.accounts[0].id);
  }, [quote]); // eslint-disable-line react-hooks/exhaustive-deps

  function pickAddress(id: string) {
    const a = addresses.find((x) => String(x.id) === id);
    if (!a) return;
    setOther(a.name !== (profile?.name ?? "") || a.phone !== profile?.phone);
    setF((x) => ({ ...x, county: a.county, area: a.area, details: a.details, dName: a.name, dPhone: local(a.phone) }));
  }

  const needsVerify = timing === "ON_DELIVERY" && !!f.phone && verified !== intl(f.phone);

  async function sendVCode() {
    setVMsg("");
    const r = await requestCode(f.phone);
    if (r.ok) { setVSent(true); setVMsg(r.manual ? "We will send your code on WhatsApp. It can take a few minutes." : "Code sent. Check your messages."); }
    else setVMsg(r.error ?? "Could not send the code.");
  }
  async function checkVCode() {
    const r = await verifyInline(f.phone, vCode.trim());
    if (r.ok && r.phone) { setVerified(r.phone); setVSent(false); setVCode(""); setVMsg(""); } else setVMsg(r.error ?? "That code is not right.");
  }

  async function submit() {
    setMsg("");
    if (!quote) return setMsg("One moment, we are still working out your total.");
    if (quote.problems.length) return setMsg(quote.problems[0]);
    if (f.name.trim().length < 2) return setMsg("Please add your name.");
    if (!f.phone.trim()) return setMsg("Please add your phone number.");
    if (intl(f.phone) !== intl(f.phone2)) return setMsg("The two phone numbers don't match.");
    if (!f.county) return setMsg("Please choose your county.");
    if (f.area.trim().length < 2) return setMsg("Please add your area or town.");
    if (other && (f.dName.trim().length < 2 || !f.dPhone.trim())) return setMsg("Please add the receiver's name and phone.");
    if (!serviceId) return setMsg("Please choose how you'd like it delivered.");
    if (timing === "NOW" && method === "MANUAL" && !accountId) return setMsg("Please choose where you will pay.");
    if (needsVerify) return setMsg("Please verify your phone number to pay on delivery.");

    const useStk = stkOn && method === "STK";
    const payment = timing === "NOW" ? (useStk ? { timing, method: "STK" } : { timing, method: "MANUAL", accountId }) : { timing, method: "COD" };
    setBusy(true);
    const r = await placeOrder({
      contact: { name: f.name, phone: f.phone }, email: f.email,
      delivery: { name: other ? f.dName : f.name, phone: other ? f.dPhone : f.phone, county: f.county, area: f.area, details: f.details, serviceId },
      payment, code: code || undefined, items: items.map((i) => ({ variantId: i.variantId, qty: i.qty })),
    });
    if (!r.token) { setBusy(false); setMsg(r.error ?? "Something went wrong. Please try again."); return; }
    try {
      if (remember && !profile) localStorage.setItem(REMEMBER_KEY, JSON.stringify({ name: f.name, phone: f.phone, email: f.email, county: f.county, area: f.area, details: f.details }));
      else localStorage.removeItem(REMEMBER_KEY);
    } catch { /* ignore */ }
    clear();
    if (timing === "NOW" && useStk) await startMpesa(r.token); // if this fails, the next page offers other ways to pay
    router.push(`/track/${r.token}${timing === "NOW" && !useStk ? "?placed=1" : ""}`);
  }

  if (!items.length) return <p>Your cart is empty. <Link href="/shop" className="underline">Keep shopping</Link></p>;

  const q = quote;
  const chosenAcc = q?.pay.now.accounts.find((a) => a.id === accountId);
  const label = timing === "ON_DELIVERY" ? "Place order, pay on delivery" : stkOn && method === "STK" ? `Pay ${q ? kes(q.total) : ""} with M-Pesa` : "Place order and continue to payment";

  return (
    <div className="max-w-2xl space-y-10">
      <h1 className="font-serif text-4xl">Checkout</h1>
      {FEATURES.accounts && !profile && <p className="text-sm text-claret/70">Have an account? <Link href="/account/login" className="underline">Sign in</Link> to fill in your details.</p>}
      {q?.problems.map((p, i) => <p key={i} className="rounded-sm border border-claret p-3 text-sm">{p}</p>)}

      <section className="space-y-2">
        <h2 className="font-serif text-2xl">Your basket</h2>
        {items.map((i) => (
          <div key={i.variantId} className="flex justify-between gap-4 border-b border-champagne/40 py-2 text-sm">
            <span>{i.name} <span className="text-claret/60">({i.size}, {i.colour})</span> × {i.qty}</span>
            <span>{kes(i.price * i.qty)} <button onClick={() => remove(i.variantId)} className="ml-2 underline">remove</button></span>
          </div>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Your details</h2>
        <input className={box} placeholder="Your name" value={f.name} onChange={set("name")} />
        <input className={box} inputMode="tel" placeholder="Phone (07xx…)" value={f.phone} onChange={set("phone")} />
        <input className={box} inputMode="tel" placeholder="Confirm phone" value={f.phone2} onChange={set("phone2")} />
        <input className={box} placeholder="Email (optional)" value={f.email} onChange={set("email")} />
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">Delivery</h2>
        {addresses.length > 0 && (
          <select className={box} defaultValue="" onChange={(e) => pickAddress(e.target.value)}>
            <option value="">Use a saved delivery contact…</option>
            {addresses.map((a) => <option key={a.id} value={a.id}>{a.label}: {a.area}, {a.county}</option>)}
          </select>
        )}
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={other} onChange={(e) => setOther(e.target.checked)} /> Deliver to someone else</label>
        {other && (<>
          <input className={box} placeholder="Receiver's name" value={f.dName} onChange={set("dName")} />
          <input className={box} inputMode="tel" placeholder="Receiver's phone" value={f.dPhone} onChange={set("dPhone")} />
        </>)}
        <select className={box} value={f.county} onChange={(e) => setF({ ...f, county: e.target.value })}>
          <option value="">County…</option>
          {COUNTIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input className={box} placeholder="Area or town" value={f.area} onChange={set("area")} />
        <input className={box} placeholder="Building, landmark, directions (optional)" value={f.details} onChange={set("details")} />

        {f.county && q && q.delivery.options.length === 0 && <p className="text-sm">We can&apos;t deliver to {f.county} online yet. Tap &quot;Order on WhatsApp&quot; below and we&apos;ll see what we can do.</p>}
        {q && q.delivery.options.length > 0 && (
          <div className="space-y-2">
            {q.delivery.options.map((o) => (
              <label key={o.serviceId} className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3 text-sm ${serviceId === o.serviceId ? "border-claret bg-white" : "border-champagne/60 bg-white/50"}`}>
                <input type="radio" className="mt-1" name="service" checked={serviceId === o.serviceId} onChange={() => setServiceId(o.serviceId)} />
                <span className="flex-1"><b>{o.name}</b>{o.etaText && <span className="text-claret/60"> · {o.etaText}</span>}{o.description && <span className="block text-claret/60">{o.description}</span>}</span>
                <span className="font-medium">{o.fee === 0 ? "Free" : kes(o.fee)}</span>
              </label>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-2">
        <h2 className="font-serif text-2xl">Discount code</h2>
        <div className="flex gap-2">
          <input className={box} placeholder="Have a code?" value={codeInput} onChange={(e) => setCodeInput(e.target.value.toUpperCase())} />
          <button onClick={() => setCode(codeInput.trim())} className="shrink-0 rounded-full border border-claret px-6 text-sm">Apply</button>
        </div>
        {code && q?.discount && <p className="text-sm">{q.discount.code} applied: {kes(q.discount.amount)} off. <button onClick={() => { setCode(""); setCodeInput(""); }} className="underline">Remove</button></p>}
        {code && q?.discountError && <p className="text-sm">{q.discountError}</p>}
      </section>

      <section className="space-y-3">
        <h2 className="font-serif text-2xl">How would you like to pay?</h2>
        {q && !nowOk && !podOk && <p className="text-sm">No payment option is available for this basket right now. Please order on WhatsApp.</p>}
        {nowOk && (
          <div className={`rounded-sm border p-3 text-sm ${!podOk || timing === "NOW" ? "border-claret bg-white" : "border-champagne/60 bg-white/50"}`}>
            {podOk
              ? <label className="flex cursor-pointer items-center gap-3"><input type="radio" name="timing" checked={timing === "NOW"} onChange={() => setTiming("NOW")} /><b>Pay now with M-Pesa</b></label>
              : <p className="font-medium">Pay with M-Pesa</p>}
            {(!podOk || timing === "NOW") && q && (
              <div className={`mt-3 space-y-2 ${podOk ? "pl-6" : ""}`}>
                {stkOn && <label className="flex items-center gap-2"><input type="radio" name="method" checked={method === "STK"} onChange={() => setMethod("STK")} /> M-Pesa prompt on my phone</label>}
                {stkOn && hasTill && <label className="flex items-center gap-2"><input type="radio" name="method" checked={method === "MANUAL"} onChange={() => setMethod("MANUAL")} /> Pay to the till myself</label>}
                {method === "MANUAL" && q.pay.now.accounts.length > 1 && (
                  <select className={box} value={accountId ?? ""} onChange={(e) => setAccountId(Number(e.target.value))}>{q.pay.now.accounts.map((a) => <option key={a.id} value={a.id}>{a.displayName} ({a.number})</option>)}</select>
                )}
                {method === "MANUAL" && chosenAcc && (
                  <div className="space-y-2 rounded-sm bg-rose/10 p-3">
                    <p className="font-medium">How this works</p>
                    <ol className="list-decimal space-y-1 pl-5 text-claret/80">
                      {payHow(chosenAcc, q.total, "your order reference (shown after you place the order)").map((s, i) => <li key={i}>{s}</li>)}
                      <li>Come back to your order page (we take you there after you place the order) and type the code from your M-Pesa message.</li>
                    </ol>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
        {podOk && (
          <label className={`block cursor-pointer rounded-sm border p-3 text-sm ${timing === "ON_DELIVERY" ? "border-claret bg-white" : "border-champagne/60 bg-white/50"}`}>
            <span className="flex items-center gap-3"><input type="radio" name="timing" checked={timing === "ON_DELIVERY"} onChange={() => setTiming("ON_DELIVERY")} /><b>Pay on delivery</b></span>
            {timing === "ON_DELIVERY" && <span className="mt-2 block pl-6 text-claret/80">You pay when your order arrives. We confirm your phone number first.</span>}
          </label>
        )}
        {FEATURES.payOnDelivery && q && !podOk && q.pay.onDelivery.reason && nowOk && <p className="text-xs text-claret/60">{q.pay.onDelivery.reason}</p>}

        {needsVerify && (
          <div className="space-y-3 rounded-sm border border-claret p-4 text-sm">
            <p className="font-medium">Verify your phone number</p>
            <p>To pay on delivery, we send a code to {f.phone} to check it&apos;s really you.</p>
            {!vSent ? (
              <button onClick={() => void sendVCode()} className="rounded-full bg-claret px-5 py-2 text-ivory">Send me a code</button>
            ) : (
              <div className="flex gap-2">
                <input className={`${box} text-center tracking-[0.3em]`} inputMode="numeric" maxLength={6} placeholder="000000" value={vCode} onChange={(e) => setVCode(e.target.value.replace(/\D/g, ""))} />
                <button disabled={vCode.length !== 6} onClick={() => void checkVCode()} className="shrink-0 rounded-full bg-claret px-5 text-ivory disabled:opacity-50">Verify</button>
              </div>
            )}
            {vMsg && <p>{vMsg}</p>}
          </div>
        )}
        {timing === "ON_DELIVERY" && !needsVerify && f.phone && <p className="text-sm">✓ Phone verified</p>}
      </section>

      <section className="space-y-1 rounded-sm border border-champagne/40 bg-white/50 p-4 text-sm">
        <div className="flex justify-between"><span>Items</span><span>{q ? kes(q.subtotal) : "…"}</span></div>
        {q?.discount && <div className="flex justify-between"><span>Discount {q.discount.code}</span><span>− {kes(q.discount.amount)}</span></div>}
        <div className="flex justify-between"><span>Delivery</span><span>{q?.delivery.selected ? (q.deliveryFee === 0 ? "Free" : kes(q.deliveryFee)) : "Choose your location"}</span></div>
        <div className="flex justify-between border-t border-champagne/40 pt-2 text-lg font-semibold"><span>Total</span><span>{q ? kes(q.total) : "…"}</span></div>
      </section>

      <div className="space-y-3">
        {!profile && <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember my details on this device for next time</label>}
        <button disabled={busy || !q || (!nowOk && !podOk)} onClick={() => void submit()} className="w-full rounded-full bg-claret py-3 text-ivory disabled:opacity-50">{busy ? "Placing your order…" : label}</button>
        {msg && <p className="text-sm">{msg}</p>}
        <WhatsAppButton source="cart" getItems={() => items.map((i) => ({ variantId: i.variantId, qty: i.qty }))} label="Order on WhatsApp instead" />
      </div>
    </div>
  );
}
