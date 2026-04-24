"use server";

import { Prisma, ProductStatus } from "@/lib/prisma/generated/prisma/client";
import prisma from "@/lib/prisma/prisma";
import { productSchema, productUpdateSchema, type ProductSchema, type ProductUpdateSchema } from "@/lib/validation/product";
import { getUser } from "@/lib/auth/auth-session";
import { revalidatePath } from "next/cache";

export type GetProductsParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  category?: string;
  subCategory?: string;
  brand?: string;
  orderBy?: "newest" | "priceAsc" | "priceDesc";
  priceMin?: number;
  priceMax?: number;
  isShowInCarousel?: boolean;
  isPromotion?: boolean;
  status?: "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";
};

export async function getProducts({
  query,
  page = 1,
  pageSize = 8,
  category,
  subCategory,
  brand,
  orderBy = "newest",
  priceMin,
  priceMax,
  isShowInCarousel,
  isPromotion,
  status = "ACTIVE",
}: GetProductsParams) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProductWhereInput = {
    ...(isShowInCarousel != null && { isShowInCarousel }),
    ...(isPromotion != null && { isPromotion }),
    variants: {
      some: {
        status: status as ProductStatus,
        ...(priceMin != null || priceMax != null
          ? {
              price: {
                ...(priceMin != null ? { gte: priceMin } : {}),
                ...(priceMax != null ? { lte: priceMax } : {}),
              },
            }
          : {}),
      },
    },

    ...(subCategory
      ? {
          category: { is: { slug: subCategory } },
        }
      : category
      ? {
          category: {
            is: {
              OR: [{ slug: category }, { parent: { slug: category } }],
            },
          },
        }
      : {}),

    ...(brand && {
      brand: { is: { slug: brand } },
    }),

    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { category: { name: { contains: query, mode: "insensitive" } } },
        { category: { parent: { name: { contains: query, mode: "insensitive" } } } },
        { brand: { name: { contains: query, mode: "insensitive" } } },
      ],
    }),
  };

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { slug: true, name: true } },
      brand: { select: { slug: true, name: true } },
      images: {
        take: 3,
        select: { url: true, altText: true },
      },
      variants: {
        orderBy: { price: "asc" },
      },
    },
  });

  // Handle ordering by price manually
  let sortedProducts = [...products];
  if (orderBy === "priceAsc") {
    sortedProducts.sort((a, b) => {
      const priceA = Number(a.variants[0]?.price || 0);
      const priceB = Number(b.variants[0]?.price || 0);
      return priceA - priceB;
    });
  } else if (orderBy === "priceDesc") {
    sortedProducts.sort((a, b) => {
      const priceA = Number(a.variants[0]?.price || 0);
      const priceB = Number(b.variants[0]?.price || 0);
      return priceB - priceA;
    });
  }

  const serializedProducts = sortedProducts.map((product) => {
    const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];
    return {
      ...product,
      price: defaultVariant?.price?.toString() ?? null,
      originalPrice: defaultVariant?.originalPrice?.toString() ?? null,
      variantsCount: product.variants.length,
      variants: product.variants.map(v => ({
        ...v,
        price: v.price.toString(),
        originalPrice: v.originalPrice?.toString() ?? null
      }))
    };
  });

  return {
    products: serializedProducts,
    hasMore: skip + products.length < total,
    total,
  };
}

export async function getProductBySlug(slug: string) {
  const product = await prisma.product.findFirst({
    where: { slug },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      brand: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
      images: {
        orderBy: { createdAt: "asc" },
      },
      variants: {
        orderBy: {
          price: "asc",
        },
        include: {
          images: {
            orderBy: { createdAt: "asc" },
          },
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  const serializedVariants = product.variants.map((v) => ({
    ...v,
    price: v.price.toString(),
    originalPrice: v.originalPrice?.toString() ?? null,
  }));

  return {
    ...product,
    variants: serializedVariants,
  };
}

export async function createProduct(data: ProductSchema) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = productSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  const {
    name,
    slug,
    description,
    isPromotion,
    isShowInCarousel,
    categoryId,
    brandId,
    imageIds,
    variants,
  } = result.data;

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      isPromotion,
      isShowInCarousel,
      categoryId: categoryId || null,
      brandId: brandId && brandId !== "" ? brandId : null,
      variants: {
        create: variants.map((v) => ({
          name: v.name,
          price: v.price,
          originalPrice: v.originalPrice,
          status: v.status as ProductStatus,
          isDefault: v.isDefault,
        })),
      },
    },
  });

  if (imageIds && imageIds.length > 0) {
    await prisma.image.updateMany({
      where: { id: { in: imageIds } },
      data: { productId: product.id },
    });
  }

  revalidatePath("/admin/products");
  revalidatePath("/admin/seed");
  revalidatePath("/products");
  return product;
}

export async function updateProduct(id: string, data: ProductUpdateSchema) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const result = productUpdateSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Validation failed");
  }

  const {
    name,
    slug,
    description,
    isPromotion,
    isShowInCarousel,
    categoryId,
    brandId,
    imageIds,
    variants,
  } = result.data;

  const updatedProduct = await prisma.$transaction(async (tx) => {
    const product = await tx.product.update({
      where: { id },
      data: {
        name,
        slug,
        description,
        isPromotion,
        isShowInCarousel,
        categoryId: categoryId === undefined ? undefined : categoryId || null,
        brandId: brandId === undefined ? undefined : (brandId && brandId !== "" ? brandId : null),
      },
    });

    if (variants !== undefined) {
      await tx.productVariant.deleteMany({
        where: { productId: id },
      });

      await tx.productVariant.createMany({
        data: variants.map((v) => ({
          productId: id,
          name: v.name,
          price: v.price,
          originalPrice: v.originalPrice,
          status: v.status as ProductStatus,
          isDefault: v.isDefault,
        })),
      });
    }

    if (imageIds !== undefined) {
      await tx.image.updateMany({
        where: { productId: id, id: { notIn: imageIds } },
        data: { productId: null },
      });
      await tx.image.updateMany({
        where: { id: { in: imageIds } },
        data: { productId: id },
      });
    }

    return product;
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/seed");
  revalidatePath(`/products/${updatedProduct.slug}`);
  return updatedProduct;
}

export async function deleteProduct(id: string) {
  const user = await getUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin/seed");
  revalidatePath("/products");
  return { success: true };
}

export type GetProductsResult = Awaited<ReturnType<typeof getProducts>>;
export type ProductFromGetProducts = NonNullable<
  GetProductsResult["products"][number]
>;

export type GetProductBySlugResult = Awaited<ReturnType<typeof getProductBySlug>>;
export type ProductBySlug = NonNullable<GetProductBySlugResult>;
export type ProductVariantSerialized = ProductBySlug["variants"][number];
