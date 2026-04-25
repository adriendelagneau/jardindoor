"use client";

import { AppWindowIcon, MailIcon, SproutIcon, StoreIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useSidebarStore } from "@/store/useSidebarStore";
import { usePathname } from "next/navigation";
import { ProductFilters } from "@/app/(main)/products/components/ProductFilters";
import { useQuery } from "@tanstack/react-query";
import { getCategories } from "@/actions/categories";
import { getBrands } from "@/actions/brands";

const HomeContent = () => {
  const pathname = usePathname();
  const isProductsPage = pathname === "/products";
  const { closeSidebar } = useSidebarStore();

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-all"],
    queryFn: () => getCategories({ pageSize: 100 }),
    enabled: isProductsPage,
  });

  const { data: brandsData } = useQuery({
    queryKey: ["brands-all"],
    queryFn: () => getBrands(),
    enabled: isProductsPage,
  });

  return (
    <div>
      <ul className="flex flex-col items-start gap-2">
        <li className="w-full">
          <Link href="/" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <AppWindowIcon className="mr-2 h-4 w-4" />
              Accueil
            </Button>
          </Link>
        </li>

        <li className="w-full">
          <Link href="/products" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <StoreIcon className="mr-2 h-4 w-4" />
              Boutique
            </Button>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/products?category=graines" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <SproutIcon className="mr-2 h-4 w-4" />
              Graines
            </Button>
          </Link>
        </li>
        <li className="w-full">
          <Link href="/#contact" onClick={closeSidebar}>
            <Button variant="ghost" className="w-full justify-start text-left">
              <MailIcon className="mr-2 h-4 w-4" />
              Contact
            </Button>
          </Link>
        </li>
      </ul>
      
      {isProductsPage && (
        <>
          <Separator className="my-4" />
          <div className="pb-8">
            <ProductFilters
              categories={categoriesData?.categories || []}
              brands={brandsData || []}
              className="bg-transparent border-none shadow-none p-0"
            />
          </div>
        </>
      )}
      
      {!isProductsPage && <Separator className="my-4" />}
    </div>
  );
};

export default HomeContent;
