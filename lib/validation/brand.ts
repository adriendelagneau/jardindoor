import { z } from "zod";

export const brandSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  slug: z.string().min(2, "Le slug doit contenir au moins 2 caractères").regex(/^[a-z0-9-]+$/, "Le slug ne doit contenir que des lettres minuscules, chiffres et tirets"),
});

export const brandUpdateSchema = brandSchema.partial();

export type BrandSchema = z.infer<typeof brandSchema>;
export type BrandUpdateSchema = z.infer<typeof brandUpdateSchema>;