import React from 'react'
import Image from 'next/image'
import prisma from "@/lib/prisma/prisma"
import { Button } from "@/components/ui/button"
import { Plus, Sprout, Edit, Tag, Percent, Archive, PackageCheck, PackageX } from "lucide-react"
import Link from 'next/link'

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case 'ACTIVE':
      return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><PackageCheck className="h-3 w-3" /> Disponible</span>
    case 'ARCHIVED':
      return <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Archive className="h-3 w-3" /> Hors saison</span>
    case 'OUT_OF_STOCK':
      return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><PackageX className="h-3 w-3" /> Épuisé</span>
    default:
      return null
  }
}

export default async function SeedsPage() {
  const seeds = await prisma.product.findMany({
    where: { type: 'SEED' },
    include: {
      category: {
        select: { name: true }
      },
      images: {
        take: 1,
        orderBy: { index: "asc" }
      },
      variants: {
        orderBy: { isDefault: 'desc' },
        take: 1
      }
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })

  return (
    <div className="space-y-12 p-6 max-w-7xl mx-auto pb-24">
      {/* Hero Section */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg bg-green-500/10 border border-green-500/20">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <div className="bg-green-500/20 p-4 rounded-full">
            <Sprout className="h-12 w-12 text-green-600" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground uppercase tracking-widest">
              Graines & Semences
            </h1>
            <p className="text-muted-foreground text-lg mt-2">Gérez vos variétés de graines et conseils de semis</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center -mt-16 relative z-10">
        <Button asChild size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform bg-green-600 text-white hover:bg-green-700">
          <Link href="/admin/seed/create">
            <Plus className="mr-3 h-8 w-8" />
            Ajouter une Graine
          </Link>
        </Button>
      </div>

      {/* Seeds Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {seeds.map((seed) => {
          const defaultVariant = seed.variants[0];

          return (
            <div key={seed.id} className="group bg-card rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl hover:border-green-500/20">
              <div className="aspect-[4/3] relative bg-muted overflow-hidden">
                {seed.images[0] ? (
                  <Image
                    src={seed.images[0].url}
                    alt={seed.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground opacity-30">
                    <Sprout className="h-16 w-16" />
                  </div>
                )}
                {seed.isPromotion && (
                  <div className="absolute top-4 left-4 bg-green-600 text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
                    <Percent className="h-3 w-3" /> Promo
                  </div>
                )}
              </div>
              
              <div className="p-5 flex-1 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <h3 className="font-bold text-lg leading-tight group-hover:text-green-600 transition-colors line-clamp-1">
                      {seed.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs">
                      <Tag className="h-3 w-3" />
                      {seed.category?.name || "Graines"}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-green-600">
                      {defaultVariant ? Number(defaultVariant.price).toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' }) : 'N/A'}
                    </span>
                    <div className="text-[10px] text-muted-foreground font-medium">
                      {defaultVariant?.priceUnit === 'UNIT' ? 'le sachet' : `par ${defaultVariant?.priceUnit || 'UNIT'}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed">
                  <StatusBadge status={defaultVariant?.status || 'ACTIVE'} />
                  <Button variant="outline" size="sm" asChild className="rounded-full px-4 gap-2 hover:bg-green-600 hover:text-white transition-all hover:border-green-600">
                    <Link href={`/admin/seed/${seed.id}`}>
                      <Edit className="h-4 w-4" />
                      Modifier
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
        {seeds.length === 0 && (
          <div className="col-span-full py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Sprout className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-semibold">Aucune graine trouvée</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              Votre collection de graines est vide. Commencez par ajouter votre première variété.
            </p>
            <Button asChild className="mt-6 rounded-full px-8 bg-green-600 hover:bg-green-700">
              <Link href="/admin/seed/create">Ajouter une graine</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
