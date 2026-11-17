"use client";
import { useState } from "react";
import { submitReview } from "../app/actions";

export default function ReviewForm({ productId }: { productId: number }) {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [showName, setShowName] = useState(false);
  const [msg, setMsg] = useState("");
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const box = "w-full rounded-sm border border-champagne/60 bg-white/70 p-3";

  async function send() {
    if (!rating) return setMsg("Please choose a star rating.");
    setBusy(true); setMsg("");
    const r = await submitReview({ productId, rating, title, body, showName });
    setBusy(false);
    if (r.ok) setDone(true); else setMsg(r.error ?? "Could not send your review");
  }

  if (done) return <p className="rounded-2xl bg-rose/15 p-4 text-sm">Thank you! Your review will appear once we have read it.</p>;
  return (
    <div className="space-y-3 rounded-2xl border border-champagne/40 bg-white/50 p-5">
      <p className="font-serif text-2xl">Write a review</p>
      <div className="flex gap-1 text-3xl" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => <button key={n} type="button" role="radio" aria-checked={rating === n} aria-label={`${n} stars`} onClick={() => setRating(n)} className={n <= rating ? "text-champagne" : "text-claret/20"}>★</button>)}
      </div>
      <input className={box} placeholder="Title (optional)" maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} />
      <textarea className={box} rows={4} placeholder="How was the fit, comfort and quality?" value={body} onChange={(e) => setBody(e.target.value)} />
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={showName} onChange={(e) => setShowName(e.target.checked)} /> Show my first name (otherwise it says Verified buyer)</label>
      <button disabled={busy} onClick={() => void send()} className="rounded-full bg-claret px-6 py-2.5 text-sm text-ivory disabled:opacity-50">{busy ? "Sending…" : "Send review"}</button>
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
