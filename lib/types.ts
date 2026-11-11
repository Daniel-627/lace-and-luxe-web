export interface Category { id: number; name: string; slug: string }
export interface Product {
  id: number; name: string; slug: string; description: string;
  price: number; stock: number; image: string | null; category: Category | null;
}
export interface OrderItem { id: number; productId: number; name: string; price: number; qty: number }
export interface Order {
  id: number; email: string; phone: string; total: number;
  status: "PENDING" | "PAID" | "FAILED"; method: string | null; mpesaReceipt: string | null; items: OrderItem[];
}
export interface CartItem { id: number; name: string; price: number; qty: number }
