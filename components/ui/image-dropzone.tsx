"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ImageDropzoneProps {
  files?: File[]
  previews?: string[]
  uploadingStates?: boolean[]
  onUpload?: (files: File[]) => void
  onRemove?: (index: number) => void
  onClear?: () => void
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function ImageDropzone({
  files = [],
  previews = [],
  uploadingStates = [],
  onUpload,
  onRemove,
  onClear,
  maxFiles = 100,
  maxSize = 5 * 1024 * 1024,
  className,
}: ImageDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (onUpload) {
        onUpload(acceptedFiles)
      }
    },
    [onUpload]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      },
      maxFiles: maxFiles - files.length,
      maxSize,
      disabled: files.length >= maxFiles,
    })

  return (
    <div className={cn("space-y-4", className)}>
      <div
        {...getRootProps()}
        className={cn(
          "relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors",
          isDragActive
            ? "border-primary bg-primary/5"
            : isDragReject
            ? "border-destructive bg-destructive/5"
            : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50"
        )}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-3 text-center">
          <div
            className={cn(
              "flex h-14 w-14 items-center justify-center rounded-full",
              isDragActive
                ? "bg-primary/10"
                : "bg-muted"
            )}
          >
            <Upload
              className={cn(
                "h-6 w-6",
                isDragActive ? "text-primary" : "text-muted-foreground"
              )}
            />
          </div>

          <div className="space-y-1">
            <p className="text-sm font-medium">
              {isDragActive
                ? "Déposez les images ici"
                : "Glissez-déposez vos images ici"}
            </p>
            <p className="text-xs text-muted-foreground">
              ou cliquez pour sélectionner des fichiers
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            PNG, JPG, JPEG, GIF, WebP jusqu&apos;à {maxSize / 1024 / 1024}MB
          </p>
        </div>
      </div>

      {previews.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="group relative aspect-square overflow-hidden rounded-lg border bg-muted"
            >
              <Image
                src={preview}
                alt={`Preview ${index + 1}`}
                fill
                className="object-cover"
              />
              
              {uploadingStates[index] && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px] z-10">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  <span className="mt-1 text-[10px] font-medium text-white uppercase tracking-tighter">Upload...</span>
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" />
              <Button
                size="icon-xs"
                variant="destructive"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  if (onRemove) onRemove(index)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 text-xs text-white">
                {files[index]?.name}
              </div>
            </div>
          ))}

          <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted"
          >
            <ImageIcon className="h-8 w-8 text-muted-foreground" />
            <span className="mt-2 text-xs text-muted-foreground">Ajouter plus</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files || [])
                onDrop(newFiles)
                e.target.value = ""
              }}
            />
          </label>
        </div>
      )}

      {files.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground font-medium">
            {files.length} image{files.length > 1 ? 's' : ''} sélectionnée{files.length > 1 ? 's' : ''}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (onClear) onClear()
            }}
          >
            Tout effacer
          </Button>
        </div>
      )}
    </div>
  )
}