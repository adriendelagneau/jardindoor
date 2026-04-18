"use client"

import React, { useState } from 'react'
import Image from 'next/image'
import { ImageDropzone } from '@/components/ui/image-dropzone'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

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
}

const Page = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])

  const handleUpload = async (files: File[]) => {
    const newImages: UploadedImage[] = await Promise.all(
      files.map(async (file) => {
        const localUrl = URL.createObjectURL(file)
        
        try {
          const formData = new FormData()
          formData.append('file', file)

          const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData,
          })

          if (!response.ok) {
            throw new Error('Upload failed')
          }

          const data = await response.json()

          return {
            id: Math.random().toString(36).substring(7),
            url: data.image.url,
            cloudinaryUrl: data.image.url,
            file,
            uploading: false,
          }
        } catch (error) {
          console.error('Error uploading image:', error)
          return {
            id: Math.random().toString(36).substring(7),
            url: localUrl,
            file,
            uploading: false,
          }
        }
      })
    )

    setUploadedImages((prev) => [...prev, ...newImages])
  }

  const handleSave = async (image: UploadedImage) => {
    if (!image.cloudinaryUrl) return

    setUploadedImages((prev) =>
      prev.map((img) => (img.id === image.id ? { ...img, saving: true } : img))
    )

    try {
      const response = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: image.cloudinaryUrl,
          altText: image.altText,
          shortDescription: image.shortDescription,
          metaTitle: image.metaTitle,
          metaDescription: image.metaDescription,
        }),
      })

      if (!response.ok) {
        throw new Error('Save failed')
      }

      const data = await response.json()

      setUploadedImages((prev) =>
        prev.map((img) =>
          img.id === image.id
            ? { ...img, saving: false, saved: true, dbId: data.image.id }
            : img
        )
      )
    } catch (error) {
      console.error('Error saving image:', error)
      setUploadedImages((prev) =>
        prev.map((img) => (img.id === image.id ? { ...img, saving: false } : img))
      )
    }
  }

  const handleSaveAll = async () => {
    const unsavedImages = uploadedImages.filter((img) => !img.saved)
    await Promise.all(unsavedImages.map(handleSave))
  }

  const handleRemove = (id: string) => {
    setUploadedImages((prev) => prev.filter((img) => img.id !== id))
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Images</h1>
        {uploadedImages.length > 0 && (
          <Button onClick={handleSaveAll} variant="default">
            Save All
          </Button>
        )}
      </div>

      <ImageDropzone onUpload={handleUpload} />

      {uploadedImages.length > 0 && (
        <div className="mt-6 space-y-4">
          <h2 className="text-lg font-medium">Uploaded Images</h2>
          <div className="space-y-4">
            {uploadedImages.map((image) => (
              <div
                key={image.id}
                className={`flex gap-4 rounded-lg border p-4 ${
                  !image.altText || !image.shortDescription ? 'border-destructive' : ''
                }`}
              >
                <div className="relative aspect-square w-32 shrink-0 overflow-hidden rounded-lg border">
                  <Image
                    src={image.url}
                    alt="Preview"
                    fill
                    className="object-cover"
                  />
                  {image.saving && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                      <span className="text-xs text-white">Saving...</span>
                    </div>
                  )}
                  {image.saved && (
                    <div className="absolute bottom-0 left-0 right-0 bg-green-600 px-2 py-1 text-center text-xs text-white">
                      Saved
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <Label htmlFor={`altText-${image.id}`} className="text-xs font-medium">Alt Text</Label>
                    <Input
                      id={`altText-${image.id}`}
                      value={image.altText || ''}
                      onChange={(e) =>
                        setUploadedImages((prev) =>
                          prev.map((img) =>
                            img.id === image.id
                              ? { ...img, altText: e.target.value }
                              : img
                          )
                        )
                      }
                      placeholder="Describe the image..."
                      className="h-8"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`shortDescription-${image.id}`} className="text-xs font-medium">Short Description</Label>
                    <Input
                      id={`shortDescription-${image.id}`}
                      value={image.shortDescription || ''}
                      onChange={(e) =>
                        setUploadedImages((prev) =>
                          prev.map((img) =>
                            img.id === image.id
                              ? { ...img, shortDescription: e.target.value }
                              : img
                          )
                        )
                      }
                      placeholder="Brief description..."
                      className="h-8"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSave(image)}
                      disabled={image.saving || image.saved}
                    >
                      {image.saving ? 'Saving...' : image.saved ? 'Saved' : 'Save'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemove(image.id)}
                    >
                      Remove
                    </Button>
                  </div>
                  {(!image.altText || !image.shortDescription) && !image.saved && (
                    <p className="text-xs text-destructive">
                      Alt text and short description are required
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default Page