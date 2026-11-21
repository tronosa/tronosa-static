import type { CSSProperties } from "react";

import { hasLocale } from "next-intl";
import { getFormatter, getLocale, getTranslations } from "next-intl/server";

import { ShareArticle } from "@/components/blog/ShareArticle";
import { Container } from "@/components/ui/Container";
import { RichTextInline } from "@/components/ui/RichText/RichTextInline";
import { Section } from "@/components/ui/Section";

import { routing } from "@/i18n/routing";
import { createSeoMetadata } from "@/lib/seo/metadata";

import {
  articleHeroCategoryVariants,
  articleHeroContentVariants,
  articleHeroDescriptionVariants,
  articleHeroHeaderVariants,
  articleHeroMetaDetailsVariants,
  articleHeroMetaSeparatorVariants,
  articleHeroMetaVariants,
  articleHeroTextVariants,
  articleHeroTitleVariants,
  articleHeroVariants,
} from "./article-hero.variants";

import { ArticleHeroBackground } from "./ArticleHeroBackground";

import type { ArticleHeroProps } from "./types";

export async function ArticleHero({
  article,
  title,
  backgroundText,
  appearance,
}: ArticleHeroProps) {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) {
    throw new Error(`Unsupported locale: ${locale}`);
  }

  const [t, format, shareT] = await Promise.all([
    getTranslations("Blog"),
    getFormatter(),
    getTranslations("Blog.share"),
  ]);

  const metadata = createSeoMetadata({
    kind: "article",
    locale,
    data: article,
  });

  const canonical = metadata.alternates?.canonical;

  if (!canonical) {
    throw new Error(`Missing canonical URL for article "${article.id}".`);
  }

  const shareUrl = String(canonical);
  const parsedUrl = URL.parse(shareUrl);

  if (!parsedUrl || !["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error(`Invalid share URL for article "${article.id}".`);
  }

  const appearanceStyle = {
    "--article-background": appearance.backgroundColor,
    "--article-accent": appearance.accentColor,
  } as CSSProperties;

  const headingId = `${article.id}-heading`;

  const formattedDate = format.dateTime(new Date(article.publishedAt), {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Belgrade",
  });

  return (
    <Section
      spacingType="padding"
      aria-labelledby={headingId}
      data-article-hero="true"
      style={appearanceStyle}
      className={articleHeroVariants()}
    >
      <ArticleHeroBackground backgroundText={backgroundText} />

      <Container size="wide">
        <div className={articleHeroContentVariants()}>
          <header className={articleHeroHeaderVariants()}>
            <div className={articleHeroTextVariants()}>
              <p className={articleHeroCategoryVariants()}>
                {t(`categories.${article.category}`)}
              </p>

              <h1 id={headingId} className={articleHeroTitleVariants()}>
                {title ? (
                  <RichTextInline content={title} />
                ) : (
                  article.preview.title
                )}
              </h1>

              <p className={articleHeroDescriptionVariants()}>
                {article.preview.description}
              </p>
            </div>

            <div className={articleHeroMetaVariants()}>
              <div className={articleHeroMetaDetailsVariants()}>
                <span>{article.author.name}</span>

                <span
                  aria-hidden="true"
                  className={articleHeroMetaSeparatorVariants()}
                />

                <time dateTime={article.publishedAt}>{formattedDate}</time>
              </div>

              <ShareArticle
                url={shareUrl}
                title={article.preview.title}
                labels={{
                  heading: shareT("heading"),
                  share: shareT("share"),
                  copyLink: shareT("copyLink"),
                  copied: shareT("copied"),
                  copyFailed: shareT("copyFailed"),
                  linkedin: shareT("linkedin"),
                  facebook: shareT("facebook"),
                  more: shareT("more"),
                }}
              />
            </div>
          </header>
        </div>
      </Container>
    </Section>
  );
}
