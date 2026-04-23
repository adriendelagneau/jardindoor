import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Plus, FolderTree, Edit, ChevronRight, Hash } from "lucide-react"
import LinkNext from 'next/link'
import Image from 'next/image'

export default async function CategoriesPage() {
  const categories = await prisma.category.findMany({
    include: {
      parent: {
        select: { name: true }
      },
      _count: {
        select: { products: true, children: true }
      }
    },
    orderBy: [
      { parentId: 'asc' },
      { name: 'asc' }
    ]
  })

  return (
    <div className="py-8 lg:py-12 mx-2 space-y-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Catégories</h1>
          <p className="text-muted-foreground">Gérez la structure de votre boutique.</p>
        </div>
        <LinkNext href="/admin/categories/create">
          <Button className="gap-2">
            <Plus size={18} /> Créer une catégorie
          </Button>
        </LinkNext>
      </div>

      {/* Hero Section */}
      <Card className="relative h-[480px] w-full overflow-hidden shadow-lg border-none bg-primary">
        <Image 
          src="/home-img.png" 
          alt="Catégories banner" 
          fill 
          sizes="100vw"
          className="object-cover opacity-40" 
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <FolderTree className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold font-serif uppercase tracking-widest">
              Catégories
            </h2>
          </div>
          <p className="max-w-lg text-lg opacity-90">
            Organisez votre boutique en créant une structure logique de catégories et sous-catégories.
          </p>
        </div>
      </Card>

      {/* Categories List */}
      <div className="bg-card rounded-3xl border shadow-sm overflow-hidden mt-8">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b">
                <th className="p-4 font-semibold text-sm">Nom</th>
                <th className="p-4 font-semibold text-sm">Slug</th>
                <th className="p-4 font-semibold text-sm">Parent</th>
                <th className="p-4 font-semibold text-sm text-center">Produits</th>
                <th className="p-4 font-semibold text-sm text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id} className="border-b hover:bg-muted/30 transition-colors group">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {category.parentId && <ChevronRight className="h-4 w-4 text-muted-foreground ml-2" />}
                      <span className="font-medium text-base">{category.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm text-muted-foreground font-mono">{category.slug}</td>
                  <td className="p-4 text-sm">
                    {category.parent ? (
                      <span className="bg-primary/10 text-primary px-2 py-1 rounded-md text-xs font-medium border border-primary/20">
                        {category.parent.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">Racine</span>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className="bg-muted px-3 py-1 rounded-full text-xs font-bold">
                      {category._count.products}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <Button variant="ghost" size="icon-sm" asChild className="hover:bg-primary/20 hover:text-primary transition-colors">
                      <LinkNext href={`/admin/categories/${category.id}`}>
                        <Edit className="h-4 w-4" />
                      </LinkNext>
                    </Button>
                  </td>
                </tr>
              ))}
              {categories.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="bg-muted p-4 rounded-full">
                        <FolderTree className="h-10 w-10 text-muted-foreground opacity-20" />
                      </div>
                      <p className="text-muted-foreground font-medium">Aucune catégorie trouvée</p>
                      <Button asChild variant="outline">
                        <LinkNext href="/admin/categories/create">Ajouter votre première catégorie</LinkNext>
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
  )
}
