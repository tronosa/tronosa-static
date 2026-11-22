import type { Metadata } from "next";

import { localeConfig } from "@/i18n/config";
import { getEnvironment } from "@/lib/environment";
import type { ContentEntry } from "@/lib/content/registry";

import { getLanguageAlternates } from "./alternates";
import { absoluteUrl, getSeoConfig } from "./config";
import { getCanonicalUrl } from "./urls";

import {
  isPublished,
  isSearchIndexingAllowed,
  isCanonicalIndexable,
} from "./indexability";

export function createSeoMetadata(entry: ContentEntry): Metadata {
  const config = getSeoConfig();
  const { isIndexable } = getEnvironment();
  const { seo } = entry.data;

  const index = isSearchIndexingAllowed(entry);

  const follow = isIndexable && isPublished(entry) && seo.follow;

  const canonical = getCanonicalUrl(entry);

  const title = seo.title;
  const description = seo.description;

  const ogTitle = seo.openGraph?.title ?? title;
  const ogDescription = seo.openGraph?.description ?? description;

  const ogImage =
    seo.openGraph?.image ??
    (entry.kind === "article" ? entry.data.preview.image : undefined);

  const images = ogImage
    ? [
        {
          url: absoluteUrl(ogImage.src),
          width: ogImage.width,
          height: ogImage.height,
          alt: ogImage.alt,
        },
      ]
    : [];

  const openGraph = {
    title: ogTitle,
    description: ogDescription,
    url: canonical,
    siteName: config.name,
    locale: localeConfig[entry.locale].openGraphLocale,
    images,
  };

  return {
    metadataBase: new URL(config.url),

    title,
    description,
    applicationName: config.name,

    alternates: {
      canonical,

      ...(index &&
        isCanonicalIndexable(entry) && {
          languages: getLanguageAlternates(entry),
        }),
    },

    robots: {
      index,
      follow,
      googleBot: {
        index,
        follow,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph:
      entry.kind === "article"
        ? {
            ...openGraph,
            type: "article",
            publishedTime: entry.data.publishedAt,
            modifiedTime: entry.data.modifiedAt,
            authors: [entry.data.author.name],
          }
        : {
            ...openGraph,
            type: "website",
          },

    twitter: {
      card: seo.twitter?.card ?? (ogImage ? "summary_large_image" : "summary"),
      title: ogTitle,
      description: ogDescription,
      ...(ogImage && {
        images: [absoluteUrl(ogImage.src)],
      }),
    },
  };
}
