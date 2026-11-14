import "server-only";

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

import { cache } from "react";

import { getContentPath } from "@/lib/seo/urls";

import { articleSchema } from "@/content/schemas/article.schema";
import { pageSchema } from "@/content/schemas/page.schema";
import { locales, type Locale } from "@/i18n/config";
export type { Locale } from "@/i18n/config";

import type { Article } from "@/content/schemas/article.schema";
import type { Page } from "@/content/schemas/page.schema";

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

function validateSections(entry: ContentEntry): void {
  const ids = new Set<string>();

  for (const section of entry.data.content.sections) {
    if (ids.has(section.id)) {
      throw new Error(
        `Duplicate section ID "${section.id}" in ` +
          `${entry.locale}/${entry.data.id}`,
      );
    }

    ids.add(section.id);
  }
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

    if (
      entry.kind === "page" &&
      entry.data.id === "home" &&
      entry.data.slug !== ""
    ) {
      throw new Error("Home page must have an empty slug");
    }
  }

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
