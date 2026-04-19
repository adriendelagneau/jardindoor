"use server";

import prisma from "@/lib/prisma/prisma";
import { getUser } from "@/lib/auth/auth-session";
import { revalidatePath } from "next/cache";
import { categorySchema, categoryUpdateSchema, type CategorySchema, type CategoryUpdateSchema } from "@/lib/validation/category";

export async function createCategory(data: CategorySchema) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = categorySchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  const category = await prisma.category.create({
    data: {
      ...result.data,
      parentId: result.data.parentId || null,
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return category;
}

export async function updateCategory(id: string, data: CategoryUpdateSchema) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = categoryUpdateSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  const category = await prisma.category.update({
    where: { id },
    data: {
      ...result.data,
      parentId: result.data.parentId === undefined ? undefined : (result.data.parentId || null),
    },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath(`/admin/categories/${id}`);
  return category;
}

export async function deleteCategory(id: string) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  // Check if there are products in this category
  const productsCount = await prisma.product.count({
    where: { categoryId: id },
  });

  if (productsCount > 0) {
    throw new Error("Cannot delete category with associated products");
  }

  // Check if there are subcategories
  const subCategoriesCount = await prisma.category.count({
    where: { parentId: id },
  });

  if (subCategoriesCount > 0) {
    throw new Error("Cannot delete category with associated subcategories");
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return { success: true };
}

export async function getCategories() {
    return await prisma.category.findMany({
        orderBy: {
            position: 'asc'
        }
    });
}
