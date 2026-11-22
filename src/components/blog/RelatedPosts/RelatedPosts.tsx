import { hasLocale } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";

import { routing } from "@/i18n/routing";
import { getRelatedPosts } from "@/lib/content/registry";

import { RelatedPostsItem } from "./RelatedPostsItem";

import {
  relatedPostsVariants,
  relatedPostsHeaderVariants,
  relatedPostsEyebrowVariants,
  relatedPostsAccentVariants,
  relatedPostsTitleVariants,
  relatedPostsListVariants,
} from "./related-posts.variants";

import type { RelatedPostsProps } from "./types";

export async function RelatedPosts({ slug, limit = 3 }: RelatedPostsProps) {
  const locale = await getLocale();

  if (!hasLocale(routing.locales, locale)) {
    return null;
  }

  const posts = getRelatedPosts(locale, slug, limit);

  if (posts.length === 0) {
    return null;
  }

  const t = await getTranslations({
    locale,
    namespace: "Blog",
  });

  const formatter = new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Belgrade",
  });

  return (
    <Section
      spacingType="padding"
      className={relatedPostsVariants()}
      aria-labelledby="related-posts-heading"
    >
      <Container size="wide">
        <header className={relatedPostsHeaderVariants()}>
          <p className={relatedPostsEyebrowVariants()}>
            <span aria-hidden="true" className={relatedPostsAccentVariants()} />

            {t("related.eyebrow")}
          </p>

          <h2
            id="related-posts-heading"
            className={relatedPostsTitleVariants()}
          >
            {t("related.title")}
          </h2>
        </header>

        <ul className={relatedPostsListVariants()}>
          {posts.map(({ data: post }, index) => (
            <RelatedPostsItem
              key={post.id}
              post={post}
              index={index}
              categoryLabel={t(`categories.${post.category}`)}
              formattedDate={formatter.format(new Date(post.publishedAt))}
            />
          ))}
        </ul>
      </Container>
    </Section>
  );
}
