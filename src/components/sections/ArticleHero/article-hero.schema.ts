import { z } from "@/lib/validation/zod";

import { richTextInlineSchema } from "@/content/schemas/rich-text.schema";

export const articleHeroContentSchema = z.object({
  backgroundText: z.string().trim().min(1),

  title: richTextInlineSchema.optional(),

  appearance: z.object({
    backgroundColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
    accentColor: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  }),
});

export const articleHeroSchema = z.object({
  id: z.string().min(1),
  type: z.literal("article-hero"),
  content: articleHeroContentSchema,
});
