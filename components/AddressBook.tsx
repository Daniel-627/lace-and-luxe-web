"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { addAddress, deleteAddress } from "../app/actions";
import type { Address } from "../lib/account";

const empty = { label: "", name: "", phone: "", county: "", area: "", details: "" };

export default function AddressBook({ addresses }: { addresses: Address[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [f, setF] = useState(empty);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);
  const box = "w-full rounded-sm border border-champagne/60 bg-white/70 p-3";
  const set = (k: keyof typeof empty) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  async function add() {
    setMsg("");
    if (!f.label.trim() || f.name.trim().length < 2 || !f.phone.trim() || f.county.trim().length < 2 || f.area.trim().length < 2) return setMsg("Please fill in the label, name, phone, county and area.");
    setBusy(true);
    const r = await addAddress(f);
    setBusy(false);
    if (r.ok) { setF(empty); setOpen(false); router.refresh(); } else setMsg(r.error ?? "Could not save");
  }

  async function remove(id: number) {
    if (!confirm("Remove this delivery contact?")) return;
    await deleteAddress(id);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {addresses.length === 0 && <p className="text-sm text-claret/70">No saved delivery contacts yet. Add one for home, work, or a gift.</p>}
      {addresses.map((a) => (
        <div key={a.id} className="flex items-start justify-between gap-4 rounded-2xl border border-champagne/40 bg-white/50 p-4 text-sm">
          <div>
            <p className="font-medium">{a.label}</p>
            <p>{a.name} · {a.phone}</p>
            <p className="text-claret/70">{a.area}, {a.county}{a.details ? ` · ${a.details}` : ""}</p>
          </div>
          <button onClick={() => remove(a.id)} className="underline">Remove</button>
        </div>
      ))}
      {open ? (
        <div className="space-y-3 rounded-2xl border border-dashed border-champagne p-4">
          <input className={box} placeholder="Label (Home, Work, For Mum…)" value={f.label} onChange={set("label")} />
          <div className="grid gap-3 md:grid-cols-2">
            <input className={box} placeholder="Name" value={f.name} onChange={set("name")} />
            <input className={box} inputMode="tel" placeholder="Phone" value={f.phone} onChange={set("phone")} />
            <input className={box} placeholder="County" value={f.county} onChange={set("county")} />
            <input className={box} placeholder="Area / town" value={f.area} onChange={set("area")} />
          </div>
          <input className={box} placeholder="Building, landmark (optional)" value={f.details} onChange={set("details")} />
          <div className="flex gap-3">
            <button disabled={busy} onClick={add} className="rounded-full bg-claret px-6 py-2 text-sm text-ivory disabled:opacity-50">{busy ? "Saving…" : "Save contact"}</button>
            <button onClick={() => setOpen(false)} className="text-sm underline">Cancel</button>
          </div>
          {msg && <p className="text-sm">{msg}</p>}
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className="rounded-full border border-claret px-6 py-2 text-sm">+ Add a delivery contact</button>
      )}
    </div>
  );
}
