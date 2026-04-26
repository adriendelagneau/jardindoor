import Image from "next/image";
import prisma from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Plus,
  ShoppingBag,
  Edit,
  Tag,
  Percent,
  Archive,
  PackageCheck,
  PackageX,
} from "lucide-react";
import Link from "next/link";
import cloudinaryUrl from "@/utils/updateCloudinaryUrl";

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

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    include: {
      category: {
        select: { name: true },
      },
      images: {
        take: 1,
      },
      variants: {
        orderBy: { isDefault: "desc" },
        take: 1,
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <div className="py-8 lg:py-12 mx-2 space-y-12 pb-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold font-serif">Catalogue Produits</h1>
          <p className="text-muted-foreground">
            Gérez votre inventaire, prix et stocks.
          </p>
        </div>
        <Link href="/admin/products/create">
          <Button className="gap-2">
            <Plus size={18} /> Nouveau Produit
          </Button>
        </Link>
      </div>

      {/* Hero Section */}
      <Card className="relative h-[480px] w-full overflow-hidden  shadow-lg border-none bg-primary">
        <Image
          src="/home-img.png"
          alt="Produits banner"
          fill
          sizes="100vw"
          className="object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-linear-to-r from-primary/80 via-primary/40 to-transparent flex flex-col justify-center p-12 text-primary-foreground">
          <div className="flex items-center gap-4 mb-2">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <ShoppingBag className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-4xl font-bold font-serif uppercase tracking-widest">
              Catalogue Produits
            </h2>
          </div>
          <p className="max-w-lg text-lg opacity-90">
            Gérez votre inventaire complet, vos prix et vos stocks en temps
            réel.
          </p>
        </div>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
        {products.map((product) => {
          const defaultVariant = product.variants[0];

          return (
            <div
              key={product.id}
              className="group bg-card rounded-3xl border shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-xl hover:border-primary/20"
            >
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
        })}
        {products.length === 0 && (
          <div className="col-span-full py-20 bg-muted/30 rounded-3xl border-2 border-dashed border-muted text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-semibold">Aucun produit trouvé</h3>
            <p className="text-muted-foreground mt-2 max-w-xs mx-auto">
              Votre catalogue est vide. Commencez par ajouter votre premier
              article.
            </p>
            <Button asChild className="mt-6 rounded-full px-8">
              <Link href="/admin/products/create">Ajouter un produit</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
