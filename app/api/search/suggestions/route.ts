import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q")?.trim();

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  try {
    // 1. Search Categories (Top level and sub)
    const categories = await prisma.category.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
      include: {
        parent: {
          select: { name: true, slug: true },
        },
      },
    });

    // 2. Search Brands
    const brands = await prisma.brand.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { slug: { contains: q, mode: "insensitive" } },
        ],
      },
      take: 4,
    });

    // 3. Search Products
    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q, mode: "insensitive" } },
          { description: { contains: q, mode: "insensitive" } },
        ],
        variants: {
          some: {
            status: "ACTIVE",
          },
        },
      },
      take: 6,
      include: {
        category: {
          select: { name: true, slug: true, parent: { select: { name: true, slug: true } } },
        },
      },
    });

    const suggestions: any[] = [];

    // Map Categories
    categories.forEach((cat) => {
      const isSub = !!cat.parentId;
      suggestions.push({
        label: cat.name,
        query: cat.name,
        category: isSub ? cat.parent?.slug : cat.slug,
        subCategory: isSub ? cat.slug : undefined,
        from: "category",
      });
    });

    // Map Brands
    brands.forEach((brand) => {
      suggestions.push({
        label: brand.name,
        query: brand.name,
        brand: brand.slug,
        from: "product", // Using product path for now
      });
    });

    // Map Products
    products.forEach((prod) => {
      suggestions.push({
        label: prod.name,
        query: prod.name,
        product: prod.slug,
        from: "product",
      });
    });

    // Deduplicate and limit
    const unique = suggestions.reduce((acc: any[], current) => {
      const x = acc.find((item) => item.label === current.label);
      if (!x) return acc.concat([current]);
      return acc;
    }, []);

    return NextResponse.json(unique.slice(0, 10));
  } catch (error) {
    console.error("Suggestions error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
