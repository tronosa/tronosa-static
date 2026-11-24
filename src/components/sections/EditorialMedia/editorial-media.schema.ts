import { z } from "@/lib/validation/zod";

import { pictureSchema } from "@/components/media/Picture/picture.schema";

const editorialImageSchema = z.object({
  kind: z.literal("image"),
  image: pictureSchema,
});

const editorialVideoSchema = z.object({
  kind: z.literal("video"),
  src: z.string().trim().min(1),
  poster: z.string().trim().min(1),
  type: z.enum(["video/mp4", "video/webm"]).default("video/mp4"),
  accessibility: z.object({
    label: z.string().trim().min(1),
  }),
});

const editorialGallerySchema = z.object({
  kind: z.literal("gallery"),
  images: z.array(pictureSchema).min(2).max(5),
  accessibility: z.object({
    label: z.string().trim().min(1),
    playLabel: z.string().trim().min(1),
    pauseLabel: z.string().trim().min(1),
    previousLabel: z.string().trim().min(1),
    nextLabel: z.string().trim().min(1),
  }),
});

export const editorialMediaSchema = z.discriminatedUnion("kind", [
  editorialImageSchema,
  editorialVideoSchema,
  editorialGallerySchema,
]);

export const editorialMediaContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1),
  paragraphs: z.array(z.string().trim().min(1)).min(1).max(4),
  media: editorialMediaSchema,
  mediaPosition: z.enum(["left", "right"]).default("right"),
  cta: z
    .object({
      label: z.string().trim().min(1),
      pageId: z.string().trim().min(1),
    })
    .optional(),
});

export const editorialMediaSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("editorial-media"),
  content: editorialMediaContentSchema,
});
