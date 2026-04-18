"use client"

import Image from 'next/image'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { imageSchema, type ImageSchema } from '@/lib/validation/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useEffect } from 'react'

interface ImageFormProps {
  image: {
    id: string
    url: string
    cloudinaryUrl?: string
    saved?: boolean
    saving?: boolean
    uploading?: boolean
  }
  onSave: (id: string, data: ImageSchema) => Promise<void>
  onRemove: (id: string) => void
}

export const ImageForm = ({ image, onSave, onRemove }: ImageFormProps) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ImageSchema>({
    resolver: zodResolver(imageSchema),
    defaultValues: {
      url: image.cloudinaryUrl || image.url,
      altText: '',
      shortDescription: '',
    },
  })

  // Update form URL when cloudinaryUrl is received from parent
  useEffect(() => {
    if (image.cloudinaryUrl) {
      setValue('url', image.cloudinaryUrl)
    }
  }, [image.cloudinaryUrl, setValue])

  const onSubmit = async (data: ImageSchema) => {
    // Double check we're not saving a local blob URL
    if (data.url.startsWith('blob:')) {
      if (image.cloudinaryUrl) {
        data.url = image.cloudinaryUrl
      } else {
        return // Should not happen if button is disabled
      }
    }
    await onSave(image.id, data)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={`group flex flex-col md:flex-row gap-6 rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md ${
        Object.keys(errors).length > 0 ? 'border-destructive/20 bg-destructive/5' : 'border-border'
      }`}
    >
      <div className="relative aspect-square w-full md:w-48 shrink-0 overflow-hidden rounded-xl border bg-muted">
        <Image
          src={image.url}
          alt="Preview"
          fill
          className="object-cover"
        />
        {(image.saving || image.uploading) && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className="flex flex-col items-center gap-2">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-xs font-medium text-white">
                {image.uploading ? 'Upload...' : 'Sauvegarde...'}
              </span>
            </div>
          </div>
        )}
        {image.saved && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-500/80 backdrop-blur-sm">
            <span className="font-bold text-white uppercase tracking-wider">Enregistré</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`altText-${image.id}`} className="text-sm font-semibold">Texte Alternatif (Alt Text)</Label>
            <Input
              id={`altText-${image.id}`}
              {...register('altText')}
              placeholder="Ex: Belle plante verte dans un pot..."
              className={errors.altText ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={image.saved || image.saving || image.uploading}
            />
            {errors.altText && <p className="text-xs text-destructive">{errors.altText.message}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor={`shortDescription-${image.id}`} className="text-sm font-semibold">Description Courte</Label>
            <Input
              id={`shortDescription-${image.id}`}
              {...register('shortDescription')}
              placeholder="Ex: Monstera Deliciosa..."
              className={errors.shortDescription ? 'border-destructive focus-visible:ring-destructive' : ''}
              disabled={image.saved || image.saving || image.uploading}
            />
            {errors.shortDescription && <p className="text-xs text-destructive">{errors.shortDescription.message}</p>}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t">
          <div className="flex gap-3">
            <Button
              type="submit"
              disabled={image.saving || image.saved || image.uploading}
              className="min-w-[100px]"
            >
              {image.uploading ? 'Attente upload...' : image.saving ? 'Sauvegarde...' : image.saved ? 'Enregistré' : 'Enregistrer'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => onRemove(image.id)}
              disabled={image.saving || image.uploading}
            >
              Supprimer
            </Button>
          </div>
          {Object.keys(errors).length > 0 && (
            <span className="text-xs text-destructive font-medium bg-destructive/10 px-3 py-1 rounded-full">
              Informations requises
            </span>
          )}
        </div>
      </div>
    </form>
  )
}
