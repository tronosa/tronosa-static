import type { Metadata } from "next";

import { localeConfig } from "@/i18n/config";
import { getEnvironment } from "@/lib/environment";
import type { ContentEntry } from "@/lib/content/registry";

import { getLanguageAlternates } from "./alternates";
import { absoluteUrl, getSeoConfig } from "./config";
import { getContentPath } from "./urls";

export function createSeoMetadata(entry: ContentEntry): Metadata {
  const config = getSeoConfig();
  const { isIndexable } = getEnvironment();
  const { seo } = entry.data;

  const isPublished =
    entry.kind === "page" || entry.data.status === "published";

  const index = isIndexable && isPublished && seo.index;
  const follow = isIndexable && isPublished && seo.follow;

  const canonicalPath = seo.canonical || getContentPath(entry);
  const canonical = new URL(absoluteUrl(canonicalPath));

  if (canonical.origin !== config.url || canonical.search || canonical.hash) {
    throw new Error(`Invalid canonical URL for ${entry.data.id}`);
  }

  const title = seo.title;
  const description = seo.description;

  const ogTitle = seo.openGraph?.title ?? title;
  const ogDescription = seo.openGraph?.description ?? description;

  const ogImage = seo.openGraph?.image;

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
    url: canonical.toString(),
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
      canonical: canonical.toString(),
      ...(isPublished &&
        seo.index &&
        !seo.canonical && {
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
