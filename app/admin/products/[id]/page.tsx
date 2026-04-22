import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { notFound } from 'next/navigation'
import { ProductForm } from '../components/ProductForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params

  const [product, categories, images, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id },
      include: {
        images: { select: { id: true, url: true, altText: true } },
        variants: true
      }
    }),
    prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
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
    }),
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  ])

  if (!product) {
    notFound()
  }

  const serializedProduct = {
    ...product,
    variants: product.variants.map(v => ({
      ...v,
      price: Number(v.price),
      originalPrice: v.originalPrice ? Number(v.originalPrice) : null
    }))
  }

  return (
    <div className="p-6">
      <ProductForm 
        isEdit 
        initialData={serializedProduct} 
        categories={categories} 
        availableImages={images}
        brands={brands}
      />
    </div>
  )
}
