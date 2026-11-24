"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock3, Star, Tag, Truck } from "lucide-react";
import { formatMoney, type Store } from "@/lib/grocery/data";
import { FavoriteButton, StoreLogo } from "./ui";
import { useShopping } from "./shopping-provider";

export function StoreCard({ store, index = 0 }: { store: Store; index?: number }) {
  const { saved, toggleSaved } = useShopping();
  return <article className="store-card" style={{ animationDelay: `${index * 45}ms` }}>
    <Link href={`/stores/${store.id}`} className="store-card-link" aria-label={`Shop ${store.name}, rated ${store.rating}, delivery in ${store.deliveryMinutes} to ${store.deliveryMinutes + 10} minutes`}>
      <div className="store-cover"><Image src={`/grocery/${store.cover}.jpg`} alt={`${store.name} fresh groceries and store selection`} fill sizes="(max-width: 639px) 100vw, (max-width: 1100px) 45vw, 30vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />{store.deliveryMinutes <= 20 && <span className="quick-badge"><Clock3 size={12} />Quick delivery</span>}</div>
      <div className="store-card-body"><div className="store-identity"><StoreLogo store={store} /><div className="store-name"><h3>{store.name}</h3><span>{store.category}</span></div><span className="rating"><Star size={13} fill="currentColor" />{store.rating.toFixed(1)}</span></div>
        <div className="store-meta"><span><Clock3 size={14} />{store.deliveryMinutes}–{store.deliveryMinutes + 10} min</span><span className="meta-dot">·</span><span className={store.deliveryFee === 0 ? "free-delivery" : ""}><Truck size={15} />{store.deliveryFee === 0 ? "$0 delivery" : `${formatMoney(store.deliveryFee)} delivery`}</span></div>
        {store.promotion ? <div className="store-promo"><Tag size={13} />{store.promotion}</div> : <div className="store-tags">{store.tags.join(" · ")}</div>}
      </div>
    </Link>
    <FavoriteButton name={store.name} saved={saved.includes(store.id)} onClick={() => toggleSaved(store.id)} />
  </article>;
}
