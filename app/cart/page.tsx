import { apiAuth, getProfile } from "../../lib/session";
import type { Address } from "../../lib/account";
import CheckoutClient from "../../components/CheckoutClient";
import { FEATURES } from "../../lib/features";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const profile = FEATURES.accounts ? await getProfile() : null;
  const addresses = profile ? (await apiAuth<Address[]>("/api/me/addresses")).data ?? [] : [];
  return <CheckoutClient profile={profile} addresses={addresses} />;
}
