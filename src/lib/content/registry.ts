import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";

import {
  filterPublishedContent,
  loadContentRegistry,
  type ArticleEntry,
  type ContentEntry,
  type ContentKind,
} from "./content-loader";

export type { Locale } from "@/i18n/config";

export type {
  ContentKind,
  ContentEntry,
  PageEntry,
  ArticleEntry,
} from "./content-loader";

export const getContentRegistry = cache(loadContentRegistry);

export function getContentById(
  kind: ContentKind,
  locale: Locale,
  id: string,
): ContentEntry | undefined {
  return getContentRegistry().find(
    (entry) =>
      entry.kind === kind && entry.locale === locale && entry.data.id === id,
  );
}

export function getContentBySlug(
  kind: ContentKind,
  locale: Locale,
  slug: string,
): ContentEntry | undefined {
  return getContentRegistry().find(
    (entry) =>
      entry.kind === kind &&
      entry.locale === locale &&
      entry.data.slug === slug,
  );
}

export function getPublishedContent(): ContentEntry[] {
  return filterPublishedContent(getContentRegistry());
}

export function getPublishedPosts(locale?: Locale): ArticleEntry[] {
  return getContentRegistry()
    .filter(
      (entry): entry is ArticleEntry =>
        entry.kind === "article" &&
        entry.data.status === "published" &&
        (locale === undefined || entry.locale === locale),
    )
    .sort(
      (a, b) =>
        Date.parse(b.data.publishedAt) - Date.parse(a.data.publishedAt) ||
        a.data.id.localeCompare(b.data.id),
    );
}

export function getPublishedPostBySlug(
  locale: Locale,
  slug: string,
): ArticleEntry | undefined {
  const entry = getContentBySlug("article", locale, slug);

  if (entry?.kind !== "article" || entry.data.status !== "published") {
    return undefined;
  }

  return entry;
}

export function getFeaturedPost(locale: Locale): ArticleEntry | undefined {
  const posts = getPublishedPosts(locale);

  return posts.find(({ data }) => data.featured) ?? posts[0];
}

export function getRelatedPosts(
  locale: Locale,
  slug: string,
  limit = 3,
): ArticleEntry[] {
  const posts = getPublishedPosts(locale);

  const current = posts.find(({ data }) => data.slug === slug);

  if (!current) {
    return [];
  }

  return posts
    .filter(({ data }) => data.slug !== slug)
    .sort(
      (a, b) =>
        Number(b.data.category === current.data.category) -
        Number(a.data.category === current.data.category),
    )
    .slice(0, limit);
}
