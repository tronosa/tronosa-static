import { z } from "@/lib/validation/zod";

const textSchema = z.string().trim().min(1);

export const textHeroContentSchema = z
  .object({
    eyebrow: textSchema.optional(),
    title: textSchema,
    description: textSchema.optional(),
    alignment: z.enum(["left", "center"]).default("left"),
  })
  .strict();

export const textHeroSectionSchema = z.object({
  id: textSchema,
  type: z.literal("text-hero"),
  content: textHeroContentSchema,
});
