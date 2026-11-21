import { z } from "zod";

import { articleSectionSchema } from "./section.schema";
import { seoSchema } from "./seo.schema";

export const articleCategorySchema = z.enum([
  "nature",
  "hydration",
  "health",
  "sustainability",
  "company",
  "news",
]);

export const articleAuthorSchema = z.object({
  type: z.enum(["Person", "Organization"]).default("Person"),

  name: z.string().trim().min(1),
  url: z.url().optional(),
  image: z.string().trim().min(1).optional(),
});

export const articleSchema = z
  .object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    slug: z.string().min(1),

    status: z.enum(["draft", "published"]),

    createdAt: z.iso.datetime({ offset: true }),
    modifiedAt: z.iso.datetime({ offset: true }),
    publishedAt: z.iso.datetime({ offset: true }),

    category: articleCategorySchema,

    featured: z.boolean().default(false),

    author: articleAuthorSchema,

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
      sections: z.array(articleSectionSchema),
    }),
  })
  .superRefine((article, ctx) => {
    const createdAt = Date.parse(article.createdAt);
    const publishedAt = Date.parse(article.publishedAt);
    const modifiedAt = Date.parse(article.modifiedAt);

    if (modifiedAt < createdAt) {
      ctx.addIssue({
        code: "custom",
        path: ["modifiedAt"],
        message: "Modification date cannot precede creation date.",
      });
    }

    if (article.status === "published") {
      if (publishedAt < createdAt) {
        ctx.addIssue({
          code: "custom",
          path: ["publishedAt"],
          message: "Publication date cannot precede creation date.",
        });
      }

      if (modifiedAt < publishedAt) {
        ctx.addIssue({
          code: "custom",
          path: ["modifiedAt"],
          message: "Modification date cannot precede publication date.",
        });
      }
    }
  });

export type Article = z.infer<typeof articleSchema>;

export type ArticleAuthor = z.infer<typeof articleAuthorSchema>;

export type ArticleCategory = z.infer<typeof articleCategorySchema>;
