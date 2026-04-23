import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { ProductForm } from '../../products/components/ProductForm'

export default async function CreateSeedPage() {
  const [categories, images, brands] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: { name: 'asc' }
    }),
    prisma.image.findMany({
      where: { productId: null },
      select: { id: true, url: true, altText: true },
      orderBy: { createdAt: 'desc' }
    }),
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: 'asc' }
    })
  ])

  return (
    <div className="p-6">
      <ProductForm 
        productType="SEED"
        categories={categories} 
        availableImages={images}
        brands={brands}
      />
    </div>
  )
}
