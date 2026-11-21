import type { MetadataRoute } from "next";

import { getEnvironment } from "@/lib/environment";
import { absoluteUrl } from "@/lib/seo/config";

export default function robots(): MetadataRoute.Robots {
  const { isIndexable } = getEnvironment();

  if (!isIndexable) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/api/",
    },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
