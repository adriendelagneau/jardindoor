"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ProductFromGetProducts } from "@/app/actions/products";

type Props = { product: ProductFromGetProducts };

export function ProductCard({ product }: Props) {
  const [isLoading, setIsLoading] = useState(true);

  if (!product) return null;

  const image = product.images[0];

  return (
    <Link
      href={`/product/${product.slug}`}
    >
      <article className="group bg-background flex h-full w-44 lg:w-52 flex-col overflow-hidden rounded-xl mr-6">
        {/* Brand */}
        {product.brand && (
          <div className="flex items-center gap-1 py-1">
            <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold text-white">
              {product.brand.name?.charAt(0).toUpperCase()}
            </div>

            <p className="max-w-28 truncate text-sm capitalize">
              {product.brand.name}
            </p>
          </div>
        )}

        {/* Image */}
        <div className="bg-muted relative h-64 w-48  lg:h-72 lg:w-52  overflow-hidden mt-1">
          {image ? (
            <>
              <Image
                src={image.url}
                alt={image.altText ?? product.name}
                fill
                sizes="(max-width: 768px) 80vw, 25vw"
                className={`rounded-lg object-cover transition-transform duration-300 group-hover:scale-105 ${
                  isLoading ? "opacity-0" : "opacity-100"
                }`}
                onLoad={() => setIsLoading(false)}
              />
              {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
            </>
          ) : (
            <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
              Aucune image
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col gap-0.5 pt-2">
          <h3 className="line-clamp-1 w-48 text-sm lg:text-md leading-snug font-semibold">
            {product.name}
          </h3>
          <p className="text-md">
            {Number(product.price).toLocaleString("fr-FR")} €
            {product.priceUnit !== "UNIT" && (
              <span>
                {" / "}
                {product.priceUnit.toLowerCase()}
              </span>
            )}
          </p>
          {product.category && (
            <p className="text-sm truncate max-w-48">
              {product.category.name}
            </p>
          )}
          <p className="text-sm">
            {new Date(product.createdAt).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "short",
              year: "numeric"
            })}
          </p>
        </div>
      </article>
    </Link>
  );
}
