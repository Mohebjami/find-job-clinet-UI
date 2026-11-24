"use client";

import Link from "next/link";
import { Apple, BadgePercent, CakeSlice, Carrot, ChevronLeft, Coffee, Croissant, Egg, Grid2X2, Heart, Leaf, Milk, Pill, ShieldCheck, ShoppingBasket, Sprout, Store, Truck, Wheat, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";

const categoryIcons: Record<string, LucideIcon> = { "All stores": Grid2X2, Grocery: ShoppingBasket, Supermarket: Store, Organic: Leaf, Pharmacy: Pill, Specialty: Croissant, "All products": Grid2X2, "Fruit & vegetables": Carrot, "Dairy & eggs": Egg, Bakery: Croissant, Pantry: Wheat, "Drinks & snacks": Coffee, "Sweet treats": CakeSlice, "Fresh bread": Wheat, Pastries: Croissant, Vitamins: Pill, "Skin care": Leaf, "Personal care": Milk, "Everyday essentials": Apple };

export function ShoppingSidebar({ categories, selected, onChange, view, onViewChange, products = false, children }: { categories: string[]; selected: string; onChange: (category: string) => void; view: string; onViewChange: (view: string) => void; products?: boolean; children?: ReactNode }) {
  return <aside className="shopping-sidebar" aria-label="Shopping navigation">
    {products && <Link href="/stores" className="back-to-stores"><ChevronLeft size={17} />Back to all stores</Link>}
    <p className="sidebar-caption">{products ? "SHOP THIS STORE" : "LET’S FIND YOUR FRESH"}</p>
    <nav aria-label={products ? "Product categories" : "Store categories"} className="sidebar-categories">
      {categories.map((category) => { const Icon = categoryIcons[category] ?? ShoppingBasket; return <button type="button" key={category} className={selected === category && view === "all" ? "sidebar-link active" : "sidebar-link"} aria-pressed={selected === category && view === "all"} onClick={() => { onChange(category); onViewChange("all"); }}><Icon size={19} strokeWidth={1.7} />{category}{category === "All stores" && <span className="sidebar-number">8</span>}</button>; })}
    </nav>
    <div className="sidebar-secondary"><button type="button" onClick={() => onViewChange(view === "offers" ? "all" : "offers")} aria-pressed={view === "offers"} className={`sidebar-link ${view === "offers" ? "active" : ""}`}><BadgePercent size={19} strokeWidth={1.7} />Offers & savings<span className="new-tag">NEW</span></button><button type="button" onClick={() => onViewChange(view === "saved" ? "all" : "saved")} aria-pressed={view === "saved"} className={`sidebar-link ${view === "saved" ? "active" : ""}`}><Heart size={19} strokeWidth={1.7} />{products ? "Saved products" : "Saved stores"}</button></div>
    {children}
    <div className="sidebar-note"><span className="sidebar-note-icon"><Sprout size={24} /></span><h3>Good food.<br />Good neighbors.</h3><p>Your favorite local stores, all in one happy place.</p><span className="note-decoration" aria-hidden="true"><Leaf size={65} strokeWidth={0.8} /></span></div>
    <div className="sidebar-trust"><ShieldCheck size={17} />Freshness, always.<br /><Truck size={17} />Delivered with care.</div>
  </aside>;
}
