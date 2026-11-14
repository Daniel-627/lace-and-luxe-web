import Link from "next/link";
import { redirect } from "next/navigation";
import { apiAuth, getProfile } from "../../lib/session";
import { kes } from "../../lib/api";
import type { Address, OrderSummary } from "../../lib/account";
import { logout } from "../actions";
import ProfileForm from "../../components/ProfileForm";
import AddressBook from "../../components/AddressBook";

export const dynamic = "force-dynamic";
export const metadata = { title: "My account | Lace & Luxe" };

const PAY = { PENDING: "Awaiting payment", PAID: "Paid", FAILED: "Payment failed" } as const;
const FULFIL: Record<string, string> = { NEW: "Order received", PACKED: "Packed", OUT_FOR_DELIVERY: "On its way", DELIVERED: "Delivered", CANCELLED: "Cancelled" };
const day = new Intl.DateTimeFormat("en-KE", { timeZone: "Africa/Nairobi", dateStyle: "medium" });

export default async function AccountPage() {
  const profile = await getProfile();
  if (!profile) redirect("/account/login");
  const [orders, addresses] = await Promise.all([
    apiAuth<OrderSummary[]>("/api/me/orders").then((r) => r.data ?? []),
    apiAuth<Address[]>("/api/me/addresses").then((r) => r.data ?? []),
  ]);

  return (
    <div className="mx-auto max-w-3xl space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-5xl">{profile.name ? `Hello, ${profile.name.split(" ")[0]}` : "Your account"}</h1>
          <p className="mt-1 text-sm text-claret/70">Signed in with {profile.phone}</p>
        </div>
        <form action={logout}><button className="text-sm underline">Sign out</button></form>
      </div>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">Your details</h2>
        <ProfileForm initialName={profile.name ?? ""} initialEmail={profile.email ?? ""} />
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">My orders</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-claret/70">No orders yet. <Link href="/shop" className="underline">Start shopping</Link></p>
        ) : (
          <ul className="space-y-3">
            {orders.map((o) => (
              <li key={o.reference}>
                <Link href={`/track/${o.trackingToken}`} className="block rounded-2xl border border-champagne/40 bg-white/50 p-4 transition hover:bg-white">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <span className="font-serif text-2xl">{o.reference}</span>
                    <span className="text-sm text-claret/70">{day.format(new Date(o.createdAt))}</span>
                  </div>
                  <p className="mt-1 text-sm">{o.items.map((i) => `${i.name} × ${i.qty}`).join(", ")}</p>
                  <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-sm">
                    <span className="text-claret/70">{PAY[o.status]} · {FULFIL[o.fulfilment] ?? o.fulfilment}</span>
                    <span className="font-medium">{kes(o.total)}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="font-serif text-3xl">Delivery contacts</h2>
        <AddressBook addresses={addresses} />
      </section>
    </div>
  );
}
