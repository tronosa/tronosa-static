import { z } from "zod";

export const statsBannerContentSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
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
