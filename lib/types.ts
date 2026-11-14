export interface Category { id: number; name: string; slug: string }
export interface Variant {
  id: number; productId: number; sku: string; size: string; colour: string;
  colourHex: string | null; price: number; stock: number;
}
export interface Media { id: number; kind: "IMAGE" | "VIDEO"; url: string; colour: string | null; position: number }
export interface Product {
  id: number; name: string; slug: string; description: string; image: string | null;
  category: Category | null; variants: Variant[]; media?: Media[];
}
export interface CartItem { variantId: number; name: string; size: string; colour: string; price: number; qty: number }
