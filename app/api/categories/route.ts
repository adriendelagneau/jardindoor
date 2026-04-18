import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth-session"
import prisma from "@/lib/prisma/prisma"
import { categorySchema } from "@/lib/validation/category"

export async function GET() {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const categories = await prisma.category.findMany({
      include: {
        parent: {
          select: { name: true }
        },
        _count: {
          select: { products: true, children: true }
        }
      },
      orderBy: [
        { parentId: 'asc' },
        { position: 'asc' },
        { name: 'asc' }
      ]
    })
    return NextResponse.json({ categories })
  } catch (error) {
    console.error("Error fetching categories:", error)
    return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const body = await req.json()
    const result = categorySchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: result.error.format() 
      }, { status: 400 })
    }

    const { name, slug, description, position, parentId, metaTitle, metaDescription } = result.data

    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description,
        position,
        parentId: parentId || null,
        metaTitle: metaTitle || name,
        metaDescription: metaDescription || description,
      },
    })

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Error creating category:", error)
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 })
  }
}
