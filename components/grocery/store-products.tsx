"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, BadgePercent, ChevronRight, Clock3, Heart, Leaf, RotateCcw, SlidersHorizontal, Star, Tag, Truck } from "lucide-react";
import { formatMoney, getStoreProducts, type Store } from "@/lib/grocery/data";
import { useShopping } from "./shopping-provider";
import { ShoppingSidebar } from "./sidebar";
import { CategoryFilter, EmptyState, SearchBar, SortDropdown, StoreLogo } from "./ui";
import { ProductCard } from "./product-card";
import { CartSummary } from "./cart-summary";

export function StoreProducts({ store }: { store: Store }) {
  const products = getStoreProducts(store.id);
  const categories = ["All products", ...new Set(products.map((product) => product.category))];
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All products");
  const [sort, setSort] = useState("featured");
  const [view, setView] = useState("all");
  const [maxPrice, setMaxPrice] = useState(20);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { saved } = useShopping();
  const filtered = products.filter((product) => product.name.toLowerCase().includes(query.trim().toLowerCase()) && (category === "All products" || product.category === category) && product.price <= maxPrice && (view !== "offers" || !!product.originalPrice) && (view !== "saved" || saved.includes(product.id))).sort((a, b) => sort === "price-low" ? a.price - b.price : sort === "price-high" ? b.price - a.price : sort === "name" ? a.name.localeCompare(b.name) : 0);
  function reset() { setQuery(""); setCategory("All products"); setSort("featured"); setMaxPrice(20); setView("all"); }
  const filteredLabel = view === "saved" ? "Your saved favorites" : view === "offers" ? "A little more for a little less" : category === "All products" ? "Fresh finds for your everyday" : category;

  return <div className="shopping-layout">
    <ShoppingSidebar products categories={categories} selected={category} onChange={setCategory} view={view} onViewChange={setView} />
    <main id="shopping-content" className="shopping-main products-main">
      <nav aria-label="Breadcrumb" className="breadcrumb"><Link href="/stores">Stores</Link><ChevronRight size={13} /><span aria-current="page">{store.name}</span></nav>
      <section className="store-banner"><Image src={`/grocery/${store.cover}.jpg`} alt={`${store.name} store selection`} fill sizes="(max-width: 768px) 100vw, 85vw" preload /><div className="store-banner-overlay" /><span className="banner-store-tag"><BadgeCheck size={14} />Your neighborhood favorite</span><div className="store-banner-copy"><span className="hero-eyebrow">A LITTLE FRESHER. A LITTLE CLOSER.</span><h2>Good food starts here.</h2><p>{store.description}</p></div></section>
      <section className="store-details" aria-labelledby="store-title"><StoreLogo store={store} large /><div className="store-details-copy"><div className="store-title-row"><h1 id="store-title">{store.name}</h1><BadgeCheck className="verified-icon" size={22} /></div><p>{store.category} <span>·</span> {store.tags.join(" · ")}</p><div className="store-detail-meta"><span><Star size={15} fill="currentColor" className="star-icon" /><strong>{store.rating.toFixed(1)}</strong> ({store.reviews} reviews)</span><span><Clock3 size={15} />{store.deliveryMinutes}–{store.deliveryMinutes + 10} min</span><span><Truck size={16} />{store.deliveryFee === 0 ? "$0 delivery" : `${formatMoney(store.deliveryFee)} delivery`}</span></div></div><span className="freshness-guarantee"><Leaf size={18} /><span>Freshness<br /><strong>you can count on.</strong></span></span></section>
      {store.promotion && <div className="store-offer"><span><Tag size={17} /><strong>{store.promotion}</strong><span>Good things taste even better with a little savings.</span></span><BadgePercent size={22} /></div>}
      <div className="product-toolbar"><SearchBar value={query} onChange={setQuery} label="Search products" placeholder={`Search ${store.name}`} /><button type="button" className={`filter-button ${filtersOpen || maxPrice < 20 ? "active" : ""}`} onClick={() => setFiltersOpen(!filtersOpen)} aria-expanded={filtersOpen} aria-controls="price-filter"><SlidersHorizontal size={16} />Filters{maxPrice < 20 && <span>1</span>}</button><button type="button" className={`saved-products-toggle ${view === "saved" ? "active" : ""}`} aria-label="Show saved products" aria-pressed={view === "saved"} onClick={() => setView(view === "saved" ? "all" : "saved")}><Heart size={18} /><span>Saved</span></button></div>
      {filtersOpen && <div id="price-filter" className="price-filter"><label htmlFor="max-price">Maximum price <strong>{formatMoney(maxPrice)}</strong></label><input type="range" id="max-price" min="1" max="20" step="0.5" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /><button type="button" onClick={() => setMaxPrice(20)}><RotateCcw size={14} />Reset price</button></div>}
      <CategoryFilter categories={categories} selected={category} onChange={setCategory} />
      <section className="products-section" aria-labelledby="products-title"><div className="products-heading"><div><span className="eyebrow">PICKED FOR YOUR GOOD DAYS</span><h2 id="products-title">{filteredLabel}</h2><p role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "product" : "products"}{query ? ` matching “${query}”` : " · A little something for every basket"}</p></div><SortDropdown value={sort} onChange={setSort} options={[{ value: "featured", label: "Featured" }, { value: "price-low", label: "Price: low to high" }, { value: "price-high", label: "Price: high to low" }, { value: "name", label: "Name: A to Z" }]} /></div>
        {filtered.length ? <div className="product-grid">{filtered.map((product) => <ProductCard key={product.id} product={product} />)}</div> : <EmptyState title={view === "saved" ? "Keep your favorites close." : "Nothing in this aisle just yet."} description={view === "saved" ? "Tap the heart on a product to save it for a little later." : "Try another search or clear your filters. There’s plenty of fresh to find."} onReset={reset} />}
      </section><footer className="shopping-footer"><span><Leaf size={14} />Picked with care. Delivered with a smile.</span><Link href="/stores">Explore all stores</Link></footer>
      <CartSummary />
    </main>
  </div>;
}
