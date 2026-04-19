import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth-session"
import prisma from "@/lib/prisma/prisma"
import { productSchema } from "@/lib/validation/product"

export async function GET() {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const seeds = await prisma.product.findMany({
      where: { type: 'SEED' },
      include: {
        category: {
          select: { name: true, id: true }
        },
        images: {
          take: 1, // Preview image
          orderBy: { index: "asc" }
        },
        variants: {
          orderBy: { price: 'asc' }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })
    return NextResponse.json({ seeds })
  } catch (error) {
    console.error("Error fetching seeds:", error)
    return NextResponse.json({ error: "Failed to fetch seeds" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = productSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: result.error.format() 
      }, { status: 400 })
    }

    const { 
      name, slug, description, isPromotion, categoryId, brandId, metaTitle, metaDescription,
      imageIds, variants
    } = result.data

    const seed = await prisma.product.create({
      data: {
        name,
        slug,
        description,
        type: 'SEED',
        isPromotion,
        categoryId: categoryId || null,
        brandId: brandId || null,
        metaTitle: metaTitle || name,
        metaDescription: metaDescription || description,
        variants: {
          create: variants.map(v => ({
            name: v.name,
            sku: v.sku,
            price: v.price,
            priceUnit: v.priceUnit,
            status: v.status,
            isDefault: v.isDefault
          }))
        }
      },
    })

    // Associate existing images if any
    if (imageIds && imageIds.length > 0) {
      await prisma.image.updateMany({
        where: { id: { in: imageIds } },
        data: { productId: seed.id }
      })
    }

    return NextResponse.json({ seed })
  } catch (error) {
    console.error("Error creating seed:", error)
    return NextResponse.json({ error: "Failed to create seed" }, { status: 500 })
  }
}
