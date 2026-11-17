"use client";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { addWish, removeWish, syncWishlist } from "../app/actions";

const KEY = "wishlist-v1";
interface Ctx { ids: number[]; has: (id: number) => boolean; toggle: (id: number) => void }
const C = createContext<Ctx>({ ids: [], has: () => false, toggle: () => {} });
export const useWishlist = () => useContext(C);

/** Saved on this device for everyone, and kept on the account too when signed in. */
export default function WishlistProvider({ signedIn, children }: { signedIn: boolean; children: ReactNode }) {
  const [ids, setIds] = useState<number[]>([]);
  const save = (next: number[]) => { setIds(next); try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage unavailable */ } };

  useEffect(() => {
    let local: number[] = [];
    try { local = JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { /* ignore */ }
    setIds(local);
    if (signedIn) void syncWishlist(local).then((r) => { if (r.ids) save(r.ids); });
  }, [signedIn]);

  function toggle(id: number) {
    const on = ids.includes(id);
    save(on ? ids.filter((x) => x !== id) : [id, ...ids]);
    if (signedIn) void (on ? removeWish(id) : addWish(id));
  }
  return <C.Provider value={{ ids, has: (id) => ids.includes(id), toggle }}>{children}</C.Provider>;
}
