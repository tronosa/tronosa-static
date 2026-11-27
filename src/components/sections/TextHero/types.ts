import type { z } from "zod";

import type {
  textHeroContentSchema,
  textHeroSectionSchema,
} from "./text-hero.schema";

export type TextHeroProps = z.infer<typeof textHeroContentSchema>;

export type TextHeroSection = z.infer<typeof textHeroSectionSchema>;
