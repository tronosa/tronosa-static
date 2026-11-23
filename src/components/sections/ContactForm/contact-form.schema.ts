import { z } from "@/lib/validation/zod";

export const contactFormContentSchema = z.object({
  eyebrow: z.string().trim().min(1).optional(),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

export const contactFormSectionSchema = z.object({
  id: z.string().min(1),
  type: z.literal("contact-form"),
  content: contactFormContentSchema,
});
