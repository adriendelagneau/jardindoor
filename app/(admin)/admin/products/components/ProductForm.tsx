"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  useForm,
  useFieldArray,
  Resolver,
  SubmitHandler,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  productSchema as schema,
  productUpdateSchema as updateSchema,
  type ProductSchema,
  type VariantSchema,
} from "@/lib/validation/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  Trash2,
  ArrowLeft,
  Save,
  Info,
  Image as ImageIcon,
  Check,
  Percent,
  Plus,
  X,
  List,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import cloudinaryUrl from "@/utils/updateCloudinaryUrl";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import {
  createProduct,
  updateProduct,
  deleteProduct,
} from "@/actions/products";

export interface ProductInitialData extends Omit<
  ProductSchema,
  "variants" | "imageIds"
> {
  id: string;
  images: { id: string; url: string; altText: string }[];
  variants: (VariantSchema & { id: string })[];
}

interface ProductFormProps {
  initialData?: ProductInitialData;
  categories: { id: string; name: string; parentId?: string | null }[];
  brands?: { id: string; name: string }[];
  availableImages: { id: string; url: string; altText: string }[];
  isEdit?: boolean;
}

export const ProductForm = ({
  initialData,
  categories,
  brands = [],
  availableImages,
  isEdit = false,
}: ProductFormProps) => {
  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [selectedImageIds, setSelectedImageIds] = useState<string[]>(
    initialData?.images?.map((img) => img.id) || [],
  );

  // Subcategory logic
  const [selectedParentId, setSelectedParentId] = useState<string>(() => {
    if (initialData?.categoryId) {
      const currentCat = categories.find(
        (c) => c.id === initialData.categoryId,
      );
      return currentCat?.parentId || initialData.categoryId;
    }
    return "";
  });

  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string>(
    () => {
      if (initialData?.categoryId) {
        const currentCat = categories.find(
          (c) => c.id === initialData.categoryId,
        );
        return currentCat?.parentId ? initialData.categoryId : "";
      }
      return "";
    },
  );

  const parentCategories = categories.filter((c) => !c.parentId);
  const subCategories = categories.filter(
    (c) => c.parentId === selectedParentId,
  );

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<ProductSchema>({
    resolver: zodResolver(
      isEdit ? updateSchema : schema,
    ) as Resolver<ProductSchema>,
    defaultValues: initialData
      ? {
          ...initialData,
          imageIds: initialData.images?.map((img) => img.id) || [],
          variants: (initialData.variants || []).map((v) => ({
            ...v,
            price: Number(v.price),
            originalPrice: v.originalPrice
              ? Number(v.originalPrice)
              : undefined,
          })),
        }
      : {
          name: "",
          slug: "",
          description: "",
          isPromotion: false,
          isShowInCarousel: false,
          categoryId: "",
          brandId: "",
          imageIds: [],
          variants: [
            {
              name: "Standard",
              price: 0,
              status: "ACTIVE",
              isDefault: true,
            },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  });

  const nameValue = watch("name");

  // Auto-slug
  React.useEffect(() => {
    if (!isEdit && nameValue) {
      const slug = nameValue
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "");
      setValue("slug", slug, { shouldValidate: true });
    }
  }, [nameValue, setValue, isEdit]);

  const toggleImage = (imageId: string) => {
    const newSelection = selectedImageIds.includes(imageId)
      ? selectedImageIds.filter((id) => id !== imageId)
      : [...selectedImageIds, imageId];

    setSelectedImageIds(newSelection);
    setValue("imageIds", newSelection, { shouldDirty: true });
  };

  const onSubmit: SubmitHandler<ProductSchema> = async (data) => {
    setIsSaving(true);
    const redirectUrl = "/admin/products";

    try {
      if (isEdit && initialData?.id) {
        await updateProduct(initialData.id, data);
      } else {
        await createProduct(data);
      }

      router.push(redirectUrl);
      router.refresh();
    } catch (error) {
      console.error("Error saving product:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    setIsDeleting(true);

    try {
      await deleteProduct(initialData.id);
      setIsDialogOpen(false);
      router.push("/admin/products");
      router.refresh();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const titleLabel = "Nouveau Produit";
  const editLabel = "le produit";

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild size="icon" className="rounded-full">
            <Link href={"/admin/products"}>
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit && initialData
                ? `Modifier "${initialData.name}"`
                : titleLabel}
            </h1>
            <p className="text-muted-foreground">
              {isEdit
                ? `Mettez à jour les informations de ${editLabel}.`
                : `Ajoutez ${"un article"} à votre catalogue.`}
            </p>
          </div>
        </div>

        {isEdit && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2 rounded-full px-4 shadow-sm hover:shadow-md transition-all"
              >
                <Trash2 className="h-4 w-4" />
                Supprimer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Supprimer {"ce produit"} ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Toutes les données seront
                  définitivement supprimées.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  disabled={isDeleting}
                >
                  Annuler
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="gap-2"
                >
                  {isDeleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  {isDeleting ? "Suppression..." : "Confirmer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Info className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Informations générales</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  {"Nom du produit"}
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder={"Ex: Monstera Deliciosa XXL"}
                  className={
                    errors.name
                      ? "border-destructive h-12 rounded-xl bg-muted/30 focus-visible:ring-destructive text-lg font-medium"
                      : "h-12 rounded-xl bg-muted/30 text-lg font-medium"
                  }
                />
                {errors.name && (
                  <p className="text-xs text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-semibold">
                  Slug (URL)
                </Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder={"monstera-deliciosa-xxl"}
                  className={
                    errors.slug
                      ? "border-destructive h-11 rounded-xl bg-muted/30 focus-visible:ring-destructive"
                      : "h-11 rounded-xl bg-muted/30"
                  }
                />
                {errors.slug && (
                  <p className="text-xs text-destructive">
                    {errors.slug.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="parentCategoryId"
                  className="text-sm font-semibold"
                >
                  Catégorie
                </Label>
                <select
                  id="parentCategoryId"
                  value={selectedParentId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedParentId(val);
                    setSelectedSubCategoryId("");
                    setValue("categoryId", val, { shouldDirty: true });
                  }}
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">-- Sélectionner une catégorie --</option>
                  {parentCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="subCategoryId"
                  className="text-sm font-semibold"
                >
                  Sous-catégorie
                </Label>
                <select
                  id="subCategoryId"
                  value={selectedSubCategoryId}
                  onChange={(e) => {
                    const val = e.target.value;
                    setSelectedSubCategoryId(val);
                    setValue("categoryId", val || selectedParentId, {
                      shouldDirty: true,
                    });
                  }}
                  disabled={!selectedParentId || subCategories.length === 0}
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:opacity-50"
                >
                  <option value="">
                    -- Sélectionner une sous-catégorie --
                  </option>
                  {subCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="brandId" className="text-sm font-semibold">
                  Marque
                </Label>
                <select
                  id="brandId"
                  {...register("brandId")}
                  className="flex h-11 w-full rounded-xl border border-input bg-muted/30 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="">-- Sélectionner une marque --</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.name}
                    </option>
                  ))}
                </select>
                {errors.brandId && (
                  <p className="text-xs text-destructive">
                    {errors.brandId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description" className="text-sm font-semibold">
                  Description
                </Label>
                <textarea
                  id="description"
                  {...register("description")}
                  rows={6}
                  className="flex w-full rounded-2xl border border-input bg-muted/30 px-4 py-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  placeholder={
                    "Décrivez les caractéristiques de votre produit..."
                  }
                />
              </div>
            </div>
          </Card>

          {/* Variants Section */}
          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
              <div className="flex items-center gap-2">
                <List className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold">Variantes & Prix</h2>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    name: "",
                    price: 0,
                    status: "ACTIVE",
                    isDefault: false,
                  })
                }
                className="rounded-full gap-2 border-primary/20 hover:bg-primary/5 text-primary"
              >
                <Plus className="h-4 w-4" />
                Ajouter une variante
              </Button>
            </div>

            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="p-4 rounded-2xl bg-muted/20 border border-muted/50 space-y-4 relative animate-in slide-in-from-top-2 duration-300"
                >
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="absolute top-4 right-4 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Option (ex: 500ml, 1L, Lot de 3)
                      </Label>
                      <Input
                        {...register(`variants.${index}.name`)}
                        placeholder="Nom de la variante"
                        className="h-10 rounded-xl bg-white"
                      />
                      {errors.variants?.[index]?.name && (
                        <p className="text-[10px] text-destructive">
                          {errors.variants[index]?.name?.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Prix (€)
                      </Label>
                      <div className="relative">
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`variants.${index}.price`)}
                          className="h-10 pl-8 rounded-xl bg-white font-semibold"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                          €
                        </span>
                      </div>
                      {errors.variants?.[index]?.price && (
                        <p className="text-[10px] text-destructive">
                          {errors.variants[index]?.price?.message}
                        </p>
                      )}
                    </div>

                    {watch("isPromotion") && (
                      <div className="space-y-2 animate-in fade-in zoom-in duration-300">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                          Ancien Prix (€)
                        </Label>
                        <div className="relative">
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`variants.${index}.originalPrice`)}
                            className="h-10 pl-8 rounded-xl bg-white/50 text-muted-foreground line-through"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs font-bold">
                            €
                          </span>
                        </div>
                        {errors.variants?.[index]?.originalPrice && (
                          <p className="text-[10px] text-destructive">
                            {errors.variants[index]?.originalPrice?.message}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        Statut
                      </Label>
                      <select
                        {...register(`variants.${index}.status`)}
                        className="flex h-10 w-full rounded-xl border border-input bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
                      >
                        <option value="ACTIVE">En stock</option>
                        <option value="OUT_OF_STOCK">Rupture</option>
                        <option value="ARCHIVED">Archivé</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        {...register(`variants.${index}.isDefault`)}
                        className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary accent-primary"
                        onChange={(e) => {
                          if (e.target.checked) {
                            // Reset others
                            fields.forEach((_, i) => {
                              if (i !== index)
                                setValue(`variants.${i}.isDefault`, false);
                            });
                          }
                        }}
                      />
                      <span className="text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        Variante par défaut
                      </span>
                    </label>
                  </div>
                </div>
              ))}

              {errors.variants?.message && (
                <p className="text-sm text-destructive font-medium">
                  {errors.variants.message}
                </p>
              )}
            </div>
          </Card>

          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <ImageIcon className="h-5 w-5 text-primary" />
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{"Images du produit"}</h2>
                <p className="text-xs text-muted-foreground">
                  Sélectionnez les images à associer
                </p>
              </div>
              <Link
                href="/admin/images/create"
                className="text-xs text-primary font-bold hover:underline"
              >
                + Uploader de nouvelles images
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {availableImages.map((img) => (
                <div
                  key={img.id}
                  onClick={() => toggleImage(img.id)}
                  className={cn(
                    "relative aspect-square rounded-xl border-2 overflow-hidden cursor-pointer transition-all group",
                    selectedImageIds.includes(img.id)
                      ? "border-primary shadow-lg ring-2 ring-primary/20"
                      : "border-transparent opacity-70 hover:opacity-100",
                  )}
                >
                  <Image
                    src={cloudinaryUrl(img.url, { width: 200, height: 200, crop: "fill" })}
                    alt={img.altText}
                    fill
                    className="object-cover"
                  />
                  {selectedImageIds.includes(img.id) && (
                    <div className="absolute top-1 right-1 bg-primary text-white rounded-full p-1 shadow-md">
                      <Check className="h-3 w-3 font-bold" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Controls */}
        <div className="space-y-8">
          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <h2 className="text-lg font-semibold border-b pb-4">Options</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <Label
                  htmlFor="isPromotion"
                  className="text-sm font-bold cursor-pointer flex items-center gap-2"
                >
                  <Percent className="h-4 w-4 text-primary" /> En promotion
                </Label>
                <input
                  id="isPromotion"
                  type="checkbox"
                  {...register("isPromotion")}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-primary/5 border border-primary/10">
                <Label
                  htmlFor="isShowInCarousel"
                  className="text-sm font-bold cursor-pointer flex items-center gap-2"
                >
                  <List className="h-4 w-4 text-primary" />
                  Afficher dans le carrousel
                </Label>
                <input
                  id="isShowInCarousel"
                  type="checkbox"
                  {...register("isShowInCarousel")}
                  className="h-5 w-5 accent-primary cursor-pointer"
                />
              </div>
            </div>
          </Card>

          <div className="sticky top-24 space-y-4">
            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all gap-2"
              disabled={isSaving || (isEdit && !isDirty)}
            >
              {isSaving ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Save className="h-5 w-5" />
              )}
              {isEdit ? "Mettre à jour" : `Publier ${"le produit"}`}
            </Button>

            <Button
              type="button"
              variant="outline"
              asChild
              className="w-full h-12 rounded-2xl"
            >
              <Link href={"/admin/products"}>Annuler</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
