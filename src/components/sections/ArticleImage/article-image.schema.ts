import { z } from "zod";

export const articleImageContentSchema = z.object({
  src: z
    .string()
    .trim()
    .min(1)
    .refine(
      (value) => value.startsWith("/") || value.startsWith("https://"),
      "Image source must be a local path or HTTPS URL",
    ),
  alt: z.string().trim().min(1),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  caption: z.string().trim().min(1).optional(),
  layout: z.enum(["reading", "medium", "wide"]).default("wide"),
  priority: z.boolean().default(false),
});

export const articleImageSchema = z.object({
  id: z.string().trim().min(1),
  type: z.literal("article-image"),
  content: articleImageContentSchema,
});
