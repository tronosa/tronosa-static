import { z } from "@/lib/validation/zod";

import { richTextSchema } from "@/content/schemas/rich-text.schema";

export const contentSectionWidthSchema = z.enum(["narrow", "medium", "wide"]);

export const contentSectionContentSchema = z.object({
  width: contentSectionWidthSchema.default("narrow"),
  blocks: richTextSchema,
});

export const contentSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("content-section"),
  content: contentSectionContentSchema,
});
