import type { getRelatedPosts } from "@/lib/content/registry";

export type RelatedPost = ReturnType<typeof getRelatedPosts>[number];

export type RelatedPostsProps = {
  slug: string;
  limit?: number;
};

export type RelatedPostsItemProps = {
  post: RelatedPost["data"];
  index: number;
  categoryLabel: string;
  formattedDate: string;
};
