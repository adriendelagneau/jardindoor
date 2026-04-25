import { ProductList } from "./components/ProductList";
import { ProductFilters } from "./components/ProductFilters";
import { MobileFilters } from "./components/MobileFilters";
import { ProductCardSkeleton } from "@/components/carousel/main-carousel/ProductCardSkeleton";
import { Suspense } from "react";

export const metadata = {
  title: "Boutique | Jardin",
  description: "Découvrez notre catalogue de produits pour votre jardin.",
};

export default async function ProductsPage() {
  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filter Trigger */}
        <Suspense fallback={<div className="lg:hidden h-12 w-full bg-muted animate-pulse rounded-2xl mb-6" />}>
          <MobileFilters />
        </Suspense>

        {/* Sidebar Filters (Desktop) */}
        <aside className="hidden lg:block w-64 shrink-0">
          <Suspense fallback={<div className="h-64 bg-muted animate-pulse rounded-2xl" />}>
            <ProductFilters />
          </Suspense>
        </aside>

        {/* Product List */}
        <main className="flex-1">
          <h1 className="font-serif text-3xl font-bold text-green-900 mb-8">
            Catalogue
          </h1>
          <Suspense fallback={<div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>}>
            <ProductList />
          </Suspense>
        </main>
      </div>
    </div>
  );
}
