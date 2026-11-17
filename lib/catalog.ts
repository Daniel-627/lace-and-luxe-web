import { API } from "./api";
import type { Product } from "./types";

export interface Facets {
  sizes: string[]; colours: { name: string; hex: string | null }[]; priceMin: number; priceMax: number;
  categories: { slug: string; name: string; count: number }[];
}
export interface SearchResult { products: Product[]; total: number; page: number; pageSize: number; facets: Facets }

/** Never throws: if the API is down the shop shows an empty list. */
export async function searchProducts(qs: URLSearchParams): Promise<SearchResult> {
  try {
    const r = await fetch(`${API}/api/products/search?${qs}`, { next: { revalidate: 30 } });
    if (r.ok) return await r.json();
  } catch { /* fall through */ }
  return { products: [], total: 0, page: 1, pageSize: 24, facets: { sizes: [], colours: [], priceMin: 0, priceMax: 0, categories: [] } };
}
