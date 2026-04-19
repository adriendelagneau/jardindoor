"use server";


import { Prisma } from "@/lib/prisma/generated/prisma/client";
import prisma from "@/lib/prisma/prisma";

export type GetProductsParams = {
  query?: string;
  page?: number;
  pageSize?: number;
  categorySlug?: string;
  subCategorySlug?: string;
  brandSlug?: string;
  orderBy?: "newest" | "priceAsc" | "priceDesc";
  priceMin?: number;
  priceMax?: number;
  status?: "ACTIVE" | "ARCHIVED" | "OUT_OF_STOCK";
  type?: "PRODUCT" | "SEED";
};

export async function getProducts({
  query,
  page = 1,
  pageSize = 8,
  categorySlug,
  subCategorySlug,
  brandSlug,
  orderBy = "newest",
  priceMin,
  priceMax,
  status = "ACTIVE",
  type,
}: GetProductsParams) {
  const skip = (page - 1) * pageSize;

  const where: Prisma.ProductWhereInput = {
    status,
    ...(type && { type }),

    ...(subCategorySlug
      ? {
          category: { is: { slug: subCategorySlug } },
        }
      : categorySlug
      ? {
          category: {
            is: {
              OR: [
                { slug: categorySlug },
                { parent: { slug: categorySlug } },
              ],
            },
          },
        }
      : {}),

    ...(brandSlug && {
      brand: { is: { slug: brandSlug } },
    }),

    ...(query && {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    }),

    ...(priceMin != null || priceMax != null
      ? {
        price: {
          ...(priceMin != null ? { gte: priceMin } : {}),
          ...(priceMax != null ? { lte: priceMax } : {}),
        },
      }
      : {}),
  };

  const total = await prisma.product.count({ where });

  const products = await prisma.product.findMany({
    where,
    skip,
    take: pageSize,
    orderBy:
      orderBy === "priceAsc"
        ? { price: "asc" }
        : orderBy === "priceDesc"
          ? { price: "desc" }
          : { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      slug: true,
      price: true,
      priceUnit: true,
      createdAt: true,
      isPromotion: true,
      description: true,
      type: true,
      category: { select: { slug: true, name: true } },
      brand: { select: { slug: true, name: true } },
      images: {
        take: 3,
        orderBy: { index: "asc" },
        select: { url: true, altText: true },
      },
    },
  });

  const serializedProducts = products.map((product) => ({
    ...product,
    price: product.price?.toString() ?? null,
  }));

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
        orderBy: {
          index: "asc",
        },
      },
    },
  });

  if (!product) {
    return null;
  }

  return {
    ...product,
    price: product.price?.toString() ?? null,
  };
}

export type GetProductsResult = Awaited<ReturnType<typeof getProducts>>;
export type ProductFromGetProducts = NonNullable<
  GetProductsResult["products"][number]
>;

export type GetProductBySlugResult = Awaited<ReturnType<typeof getProductBySlug>>;
export type ProductBySlug = NonNullable<GetProductBySlugResult>;
