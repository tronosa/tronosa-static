import { z } from "zod";

export const faqContentSchema = z.object({
  title: z.string().trim().min(1),
  description: z.string().trim().min(1).optional(),
  items: z
    .array(
      z.object({
        question: z.string().trim().min(1),
        answer: z.string().trim().min(1),
      }),
    )
    .min(1),
});

export const faqSectionSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("faq"),
  content: faqContentSchema,
});
