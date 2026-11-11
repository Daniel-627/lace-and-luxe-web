"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { CartItem, Product } from "../lib/types";

interface CartCtx {
  items: CartItem[]; total: number;
  add: (p: Pick<Product, "id" | "name" | "price">) => void;
  remove: (id: number) => void;
  clear: () => void;
}
const Ctx = createContext<CartCtx | null>(null);

export const useCart = (): CartCtx => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used inside CartProvider");
  return c;
};

export default function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem("cart") || "[]")); } catch {}
    setReady(true);
  }, []);
  useEffect(() => { if (ready) localStorage.setItem("cart", JSON.stringify(items)); }, [items, ready]);

  const add: CartCtx["add"] = (p) =>
    setItems((c) => c.some((i) => i.id === p.id)
      ? c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i))
      : [...c, { id: p.id, name: p.name, price: p.price, qty: 1 }]);
  const remove = (id: number) => setItems((c) => c.filter((i) => i.id !== id));
  const clear = () => setItems([]);
  const total = items.reduce((s, i) => s + i.price * i.qty, 0);

  return <Ctx.Provider value={{ items, total, add, remove, clear }}>{children}</Ctx.Provider>;
}
