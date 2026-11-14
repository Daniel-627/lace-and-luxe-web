export interface Profile { id: number; phone: string; name: string | null; email: string | null }
export interface Address { id: number; label: string; name: string; phone: string; county: string; area: string; details: string }
export interface OrderSummary {
  reference: string; status: "PENDING" | "PAID" | "FAILED"; fulfilment: string; total: number; createdAt: string; trackingToken: string;
  items: { name: string; size: string; colour: string; price: number; qty: number }[];
}
