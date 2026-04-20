import { getCategoryById } from "@/actions/categories";
import { CategoryList } from "./components/CategoryList";

export const metadata = {
  title: "Nos Catégories | Jardin",
  description: "Découvrez toutes nos catégories de produits pour votre jardin et vos plantes.",
};

export default async function CategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ parentId?: string }>;
}) {
  const { parentId } = await searchParams;

  let title = "Nos Catégories";
  if (parentId) {
    const parentCategory = await getCategoryById(parentId);
    if (parentCategory) {
      title = parentCategory.name;
    }
  }

  return (
    <div className="container mx-auto px-4 py-12 mt-16 min-h-screen">
      <div className="mb-12 text-center">
        <h1 className="font-serif text-4xl font-bold text-green-900 md:text-5xl capitalize">
          {title}
        </h1>
        <p className="mt-4 text-lg text-gray-600">
          Explorez notre sélection complète pour cultiver votre passion.
        </p>
      </div>

      <CategoryList parentId={parentId} />
    </div>
  );
}

