import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { AdminProductList } from "./components/AdminProductList";
import { AdminProductCardSkeleton } from "./components/AdminProductCardSkeleton";
import { ProductFilters } from "@/app/(main)/products/components/ProductFilters";
import { MobileFilters } from "@/app/(main)/products/components/MobileFilters";

export const metadata = {
  title: "Gestion Produits | Admin Jardin",
  description: "Gérez votre inventaire, prix et stocks.",
};

export default async function ProductsPage() {
  return (
    <div className="py-8 lg:py-12 mx-2 space-y-12 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 px-4">
        <div>
          <h1 className="text-3xl font-bold font-serif">Catalogue Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre inventaire, prix et stocks.
          </p>
        </div>
        <Link href="/admin/products/create">
          <Button className="gap-2 rounded-full px-6">
            <Plus size={18} /> Nouveau Produit
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <div className="px-4">
        <Card className="relative h-[300px] w-full overflow-hidden shadow-lg border-none bg-primary rounded-3xl">
          <Image
            src="/home-img.png"
            alt="Produits banner"
            fill
            sizes="100vw"
            className="object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent flex flex-col justify-center p-8 lg:p-12 text-primary-foreground">
            <div className="flex items-center gap-4 mb-2">
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold font-serif uppercase tracking-widest">
                Catalogue Produits
              </h2>
            </div>
            <p className="max-w-lg text-lg opacity-90">
              Gérez votre inventaire complet, vos prix et vos stocks en temps
              réel.
            </p>
          </div>
        </Card>
      </div>

      {/* Main Content with Filters and List */}
      <div className="px-4">
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
            <Suspense fallback={
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <AdminProductCardSkeleton key={i} />
                ))}
              </div>
            }>
              <AdminProductList />
            </Suspense>
          </main>
        </div>
      </div>
    </div>
  );
}
