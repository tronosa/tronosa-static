import { z } from "@/lib/validation/zod";

const productAppearanceSchema = z.object({
  backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
});

export const productShowcaseProductSchema = z.object({
  id: z.string().trim().min(1),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  volume: z.string().trim().min(1),
  image: z.object({
    src: z.string().trim().min(1),
    alt: z.string().trim().min(1),
    width: z.number().int().positive(),
    height: z.number().int().positive(),
  }),
  appearance: productAppearanceSchema,
});

export const productShowcaseCategorySchema = z.object({
  id: z.string().trim().min(1),
  label: z.string().trim().min(1),
  products: z
    .array(productShowcaseProductSchema)
    .min(1)
    .superRefine((products, ctx) => {
      const ids = new Set<string>();

      products.forEach((product, index) => {
        if (ids.has(product.id)) {
          ctx.addIssue({
            code: "custom",
            path: [index, "id"],
            message: `Duplicate product ID: ${product.id}`,
          });
        }

        ids.add(product.id);
      });
    }),
});

export const productShowcaseContentSchema = z
  .object({
    eyebrow: z.string().trim().min(1).optional(),
    title: z.string().trim().min(1),
    description: z.string().trim().min(1).optional(),
    backgroundText: z.string().trim().min(1).optional(),

    accessibility: z.object({
      categorySelectorLabel: z.string().trim().min(1),
      selectorLabel: z.string().trim().min(1),
    }),

    cta: z
      .object({
        label: z.string().trim().min(1),
        pageId: z.string().trim().min(1),
      })
      .optional(),

    categories: z.array(productShowcaseCategorySchema).min(1),
  })
  .superRefine((content, ctx) => {
    const categoryIds = new Set<string>();
    const productIds = new Set<string>();

    content.categories.forEach((category, categoryIndex) => {
      if (categoryIds.has(category.id)) {
        ctx.addIssue({
          code: "custom",
          path: ["categories", categoryIndex, "id"],
          message: `Duplicate category ID: ${category.id}`,
        });
      }

      categoryIds.add(category.id);

      category.products.forEach((product, productIndex) => {
        if (productIds.has(product.id)) {
          ctx.addIssue({
            code: "custom",
            path: ["categories", categoryIndex, "products", productIndex, "id"],
            message: `Duplicate global product ID: ${product.id}`,
          });
        }

        productIds.add(product.id);
      });
    });
  });

export const productShowcaseSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("product-showcase"),
  content: productShowcaseContentSchema,
});
