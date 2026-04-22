import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma/prisma"

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const categoryId = searchParams.get('categoryId')
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '12')
  const skip = (page - 1) * limit

  if (!categoryId) {
    return NextResponse.json({ error: "categoryId is required" }, { status: 400 })
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        categoryId,
      },
      include: {
        images: {
          take: 1,
          orderBy: { index: 'asc' }
        },
        brand: {
          select: { name: true }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      skip,
      take: limit + 1 // Fetch one extra to check if there are more
    })

    const hasMore = products.length > limit
    const results = hasMore ? products.slice(0, limit) : products

    return NextResponse.json({ 
      products: results,
      hasMore 
    })
  } catch (error) {
    console.error("Error fetching public products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}
