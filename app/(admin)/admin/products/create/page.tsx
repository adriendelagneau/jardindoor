import React from "react";
import prisma from "@/lib/prisma";
import { ProductForm } from "../components/ProductForm";

export default async function CreateProductPage() {
  const [categories, images, brands] = await Promise.all([
    prisma.category.findMany({
      select: { id: true, name: true, parentId: true },
      orderBy: { name: "asc" },
    }),
    prisma.image.findMany({
      where: { productId: null },
      select: { id: true, url: true, altText: true },
      orderBy: { createdAt: "desc" },
    }),
    prisma.brand.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="p-6">
      <ProductForm
        categories={categories}
        availableImages={images}
        brands={brands}
      />
    </div>
  );
}
