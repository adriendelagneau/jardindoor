import { NextRequest, NextResponse } from "next/server"

import { getUser } from "@/lib/auth/auth-session"
import prisma from "@/lib/prisma/prisma"

import { imageSchema } from "@/lib/validation/image"

export async function GET() {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const images = await prisma.image.findMany({
      orderBy: {
        createdAt: "desc",
      },
    })
    return NextResponse.json({ images })
  } catch (error) {
    console.error("Error fetching images:", error)
    return NextResponse.json({ error: "Failed to fetch images" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    
    // Validate the request body with Zod
    const result = imageSchema.safeParse(body)
    
    if (!result.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: result.error.format() 
      }, { status: 400 })
    }

    const { 
      url, 
      altText, 
      shortDescription, 
      productId, 
      categoryId 
    } = result.data

    const image = await prisma.image.create({
      data: {
        url,
        altText,
        shortDescription,
        productId: productId || null,
        categoryId: categoryId || null,
      },
    })

    return NextResponse.json({ image })
  } catch (error) {
    console.error("Error saving image:", error)
    return NextResponse.json({ error: "Failed to save image" }, { status: 500 })
  }
}
