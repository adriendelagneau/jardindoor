import { MoveRightIcon } from "lucide-react";
import Link from "next/link";

import { ProductFromGetProducts } from "@/actions/products";
import { Button } from "@/components/ui/button";

import { ProductCarousel } from "./ProductCarousel";

type Props = {
  title: string;
  products: ProductFromGetProducts[];
  href: string;
};

export function ProductSection({ title, products, href }: Props) {
  if (!products.length) return null;

  return (
    <section className="mx-auto mt-4 my-2 lg:my-4 w-full max-w-7xl space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-md lg:text-xl font-medium  underline-effect">
          {title} :
        </h2>

        <Button asChild variant="link" className="">
          <Link href={href} className="group">
            Voir plus de {title}{" "}
            <span>
              <MoveRightIcon className="group-hover:text-primary" />
            </span>
          </Link>
        </Button>
      </div>

      {/* Carousel */}
      <ProductCarousel products={products} />
    </section>
  );
}
