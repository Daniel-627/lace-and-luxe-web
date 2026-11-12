import { kes } from "./api";
import type { Product, Variant } from "./types";

export const hasStock = (p: Product) => (p.variants ?? []).some((v) => v.stock > 0);

export function priceLabel(p: Product): string {
  const vs = p.variants ?? [];
  if (vs.length === 0) return "";
  const prices = vs.map((v) => v.price);
  const min = Math.min(...prices), max = Math.max(...prices);
  return min === max ? kes(min) : `From ${kes(min)}`;
}

export const colourList = (vs: Variant[] = []) =>
  Array.from(new Map(vs.map((v) => [v.colour, v.colourHex] as const)).entries()).map(([name, hex]) => ({ name, hex }));
