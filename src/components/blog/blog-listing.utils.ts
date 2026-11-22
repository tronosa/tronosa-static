import type { BlogPost, BlogPostEntry } from "./blog-listing.types";

const EXPLORER_LIMIT = 4;

export type BlogListingComposition = {
  featured: BlogPost | null;
  explorer: BlogPost[];
  archive: BlogPost[];
};

type BlogListingOptions = {
  featured: boolean;
  explorer: boolean;
  archive: boolean;
};

const DEFAULT_OPTIONS: BlogListingOptions = {
  featured: true,
  explorer: true,
  archive: true,
};

/**
 * Composes the blog listing from published articles.
 *
 * Entries must be ordered by publication date descending,
 * with article ID as the deterministic tie-breaker.
 *
 * Use getPublishedPosts() to obtain the ordered entries.
 */
export function createBlogListingComposition(
  sortedEntries: readonly BlogPostEntry[],
  options: BlogListingOptions = DEFAULT_OPTIONS,
): BlogListingComposition {
  const featuredEntries = sortedEntries.filter(({ data }) => data.featured);

  const featuredCandidate = featuredEntries[0] ?? sortedEntries[0] ?? null;

  if (featuredEntries.length > 1) {
    console.warn("[BlogListing] Multiple featured articles detected.", {
      locale: featuredCandidate?.locale,
      selectedArticleId: featuredCandidate?.data.id,
      featuredArticleIds: featuredEntries.map(({ data }) => data.id),
    });
  }

  const featured = options.featured ? featuredCandidate : null;

  const remaining = sortedEntries
    .filter(({ data }) => data.id !== featured?.data.id)
    .map(({ data }) => data);

  const explorer = options.explorer ? remaining.slice(0, EXPLORER_LIMIT) : [];

  const archive = options.archive ? remaining.slice(explorer.length) : [];

  return {
    featured: featured?.data ?? null,
    explorer,
    archive,
  };
}
