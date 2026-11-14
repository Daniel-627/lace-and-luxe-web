"use client";
import { useMemo, useState } from "react";
import { useCart } from "./CartProvider";
import WhatsAppButton from "./WhatsAppButton";
import { kes } from "../lib/api";
import { colourList, priceLabel } from "../lib/product";
import type { Product } from "../lib/types";

export default function VariantPicker({ product, colour: colourProp, onColourChange }: { product: Product; colour?: string; onColourChange?: (c: string) => void }) {
  const { add } = useCart();
  const colours = useMemo(() => colourList(product.variants), [product.variants]);
  const [ownColour, setOwnColour] = useState(colours[0]?.name ?? "");
  const colour = colourProp ?? ownColour;
  const setColour = (c: string) => { setOwnColour(c); onColourChange?.(c); };
  const [size, setSize] = useState("");
  const [added, setAdded] = useState(false);

  if (product.variants.length === 0) return <p>Not available right now.</p>;

  const options = product.variants.filter((v) => v.colour === colour);
  const chosen = options.find((v) => v.size === size);
  const status = !chosen ? "Choose a size" : chosen.stock <= 0 ? "Sold out" : chosen.stock <= 3 ? "Only a few left" : "In stock";

  function addToCart() {
    if (!chosen || chosen.stock <= 0) return;
    add({ variantId: chosen.id, name: product.name, size: chosen.size, colour: chosen.colour, price: chosen.price });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  }

  return (
    <div className="space-y-5">
      <p className="text-2xl">{chosen ? kes(chosen.price) : priceLabel(product)}</p>

      <div>
        <p className="mb-2 text-sm">Colour: <span className="font-medium">{colour}</span></p>
        <div className="flex gap-3">
          {colours.map((c) => (
            <button key={c.name} onClick={() => { setColour(c.name); setSize(""); }} aria-label={c.name} title={c.name}
              style={{ background: c.hex ?? "#C99A9A" }}
              className={`h-9 w-9 rounded-full ring-offset-2 ring-offset-ivory transition ${colour === c.name ? "ring-2 ring-claret" : "ring-1 ring-claret/20 hover:ring-claret/60"}`} />
          ))}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm">Size</p>
        <div className="flex flex-wrap gap-2">
          {options.map((v) => (
            <button key={v.id} disabled={v.stock <= 0} onClick={() => setSize(v.size)}
              className={`min-w-12 rounded-full border px-4 py-2 text-sm transition disabled:cursor-not-allowed disabled:line-through disabled:opacity-40 ${size === v.size ? "border-claret bg-claret text-ivory" : "border-claret/30 hover:border-claret"}`}>
              {v.size}
            </button>
          ))}
        </div>
      </div>

      <p className="text-sm text-claret/70">{status}</p>
      <button onClick={addToCart} disabled={!chosen || chosen.stock <= 0}
        className="w-full rounded-full bg-claret py-3 text-sm tracking-wide text-ivory transition hover:bg-claret/90 disabled:cursor-not-allowed disabled:opacity-40">
        {added ? "Added ✓" : chosen ? "Add to cart" : "Choose a size"}
      </button>
      <WhatsAppButton source="product" disabled={!chosen || chosen.stock <= 0}
        getItems={() => (chosen ? [{ variantId: chosen.id, qty: 1 }] : [])} />
    </div>
  );
}
