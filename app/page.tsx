import { API, kes } from "../lib/api";
import type { Product } from "../lib/types";
import AddToCart from "../components/AddToCart";

export default async function Home() {
  const res = await fetch(`${API}/api/products`, { next: { revalidate: 60 } });
  const products: Product[] = res.ok ? await res.json() : [];
  return (
    <section>
      <h1 className="mb-4 text-2xl font-bold">Shop</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {products.map((p) => (
          <div key={p.id} className="rounded border p-3">
            <div className="aspect-square rounded bg-slate-100" style={p.image ? { background: `url(${p.image}) center/cover` } : undefined} />
            <h2 className="mt-2 font-medium">{p.name}</h2>
            <p className="text-accent">{kes(p.price)}</p>
            <AddToCart product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
