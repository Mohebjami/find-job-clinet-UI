import { products } from "./data";

export type CartItem = { productId: string; quantity: number };
export const CART_STORAGE_KEY = "sprout-cart-v1";
export const MAX_QUANTITY = 99;

export function parseCart(value: string | null): CartItem[] {
  try {
    const parsed: unknown = JSON.parse(value ?? "[]");
    if (!Array.isArray(parsed)) return [];
    const items = new Map<string, number>();
    for (const item of parsed) {
      if (!item || typeof item !== "object" || typeof item.productId !== "string" || !products.some((product) => product.id === item.productId) || !Number.isInteger(item.quantity) || item.quantity <= 0) continue;
      items.set(item.productId, Math.min(MAX_QUANTITY, item.quantity));
    }
    return Array.from(items, ([productId, quantity]) => ({ productId, quantity }));
  } catch {
    return [];
  }
}

export function updateCart(items: CartItem[], productId: string, quantity: number): CartItem[] {
  if (!products.some((product) => product.id === productId) || !Number.isFinite(quantity)) return items;
  const safeQuantity = Math.min(MAX_QUANTITY, Math.max(0, Math.floor(quantity)));
  if (safeQuantity === 0) return items.filter((item) => item.productId !== productId);
  if (items.some((item) => item.productId === productId)) return items.map((item) => item.productId === productId ? { ...item, quantity: safeQuantity } : item);
  return [...items, { productId, quantity: safeQuantity }];
}

export function cartTotals(items: CartItem[]) {
  return items.reduce((totals, item) => {
    const product = products.find((product) => product.id === item.productId);
    if (!product) return totals;
    return { count: totals.count + item.quantity, subtotal: totals.subtotal + Math.round(product.price * 100) * item.quantity };
  }, { count: 0, subtotal: 0 });
}
