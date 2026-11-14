import { notFound } from "next/navigation";
import { API } from "../../../lib/api";
import type { Product } from "../../../lib/types";
import ProductView from "../../../components/ProductView";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const res = await fetch(`${API}/api/products/${params.slug}`, { cache: "no-store" });
  if (!res.ok) notFound();
  const p: Product = await res.json();
  return <ProductView product={p} />;
}
