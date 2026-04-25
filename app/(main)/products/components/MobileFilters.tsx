"use client";

import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomSidebar } from "@/components/layout/sidebar/CustomSidebar";
import { ProductFilters } from "./ProductFilters";
import { CategoryFromGetCategories } from "@/actions/categories";
import { GetBrandsResult } from "@/actions/brands";

type Props = {
  categories: CategoryFromGetCategories[];
  brands: GetBrandsResult;
};

export function MobileFilters({ categories, brands }: Props) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="lg:hidden mb-6">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-dashed border-2 hover:border-green-600 hover:bg-green-50 transition-colors"
        onClick={() => setIsOpen(true)}
      >
        <Filter size={18} className="text-green-700" />
        <span className="font-semibold text-green-900">Filtrer les produits</span>
      </Button>

      <CustomSidebar open={isOpen} onClose={() => setIsOpen(false)} side="right">
        <div className="flex h-full flex-col bg-slate-50">
          <div className="flex items-center justify-between border-b bg-white p-4">
            <h2 className="text-lg font-semibold text-green-900 flex items-center gap-2">
              <Filter size={20} />
              Filtres
            </h2>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              aria-label="Fermer"
            >
              <X size={24} className="text-slate-500" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            <div className="p-4">
              <ProductFilters 
                categories={categories} 
                brands={brands} 
                className="bg-transparent border-none shadow-none p-0 space-y-8"
              />
            </div>
          </div>
          
          <div className="p-4 border-t bg-white">
            <Button 
              className="w-full py-6 rounded-xl bg-green-700 hover:bg-green-800 text-white font-bold" 
              onClick={() => setIsOpen(false)}
            >
              Afficher les résultats
            </Button>
          </div>
        </div>
      </CustomSidebar>
    </div>
  );
}
