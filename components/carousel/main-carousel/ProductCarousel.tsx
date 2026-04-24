"use client";

import * as React from "react";

import { ProductFromGetProducts } from "@/actions/products";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

import { ProductCard } from "./ProductCard";

type ProductCarouselProps = {
  products: ProductFromGetProducts[];
};

export function ProductCarousel({ products }: ProductCarouselProps) {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  if (!products.length) return null;

  return (
    <div className="relative mx-auto my-6 w-full max-w-7xl">
      {/* Left gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 bottom-0 left-0 z-10 w-16 bg-linear-to-r to-transparent transition-opacity duration-300",
          current === 1 ? "opacity-0" : "opacity-100",
        )}
      />

      <Carousel
        setApi={setApi}
        opts={{ align: "start", dragFree: true }}
        className="w-full"
      >
        <CarouselContent>
          {products.map(
            (product, index) =>
              product && (
                <CarouselItem
                  key={product.id}
                  className="shrink-0 basis-[170px] lg:basis-[200px]"
                >
                  <ProductCard product={product} priority={index < 4} />
                </CarouselItem>
              ),
          )}
        </CarouselContent>
      </Carousel>

      {/* Right gradient */}
      <div
        className={cn(
          "from-background pointer-events-none absolute top-0 right-0 bottom-0 z-10 w-16 bg-linear-to-l to-transparent transition-opacity duration-300",
          current === count ? "opacity-0" : "opacity-100",
        )}
      />
    </div>
  );
}
