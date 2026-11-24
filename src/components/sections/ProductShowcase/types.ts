import type { z } from "zod";

import type {
  productShowcaseProductSchema,
  productShowcaseCategorySchema,
  productShowcaseContentSchema,
  productShowcaseSectionSchema,
} from "./product-showcase.schema";

export type ShowcaseProduct = z.infer<typeof productShowcaseProductSchema>;

export type ProductShowcaseProduct = ShowcaseProduct;

export type ProductShowcaseCategory = z.infer<
  typeof productShowcaseCategorySchema
>;

export type ProductShowcaseContent = z.infer<
  typeof productShowcaseContentSchema
>;

export type ProductShowcaseSection = z.infer<
  typeof productShowcaseSectionSchema
>;

export type ProductShowcaseCTAProps = NonNullable<
  ProductShowcaseContent["cta"]
>;

export type ProductShowcaseProps = ProductShowcaseContent;

export type ResolvedProductShowcaseCTA = {
  label: string;
  href: string;
};

export type ProductShowcaseClientProps = Omit<ProductShowcaseProps, "cta"> & {
  cta?: ResolvedProductShowcaseCTA;
};
