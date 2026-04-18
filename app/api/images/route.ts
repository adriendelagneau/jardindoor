import { NextRequest, NextResponse } from "next/server"

import { getUser } from "@/lib/auth/auth-session"
import prisma from "@/lib/prisma/prisma"

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const { url, altText, shortDescription, productId, brandId, categoryId } = body

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 })
    }

    if (!altText || !shortDescription) {
      return NextResponse.json({ error: "Alt text and short description are required" }, { status: 400 })
    }

    // Get the next available index for this entity
    let nextIndex = 0
    if (productId) {
      const lastImage = await prisma.image.findFirst({
        where: { productId },
        orderBy: { index: "desc" },
      })
      nextIndex = (lastImage?.index ?? -1) + 1
    } else if (brandId) {
      const lastImage = await prisma.image.findFirst({
        where: { brandId },
        orderBy: { index: "desc" },
      })
      nextIndex = (lastImage?.index ?? -1) + 1
    } else if (categoryId) {
      const lastImage = await prisma.image.findFirst({
        where: { categoryId },
        orderBy: { index: "desc" },
      })
      nextIndex = (lastImage?.index ?? -1) + 1
    }

    const image = await prisma.image.create({
      data: {
        url,
        altText,
        shortDescription,
        metaTitle: altText,
        metaDescription: shortDescription,
        index: nextIndex,
        productId: productId || null,
        brandId: brandId || null,
        categoryId: categoryId || null,
      },
    })

    return NextResponse.json({ image })
  } catch (error) {
    console.error("Error saving image:", error)
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 })
  }
}