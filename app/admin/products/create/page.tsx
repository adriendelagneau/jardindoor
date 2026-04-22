import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { ProductForm } from '../components/ProductForm'

export default async function CreateProductPage() {
  const [categories, images] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: { name: 'asc' }
    }),
    prisma.image.findMany({
      where: { productId: null }, // Only show unassociated images by default or all?
      select: { id: true, url: true, altText: true },
      orderBy: { createdAt: 'desc' }
    })
  ])

  return (
    <div className="p-6">
      <ProductForm 
        categories={categories} 
        availableImages={images} 
      />
    </div>
  )
}
