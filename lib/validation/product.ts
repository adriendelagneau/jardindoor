import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères").regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
  description: z.string().optional().nullable(),
  price: z.coerce.number().positive("Le prix doit être positif"),
  priceUnit: z.enum(["UNIT", "KG", "L"]).default("UNIT"),
  status: z.enum(["ACTIVE", "ARCHIVED", "OUT_OF_STOCK"]).default("ACTIVE"),
  type: z.enum(["PRODUCT", "SEED"]).default("PRODUCT"),
  isPromotion: z.boolean().default(false),
  categoryId: z.string().uuid("Catégorie invalide").optional().nullable(),
  brandId: z.string().uuid("Marque invalide").optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDescription: z.string().optional().nullable(),
  imageIds: z.array(z.string().uuid()).optional().default([]), // For associating existing images
});

export const productUpdateSchema = productSchema.partial();

export type ProductSchema = z.infer<typeof productSchema>;
export type ProductUpdateSchema = z.infer<typeof productUpdateSchema>;
