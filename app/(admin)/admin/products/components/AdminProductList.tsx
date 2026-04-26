"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/actions/products";
import { AdminProductCard } from "./AdminProductCard";
import { AdminProductCardSkeleton } from "./AdminProductCardSkeleton";
import { useInfiniteScrollObserver } from "@/hooks/useInfiniteScrollObserver";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

const PAGE_SIZE = 12;

export function AdminProductList() {
  const { filters } = useProductFilters();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["admin-products", filters],
    queryFn: ({ pageParam = 1 }) =>
      getProducts({
        page: pageParam as number,
        pageSize: PAGE_SIZE,
        query: filters.query,
        category: filters.category,
        subCategory: filters.subCategory,
        brand: filters.brand,
        orderBy: filters.orderBy as any,
        priceMin: filters.priceMin ? Number(filters.priceMin) : undefined,
        priceMax: filters.priceMax ? Number(filters.priceMax) : undefined,
        isPromotion: filters.isPromotion || undefined,
        status: undefined, // Admins should see all products, but getProducts defaults to ACTIVE. 
                           // Wait, getProducts in actions/products.ts defaults to ACTIVE.
      }),
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.hasMore ? allPages.length + 1 : undefined;
    },
    initialPageParam: 1,
  });

  useInfiniteScrollObserver({
    targetRef: loadMoreRef,
    enabled: !!hasNextPage && !isFetchingNextPage,
    onIntersect: fetchNextPage,
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <AdminProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-medium">
          Une erreur est survenue lors du chargement des produits.
        </p>
        <Button
          onClick={() => window.location.reload()}
          className="rounded-full px-8 py-3 transition-all"
        >
          Réessayer
        </Button>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  if (allProducts.length === 0) {
    return (
      <div className="col-span-full py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted text-center">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-20" />
        </div>
        <h3 className="text-xl font-semibold">Aucun produit trouvé</h3>
        <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
          Aucun produit ne correspond à vos critères de recherche.
        </p>
        <Button asChild className="mt-6 rounded-full px-8">
          <Link href="/admin/products/create">Ajouter un produit</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allProducts.map((product) => (
          <AdminProductCard 
            key={product.id} 
            product={product as any} 
          />
        ))}

        {/* Next page loading skeletons */}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <AdminProductCardSkeleton key={`next-page-skeleton-${i}`} />
          ))}
      </div>

      {/* Load more observer */}
      <div ref={loadMoreRef} className="h-20 w-full" />
    </div>
  );
}
