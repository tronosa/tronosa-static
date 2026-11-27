import { z } from "@/lib/validation/zod";

export const editorialClosingContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),

  title: z.string().trim().min(1),

  description: z.string().trim().min(1).optional(),

  cta: z.object({
    label: z.string().trim().min(1),
    pageId: z.string().trim().min(1),
  }),

  appearance: z.object({
    backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
    accentColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  }),
});

export const editorialClosingSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("editorial-closing"),
  content: editorialClosingContentSchema,
});

export type EditorialClosingContent = z.infer<
  typeof editorialClosingContentSchema
>;
