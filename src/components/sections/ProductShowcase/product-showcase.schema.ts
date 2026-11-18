import { z } from "zod";

export const showcaseProductSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  volume: z.string().trim().min(1),

  image: z.object({
    src: z.string().min(1),
    alt: z.string(),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),

  appearance: z.object({
    backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
});

export const productShowcaseCTASchema = z.object({
  label: z.string().trim().min(1),
  pageId: z.string().trim().min(1),
});

export const productShowcaseContentSchema = z.object({
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  description: z.string().optional(),
  backgroundText: z.string().optional(),

  accessibility: z.object({
    selectorLabel: z.string().min(1),
  }),

  cta: productShowcaseCTASchema.optional(),

  products: z
    .array(showcaseProductSchema)
    .min(1)
    .refine(
      (products) =>
        new Set(products.map(({ id }) => id)).size === products.length,
      {
        message: "Product IDs must be unique.",
      },
    ),
});

export const productShowcaseSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("product-showcase"),
  content: productShowcaseContentSchema,
});
