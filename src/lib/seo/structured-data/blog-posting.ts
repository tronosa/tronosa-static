import type { ContentEntry } from "@/lib/content/registry";

import { absoluteUrl, getSeoConfig } from "../config";
import { getContentUrl } from "../urls";

export function createBlogPostingSchema(
  entry: Extract<ContentEntry, { kind: "article" }>,
) {
  const url = getContentUrl(entry);
  const article = entry.data;

  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,

    mainEntityOfPage: {
      "@id": `${url}#webpage`,
    },

    headline: article.seo.title,
    description: article.seo.description,

    datePublished: article.publishedAt,
    dateModified: article.modifiedAt,

    inLanguage: entry.locale,

    author: {
      "@type": "Person",
      name: article.author.name,
      ...(article.author.url && {
        url: article.author.url,
      }),
    },

    publisher: {
      "@id": getSeoConfig().organizationId,
    },

    ...(article.preview.image && {
      image: {
        "@type": "ImageObject",
        url: absoluteUrl(article.preview.image.src),
        width: article.preview.image.width,
        height: article.preview.image.height,
      },
    }),
  };
}
