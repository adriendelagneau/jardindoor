import { getCategories } from "@/actions/categories";
import { getBrands } from "@/actions/brands";
import { ProductList } from "./components/ProductList";
import { ProductFilters } from "./components/ProductFilters";

export const metadata = {
  title: "Boutique | Jardin",
  description: "Découvrez notre catalogue de produits pour votre jardin.",
};

export default async function ProductsPage() {
  const [categories, brands] = await Promise.all([
    getCategories({ pageSize: 100 }),
    getBrands(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12 mt-16">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Filters */}
        <aside className="w-full lg:w-64 shrink-0">
          <ProductFilters 
            categories={categories.categories} 
            brands={brands} 
          />
        </aside>

        {/* Product List */}
        <main className="flex-1">
          <h1 className="font-serif text-3xl font-bold text-green-900 mb-8">
            Catalogue
          </h1>
          <ProductList />
        </main>
      </div>
    </div>
  );
}
