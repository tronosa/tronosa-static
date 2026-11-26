import "server-only";

import { cache } from "react";

import type { Locale } from "@/i18n/config";

import { getPublishedContent, type ContentEntry } from "./registry";

import { getContentHref } from "./content-paths";

function createRouteKey(locale: Locale, pathname: string): string {
  return `${locale}:${pathname}`;
}

const getContentRouteIndex = cache(() => {
  const index = new Map<string, ContentEntry>();

  for (const entry of getPublishedContent()) {
    const key = createRouteKey(entry.locale, getContentHref(entry));

    index.set(key, entry);
  }

  return index;
});

export function resolveContentRoute(
  locale: Locale,
  segments: readonly string[],
): ContentEntry | undefined {
  const pathname = `/${segments.join("/")}`;

  return getContentRouteIndex().get(createRouteKey(locale, pathname));
}

export function getContentStaticParams() {
  return getPublishedContent()
    .filter((entry) => entry.kind !== "page" || entry.data.id !== "home")
    .map((entry) => ({
      locale: entry.locale,
      slug: getContentHref(entry).slice(1).split("/"),
    }));
}
