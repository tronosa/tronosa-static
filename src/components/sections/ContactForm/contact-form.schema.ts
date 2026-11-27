import { z } from "@/lib/validation/zod";

const textSchema = z.string().trim().min(1);

export const contactFormLayoutSchema = z.enum(["default", "editorial"]);

export const contactFormTopicSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    label: textSchema,
  })
  .strict();

export const contactFormTopicsSchema = z
  .array(contactFormTopicSchema)
  .min(1)
  .max(6)
  .refine(
    (topics) => new Set(topics.map((topic) => topic.id)).size === topics.length,
    {
      message: "Contact form topic IDs must be unique.",
    },
  );

export const contactFormContentSchema = z
  .object({
    eyebrow: textSchema.optional(),

    title: textSchema,

    description: textSchema,

    layout: contactFormLayoutSchema.optional(),

    topics: contactFormTopicsSchema.optional(),

    decoration: z.boolean().optional(),
  })
  .strict();

export const contactFormSectionSchema = z.object({
  id: textSchema,

  type: z.literal("contact-form"),

  content: contactFormContentSchema,
});
