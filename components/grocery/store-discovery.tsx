"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { BadgeCheck, BadgePercent, Check, Clock3, Heart, Leaf, MapPin, ShoppingBasket, SlidersHorizontal, Sparkles, Tag, Truck, X } from "lucide-react";
import { stores, storeCategories } from "@/lib/grocery/data";
import { StoreCard } from "./store-card";
import { CategoryFilter, EmptyState, SortDropdown } from "./ui";
import { ShoppingSidebar } from "./sidebar";
import { useShopping } from "./shopping-provider";

export function StoreDiscovery() {
  const { storeQuery, setStoreQuery, saved, address } = useShopping();
  const [category, setCategory] = useState("All stores");
  const [sort, setSort] = useState("recommended");
  const [view, setView] = useState("all");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [quickDelivery, setQuickDelivery] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const storeSection = useRef<HTMLElement>(null);

  const filtered = stores.filter((store) => (!storeQuery.trim() || store.name.toLowerCase().includes(storeQuery.trim().toLowerCase())) && (category === "All stores" || category === store.category) && (view !== "offers" || !!store.promotion) && (view !== "saved" || saved.includes(store.id)) && (!freeDelivery || store.deliveryFee === 0) && (!quickDelivery || store.deliveryMinutes <= 20)).sort((a, b) => sort === "rating" ? b.rating - a.rating : sort === "delivery" ? a.deliveryMinutes - b.deliveryMinutes : 0);
  const activeFilters = Number(freeDelivery) + Number(quickDelivery);
  function reset() { setCategory("All stores"); setView("all"); setStoreQuery(""); setFreeDelivery(false); setQuickDelivery(false); setSort("recommended"); }
  function scrollToStores() { storeSection.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }); }

  return <div className="shopping-layout">
    <ShoppingSidebar categories={storeCategories} selected={category} onChange={setCategory} view={view} onViewChange={setView} />
    <main id="shopping-content" className="shopping-main">
      <div className="neighborhood-line"><MapPin size={14} /><span>Your neighborhood, a little fresher.</span><span className="location-text">{address}</span></div>
      <section className="discovery-hero" aria-label="Fresh groceries delivered">
        <div className="hero-copy"><span className="hero-eyebrow"><span /><span>FRESH FINDS. EVERY DAY.</span></span><h2>Your favorites.<br /><span>At your doorstep.</span></h2><p>From the stores you love to the little things<br className="hidden sm:block" /> you need. Fresh groceries, delivered.</p><button type="button" className="hero-button" onClick={scrollToStores}>Find your fresh <ShoppingBasket size={18} /></button><div className="hero-proof"><span className="proof-stars">★★★★★</span><span>Loved by 10,000+ happy neighbors</span></div></div>
        <div className="hero-image"><Image src="/grocery/harvest.jpg" alt="A colorful abundance of fresh seasonal vegetables at a neighborhood market" fill sizes="(max-width: 640px) 100vw, 50vw" preload className="object-cover" /><div className="hero-image-shade" /></div>
        <div className="freshness-stamp"><Leaf size={22} strokeWidth={1.6} /><span>FARM FRESH<small>feel-good food</small></span></div>
        <div className="hero-delivery-note"><span><Truck size={20} /></span><div><strong>Fresh at your door</strong><small>In as little as 15 minutes</small></div><BadgeCheck size={20} /></div>
      </section>
      <div className="benefits-row"><span><Truck size={19} /><strong>Your stores, delivered</strong><small>As fast as 15 minutes</small></span><span><Leaf size={19} /><strong>Picked with care</strong><small>Freshness in every bag</small></span><span><Tag size={19} /><strong>Little prices. Big smiles.</strong><small>Everyday deals you’ll love</small></span></div>
      <section className="store-section" ref={storeSection} aria-labelledby="stores-title">
        <div className="section-heading"><div><span className="eyebrow">LOCAL STORES. ENDLESS POSSIBILITIES.</span><h1 id="stores-title">Shop from your favorite stores<span className="heading-period">.</span></h1><p>All your everyday essentials, one happy delivery.</p></div><span className="stores-nearby"><span />{stores.length} stores near you</span></div>
        <div className="discovery-toolbar"><CategoryFilter categories={storeCategories} selected={category} onChange={setCategory} /><button type="button" className={`filter-button ${filtersOpen || activeFilters ? "active" : ""}`} aria-expanded={filtersOpen} aria-controls="delivery-filters" onClick={() => setFiltersOpen(!filtersOpen)}><SlidersHorizontal size={16} />Filters{activeFilters > 0 && <span>{activeFilters}</span>}</button></div>
        {filtersOpen && <div className="delivery-filters" id="delivery-filters"><label><input type="checkbox" checked={freeDelivery} onChange={(event) => setFreeDelivery(event.target.checked)} /><Truck size={16} />Free delivery</label><label><input type="checkbox" checked={quickDelivery} onChange={(event) => setQuickDelivery(event.target.checked)} /><Clock3 size={16} />20 minutes or less</label></div>}
        <div className="results-toolbar"><p role="status" aria-live="polite">{filtered.length} {filtered.length === 1 ? "store" : "stores"}{storeQuery ? ` matching “${storeQuery}”` : " to make your day"}</p><SortDropdown value={sort} onChange={setSort} options={[{ value: "recommended", label: "Recommended" }, { value: "rating", label: "Highest rated" }, { value: "delivery", label: "Fastest delivery" }]} /></div>
        {view !== "all" && <div className="active-view"><span>{view === "offers" ? <BadgePercent size={16} /> : <Heart size={16} />}{view === "offers" ? "Stores with offers" : "Your saved stores"}</span><button type="button" onClick={() => setView("all")} aria-label="Clear store view"><X size={15} /></button></div>}
        {filtered.length ? <div className="store-grid">{filtered.map((store, index) => <StoreCard key={store.id} store={store} index={index} />)}</div> : <EmptyState title={view === "saved" ? "Your favorites are waiting to be found." : "No stores found around here."} description={view === "saved" ? "Tap the heart on a store to keep your neighborhood favorites close." : "Try another store name or clear your filters for a fresh start."} onReset={reset} />}
      </section>
      <section className="first-order-banner"><div className="first-order-icon"><Sparkles size={26} /></div><div><span className="eyebrow">A LITTLE WELCOME GIFT</span><h2>Your first fresh start is on us.</h2><p>Enjoy $0 delivery on your first Whole Foods Market order.</p></div><button type="button" onClick={() => { reset(); setFreeDelivery(true); scrollToStores(); }}>Explore free delivery <Truck size={17} /></button><span className="banner-decoration" aria-hidden="true"><SproutDecoration /></span></section>
      <footer className="shopping-footer"><span><Leaf size={14} />A little fresher. A little easier. A lot more local.</span><span>Made for your everyday.</span></footer>
      <div className="mobile-view-controls"><button type="button" className={view === "offers" ? "active" : ""} aria-pressed={view === "offers"} onClick={() => setView(view === "offers" ? "all" : "offers")}><BadgePercent size={17} />Offers</button><button type="button" className={view === "saved" ? "active" : ""} aria-pressed={view === "saved"} onClick={() => setView(view === "saved" ? "all" : "saved")}><Heart size={17} />Saved stores</button><span><Check size={16} />Freshness guaranteed</span></div>
    </main>
  </div>;
}

function SproutDecoration() { return <Leaf size={108} strokeWidth={0.65} />; }
