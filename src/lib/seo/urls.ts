import { getLocalePrefix } from "@/i18n/config";
import type { Locale } from "@/i18n/config";
import type { ContentEntry } from "@/lib/content/registry";

import { absoluteUrl } from "./config";

function encodeSlug(slug: string): string {
  return slug.split("/").map(encodeURIComponent).join("/");
}

export function getContentPath(entry: ContentEntry): string {
  const prefix = getLocalePrefix(entry.locale);
  const slug = encodeSlug(entry.data.slug);

  if (entry.kind === "article") {
    return `${prefix}/blog/${slug}`;
  }

  if (entry.data.id === "home") {
    return prefix || "/";
  }

  return `${prefix}/${slug}`;
}

export function getContentUrl(entry: ContentEntry): string {
  return absoluteUrl(getContentPath(entry));
}

export function getLocaleHomeUrl(locale: Locale): string {
  return absoluteUrl(getLocalePrefix(locale) || "/");
}

export function getBlogUrl(locale: Locale): string {
  return absoluteUrl(`${getLocalePrefix(locale)}/blog`);
}
