import { post } from "./api";

export interface LeadItem { variantId: number; qty: number }

/** Saves the lead on the server, then opens WhatsApp with the order already typed out. */
export async function orderOnWhatsApp(source: "product" | "cart", items: LeadItem[]): Promise<void> {
  const tab = window.open("", "_blank"); // opened first so phone browsers don't block it
  try {
    const { url } = await post<{ reference: string; url: string }>("/api/leads", { source, items });
    if (tab) tab.location.href = url;
    else window.location.href = url;
  } catch (e) {
    tab?.close();
    throw e;
  }
}
