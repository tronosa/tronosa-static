import type { z } from "zod";
import type { VariantProps } from "class-variance-authority";

import type {
  imageHeroContentSchema,
  imageHeroSectionSchema,
} from "./image-hero.schema";

import type {
  imageHeroVariants,
  imageHeroContentVariants,
  imageHeroOverlayVariants,
} from "./image-hero.variants";

export type ImageHeroContent = z.infer<typeof imageHeroContentSchema>;

export type ImageHeroSection = z.infer<typeof imageHeroSectionSchema>;

export type ImageHeroProps = ImageHeroContent &
  VariantProps<typeof imageHeroVariants> &
  VariantProps<typeof imageHeroContentVariants> &
  VariantProps<typeof imageHeroOverlayVariants> & {
    className?: string;
  };
