import { getLocalePrefix } from "@/i18n/config";

import type { ContentEntry } from "./content-loader";

export const BLOG_PATH = "/blog";

function encodeSlug(slug: string): string {
  return slug.split("/").map(encodeURIComponent).join("/");
}

export function getPagePath(slug: string): string {
  return slug ? `/${encodeSlug(slug)}` : "/";
}

export function getArticlePath(slug: string): string {
  return `${BLOG_PATH}/${encodeSlug(slug)}`;
}

export function getContentHref(entry: ContentEntry): string {
  if (entry.kind === "article") {
    return getArticlePath(entry.data.slug);
  }

  return getPagePath(entry.data.slug);
}

export function getContentPublicPath(entry: ContentEntry): string {
  const prefix = getLocalePrefix(entry.locale);
  const href = getContentHref(entry);

  if (href === "/") {
    return prefix || "/";
  }

  return `${prefix}${href}`;
}
