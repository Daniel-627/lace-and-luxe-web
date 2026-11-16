export interface DeliveryOption { serviceId: number; name: string; description: string; etaText: string; fee: number; free: boolean; allowsCod: boolean }
export interface PayAccount { id: number; kind: "TILL" | "PAYBILL" | "POCHI"; displayName: string; number: string; accountNumber: string | null; useOrderRef: boolean }
export interface QuoteInput { items: { variantId: number; qty: number }[]; county?: string; area?: string; serviceId?: number; code?: string }
export interface Quote {
  subtotal: number; discount: { code: string; amount: number } | null; discountError?: string; deliveryFee: number; total: number; problems: string[];
  delivery: { options: DeliveryOption[]; selected: DeliveryOption | null };
  pay: { now: { available: boolean; stk: boolean; accounts: PayAccount[] }; onDelivery: { available: boolean; reason: string | null } };
}

export const localPhone = (p: string) => (/^254\d{9}$/.test(p) ? `0${p.slice(3)}` : p);

/** Plain steps a customer follows to pay this account by hand. */
export function payHow(a: PayAccount, total: number, reference: string): string[] {
  const amount = `KES ${total.toLocaleString("en-US")}`;
  const name = `Check that the name shown is ${a.displayName} before you confirm.`;
  if (a.kind === "TILL") return [`Open M-Pesa, then Lipa na M-Pesa, then Buy Goods and Services.`, `Till number: ${a.number}`, `Amount: ${amount}`, name];
  if (a.kind === "PAYBILL") return [`Open M-Pesa, then Lipa na M-Pesa, then Pay Bill.`, `Business number: ${a.number}`, `Account number: ${a.useOrderRef ? reference : a.accountNumber}`, `Amount: ${amount}`, name];
  return [`Open M-Pesa, then Send Money.`, `Phone number: ${localPhone(a.number)} (Pochi la Biashara)`, `Amount: ${amount}`, name];
}
