import React from 'react'
import Image from 'next/image'
import prisma from "@/lib/prisma/prisma"
import { Button } from "@/components/ui/button"
import { Plus, ShoppingBag, Edit, Tag, Percent, Archive, PackageCheck, PackageX } from "lucide-react"
import Link from 'next/link'

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'ACTIVE':
      return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><PackageCheck className="h-3 w-3" /> Actif</span>
    case 'ARCHIVED':
      return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Archive className="h-3 w-3" /> Archivé</span>
    case 'OUT_OF_STOCK':
      return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><PackageX className="h-3 w-3" /> En rupture</span>
    default:
      return null
  }
}

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true }
      },
      images: {
        take: 1,
        orderBy: { index: "asc" }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <div className="space-y-12 p-6 max-w-7xl mx-auto pb-24">
      {/* Hero Section */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg bg-primary/10 border border-primary/20">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <div className="bg-primary/20 p-4 rounded-full">
            <ShoppingBag className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground uppercase tracking-widest">
              Catalogue Produits
            </h1>
            <p className="text-muted-foreground text-lg mt-2">Gérez vos articles, prix et stocks</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center -mt-16 relative z-10">
        <Button asChild size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary text-primary-foreground">
          <Link href="/admin/products/create">
            <Plus className="mr-3 h-8 w-8" />
            Nouveau Produit
          </Link>
        </Button>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {products.map((product) => (
          <div key={product.id} className="group bg-card rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl hover:border-primary/20">
            <div className="aspect-[4/3] relative bg-muted overflow-hidden">
              {product.images[0] ? (
                <Image
                  src={product.images[0].url}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground opacity-30">
                  <ShoppingBag className="h-16 w-16" />
                </div>
              )}
              {product.isPromotion && (
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                  <Percent className="h-3 w-3" /> Promotion
                </div>
              )}
            </div>
            
            <div className="p-5 flex-1 flex flex-col gap-3">
              <div className="flex justify-between items-start gap-2">
                <div className="space-y-1">
                  <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Tag className="h-3 w-3" />
                    {product.category?.name || "Sans catégorie"}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black text-primary">
                    {Number(product.price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}
                  </span>
                  <div className="text-[10px] text-muted-foreground font-medium">
                    par {product.priceUnit}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed">
                <StatusBadge status={product.status} />
                <Button variant="outline" size="sm" asChild className="rounded-full px-4 gap-2 hover:bg-primary hover:text-white transition-all">
                  <Link href={`/admin/products/${product.id}`}>
                    <Edit className="h-4 w-4" />
                    Modifier
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-semibold">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              Votre catalogue est vide. Commencez par ajouter votre premier article.
            </p>
            <Button asChild className="mt-6 rounded-full px-8">
              <Link href="/admin/products/create">Ajouter un produit</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
