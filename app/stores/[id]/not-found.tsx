import Link from "next/link";
import { Store } from "lucide-react";

export default function StoreNotFound() {
  return <main id="shopping-content" className="empty-state store-not-found"><div className="empty-icon"><Store size={32} /></div><h1>This store is off the map.</h1><p>There are plenty of fresh favorites waiting in your neighborhood.</p><Link className="button-primary" href="/stores">Explore all stores</Link></main>;
}
