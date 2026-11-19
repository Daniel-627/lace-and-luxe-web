import { API } from "./api";

export interface ShopCategory { slug: string; name: string; count: number; image: string | null }

/** How many categories sit directly in the desktop menu; the rest go under "More". Keep in step with the admin's SHOP_MENU_SLOTS. */
export const MENU_SLOTS = 4;
/** Phones scroll sideways, so they can show more before pointing to the full page. */
export const MOBILE_STRIP = 10;

/** In the owner's order, only categories that have something to see. Never throws. */
export async function getCategories(): Promise<ShopCategory[]> {
  try {
    const r = await fetch(`${API}/api/products/categories`, { next: { revalidate: 60 } });
    if (!r.ok) return [];
    const d: unknown = await r.json();
    return Array.isArray(d) ? (d as ShopCategory[]) : [];
  } catch { return []; }
}
