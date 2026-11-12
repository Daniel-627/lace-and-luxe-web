"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem } from "../lib/types";

interface CartCtx {
  items: CartItem[]; total: number;
  add: (i: Omit<CartItem, "qty">) => void;
  remove: (variantId: number) => void;
  clear: () => void;
}
const Ctx = createContext<CartCtx | null>(null);

export const useCart = (): CartCtx => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};

const KEY = "cart-v2"; // new key: older carts had no sizes or colours

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem(KEY, JSON.stringify(items)); }, [items, ready]);

  const add: CartCtx["add"] = (i) =>
    setItems((c) => c.some((x) => x.variantId === i.variantId)
      ? c.map((x) => (x.variantId === i.variantId ? { ...x, qty: x.qty + 1 } : x))
      : [...c, { ...i, qty: 1 }]);
  const remove = (variantId: number) => setItems((c) => c.filter((x) => x.variantId !== variantId));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return <Ctx.Provider value={{ items, total, add, remove, clear }}>{children}</Ctx.Provider>;
}
