"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Loader2, Trash2, ArrowLeft, Save, Package } from "lucide-react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { brandSchema as schema, type BrandSchema } from "@/lib/validation/brand";
import { createBrand, updateBrand, deleteBrand } from "@/actions/brands";

interface BrandFormProps {
  initialData?: BrandSchema & { id: string };
  isEdit?: boolean;
}

export const BrandForm = ({ initialData, isEdit = false }: BrandFormProps) => {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<BrandSchema>({
    resolver: zodResolver(schema) as Resolver<BrandSchema>,
    defaultValues: initialData || {
      name: "",
      slug: "",
    },
  });

  const nameValue = watch("name");

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

  const onSubmit = async (data: BrandSchema) => {
    setIsSaving(true);
    try {
      if (isEdit && initialData?.id) {
        await updateBrand(initialData.id, data);
      } else {
        await createBrand(data);
      }

      router.push("/admin/brand");
      router.refresh();
    } catch (error) {
      console.error("Error saving brand:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!initialData?.id) return;
    setIsDeleting(true);
    try {
      await deleteBrand(initialData.id);

      setIsDialogOpen(false);
      router.push("/admin/brand");
      router.refresh();
    } catch (error) {
      console.error("Error deleting brand:", error);
      alert(error instanceof Error ? error.message : "Failed to delete brand");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-24 animate-in fade-in duration-500">
      <div className="flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild size="icon" className="rounded-full">
            <Link href="/admin/brand">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {isEdit && initialData ? `Modifier "${initialData.name}"` : "Nouvelle marque"}
            </h1>
            <p className="text-muted-foreground">
              {isEdit
                ? "Mettez à jour les informations de votre marque."
                : "Créez une nouvelle marque pour vos produits."}
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
                <DialogTitle>Supprimer la marque ?</DialogTitle>
                <DialogDescription>
                  Cette action est irréversible. Les produits associés ne
                  seront pas supprimés, mais ils perdront leur lien avec cette
                  marque.
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

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-3xl border shadow-sm p-6 space-y-6">
            <div className="flex items-center gap-2 border-b pb-4">
              <Package className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Informations générales</h2>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold">
                  Nom de la marque
                </Label>
                <Input
                  id="name"
                  {...register("name")}
                  placeholder="Ex: Botanical Lab"
                  className={
                    errors.name
                      ? "border-destructive h-12 rounded-xl bg-muted/30 focus-visible:ring-destructive"
                      : "h-12 rounded-xl bg-muted/30"
                  }
                />
                {errors.name && (
                  <p className="text-xs text-destructive">{errors.name.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug" className="text-sm font-semibold">
                  Slug (URL)
                </Label>
                <Input
                  id="slug"
                  {...register("slug")}
                  placeholder="botanical-lab"
                  className={
                    errors.slug
                      ? "border-destructive h-12 rounded-xl bg-muted/30 focus-visible:ring-destructive"
                      : "h-12 rounded-xl bg-muted/30"
                  }
                />
                {errors.slug && (
                  <p className="text-xs text-destructive">{errors.slug.message}</p>
                )}
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <div className="sticky top-24 space-y-4">
            <Button
              type="submit"
              className="w-full h-14 text-lg font-bold rounded-2xl shadow-lg hover:shadow-xl transition-all gap-2"
              disabled={isSaving || (isEdit && !isDirty)}
            >
              {isSaving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
              {isEdit ? "Mettre à jour" : "Enregistrer"}
            </Button>

            <Button
              type="button"
              variant="outline"
              asChild
              className="w-full h-12 rounded-2xl"
            >
              <Link href="/admin/brand">Annuler</Link>
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};