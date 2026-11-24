"use client";

import Image from "next/image";
import { Plus } from "lucide-react";
import { formatMoney, type Product } from "@/lib/grocery/data";
import { useShopping } from "./shopping-provider";
import { FavoriteButton, QuantitySelector } from "./ui";

export function ProductCard({ product }: { product: Product }) {
  const { items, saved, toggleSaved, setQuantity, ready } = useShopping();
  const quantity = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const discount = product.originalPrice ? Math.round((1 - product.price / product.originalPrice) * 100) : 0;
  return <article className="product-card">
    <div className="product-image"><Image src={`/grocery/${product.image}.jpg`} alt={product.name} fill sizes="(max-width: 639px) 45vw, (max-width: 1100px) 30vw, 20vw" />{discount > 0 && <span className="discount-badge">{discount}% off</span>}<FavoriteButton name={product.name} saved={saved.includes(product.id)} onClick={() => toggleSaved(product.id)} /></div>
    <div className="product-info"><div className="product-price"><strong>{formatMoney(product.price)}</strong>{product.originalPrice && <del>{formatMoney(product.originalPrice)}</del>}</div><h3>{product.name}</h3><p>{product.unit}</p>{product.label && <span className="product-label">{product.label}</span>}</div>
    <div className="product-action">{quantity > 0 ? <QuantitySelector name={product.name} quantity={quantity} onChange={(value) => setQuantity(product.id, value)} /> : <button type="button" className="add-button" disabled={!ready} onClick={() => setQuantity(product.id, 1)} aria-label={`Add ${product.name} to cart`}><Plus size={17} />Add to cart</button>}</div>
  </article>;
}
