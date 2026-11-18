import type { z } from "zod";

import type {
  showcaseProductSchema,
  productShowcaseContentSchema,
  productShowcaseSectionSchema,
} from "./product-showcase.schema";

export type ShowcaseProduct = z.infer<typeof showcaseProductSchema>;

export type ProductShowcaseContent = z.infer<
  typeof productShowcaseContentSchema
>;

export type ProductShowcaseSection = z.infer<
  typeof productShowcaseSectionSchema
>;

export type ProductShowcaseProps = ProductShowcaseContent;
