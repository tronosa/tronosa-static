import type { z } from "zod";
import type {
  statsBannerContentSchema,
  statsBannerSectionSchema,
} from "./stats-banner.schema";

export type StatsBannerContent = z.infer<typeof statsBannerContentSchema>;
export type StatsBannerSection = z.infer<typeof statsBannerSectionSchema>;
export type StatsBannerProps = StatsBannerContent & { className?: string };
