"use client";
import { useState } from "react";
import { saveProfile } from "../app/actions";

export default function ProfileForm({ initialName, initialEmail }: { initialName: string; initialEmail: string }) {
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const box = "w-full rounded-sm border border-champagne/60 bg-white/70 p-3";

  async function save() {
    setBusy(true); setMsg("");
    const r = await saveProfile(name, email);
    setBusy(false);
    setMsg(r.ok ? "Saved." : r.error ?? "Could not save");
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <input className={box} placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
      <input className={box} type="email" placeholder="Email (optional)" value={email} onChange={(e) => setEmail(e.target.value)} />
      <div className="flex items-center gap-4 md:col-span-2">
        <button disabled={busy} onClick={save} className="rounded-full border border-claret px-6 py-2 text-sm disabled:opacity-50">{busy ? "Saving…" : "Save details"}</button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>
    </div>
  );
}
