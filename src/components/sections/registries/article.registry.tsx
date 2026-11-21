import "server-only";

import type { ArticleSpecificSection } from "@/content/schemas/article-section.schema";

import { requireArticleContext } from "../section-context";

import type { SectionRegistry } from "./types";

export const articleSectionRegistry = {
  "article-hero": async (section, context) => {
    const { entry } = requireArticleContext(context);

    const { ArticleHero } = await import("../ArticleHero");

    return <ArticleHero {...section.content} article={entry.data} />;
  },

  "article-image": async (section, context) => {
    requireArticleContext(context);

    const { ArticleImage } = await import("../ArticleImage");

    return <ArticleImage {...section.content} />;
  },

  "article-metadata": async (_, context) => {
    const { entry, readingTime } = requireArticleContext(context);

    const { author, publishedAt, modifiedAt } = entry.data;

    const { ArticleMetadata } =
      await import("@/components/blog/ArticleMetadata");

    return (
      <ArticleMetadata
        author={author}
        publishedAt={publishedAt}
        modifiedAt={modifiedAt}
        readingTime={readingTime}
      />
    );
  },

  "share-article": async (_, context) => {
    const { entry } = requireArticleContext(context);

    const { ShareArticleSection } =
      await import("@/components/blog/ShareArticle/ShareArticleSection");

    return <ShareArticleSection entry={entry} />;
  },

  "related-posts": async (section, context) => {
    const { entry } = requireArticleContext(context);

    const { RelatedPosts } = await import("@/components/blog/RelatedPosts");

    return (
      <RelatedPosts slug={entry.data.slug} limit={section.content.limit} />
    );
  },
} satisfies SectionRegistry<ArticleSpecificSection>;
