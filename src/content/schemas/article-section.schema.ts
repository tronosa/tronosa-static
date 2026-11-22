import { z } from "@/lib/validation/zod";

import { articleHeroSchema } from "@/components/sections/ArticleHero/article-hero.schema";
import { articleImageSchema } from "@/components/sections/ArticleImage/article-image.schema";

const sectionIdSchema = z.string().regex(/^[a-z0-9-]+$/);

export const articleMetadataSectionSchema = z.strictObject({
  id: sectionIdSchema,
  type: z.literal("article-metadata"),
});

export const relatedPostsSectionSchema = z.strictObject({
  id: sectionIdSchema,
  type: z.literal("related-posts"),

  content: z
    .strictObject({
      limit: z.number().int().min(1).max(10).default(3),
    })
    .default({
      limit: 3,
    }),
});

export const articleSpecificSectionSchemas = [
  articleHeroSchema,
  articleImageSchema,
  articleMetadataSectionSchema,
  relatedPostsSectionSchema,
] as const;

export const articleSpecificSectionSchema = z.discriminatedUnion(
  "type",
  articleSpecificSectionSchemas,
);

export type ArticleSpecificSection = z.infer<
  typeof articleSpecificSectionSchema
>;

export type ArticleSpecificSectionType = ArticleSpecificSection["type"];
