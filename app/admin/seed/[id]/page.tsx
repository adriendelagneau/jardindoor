import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { notFound } from 'next/navigation'
import { ProductForm } from '../../products/components/ProductForm'
import { ProductSchema } from '@/lib/validation/product'

interface ProductInitialData extends ProductSchema {
  id: string
  images: { id: string, url: string, altText: string }[]
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSeedPage({ params }: PageProps) {
  const { id } = await params

  const [seed, categories, images] = await Promise.all([
    prisma.product.findUnique({
      where: { id, type: 'SEED' },
      include: {
        images: { select: { id: true, url: true, altText: true } },
        variants: true
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

  if (!seed) {
    notFound()
  }

  const serializedSeed = {
    ...seed,
    variants: seed.variants.map(v => ({
      ...v,
      price: Number(v.price)
    }))
  }

  return (
    <div className="p-6">
      <ProductForm 
        isEdit 
        productType="SEED"
        initialData={serializedSeed as any} 
        categories={categories} 
        availableImages={images} 
      />
    </div>
  )
}
