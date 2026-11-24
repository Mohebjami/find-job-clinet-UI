"use client";

import { ChevronDown, Heart, Minus, Plus, Search, SearchX, Sprout, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useId } from "react";
import type { Store } from "@/lib/grocery/data";
import { MAX_QUANTITY } from "@/lib/grocery/cart";

export function SearchBar({ value, onChange, placeholder = "Search", label, compact = false }: { value: string; onChange: (value: string) => void; placeholder?: string; label: string; compact?: boolean }) {
  const id = useId();
  return (
    <div className={`search-bar ${compact ? "search-compact" : ""}`}>
      <Search size={19} aria-hidden="true" />
      <label className="sr-only" htmlFor={id}>{label}</label>
      <input id={id} type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} autoComplete="off" />
      {value && <button type="button" onClick={() => onChange("")} className="icon-button search-clear" aria-label={`Clear ${label.toLowerCase()}`}><X size={16} /></button>}
    </div>
  );
}

export function SortDropdown({ value, onChange, options, label = "Sort by" }: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[]; label?: string }) {
  const id = useId();
  return <div className="sort-dropdown"><label htmlFor={id}>{label}:</label><select id={id} value={value} onChange={(event) => onChange(event.target.value)}>{options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><ChevronDown size={15} aria-hidden="true" /></div>;
}

export function CategoryFilter({ categories, selected, onChange }: { categories: string[]; selected: string; onChange: (category: string) => void }) {
  return <div className="category-filter" aria-label="Filter by category">{categories.map((category) => <button type="button" key={category} onClick={() => onChange(category)} aria-pressed={selected === category} className={selected === category ? "category-pill active" : "category-pill"}>{category}</button>)}</div>;
}

export function QuantitySelector({ quantity, onChange, name, small = false }: { quantity: number; onChange: (quantity: number) => void; name: string; small?: boolean }) {
  return <div className={`quantity-selector ${small ? "quantity-small" : ""}`}><button type="button" onClick={() => onChange(quantity - 1)} aria-label={`Remove one ${name}`}><Minus size={16} /></button><span aria-label={`${quantity} in cart`}>{quantity}</span><button type="button" disabled={quantity >= MAX_QUANTITY} onClick={() => onChange(quantity + 1)} aria-label={`Add one ${name}`}><Plus size={16} /></button></div>;
}

export function FavoriteButton({ saved, onClick, name }: { saved: boolean; onClick: () => void; name: string }) {
  return <button type="button" className={`favorite-button ${saved ? "is-saved" : ""}`} aria-label={`${saved ? "Unsave" : "Save"} ${name}`} aria-pressed={saved} onClick={onClick}><Heart size={18} fill={saved ? "currentColor" : "none"} strokeWidth={1.8} /></button>;
}

export function StoreLogo({ store, large = false }: { store: Store; large?: boolean }) {
  return <div className={`store-logo logo-${store.logo} ${large ? "logo-large" : ""}`} style={{ backgroundColor: store.color }} aria-label={`${store.name} logo`}>
    {store.logo === "whole" ? <span className="whole-wordmark">WHOLE<br /><span>FOODS</span><small>MARKET</small></span> : store.logo === "fresh" ? <><Sprout size={20} strokeWidth={2.2} /><span>freshmart</span></> : store.logo === "trader" ? <span className="trader-wordmark">TRADER<br />JOE’S</span> : store.logo === "green" ? <><Sprout size={24} /><span>green basket</span></> : store.logo === "costco" ? <span className="costco-wordmark">COSTCO<small>WHOLESALE</small></span> : store.logo === "bread" ? <><span className="bread-symbol">B</span><span>BREAD BASKET</span></> : store.logo === "care" ? <><Plus size={29} strokeWidth={4} /><span>daily care</span></> : <><Sprout size={24} /><span>local harvest</span></>}
  </div>;
}

export function EmptyState({ title = "No fresh finds just yet", description = "Try a different search or clear your filters to find something good.", onReset, icon: Icon = SearchX, actionLabel = "Clear filters" }: { title?: string; description?: string; onReset?: () => void; icon?: LucideIcon; actionLabel?: string }) {
  return <div className="empty-state"><div className="empty-icon"><Icon size={32} strokeWidth={1.5} /></div><h2>{title}</h2><p>{description}</p>{onReset && <button type="button" className="button-primary" onClick={onReset}>{actionLabel}</button>}</div>;
}

export function SkeletonLoader({ type = "store", count = 8 }: { type?: "store" | "product"; count?: number }) {
  return <div role="status" className={type === "store" ? "store-grid" : "product-grid"}><span className="sr-only">Loading {type === "store" ? "stores" : "products"}…</span>{Array.from({ length: count }, (_, index) => <div key={index} aria-hidden="true" className={`skeleton-card skeleton-${type}`}><div className="skeleton-image" /><div className="skeleton-body"><div className="skeleton-line wide" /><div className="skeleton-line" /><div className="skeleton-line short" /></div></div>)}</div>;
}
