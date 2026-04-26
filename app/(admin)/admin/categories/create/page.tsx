import React from "react";
import prisma from "@/lib/prisma";
import { CategoryForm } from "../components/CategoryForm";

export default async function CreateCategoryPage() {
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return (
    <div className="p-6">
      <CategoryForm availableCategories={categories} />
    </div>
  );
}
