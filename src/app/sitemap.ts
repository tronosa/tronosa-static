import type { MetadataRoute } from "next";

import { getPublishedContent } from "@/lib/content/registry";
import { getEnvironment } from "@/lib/environment";

import { getLanguageAlternates } from "@/lib/seo/alternates";
import { isCanonicalIndexable } from "@/lib/seo/indexability";
import { getContentUrl } from "@/lib/seo/urls";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!getEnvironment().isIndexable) {
    return [];
  }

  return getPublishedContent()
    .filter(isCanonicalIndexable)
    .map((entry) => {
      const modifiedAt = entry.data.modifiedAt;

      return {
        url: getContentUrl(entry),

        ...(modifiedAt && {
          lastModified: new Date(modifiedAt),
        }),

        alternates: {
          languages: getLanguageAlternates(entry),
        },
      };
    });
}
