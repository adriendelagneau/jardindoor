"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import Image from "next/image"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button"

interface ImageDropzoneProps {
  onUpload?: (files: File[]) => void
  maxFiles?: number
  maxSize?: number
  className?: string
}

export function ImageDropzone({
  onUpload,
  maxFiles = 5,
  maxSize = 5 * 1024 * 1024,
  className,
}: ImageDropzoneProps) {
  const [previews, setPreviews] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles((prev) => [...prev, ...acceptedFiles])

      const newPreviews = acceptedFiles.map((file) =>
        Object.assign(file, { preview: URL.createObjectURL(file) })
      )

      setPreviews((prev) => [
        ...prev,
        ...newPreviews.map((f) => f.preview as string),
      ])

      if (onUpload) {
        onUpload(acceptedFiles)
      }
    },
    [onUpload]
  )

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setPreviews((prev) => prev.filter((_, i) => i !== index))
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"],
      },
      maxFiles,
      maxSize,
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
            : "border-muted-foreground/25 hover:border-muted-foreground/50 hover:bg-muted/50",
          (files.length >= maxFiles || previews.length > 0) && "border-muted-foreground/25"
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
                ? "Drop the images here"
                : "Drag & drop images here"}
            </p>
            <p className="text-xs text-muted-foreground">
              or click to select files
            </p>
          </div>

          <p className="text-xs text-muted-foreground">
            PNG, JPG, JPEG, GIF, WebP up to {maxSize / 1024 / 1024}MB
          </p>
          <p className="text-xs text-muted-foreground">
            Maximum {maxFiles} files
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
              <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100" />
              <Button
                size="icon-xs"
                variant="destructive"
                className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
              >
                <X className="h-3 w-3" />
              </Button>
              <div className="absolute bottom-0 left-0 right-0 truncate bg-black/60 px-2 py-1 text-xs text-white">
                {files[index]?.name}
              </div>
            </div>
          ))}

          {files.length < maxFiles && (
            <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 bg-muted/50 transition-colors hover:border-muted-foreground/50 hover:bg-muted"
            >
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <span className="mt-2 text-xs text-muted-foreground">Add more</span>
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
          )}
        </div>
      )}

      {files.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {files.length} of {maxFiles} files selected
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFiles([])
              setPreviews([])
            }}
          >
            Clear all
          </Button>
        </div>
      )}
    </div>
  )
}