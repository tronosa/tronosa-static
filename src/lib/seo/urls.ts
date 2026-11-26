import type { Locale } from "@/i18n/config";
import type { ContentEntry } from "@/lib/content/registry";

import {
  getLocalizedPath,
  getContentPublicPath,
} from "@/lib/content/content-paths";

import { getBlogPath } from "@/lib/content/content-route.config";

import { absoluteUrl, getSeoConfig } from "./config";

export function getContentPath(entry: ContentEntry): string {
  return getContentPublicPath(entry);
}

export function getContentUrl(entry: ContentEntry): string {
  return absoluteUrl(getContentPath(entry));
}

export function getLocaleHomeUrl(locale: Locale): string {
  return absoluteUrl(getLocalizedPath(locale, "/"));
}

export function getBlogUrl(locale: Locale): string {
  return absoluteUrl(getLocalizedPath(locale, getBlogPath(locale)));
}

export function getCanonicalUrl(entry: ContentEntry): string {
  const config = getSeoConfig();

  const canonicalPath =
    entry.data.seo.canonical?.trim() || getContentPath(entry);

  const errorMessage = `Invalid canonical URL for ${entry.locale}/${entry.data.id}`;

  let canonical: URL;

  try {
    canonical = new URL(absoluteUrl(canonicalPath));
  } catch (error) {
    throw new Error(errorMessage, {
      cause: error,
    });
  }

  const siteOrigin = new URL(config.url).origin;

  if (
    canonical.origin !== siteOrigin ||
    canonical.search ||
    canonical.hash ||
    canonical.username ||
    canonical.password
  ) {
    throw new Error(errorMessage);
  }

  canonical.pathname = canonical.pathname.replace(/\/+$/, "") || "/";

  return canonical.toString();
}
