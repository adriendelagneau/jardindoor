"use server";

import { Prisma } from "@/prisma/generated/prisma";
import prisma from "@/lib/prisma";
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

export type GetCategoriesParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  parentId?: string | null;
  onlyRoots?: boolean;
  onlySubcategories?: boolean;
};

export async function getCategories({
  query,
  page = 1,
  pageSize = 10,
  parentId,
  onlyRoots = false,
  onlySubcategories = false,
}: GetCategoriesParams = {}) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.CategoryWhereInput = {
    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }),
    ...(onlyRoots
      ? { parentId: null }
      : onlySubcategories
        ? { parentId: { not: null } }
        : parentId !== undefined
          ? { parentId }
          : {}),
  };

  const [total, categories] = await Promise.all([
    prisma.category.count({ where }),
    prisma.category.findMany({
      where,
      skip,
      take: pageSize,
      orderBy: {
        name: "asc",
      },
      include: {
        images: {
          take: 1,
          orderBy: { createdAt: "asc" },
          select: { url: true, altText: true },
        },
        _count: {
          select: {
            products: true,
            children: true,
          },
        },
      },
    }),
  ]);

  return {
    categories,
    hasMore: skip + categories.length < total,
    total,
  };
}

export async function getCategoryById(id: string) {
  return await prisma.category.findUnique({
    where: { id },
    include: {
      parent: true,
      children: true,
      images: {
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export async function getCategoryBySlug(slug: string) {
  return await prisma.category.findFirst({
    where: { slug },
    include: {
      parent: true,
      children: true,
      images: {
        orderBy: { createdAt: "asc" },
      },
      _count: {
        select: {
          products: true,
        },
      },
    },
  });
}

export type GetCategoriesResult = Awaited<ReturnType<typeof getCategories>>;
export type CategoryFromGetCategories = NonNullable<
  GetCategoriesResult["categories"][number]
>;
