"use client"

import React, { useState } from 'react'
import { ImageDropzone } from '@/components/ui/image-dropzone'
import { Button } from '@/components/ui/button'
import { ImageForm } from './ImageForm'
import { type ImageSchema } from '@/lib/validation/image'

interface UploadedImage {
  id: string
  url: string
  cloudinaryUrl?: string
  file: File
  uploading?: boolean
  saving?: boolean
  saved?: boolean
  dbId?: string
  altText?: string
  shortDescription?: string
  metaTitle?: string
  metaDescription?: string
}

const Page = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const handleUpload = async (files: File[]) => {
    // 1. Create temporary entries with local URLs
    const newEntries: UploadedImage[] = files.map((file) => ({
      id: Math.random().toString(36).substring(7),
      url: URL.createObjectURL(file),
      file,
      uploading: true,
    }))

    setUploadedImages((prev) => [...prev, ...newEntries])

    // 2. Upload each file individually
    newEntries.forEach(async (entry) => {
      try {
        const formData = new FormData()
        formData.append('file', entry.file)

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!response.ok) throw new Error('Upload failed')

        const data = await response.json()

        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === entry.id
              ? { ...img, url: data.image.url, cloudinaryUrl: data.image.url, uploading: false }
              : img
          )
        )
      } catch (error) {
        console.error('Error uploading image:', error)
        setUploadedImages((prev) =>
          prev.map((img) =>
            img.id === entry.id ? { ...img, uploading: false } : img
          )
        )
      }
    })
  }

  const handleSave = async (id: string, data: ImageSchema) => {
    setUploadedImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, saving: true } : img))
    )

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error('Save failed')
      }

      const result = await response.json()

      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? { ...img, saving: false, saved: true, dbId: result.image.id }
            : img
        )
      )
    } catch (error) {
      console.error('Error saving image:', error)
      setUploadedImages((prev) =>
        prev.map((img) => (img.id === id ? { ...img, saving: false } : img))
      )
    }
  }


  const handleRemove = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div className="p-6 max-w-5xl mx-auto pb-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Ajouter des images</h1>
        <p className="text-muted-foreground mt-2">
          Téléchargez vos images et renseignez les informations nécessaires pour le SEO et l&apos;accessibilité.
        </p>
      </div>

      <ImageDropzone 
        files={uploadedImages.map(img => img.file)}
        previews={uploadedImages.map(img => img.url)}
        uploadingStates={uploadedImages.map(img => !!img.uploading)}
        onUpload={handleUpload} 
        onRemove={(index) => {
          const idToRemove = uploadedImages[index]?.id
          if (idToRemove) handleRemove(idToRemove)
        }}
        onClear={() => setUploadedImages([])}
      />

      {uploadedImages.length > 0 && (
        <div className="mt-16 space-y-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h2 className="text-2xl font-semibold">Détails des images ({uploadedImages.length})</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setUploadedImages([])}
              className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            >
              Tout effacer
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-8">
            {uploadedImages.map((image) => (
              <ImageForm 
                key={image.id}
                image={image}
                onSave={handleSave}
                onRemove={handleRemove}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page
