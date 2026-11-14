import type { ContentEntry } from "@/lib/content/registry";

import { getSeoConfig } from "../config";
import { getContentUrl } from "../urls";

export function createWebPageSchema(entry: ContentEntry) {
  const url = getContentUrl(entry);

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: entry.data.seo.title,
    description: entry.data.seo.description,
    inLanguage: entry.locale,

    isPartOf: {
      "@id": getSeoConfig().websiteId,
    },

    ...(entry.kind === "page" &&
      entry.data.modifiedAt && {
        dateModified: entry.data.modifiedAt,
      }),

    ...(entry.kind === "article" && {
      datePublished: entry.data.publishedAt,
      dateModified: entry.data.modifiedAt,
    }),
  };
}
