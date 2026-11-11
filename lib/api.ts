export const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
export const kes = (n: number) => `KES ${n.toLocaleString()}`;

export async function post<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${API}${path}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const d = await r.json();
  if (!r.ok) throw new Error(d.error || "Request failed");
  return d as T;
}
