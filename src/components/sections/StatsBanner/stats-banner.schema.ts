import { z } from "@/lib/validation/zod";

import { statsBannerThemeNames } from "./stats-banner.theme";

export const statsBannerThemeSchema = z.enum(statsBannerThemeNames);

export const statsBannerContentSchema = z.object({
  title: z.string().trim().min(1),

  description: z.string().trim().min(1).optional(),

  theme: statsBannerThemeSchema.default("forest"),

  statistics: z
    .array(
      z.object({
        value: z.string().trim().min(1),
        label: z.string().trim().min(1),
      }),
    )
    .min(1)
    .max(4),
});

export const statsBannerSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("stats-banner"),
  content: statsBannerContentSchema,
});
