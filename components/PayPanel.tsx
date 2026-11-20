"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { claimManual, startMpesa } from "../app/actions";
import { payHow, type PayAccount } from "../lib/checkout";

const box = "w-full rounded-sm border border-champagne/60 bg-white/70 p-3";

export default function PayPanel({ token, reference, total, stk, accounts, claimed, payNote, expiresAt }: {
  token: string; reference: string; total: number; stk: boolean; accounts: PayAccount[]; claimed: string | null; payNote: string | null; expiresAt: string | null;
}) {
  const router = useRouter();
  const [now, setNow] = useState(0);
  const [useOther, setUseOther] = useState(false);
  const [other, setOther] = useState("");
  const [acc, setAcc] = useState<number | null>(accounts[0]?.id ?? null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(t); }, []);
  const left = expiresAt && now ? Date.parse(expiresAt) - now : null;

  if (claimed) {
    return (
      <div className="rounded-2xl border border-champagne/40 bg-white/60 p-5">
        <p className="font-serif text-2xl">Thank you</p>
        <p className="mt-1 text-sm">We have your M-Pesa code <b>{claimed}</b>. We&apos;ll check it and confirm your order shortly. This page updates by itself.</p>
      </div>
    );
  }

  async function sendPrompt() {
    setBusy(true); setMsg("");
    const r = await startMpesa(token, useOther ? other : undefined);
    setBusy(false);
    setMsg(r.ok ? "Check your phone and enter your M-Pesa PIN. This page updates by itself." : r.error ?? "Could not send the prompt.");
    router.refresh();
  }

  async function sendCode() {
    if (code.trim().length < 8) return setMsg("Type the M-Pesa code from your payment message.");
    setBusy(true); setMsg("");
    const r = await claimManual(token, code.trim(), acc ?? undefined);
    setBusy(false);
    if (r.ok) router.refresh(); else setMsg(r.error ?? "Could not send the code.");
  }

  const chosen = accounts.find((a) => a.id === acc);
  return (
    <div className="space-y-6 rounded-2xl border border-champagne/40 bg-white/60 p-5">
      <div>
        <p className="font-serif text-2xl">Pay for your order</p>
        {left !== null && left > 0 && <p className="text-sm text-claret/70">Please pay within {Math.ceil(left / 60000)} minutes, or the items are released.</p>}
        {payNote && <p className="mt-1 text-sm font-medium">{payNote}</p>}
      </div>

      {stk && (
        <div className="space-y-3">
          <p className="text-sm font-medium">Get an M-Pesa prompt on your phone</p>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={useOther} onChange={(e) => setUseOther(e.target.checked)} /> Pay from a different number</label>
          {useOther && <input className={box} inputMode="tel" placeholder="Safaricom number (07xx…)" value={other} onChange={(e) => setOther(e.target.value)} />}
          <button disabled={busy} onClick={() => void sendPrompt()} className="rounded-full bg-claret px-6 py-2.5 text-sm text-ivory disabled:opacity-50">{payNote ? "Send the prompt again" : "Send the M-Pesa prompt"}</button>
        </div>
      )}

      {accounts.length > 0 && (
        <div className="space-y-3 border-t border-champagne/40 pt-5">
          <p className="text-sm font-medium">{stk ? "Or pay by hand" : "Pay by hand"}</p>
          {accounts.length > 1 && (
            <select className={box} value={acc ?? ""} onChange={(e) => setAcc(Number(e.target.value))}>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.displayName} ({a.kind === "TILL" ? "Till" : a.kind === "PAYBILL" ? "Paybill" : "Pochi la Biashara"} {a.number})</option>)}
            </select>
          )}
          {chosen && <ol className="list-decimal space-y-1 pl-5 text-sm">{payHow(chosen, total, reference).map((s, i) => <li key={i}>{s}</li>)}</ol>}
          <div className="space-y-2 rounded-xl border border-claret bg-white p-4">
            <p className="text-sm font-medium">After you have paid, enter your M-Pesa code</p>
            <p className="text-xs text-claret/70">It is in the message M-Pesa sends you: 10 letters and numbers, like QGH7XYZ123.</p>
            <input className={`${box} uppercase tracking-widest`} placeholder="e.g. QGH7XYZ123" maxLength={12} autoComplete="off" autoCapitalize="characters" spellCheck={false} value={code}
              onChange={(e) => setCode(e.target.value.replace(/[^A-Za-z0-9]/g, ""))} onKeyDown={(e) => { if (e.key === "Enter" && !busy) void sendCode(); }} />
            <button disabled={busy} onClick={() => void sendCode()} className="rounded-full bg-claret px-6 py-2.5 text-sm text-ivory disabled:opacity-50">{busy ? "Sending…" : "I\u2019ve paid"}</button>
          </div>
        </div>
      )}
      {!stk && <p className="border-t border-champagne/40 pt-4 text-xs text-claret/60">M-Pesa prompts and card payments are coming soon.</p>}
      {msg && <p className="text-sm">{msg}</p>}
    </div>
  );
}
