import "server-only";

import type { ContentEntry } from "@/lib/content/registry";

import { getEnvironment } from "@/lib/environment";

import { getCanonicalUrl, getContentUrl } from "./urls";

export function isPublished(entry: ContentEntry): boolean {
  return entry.data.status === "published";
}

export function isSelfCanonical(entry: ContentEntry): boolean {
  return getCanonicalUrl(entry) === getContentUrl(entry);
}

export function isContentIndexable(entry: ContentEntry): boolean {
  return isPublished(entry) && entry.data.seo.index;
}

export function isSearchIndexingAllowed(entry: ContentEntry): boolean {
  return getEnvironment().isIndexable && isContentIndexable(entry);
}

export function isCanonicalIndexable(entry: ContentEntry): boolean {
  return isContentIndexable(entry) && isSelfCanonical(entry);
}
