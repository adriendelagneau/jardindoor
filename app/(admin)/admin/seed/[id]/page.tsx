import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { notFound } from 'next/navigation'
import { ProductForm, type ProductInitialData } from '../../products/components/ProductForm'
import { ProductSchema } from '@/lib/validation/product'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditSeedPage({ params }: PageProps) {
  const { id } = await params

  const [seed, categories, images, brands] = await Promise.all([
    prisma.product.findUnique({
      where: { id, type: 'SEED' },
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

  if (!seed) {
    notFound()
  }

  const serializedSeed = {
    ...seed,
    variants: seed.variants.map(v => ({
      ...v,
      price: Number(v.price),
      originalPrice: v.originalPrice ? Number(v.originalPrice) : null
    }))
  }

  return (
    <div className="p-6">
      <ProductForm 
        isEdit 
        productType="SEED"
        initialData={serializedSeed as unknown as ProductInitialData} 
        categories={categories} 
        availableImages={images}
        brands={brands}
      />
    </div>
  )
}
