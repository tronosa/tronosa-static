import { z } from "@/lib/validation/zod";

import { pictureSchema } from "@/components/media/Picture/picture.schema";

export const heritageStoryContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1),

  image: pictureSchema,

  paragraphs: z.array(z.string().trim().min(1)).min(1).max(4),

  caption: z.string().trim().min(1).optional(),

  appearance: z.object({
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
});

export const heritageStorySectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("heritage-story"),
  content: heritageStoryContentSchema,
});

export type HeritageStoryContent = z.infer<typeof heritageStoryContentSchema>;
