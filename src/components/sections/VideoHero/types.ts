import type { z } from "zod";
import type { VariantProps } from "class-variance-authority";

import type {
  videoHeroContentSchema,
  videoHeroSectionSchema,
} from "./video-hero.schema";

import type {
  videoHeroContentVariants,
  videoHeroOverlayVariants,
} from "./video-hero.variants";

export type VideoHeroContent = z.infer<typeof videoHeroContentSchema>;

export type VideoHeroSection = z.infer<typeof videoHeroSectionSchema>;

export type VideoHeroProps = VideoHeroContent &
  VariantProps<typeof videoHeroContentVariants> &
  VariantProps<typeof videoHeroOverlayVariants> & {
    className?: string;
  };
