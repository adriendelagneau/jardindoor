import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères").regex(/^[a-z0-z-0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
  description: z.string().optional().nullable(),
  parentId: z.string().uuid().optional().nullable(),
});

export const categoryUpdateSchema = categorySchema.partial();

export type CategorySchema = z.infer<typeof categorySchema>;
export type CategoryUpdateSchema = z.infer<typeof categoryUpdateSchema>;
