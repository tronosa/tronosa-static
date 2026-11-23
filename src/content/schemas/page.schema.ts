import { z } from "@/lib/validation/zod";

import { standardPageSectionSchema, blogSectionSchema } from "./section.schema";

import { seoSchema } from "./seo.schema";

const basePageSchema = z.object({
  slug: z.string(),

  modifiedAt: z.iso.datetime({ offset: true }).optional(),

  seo: seoSchema,
});

export const standardPageSchema = basePageSchema.extend({
  id: z
    .string()
    .regex(/^[a-z0-9-]+$/)
    .refine((id) => id !== "blog", {
      message: "Blog listing must use the blog page schema.",
    }),

  content: z.object({
    sections: z.array(standardPageSectionSchema),
  }),
});

export const blogPageSchema = basePageSchema.extend({
  id: z.literal("blog"),
  slug: z.literal("blog"),

  content: z.object({
    sections: z.array(blogSectionSchema),
  }),
});

export const pageSchema = z.union([blogPageSchema, standardPageSchema]);

export type StandardPage = z.infer<typeof standardPageSchema>;

export type BlogPage = z.infer<typeof blogPageSchema>;

export type Page = z.infer<typeof pageSchema>;
