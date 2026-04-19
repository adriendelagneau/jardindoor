import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma/prisma"

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  try {
    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        children: {
          include: {
            images: {
              take: 1,
              orderBy: { index: 'asc' }
            },
            _count: {
              select: { children: true, products: true }
            }
          },
          orderBy: {
            position: 'asc'
          }
        }
      }
    })

    if (!category) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 })
    }

    return NextResponse.json({ category, subcategories: category.children })
  } catch (error) {
    console.error("Error fetching subcategories:", error)
    return NextResponse.json({ error: "Failed to fetch subcategories" }, { status: 500 })
  }
}
