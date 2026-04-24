"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getProducts } from "@/actions/products";
import { ProductCard } from "@/components/carousel/main-carousel/ProductCard";
import { ProductCardSkeleton } from "@/components/carousel/main-carousel/ProductCardSkeleton";
import { useInfiniteScrollObserver } from "@/hooks/useInfiniteScrollObserver";
import { useProductFilters } from "@/hooks/use-product-filters";
import { useRef } from "react";

const PAGE_SIZE = 12;

export function ProductList() {
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
    queryKey: ["products", filters],
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
          <ProductCardSkeleton key={i} />
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
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-green-900 px-8 py-3 text-white transition-all hover:bg-green-800"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const allProducts = data?.pages.flatMap((page) => page.products) || [];

  if (allProducts.length === 0) {
    return (
      <div className="flex h-64 flex-col items-center justify-center text-gray-500 italic space-y-2">
        <p className="text-xl font-serif">Aucun produit trouvé</p>
        <p className="text-sm">
          Essayez de modifier vos filtres ou votre recherche.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product as any} 
            priority={index < 4}
          />
        ))}

        {/* Next page loading skeletons */}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <ProductCardSkeleton key={`next-page-skeleton-${i}`} />
          ))}
      </div>

      {/* Load more observer */}
      <div ref={loadMoreRef} className="h-20 w-full" />
    </div>
  );
}
