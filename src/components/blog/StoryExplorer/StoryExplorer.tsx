import { getFormatter, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";

import type { BlogPost } from "../blog-listing.types";

import { StoryExplorerClient } from "./StoryExplorerClient";
import { StoryExplorerItem } from "./StoryExplorerItem";

import {
  storyExplorerVariants,
  storyExplorerHeaderVariants,
  storyExplorerEyebrowVariants,
  storyExplorerAccentVariants,
  storyExplorerTitleVariants,
  storyExplorerDescriptionVariants,
  storyExplorerListVariants,
} from "./story-explorer.variants";

import "./story-explorer.css";
import { Section } from "@/components/ui/Section";

type StoryExplorerProps = {
  articles: readonly BlogPost[];
};

export async function StoryExplorer({ articles }: StoryExplorerProps) {
  if (articles.length === 0) {
    return null;
  }

  const t = await getTranslations("Blog");
  const format = await getFormatter();

  const mediaEntries = articles.map((article) => ({
    id: article.id,
    title: article.preview.title,
    image: article.preview.image,
  }));

  return (
    <Section
      aria-labelledby="story-explorer-heading"
      className={storyExplorerVariants()}
    >
      <Container size="wide">
        <header className={storyExplorerHeaderVariants()}>
          <p className={storyExplorerEyebrowVariants()}>
            <span
              aria-hidden="true"
              className={storyExplorerAccentVariants()}
            />

            {t("index.explorer.eyebrow")}
          </p>

          <h2
            id="story-explorer-heading"
            className={storyExplorerTitleVariants()}
          >
            {t("index.explorer.title")}
          </h2>

          <p className={storyExplorerDescriptionVariants()}>
            {t("index.explorer.description")}
          </p>
        </header>

        <StoryExplorerClient
          key={articles.map(({ id }) => id).join(":")}
          stories={mediaEntries}
          mediaLabel={t("index.explorer.mediaLabel")}
        >
          <ul className={storyExplorerListVariants()}>
            {articles.map((article, index) => (
              <StoryExplorerItem
                key={article.id}
                index={index}
                article={article}
                labels={{
                  category: t(`categories.${article.category}`),
                  date: format.dateTime(new Date(article.publishedAt), {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "Europe/Belgrade",
                  }),
                  read: t("index.readArticle"),
                }}
              />
            ))}
          </ul>
        </StoryExplorerClient>
      </Container>
    </Section>
  );
}
