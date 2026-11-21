import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { cache } from "react";

import { getContentPath } from "@/lib/seo/urls";

import { articleSchema, type Article } from "@/content/schemas/article.schema";

import { pageSchema, type Page } from "@/content/schemas/page.schema";

import { locales, type Locale } from "@/i18n/config";

import {
  validateSections,
  validateSectionReferences,
} from "./section-validation";

export type { Locale } from "@/i18n/config";

const RESERVED_SLUGS = new Set(["api", "blog", "_next", "_vercel"]);

export type ContentKind = "page" | "article";

export type ContentEntry =
  | {
      kind: "page";
      locale: Locale;
      data: Page;
    }
  | {
      kind: "article";
      locale: Locale;
      data: Article;
    };

export type PageEntry = Extract<ContentEntry, { kind: "page" }>;

export type ArticleEntry = Extract<ContentEntry, { kind: "article" }>;

const root = path.join(process.cwd(), "src", "content");

function readCollection(
  folder: "pages" | "blog",
  locale: Locale,
): ContentEntry[] {
  const directory = path.join(root, folder, locale);

  let filenames: string[];

  try {
    filenames = readdirSync(directory)
      .filter((name) => name.endsWith(".json"))
      .sort();
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return [];
    }

    throw error;
  }

  return filenames.map((filename) => {
    const filePath = path.join(directory, filename);

    try {
      const raw: unknown = JSON.parse(readFileSync(filePath, "utf8"));

      if (folder === "pages") {
        return {
          kind: "page" as const,
          locale,
          data: pageSchema.parse(raw),
        };
      }

      return {
        kind: "article" as const,
        locale,
        data: articleSchema.parse(raw),
      };
    } catch (error) {
      throw new Error(`Invalid content: ${filePath}`, {
        cause: error,
      });
    }
  });
}

function validateSlug(entry: ContentEntry): void {
  const { id, slug } = entry.data;

  if (entry.kind === "page" && id === "home") {
    if (slug !== "") {
      throw new Error(`Home page must have an empty slug: ${entry.locale}`);
    }

    return;
  }

  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    throw new Error(`Invalid slug "${slug}" in ${entry.locale}/${id}`);
  }

  if (entry.kind === "page") {
    if (id === "blog" && slug !== "blog") {
      throw new Error(`Blog listing must use slug "blog": ${entry.locale}`);
    }

    if (id !== "blog" && RESERVED_SLUGS.has(slug)) {
      throw new Error(`Reserved page slug "${slug}" in ${entry.locale}/${id}`);
    }
  }
}

export const getContentRegistry = cache((): ContentEntry[] => {
  const entries = locales.flatMap((locale) => [
    ...readCollection("pages", locale),
    ...readCollection("blog", locale),
  ]);

  const identities = new Set<string>();
  const paths = new Set<string>();

  for (const entry of entries) {
    validateSections(entry);
    validateSlug(entry);

    const identity = `${entry.kind}:${entry.locale}:${entry.data.id}`;

    if (identities.has(identity)) {
      throw new Error(`Duplicate content identity: ${identity}`);
    }

    identities.add(identity);

    const route = getContentPath(entry);

    if (paths.has(route)) {
      throw new Error(`Duplicate public URL: ${route}`);
    }

    paths.add(route);
  }

  validateSectionReferences(entries);

  return entries;
});

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
  return getContentRegistry().filter(
    (entry) => entry.kind === "page" || entry.data.status === "published",
  );
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
