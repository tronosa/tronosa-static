import type { MetadataRoute } from "next";

import { getPublishedContent } from "@/lib/content/registry";
import { getEnvironment } from "@/lib/environment";
import { getLanguageAlternates } from "@/lib/seo/alternates";
import { getContentUrl } from "@/lib/seo/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!getEnvironment().isIndexable) {
    return [];
  }

  return getPublishedContent()
    .filter((entry) => entry.data.seo.index && !entry.data.seo.canonical)
    .map((entry) => ({
      url: getContentUrl(entry),

      ...(entry.data.modifiedAt && {
        lastModified: new Date(entry.data.modifiedAt),
      }),

      alternates: {
        languages: getLanguageAlternates(entry),
      },
    }));
}
