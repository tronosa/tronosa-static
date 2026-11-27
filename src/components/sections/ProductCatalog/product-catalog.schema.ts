import { z } from "@/lib/validation/zod";

const textSchema = z.string().trim().min(1);

export const productCatalogContentSchema = z
  .object({
    eyebrow: textSchema.optional(),

    title: textSchema,

    description: textSchema.optional(),
  })
  .strict();

export const productCatalogSectionSchema = z.object({
  id: textSchema,

  type: z.literal("product-catalog"),

  content: productCatalogContentSchema,
});

export type ProductCatalogContent = z.infer<typeof productCatalogContentSchema>;
