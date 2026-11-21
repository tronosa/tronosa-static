import type { CSSProperties } from "react";

import { getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { RichTextInline } from "@/components/ui/RichText/RichTextInline";
import { Section } from "@/components/ui/Section";

import {
  articleHeroCategoryVariants,
  articleHeroContentVariants,
  articleHeroDescriptionVariants,
  articleHeroHeaderVariants,
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
  const t = await getTranslations("Blog");

  const appearanceStyle = {
    "--article-background": appearance.backgroundColor,
    "--article-accent": appearance.accentColor,
  } as CSSProperties;

  const headingId = `${article.id}-heading`;

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
          </header>
        </div>
      </Container>
    </Section>
  );
}
