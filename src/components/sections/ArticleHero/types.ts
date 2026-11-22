import type { z } from "zod";

import type { Article } from "@/content/schemas/article.schema";

import type { articleHeroContentSchema } from "./article-hero.schema";

export type ArticleHeroContent = z.infer<typeof articleHeroContentSchema>;

export interface ArticleHeroProps extends ArticleHeroContent {
  article: Article;
}

export interface ArticleHeroBackgroundProps {
  backgroundText: string;
}
