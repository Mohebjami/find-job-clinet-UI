"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { ShoppingBag, Trash2, X } from "lucide-react";
import { formatMoney, getStore, products } from "@/lib/grocery/data";
import { useShopping } from "./shopping-provider";
import { EmptyState, QuantitySelector } from "./ui";

export function CartSummary() {
  const { count, subtotal, setCartOpen } = useShopping();
  if (!count) return null;
  return <div className="cart-summary-wrap"><button type="button" className="cart-summary" onClick={() => setCartOpen(true)} aria-label={`View cart, ${count} items, ${formatMoney(subtotal)}`}><span className="summary-count"><ShoppingBag size={19} />{count} {count === 1 ? "item" : "items"}</span><span>View your cart</span><strong>{formatMoney(subtotal)}</strong></button></div>;
}

export function CartDrawer() {
  const { items, count, subtotal, cartOpen, setCartOpen, setQuantity } = useShopping();
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (cartOpen) dialog.current?.showModal();
    else dialog.current?.close();
    const previousOverflow = document.body.style.overflow;
    if (cartOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [cartOpen]);

  return <dialog ref={dialog} className="cart-dialog" aria-labelledby="cart-title" onCancel={() => setCartOpen(false)} onClick={(event) => { if (event.currentTarget === event.target) setCartOpen(false); }}>
    <div className="cart-drawer">
      <div className="cart-drawer-heading"><div><span className="eyebrow">THE GOOD STUFF</span><h2 id="cart-title">Your shopping bag <span>({count})</span></h2></div><button type="button" className="icon-button" onClick={() => setCartOpen(false)} aria-label="Close cart"><X size={23} /></button></div>
      {items.length === 0 ? <EmptyState icon={ShoppingBag} title="Good things go in here." description="Add a few favorites from your neighborhood stores to get started." onReset={() => setCartOpen(false)} actionLabel="Keep exploring" /> : <>
        <div className="cart-items">{items.map((item) => {
          const product = products.find((product) => product.id === item.productId);
          if (!product) return null;
          return <div className="cart-item" key={item.productId}><div className="cart-item-image"><Image src={`/grocery/${product.image}.jpg`} alt={product.name} fill sizes="80px" /></div><div className="cart-item-info"><small>{getStore(product.storeId)?.name}</small><h3>{product.name}</h3><span>{product.unit}</span><QuantitySelector small name={product.name} quantity={item.quantity} onChange={(quantity) => setQuantity(product.id, quantity)} /></div><div className="cart-item-price"><strong>{formatMoney(product.price * item.quantity)}</strong><button type="button" className="icon-button" aria-label={`Remove ${product.name} from cart`} onClick={() => setQuantity(product.id, 0)}><Trash2 size={17} /></button></div></div>;
        })}</div>
        <div className="cart-totals"><div><span>Item subtotal</span><strong>{formatMoney(subtotal)}</strong></div><p>Delivery fees vary by store. This shopping bag is a frontend preview.</p><button type="button" className="button-primary" onClick={() => setCartOpen(false)}>Keep shopping</button></div>
      </>}
    </div>
  </dialog>;
}
