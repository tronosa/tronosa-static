import type { z } from "zod";

import type {
  experienceImageSchema,
  experienceHighlightSchema,
  experienceMineralSchema,
  experienceProductSchema,
  productExperienceContentSchema,
  productExperienceSectionSchema,
} from "./product-experience.schema";

export type ExperienceImage = z.infer<typeof experienceImageSchema>;

export type ExperienceHighlight = z.infer<typeof experienceHighlightSchema>;

export type ExperienceMineral = z.infer<typeof experienceMineralSchema>;

export type ExperienceProduct = z.infer<typeof experienceProductSchema>;

export type ProductExperienceContent = z.infer<
  typeof productExperienceContentSchema
>;

export type ProductExperienceSection = z.infer<
  typeof productExperienceSectionSchema
>;

export type ProductExperienceProps = Omit<
  ProductExperienceContent,
  "productIds" | "products"
> & {
  products: ExperienceProduct[];
};

export type ProductRevealProps = ProductExperienceContent["reveal"];

export type ProductCompositionProps = ProductExperienceContent["composition"];

export type ProductCollectionProps = ProductExperienceContent["collection"];

export type ProductStageProps = {
  products: ExperienceProduct[];
};

export type ProductHighlightsProps = {
  products: ExperienceProduct[];
};
