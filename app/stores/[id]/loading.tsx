import { SkeletonLoader } from "@/components/grocery/ui";

export default function ProductsLoading() {
  return <main className="loading-main" aria-label="Loading store products"><div className="skeleton-hero" /><SkeletonLoader type="product" count={12} /></main>;
}
