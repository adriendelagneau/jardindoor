import React from "react";
import prisma from "@/lib/prisma/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Package, Plus, Edit, Hash, Folder } from "lucide-react";
import LinkNext from "next/link";
import Image from "next/image";

export default async function BrandsPage() {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: [{ name: "asc" }],
  });

  return (
    <div className="py-8 lg:py-12 mx-2 space-y-12 pb-24">
      {/* Hero Section */}
      <Card className="relative h-[480px] w-full overflow-hidden rounded-3xl shadow-lg border-none bg-primary">
        <Image 
          src="/home-img.png" 
          alt="Marques banner" 
          fill 
          sizes="100vw"
          className="object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <Package className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold font-serif uppercase tracking-widest">
              Marques
            </h1>
          </div>
          <p className="max-w-lg text-lg opacity-90">
            Gérez vos partenaires, marques et fournisseurs de votre catalogue.
          </p>
        </div>
      </Card>

      <div className="flex justify-center -mt-16 relative z-10">
        <Button
          asChild
          size="lg"
          className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary text-primary-foreground"
        >
          <LinkNext href="/admin/brand/create">
            <Plus className="mr-3 h-8 w-8" />
            Créer une marque
          </LinkNext>
        </Button>
      </div>

      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="p-4 font-semibold text-sm">Nom</th>
                <th className="p-4 font-semibold text-sm">Slug</th>
                <th className="p-4 font-semibold text-sm text-center">Produits</th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr
                  key={brand.id}
                  className="border-b hover:bg-muted/30 transition-colors group"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-base">{brand.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground font-mono">
                    {brand.slug}
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold">
                      {brand._count.products}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      asChild
                      className="hover:bg-primary/20 hover:text-primary transition-colors"
                    >
                      <LinkNext href={`/admin/brand/${brand.id}`}>
                        <Edit className="h-4 w-4" />
                      </LinkNext>
                    </Button>
                  </td>
                </tr>
              ))}
              {brands.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-muted p-4 rounded-full">
                        <Package className="h-10 w-10 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-muted-foreground font-medium">
                        Aucune marque trouvée
                      </p>
                      <Button asChild variant="outline">
                        <LinkNext href="/admin/brand/create">
                          Ajouter votre première marque
                        </LinkNext>
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}