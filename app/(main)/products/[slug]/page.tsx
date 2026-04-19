import { getProductBySlug, getProducts } from "@/actions/products";
import { ProductSection } from "@/components/carousel/main-carousel/ProductSection";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Related products from the same category
  const relatedResponse = await getProducts({
    categorySlug: product.category?.slug ?? undefined,
    pageSize: 8,
  });

  const relatedProducts = relatedResponse.products.filter(
    (p) => p.id !== product.id
  );

  return (
    <div className="container mx-auto px-4 py-12 mt-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images Section */}
        <div className="space-y-6">
          <div className="relative aspect-4/5 overflow-hidden rounded-[2rem] bg-muted shadow-sm ring-1 ring-black/5">
            {product.images?.[0] ? (
              <Image
                src={product.images[0].url}
                alt={product.images[0].altText || product.name}
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
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((image, index) => (
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
          {/* <div className="mb-4">
            <span className="text-xs font-bold uppercase tracking-widest text-green-700/60">
              {product.category?.name || "Collection"}
            </span>
          </div> */}

          <h1 className="text-4xl lg:text-5xl font-serif font-medium text-green-900 leading-tight">
            {product.name}
          </h1>

          {/* Price */}
          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-green-900">
              {product.price}€
            </span>
            <span className="text-sm text-gray-500 italic">
              / {product.priceUnit.toLowerCase()}
            </span>
          </div>

          {/* Status Badge */}
          <div className="mt-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
              product.status === "ACTIVE" 
                ? "bg-green-100 text-green-800" 
                : "bg-orange-100 text-orange-800"
            }`}>
              {product.status === "ACTIVE" ? "En stock" : product.status}
            </span>
          </div>

          {/* Description */}
          <div className="mt-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-green-900 mb-4">
              Description
            </h3>
            <p className="text-gray-600 leading-relaxed italic text-[15px]">
              {product.description || "Aucune description disponible pour ce produit d'exception."}
            </p>
          </div>

          {/* Brand */}
          {product.brand && (
            <div className="mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <span className="text-xs text-gray-400 uppercase tracking-widest">Marque</span>
                  <p className="text-lg font-serif text-green-900">{product.brand.name}</p>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="mt-auto pt-12 space-y-4">
            <Button size="lg" className="w-full h-14 rounded-full bg-green-900 hover:bg-green-800 text-white font-bold uppercase tracking-widest text-xs transition-all">
              Disponible en magasin
            </Button>
            
          
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
