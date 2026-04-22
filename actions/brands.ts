"use server";

import prisma from "@/lib/prisma/prisma";
import { brandSchema, type BrandSchema } from "@/lib/validation/brand";
import { revalidatePath } from "next/cache";

export async function getBrands() {
  return await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getBrandById(id: string) {
  return await prisma.brand.findUnique({
    where: { id },
    include: {
      _count: {
        select: { products: true, images: true },
      },
    },
  });
}

export async function createBrand(data: BrandSchema) {
  const validated = brandSchema.parse(data);
  
  const brand = await prisma.brand.create({
    data: validated,
  });
  
  revalidatePath("/admin/brand");
  return brand;
}

export async function updateBrand(id: string, data: Partial<BrandSchema>) {
  const brand = await prisma.brand.update({
    where: { id },
    data,
  });
  
  revalidatePath("/admin/brand");
  return brand;
}

export async function deleteBrand(id: string) {
  await prisma.brand.delete({
    where: { id },
  });
  
  revalidatePath("/admin/brand");
}

export type GetBrandsResult = Awaited<ReturnType<typeof getBrands>>;