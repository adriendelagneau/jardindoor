"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";

export type ProductFilters = {
  query?: string;
  category?: string;
  subCategory?: string;
  brand?: string;
  type?: "PRODUCT" | "SEED";
  orderBy?: string;
  priceMin?: string;
  priceMax?: string;
};

export function useProductFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const getFilter = useCallback(
    (key: keyof ProductFilters) => searchParams.get(key) || undefined,
    [searchParams]
  );

  const setFilters = useCallback(
    (filters: ProductFilters) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      });

      // Reset page when filters change
      params.delete("page");

      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  const clearFilters = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    const query = params.get("query");
    
    // Create new params and only add query back if it exists
    const newParams = new URLSearchParams();
    if (query) {
      newParams.set("query", query);
    }

    startTransition(() => {
      const queryString = newParams.toString();
      router.push(queryString ? `${pathname}?${queryString}` : pathname, { scroll: false });
    });
  }, [pathname, router, searchParams]);

   return {
     filters: {
       query: getFilter("query"),
       category: getFilter("category"),
       subCategory: getFilter("subCategory"),
       brand: getFilter("brand"),
       type: getFilter("type") as "PRODUCT" | "SEED" | undefined,
       orderBy: getFilter("orderBy") || "newest",
       priceMin: getFilter("priceMin"),
       priceMax: getFilter("priceMax"),
     },
     setFilters,
     clearFilters,
     isPending,
   };
}
