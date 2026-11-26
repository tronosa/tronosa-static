import { getLocalePrefix, type Locale } from "@/i18n/config";

import { getBlogPath } from "./content-route.config";

import type { ContentEntry } from "./content-loader";

function encodeSlug(slug: string): string {
  return slug.split("/").map(encodeURIComponent).join("/");
}

export function getPagePath(slug: string): string {
  return slug ? `/${encodeSlug(slug)}` : "/";
}

export function getArticlePath(locale: Locale, slug: string): string {
  return `${getBlogPath(locale)}/${encodeSlug(slug)}`;
}

export function getContentHref(entry: ContentEntry): string {
  if (entry.kind === "article") {
    return getArticlePath(entry.locale, entry.data.slug);
  }

  return getPagePath(entry.data.slug);
}

export function getLocalizedPath(locale: Locale, pathname: string): string {
  const prefix = getLocalePrefix(locale);

  return pathname === "/" ? prefix || "/" : `${prefix}${pathname}`;
}

export function getContentPublicPath(entry: ContentEntry): string {
  return getLocalizedPath(entry.locale, getContentHref(entry));
}
