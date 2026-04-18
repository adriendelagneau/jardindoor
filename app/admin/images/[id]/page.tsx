import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { notFound } from 'next/navigation'
import { EditImageForm } from './EditImageForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ImageEditPage({ params }: PageProps) {
  const { id } = await params

  const image = await prisma.image.findUnique({
    where: { id },
  })

  if (!image) {
    notFound()
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-extrabold tracking-tight">Détails de l&apos;image</h1>
        <p className="text-muted-foreground mt-3 text-lg">
          Visualisez et gérez les informations de votre ressource visuelle.
        </p>
      </div>
      
      <EditImageForm image={image} />
    </div>
  )
}
