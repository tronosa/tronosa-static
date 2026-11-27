import { z } from "@/lib/validation/zod";

import { pictureSchema } from "@/components/media/Picture/picture.schema";

export const editorialCompositionContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1),

  paragraphs: z.array(z.string().trim().min(1)).min(1).max(4),

  statement: z.string().trim().min(1).optional(),

  primaryImage: pictureSchema,
  secondaryImage: pictureSchema.optional(),

  caption: z.string().trim().min(1).optional(),

  appearance: z.object({
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
});

export const editorialCompositionSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("editorial-composition"),
  content: editorialCompositionContentSchema,
});

export type EditorialCompositionContent = z.infer<
  typeof editorialCompositionContentSchema
>;
