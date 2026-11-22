import { z } from "@/lib/validation/zod";

const sectionIdSchema = z.string().regex(/^[a-z0-9-]+$/);

export const journalOpeningSectionSchema = z.strictObject({
  id: sectionIdSchema,
  type: z.literal("journal-opening"),
});

export const featuredChapterSectionSchema = z.strictObject({
  id: sectionIdSchema,
  type: z.literal("featured-chapter"),
});

export const storyExplorerSectionSchema = z.strictObject({
  id: sectionIdSchema,
  type: z.literal("story-explorer"),
});

export const journalIndexSectionSchema = z.strictObject({
  id: sectionIdSchema,
  type: z.literal("journal-index"),
});

export const sourceClosingSectionSchema = z.strictObject({
  id: sectionIdSchema,
  type: z.literal("source-closing"),

  content: z.strictObject({
    pageId: z.string().regex(/^[a-z0-9-]+$/),
  }),
});

export const blogSpecificSectionSchemas = [
  journalOpeningSectionSchema,
  featuredChapterSectionSchema,
  storyExplorerSectionSchema,
  journalIndexSectionSchema,
  sourceClosingSectionSchema,
] as const;

export const blogSpecificSectionSchema = z.discriminatedUnion(
  "type",
  blogSpecificSectionSchemas,
);

export type BlogSpecificSection = z.infer<typeof blogSpecificSectionSchema>;

export type BlogSpecificSectionType = BlogSpecificSection["type"];
