"use client";

import { useProductFilters } from "@/hooks/use-product-filters";
import { CategoryFromGetCategories } from "@/actions/categories";
import { GetBrandsResult } from "@/actions/brands";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

type Props = {
  categories: CategoryFromGetCategories[];
  brands: GetBrandsResult;
};

export function ProductFilters({ categories, brands }: Props) {
  const { filters, setFilters, clearFilters } = useProductFilters();
  const [priceRange, setPriceRange] = useState([
    Number(filters.priceMin) || 0,
    Number(filters.priceMax) || 2000,
  ]);

  // Derive active category and subcategory from filters
  // This handles the case where a child category slug is passed in the 'category' URL param
  const selectedCategory = categories.find(c => c.slug === filters.category);
  const selectedSubCategory = categories.find(c => c.slug === filters.subCategory);

  let activeCategorySlug = "all";
  let activeSubCategorySlug = "all";

  if (selectedCategory) {
    if (selectedCategory.parentId) {
      // The 'category' param is actually a sub-category
      const parent = categories.find(c => c.id === selectedCategory.parentId);
      activeCategorySlug = parent?.slug ?? "all";
      activeSubCategorySlug = selectedCategory.slug;
    } else {
      // The 'category' param is a top-level category
      activeCategorySlug = selectedCategory.slug;
      activeSubCategorySlug = filters.subCategory ?? "all";
    }
  } else if (filters.subCategory && selectedSubCategory) {
    // Only subCategory is provided
    const parent = categories.find(c => c.id === selectedSubCategory.parentId);
    activeCategorySlug = parent?.slug ?? "all";
    activeSubCategorySlug = selectedSubCategory.slug;
  }

  // Update internal state when URL filters change (e.g. on clear)
  useEffect(() => {
    setPriceRange([
      Number(filters.priceMin) || 0,
      Number(filters.priceMax) || 2000,
    ]);
  }, [filters.priceMin, filters.priceMax]);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
  };

  const handlePriceCommit = (value: number[]) => {
    setFilters({ 
      priceMin: value[0] === 0 ? undefined : value[0].toString(),
      priceMax: value[1] === 2000 ? undefined : value[1].toString()
    });
  };

  const hasActiveFilters = !!(
    filters.category || 
    filters.subCategory || 
    filters.brand || 
    filters.priceMin || 
    (filters.priceMax && filters.priceMax !== "2000") ||
    (filters.orderBy && filters.orderBy !== "newest")
  );

  return (
    <div className="space-y-6 p-4 bg-white rounded-2xl border shadow-sm">
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
          <SelectContent>
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
            // When selecting a subcategory, ensure the parent is also set for clarity
            category: activeCategorySlug !== "all" ? activeCategorySlug : undefined
          })}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Toutes les sous-catégories" />
          </SelectTrigger>
          <SelectContent>
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
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            {brands.map((b) => (
              <SelectItem key={b.id} value={b.slug}>{b.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

            <div className="space-y-2">
        <label className="text-sm font-medium">Prix (0 - 2000€)</label>
        <Slider
          defaultValue={[0, 2000]}
          value={priceRange}
          min={0}
          max={2000}
          step={10}
          onValueChange={handlePriceChange}
          onValueCommit={handlePriceCommit}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>{priceRange[0]}€</span>
          <span>{priceRange[1]}€</span>
        </div>
      </div>

      {hasActiveFilters && (
        <Button 
          variant="ghost" 
          onClick={clearFilters} 
          className="w-full gap-2 mt-4 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <X size={16} /> Réinitialiser tout
        </Button>
      )}
    </div>
  );
}
