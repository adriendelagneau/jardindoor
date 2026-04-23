"use server";

import prisma from "@/lib/prisma/prisma";
import { brandSchema, brandUpdateSchema, type BrandSchema, type BrandUpdateSchema } from "@/lib/validation/brand";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth/auth-session";

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
        select: { products: true },
      },
    },
  });
}

export async function createBrand(data: BrandSchema) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = brandSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }
  
  const brand = await prisma.brand.create({
    data: result.data,
  });
  
  revalidatePath("/admin/brand");
  return brand;
}

export async function updateBrand(id: string, data: BrandUpdateSchema) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = brandUpdateSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  const brand = await prisma.brand.update({
    where: { id },
    data: result.data,
  });
  
  revalidatePath("/admin/brand");
  return brand;
}

export async function deleteBrand(id: string) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const productsCount = await prisma.product.count({
    where: { brandId: id },
  });

  if (productsCount > 0) {
    throw new Error("Cannot delete brand with associated products");
  }

  await prisma.brand.delete({
    where: { id },
  });
  
  revalidatePath("/admin/brand");
}

export type GetBrandsResult = Awaited<ReturnType<typeof getBrands>>;