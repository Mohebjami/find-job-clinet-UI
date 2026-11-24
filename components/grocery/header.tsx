"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { Check, ChevronDown, MapPin, ShoppingBag, Sprout, X } from "lucide-react";
import { SearchBar } from "./ui";
import { useShopping } from "./shopping-provider";

export function Header() {
  const { count, setCartOpen, storeQuery, setStoreQuery, address, setAddress } = useShopping();
  const router = useRouter();
  const pathname = usePathname();
  const dialog = useRef<HTMLDialogElement>(null);
  const [locationOpen, setLocationOpen] = useState(false);
  const [customAddress, setCustomAddress] = useState("");

  useEffect(() => {
    if (locationOpen) dialog.current?.showModal();
    else dialog.current?.close();
  }, [locationOpen]);

  function search(event: FormEvent) {
    event.preventDefault();
    if (pathname !== "/stores") router.push("/stores");
  }

  return <>
    <a className="skip-link" href="#shopping-content">Skip to content</a>
    <header className="shopping-header">
      <Link href="/stores" className="brand" aria-label="Sprout home"><span className="brand-icon"><Sprout size={25} strokeWidth={2.2} /></span>sprout<span className="brand-period">.</span></Link>
      <span className="header-divider" aria-hidden="true" />
      <button type="button" className="location-selector" onClick={() => setLocationOpen(true)} aria-label={`Change delivery location, currently ${address}`}><MapPin size={20} /><span><small>Delivering to</small><strong>{address}</strong></span><ChevronDown size={15} /></button>
      <form className="header-search" role="search" onSubmit={search}><SearchBar value={storeQuery} onChange={setStoreQuery} label="Search stores" placeholder="Search your favorite stores" /></form>
      <button type="button" className="header-cart" onClick={() => setCartOpen(true)} aria-label={`Open shopping cart, ${count} items`}><ShoppingBag size={20} /><span>Cart</span><span className="cart-count">{count}</span></button>
    </header>
    <dialog ref={dialog} className="location-dialog" onCancel={() => setLocationOpen(false)} onClick={(event) => { if (event.target === event.currentTarget) setLocationOpen(false); }} aria-labelledby="location-title">
      <button type="button" className="icon-button dialog-close" aria-label="Close delivery location" onClick={() => setLocationOpen(false)}><X size={22} /></button>
      <div className="empty-icon"><MapPin size={26} /></div><h2 id="location-title">A little closer to home.</h2><p>Choose a delivery location for your neighborhood store preview.</p>
      {["San Francisco, CA", "123 Market Street, San Francisco", "580 California Street, San Francisco"].map((location, index) => <button key={location} type="button" className="address-option" onClick={() => { setAddress(location); setLocationOpen(false); }}><MapPin size={19} /><span><strong>{["San Francisco", "Home", "Work"][index]}</strong><small>{location}</small></span>{address === location && <Check size={19} />}</button>)}
      <form onSubmit={(event) => { event.preventDefault(); if (customAddress.trim()) { setAddress(customAddress.trim()); setLocationOpen(false); } }} className="address-form"><label htmlFor="custom-address">Or enter a delivery address</label><input id="custom-address" value={customAddress} maxLength={120} onChange={(event) => setCustomAddress(event.target.value)} placeholder="Street address, city" required /><button className="button-primary" type="submit">Use this address</button></form>
    </dialog>
  </>;
}
