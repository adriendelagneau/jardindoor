"use client";

import { useProductFilters } from "@/hooks/use-product-filters";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { X, } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions/categories";
import { getBrands } from "@/actions/brands";

type Props = {
  className?: string;
};

export function ProductFilters({ className }: Props) {
  const { filters, setFilters, clearFilters } = useProductFilters();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => getCategories({ pageSize: 100 }),
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands-all"],
    queryFn: () => getBrands(),
  });

  const categories = categoriesData?.categories || [];
  const brands = brandsData || [];

  const [priceRange, setPriceRange] = useState([
    Number(filters.priceMin) || 0,
    filters.priceMax ? Number(filters.priceMax) : 200,
  ]);

  // Derive active category and subcategory from filters
  const selectedCategory = categories.find(c => c.slug === filters.category);
  const selectedSubCategory = categories.find(c => c.slug === filters.subCategory);

  let activeCategorySlug = "all";
  let activeSubCategorySlug = "all";

  if (selectedCategory) {
    if (selectedCategory.parentId) {
      const parent = categories.find(c => c.id === selectedCategory.parentId);
      activeCategorySlug = parent?.slug ?? "all";
      activeSubCategorySlug = selectedCategory.slug;
    } else {
      activeCategorySlug = selectedCategory.slug;
      activeSubCategorySlug = filters.subCategory ?? "all";
    }
  } else if (filters.subCategory && selectedSubCategory) {
    const parent = categories.find(c => c.id === selectedSubCategory.parentId);
    activeCategorySlug = parent?.slug ?? "all";
    activeSubCategorySlug = selectedSubCategory.slug;
  }

  // Update internal state when URL filters change (e.g. on clear)
  useEffect(() => {
    setPriceRange([
      Number(filters.priceMin) || 0,
      filters.priceMax ? Number(filters.priceMax) : 200,
    ]);
  }, [filters.priceMin, filters.priceMax]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceCommit = (value: number[]) => {
    setFilters({ 
      priceMin: value[0] === 0 ? undefined : value[0].toString(),
      priceMax: value[1] === 200 ? undefined : value[1].toString()
    });
  };

   const hasActiveFilters = !!(
      filters.category ||
      filters.subCategory ||
      filters.brand ||
      filters.priceMin ||
      filters.isPromotion ||
      (filters.priceMax && filters.priceMax !== "200") ||
      (filters.orderBy && filters.orderBy !== "newest")
    );

  return (
    <div className={cn("space-y-6 p-4 bg-white rounded-2xl border shadow-sm", className)}>
      <h3 className="font-semibold text-lg">Filtres</h3>

      <div className="space-y-2">
        <label className="text-sm font-medium">Catégorie</label>
        <Select
          value={activeCategorySlug}
          onValueChange={(val) => 
            val === "all" 
              ? setFilters({ category: undefined, subCategory: undefined }) 
              : setFilters({ category: val, subCategory: undefined })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les catégories" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">Tous</SelectItem>
            {categories
              .filter((c) => !c.parentId)
              .map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Sous-catégorie</label>
        <Select
          value={activeSubCategorySlug}
          onValueChange={(val) => setFilters({ 
            subCategory: val === "all" ? undefined : val,
            category: activeCategorySlug !== "all" ? activeCategorySlug : undefined
          })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les sous-catégories" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">Tous</SelectItem>
            {categories
              .filter(
                (c) =>
                  c.parentId &&
                  (activeCategorySlug === "all" || categories.find((p) => p.id === c.parentId)?.slug === activeCategorySlug)
              )
              .map((c) => (
                <SelectItem key={c.id} value={c.slug}>
                  {c.name}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Marque</label>
        <Select
          value={filters.brand ?? "all"}
          onValueChange={(val) => setFilters({ brand: val === "all" ? undefined : val })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les marques" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="all">Toutes</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.slug}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Prix (0 - 200€+)</label>
          <Slider
            defaultValue={[0, 200]}
            value={priceRange}
            min={0}
            max={200}
            step={5}
            onValueChange={handlePriceChange}
            onValueCommit={handlePriceCommit}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1] === 200 ? "200€+" : `${priceRange[1]}€`}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Checkbox 
            id="isPromotion" 
            checked={filters.isPromotion} 
            onCheckedChange={(checked) => setFilters({ isPromotion: checked === true ? true : undefined })}
          />
          <Label 
            htmlFor="isPromotion" 
            className="text-sm font-medium flex items-center gap-2 cursor-pointer"
          >
            En promotion 
          </Label>
        </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          onClick={clearFilters} 
          className="w-full justify-start p-0 gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X size={16} /> Réinitialiser tout
        </Button>
      )}
    </div>
  );
}
