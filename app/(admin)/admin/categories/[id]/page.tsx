import React from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { CategoryForm } from "../components/CategoryForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;

  const [category, allCategories] = await Promise.all([
    prisma.category.findUnique({
      where: { id },
    }),
    prisma.category.findMany({
      select: {
        id: true,
        name: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="p-6">
      <CategoryForm
        isEdit
        initialData={category}
        availableCategories={allCategories}
      />
    </div>
  );
}
