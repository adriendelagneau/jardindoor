"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Trash2, ArrowLeft, Save, Info, Settings2 } from 'lucide-react'
import Link from 'next/link'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { createCategory, updateCategory, deleteCategory } from '@/actions/categories'

// Actually I created lib/validation/category.ts
import { categorySchema as schema, categoryUpdateSchema as updateSchema, type CategorySchema } from '@/lib/validation/category'
import { Card } from '@/components/ui/card'

interface CategoryFormProps {
  initialData?: CategorySchema & { id: string }
  availableCategories: { id: string, name: string }[]
  isEdit?: boolean
}

export const CategoryForm = ({ initialData, availableCategories, isEdit = false }: CategoryFormProps) => {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<CategorySchema>({
    resolver: zodResolver(isEdit ? updateSchema : schema),
    defaultValues: initialData || {
      name: '',
      slug: '',
      description: '',
      position: 0,
      parentId: null,
      metaTitle: '',
      metaDescription: '',
    },
  })

  const nameValue = watch('name')
  
  // Auto-generate slug from name if it's empty or hasn't been manually edited much
  React.useEffect(() => {
    if (!isEdit && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
      setValue('slug', slug, { shouldValidate: true })
    }
  }, [nameValue, setValue, isEdit])

  const onSubmit = async (data: CategorySchema) => {
    setIsSaving(true)
    try {
      if (isEdit && initialData?.id) {
        await updateCategory(initialData.id, data)
      } else {
        await createCategory(data)
      }

      router.push('/admin/categories')
      router.refresh()
    } catch (error) {
      console.error('Error saving category:', error)
      // If toast is not available, I'll just console error for now
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    setIsDeleting(true)
    try {
      await deleteCategory(initialData.id)

      setIsDialogOpen(false)
      router.push('/admin/categories')
      router.refresh()
    } catch (error) {
      console.error('Error deleting category:', error)
      alert(error instanceof Error ? error.message : 'Failed to delete category')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild size="icon" className="rounded-full">
            <Link href="/admin/categories">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit ? `Modifier "${initialData.name}"` : 'Nouvelle catégorie'}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? 'Mettez à jour les informations de votre catégorie.' : 'Créez une nouvelle structure pour vos produits.'}
            </p>
          </div>
        </div>

        {isEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-2 rounded-full px-4 shadow-sm hover:shadow-md transition-all">
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supprimer la catégorie ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Les produits associés ne seront pas supprimés, mais ils perdront leur lien avec cette catégorie.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isDeleting}>
                  Annuler
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
                  {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  {isDeleting ? 'Suppression...' : 'Confirmer'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Informations générales</h2>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">Nom de la catégorie</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder="Ex: Plantes d'intérieur"
                  className={errors.name ? 'border-destructive h-12 rounded-xl bg-muted/30 focus-visible:ring-destructive' : 'h-12 rounded-xl bg-muted/30'}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-semibold">Slug (URL)</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder="plantes-interieur"
                  className={errors.slug ? 'border-destructive h-12 rounded-xl bg-muted/30 focus-visible:ring-destructive' : 'h-12 rounded-xl bg-muted/30'}
                />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-semibold">Description (Optionnelle)</Label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={4}
                  className="flex w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="Décrivez ce que contient cette catégorie..."
                />
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Settings2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Configuration SEO</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-sm font-semibold">Meta Titre</Label>
                <Input
                  id="metaTitle"
                  {...register('metaTitle')}
                  placeholder="Titre pour les moteurs de recherche"
                  className="h-11 rounded-xl bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-sm font-semibold">Meta Description</Label>
                <Input
                  id="metaDescription"
                  {...register('metaDescription')}
                  placeholder="Description pour les moteurs de recherche"
                  className="h-11 rounded-xl bg-muted/30"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold border-b pb-4">Organisation</h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="parentId" className="text-sm font-semibold">Catégorie Parente</Label>
                <select
                  id="parentId"
                  {...register('parentId')}
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">-- Aucune (Catégorie Racine) --</option>
                  {availableCategories
                    .filter(c => c.id !== initialData?.id) // Prevent selecting self as parent
                    .map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))
                  }
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-semibold">Ordre d&apos;affichage (Position)</Label>
                <Input
                  id="position"
                  type="number"
                  {...register('position', { valueAsNumber: true })}
                  className="h-11 rounded-xl bg-muted/30"
                />
              </div>
            </div>
          </Card>

          <div className="sticky top-24 space-y-4">
            <Button 
              type="submit" 
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all gap-2"
              disabled={isSaving || (isEdit && !isDirty)}
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isEdit ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              asChild 
              className="w-full h-12 rounded-2xl"
            >
              <Link href="/admin/categories">Annuler</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
