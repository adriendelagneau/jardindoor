"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { productSchema as schema, productUpdateSchema as updateSchema, type ProductSchema } from '@/lib/validation/product'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { 
  Loader2, Trash2, ArrowLeft, Save, Info, Settings2, 
  Image as ImageIcon, Check, Percent, DollarSign 
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { cn } from '@/lib/utils'

interface ProductInitialData extends ProductSchema {
  id: string
  images: { id: string, url: string, altText: string }[]
}

interface ProductFormProps {
  initialData?: ProductInitialData
  categories: { id: string, name: string }[]
  availableImages: { id: string, url: string, altText: string }[]
  isEdit?: boolean
  productType?: 'PRODUCT' | 'SEED'
}

export const ProductForm = ({ initialData, categories, availableImages, isEdit = false, productType = 'PRODUCT' }: ProductFormProps) => {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
    initialData?.images?.map((img) => img.id) || []
  )

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductSchema>({
    resolver: zodResolver(isEdit ? updateSchema : schema),
    defaultValues: initialData ? {
      ...initialData,
      price: Number(initialData.price),
      imageIds: initialData.images?.map((img) => img.id) || []
    } : {
      name: '',
      slug: '',
      description: '',
      price: 0,
      priceUnit: 'UNIT',
      status: 'ACTIVE',
      type: productType,
      isPromotion: false,
      categoryId: '',
      metaTitle: '',
      metaDescription: '',
      imageIds: [],
    },
  })

  const nameValue = watch('name')
  
  // Auto-slug
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

  const toggleImage = (imageId: string) => {
    const newSelection = selectedImageIds.includes(imageId)
      ? selectedImageIds.filter(id => id !== imageId)
      : [...selectedImageIds, imageId]
    
    setSelectedImageIds(newSelection)
    setValue('imageIds', newSelection, { shouldDirty: true })
  }

  const onSubmit = async (data: ProductSchema) => {
    setIsSaving(true)
    const baseApi = productType === 'SEED' ? '/api/seeds' : '/api/products'
    const url = isEdit ? `${baseApi}/${initialData.id}` : baseApi
    const method = isEdit ? 'PATCH' : 'POST'
    const redirectUrl = productType === 'SEED' ? '/admin/seed' : '/admin/products'

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, type: productType }),
      })

      if (!response.ok) throw new Error('Action failed')

      router.push(redirectUrl)
      router.refresh()
    } catch (error) {
      console.error('Error saving product:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!initialData?.id) return
    setIsDeleting(true)
    const baseApi = productType === 'SEED' ? '/api/seeds' : '/api/products'
    const redirectUrl = productType === 'SEED' ? '/admin/seed' : '/admin/products'
    
    try {
      const response = await fetch(`${baseApi}/${initialData.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Delete failed')

      setIsDialogOpen(false)
      router.push(redirectUrl)
      router.refresh()
    } catch (error) {
      console.error('Error deleting product:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  const labelPrefix = productType === 'SEED' ? 'la graine' : 'le produit'
  const titleLabel = productType === 'SEED' ? 'Nouvelle Graine' : 'Nouveau Produit'
  const editLabel = productType === 'SEED' ? 'la graine' : 'le produit'

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild size="icon" className="rounded-full">
            <Link href={productType === 'SEED' ? "/admin/seed" : "/admin/products"}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit ? `Modifier "${initialData.name}"` : titleLabel}
            </h1>
            <p className="text-muted-foreground">
              {isEdit ? `Mettez à jour les informations de ${editLabel}.` : `Ajoutez ${labelPrefix === 'la graine' ? 'une' : 'un'} ${productType === 'SEED' ? 'graine' : 'article'} à votre catalogue.`}
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
                <DialogTitle>Supprimer {productType === 'SEED' ? 'cette graine' : 'ce produit'} ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Toutes les données seront définitivement supprimées.
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

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Informations générales</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-sm font-semibold">{productType === 'SEED' ? 'Nom de la graine' : 'Nom du produit'}</Label>
                <Input
                  id="name"
                  {...register('name')}
                  placeholder={productType === 'SEED' ? "Ex: Tomate Coeur de Boeuf" : "Ex: Monstera Deliciosa XXL"}
                  className={errors.name ? 'border-destructive h-12 rounded-xl bg-muted/30 focus-visible:ring-destructive text-lg font-medium' : 'h-12 rounded-xl bg-muted/30 text-lg font-medium'}
                />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-semibold">Slug (URL)</Label>
                <Input
                  id="slug"
                  {...register('slug')}
                  placeholder={productType === 'SEED' ? "tomate-coeur-de-boeuf" : "monstera-deliciosa-xxl"}
                  className={errors.slug ? 'border-destructive h-11 rounded-xl bg-muted/30 focus-visible:ring-destructive' : 'h-11 rounded-xl bg-muted/30'}
                />
                {errors.slug && <p className="text-xs text-destructive">{errors.slug.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId" className="text-sm font-semibold">Catégorie</Label>
                <select
                  id="categoryId"
                  {...register('categoryId')}
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
                <textarea
                  id="description"
                  {...register('description')}
                  rows={6}
                  className="flex w-full rounded-2xl border border-input bg-muted/30 px-4 py-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder={productType === 'SEED' ? "Décrivez les caractéristiques de vos graines, conseils de plantation..." : "Décrivez les caractéristiques de votre produit..."}
                />
              </div>
            </div>
          </Card>

          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <ImageIcon className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{productType === 'SEED' ? 'Images de la graine' : 'Images du produit'}</h2>
                <p className="text-xs text-muted-foreground">Sélectionnez les images à associer</p>
              </div>
              <Link href="/admin/images/create" className="text-xs text-primary font-bold hover:underline">
                + Uploader de nouvelles images
              </Link>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {availableImages.map((img) => (
                <div 
                  key={img.id}
                  onClick={() => toggleImage(img.id)}
                  className={cn(
                    "relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all group",
                    selectedImageIds.includes(img.id) 
                      ? "border-primary shadow-lg ring-2 ring-primary/20" 
                      : "border-transparent opacity-70 hover:opacity-100"
                  )}
                >
                  <Image
                    src={img.url}
                    alt={img.altText}
                    fill
                    className="object-cover"
                  />
                  {selectedImageIds.includes(img.id) && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1 shadow-md">
                      <Check className="h-3 w-3 font-bold" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold uppercase bg-black/40 px-2 py-1 rounded-full backdrop-blur-sm">
                      {selectedImageIds.includes(img.id) ? 'Désélectionner' : 'Sélectionner'}
                    </span>
                  </div>
                </div>
              ))}
              {availableImages.length === 0 && (
                <div className="col-span-full py-10 text-center bg-muted/30 rounded-2xl border border-dashed">
                  <p className="text-muted-foreground text-sm">Aucune image disponible.</p>
                  <Link href="/admin/images/create" className="text-xs text-primary font-bold hover:underline mt-2 inline-block">
                    Uploader des images d&apos;abord
                  </Link>
                </div>
              )}
            </div>
          </Card>

          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Settings2 className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">SEO & Réseaux sociaux</h2>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle" className="text-sm font-semibold">Meta Titre</Label>
                <Input
                  id="metaTitle"
                  {...register('metaTitle')}
                  placeholder="Titre SEO"
                  className="h-11 rounded-xl bg-muted/30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metaDescription" className="text-sm font-semibold">Meta Description</Label>
                <Input
                  id="metaDescription"
                  {...register('metaDescription')}
                  placeholder="Description SEO"
                  className="h-11 rounded-xl bg-muted/30"
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold border-b pb-4">Prix et Statut</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-semibold flex items-center gap-2"><DollarSign className="h-4 w-4" /> Prix</Label>
                <div className="relative">
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    {...register('price')}
                    className="h-12 pl-10 rounded-xl bg-muted/30 text-lg font-bold"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-muted-foreground">€</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priceUnit" className="text-sm font-semibold">Unité de vente</Label>
                <select
                  id="priceUnit"
                  {...register('priceUnit')}
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="UNIT">À l&apos;unité / Sachet</option>
                  <option value="KG">Au Kilo (Kg)</option>
                  <option value="L">Au Litre (L)</option>
                </select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-2xl bg-primary/5 border border-primary/10">
                <Label htmlFor="isPromotion" className="text-sm font-bold cursor-pointer flex items-center gap-2">
                  <Percent className="h-4 w-4 text-primary" /> En promotion
                </Label>
                <input
                  id="isPromotion"
                  type="checkbox"
                  {...register('isPromotion')}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">Statut {productType === 'SEED' ? 'de la graine' : 'du produit'}</Label>
                <select
                  id="status"
                  {...register('status')}
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring font-bold"
                >
                  <option value="ACTIVE" className="text-green-600">En vente (Actif)</option>
                  <option value="OUT_OF_STOCK" className="text-amber-600">Rupture de stock</option>
                  <option value="ARCHIVED" className="text-slate-600">Archivé</option>
                </select>
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
              {isEdit ? 'Mettre à jour' : `Publier ${productType === 'SEED' ? 'la graine' : 'le produit'}`}
            </Button>
            
            <Button 
              type="button" 
              variant="outline" 
              asChild 
              className="w-full h-12 rounded-2xl"
            >
              <Link href={productType === 'SEED' ? "/admin/seed" : "/admin/products"}>Annuler</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}

