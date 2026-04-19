import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { notFound } from 'next/navigation'
import { ProductForm } from '../components/ProductForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const [product, categories, images] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { select: { id: true, url: true, altText: true } }
      }
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    }),
    prisma.image.findMany({
      where: { 
        OR: [
          { productId: null },
          { productId: id }
        ]
      },
      select: { id: true, url: true, altText: true },
      orderBy: { createdAt: 'desc' }
    })
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="p-6">
      <ProductForm 
        isEdit 
        initialData={product} 
        categories={categories} 
        availableImages={images} 
      />
    </div>
  )
}
