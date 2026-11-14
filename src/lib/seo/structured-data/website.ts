import { locales } from "@/i18n/config";

import { getSeoConfig } from "../config";

export function createWebsiteSchema() {
  return {
    "@type": "WebSite",
    "@id": getSeoConfig().websiteId,
    url: getSeoConfig().url,
    name: getSeoConfig().name,
    inLanguage: [...locales],
    publisher: {
      "@id": getSeoConfig().organizationId,
    },
  };
}
