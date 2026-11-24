"use client";

import { createContext, useContext, useEffect, useReducer, useState, type ReactNode } from "react";
import { CART_STORAGE_KEY, cartTotals, parseCart, updateCart, type CartItem } from "@/lib/grocery/cart";

type ShoppingState = { items: CartItem[]; saved: string[]; ready: boolean };
type Action = { type: "restore"; items: CartItem[]; saved: string[] } | { type: "quantity"; id: string; quantity: number } | { type: "save"; id: string };

function reducer(state: ShoppingState, action: Action): ShoppingState {
  if (action.type === "restore") return { items: action.items, saved: action.saved, ready: true };
  if (action.type === "quantity") return { ...state, items: updateCart(state.items, action.id, action.quantity) };
  return { ...state, saved: state.saved.includes(action.id) ? state.saved.filter((id) => id !== action.id) : [...state.saved, action.id] };
}

type ShoppingContextValue = ShoppingState & {
  setQuantity: (id: string, quantity: number) => void;
  toggleSaved: (id: string) => void;
  count: number;
  subtotal: number;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  storeQuery: string;
  setStoreQuery: (query: string) => void;
  address: string;
  setAddress: (address: string) => void;
};

const ShoppingContext = createContext<ShoppingContextValue | null>(null);

export function ShoppingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { items: [], saved: [], ready: false });
  const [cartOpen, setCartOpen] = useState(false);
  const [storeQuery, setStoreQuery] = useState("");
  const [address, setAddress] = useState("San Francisco, CA");

  useEffect(() => {
    let items: CartItem[] = [];
    let saved: string[] = [];
    try {
      items = parseCart(localStorage.getItem(CART_STORAGE_KEY));
      const parsed: unknown = JSON.parse(localStorage.getItem("sprout-saved-v1") ?? "[]");
      if (Array.isArray(parsed)) saved = parsed.filter((id): id is string => typeof id === "string");
    } catch { /* Shopping remains available when browser storage is disabled. */ }
    dispatch({ type: "restore", items, saved });
  }, []);

  useEffect(() => {
    if (!state.ready) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state.items));
      localStorage.setItem("sprout-saved-v1", JSON.stringify(state.saved));
    } catch { /* Keep the current session usable without persistent storage. */ }
  }, [state.items, state.saved, state.ready]);

  const totals = cartTotals(state.items);
  return (
    <ShoppingContext.Provider value={{ ...state, setQuantity: (id, quantity) => dispatch({ type: "quantity", id, quantity }), toggleSaved: (id) => dispatch({ type: "save", id }), count: totals.count, subtotal: totals.subtotal / 100, cartOpen, setCartOpen, storeQuery, setStoreQuery, address, setAddress }}>
      {children}
      <span className="sr-only" role="status" aria-live="polite">{totals.count} {totals.count === 1 ? "item" : "items"} in your shopping bag.</span>
    </ShoppingContext.Provider>
  );
}

export function useShopping() {
  const context = useContext(ShoppingContext);
  if (!context) throw new Error("Shopping components must be inside ShoppingProvider.");
  return context;
}
