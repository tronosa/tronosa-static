import { z } from "@/lib/validation/zod";

import { pictureSchema } from "@/components/media/Picture/picture.schema";

export const peopleGalleryContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),

  title: z.string().trim().min(1),

  paragraphs: z.array(z.string().trim().min(1)).min(1).max(4),

  images: z.array(pictureSchema).min(1).max(3),

  appearance: z.object({
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
});

export const peopleGallerySectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("people-gallery"),
  content: peopleGalleryContentSchema,
});

export type PeopleGalleryContent = z.infer<typeof peopleGalleryContentSchema>;
