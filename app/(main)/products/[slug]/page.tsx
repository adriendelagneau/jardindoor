import {
  getProductBySlug,
  getProducts,
} from "@/actions/products";
import { ProductSection } from "@/components/carousel/main-carousel/ProductSection";
import { AppBreadcrumb } from "@/components/layout/AppBreadcrumb";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { variant: variantId } = await searchParams;

  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Produits", href: "/products" },
    ...(product.category ? [{ label: product.category.name, href: `/products?category=${product.category.slug}` }] : []),
    { label: product.name },
  ];

  // Select variant: provided id, or first variant if available
  const selectedVariant =
    product.variants.find((v) => v.id === variantId) || product.variants[0];

  // Load related products
  const relatedResponse = await getProducts({
    category: product.category?.slug ?? undefined,
    pageSize: 8,
  });
  const relatedProducts = relatedResponse.products.filter(
    (p) => p.id !== product.id
  );

  const displayImages =
    selectedVariant?.images && selectedVariant.images.length > 0
      ? selectedVariant.images
      : product.images;

  return (
    <div className="container mx-auto px-4 py-12 h-screen mt-16">
      <AppBreadcrumb items={breadcrumbItems} />
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
        </div>

        {/* Product Info Section */}
        <div className="flex flex-col">
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
              {selectedVariant ? selectedVariant.price : "0.00"}€
            </span>
            <span className="text-sm text-gray-500 italic">
              / {selectedVariant?.priceUnit.toLowerCase() || "unité"}
            </span>
          </div>

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
