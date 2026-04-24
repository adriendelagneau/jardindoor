import { MetadataRoute } from "next";
import prisma from "@/lib/prisma/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://jardin-indoor.fr";

  // Static routes
  const staticRoutes = [
    "",
    "/products",
    "/categories",
    "/login",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  // Fetch dynamic routes
  try {
    const [products, categories, brands] = await Promise.all([
      prisma.product.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.category.findMany({
        select: { slug: true, updatedAt: true },
      }),
      prisma.brand.findMany({
        select: { slug: true, updatedAt: true },
      }),
    ]);

    const productRoutes = products.map((product) => ({
      url: `${baseUrl}/products/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

    const categoryRoutes = categories.map((category) => ({
      url: `${baseUrl}/products?category=${category.slug}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));

    const brandRoutes = brands.map((brand) => ({
      url: `${baseUrl}/products?brand=${brand.slug}`,
      lastModified: brand.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.5,
    }));

    return [...staticRoutes, ...productRoutes, ...categoryRoutes, ...brandRoutes];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    return staticRoutes;
  }
}
