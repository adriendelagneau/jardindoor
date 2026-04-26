"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, Tag, Percent, Archive, PackageCheck, PackageX, ShoppingBag } from "lucide-react";
import cloudinaryUrl from "@/utils/updateCloudinaryUrl";
import { ProductFromGetProducts } from "@/actions/products";

const StatusBadge = ({ status }: { status: string }) => {
  switch (status) {
    case "ACTIVE":
      return (
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
          <PackageCheck className="h-3 w-3" /> Actif
        </span>
      );
    case "ARCHIVED":
      return (
        <span className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
          <Archive className="h-3 w-3" /> Archivé
        </span>
      );
    case "OUT_OF_STOCK":
      return (
        <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
          <PackageX className="h-3 w-3" /> En rupture
        </span>
      );
    default:
      return null;
  }
};

type Props = {
  product: ProductFromGetProducts;
};

export function AdminProductCard({ product }: Props) {
  const defaultVariant = product.variants.find(v => v.isDefault) || product.variants[0];

  return (
    <div className="group bg-card rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl hover:border-primary/20">
      <div className="aspect-3/4 relative bg-muted overflow-hidden rounded-t-3xl">
        {product.images[0] ? (
          <div className="absolute inset-0 p-5">
            <Image
              src={cloudinaryUrl(product.images[0].url, {
                width: 400,
                height: 533,
                crop: "fill",
              })}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 80vw, 25vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500 rounded-2xl"
            />
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-muted-foreground opacity-30">
            <ShoppingBag className="h-16 w-16" />
          </div>
        )}
        {product.isPromotion && (
          <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black uppercase tracking-tighter px-3 py-1 rounded-full shadow-lg flex items-center gap-1 z-10">
            <Percent className="h-3 w-3" /> Promotion
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col gap-3">
        <div className="flex justify-between items-start gap-2">
          <div className="space-y-1">
            <h3 className="font-bold text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">
              {product.name}
            </h3>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Tag className="h-3 w-3" />
              {product.category?.name || "Sans catégorie"}
            </div>
          </div>
          <div className="text-right">
            <span className="text-xl font-black text-primary">
              {defaultVariant
                ? Number(defaultVariant.price).toLocaleString("fr-FR", {
                    style: "currency",
                    currency: "EUR",
                  })
                : "N/A"}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-dashed">
          <StatusBadge status={defaultVariant?.status || "ACTIVE"} />
          <Button
            variant="outline"
            size="sm"
            asChild
            className="rounded-full px-4 gap-2 hover:bg-primary hover:text-white transition-all"
          >
            <Link href={`/admin/products/${product.id}`}>
              <Edit className="h-4 w-4" />
              Modifier
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
