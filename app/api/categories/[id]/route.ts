import { NextRequest, NextResponse } from "next/server"
import { getUser } from "@/lib/auth/auth-session"
import prisma from "@/lib/prisma/prisma"
import { categoryUpdateSchema } from "@/lib/validation/category"

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
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        parent: {
          select: { name: true, id: true }
        },
        children: {
          select: { name: true, id: true }
        }
      }
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ category })
  } catch (error) {
    console.error("Error fetching category:", error)
    return NextResponse.json({ error: "Failed to fetch category" }, { status: 500 })
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
    const result = categoryUpdateSchema.safeParse(body)

    if (!result.success) {
      return NextResponse.json({ 
        error: "Validation failed", 
        details: result.error.format() 
      }, { status: 400 })
    }

    const { name, slug, description, position, parentId, metaTitle, metaDescription } = result.data

    // Check for circular reference
    if (parentId === id) {
      return NextResponse.json({ error: "A category cannot be its own parent" }, { status: 400 })
    }

    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        position,
        parentId: parentId === undefined ? undefined : (parentId || null),
        metaTitle: metaTitle || (name ? name : undefined),
        metaDescription: metaDescription || (description ? description : undefined),
      },
    })

    return NextResponse.json({ category: updatedCategory })
  } catch (error) {
    console.error("Error updating category:", error)
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
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
    // Note: onDelete is SetNull in schema for parentId, so children won't be deleted
    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting category:", error)
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}
