import { z } from "zod";

import {
  backgroundVideoSchema,
  backgroundVideoAccessibilitySchema,
} from "@/components/media/BackgroundVideo/background-video.schema";

export const videoHeroContentSchema = z.object({
  title: z.string().trim().min(1),

  description: z.string().trim().min(1).optional(),

  video: backgroundVideoSchema,

  cta: z
    .object({
      label: z.string().trim().min(1),
      pageId: z.string().trim().min(1),
    })
    .optional(),

  accessibility: backgroundVideoAccessibilitySchema,
});

export const videoHeroSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("video-hero"),
  content: videoHeroContentSchema,
});
