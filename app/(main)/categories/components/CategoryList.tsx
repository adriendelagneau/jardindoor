"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions/categories";
import { CategoryCard } from "./CategoryCard";
import { CategoryCardSkeleton } from "./CategoryCardSkeleton";
import { useInfiniteScrollObserver } from "@/hooks/useInfiniteScrollObserver";
import { useRef } from "react";

const PAGE_SIZE = 12;

export function CategoryList({ parentId }: { parentId?: string }) {
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["categories", parentId],
    queryFn: ({ pageParam = 1 }) =>
      getCategories({
        page: pageParam as number,
        pageSize: PAGE_SIZE,
        parentId: parentId || undefined,
        onlyRoots: !parentId, // If no parentId, only show roots
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
          <CategoryCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-64 flex-col items-center justify-center space-y-4">
        <p className="text-red-500 font-medium">Une erreur est survenue lors du chargement des catégories.</p>
        <button
          onClick={() => window.location.reload()}
          className="rounded-full bg-green-900 px-8 py-3 text-white transition-all hover:bg-green-800"
        >
          Réessayer
        </button>
      </div>
    );
  }

  const allCategories = data?.pages.flatMap((page) => page.categories) || [];

  if (allCategories.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center text-gray-500 italic">
        Aucune catégorie trouvée.
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {allCategories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}

        {/* Next page loading skeletons */}
        {isFetchingNextPage &&
          Array.from({ length: 4 }).map((_, i) => (
            <CategoryCardSkeleton key={`next-page-skeleton-${i}`} />
          ))}
      </div>

      {/* Load more observer */}
      <div
        ref={loadMoreRef}
        className="h-10 w-full"
      />
    </div>
  );
}
