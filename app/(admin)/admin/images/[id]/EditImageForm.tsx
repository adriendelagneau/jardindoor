"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { imageUpdateSchema, type ImageUpdateSchema } from '@/lib/validation/image'
import { updateImage, deleteImage } from '@/actions/images'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog'
import { Loader2, Trash2, ArrowLeft, Save, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { ImageDropzone } from '@/components/ui/image-dropzone'

interface EditImageFormProps {
  image: {
    id: string
    url: string
    altText: string
    shortDescription: string
  }
}

export const EditImageForm = ({ image }: EditImageFormProps) => {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [currentUrl, setCurrentUrl] = useState(image.url)
  const [isUploading, setIsUploading] = useState(false)
  const [tempFile, setTempFile] = useState<File | null>(null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ImageUpdateSchema>({
    resolver: zodResolver(imageUpdateSchema),
    defaultValues: {
      url: image.url,
      altText: image.altText,
      shortDescription: image.shortDescription,
    },
  })

  const handleImageReplace = async (files: File[]) => {
    if (files.length === 0) return
    
    const file = files[0]
    setTempFile(file)
    setIsUploading(true)
    
    // Show local preview immediately
    const localUrl = URL.createObjectURL(file)
    setCurrentUrl(localUrl)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) throw new Error('Upload failed')

      const data = await response.json()
      setCurrentUrl(data.image.url)
      setValue('url', data.image.url, { shouldDirty: true })
    } catch (error) {
      console.error('Error uploading replacement:', error)
      // Revert to original on error
      setCurrentUrl(image.url)
      setTempFile(null)
    } finally {
      setIsUploading(false)
    }
  }

  const onSubmit = async (data: ImageUpdateSchema) => {
    setIsSaving(true)
    try {
      await updateImage(image.id, data)
      router.refresh()
      router.push('/admin/images')
    } catch (error) {
      console.error('Error updating image:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteImage(image.id)
      setIsDialogOpen(false)
      router.push('/admin/images')
      router.refresh()
    } catch (error) {
      console.error('Error deleting image:', error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <Button variant="ghost" asChild size="sm" className="gap-2">
          <Link href="/admin/images">
            <ArrowLeft className="h-4 w-4" />
            Retour à la liste
          </Link>
        </Button>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button variant="destructive" size="sm" className="gap-2">
              <Trash2 className="h-4 w-4" />
              Supprimer l&apos;image
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Êtes-vous sûr ?</DialogTitle>
              <DialogDescription>
                Cette action est irréversible. Cela supprimera définitivement l&apos;image et ses métadonnées de la base de données.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isDeleting}>
                Annuler
              </Button>
              <Button variant="destructive" onClick={handleDelete} disabled={isDeleting} className="gap-2">
                {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                {isDeleting ? 'Suppression...' : 'Confirmer la suppression'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Visual Preview & Replacement */}
        <div className="space-y-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-3xl shadow-2xl border bg-muted group">
            <Image
              src={currentUrl}
              alt={image.altText}
              fill
              className={`object-contain p-4 transition-opacity duration-300 ${isUploading ? 'opacity-40' : 'opacity-100'}`}
              priority
            />
            {isUploading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/10 backdrop-blur-sm">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p className="mt-2 font-bold text-primary uppercase tracking-widest">Upload en cours...</p>
              </div>
            )}
          </div>
          
          <div className="space-y-3">
            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <RefreshCw className="h-4 w-4" />
              Remplacer le fichier image
            </Label>
            <ImageDropzone 
              maxFiles={1}
              onUpload={handleImageReplace}
              className="border-primary/20 bg-primary/5 hover:bg-primary/10"
              files={tempFile ? [tempFile] : []}
              previews={[]} // We don't need previews here as we use our main preview
              onClear={() => {
                setTempFile(null)
                setCurrentUrl(image.url)
                setValue('url', image.url, { shouldDirty: false })
              }}
            />
          </div>

          <div className="bg-muted/50 p-4 rounded-xl space-y-2 border border-dashed">
            <p className="text-xs font-mono text-muted-foreground break-all">ID: {image.id}</p>
            <p className="text-xs font-mono text-muted-foreground break-all">URL actuelle: {currentUrl}</p>
          </div>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-card p-8 rounded-3xl border shadow-sm h-full">
          <div className="space-y-2 border-b pb-4">
            <h2 className="text-2xl font-bold tracking-tight">Modifier les détails</h2>
            <p className="text-muted-foreground">Les modifications affecteront également les métadonnées SEO.</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="altText" className="text-sm font-semibold">Texte Alternatif (Alt Text)</Label>
              <Input
                id="altText"
                {...register('altText')}
                className={errors.altText ? 'border-destructive focus-visible:ring-destructive h-12' : 'h-12'}
                placeholder="Ex: Belle plante verte dans un pot..."
                disabled={isSaving || isUploading}
              />
              {errors.altText && <p className="text-xs text-destructive mt-1">{errors.altText.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="shortDescription" className="text-sm font-semibold">Description Courte</Label>
              <Input
                id="shortDescription"
                {...register('shortDescription')}
                className={errors.shortDescription ? 'border-destructive focus-visible:ring-destructive h-12' : 'h-12'}
                placeholder="Ex: Monstera Deliciosa..."
                disabled={isSaving || isUploading}
              />
              {errors.shortDescription && <p className="text-xs text-destructive mt-1">{errors.shortDescription.message}</p>}
            </div>
          </div>

          <div className="pt-6">
            <Button 
              type="submit" 
              className="w-full h-12 text-lg font-semibold gap-2 shadow-lg hover:shadow-xl transition-all"
              disabled={isSaving || isUploading || !isDirty}
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
            {!isDirty && !isUploading && (
              <p className="text-center text-xs text-muted-foreground mt-3 italic">
                Aucune modification détectée
              </p>
            )}
            {isUploading && (
              <p className="text-center text-xs text-primary mt-3 animate-pulse font-medium">
                Veuillez patienter la fin de l&apos;upload...
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

