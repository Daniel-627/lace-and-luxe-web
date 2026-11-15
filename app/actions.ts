"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE, apiAuth } from "../lib/session";

type Res = { ok?: true; error?: string };

export async function requestCode(phone: string): Promise<{ ok?: true; manual?: boolean; error?: string }> {
  const r = await apiAuth<{ manual?: boolean }>("/api/auth/request-code", { method: "POST", body: JSON.stringify({ phone }) });
  return r.error ? { error: r.error } : { ok: true, manual: !!r.data?.manual };
}

export async function verifyCode(phone: string, code: string): Promise<{ error: string }> {
  const r = await apiAuth<{ token: string }>("/api/auth/verify", { method: "POST", body: JSON.stringify({ phone, code }) });
  if (!r.data) return { error: r.error ?? "That code is not right, or it has expired." };
  cookies().set(COOKIE, r.data.token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 30 * 24 * 3600 });
  redirect("/account");
}

export async function logout(): Promise<void> {
  await apiAuth("/api/auth/logout", { method: "POST" });
  cookies().delete(COOKIE);
  redirect("/");
}

export async function saveProfile(name: string, email: string): Promise<Res> {
  const body: Record<string, string> = {};
  if (name.trim()) body.name = name.trim();
  if (email.trim()) body.email = email.trim();
  const r = await apiAuth("/api/me", { method: "PATCH", body: JSON.stringify(body) });
  return r.error ? { error: r.error } : { ok: true };
}

export interface AddressInput { label: string; name: string; phone: string; county: string; area: string; details: string }

export async function addAddress(a: AddressInput): Promise<Res> {
  const r = await apiAuth("/api/me/addresses", { method: "POST", body: JSON.stringify(a) });
  return r.error ? { error: r.error } : { ok: true };
}

export async function deleteAddress(id: number): Promise<Res> {
  const r = await apiAuth(`/api/me/addresses/${id}`, { method: "DELETE" });
  return r.error ? { error: r.error } : { ok: true };
}
