import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { Button } from "@/components/ui/button"
import { Plus, FolderTree, Edit, ChevronRight, Hash } from "lucide-react"
import LinkNext from 'next/link'

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
      { position: 'asc' },
      { name: 'asc' }
    ]
  })

  return (
    <div className="space-y-12 p-6 max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="relative h-64 w-full overflow-hidden rounded-3xl shadow-lg bg-primary/10 border border-primary/20">
        <div className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-4 text-center">
          <div className="bg-primary/20 p-4 rounded-full">
            <FolderTree className="h-12 w-12 text-primary" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-foreground uppercase tracking-widest">
              Catégories
            </h1>
            <p className="text-muted-foreground text-lg mt-2">Organisez vos produits par familles et sous-familles</p>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-center -mt-16 relative z-10">
        <Button asChild size="lg" className="h-16 px-10 text-xl rounded-full shadow-2xl hover:scale-105 transition-transform bg-primary text-primary-foreground">
          <LinkNext href="/admin/categories/create">
            <Plus className="mr-3 h-8 w-8" />
            Créer une catégorie
          </LinkNext>
        </Button>
      </div>

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
                <th className="p-4 font-semibold text-sm text-center">Position</th>
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
                  <td className="p-4 text-center text-sm">
                    <div className="flex items-center justify-center gap-1 text-muted-foreground">
                      <Hash className="h-3 w-3" />
                      {category.position}
                    </div>
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
