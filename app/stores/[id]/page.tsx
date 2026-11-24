import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { StoreProducts } from "@/components/grocery/store-products";
import { getStore, stores } from "@/lib/grocery/data";

export function generateStaticParams() {
  return stores.map((store) => ({ id: store.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const store = getStore(id);
  return { title: { absolute: store ? `${store.name} — Fresh groceries on Sprout` : "Store not found — Sprout" } };
}

export default async function StorePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const store = getStore(id);
  if (!store) notFound();
  return <StoreProducts key={store.id} store={store} />;
}
