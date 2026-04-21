"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRightIcon } from "lucide-react";
import { CategoryFromGetCategories } from "@/actions/categories";

type Props = {
  category: CategoryFromGetCategories;
};

export function CategoryCard({ category }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  if (!category) return null;

  const image = category.images?.[0];

  const hasChildren = category._count.children > 0;
  const href = hasChildren 
    ? `/categories?parentId=${category.id}` 
    : `/products?category=${category.slug}`;

  return (
    <Link href={href} className="h-full block">
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg">
        {/* Image container */}
        <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-muted">
          {image ? (
            <>
              <Image
                src={image.url}
                alt={image.altText ?? category.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className={`object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
              />
              {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
              )}
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-50 text-muted-foreground italic text-sm">
              Aucune image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
          {/* Name */}
          <h3 className="line-clamp-1 font-serif text-[22px] font-medium leading-[1.2] text-green-900">
            {category.name}
          </h3>

          {/* Description */}
          {category.description && (
            <p className="mt-2 text-[13px] italic leading-relaxed text-gray-500 line-clamp-2">
              {category.description}
            </p>
          )}

          {/* Product Count Badge */}
          <div className="mt-auto pt-4 flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {category._count.products} {category._count.products > 1 ? "Produits" : "Produit"}
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EBECE9] transition-colors duration-300 group-hover:bg-[#E0E2DF]">
              <MoveRightIcon className="h-4 w-4 text-green-900" />
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
