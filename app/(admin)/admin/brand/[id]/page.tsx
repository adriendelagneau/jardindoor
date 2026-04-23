import React from 'react'
import prisma from "@/lib/prisma/prisma"
import { notFound } from 'next/navigation'
import { BrandForm } from '../components/BrandForm'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function EditBrandPage({ params }: PageProps) {
  const { id } = await params

  const brand = await prisma.brand.findUnique({
    where: { id },
  })

  if (!brand) {
    notFound()
  }

  return (
    <div className="p-6">
      <BrandForm initialData={brand} isEdit />
    </div>
  )
}