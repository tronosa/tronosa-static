import type { z } from "zod";

import type {
  statsBannerContentSchema,
  statsBannerSectionSchema,
} from "./stats-banner.schema";

import type { StatsBannerTheme } from "./stats-banner.theme";

export type { StatsBannerTheme } from "./stats-banner.theme";

export type StatsBannerContent = z.infer<typeof statsBannerContentSchema>;

export type StatsBannerSection = z.infer<typeof statsBannerSectionSchema>;

export type StatsBannerProps = Omit<StatsBannerContent, "theme"> & {
  theme?: StatsBannerTheme;
  className?: string;
};
