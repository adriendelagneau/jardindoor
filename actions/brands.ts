"use server";

import prisma from "@/lib/prisma/prisma";

export async function getBrands() {
  return await prisma.brand.findMany({
    orderBy: { name: "asc" },
  });
}

export type GetBrandsResult = Awaited<ReturnType<typeof getBrands>>;
