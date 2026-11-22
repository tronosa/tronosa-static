import "server-only";

import type { Section, SectionType } from "@/content/schemas/section.schema";

import type {
  ArticleEntry,
  PageEntry,
  ContentEntry,
} from "@/lib/content/registry";

import { getPublishedPosts } from "@/lib/content/registry";

import { calculateArticleReadingTime } from "@/lib/content/article-reading-time";

import {
  createBlogListingComposition,
  type BlogListingComposition,
} from "@/components/blog/blog-listing.utils";

type ListingSectionType =
  "featured-chapter" | "story-explorer" | "journal-index";

export type StandardSectionContext = {
  kind: "standard";
  entry?: PageEntry;
};

export type BlogSectionContext = {
  kind: "blog";
  entry: PageEntry;
  composition: BlogListingComposition;
  firstListingSection: ListingSectionType | undefined;
  hasArticles: boolean;
};

export type ArticleSectionContext = {
  kind: "article";
  entry: ArticleEntry;
  readingTime: number;
};

export type SectionRenderContext =
  StandardSectionContext | BlogSectionContext | ArticleSectionContext;

const LISTING_SECTION_TYPES = new Set<SectionType>([
  "featured-chapter",
  "story-explorer",
  "journal-index",
]);

function isListingSection(type: SectionType): type is ListingSectionType {
  return LISTING_SECTION_TYPES.has(type);
}

export function createSectionContext(
  sections: readonly Section[],
  entry?: ContentEntry,
): SectionRenderContext {
  if (!entry) {
    return {
      kind: "standard",
    };
  }

  if (entry.kind === "article") {
    const requiresReadingTime = sections.some(
      ({ type }) => type === "article-metadata",
    );

    return {
      kind: "article",
      entry,

      readingTime: requiresReadingTime
        ? calculateArticleReadingTime(entry.data, entry.locale).minutes
        : 0,
    };
  }

  if (entry.data.id === "blog") {
    const types = new Set(sections.map(({ type }) => type));

    const posts = getPublishedPosts(entry.locale);

    const firstListingSection = sections
      .map(({ type }) => type)
      .find(isListingSection);

    return {
      kind: "blog",
      entry,

      composition: createBlogListingComposition(posts, {
        featured: types.has("featured-chapter"),
        explorer: types.has("story-explorer"),
        archive: types.has("journal-index"),
      }),

      firstListingSection,

      hasArticles: posts.length > 0,
    };
  }

  return {
    kind: "standard",
    entry,
  };
}

export function requireBlogContext(
  context: SectionRenderContext,
): BlogSectionContext {
  if (context.kind !== "blog") {
    throw new Error(
      "[SectionRenderer] Blog section requires a blog listing context.",
    );
  }

  return context;
}

export function requireArticleContext(
  context: SectionRenderContext,
): ArticleSectionContext {
  if (context.kind !== "article") {
    throw new Error(
      "[SectionRenderer] Article section requires an article context.",
    );
  }

  return context;
}
