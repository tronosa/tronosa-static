import type { z } from "zod";

import type {
  showcaseProductSchema,
  productShowcaseContentSchema,
  productShowcaseSectionSchema,
  productShowcaseCTASchema,
} from "./product-showcase.schema";

export type ShowcaseProduct = z.infer<typeof showcaseProductSchema>;

export type ProductShowcaseContent = z.infer<
  typeof productShowcaseContentSchema
>;

export type ProductShowcaseSection = z.infer<
  typeof productShowcaseSectionSchema
>;

export type ProductShowcaseCTAProps = z.infer<typeof productShowcaseCTASchema>;

export type ProductShowcaseProps = ProductShowcaseContent;

export type ResolvedProductShowcaseCTA = {
  label: string;
  href: string;
};

export type ProductShowcaseClientProps = Omit<ProductShowcaseProps, "cta"> & {
  cta?: ResolvedProductShowcaseCTA;
};
