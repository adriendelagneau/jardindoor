import { z } from "zod";

export const imageSchema = z.object({
  url: z.string().url("L'URL de l'image est requise"),
  altText: z.string().min(3, "Le texte alternatif doit contenir au moins 3 caractères"),
  shortDescription: z.string().min(5, "La description courte doit contenir au moins 5 caractères").max(255, "La description ne doit pas dépasser 255 caractères"),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  productId: z.string().uuid().optional().nullable(),
  brandId: z.string().uuid().optional().nullable(),
  categoryId: z.string().uuid().optional().nullable(),
});

export type ImageSchema = z.infer<typeof imageSchema>;
