import { z } from "@/lib/validation/zod";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  PRODUCT_WATER_TYPES,
} from "@/lib/content/products/product.config";

const nonEmptyStringSchema = z.string().trim().min(1);

const identifierSchema = nonEmptyStringSchema.regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "Invalid product identifier.",
);

const slugSchema = nonEmptyStringSchema.regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  "Invalid product slug.",
);

export const productCategorySchema = z.enum(PRODUCT_CATEGORIES);

export const productWaterTypeSchema = z.enum(PRODUCT_WATER_TYPES);

export const productStatusSchema = z.enum(PRODUCT_STATUSES);

export const productImageSchema = z.object({
  src: nonEmptyStringSchema,
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const productAppearanceSchema = z.object({
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const productHighlightSchema = z.object({
  id: identifierSchema,
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
});

export const productHighlightsSchema = z
  .array(productHighlightSchema)
  .length(3)
  .refine(
    (highlights) =>
      new Set(highlights.map(({ id }) => id)).size === highlights.length,
    {
      message: "Product highlight IDs must be unique.",
    },
  );

export const productSchema = z
  .object({
    id: identifierSchema,
    category: productCategorySchema,
    waterType: productWaterTypeSchema,
    status: productStatusSchema.default("draft"),
    volumeMl: z.number().int().positive(),
    image: productImageSchema,
    appearance: productAppearanceSchema,
    featured: z.boolean().default(false),
    sortOrder: z.number().int().nonnegative().default(0),
  })
  .strict();

export const productSeoSchema = z.object({
  title: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
});

export const productTranslationSchema = z
  .object({
    id: identifierSchema,
    slug: slugSchema,
    title: nonEmptyStringSchema,
    description: nonEmptyStringSchema,
    imageAlt: nonEmptyStringSchema,

    highlights: productHighlightsSchema.optional(),

    declaration: nonEmptyStringSchema.optional(),
    storageInstructions: nonEmptyStringSchema.optional(),
    availability: nonEmptyStringSchema.optional(),

    seo: productSeoSchema,
  })
  .strict();

export const productCatalogSchema = z
  .array(productSchema)
  .superRefine((products, context) => {
    const identifiers = new Set<string>();

    products.forEach((product, index) => {
      if (identifiers.has(product.id)) {
        context.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `Duplicate product ID "${product.id}".`,
        });
      }

      identifiers.add(product.id);
    });
  });

export const productTranslationsSchema = z
  .array(productTranslationSchema)
  .superRefine((translations, context) => {
    const identifiers = new Set<string>();
    const slugs = new Set<string>();

    translations.forEach((translation, index) => {
      if (identifiers.has(translation.id)) {
        context.addIssue({
          code: "custom",
          path: [index, "id"],
          message: `Duplicate product translation ID "${translation.id}".`,
        });
      }

      if (slugs.has(translation.slug)) {
        context.addIssue({
          code: "custom",
          path: [index, "slug"],
          message: `Duplicate product slug "${translation.slug}".`,
        });
      }

      identifiers.add(translation.id);
      slugs.add(translation.slug);
    });
  });

export type Product = z.infer<typeof productSchema>;

export type ProductHighlight = z.infer<typeof productHighlightSchema>;

export type ProductTranslation = z.infer<typeof productTranslationSchema>;

export type ProductCatalog = z.infer<typeof productCatalogSchema>;

export type ProductTranslations = z.infer<typeof productTranslationsSchema>;

export type LocalizedProduct = Omit<Product, "image"> &
  Omit<ProductTranslation, "id" | "imageAlt"> & {
    image: Product["image"] & {
      alt: string;
    };
  };
