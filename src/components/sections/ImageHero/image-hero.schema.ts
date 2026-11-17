import { z } from "zod";

import { pictureSchema } from "@/components/media/Picture/picture.schema";

export const imageHeroContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),

  title: z.string().trim().min(1),

  description: z.string().trim().min(1).optional(),

  image: pictureSchema,

  cta: z
    .object({
      label: z.string().trim().min(1),
      pageId: z.string().trim().min(1),
    })
    .optional(),
});

export const imageHeroSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("image-hero"),
  content: imageHeroContentSchema,
});
