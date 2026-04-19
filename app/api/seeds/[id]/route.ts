import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth-session"
import prisma from "@/lib/prisma/prisma"
import { productUpdateSchema } from "@/lib/validation/product"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const seed = await prisma.product.findUnique({
      where: { id, type: 'SEED' },
      include: {
        category: true,
        images: { orderBy: { index: "asc" } },
        brand: true
      }
    })

    if (!seed) {
      return NextResponse.json({ error: "Seed not found" }, { status: 404 })
    }

    return NextResponse.json({ seed })
  } catch (error) {
    console.error("Error fetching seed:", error)
    return NextResponse.json({ error: "Failed to fetch seed" }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const body = await req.json()
    const result = productUpdateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: result.error.format() 
      }, { status: 400 })
    }

    const { 
      name, slug, description, price, priceUnit, status, 
      isPromotion, categoryId, brandId, metaTitle, metaDescription,
      imageIds
    } = result.data

    const updatedSeed = await prisma.product.update({
      where: { id, type: 'SEED' },
      data: {
        name,
        slug,
        description,
        price,
        priceUnit,
        status,
        isPromotion,
        categoryId: categoryId === undefined ? undefined : (categoryId || null),
        brandId: brandId === undefined ? undefined : (brandId || null),
        metaTitle: metaTitle || (name ? name : undefined),
        metaDescription: metaDescription || (description ? description : undefined),
      },
    })

    // Update image associations if provided
    if (imageIds !== undefined) {
      await prisma.image.updateMany({
        where: { productId: id, id: { notIn: imageIds } },
        data: { productId: null }
      })
      await prisma.image.updateMany({
        where: { id: { in: imageIds } },
        data: { productId: id }
      })
    }

    return NextResponse.json({ seed: updatedSeed })
  } catch (error) {
    console.error("Error updating seed:", error)
    return NextResponse.json({ error: "Failed to update seed" }, { status: 500 })
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    await prisma.product.delete({
      where: { id, type: 'SEED' },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting seed:", error)
    return NextResponse.json({ error: "Failed to delete seed" }, { status: 500 })
  }
}
