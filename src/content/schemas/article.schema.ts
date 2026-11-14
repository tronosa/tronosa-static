import { z } from "zod";

import { sectionSchema } from "./section.schema";
import { seoSchema } from "./seo.schema";

export const articleSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  slug: z.string().min(1),

  status: z.enum(["draft", "published"]),

  createdAt: z.iso.datetime({ offset: true }),
  modifiedAt: z.iso.datetime({ offset: true }),
  publishedAt: z.iso.datetime({ offset: true }),

  author: z.object({
    name: z.string().min(1),
    url: z.url().optional(),
  }),

  preview: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    image: z
      .object({
        src: z.string().min(1),
        alt: z.string().min(1),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .optional(),
  }),

  seo: seoSchema,

  content: z.object({
    sections: z.array(sectionSchema),
  }),
});

export type Article = z.infer<typeof articleSchema>;
