"use client";
import { useState } from "react";
import { orderOnWhatsApp, type LeadItem } from "../lib/whatsapp";

export default function WhatsAppButton({
  source, getItems, disabled = false, label = "Order on WhatsApp",
}: { source: "product" | "cart"; getItems: () => LeadItem[]; disabled?: boolean; label?: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function click() {
    const items = getItems();
    if (items.length === 0) return;
    setBusy(true); setError("");
    try { await orderOnWhatsApp(source, items); }
    catch (e) { setError(e instanceof Error ? e.message : "Could not open WhatsApp"); }
    finally { setBusy(false); }
  }

  return (
    <div>
      <button onClick={click} disabled={disabled || busy}
        className="w-full rounded-full border border-claret py-3 text-sm tracking-wide text-claret transition hover:bg-claret hover:text-ivory disabled:cursor-not-allowed disabled:opacity-40">
        {busy ? "Opening WhatsApp…" : label}
      </button>
      <p className="mt-2 text-center text-xs text-claret/60">We confirm your order and take payment in the chat.</p>
      {error && <p className="mt-1 text-center text-sm">{error}</p>}
    </div>
  );
}
