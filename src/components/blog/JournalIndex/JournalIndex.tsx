import { getFormatter, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";

import type { BlogPost } from "../blog-listing.types";

import { JournalIndexItem } from "./JournalIndexItem";

import {
  journalIndexVariants,
  journalIndexHeaderVariants,
  journalIndexEyebrowVariants,
  journalIndexAccentVariants,
  journalIndexTitleVariants,
  journalIndexDescriptionVariants,
  journalIndexListVariants,
} from "./journal-index.variants";
import { Section } from "@/components/ui/Section";

type JournalIndexProps = {
  articles: readonly BlogPost[];
  startIndex?: number;
};

export async function JournalIndex({
  articles,
  startIndex = 0,
}: JournalIndexProps) {
  if (articles.length === 0) {
    return null;
  }

  const t = await getTranslations("Blog");
  const format = await getFormatter();

  return (
    <Section
      aria-labelledby="journal-index-heading"
      className={journalIndexVariants()}
    >
      <Container size="wide">
        <header className={journalIndexHeaderVariants()}>
          <p className={journalIndexEyebrowVariants()}>
            <span aria-hidden="true" className={journalIndexAccentVariants()} />

            {t("index.archive.eyebrow")}
          </p>

          <h2
            id="journal-index-heading"
            className={journalIndexTitleVariants()}
          >
            {t("index.archive.title")}
          </h2>

          <p className={journalIndexDescriptionVariants()}>
            {t("index.archive.description")}
          </p>
        </header>

        <ul className={journalIndexListVariants()}>
          {articles.map((article, index) => (
            <JournalIndexItem
              key={article.id}
              article={article}
              index={startIndex + index}
              labels={{
                category: t(`categories.${article.category}`),
                date: format.dateTime(new Date(article.publishedAt), {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "Europe/Belgrade",
                }),
              }}
            />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
