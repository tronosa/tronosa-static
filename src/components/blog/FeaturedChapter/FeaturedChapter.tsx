import { getFormatter, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";

import type { BlogPost } from "../blog-listing.types";

import { FeaturedChapterArticle } from "./FeaturedChapterArticle";

import {
  featuredChapterVariants,
  featuredChapterHeaderVariants,
  featuredChapterEyebrowVariants,
  featuredChapterAccentVariants,
  featuredChapterLabelVariants,
} from "./featured-chapter.variants";
import { Section } from "@/components/ui/Section";

type FeaturedChapterProps = {
  article: BlogPost;
};

export async function FeaturedChapter({ article }: FeaturedChapterProps) {
  const t = await getTranslations("Blog");
  const format = await getFormatter();

  const journalLabel = t("index.opening.eyebrow");

  return (
    <Section
      aria-labelledby="featured-chapter-heading"
      className={featuredChapterVariants()}
    >
      <Container size="wide">
        <header className={featuredChapterHeaderVariants()}>
          <h2
            id="featured-chapter-heading"
            className={featuredChapterEyebrowVariants()}
          >
            <span
              aria-hidden="true"
              className={featuredChapterAccentVariants()}
            />

            {t("index.featured.eyebrow")}
          </h2>

          <span className={featuredChapterLabelVariants()}>{journalLabel}</span>
        </header>

        <FeaturedChapterArticle
          article={article}
          journalLabel={journalLabel}
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
      </Container>
    </Section>
  );
}
