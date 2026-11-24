import type { Metadata } from "next";
import { ShoppingProvider } from "@/components/grocery/shopping-provider";
import { Header } from "@/components/grocery/header";
import { CartDrawer } from "@/components/grocery/cart-summary";
import "./stores.css";

export const metadata: Metadata = {
  title: { absolute: "Sprout — Your neighborhood, delivered" },
  description: "Shop fresh groceries, everyday essentials, and local favorites from the neighborhood stores you love. Discover a little fresher with Sprout.",
};

export default function StoresLayout({ children }: { children: React.ReactNode }) {
  return <div className="sprout-app"><ShoppingProvider><Header />{children}<CartDrawer /></ShoppingProvider></div>;
}
