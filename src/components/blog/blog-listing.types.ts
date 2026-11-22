import type { getPublishedContent } from "@/lib/content/registry";

type PublishedContentEntry = ReturnType<typeof getPublishedContent>[number];

export type BlogPostEntry = Extract<PublishedContentEntry, { kind: "article" }>;

export type BlogPost = BlogPostEntry["data"];

export type BlogCategory = BlogPost["category"];

export type BlogStoryLabels = {
  category: string;
  date: string;
  read: string;
};
