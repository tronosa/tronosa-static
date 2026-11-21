import type { Article, ArticleAuthor } from "@/content/schemas/article.schema";

export type ArticleAuthorData = ArticleAuthor;

export type ArticleAuthorProps = {
  author: ArticleAuthorData;
  locale: string;
  label: string;
};

export type ArticleMetadataProps = Pick<
  Article,
  "author" | "publishedAt" | "modifiedAt"
> & {
  readingTime: number;
};
