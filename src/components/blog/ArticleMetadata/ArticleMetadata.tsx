import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";

import { ArticleAuthor } from "./ArticleAuthor";

import {
  articleMetadataVariants,
  articleMetadataLayoutVariants,
  articleMetadataDetailsVariants,
  articleMetadataItemVariants,
  articleMetadataLabelVariants,
  articleMetadataValueVariants,
  articleMetadataReadingValueVariants,
  articleMetadataReadingIconVariants,
} from "./article-metadata.variants";

import { hasArticleBeenUpdated } from "./article-metadata.utils";

import type { ArticleMetadataProps } from "./types";

export async function ArticleMetadata({
  author,
  publishedAt,
  modifiedAt,
  readingTime,
}: ArticleMetadataProps) {
  const [locale, t] = await Promise.all([
    getLocale(),
    getTranslations("Blog.metadata"),
  ]);

  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Belgrade",
  });

  const isUpdated = hasArticleBeenUpdated(publishedAt, modifiedAt);

  return (
    <div
      role="group"
      aria-label={t("label")}
      className={articleMetadataVariants()}
    >
      <Container size="wide">
        <div className={articleMetadataLayoutVariants()}>
          <ArticleAuthor author={author} locale={locale} label={t("author")} />

          <dl className={articleMetadataDetailsVariants()}>
            <div className={articleMetadataItemVariants()}>
              <dt className={articleMetadataLabelVariants()}>
                {t("published")}
              </dt>

              <dd className={articleMetadataValueVariants()}>
                <time dateTime={publishedAt}>
                  {formatter.format(new Date(publishedAt))}
                </time>
              </dd>
            </div>

            {isUpdated && (
              <div className={articleMetadataItemVariants()}>
                <dt className={articleMetadataLabelVariants()}>
                  {t("updated")}
                </dt>

                <dd className={articleMetadataValueVariants()}>
                  <time dateTime={modifiedAt}>
                    {formatter.format(new Date(modifiedAt))}
                  </time>
                </dd>
              </div>
            )}

            <div className={articleMetadataItemVariants()}>
              <dt className={articleMetadataLabelVariants()}>
                {t("readingTime")}
              </dt>

              <dd className={articleMetadataValueVariants()}>
                <span className={articleMetadataReadingValueVariants()}>
                  <svg
                    aria-hidden="true"
                    focusable="false"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={articleMetadataReadingIconVariants()}
                  >
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 7v5l3 2" />
                  </svg>

                  <span>
                    {t("readingDuration", {
                      minutes: readingTime,
                    })}
                  </span>
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </Container>
    </div>
  );
}
