import { z } from "@/lib/validation/zod";

export const productIntroductionContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),

  title: z.string().trim().min(1),

  description: z.string().trim().min(1),
});

export const productIntroductionSectionSchema = z.object({
  id: z.string().trim().min(1),

  type: z.literal("product-introduction"),

  content: productIntroductionContentSchema,
});

export type ProductIntroductionContent = z.infer<
  typeof productIntroductionContentSchema
>;
