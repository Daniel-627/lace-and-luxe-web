import { cookies, headers } from "next/headers";
import { API } from "./api";
import type { Profile } from "./account";

export const COOKIE = "ll_session";

/** Lets the API tell customers apart: this server's calls carry a shared secret and the visitor's address. */
export function edgeHeaders(): Record<string, string> {
  const key = process.env.SHOP_API_KEY;
  if (!key) return {};
  const h: Record<string, string> = { "x-shop-key": key };
  const ip = headers().get("x-forwarded-for")?.split(",")[0]?.trim();
  if (ip) h["x-client-ip"] = ip;
  return h;
}

/** Server-side call to the API as the signed-in customer. Never throws. */
export async function apiAuth<T>(path: string, init: RequestInit = {}): Promise<{ status: number; data: T | null; error?: string }> {
  const token = cookies().get(COOKIE)?.value;
  const res = await fetch(`${API}${path}`, {
    ...init,
    cache: "no-store",
    headers: { "Content-Type": "application/json", ...edgeHeaders(), ...(token ? { Authorization: `Bearer ${token}` } : {}), ...init.headers },
  }).catch(() => null);
  if (!res) return { status: 0, data: null, error: "Can't reach the shop right now. Please try again." };
  const body = await res.json().catch(() => null);
  if (res.ok) return { status: res.status, data: body as T };
  return { status: res.status, data: null, error: (body as { error?: string } | null)?.error ?? "Something went wrong" };
}

export async function getProfile(): Promise<Profile | null> {
  if (!cookies().get(COOKIE)) return null;
  return (await apiAuth<Profile>("/api/me")).data;
}
