"use client";

import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSidebarStore } from "@/store/useSidebarStore";
import { usePathname } from "next/navigation";

export function MobileFilters() {
  const { openSidebar } = useSidebarStore();
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <div className="lg:hidden mb-6">
      <Button
        variant="outline"
        className="w-full flex items-center justify-center gap-2 py-6 rounded-2xl border-dashed border-2 hover:border-green-600 hover:bg-green-50 transition-colors"
        onClick={() => openSidebar(isAdmin ? "admin" : "home")}
      >
        <Filter size={18} className="text-green-700" />
        <span className="font-semibold text-green-900">Filtrer les produits</span>
      </Button>
    </div>
  );
}
