import { z } from "@/lib/validation/zod";

export const experienceImageSchema = z.object({
  src: z.string().min(1),
  alt: z.string(),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const experienceHighlightSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string().min(1),
});

export const experienceMineralSchema = z.object({
  id: z.string().min(1),
  symbol: z.string().min(1),
  name: z.string().min(1),
  value: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
});

export const experienceProductSchema = z.object({
  id: z.string().trim().min(1),
  eyebrow: z.string().optional(),
  title: z.string().min(1),
  volume: z.string().min(1),
  description: z.string().optional(),

  highlights: z.array(experienceHighlightSchema).min(1),

  image: experienceImageSchema,
});

const colorSchema = z.string().regex(/^#[0-9a-fA-F]{6}$/);

export const productExperienceContentSchema = z.object({
  appearance: z.object({
    backgroundColor: colorSchema,
    secondaryBackgroundColor: colorSchema,
    accentColor: colorSchema,
  }),

  reveal: z.object({
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    backgroundText: z.string().min(1),
    description: z.string().optional(),
    scrollLabel: z.string().min(1),
  }),

  composition: z.object({
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    description: z.string().optional(),
    minerals: z.array(experienceMineralSchema),
  }),

  collection: z.object({
    eyebrow: z.string().optional(),
    title: z.string().min(1),
    description: z.string().optional(),
  }),

  products: z
    .array(experienceProductSchema)
    .min(1)
    .refine(
      (products) =>
        new Set(products.map(({ id }) => id)).size === products.length,
      {
        message: "Product IDs must be unique.",
      },
    ),
});

export const productExperienceSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("product-experience"),
  content: productExperienceContentSchema,
});
