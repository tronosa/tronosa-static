import "server-only";

import type { ReactNode } from "react";

import type { BlogSpecificSection } from "@/content/schemas/blog-section.schema";

import {
  requireBlogContext,
  type BlogSectionContext,
} from "../section-context";

import type { SectionRegistry } from "./types";

type ListingSectionType =
  "featured-chapter" | "story-explorer" | "journal-index";

async function renderJournalEmpty(
  type: ListingSectionType,
  context: BlogSectionContext,
): Promise<ReactNode> {
  if (context.firstListingSection !== type) {
    return null;
  }

  const { JournalEmpty } = await import("@/components/blog/JournalEmpty");

  return <JournalEmpty />;
}

export const blogSectionRegistry = {
  "journal-opening": async (_, context) => {
    requireBlogContext(context);

    const { JournalOpening } = await import("@/components/blog/JournalOpening");

    return <JournalOpening />;
  },

  "featured-chapter": async (_, context) => {
    const blog = requireBlogContext(context);

    if (!blog.hasArticles) {
      return renderJournalEmpty("featured-chapter", blog);
    }

    const { featured } = blog.composition;

    if (!featured) {
      return null;
    }

    const { FeaturedChapter } =
      await import("@/components/blog/FeaturedChapter");

    return <FeaturedChapter article={featured} />;
  },

  "story-explorer": async (_, context) => {
    const blog = requireBlogContext(context);

    if (!blog.hasArticles) {
      return renderJournalEmpty("story-explorer", blog);
    }

    const { explorer } = blog.composition;

    if (explorer.length === 0) {
      return null;
    }

    const { StoryExplorer } = await import("@/components/blog/StoryExplorer");

    return <StoryExplorer articles={explorer} />;
  },

  "journal-index": async (_, context) => {
    const blog = requireBlogContext(context);

    if (!blog.hasArticles) {
      return renderJournalEmpty("journal-index", blog);
    }

    const { explorer, archive } = blog.composition;

    if (archive.length === 0) {
      return null;
    }

    const { JournalIndex } = await import("@/components/blog/JournalIndex");

    return <JournalIndex articles={archive} startIndex={explorer.length} />;
  },

  "source-closing": async (section, context) => {
    requireBlogContext(context);

    const { SourceClosing } = await import("@/components/blog/SourceClosing");

    return <SourceClosing pageId={section.content.pageId} />;
  },
} satisfies SectionRegistry<BlogSpecificSection>;
