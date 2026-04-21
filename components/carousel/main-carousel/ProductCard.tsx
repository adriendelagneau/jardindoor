"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MoveRightIcon } from "lucide-react";
import { ProductFromGetProducts } from "@/actions/products";

// Add description to the type if it exists, otherwise it will just be undefined.
type Props = {
  product: ProductFromGetProducts & { description?: string | null };
};

export function ProductCard({ product }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  if (!product) return null;

  const image = product.images?.[0];

  return (
    <Link href={`/products/${product.slug}`} className="h-full block">
      <article className="group flex h-full flex-col overflow-hidden rounded-[1.5rem] bg-white p-3 shadow-sm ring-1 ring-black/5 transition-all hover:shadow-lg">
        {/* Image container */}
        <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-muted">
          {image ? (
            <div className="absolute inset-0 p-5">
              <Image
                src={image.url}
                alt={image.altText ?? product.name}
                fill
                sizes="(max-width: 768px) 80vw, 25vw"
                className={`object-cover transition-transform origin-center duration-700 ease-out group-hover:scale-105 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
              />              {isLoading && (
                <div className="absolute inset-0 animate-pulse bg-muted" />
              )}
            </div>
          ) : (
            <div className="flex h-full items-center justify-center bg-gray-50 text-muted-foreground">
              Aucune image
            </div>
          )}

          {/* Promotion badge */}
          {product.isPromotion && (
            <div className="absolute left-3 top-3 rounded-full bg-red-500/90 px-3 py-1 backdrop-blur-sm">
              <span className="text-[10px] font-bold tracking-wide text-white uppercase">
                Promo
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col px-1 pb-1 pt-5">
          {/* Name */}
          <h3 className="line-clamp-2 font-serif text-[22px] font-medium leading-[1.2] text-green-900">
            {product.name}
          </h3>

          {/* Description / Mock Description */}
          <p className="mt-3 text-[13px] italic leading-relaxed text-gray-500 line-clamp-2">
            {product.description ||
              `A beautiful display from the ${product.category?.name || "premium"} collection, bringing nature's finest aesthetics into your space.`}
          </p>

          {/* Price */}
          <div className="mt-4 flex flex-col">
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
              {product.variantsCount > 1 ? "À partir de" : "Prix"}
            </span>
            <span className="text-lg font-serif font-medium text-green-900">
              {product.price}€
            </span>
          </div>

          {/* Action button */}
          <div className="mt-8 flex w-full items-center justify-between rounded-full bg-[#EBECE9] px-6 py-3.5 transition-colors duration-300 group-hover:bg-[#E0E2DF]">
            <span className="text-[11px] font-bold uppercase tracking-widest text-green-900">
              View Details
            </span>
            <MoveRightIcon className="h-4 w-4 text-green-900" />
          </div>
        </div>
      </article>
    </Link>
  );
}
