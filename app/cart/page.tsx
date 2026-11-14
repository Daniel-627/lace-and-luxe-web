import { apiAuth, getProfile } from "../../lib/session";
import type { Address } from "../../lib/account";
import CartClient from "../../components/CartClient";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const profile = await getProfile();
  const addresses = profile ? (await apiAuth<Address[]>("/api/me/addresses")).data ?? [] : [];
  return <CartClient profile={profile} addresses={addresses} />;
}
