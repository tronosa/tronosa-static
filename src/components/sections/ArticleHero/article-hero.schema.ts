import { z } from "@/lib/validation/zod";

import { richTextInlineSchema } from "@/content/schemas/rich-text.schema";

export const articleHeroContentSchema = z.object({
  backgroundText: z.string().trim().min(1),

  title: richTextInlineSchema.optional(),
});

export const articleHeroSchema = z.object({
  id: z.string().min(1),
  type: z.literal("article-hero"),
  content: articleHeroContentSchema,
});
