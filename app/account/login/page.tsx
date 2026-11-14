"use client";
import { useState } from "react";
import { requestCode, verifyCode } from "../../actions";

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const box = "w-full rounded-sm border border-champagne/60 bg-white/70 p-3";

  async function send() {
    setBusy(true); setError("");
    const r = await requestCode(phone);
    setBusy(false);
    if (r.ok) setStep("code"); else setError(r.error ?? "Could not send the code");
  }

  async function check() {
    setBusy(true); setError("");
    const r = await verifyCode(phone, code.trim());
    if (r?.error) { setError(r.error); setBusy(false); }
  }

  return (
    <div className="mx-auto max-w-sm space-y-4">
      <h1 className="font-serif text-4xl">Sign in</h1>
      {step === "phone" ? (
        <>
          <p className="text-sm text-claret/70">Enter your phone number and we&apos;ll text you a code. No password needed.</p>
          <input className={box} inputMode="tel" autoComplete="tel" placeholder="Phone (07xx…)" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <button disabled={busy || phone.trim().length < 9} onClick={send} className="w-full rounded-full bg-claret py-3 text-ivory disabled:opacity-50">{busy ? "Sending…" : "Send me a code"}</button>
        </>
      ) : (
        <>
          <p className="text-sm text-claret/70">We sent a 6-digit code to {phone}. It lasts 5 minutes.</p>
          <input className={`${box} text-center text-2xl tracking-[0.4em]`} inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="000000" value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))} />
          <button disabled={busy || code.length !== 6} onClick={check} className="w-full rounded-full bg-claret py-3 text-ivory disabled:opacity-50">{busy ? "Checking…" : "Sign in"}</button>
          <button onClick={() => { setStep("phone"); setCode(""); setError(""); }} className="text-sm underline">Use a different number or send a new code</button>
        </>
      )}
      {error && <p className="text-sm">{error}</p>}
      <p className="text-xs text-claret/60">Orders you made with this number will appear in your account.</p>
    </div>
  );
}
