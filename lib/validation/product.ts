import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().uuid().optional(), // For updates
  name: z.string().min(1, "Le nom de la variante est requis (ex: 500ml)"),
  price: z.coerce.number().positive("Le prix doit être positif"),
  originalPrice: z.coerce.number().positive().optional().nullable(),
  status: z.enum(["ACTIVE", "ARCHIVED", "OUT_OF_STOCK"]).default("ACTIVE"),
  isDefault: z.boolean().default(false),
});

export const productSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères").regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
  description: z.string().optional().nullable(),
  isPromotion: z.boolean().default(false),
  categoryId: z.string().uuid("Catégorie invalide").optional().nullable(),
  brandId: z.string().uuid("Marque invalide").optional().nullable(),
  imageIds: z.array(z.string().uuid()).optional().default([]), // For associating existing images
  variants: z.array(variantSchema).min(1, "Au moins une variante est requise"),
});

export const productUpdateSchema = productSchema.partial();

export type VariantSchema = z.infer<typeof variantSchema>;
export type ProductSchema = z.infer<typeof productSchema>;
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>;
