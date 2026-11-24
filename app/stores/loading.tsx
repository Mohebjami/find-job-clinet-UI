import { SkeletonLoader } from "@/components/grocery/ui";

export default function StoresLoading() {
  return <main className="loading-main" aria-label="Loading your neighborhood stores"><div className="skeleton-hero" /><SkeletonLoader /></main>;
}
