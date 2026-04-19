"use client";

import {
  getProductBySlug,
  getProducts,
  ProductBySlug,
  ProductFromGetProducts,
  ProductVariantSerialized,
} from "@/actions/products";
import { ProductSection } from "@/components/carousel/main-carousel/ProductSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound } from "next/navigation";
import { useEffect, useState, use } from "react";

export default function ProductPage({
  params: paramsPromise,
}: {
  params: Promise<{ slug: string }>;
}) {
  const params = use(paramsPromise);
  const [product, setProduct] = useState<ProductBySlug | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<
    ProductFromGetProducts[]
  >([]);
  const [selectedVariant, setSelectedVariant] =
    useState<ProductVariantSerialized | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getProductBySlug(params.slug);
        if (!data) {
          setLoading(false);
          return;
        }

        setProduct(data);
        // Default to first variant (sorted by price ascending in action)
        setSelectedVariant(data.variants[0] || null);

        // Load related products
        const related = await getProducts({
          categorySlug: data.category?.slug ?? undefined,
          pageSize: 8,
        });
        setRelatedProducts(related.products.filter((p) => p.id !== data.id));
      } catch (error) {
        console.error("Failed to load product", error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [params.slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-24 flex justify-center">
        <div className="animate-pulse text-green-900 font-serif text-xl">
          Chargement...
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const currentVariant = selectedVariant;
  // Use variant images if available, otherwise fallback to product images
  const displayImages =
    currentVariant?.images && currentVariant.images.length > 0
      ? currentVariant.images
      : product.images;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images Section */}
        <div className="space-y-6">
          <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-muted shadow-sm ring-1 ring-black/5">
            {displayImages?.[0] ? (
              <Image
                src={displayImages[0].url}
                alt={displayImages[0].altText || product.name}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="flex h-full items-center justify-center bg-gray-50 text-muted-foreground italic">
                Aucune image disponible
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {displayImages && displayImages.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {displayImages.map((image, index) => (
                <div
                  key={image.id || index}
                  className="relative aspect-square overflow-hidden rounded-2xl bg-muted ring-1 ring-black/5 hover:ring-green-900/20 transition-all cursor-pointer"
                >
                  <Image
                    src={image.url}
                    alt={image.altText || `${product.name} image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
          {/* Breadcrumb / Category */}
          <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-green-700/60">
              {product.category?.name || "Collection"}
            </span>
          </div>

          <h1 className="text-4xl lg:text-5xl font-serif font-medium text-green-900 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-900">
              {currentVariant ? currentVariant.price : "0.00"}€
            </span>
            <span className="text-sm text-gray-500 italic">
              / {currentVariant?.priceUnit.toLowerCase() || "unité"}
            </span>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span
              className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                currentVariant?.status === "ACTIVE"
                  ? "bg-green-100 text-green-800"
                  : "bg-orange-100 text-orange-800"
              }`}
            >
              {currentVariant?.status === "ACTIVE"
                ? "En stock"
                : currentVariant?.status || "Indisponible"}
            </span>
          </div>

          {/* Variant Selector */}
          {product.variants.length > 1 && (
            <div className="mt-10">
              <h3 className="text-sm font-bold uppercase tracking-widest text-green-900 mb-4">
                Choisir une option
              </h3>
              <div className="flex flex-wrap gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-6 py-3 rounded-full border text-sm font-medium transition-all ${
                      selectedVariant?.id === v.id
                        ? "border-green-900 bg-green-900 text-white"
                        : "border-gray-200 bg-white text-gray-600 hover:border-green-900/30"
                    }`}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mt-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-green-900 mb-4">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed italic text-[15px]">
              {product.description ||
                "Aucune description disponible pour ce produit d'exception."}
            </p>
          </div>

          {/* Brand */}
          {product.brand && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">
                    Marque
                  </span>
                  <p className="text-lg font-serif text-green-900">
                    {product.brand.name}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto pt-12 space-y-4">
            <Button
              size="lg"
              className="w-full h-14 rounded-full bg-green-900 hover:bg-green-800 text-white font-bold uppercase tracking-widest text-xs transition-all"
            >
              Commander maintenant
            </Button>

            <p className="text-center text-[11px] text-gray-400 italic">
              Livraison gratuite à partir de 50€ d&apos;achat
            </p>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mt-24">
          <ProductSection
            title="Produits similaires"
            products={relatedProducts}
            href={`/products?category=${product.category?.slug}`}
          />
        </div>
      )}
    </div>
  );
}
